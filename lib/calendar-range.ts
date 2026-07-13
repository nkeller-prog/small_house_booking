import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
} from "date-fns";

export type ViewMode = "week" | "month";

export function parseViewMode(value: string | undefined): ViewMode {
  return value === "month" ? "month" : "week";
}

export function parseAnchor(value: string | undefined): Date {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export function getRangeDates(view: ViewMode, anchor: Date): string[] {
  const start = view === "week" ? anchor : startOfMonth(anchor);
  const end = view === "week" ? addDays(anchor, 6) : endOfMonth(anchor);
  return eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"));
}

export function getAdjacentAnchor(view: ViewMode, anchor: Date, direction: 1 | -1): string {
  const next = view === "week" ? addWeeks(anchor, direction) : addMonths(anchor, direction);
  return format(next, "yyyy-MM-dd");
}

export function getRangeLabel(view: ViewMode, anchor: Date): string {
  if (view === "month") return format(anchor, "MMMM yyyy");
  const end = addDays(anchor, 6);
  return `${format(anchor, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}
