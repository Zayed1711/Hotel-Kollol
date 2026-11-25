// Which hotel this build shows. Profiles live in src/hotels/; set NEXT_PUBLIC_HOTEL to a key below
// (the GitHub Pages workflow derives it from the repo name, e.g. White_Orchid → white-orchid).
import * as hotelKollol from "@/hotels/hotel-kollol";
import * as hotelSeaShore from "@/hotels/hotel-sea-shore";
import * as whiteOrchid from "@/hotels/white-orchid";
import * as yourHotel from "@/hotels/your-hotel";

const PROFILES = { "white-orchid": whiteOrchid, "hotel-sea-shore": hotelSeaShore, "hotel-kollol": hotelKollol, "your-hotel": yourHotel };
const key = process.env.NEXT_PUBLIC_HOTEL || "white-orchid";
if (!(key in PROFILES)) throw new Error(`NEXT_PUBLIC_HOTEL="${key}" is not one of: ${Object.keys(PROFILES).join(", ")}`);
const P: Profile = PROFILES[key as keyof typeof PROFILES];

export const { HOTEL, CONTACT, POLICIES, FACTS, ROOMS, STORY, FINALE_PHOTO, DINING, HALLS, OFFERS, THEME, FRONT } = P;

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

/** Site colours and headline font. Every colour the components use comes from here. */
export type Theme = {
  serif: "fraunces" | "cormorant" | "dm-serif";
  paper: string; // page background
  sand: string; // soft panels
  ink: string; // body text
  accent: string; // buttons and highlights, white text sits on it
  accentDark: string;
  onAccent: string; // text on the footer (accent background)
  deep: string; // dark sections (dining, chat header)
  deepText: string;
  warm: string; // italic highlights
};

/** A building-front photo shown first, before the rooms. */
export type Front = { photo: string; eyebrow: string; title: string; text: string } | null;

type Profile = {
  HOTEL: { name: string; place: string; legal: string; facilities: string; note: string };
  CONTACT: { address: string; email: string; sales: string; hotline: string; whatsapp: string };
  POLICIES: Record<string, string>;
  FACTS: string[][];
  ROOMS: Room[];
  STORY: { word: string; title: string; text: string; photo: string; bg: string }[];
  FINALE_PHOTO: string;
  DINING: { name: string; kind: string; photo: string }[];
  HALLS: { name: string; capacity: string; use: string; photo: string }[];
  OFFERS: { name: string; price: string; unit: string; points: string[]; photo: string }[];
  THEME: Theme;
  FRONT: Front;
};

export const bdt = (n: number) => `৳${n.toLocaleString("en-IN")}`;
