const STORAGE_KEY = "myBookings";

export type MyBooking = { spot: string; date: string; cancelToken: string };

export function getMyBookings(): MyBooking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function findMyBooking(spot: string, date: string): MyBooking | undefined {
  return getMyBookings().find((b) => b.spot === spot && b.date === date);
}

export function saveMyBooking(booking: MyBooking) {
  const existing = getMyBookings().filter(
    (b) => !(b.spot === booking.spot && b.date === booking.date),
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, booking]));
}

export function removeMyBookingByToken(token: string) {
  const existing = getMyBookings();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing.filter((b) => b.cancelToken !== token)),
  );
}
