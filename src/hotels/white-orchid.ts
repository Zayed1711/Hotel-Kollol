// Hotel White Orchid, Kolatoli, Cox's Bazar. Facts from their Booking.com and Google Maps listings (Nov 2026).
// Photos are the hotel's own, served from their Booking.com gallery (signed URLs; they stop working if the hotel removes the photo).
// shortcut: room names, counts, rates and offers are samples (the hotel publishes none online); swap in theirs when they reply.
import type { Room } from "@/lib/hotel";

const b = (path: string) => `https://cf.bstatic.com/xdata/images/hotel/max1280x900/${path}&o=`;
const P = {
  exterior: b("316136590.jpg?k=c75beae137c4fa18a2ce9e08470bde9b3c8c32b77a741efa38254824fdf4a7ab"),
  reception: b("316136593.jpg?k=f582f2b90e8fc599ed3672059968f5a7c52c751200d75c9116022fdd1b6ea7a2"),
  twin: b("316134152.jpg?k=314bd8d22157afdc607d8caa977e6efd3a46e3c481a591efc7988f5a556da88d"),
  twin2: b("316134142.jpg?k=d5e959ec38c3ec61451db5af47323b2773bcc6470c851c2d16a7005ca36ded8d"),
  double: b("437162259.jpg?k=d1b3f320b886138bb13efeee6ab247e6fbe317d5010cdbf1c3dae445897d7cff"),
  king: b("770046710.jpg?k=f2775602d000eade270d93199358353065ba8ea0225fa5bbadbb000684fe5d25"),
  king2: b("437163834.jpg?k=c930a0b09d4f0e29c1f8dab3fbd2d83a56a0a934adc51ab31d8b2e63854e8351"),
  suite: b("454598555.jpg?k=9739c4168b39ca343b3f4056b185ac5331f3fedef882f3ae243721ad077f4bad"),
  balcony: b("316134145.jpg?k=a8f63e9a6f355f62c5c56ecc790a939c68388cfadad2a697930bfb6656d822a0"),
  restaurant: b("316134177.jpg?k=2d1a2eb5defa6c762f5bf54981da708fee520347b494f84634015f69f19c1388"),
  lounge: b("316134228.jpg?k=cbb6abcf6ea15a273503e110d7eba9272a3d04f2811dd70be65683213c7cc74a"),
  tea: b("770046757.jpg?k=c18b9f03cb50423c65e8b34dfbdcb2b6d24cc8deb54f78eeb8aa6d52bf9f9b25"),
  pool: b("435060855.jpg?k=307b147a6748dd7a47236d109fb8401589c15498f5f29e7097d55e7ea8efd531"),
};

export const HOTEL = {
  name: "Hotel White Orchid",
  place: "Kolatoli, Cox's Bazar",
  legal: "Hotel White Orchid",
  facilities: "indoor swimming pool, fitness room, restaurant, free Wi-Fi, free parking, room service, 24-hour front desk, concierge",
  note: "Demo website. Room rates and offers are samples.", // shown in the footer when set
};

export const CONTACT = {
  address: "Plot 30, Block B, Sea Beach Road, Kolatoli, Cox's Bazar",
  email: "whiteorchidbd@gmail.com",
  sales: "whiteorchidbd@gmail.com",
  hotline: "+880 1839-658743",
  whatsapp: "8801839658743",
};

// What the chat bot may answer directly, keyed by the topic labels in api/chat/route.ts. Unlisted topics go to the front desk.
export const POLICIES: Record<string, string> = {
  "check-in and check-out times": "Check-in is from 1:00 pm and check-out is by 11:00 am.",
  parking: "Parking is free for our guests.",
  "the pet policy": "Sorry, pets aren't allowed at the hotel.",
};

export const FACTS = [
  ["36", "rooms and suites"],
  ["1", "indoor swimming pool"],
  ["24h", "front desk"],
  ["Free", "Wi-Fi and parking"],
];

export const ROOMS: Room[] = [
  {
    id: "deluxe",
    name: "Deluxe Twin",
    word: "Together",
    tagline: "Two comfortable beds for friends, siblings or a parent and child.",
    view: "City side",
    count: 12,
    maxGuests: 2,
    allotment: 4,
    fromBdt: 5000,
    photo: P.twin,
    bg: "#5b4033",
    text: "#f6efe4",
  },
  {
    id: "super-deluxe",
    name: "Deluxe Double",
    word: "Unwind",
    tagline: "A queen bed, soft light and a quiet night after the beach.",
    view: "City or sea side",
    count: 12,
    maxGuests: 2,
    allotment: 4,
    fromBdt: 5500,
    photo: P.double,
    bg: "#8a6a3f",
    text: "#fbf6ee",
  },
  {
    id: "premium-king",
    name: "Premium King",
    word: "Space",
    tagline: "A king bed and a sitting corner by the window. Room for a family of three.",
    view: "Sea view",
    count: 8,
    maxGuests: 3,
    allotment: 3,
    fromBdt: 7500,
    photo: P.king,
    bg: "#7a2e2e",
    text: "#fbf3ec",
  },
  {
    id: "orchid-suite",
    name: "Orchid Suite",
    word: "Orchid",
    tagline: "A separate living room, a bedroom and a balcony. Our finest stay.",
    view: "Sea-facing balcony",
    count: 4,
    maxGuests: 4,
    allotment: 1,
    fromBdt: 12000,
    photo: P.suite,
    bg: "#2a2230",
    text: "#efe4cf",
  },
];

export const STORY = [
  { word: "Arrive", title: "On Sea Beach Road, Kolatoli", text: "A glass tower a short walk from the beach, with a 24-hour front desk to welcome you.", photo: P.exterior, bg: "#ece6da" },
  { word: "Rest", title: "36 rooms and suites", text: "Twin rooms for friends, king rooms for families, suites with their own living room.", photo: P.king2, bg: "#efe7e2" },
  { word: "Savour", title: "Breakfast, the way you like it", text: "Continental, Asian and halal dishes at the buffet, and room service when you'd rather stay in.", photo: P.restaurant, bg: "#eee3d9" },
  { word: "Swim", title: "An indoor pool, rain or shine", text: "Swim any time of year, then unwind in the fitness room or your room.", photo: P.pool, bg: "#e0e8ec" },
];
export const FINALE_PHOTO = P.balcony;

export const DINING = [
  { name: "The Restaurant", kind: "Continental, Asian & halal buffet breakfast", photo: P.restaurant },
  { name: "Lobby Lounge", kind: "Tea and a quiet corner", photo: P.lounge },
  { name: "Room Service", kind: "Meals, tea and coffee in your room", photo: P.tea },
];

// No event halls listed for this hotel; the Events section hides when this is empty.
export const HALLS: { name: string; capacity: string; use: string; photo: string }[] = [];

export const OFFERS = [
  {
    name: "Honeymoon Package",
    price: "৳13,999",
    unit: "3 days, 2 nights",
    points: ["Premium King sea-view room", "Daily buffet breakfast", "Room decorated with flowers", "Indoor pool access"],
    photo: P.king2,
  },
  {
    name: "Family Getaway",
    price: "৳9,999",
    unit: "3 days, 2 nights",
    points: ["Deluxe Twin room", "Breakfast for the family", "Indoor pool access", "Free parking"],
    photo: P.twin2,
  },
];
