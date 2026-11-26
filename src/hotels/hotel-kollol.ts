// Hotel Kollol by J&Z Group, Laboni Point, Cox's Bazar. Facts from their Booking.com and Google Maps listings (Nov 2026).
// Photos are the hotel's own, served from their Booking.com gallery (signed URLs; they stop working if the hotel removes the photo).
// Room types and "from" rates are their Booking.com rooms and prices for 9 Dec 2026; counts and offers are samples.
import type { Front, LiveMusic, Room, Theme } from "@/lib/hotel";

const b = (path: string) => `https://cf.bstatic.com/xdata/images/hotel/max1280x900/${path}&o=`;
const P = {
  front: b("794900033.jpg?k=dff095944ba3762ae7a6837e84d4a2065f3016ee0f7f645e7a64c45acd7666be"),
  terrace: b("794899923.jpg?k=48016e716b925b2c54b5ddb5ab2956d5f33619ead5495293879a4630840c90a0"),
  pool: b("794870330.jpg?k=65c3872f96c1dc6b4fbbb04435983313120eabf8080848fc5a485f9549d18d68"),
  poolTop: b("794899883.jpg?k=6a343e52d7013b0a5bb872fbcd9ed325c6c08d3e55b24b0dcc94344c5800e240"),
  poolSide: b("794899953.jpg?k=41076e0cb1e21c0d41b4ea6a4aba4eec8ec2128cf8b957b15e31c872e61ae41a"),
  king: b("794873372.jpg?k=861446cd50d309f93fa233820bcd2199f5a346fb5a7ebbc6ac6eeb782ec534c7"),
  twin: b("759490752.jpg?k=40240d8a61958f88526d557ab5b4b144e850d42cb9e38dc445bb0549efe578eb"),
  loungers: b("794899735.jpg?k=90f7b7edab2cf4d83af28da91d39445ed47019919144da1d081bd4961f89669f"),
  boatGarden: b("794900000.jpg?k=2ea2e752cd1665cc7ecd5f7192519e1f6886b71087a40592b93a304968c21c45"),
  grill: b("794900068.jpg?k=fab8c82a569f9632e3aeff98bd1905e5c6eb3597a1d5e8c32d6460b3db93057f"),
  music: b("360104519.jpg?k=ef5cf3ebe2ddf7ffeebed4dcbfe14a7bf2f1d00697c55c5bc25475c32c8a3bc5"),
  lawnNight: b("488509733.jpg?k=e4143f39e1dd40045b001069a5b8894be33bac19399090c028fbe8046693ad30"),
};

export const HOTEL = {
  name: "Hotel Kollol",
  place: "Laboni Point, Cox's Bazar",
  legal: "Hotel Kollol by J&Z Group",
  facilities: "outdoor swimming pool open all year, pool bar, live music, fitness centre, lounge, restaurant, free Wi-Fi, free parking, airport shuttle, room service",
  note: "Demo website. Rates are indicative and offers are samples.",
};

export const CONTACT = {
  address: "Laboni Point, Sea Beach Road, Cox's Bazar",
  email: "reservation@hotelkollolbd.com",
  sales: "reservation@hotelkollolbd.com",
  hotline: "+880 1886-777711",
  whatsapp: "8801886777711",
};

export const POLICIES: Record<string, string> = {
  "check-in and check-out times": "Check-in is from 2:00 pm and check-out is by 12:00 noon.",
  parking: "Parking is free for our guests.",
  "the pet policy": "Sorry, pets aren't allowed at the hotel.",
  "airport transfers": "We offer an airport shuttle, and the airport is only about 2 km away. Our front desk will arrange it.",
};

export const FACTS = [
  ["3,855", "Google reviews"],
  ["Steps", "from Laboni Beach"],
  ["1", "outdoor pool & pool bar"],
  ["Free", "parking & Wi-Fi"],
];

