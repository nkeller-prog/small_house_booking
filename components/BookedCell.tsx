"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { findMyBooking, removeMyBookingByToken } from "@/lib/my-bookings";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot() {
  return null;
}

export default function BookedCell({
  spot,
  date,
  bookedByName,
}: {
  spot: string;
  date: string;
  bookedByName: string;
}) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);

  const myToken = useSyncExternalStore(
    subscribe,
    () => findMyBooking(spot, date)?.cancelToken ?? null,
    getServerSnapshot,
  );

  async function handleCancel() {
    if (!myToken) return;
    if (!window.confirm("Cancel this booking?")) return;

    setCancelling(true);
    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: myToken }),
      });
      if (res.ok) {
        removeMyBookingByToken(myToken);
        router.refresh();
      } else {
        setCancelling(false);
      }
    } catch {
      setCancelling(false);
    }
  }

  if (myToken) {
    return (
      <button
        onClick={handleCancel}
        disabled={cancelling}
        className="inline-block rounded bg-brand-pink/25 px-2 py-1 text-pink-900 hover:bg-brand-pink/40 disabled:opacity-50"
      >
        {cancelling ? "Cancelling..." : "Cancel your booking"}
      </button>
    );
  }

  return (
    <span className="inline-block rounded bg-zinc-100 px-2 py-1 text-brand-gray">
      Booked by {bookedByName}
    </span>
  );
}
