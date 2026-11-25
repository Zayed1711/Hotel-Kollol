import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT, DINING, FACTS, HALLS, HOTEL, OFFERS } from "@/lib/hotel";

const wa = (text: string) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] tracking-[0.3em] text-slate-500 uppercase">{children}</p>;
}

export function Facts() {
  return (
    <section aria-label="At a glance" className="border-y border-slate-200 bg-[#faf8f4]">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-4 py-10 sm:grid-cols-4">
        {FACTS.map(([n, label]) => (
          <div key={label} className="text-center">
            <dt className="sr-only">{label}</dt>
            <dd className="font-serif text-4xl text-slate-900 sm:text-5xl">{n}</dd>
            <dd className="mt-1 text-xs tracking-wide text-slate-500 uppercase">{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Offers() {
  return (
    <section id="offers" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <Eyebrow>Offers</Eyebrow>
      <h2 className="font-serif mt-2 text-3xl text-slate-900 sm:text-5xl">
        Made for <em className="text-[#b4574b]">two</em>, or for the whole table.
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {OFFERS.map((o) => (
          <article key={o.name} className="group grid overflow-hidden rounded-3xl bg-white shadow-[0_20px_40px_-25px_rgba(0,0,0,0.35)] sm:grid-cols-[0.9fr_1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={o.photo} alt="" className="h-56 w-full object-cover sm:h-full" />
            <div className="flex flex-col p-6">
              <h3 className="font-serif text-2xl text-slate-900">{o.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{o.unit}</p>
              <p className="font-serif mt-3 text-3xl text-[#b4574b]">{o.price}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                {o.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                    {p}
                  </li>
                ))}
              </ul>
              <a
                href={wa(`Hi, I'd like to book the ${o.name} offer.`)}
                className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-slate-900 underline-offset-4 hover:underline"
              >
                Book this offer <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Dining() {
  return (
    <section id="dining" className="scroll-mt-20 bg-[#1f2c45] py-20 text-[#efe4cf]">
      <div className="mx-auto max-w-6xl px-4">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-60">Dining</p>
        <h2 className="font-serif mt-2 text-3xl sm:text-5xl">
          Good food, every <em>day</em>.
        </h2>
      </div>
      <ul className="no-scrollbar mx-auto mt-10 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
        {DINING.map((d) => (
          <li key={d.name} className="w-[70vw] shrink-0 snap-start sm:w-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.photo} alt={`${d.name} at ${HOTEL.name}`} className="sg-arch h-80 w-full object-cover" />
            <h3 className="font-serif mt-4 text-xl">{d.name}</h3>
            <p className="text-sm opacity-70">{d.kind}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Events() {
  if (!HALLS.length) return null;
  return (
    <section id="events" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <Eyebrow>Weddings, conferences, celebrations</Eyebrow>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-serif text-3xl text-slate-900 sm:text-5xl">
          Room for <em className="text-[#2f6f73]">everyone</em>.
        </h2>
        <a
          href={`mailto:${CONTACT.sales}?subject=${encodeURIComponent("Event enquiry")}`}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Request a quote <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {HALLS.map((h) => (
          <article key={h.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={h.photo} alt={h.name} className="h-56 w-full rounded-2xl object-cover" />
            <h3 className="font-serif mt-4 text-xl text-slate-900">{h.name}</h3>
            <p className="font-mono mt-1 text-[11px] tracking-wider text-slate-500 uppercase">{h.capacity}</p>
            <p className="mt-1 text-sm text-slate-600">{h.use}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20 bg-[#2f6f73] px-4 pt-16 pb-28 text-[#f4efe6] sm:pb-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl">{HOTEL.name}</p>
          <p className="mt-1 text-sm opacity-75">{HOTEL.place}</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed opacity-85">
            Book here and you deal with us directly: the best rate, no middleman, and a real person on WhatsApp.
          </p>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-2.5"><MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />{CONTACT.address}</li>
          <li className="flex gap-2.5"><Phone size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><a href={`tel:${CONTACT.hotline.replace(/[^+\d]/g, "")}`}>{CONTACT.hotline}</a></li>
          <li className="flex gap-2.5"><Mail size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
        </ul>
        <div>
          <a
            href={wa(`Hi, I'd like to ask about a stay at ${HOTEL.name}.`)}
            className="inline-flex items-center gap-2 rounded-full bg-[#f4efe6] px-5 py-3 text-sm font-medium text-[#1f2c45] transition hover:bg-white"
          >
            <MessageCircle size={16} aria-hidden="true" /> Chat on WhatsApp
          </a>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-xs opacity-60">© {new Date().getFullYear()} {HOTEL.legal}{HOTEL.note && ` · ${HOTEL.note}`}</p>
    </footer>
  );
}
