import Link from "next/link";
import { format, startOfDay } from "date-fns";
import { getSupabaseServerClient } from "@/lib/supabase";
import {
  getAdjacentAnchor,
  getRangeDates,
  getRangeLabel,
  parseAnchor,
  parseViewMode,
} from "@/lib/calendar-range";
import BookingGrid from "@/components/BookingGrid";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; anchor?: string }>;
}) {
  const params = await searchParams;
  const view = parseViewMode(params.view);
  const anchor = parseAnchor(params.anchor);
  const anchorParam = format(anchor, "yyyy-MM-dd");
  const dates = getRangeDates(view, anchor);
  const today = format(startOfDay(new Date()), "yyyy-MM-dd");

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

  const prevAnchor = getAdjacentAnchor(view, anchor, -1);
  const nextAnchor = getAdjacentAnchor(view, anchor, 1);

  return (
    <>
      <header className="w-full bg-white/60 px-4 py-4 backdrop-blur-sm sm:px-8">
        <h1 className="mb-1 text-3xl font-extrabold text-brand-blue">Fab 2 House</h1>
        <p className="mb-4 text-brand-gray">Choose a bed and a night to reserve your stay.</p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 text-sm">
            <Link
              href={`/?view=week&anchor=${anchorParam}`}
              className={`rounded px-3 py-1 ${view === "week" ? "bg-brand-blue/25 font-medium text-blue-950" : "text-brand-gray hover:underline"}`}
            >
              Week
            </Link>
            <Link
              href={`/?view=month&anchor=${anchorParam}`}
              className={`rounded px-3 py-1 ${view === "month" ? "bg-brand-blue/25 font-medium text-blue-950" : "text-brand-gray hover:underline"}`}
            >
              Month
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href={`/?view=${view}&anchor=${prevAnchor}`} className="text-brand-gray hover:underline">
              &larr; Prev
            </Link>
            <span className="font-medium">{getRangeLabel(view, anchor)}</span>
            <Link href={`/?view=${view}&anchor=${nextAnchor}`} className="text-brand-gray hover:underline">
              Next &rarr;
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-8">
        {loadError ? (
          <p className="text-red-600">
            Couldn&apos;t load the calendar right now. Please refresh the page.
          </p>
        ) : (
          <BookingGrid dates={dates} bookingMap={bookingMap} today={today} />
        )}
      </main>
    </>
  );
}
