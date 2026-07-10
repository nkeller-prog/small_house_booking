import Link from "next/link";
import { format, parseISO } from "date-fns";
import { SPOTS } from "@/lib/spots";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ spot?: string; date?: string }>;
}) {
  const { spot, date } = await searchParams;
  const spotInfo = SPOTS.find((s) => s.id === spot);
  const isValidDate = !!date && /^\d{4}-\d{2}-\d{2}$/.test(date);

  if (!spotInfo || !isValidDate) {
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm">
          <p className="text-red-600">That booking link looks invalid.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-brand-gray underline">
            Back to calendar
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm">
        <Link href="/" className="text-sm text-brand-gray underline">
          &larr; Back to calendar
        </Link>
        <h1 className="mt-4 mb-1 text-xl font-semibold">Book the {spotInfo.label}</h1>
        <p className="mb-6 text-brand-gray">{format(parseISO(date), "EEEE, MMMM d")}</p>
        <BookingForm spot={spotInfo.id} date={date} />
      </div>
    </main>
  );
}
