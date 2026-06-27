// FILINEX — WhatsApp helpers
// The number is intentionally NOT shown as a phone number anywhere on the public site —
// it is only used to open wa.me deep links from chat / form interactions.
export const ADMIN_WA_NUMBER = "923004269096"; // +92 300 4269096

export function waLink(text) {
  return `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function buildLeadMessage(payload) {
  const lines = [
    "🟢 *New FILINEX inquiry*",
    "",
    payload.name ? `• Name: ${payload.name}` : null,
    payload.email ? `• Email: ${payload.email}` : null,
    payload.company ? `• Company: ${payload.company}` : null,
    payload.country ? `• Country: ${payload.country}` : null,
    payload.project_type ? `• Project type: ${payload.project_type}` : null,
    payload.budget ? `• Budget: ${payload.budget}` : null,
    payload.timeline ? `• Timeline: ${payload.timeline}` : null,
    payload.source ? `• Source: ${payload.source}` : null,
    "",
    payload.message ? `*Message:*\n${payload.message}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}
