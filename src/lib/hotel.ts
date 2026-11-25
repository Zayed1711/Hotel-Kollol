// Pick the hotel this build shows: one line. Profiles live in src/hotels/ (your-hotel.ts is the white-label demo).
export * from "@/hotels/white-orchid";

export type Room = {
  id: string; // keep "deluxe" and "super-deluxe": bookings and the demo recorder use them
  name: string;
  word: string; // the giant word behind the stage
  tagline: string;
  view: string;
  count: number;
  fromBdt: number;
  maxGuests: number;
  allotment: number; // rooms sold on this site; the rest stay with OTAs and the front desk
  photo: string;
  bg: string;
  text: string;
};

export const bdt = (n: number) => `৳${n.toLocaleString("en-IN")}`;
