"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageSquareText, Send, X } from "lucide-react";
import { CONTACT, HOTEL, bdt } from "@/lib/hotel";
import { addDays, todayDhaka } from "@/lib/rules";

type Stay = { checkin: string; checkout: string; guests: string };
type FreeRoom = { id: string; name: string; photo: string; view: string; left: number; total: number; nights: number };
type Msg = { role: "user" | "assistant"; content: string; rooms?: FreeRoom[]; stay?: Stay };

const GREETING: Msg = {
  role: "assistant",
  content: `Hello and welcome to ${HOTEL.name}! Planning a stay by the sea? Tell me who's coming and I'll help you find the right room.`,
};
const SUGGESTIONS = ["We're planning a family trip", "It's our honeymoon", "Is there a swimming pool?", "Check dates and prices"];
const TAG = "[DATES]";

/**
 * Floating chat. The model learns what the guest wants and recommends a room; when they're ready it
 * emits [DATES], the guest picks dates here, and the free rooms come from the same data as /book.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, busy]); // busy flips when the date picker appears
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const history = [...messages.slice(1), { role: "user" as const, content }]; // the greeting is ours, not the model's
    setMessages([GREETING, ...history, { role: "assistant", content: "" }]);
    setInput("");
    if (process.env.NEXT_PUBLIC_STATIC) {
      // The GitHub Pages copy is view-only: no server for the AI concierge to run on.
      const preview = `This is a preview, so I'm resting today. On the live website I answer guests 24/7, recommend the right room and show what's free for their dates. For now, call us on ${CONTACT.hotline}.`;
      setMessages([GREETING, ...history, { role: "assistant", content: preview }]);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }) });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let reply = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += value;
        setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: reply }]);
      }
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message : "Something went wrong.";
      setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: `${msg} You can also call us on ${CONTACT.hotline}.` }]);
    } finally {
      setBusy(false);
    }
  }

  async function checkDates(stay: Stay) {
    setBusy(true);
    const res = await fetch(`/api/availability?${new URLSearchParams(stay)}`);
    const data = (await res.json()) as { rooms?: FreeRoom[]; error?: string };
    const when = `${stay.checkin} to ${stay.checkout}, ${stay.guests} ${stay.guests === "1" ? "guest" : "guests"}`;
    // The summary text goes back to the model with the next message, so it knows what was offered.
    const content = data.error
      ? `${data.error} ${TAG}`
      : data.rooms!.length
        ? `Here's what's free for ${when}: ${data.rooms!.map((r) => `${r.name} (${bdt(r.total)} total)`).join(", ")}. Tap Book on the one you like.`
        : `Everything bookable online is taken for ${when}. Try other dates, or call us on ${CONTACT.hotline} and we'll find you something. ${TAG}`;
    setMessages((m) => [...m, { role: "user", content: `Check ${when}` }, { role: "assistant", content, rooms: data.rooms, stay }]);
    setBusy(false);
  }

  const last = messages.length - 1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="seagull-chat"
        aria-label={open ? "Close chat" : "Chat with us"}
        className="fixed right-4 bottom-24 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#2f6f73] text-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] transition hover:bg-[#265c60] sm:right-6 sm:bottom-6"
      >
        {open ? <X size={22} aria-hidden="true" /> : <MessageSquareText size={22} aria-hidden="true" />}
      </button>

      {open && (
        <div
          id="seagull-chat"
          role="dialog"
          aria-label={`Chat with ${HOTEL.name}`}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className="fixed inset-x-3 bottom-40 z-40 flex max-h-[min(600px,calc(100svh-12rem))] flex-col overflow-hidden rounded-3xl bg-[#faf8f4] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.45)] ring-1 ring-slate-200 sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[380px]"
        >
          <div className="bg-[#1f2c45] px-5 py-4 text-[#efe4cf]">
            <p className="font-serif text-lg leading-tight">{HOTEL.name} concierge</p>
            <p className="text-xs opacity-80">Here to help you plan your stay</p>
          </div>

          <div ref={listRef} aria-live="polite" aria-busy={busy} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => {
              const text = m.content.replace(TAG, "").trim();
              return (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex flex-col items-start gap-2"}>
                  <p
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user" ? "rounded-br-md bg-slate-900 text-white" : "rounded-bl-md bg-white text-slate-800 ring-1 ring-slate-200"
                    }`}
                  >
                    {text || <span className="inline-flex gap-1" aria-label="Typing"><Dot /><Dot /><Dot /></span>}
                  </p>
                  {m.rooms && m.stay && <RoomResults rooms={m.rooms} stay={m.stay} />}
                  {i === last && m.role === "assistant" && m.content.includes(TAG) && !busy && <DatePicker onSubmit={checkDates} />}
                </div>
              );
            })}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-slate-900">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              placeholder="Tell us about your trip…"
              aria-label="Your message"
              className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2f6f73]"
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white disabled:opacity-40">
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function DatePicker({ onSubmit }: { onSubmit: (stay: Stay) => void }) {
  const today = todayDhaka();
  const [checkin, setCheckin] = useState(addDays(today, 7));
  const [checkout, setCheckout] = useState(addDays(today, 9));
  const [guests, setGuests] = useState("2");
  const field = "w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-slate-900";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ checkin, checkout, guests });
      }}
      className="grid w-full grid-cols-2 gap-2 rounded-2xl bg-white p-3 ring-1 ring-slate-200"
    >
      <label className="text-[11px] text-slate-500">
        Check-in
        <input
          type="date"
          required
          min={today}
          value={checkin}
          onChange={(e) => {
            setCheckin(e.target.value);
            if (checkout <= e.target.value) setCheckout(addDays(e.target.value, 1));
          }}
          className={field}
        />
      </label>
      <label className="text-[11px] text-slate-500">
        Check-out
        <input type="date" required min={addDays(checkin, 1)} value={checkout} onChange={(e) => setCheckout(e.target.value)} className={field} />
      </label>
      <label className="text-[11px] text-slate-500">
        Guests
        <select value={guests} onChange={(e) => setGuests(e.target.value)} className={field}>
          {["1", "2", "3", "4"].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="self-end rounded-lg bg-[#2f6f73] px-3 py-2 text-sm font-medium text-white hover:bg-[#265c60]">
        Show free rooms
      </button>
    </form>
  );
}

function RoomResults({ rooms, stay }: { rooms: FreeRoom[]; stay: Stay }) {
  return (
    <ul className="w-full space-y-2">
      {rooms.map((r) => (
        <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-white p-2 ring-1 ring-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={r.photo} alt="" className="h-14 w-16 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{r.name}</p>
            <p className="text-xs text-slate-500">
              {bdt(r.total)} for {r.nights} {r.nights === 1 ? "night" : "nights"}
              {r.left <= 3 && <span className="text-[#a34a3f]"> · {r.left} left</span>}
            </p>
          </div>
          <a
            href={`/book?${new URLSearchParams({ room: r.id, ...stay })}#details`}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
          >
            Book <ArrowRight size={13} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />;
}
