import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MessageCircle } from "lucide-react";
import { Alert, BookShell, Breakdown } from "@/components/BookShell";
import { getBooking } from "@/lib/db";
import { CONTACT, ROOMS } from "@/lib/hotel";
import { PAYMENT_METHODS, nightsBetween, quote } from "@/lib/rules";
import { payDeposit } from "../actions";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  method: "Choose how you'd like to pay.",
  soldout: "Sorry, your hold ran out and the room was booked by someone else. Nothing was charged.",
};

const dhakaTime = (ms: number) => new Date(ms).toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour: "numeric", minute: "2-digit" });

/** Step 3 (pay the deposit) and the confirmation, both keyed by the booking reference. */
export default async function BookingPage({ params, searchParams }: { params: Promise<{ ref: string }>; searchParams: Promise<{ error?: string }> }) {
  const { ref } = await params;
  const { error } = await searchParams;
  const b = getBooking(ref);
  if (!b) notFound();
  const room = ROOMS.find((r) => r.id === b.room_id)!;
  const q = quote(b.rate, nightsBetween(b.checkin, b.checkout));
  const confirmed = b.status === "confirmed";
  const expired = b.status === "held" && b.hold_expires_at <= Date.now();

  const summary = (
    <aside className="h-fit rounded-2xl bg-[var(--c-sand)] p-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={room.photo} alt="" className="h-36 w-full rounded-xl object-cover" />
      <h2 className="font-serif mt-4 text-xl text-slate-900">{room.name}</h2>
      <p className="mt-1 text-sm text-slate-600">
        {b.checkin} → {b.checkout} · {b.guests} {b.guests === 1 ? "guest" : "guests"}
      </p>
      <p className="mt-1 text-sm text-slate-600">{b.name} · {b.phone}</p>
      <Breakdown q={q} paid={confirmed} />
    </aside>
  );

  if (confirmed) {
    return (
      <BookShell step={4}>
        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
            <CheckCircle2 size={36} className="text-[var(--c-accent)]" aria-hidden="true" />
            <h1 className="font-serif mt-4 text-3xl text-slate-900 sm:text-4xl">
              You&apos;re <em className="text-[var(--c-accent)]">booked</em>.
            </h1>
            <p className="mt-2 text-slate-600">See you in Cox&apos;s Bazar, {b.name.split(" ")[0]}.</p>
            <p className="mt-6 text-xs tracking-[0.25em] text-slate-500 uppercase">Booking reference</p>
            <p className="font-mono mt-1 text-2xl tracking-wider text-slate-900">{b.ref}</p>
            <p className="mt-6 text-sm text-slate-600">
              Deposit paid by {b.payment_method}. Keep this page or the reference; the front desk will ask for it.
            </p>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hi, my booking reference is ${b.ref}.`)}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              <MessageCircle size={16} aria-hidden="true" /> Questions? Message us on WhatsApp
            </a>
          </section>
          {summary}
        </div>
      </BookShell>
    );
  }

  if (b.status === "cancelled") {
    return (
      <BookShell step={1}>
        <Alert>{ERRORS.soldout}</Alert>
        <a href="/book" className="text-sm underline underline-offset-4">Search again</a>
      </BookShell>
    );
  }

  return (
    <BookShell step={3}>
      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <form action={payDeposit} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 sm:p-8">
          <h1 className="font-serif text-3xl text-slate-900">Pay your deposit</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <Clock size={15} aria-hidden="true" />
            {expired
              ? "Your hold has run out, but you can still pay if the room is free."
              : `We're holding this room for you until ${dhakaTime(b.hold_expires_at)}.`}
          </p>
          {error && ERRORS[error] && <div className="mt-5"><Alert>{ERRORS[error]}</Alert></div>}
          <input type="hidden" name="ref" value={b.ref} />
          <fieldset className="mt-6">
            <legend className="text-sm text-slate-700">Pay with</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m, i) => (
                <label key={m} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 text-sm has-[:checked]:border-slate-900 has-[:checked]:bg-slate-50">
                  <input type="radio" name="method" value={m} defaultChecked={i === 0} className="accent-slate-900" />
                  {m === "Card" ? "Visa / Mastercard" : m}
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="mt-6 w-full rounded-full bg-slate-900 px-6 py-3.5 text-sm font-medium text-white hover:bg-slate-700">
            Pay ৳{q.deposit.toLocaleString("en-IN")} deposit
          </button>
          <p className="mt-3 text-center text-xs text-slate-500">Demo: no money moves. The real site would hand over to SSLCommerz here.</p>
        </form>
        {summary}
      </div>
    </BookShell>
  );
}
