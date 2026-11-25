import { BedDouble, Users } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { Alert, BookShell, Breakdown } from "@/components/BookShell";
import { availability } from "@/lib/db";
import { bdt } from "@/lib/hotel";
import { stayError } from "@/lib/rules";
import { holdRoom } from "./actions";

export const dynamic = "force-dynamic";

type Params = { room?: string; checkin?: string; checkout?: string; guests?: string; error?: string };

/** Steps 1 and 2: pick a room for the dates, then enter the guest's details. */
export default async function BookPage({ searchParams }: { searchParams: Promise<Params> }) {
  const p = await searchParams;
  const guests = Math.min(4, Math.max(1, Number(p.guests) || 2));
  const dateError = stayError(p.checkin, p.checkout);
  const results = dateError ? [] : availability(p.checkin!, p.checkout!);
  const chosen = results.find((r) => r.room.id === p.room && r.left > 0 && guests <= r.room.maxGuests);
  const link = (room: string) =>
    `/book?${new URLSearchParams({ room, checkin: p.checkin!, checkout: p.checkout!, guests: String(guests) })}#details`;

  return (
    <BookShell step={chosen ? 2 : 1}>
      <h1 className="font-serif text-3xl text-slate-900 sm:text-4xl">
        Choose your <em className="text-[#2f6f73]">room</em>
      </h1>
      <div className="-mx-4 sm:mx-0 [&_form]:mt-5 [&_form]:max-w-none [&_form]:shadow-none [&_form]:ring-1 [&_form]:ring-slate-200">
        <BookingForm roomId={p.room} initial={{ checkin: p.checkin, checkout: p.checkout, guests: String(guests) }} />
      </div>

      {dateError && p.checkin !== undefined && <div className="mt-6"><Alert>{dateError}</Alert></div>}

      {results.length > 0 && (
        <ul className="mt-8 grid gap-4">
          {results.map(({ room, left, quote: q }) => {
            const tooMany = guests > room.maxGuests;
            const selected = chosen?.room.id === room.id;
            return (
              <li
                key={room.id}
                className={`grid overflow-hidden rounded-2xl bg-white ring-1 sm:grid-cols-[260px_1fr_auto] ${selected ? "ring-2 ring-[#2f6f73]" : "ring-slate-200"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={room.photo} alt="" className="h-44 w-full object-cover sm:h-full" />
                <div className="p-5">
                  <h2 className="font-serif text-2xl text-slate-900">{room.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{room.tagline}</p>
                  <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><BedDouble size={14} aria-hidden="true" />{room.view}</span>
                    <span className="flex items-center gap-1"><Users size={14} aria-hidden="true" />Sleeps up to {room.maxGuests}</span>
                  </p>
                  {left > 0 && left <= 3 && <p className="mt-3 text-xs font-medium text-[#a34a3f]">Only {left} left for these dates</p>}
                </div>
                <div className="flex flex-row items-end justify-between gap-3 border-t border-slate-100 p-5 sm:flex-col sm:border-t-0 sm:border-l">
                  <div className="sm:text-right">
                    <p className="font-serif text-2xl text-slate-900">{bdt(q.rate)}</p>
                    <p className="text-xs text-slate-500">a night · {bdt(q.total)} for {q.nights} {q.nights === 1 ? "night" : "nights"}, all in</p>
                  </div>
                  {left === 0 ? (
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500">Sold out</span>
                  ) : tooMany ? (
                    <span className="max-w-[10rem] text-right text-xs text-slate-500">Too small for {guests} guests</span>
                  ) : (
                    <a
                      href={link(room.id)}
                      aria-current={selected ? "true" : undefined}
                      className={`rounded-full px-5 py-2.5 text-sm font-medium ${selected ? "bg-[#2f6f73] text-white" : "bg-slate-900 text-white hover:bg-slate-700"}`}
                    >
                      {selected ? "Selected" : "Select"}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {chosen && (
        <section id="details" className="mt-10 scroll-mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
          <form action={holdRoom} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <h2 className="font-serif text-2xl text-slate-900">Who&apos;s staying?</h2>
            <p className="mt-1 text-sm text-slate-500">We&apos;ll send the confirmation by SMS and email.</p>
            {p.error && <div className="mt-5"><Alert>{p.error}</Alert></div>}
            <input type="hidden" name="room" value={chosen.room.id} />
            <input type="hidden" name="checkin" value={p.checkin} />
            <input type="hidden" name="checkout" value={p.checkout} />
            <input type="hidden" name="guests" value={guests} />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input label="Full name" name="name" autoComplete="name" required minLength={2} maxLength={80} />
              <Input label="Mobile number" name="phone" type="tel" autoComplete="tel" required placeholder="01712-345678" maxLength={20} />
              <Input label="Email (optional)" name="email" type="email" autoComplete="email" maxLength={120} className="sm:col-span-2" />
              <label className="flex flex-col gap-1.5 text-sm text-slate-700 sm:col-span-2">
                Anything we should know? (optional)
                <textarea name="notes" rows={3} maxLength={500} placeholder="Airport pickup, late arrival, a cot for the baby…" className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900" />
              </label>
            </div>
            <button type="submit" className="mt-6 w-full rounded-full bg-slate-900 px-6 py-3.5 text-sm font-medium text-white hover:bg-slate-700">
              Continue to payment
            </button>
          </form>

          <aside className="h-fit rounded-2xl bg-[#ece6da] p-6">
            <h2 className="font-serif text-xl text-slate-900">{chosen.room.name}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {p.checkin} → {p.checkout} · {guests} {guests === 1 ? "guest" : "guests"}
            </p>
            <Breakdown q={chosen.quote} />
            <p className="mt-4 text-xs leading-relaxed text-slate-500">No booking fees. Rates booked here are the hotel&apos;s own, with no middleman.</p>
          </aside>
        </section>
      )}
    </BookShell>
  );
}

function Input({ label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm text-slate-700 ${className}`}>
      {label}
      <input {...props} className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900" />
    </label>
  );
}
