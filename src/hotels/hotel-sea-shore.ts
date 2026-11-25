// Hotel Sea Shore, Marine Drive, Kolatoli, Cox's Bazar. Facts from their Google Maps and Expedia/Hotels.com listings (Nov 2026).
// Photos: the building front is the hotel's own Google Maps cover; rooms are the hotel's Expedia photos;
// beach scenes are free Unsplash images (unsplash.com/license) of Cox's Bazar, not of the hotel.
// shortcut: room names (except the sea-view double), counts, rates and offers are samples; swap in theirs when they reply.
import type { Front, Room, Theme } from "@/lib/hotel";

const x = (id: string) => `https://images.trvl-media.com/lodging/130000000/129770000/129762600/129762546/${id}.jpg?impolicy=resizecrop&rw=1200`;
const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=75&auto=format&fit=crop`;
const P = {
  front: "https://lh3.googleusercontent.com/grass-cs/AABkmLcnHHA1dUhPtO_pkX6MpDKz0jxUqrZupywo46NdrJqrE3tIM9ix_A4J5M3FFxroc7hyg0vEqsFUIRefX_x4TXRM_nWWwi4qGXDG0mVWLfvKcMPXBU4R5TnPeVnQdzMLA_ToTzCxnyzAGIY=w720-h1280-k-no",
  double: x("a348f0fe"),
  seaDouble: x("f0ff7d01"),
  family: x("24fa7e3b"),
  lounge: x("45c3320b"),
  window: x("cf3ae99d"),
  beach: u("1619177383949-f03975e50b19"),
  sunset: u("1684153815450-aea8170e18f5"),
  boats: u("1738858462298-b7ce2539b387"),
};

export const HOTEL = {
  name: "Hotel Sea Shore",
  place: "Marine Drive, Cox's Bazar",
  legal: "Hotel Sea Shore",
  facilities: "air-conditioned rooms, free high-speed Wi-Fi (100+ Mbps), daily housekeeping, 24/7 front desk",
  note: "Demo website. Room rates and offers are samples.",
};

// shortcut: no public email found; the footer hides the email line while this is empty.
export const CONTACT = {
  address: "Marine Drive, Kolatoli, Cox's Bazar",
  email: "",
  sales: "",
  hotline: "+880 1842-311285",
  whatsapp: "8801842311285",
};

export const POLICIES: Record<string, string> = {
  "check-in and check-out times": "Check-in is from 2:00 pm and check-out is by 10:30 am.",
  "what's included with breakfast": "Breakfast isn't included in the room rate, and there are plenty of places to eat along Marine Drive.",
  parking: "We don't have parking on site.",
  "the pet policy": "Sorry, pets aren't allowed at the hotel.",
  "airport transfers": "We don't run an airport shuttle; the airport is about a 20-minute drive away.",
};

export const FACTS = [
  ["20", "air-conditioned rooms"],
  ["1 min", "walk to Kolatoli Beach"],
  ["24/7", "front desk"],
  ["100+", "Mbps free Wi-Fi"],
];

export const ROOMS: Room[] = [
  {
    id: "deluxe",
    name: "Deluxe Double",
    word: "Rest",
    tagline: "A queen bed, cool air and a quiet night, one minute from the sand.",
    view: "City side",
    count: 8,
    maxGuests: 2,
    allotment: 3,
    fromBdt: 5500,
    photo: P.double,
    bg: "#13263a",
    text: "#f3e3c3",
  },
  {
    id: "super-deluxe",
    name: "Deluxe Double, Sea View",
    word: "Waves",
    tagline: "Wake up to the Bay of Bengal. Our most asked-for room.",
    view: "Sea view",
    count: 8,
    maxGuests: 2,
    allotment: 3,
    fromBdt: 7500,
    photo: P.seaDouble,
    bg: "#0f3b57",
    text: "#f6ead2",
  },
  {
    id: "family-room",
    name: "Family Room",
    word: "Together",
    tagline: "Room for the whole family after a long day on the beach.",
    view: "City side",
    count: 3,
    maxGuests: 3,
    allotment: 1,
    fromBdt: 8500,
    photo: P.family,
    bg: "#5a3a2e",
    text: "#f8eadb",
  },
  {
    id: "sea-shore-suite",
    name: "Sea Shore Suite",
    word: "Shore",
    tagline: "A separate sitting room with a sofa and TV, and a bedroom to come back to.",
    view: "Sitting room and bedroom",
    count: 1,
    maxGuests: 4,
    allotment: 1,
    fromBdt: 11000,
    photo: P.lounge,
    bg: "#0b1424",
    text: "#f3c784",
  },
];

export const STORY = [
  { word: "Step out", title: "One minute to Kolatoli Beach", text: "Cross Marine Drive and your feet are in the sand.", photo: P.beach, bg: "#e3ecf1" },
  { word: "Rest", title: "20 cool, quiet rooms", text: "Air-conditioned, freshly made every day, with fast Wi-Fi for the photos you'll want to share.", photo: P.seaDouble, bg: "#ecebe6" },
  { word: "Unwind", title: "Space to spread out", text: "Our suite has its own sitting room for tea, cards and lazy afternoons.", photo: P.lounge, bg: "#efe6da" },
  { word: "Sunset", title: "The longest beach, right outside", text: "Walk out at golden hour and watch the sun go down over the bay.", photo: P.sunset, bg: "#f1e4d4" },
];
export const FINALE_PHOTO = P.boats;

// No restaurant listed; the Dining section hides when this is empty.
export const DINING: { name: string; kind: string; photo: string }[] = [];
export const HALLS: { name: string; capacity: string; use: string; photo: string }[] = [];

export const OFFERS = [
  {
    name: "Beach Weekend",
    price: "৳13,999",
    unit: "3 days, 2 nights",
    points: ["Deluxe Double with sea view", "Daily housekeeping","One minute to the beach"],
    photo: P.seaDouble,
  },
  {
    name: "Family Stay",
    price: "৳15,999",
    unit: "3 days, 2 nights",
    points: ["Family Room for three", "Free high-speed Wi-Fi", "24/7 front desk help"],
    photo: P.family,
  },
];

// Night by the sea: midnight blue and the warm amber of the sign over the door.
export const THEME: Theme = {
  serif: "cormorant",
  paper: "#f6f7f8",
  sand: "#e3ecf1",
  ink: "#0e1a26",
  accent: "#0f3b57",
  accentDark: "#0b2d43",
  onAccent: "#f3e3c3",
  deep: "#0b1424",
  deepText: "#f3c784",
  warm: "#c27a1e",
};

export const FRONT: Front = {
  photo: P.front,
  eyebrow: "Marine Drive · Kolatoli · Cox's Bazar",
  title: "Your light by the sea.",
  text: "A small hotel one minute from Kolatoli Beach, with 20 cool rooms, fast Wi-Fi and a front desk that's always awake.",
};
