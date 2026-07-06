const STORAGE_KEY = "myBookings";
const NAME_STORAGE_KEY = "myName";

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

export function getMyName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NAME_STORAGE_KEY) ?? "";
}

export function saveMyName(name: string) {
  localStorage.setItem(NAME_STORAGE_KEY, name);
}
