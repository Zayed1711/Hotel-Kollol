"use client";

import { useState } from "react";
import { CalendarDays, Users } from "lucide-react";
import { addDays, isDate, todayDhaka } from "@/lib/rules";

/** Dates and guests for the chosen room. Sends a plain GET to /book, so it works before any JS runs. */
export function BookingForm({ roomId, initial }: { roomId?: string; initial?: { checkin?: string; checkout?: string; guests?: string } }) {
  const today = todayDhaka();
  const [checkin, setCheckin] = useState(isDate(initial?.checkin) ? initial.checkin : addDays(today, 7));
  const [checkout, setCheckout] = useState(isDate(initial?.checkout) ? initial.checkout : addDays(today, 9));

  return (
    <form
      id="book"
      action="/book"
      // The GitHub Pages copy is view-only: it has no booking pages to send this to.
      onSubmit={(e) => {
        if (!process.env.NEXT_PUBLIC_STATIC) return;
        e.preventDefault();
        alert("This is a preview. On the live website, guests pick a room here, enter their details and pay the deposit by bKash, Nagad or card.");
      }}
      className="mx-auto mt-8 grid max-w-3xl scroll-mt-24 grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-900/10 text-slate-900 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.5)] sm:grid-cols-[1fr_1fr_0.8fr_auto]"
    >
      {roomId && <input type="hidden" name="room" value={roomId} />}
      <Field label="Check-in" icon={<CalendarDays size={14} aria-hidden="true" />}>
        <input
          type="date"
          name="checkin"
          required
          min={today}
          value={checkin}
          onChange={(e) => {
            setCheckin(e.target.value);
            if (checkout <= e.target.value) setCheckout(addDays(e.target.value, 1));
          }}
          className="w-full bg-transparent text-sm outline-none"
        />
      </Field>
      <Field label="Check-out" icon={<CalendarDays size={14} aria-hidden="true" />}>
        <input
          type="date"
          name="checkout"
          required
          min={addDays(checkin, 1)}
          value={checkout}
          onChange={(e) => setCheckout(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </Field>
      <Field label="Guests" icon={<Users size={14} aria-hidden="true" />} wide>
        <select name="guests" defaultValue={initial?.guests ?? "2"} className="w-full bg-transparent text-sm outline-none">
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "adult" : "adults"}
            </option>
          ))}
        </select>
      </Field>
      <button
        type="submit"
        className="col-span-2 bg-slate-900 px-7 py-4 text-sm font-medium text-white transition hover:bg-slate-700 sm:col-span-1"
      >
        Check availability
      </button>
    </form>
  );
}

function Field({ label, icon, wide, children }: { label: string; icon: React.ReactNode; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1 bg-[var(--c-paper)] px-4 py-3 ${wide ? "col-span-2 sm:col-span-1" : ""}`}>
      <span className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.2em] text-slate-500 uppercase">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
