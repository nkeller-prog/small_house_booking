export const SPOTS = [
  { id: "big_bed", label: "Single Bed" },
  { id: "bunk_top", label: "Bunk Bed — Top" },
  { id: "bunk_bottom", label: "Bunk Bed — Bottom" },
] as const;

export type SpotId = (typeof SPOTS)[number]["id"];

export const SPOT_IDS = SPOTS.map((s) => s.id) as [SpotId, ...SpotId[]];

export function spotLabel(spot: SpotId | string): string {
  return SPOTS.find((s) => s.id === spot)?.label ?? spot;
}

export const UPCOMING_DAYS = 21;
