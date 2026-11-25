"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FINALE_PHOTO, HOTEL, STORY } from "@/lib/hotel";

/**
 * "Your stay, one tide at a time", WayPoint's scroll story applied to a stay:
 * one arched photo per screen, moved by scrolling, a colour and a giant faded word per step.
 * Finale: the arch opens out into the whole screen, with the way to book.
 */
const FINALE_LENGTH = 1.4;
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const headline = (
  <h2 className="font-serif text-center text-2xl leading-tight text-slate-900 sm:text-5xl">
    Your stay, one <em className="text-[#2f6f73]">tide</em> at a time.
  </h2>
);

export function StayStory() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMq);

    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      setProgress(total > 0 ? clamp(-el.getBoundingClientRect().top / total) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  if (reducedMotion) return <StaticStory />;

  const n = STORY.length;
  const s = progress * (n + FINALE_LENGTH);
  const current = Math.min(n, Math.floor(s)); // n = finale
  const finale = clamp((s - n) / FINALE_LENGTH);
  const open = easeInOut(clamp(finale / 0.6));
  const outro = clamp((finale - 0.55) / 0.3);

  return (
    <section ref={ref} aria-label={`Your stay at ${HOTEL.name}`} style={{ height: `${(n + FINALE_LENGTH + 1) * 100}vh` }} className="relative">
      <div
        className="sticky top-0 h-[100svh] overflow-hidden transition-colors duration-700"
        style={{ backgroundColor: current < n ? STORY[current]!.bg : "#e9e2d6" }}
      >
        <p
          key={current}
          aria-hidden="true"
          className="font-serif pointer-events-none absolute inset-x-0 top-[46%] -translate-y-1/2 animate-[sg-fade-in_600ms_ease-out] text-center text-[26vw] leading-none text-slate-900/[0.06] italic select-none sm:text-[17vw]"
        >
          {current < n ? STORY[current]!.word : "Stay"}
        </p>

        <div className="relative mx-auto max-w-xl px-4 pt-24 sm:max-w-3xl sm:pt-20" style={{ opacity: 1 - open }}>
          {headline}
          <div key={current} className="mt-4 min-h-[88px] animate-[sg-fade-in_500ms_ease-out] text-center">
            {current < n && (
              <>
                <p className="font-mono text-[11px] tracking-[0.25em] text-slate-500 uppercase">
                  {String(current + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </p>
                <h3 className="font-serif mt-1 text-xl text-slate-900 sm:text-2xl">{STORY[current]!.title}</h3>
                <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">{STORY[current]!.text}</p>
              </>
            )}
          </div>
        </div>

        {/* Each arch rises in from below, holds, then lifts away. */}
        {STORY.map((step, i) => {
          const t = s - i;
          if (t < -0.05 || t > 1.05) return null;
          const enter = easeOut(clamp(t / 0.25));
          const leave = clamp((t - 0.75) / 0.25);
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={step.word}
              src={step.photo}
              alt={step.title}
              className="sg-arch pointer-events-none absolute top-[64%] left-1/2 h-[42svh] w-[min(72vw,340px)] object-cover shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] sm:top-[66%] sm:h-[46svh]"
              style={{
                opacity: enter * (1 - leave),
                transform: `translate(-50%, -50%) translateY(${lerp(40, 0, enter) - leave * 30}vh) scale(${lerp(0.92, 1, enter)})`,
              }}
            />
          );
        })}

        {/* Finale: the arch opens into the whole screen. */}
        {/* Always mounted, so the photo has loaded by the time the finale arrives. */}
        {(
          <div
            aria-hidden={finale === 0}
            className="absolute top-1/2 left-1/2 overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]"
            style={{
              width: `calc(${1 - open} * min(72vw, 340px) + ${open} * 100vw)`,
              height: `calc(${1 - open} * 46svh + ${open} * 100svh)`,
              borderRadius: `${lerp(999, 0, open)}px ${lerp(999, 0, open)}px ${lerp(18, 0, open)}px ${lerp(18, 0, open)}px`,
              transform: `translate(-50%, ${lerp(-30, -50, open)}%) translateY(${lerp(20, 0, easeOut(clamp(finale / 0.15)))}vh)`,
              opacity: clamp(finale / 0.1),
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FINALE_PHOTO} alt={`${HOTEL.name}, ${HOTEL.place}`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" style={{ opacity: open }} />
            <div
              className="absolute inset-x-0 bottom-[12svh] flex flex-col items-center gap-5 px-4 text-center text-white"
              style={{ opacity: outro, transform: `translateY(${lerp(24, 0, outro)}px)`, pointerEvents: outro > 0.9 ? "auto" : "none" }}
            >
              <p className="font-serif text-3xl leading-tight sm:text-6xl">
                Your stay is <em>waiting</em>.
              </p>
              <a href="#book" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-white/85">
                Book direct, best rate <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        )}

        <div aria-hidden="true" className="absolute top-1/2 right-3 flex -translate-y-1/2 flex-col gap-2 sm:right-6" style={{ opacity: 1 - open }}>
          {[...STORY.map((x) => x.word), "finale"].map((k, i) => (
            <span key={k} className={`h-1.5 w-1.5 rounded-full transition ${i <= current ? "bg-slate-900" : "bg-slate-900/20"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** For guests who turn off motion: the same story as a calm stack. */
function StaticStory() {
  return (
    <section aria-label={`Your stay at ${HOTEL.name}`} className="bg-[#ece6da] px-4 py-16">
      {headline}
      <ol className="mx-auto mt-10 grid max-w-5xl gap-10 sm:grid-cols-2">
        {STORY.map((step) => (
          <li key={step.word} className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={step.photo} alt="" className="sg-arch mx-auto h-72 w-[min(72vw,300px)] object-cover" />
            <h3 className="font-serif mt-4 text-xl text-slate-900">{step.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{step.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-12 text-center">
        <a href="#book" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white">
          Book direct, best rate <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
