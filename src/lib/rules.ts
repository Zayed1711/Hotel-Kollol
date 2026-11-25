// Booking rules with no imports, so `npm test` can run them straight from TypeScript.

// shortcut: 15% VAT + 10% service charge and a 30% deposit are assumptions; confirm with the hotel.
export const VAT = 0.15;
export const SERVICE = 0.1;
export const DEPOSIT = 0.3;
export const HOLD_MINUTES = 15;
export const MAX_NIGHTS = 30;
export const PAYMENT_METHODS = ["bKash", "Nagad", "Card"] as const;

const DAY = 86_400_000;
const toMs = (d: string) => Date.parse(`${d}T00:00:00Z`);

/** Today's date (YYYY-MM-DD) in Cox's Bazar. */
export const todayDhaka = (now = new Date()) => now.toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });

export const addDays = (d: string, n: number) => new Date(toMs(d) + n * DAY).toISOString().slice(0, 10);

export const isDate = (d: unknown): d is string =>
  typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d) && new Date(toMs(d)).toISOString().slice(0, 10) === d;

export const nightsBetween = (checkin: string, checkout: string) => Math.round((toMs(checkout) - toMs(checkin)) / DAY);

/** Why a stay can't be searched, or null when the dates are fine. */
export function stayError(checkin: unknown, checkout: unknown, today = todayDhaka()): string | null {
  if (!isDate(checkin) || !isDate(checkout)) return "Choose your check-in and check-out dates.";
  if (checkin < today) return "Check-in can't be in the past.";
  const nights = nightsBetween(checkin, checkout);
  if (nights < 1) return "Check-out must be after check-in.";
  if (nights > MAX_NIGHTS) return `Stays online are up to ${MAX_NIGHTS} nights. Message us for longer stays.`;
  return null;
}

/**
 * Rooms still free for the whole stay: the allotment minus the busiest night.
 * `taken` are other bookings' [checkin, checkout) ranges that overlap or not.
 */
export function roomsLeft(allotment: number, checkin: string, checkout: string, taken: { checkin: string; checkout: string }[]) {
  let busiest = 0;
  for (let night = checkin; night < checkout; night = addDays(night, 1)) {
    const used = taken.filter((b) => b.checkin <= night && night < b.checkout).length;
    busiest = Math.max(busiest, used);
  }
  return Math.max(0, allotment - busiest);
}

export function quote(rate: number, nights: number) {
  const room = rate * nights;
  const service = Math.round(room * SERVICE);
  const vat = Math.round((room + service) * VAT); // VAT applies on top of the service charge
  const total = room + service + vat;
  const deposit = Math.round(total * DEPOSIT);
  return { nights, rate, room, service, vat, total, deposit, balance: total - deposit };
}

/** Bangladeshi mobile number to +8801XXXXXXXXX, or null. */
export function normalisePhone(raw: string) {
  const digits = raw.replace(/[\s()-]/g, "").replace(/^\+?88/, "");
  return /^01[3-9]\d{8}$/.test(digits) ? `+88${digits}` : null;
}
