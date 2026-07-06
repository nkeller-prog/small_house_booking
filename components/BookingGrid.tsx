import Link from "next/link";
import { format, parseISO } from "date-fns";
import { SPOTS } from "@/lib/spots";
import BookedCell from "./BookedCell";

export default function BookingGrid({
  dates,
  bookingMap,
}: {
  dates: string[];
  bookingMap: Record<string, string>;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-50 text-left">
            <th className="p-2 whitespace-nowrap font-bold text-brand-gray">Date</th>
            {SPOTS.map((spot) => (
              <th key={spot.id} className="p-2 whitespace-nowrap font-bold text-brand-gray">
                {spot.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dates.map((date) => (
            <tr key={date} className="border-t border-zinc-200/70">
              <td className="p-2 whitespace-nowrap text-brand-gray">
                {format(parseISO(date), "EEE, MMM d")}
              </td>
              {SPOTS.map((spot) => {
                const bookedBy = bookingMap[`${spot.id}|${date}`];
                return (
                  <td key={spot.id} className="p-2">
                    {bookedBy ? (
                      <BookedCell spot={spot.id} date={date} bookedByName={bookedBy} />
                    ) : (
                      <Link
                        href={`/book?spot=${spot.id}&date=${date}`}
                        className="inline-block rounded bg-brand-green/25 px-2 py-1 font-medium text-green-900 hover:bg-brand-green/40"
                      >
                        Available
                      </Link>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
