import { Resend } from "resend";
import { format, parseISO } from "date-fns";
import { spotLabel, type SpotId } from "./spots";
import { HOUSE_CARE_INSTRUCTIONS } from "./house-care-instructions";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY environment variable");
  return new Resend(apiKey);
}

function getEmailFrom() {
  return process.env.EMAIL_FROM ?? "Fab House <onboarding@resend.dev>";
}

function formatDate(date: string) {
  return format(parseISO(date), "EEEE, MMMM d, yyyy");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendBookingConfirmation({
  to,
  name,
  spot,
  date,
  cancelUrl,
}: {
  to: string;
  name: string;
  spot: SpotId | string;
  date: string;
  cancelUrl: string;
}) {
  const resend = getResendClient();
  const rulesHtml = HOUSE_CARE_INSTRUCTIONS.rules
    .map((rule) => `<li>${escapeHtml(rule)}</li>`)
    .join("");

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>You're booked!</h2>
      <p>Hi ${escapeHtml(name)}, you're confirmed for:</p>
      <p><strong>${escapeHtml(spotLabel(spot))}</strong><br />${formatDate(date)}</p>
      <h3>House care instructions</h3>
      <p>${escapeHtml(HOUSE_CARE_INSTRUCTIONS.greeting)}</p>
      <p>Checkout time: <strong>${escapeHtml(HOUSE_CARE_INSTRUCTIONS.checkoutTime)}</strong></p>
      <ul>${rulesHtml}</ul>
      <p>${escapeHtml(HOUSE_CARE_INSTRUCTIONS.closingNote)}</p>
      <p style="margin-top: 24px; font-size: 13px; color: #666;">
        Plans changed? <a href="${cancelUrl}">Cancel this booking</a>
      </p>
    </div>
  `;

  await resend.emails.send({
    from: getEmailFrom(),
    to,
    subject: `Booking confirmed: ${spotLabel(spot)} on ${formatDate(date)}`,
    html,
  });
}

export async function sendCancellationConfirmation({
  to,
  spot,
  date,
}: {
  to: string;
  spot: SpotId | string;
  date: string;
}) {
  const resend = getResendClient();
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Booking cancelled</h2>
      <p>Your booking for <strong>${escapeHtml(spotLabel(spot))}</strong> on ${formatDate(date)} has been cancelled. The spot is now open for someone else.</p>
    </div>
  `;

  await resend.emails.send({
    from: getEmailFrom(),
    to,
    subject: `Booking cancelled: ${spotLabel(spot)} on ${formatDate(date)}`,
    html,
  });
}
