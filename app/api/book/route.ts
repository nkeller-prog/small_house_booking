import { NextResponse } from "next/server";
import { bookingRequestSchema, isAllowedEmail, ALLOWED_EMAIL_DOMAIN } from "@/lib/validation";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendBookingConfirmation } from "@/lib/email";
import { startOfDay } from "date-fns";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const { name, email, spot, date } = parsed.data;

  if (!isAllowedEmail(email)) {
    return NextResponse.json(
      { error: `Please use your @${ALLOWED_EMAIL_DOMAIN} email address.` },
      { status: 400 },
    );
  }

  if (new Date(date) < startOfDay(new Date())) {
    return NextResponse.json({ error: "That date has already passed." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({ name, email, spot, booking_date: date })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "That spot is already booked for that night." },
        { status: 409 },
      );
    }
    console.error("Failed to insert booking", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  try {
    const cancelUrl = new URL(`/cancel?token=${booking.cancel_token}`, request.url).toString();
    await sendBookingConfirmation({
      to: booking.email,
      name: booking.name,
      spot: booking.spot,
      date: booking.booking_date,
      cancelUrl,
    });
  } catch (emailError) {
    console.error("Failed to send booking confirmation email", emailError);
  }

  return NextResponse.json({ success: true, cancelToken: booking.cancel_token });
}
