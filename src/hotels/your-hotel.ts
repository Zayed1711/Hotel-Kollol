// One white-label demo hotel for pitching any Cox's Bazar hotel. Everything hotel-specific lives in this file.
import type { Front, Room, Theme } from "@/lib/hotel";

// Photos are free Unsplash images (unsplash.com/license). The Seagull version is in hotel.seagull.ts.bak.
const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=75&auto=format&fit=crop`;

export const HOTEL = {
  name: "Your Hotel",
  place: "Cox's Bazar",
  legal: "Your Hotel Ltd.",
  facilities: "swimming pool, rooftop café, kids' corner, free Wi-Fi",
  note: "", // shown in the footer when set
};

// shortcut: placeholder contact details on purpose; the video shows where the hotel's own lines go.
export const CONTACT = {
  address: "Cox's Bazar",
  email: "reservations@yourhotel.com",
  sales: "sales@yourhotel.com",
  hotline: "+880 1XXX-XXXXXX",
  whatsapp: "8801000000000",
};

// What the chat bot may answer directly, keyed by the topic labels in api/chat/route.ts. Unlisted topics go to the front desk.
export const POLICIES: Record<string, string> = {};

export const FACTS = [
  ["72", "rooms and suites"],
  ["3", "places to eat"],
  ["300", "guests in the banquet hall"],
  ["2 min", "walk to the beach"],
];

// Typical mid-range Cox's Bazar rates, for the demo only.
export const ROOMS: Room[] = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    word: "Unwind",
    tagline: "Calm, clean and comfortable, a short walk from the sea.",
    view: "City or hill side",
    count: 40,
    maxGuests: 2,
    allotment: 10,
    fromBdt: 4500,
    photo: u("1611892440504-42a792e24d32"),
    bg: "#2f6f73",
    text: "#f4efe6",
  },
  {
    id: "super-deluxe",
    name: "Super Deluxe Room",
    word: "Seaside",
    tagline: "Bright and roomy with a view of the bay. Made for families and friends.",
    view: "Sea view",
    count: 20,
    maxGuests: 3,
    allotment: 6,
    fromBdt: 6500,
    photo: u("1779870458288-95fd59cd2c5b"),
    bg: "#9c5f36",
    text: "#fbf6ee",
  },
  {
    id: "executive-suite",
    name: "Executive Suite",
    word: "Balcony",
    tagline: "Wake up to the sea from your own balcony, with a sitting area to come back to.",
    view: "Sea-facing balcony",
    count: 10,
    maxGuests: 3,
    allotment: 3,
    fromBdt: 9500,
    photo: u("1793963050214-4e7a9468c709"),
    bg: "#a34a3f",
    text: "#fbf3ec",
  },
  {
    id: "ocean-suite",
    name: "Ocean Suite",
    word: "Panorama",
    tagline: "Our finest suite: a private living room and wide views over the bay.",
    view: "Panoramic ocean view",
    count: 2,
    maxGuests: 4,
    allotment: 1,
    fromBdt: 16000,
    photo: u("1644589381769-0f5374a52720"),
    bg: "#1f2c45",
    text: "#efe4cf",
  },
];

export const STORY = [
  { word: "Arrive", title: "A short walk from the beach", text: "In the heart of Cox's Bazar. Airport pickup on request.", photo: u("1621293954908-907159247fc8"), bg: "#ece6da" },
  { word: "Rest", title: "72 rooms, many facing the sea", text: "From Deluxe rooms to the Ocean Suite, every stay starts with a good night's sleep.", photo: u("1618773928121-c32242e63f39"), bg: "#e4e9e6" },
  { word: "Savour", title: "Three places to eat", text: "Fresh seafood and Bengali classics, coffee on the roof, BBQ by the pool.", photo: u("1559339352-11d035aa65de"), bg: "#eee3d9" },
  { word: "Swim", title: "A pool to cool off after the beach", text: "Swim, then relax on the deck. The kids' corner is a few steps away.", photo: u("1582719508461-905c673771fd"), bg: "#e0e8ec" },
];
export const FINALE_PHOTO = u("1721617864119-611e4544ff07");

export const DINING = [
  { name: "The Sea Table", kind: "Bengali, Chinese & Indian", photo: u("1552566626-52f8b828add9") },
  { name: "Rooftop Café", kind: "Coffee & snacks", photo: u("1770739538932-433941c1267e") },
  { name: "Poolside BBQ", kind: "Evening BBQ", photo: u("1555939594-58d7cb561ad1") },
  { name: "Sunset Terrace", kind: "Sea-view seating", photo: u("1609602126247-4ab7188b4aa1") },
];

export const HALLS = [
  { name: "Banquet Hall", capacity: "Up to 300 guests", use: "Weddings, receptions, gala dinners", photo: u("1768508951405-10e83c4a2872") },
  { name: "Conference Room", capacity: "Up to 120, theatre style", use: "Conferences and seminars", photo: u("1540575467063-178a50c2df87") },
];

export const OFFERS = [
  {
    name: "Honeymoon Package",
    price: "৳11,999",
    unit: "3 days, 2 nights",
    points: ["Super Deluxe sea-view room", "Airport pickup and drop", "Candlelight dinner for two", "Daily breakfast"],
    photo: u("1776761603930-e4509e386fbf"),
  },
  {
    name: "BBQ Night",
    price: "from ৳450",
    unit: "per platter",
    points: ["Chicken, fish or beef kebab", "Salad, raita and naan", "By the pool at sunset"],
    photo: u("1508615263227-c5d58c1e5821"),
  },
];

export const THEME: Theme = {
  serif: "fraunces",
  paper: "#faf8f4",
  sand: "#ece6da",
  ink: "#1c2430",
  accent: "#2f6f73",
  accentDark: "#265c60",
  onAccent: "#f4efe6",
  deep: "#1f2c45",
  deepText: "#efe4cf",
  warm: "#b4574b",
};

export const FRONT: Front = null;
