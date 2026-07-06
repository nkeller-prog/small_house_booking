"use client";

import { useState } from "react";
import { removeMyBookingByToken } from "@/lib/my-bookings";

type Status = "idle" | "submitting" | "done" | "error";

export default function CancelButton({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCancel() {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setStatus("error");
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      removeMyBookingByToken(token);
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (status === "done") {
    return <p className="text-green-700">Your booking has been cancelled. The spot is now available again.</p>;
  }

  return (
    <div>
      <button
        onClick={handleCancel}
        disabled={status === "submitting"}
        className="rounded bg-brand-pink px-4 py-2 font-medium text-pink-950 hover:brightness-95 disabled:opacity-50"
      >
        {status === "submitting" ? "Cancelling..." : "Cancel this booking"}
      </button>
      {status === "error" && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}
