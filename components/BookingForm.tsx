"use client";

import { useState, type FormEvent } from "react";
import { saveMyBooking } from "@/lib/my-bookings";

type Status = "idle" | "submitting" | "success" | "error";

export default function BookingForm({ spot, date }: { spot: string; date: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, spot, date }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (data?.cancelToken) {
        saveMyBooking({ spot, date, cancelToken: data.cancelToken });
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-brand-green/40 bg-brand-green/15 p-4 text-green-900">
        <p className="font-medium">You&apos;re booked!</p>
        <p className="mt-1 text-sm">
          Check your email for a confirmation with house care instructions and a link to cancel if
          plans change.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-brand-gray" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-brand-gray" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@atomicsemi.com"
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>
      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded bg-brand-blue px-4 py-2 font-medium text-blue-950 hover:brightness-95 disabled:opacity-50"
      >
        {status === "submitting" ? "Booking..." : "Confirm booking"}
      </button>
    </form>
  );
}
