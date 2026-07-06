import { NextResponse } from "next/server";
import { cancelRequestSchema } from "@/lib/validation";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendCancellationConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = cancelRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServerClient();
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("cancel_token", parsed.data.token)
    .is("cancelled_at", null)
    .maybeSingle();

  if (fetchError) {
    console.error("Failed to look up booking for cancellation", fetchError);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  if (!booking) {
    return NextResponse.json(
      { error: "We couldn't find that booking — it may already be cancelled." },
      { status: 404 },
    );
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ cancelled_at: new Date().toISOString() })
    .eq("id", booking.id);

  if (updateError) {
    console.error("Failed to cancel booking", updateError);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  try {
    await sendCancellationConfirmation({
      to: booking.email,
      spot: booking.spot,
      date: booking.booking_date,
    });
  } catch (emailError) {
    console.error("Failed to send cancellation confirmation email", emailError);
  }

  return NextResponse.json({ success: true });
}
