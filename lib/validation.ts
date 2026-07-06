import { z } from "zod";
import { SPOT_IDS } from "./spots";

export const ALLOWED_EMAIL_DOMAIN = (
  process.env.ALLOWED_EMAIL_DOMAIN ?? "atomicsemi.com"
).toLowerCase();

export function isAllowedEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`);
}

export const bookingRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  spot: z.enum(SPOT_IDS),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
});

export const cancelRequestSchema = z.object({
  token: z.string().uuid("Invalid cancellation link"),
});
