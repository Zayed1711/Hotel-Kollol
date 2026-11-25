import { availability } from "@/lib/db";
import { stayError } from "@/lib/rules";

export const dynamic = "force-dynamic";

/** Free rooms for a stay, for the chat. Same data the booking page uses. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const checkin = q.get("checkin");
  const checkout = q.get("checkout");
  const guests = Number(q.get("guests"));
  const error = stayError(checkin, checkout) ?? (Number.isInteger(guests) && guests >= 1 && guests <= 4 ? null : "Choose 1 to 4 guests.");
  if (error) return Response.json({ error }, { status: 400 });

  const rooms = availability(checkin!, checkout!)
    .filter((r) => r.left > 0 && guests <= r.room.maxGuests)
    .map((r) => ({ id: r.room.id, name: r.room.name, photo: r.room.photo, view: r.room.view, left: r.left, total: r.quote.total, nights: r.quote.nights }));
  return Response.json({ rooms });
}
