"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Music } from "lucide-react";
import { LIVE_MUSIC } from "@/lib/hotel";
import { nextNights, todayDhaka } from "@/lib/rules";

const nice = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

// shortcut: dummy tables-left numbers (same for a date on every visit) to show the idea; a real allotment needs a server.
const tablesLeft = (d: string) => {
  const h = [...d].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7);
  return h % 6 === 0 ? 0 : (h % 5) + 1;
};

type Booked = { ref: string; night: string; guests: number; name: string };

/**
 * Dummy table booking for live-music nights, for proposing the idea to the hotel: the guest picks a night,
 * party size and name and gets an on-page confirmation. Nothing is sent or stored.
 */
export function LiveMusic() {
  // Worked out in the browser: the static page is built ahead of time, so build-day dates would go stale.
  const [nights, setNights] = useState<string[]>([]);
  const [night, setNight] = useState("");
  useEffect(() => {
    if (!LIVE_MUSIC) return;
    const n = nextNights(todayDhaka(), LIVE_MUSIC.weekdays, 6);
    setNights(n);
    setNight(n.find((d) => tablesLeft(d) > 0) ?? "");
  }, []);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [booked, setBooked] = useState<Booked | null>(null);
  if (!LIVE_MUSIC) return null;
  const m = LIVE_MUSIC;

  return (
    <section id="live-music" className="scroll-mt-20 bg-[var(--c-sand)] py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1fr_1.1fr] md:items-center">
        <div>
          <p className="font-mono flex items-center gap-2 text-[11px] tracking-[0.3em] text-slate-500 uppercase">
            <Music size={14} aria-hidden="true" /> Live music at {m.venue}
          </p>
          <h2 className="font-serif mt-2 text-3xl text-slate-900 sm:text-5xl">
            Save your <em className="text-[var(--c-warm)]">table</em> for the music.
          </h2>
          <p className="mt-4 max-w-md text-slate-600">{m.text}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={m.photo} alt={`Live music at ${m.venue}`} className="sg-arch mt-8 hidden h-72 w-full max-w-sm object-cover md:block" />
        </div>

        <div aria-live="polite" className="rounded-3xl bg-white p-6 shadow-[0_25px_50px_-25px_rgba(0,0,0,0.35)] sm:p-8">
          {booked ? (
            <div>
              <CheckCircle2 size={36} className="text-[var(--c-accent)]" aria-hidden="true" />
              <h3 className="font-serif mt-4 text-3xl text-slate-900">Your table is booked.</h3>
              <p className="mt-2 text-slate-600">
                {booked.name.split(" ")[0]}, see you at {m.venue} on {nice(booked.night)} from {m.time}, table for {booked.guests}.
              </p>
              <p className="mt-6 text-xs tracking-[0.25em] text-slate-500 uppercase">Booking reference</p>
              <p className="font-mono mt-1 text-2xl tracking-wider text-slate-900">{booked.ref}</p>
              <p className="mt-4 text-sm text-slate-600">Show this reference at the door. We&apos;ll hold your table for 30 minutes after the music starts.</p>
              <button type="button" onClick={() => setBooked(null)} className="mt-6 text-sm text-slate-900 underline underline-offset-4">
                Book another table
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const ref = `KS-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
                setBooked({ ref, night, guests, name: name.trim() });
              }}
            >
              <fieldset>
                <legend className="text-sm font-medium text-slate-900">Pick a night · music from {m.time}</legend>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {nights.map((d) => {
                    const left = tablesLeft(d);
                    return (
                      <label
                        key={d}
                        className="cursor-pointer rounded-xl border border-slate-300 px-3 py-2 text-center text-sm text-slate-700 has-[:checked]:border-[var(--c-accent)] has-[:checked]:bg-[var(--c-accent)] has-[:checked]:text-white has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--c-accent)]"
                      >
                        <input type="radio" name="night" value={d} checked={night === d} disabled={!left} onChange={() => setNight(d)} className="sr-only" />
                        <span className="block font-medium">{nice(d)}</span>
                        <span className="block text-[11px] opacity-80">{left ? `${left} ${left === 1 ? "table" : "tables"} left` : "Full"}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-5 grid gap-4 sm:grid-cols-[0.6fr_1fr]">
                <label className="flex flex-col gap-1.5 text-sm text-slate-700">
                  Guests
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900">
                    {Array.from({ length: m.maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-slate-700">
                  Your name
                  <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} autoComplete="name" className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900" />
                </label>
              </div>

              <button type="submit" disabled={!night} className="mt-6 w-full rounded-full bg-[var(--c-accent)] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--c-accent-dark)] disabled:opacity-50">
                Book table
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">Demo booking: nothing is sent. The live site would confirm by SMS.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
