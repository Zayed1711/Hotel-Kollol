import { CONTACT, DINING, FACTS, HALLS, HOTEL, OFFERS, POLICIES, ROOMS, bdt } from "@/lib/hotel";

const OLLAMA = "http://127.0.0.1:11434/api/chat";
const MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:1.5b";

// qwen2.5:1.5b (~1 GB) fits an 8 GB laptop; phi3 is a little more accurate but needs ~3 GB.
// Everything the bot may say comes from here, built from the same data the site shows.
// Topics the hotel may not have published. Small models invent answers to these, so they never reach the model:
// the bot answers from POLICIES when the hotel has said, otherwise sends the guest to the front desk.
const UNKNOWN: [RegExp, string][] = [
  [/check[\s-]?(in|out)\b/i, "check-in and check-out times"],
  [/breakfast/i, "what's included with breakfast"],
  [/\bpark(ing)?\b/i, "parking"],
  [/\bpets?\b|\bdogs?\b|\bcats?\b/i, "the pet policy"],
  [/cancel|refund/i, "the cancellation terms"],
  [/shuttle|transfer|pick[\s-]?up/i, "airport transfers"],
];
const UNKNOWN_LABELS = UNKNOWN.map(([, l]) => l);

const SYSTEM = `You are the friendly front-desk host of ${HOTEL.name} in ${HOTEL.place}, Bangladesh. Reply in English, in 1-3 short sentences.
Your goal is to help the guest find the right stay and book it:
1. Get to know them first: ask ONE question at a time, such as who is travelling, the occasion (family trip, honeymoon, business) or what they want (sea view, space, budget).
2. Recommend the room or offer from the facts that fits them, and say why.
3. When they want to check dates, see availability or book, say one warm line and end your reply with the exact tag [DATES]. The guest then picks dates and sees the free rooms with a Book button.
Never apologise, never refuse, and never say what you cannot do. Use ONLY the facts below and never invent prices, times or policies; for anything not in the facts, say our front desk will gladly confirm it on ${CONTACT.hotline}. Do not write links.

FACTS
Address: ${CONTACT.address}. Phone: ${CONTACT.hotline}.${CONTACT.email ? ` Email: ${CONTACT.email}.` : ""}
${FACTS[0][0]} rooms. Room types (price per night before 10% service charge and 15% VAT):
${ROOMS.map((r) => `- ${r.name}: ${r.view}, sleeps up to ${r.maxGuests}, from ${bdt(r.fromBdt)}. ${r.tagline}`).join("\n")}
For 3 guests: ${ROOMS.filter((r) => r.maxGuests >= 3).map((r) => r.name).join(" or ")}. For 4 guests: ${ROOMS.filter((r) => r.maxGuests >= 4).map((r) => r.name).join(" or ")}. Never suggest a room for more guests than it sleeps.
Booking online: pay a 30% deposit by bKash, Nagad or card; the rest at the hotel.
${DINING.length ? `Dining: ${DINING.map((d) => `${d.name} (${d.kind})`).join(", ")}.` : "No restaurant at the hotel."}
Facilities: ${HOTEL.facilities}.
${HALLS.length ? `Events: ${HALLS.map((h) => `${h.name} (${h.capacity}; ${h.use})`).join("; ")}. Event quotes: ${CONTACT.sales}.` : `No event halls; for events, call ${CONTACT.hotline}.`}
${Object.values(POLICIES).join(" ")}
Not known (always tell guests to call): ${UNKNOWN_LABELS.filter((l) => !POLICIES[l]).join(", ")}.
Offers: ${OFFERS.map((o) => `${o.name}, ${o.price} ${o.unit}: ${o.points.join(", ")}`).join(". ")}.`;

type Msg = { role: "user" | "assistant"; content: string };

// A small model follows examples far better than rules.
const EXAMPLES: Msg[] = [
  { role: "user", content: "Hi, I want to book a room" },
  { role: "assistant", content: "Wonderful, we'd love to host you! Who will be travelling with you?" },
  { role: "user", content: "Me and my wife, it's our honeymoon" },
  { role: "assistant", content: `Congratulations! Our ${OFFERS[0].name} (${OFFERS[0].price}, ${OFFERS[0].unit}) includes ${OFFERS[0].points.slice(0, 3).join(", ").toLowerCase()}. Shall we check your dates?` },
  { role: "user", content: "Yes, let's check" },
  { role: "assistant", content: "Lovely, just pick your dates below and I'll show you what's free. [DATES]" },
  { role: "user", content: "What time is check-out?" },
  { role: "assistant", content: POLICIES["check-in and check-out times"] ?? `Our front desk will gladly confirm check-out times for you on ${CONTACT.hotline}.` },
];


/** Streams the model's reply as plain text. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { messages?: Msg[] } | null;
  // Trust boundary: keep only well-formed user/assistant turns, the last 12, each capped.
  const messages = (Array.isArray(body?.messages) ? body.messages : [])
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
  if (messages.at(-1)?.role !== "user") return new Response("Say something first.", { status: 400 });

  const unknown = UNKNOWN.find(([re]) => re.test(messages.at(-1)!.content));
  if (unknown) return new Response(POLICIES[unknown[1]] ?? `Good question! Our front desk will gladly confirm ${unknown[1]} for you on ${CONTACT.hotline}.`);

  let upstream: Response;
  try {
    upstream = await fetch(OLLAMA, {
      method: "POST",
      body: JSON.stringify({ model: MODEL, stream: true, keep_alive: "30m", options: { temperature: 0.2 }, messages: [{ role: "system", content: SYSTEM }, ...EXAMPLES, ...messages] }),
    });
  } catch {
    return new Response("The assistant is offline. Start Ollama and try again.", { status: 503 });
  }
  if (!upstream.ok || !upstream.body) return new Response("The assistant is unavailable right now.", { status: 502 });

  // Ollama sends one JSON object per line; pass on just the text.
  const decoder = new TextDecoder();
  let buffer = "";
  const text = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, string>({
      transform(chunk, out) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop()!;
        for (const line of lines) if (line.trim()) out.enqueue(JSON.parse(line).message?.content ?? "");
      },
    }),
  );
  return new Response(text.pipeThrough(new TextEncoderStream()), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