export const ROOMS: Room[] = [
  {
    id: "deluxe",
    name: "Double Room, Pool View",
    word: "Splash",
    tagline: "A double bed, a balcony and the pool right below.",
    view: "Pool and garden view",
    count: 20,
    maxGuests: 2,
    allotment: 6,
    fromBdt: 5990,
    photo: P.king,
    bg: "#14432f",
    text: "#f6efd8",
  },
  {
    id: "super-deluxe",
    name: "Deluxe Double, Sea View",
    word: "Seaside",
    tagline: "An extra-large bed and a balcony looking out to the Bay of Bengal.",
    view: "Sea view balcony",
    count: 20,
    maxGuests: 2,
    allotment: 6,
    fromBdt: 6110,
    photo: P.loungers,
    bg: "#0f4f5c",
    text: "#f2f6f2",
  },
  {
    id: "family-room",
    name: "Family Room",
    word: "Family",
    tagline: "Two double beds and a balcony. Garden, pool or full sea views (sea view from ৳11,227).",
    view: "Garden, pool or sea view",
    count: 16,
    maxGuests: 4,
    allotment: 4,
    fromBdt: 6860,
    photo: P.twin,
    bg: "#8a3b1c",
    text: "#fbefdf",
  },
];

export const STORY = [
  { word: "Arrive", title: "On the beach at Laboni Point", text: "A few steps to the sand, and about 2 km from the airport. We can pick you up.", photo: P.terrace, bg: "#e8efe3" },
  { word: "Swim", title: "A pool open all year", text: "Laze by the water, grab a drink at the pool bar, then head to the beach.", photo: P.pool, bg: "#e1ecef" },
  { word: "Savour", title: "Dinner in the garden", text: "Kasundi Restaurant serves Chinese, Indian, American and Bangladeshi food, halal and vegetarian, around our boat in the garden.", photo: P.boatGarden, bg: "#efe7d6" },
  { word: "Celebrate", title: "Live music nights", text: "Songs on the boat stage and long tables under the lights.", photo: P.music, bg: "#f3e2d2" },
];
export const FINALE_PHOTO = P.lawnNight;

export const DINING = [
  { name: "Kasundi Restaurant", kind: "Chinese, Indian, American & local · halal", photo: P.boatGarden },
  { name: "From the Grill", kind: "Fresh fish over charcoal", photo: P.grill },
  { name: "Pool Bar", kind: "Drinks by the water", photo: P.poolSide },
  { name: "Live Music at Kasundi", kind: "Thu to Sat · book a table below", photo: P.music },
];

export const HALLS: { name: string; capacity: string; use: string; photo: string }[] = [];

export const OFFERS = [
  {
    name: "Family Beach Break",
    price: "৳16,999",
    unit: "3 days, 2 nights",
    points: ["Family Room for four", "Pool and pool bar", "Airport shuttle", "Free parking"],
    photo: P.poolTop,
  },
  {
    name: "Couple's Sea View",
    price: "৳14,499",
    unit: "3 days, 2 nights",
    points: ["Deluxe Double with sea-view balcony", "Dinner at Kasundi Restaurant", "Live music night"],
    photo: P.loungers,
  },
];

// Garden by the sea: their green walls, blue pool and the marigold and orange of the boat stage.
export const THEME: Theme = {
  serif: "dm-serif",
  paper: "#f7f5ee",
  sand: "#e8efe3",
  ink: "#13241c",
  accent: "#146b5a",
  accentDark: "#0f5547",
  onAccent: "#f6efd8",
  deep: "#0f2e24",
  deepText: "#f2c94c",
  warm: "#d9622b",
};

export const FRONT: Front = {
  photo: P.front,
  eyebrow: "Laboni Point · Sea Beach Road · Cox's Bazar",
  title: "Green walls, blue pool, the sea next door.",
  text: "A beachfront hotel with a pool open all year, live music nights and dinner in the garden. Book direct and pay a 30% deposit by bKash or Nagad.",
};

// shortcut: Thursday to Saturday at 8 pm is a sample schedule; set the real nights when the F&B team confirms them.
export const LIVE_MUSIC: LiveMusic = {
  venue: "Kasundi Restaurant",
  weekdays: [4, 5, 6],
  time: "8:00 pm",
  text: "The most talked-about nights in Cox's Bazar: songs on the boat stage, dinner under the garden lights. Tables go fast, so book yours here.",
  photo: P.music,
  maxGuests: 12,
};
