import Link from "next/link";
import { format, parseISO } from "date-fns";
import { getSupabaseServerClient } from "@/lib/supabase";
import { spotLabel } from "@/lib/spots";
import CancelButton from "@/components/CancelButton";

export const dynamic = "force-dynamic";

export default async function CancelPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <p className="text-red-600">That cancellation link looks invalid.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-brand-gray underline">
          Back to calendar
        </Link>
      </main>
    );
  }

  let booking: { spot: string; booking_date: string; cancelled_at: string | null } | null = null;
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("spot, booking_date, cancelled_at")
      .eq("cancel_token", token)
      .maybeSingle();
    if (error) throw error;
    booking = data;
  } catch (err) {
    console.error("Failed to load booking for cancellation", err);
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <p className="text-red-600">Couldn&apos;t load this booking right now. Please refresh the page.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-brand-gray underline">
          Back to calendar
        </Link>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <p className="text-red-600">We couldn&apos;t find that booking.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-brand-gray underline">
          Back to calendar
        </Link>
      </main>
    );
  }

  if (booking.cancelled_at) {
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <p className="text-brand-gray">This booking has already been cancelled.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-brand-gray underline">
          Back to calendar
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-1 text-xl font-semibold">Cancel booking</h1>
      <p className="mb-6 text-brand-gray">
        {spotLabel(booking.spot)} on {format(parseISO(booking.booking_date), "EEEE, MMMM d, yyyy")}
      </p>
      <CancelButton token={token} />
    </main>
  );
}
