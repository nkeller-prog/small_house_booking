import { format, addDays, startOfDay } from "date-fns";
import { getSupabaseServerClient } from "@/lib/supabase";
import { UPCOMING_DAYS } from "@/lib/spots";
import BookingGrid from "@/components/BookingGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const today = startOfDay(new Date());
  const dates = Array.from({ length: UPCOMING_DAYS }, (_, i) =>
    format(addDays(today, i), "yyyy-MM-dd"),
  );

  const bookingMap: Record<string, string> = {};
  let loadError = false;
  try {
    const supabase = getSupabaseServerClient();
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("spot, booking_date, name")
      .is("cancelled_at", null)
      .gte("booking_date", dates[0])
      .lte("booking_date", dates[dates.length - 1]);

    if (error) throw error;

    for (const booking of bookings ?? []) {
      bookingMap[`${booking.spot}|${booking.booking_date}`] = booking.name;
    }
  } catch (err) {
    console.error("Failed to load bookings", err);
    loadError = true;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-1 text-3xl font-extrabold text-brand-blue">Atomic House Booking</h1>
      <p className="mb-6 text-brand-gray">Pick a spot and a night to reserve your stay.</p>
      {loadError ? (
        <p className="text-red-600">
          Couldn&apos;t load the calendar right now. Please refresh the page.
        </p>
      ) : (
        <BookingGrid dates={dates} bookingMap={bookingMap} />
      )}
    </main>
  );
}
