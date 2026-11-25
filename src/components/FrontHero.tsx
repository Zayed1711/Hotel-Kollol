import { ArrowDown } from "lucide-react";
import { FRONT, HOTEL } from "@/lib/hotel";

/** The building front, first thing on the page. Phones: photo on top, text below. Desktop: the photo stands in an arch beside the text. */
export function FrontHero() {
  if (!FRONT) return null;
  return (
    <section
      aria-label={`${HOTEL.name} from the street`}
      className="relative overflow-hidden bg-[var(--c-deep)] text-[var(--c-deep-text)] md:flex md:min-h-[100svh] md:items-center"
      style={{ backgroundImage: "radial-gradient(circle at 74% 42%, rgb(243 199 132 / 0.16), transparent 55%)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FRONT.photo}
        alt={`The front of ${HOTEL.name}, lit up at night`}
        className="block h-[64svh] w-full animate-[sg-fade-in_900ms_ease-out] object-cover object-[50%_62%] md:absolute md:inset-auto md:top-[12svh] md:right-[7%] md:h-[78svh] md:w-[min(38vw,440px)] md:rounded-t-full md:rounded-b-[18px] md:shadow-[0_40px_80px_-20px_rgb(0_0_0_/_0.7)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-[calc(64svh-5rem)] h-20 bg-gradient-to-t from-[var(--c-deep)] to-transparent md:hidden" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-2 pb-16 md:py-0">
        <div className="max-w-xl md:max-w-[52%]">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-80">{FRONT.eyebrow}</p>
          <h1 className="font-serif mt-4 text-5xl leading-[1.02] text-white sm:text-7xl">{FRONT.title}</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/80">{FRONT.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#book" className="rounded-full bg-[var(--c-deep-text)] px-6 py-3 text-sm font-medium text-[var(--c-deep)] transition hover:opacity-90">
              Check availability
            </a>
            <a href="#rooms" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10">
              See the rooms <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
