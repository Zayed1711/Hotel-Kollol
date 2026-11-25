"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HOTEL, ROOMS, bdt, type Room } from "@/lib/hotel";
import { BookingForm } from "./BookingForm";

/**
 * "Choose your view", WayPoint's colour stage applied to rooms: one floating room photo,
 * neighbours peeking in, the stage flooding with the room's colour and its word moving behind.
 * The booking form sits right under it, so the price and dates are on the first screen.
 */
export function RoomStage({ index, onChange }: { index: number; onChange: (i: number) => void }) {
  const room = ROOMS[index]!;
  const count = ROOMS.length;
  const [dir, setDir] = useState(1);
  const go = (delta: number) => {
    setDir(delta > 0 ? 1 : -1);
    onChange((index + delta + count) % count);
  };
  const dragX = useRef<number | null>(null);
  const ticker = Array.from({ length: 6 }, () => room.word).join("  ·  ") + "  ·  ";
  const prev = ROOMS[(index - 1 + count) % count]!;
  const next = ROOMS[(index + 1) % count]!;

  return (
    <section
      aria-label="Choose your room"
      className="relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: room.bg, color: room.text }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      {/* The room photo again, full-bleed and tinted by the flood colour. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={room.id}
        src={room.photo}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full animate-[sg-fade-in_700ms_ease-out] object-cover opacity-15"
        style={{ mixBlendMode: "luminosity" }}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[34%] -translate-y-1/2 overflow-hidden sm:top-[38%]">
        <div key={room.id} className="sg-ticker flex w-max whitespace-nowrap">
          {[0, 1].map((n) => (
            <span key={n} className="font-display pr-[2vw] text-[30vw] leading-none uppercase opacity-[0.12] sm:text-[17vw]">
              {ticker}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-10 sm:pt-28 sm:pb-14">
        <p className="text-center text-xs font-medium tracking-[0.3em] uppercase opacity-80">On Cox&apos;s Bazar sea beach</p>
        <h1 className="font-serif mx-auto mt-3 max-w-2xl text-center text-3xl leading-tight sm:text-5xl">
          Choose your <em>view</em>.
        </h1>

        <div
          className="relative mx-auto mt-6 flex h-[250px] cursor-grab touch-pan-y items-center justify-center select-none active:cursor-grabbing sm:mt-8 sm:h-[340px]"
          onPointerDown={(e) => (dragX.current = e.clientX)}
          onPointerUp={(e) => {
            const start = dragX.current;
            dragX.current = null;
            if (start != null && Math.abs(e.clientX - start) > 50) go(e.clientX < start ? 1 : -1);
          }}
          onPointerCancel={() => (dragX.current = null)}
        >
          <div aria-hidden="true" className="pointer-events-none absolute left-[-30%] scale-[0.45] opacity-40 sm:left-[4%] sm:scale-[0.55]">
            <PhotoCard room={prev} still />
          </div>
          <div key={room.id} className={`relative z-10 ${dir > 0 ? "animate-[sg-slide-next_500ms_ease-out]" : "animate-[sg-slide-prev_500ms_ease-out]"}`}>
            <PhotoCard room={room} />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute right-[-30%] scale-[0.45] opacity-40 sm:right-[4%] sm:scale-[0.55]">
            <PhotoCard room={next} still />
          </div>

          <div className="absolute inset-y-0 left-0 z-20 flex items-center sm:left-2">
            <ArrowButton label={`Previous: ${prev.name}`} onClick={() => go(-1)}>
              <ChevronLeft size={22} aria-hidden="true" />
            </ArrowButton>
          </div>
          <div className="absolute inset-y-0 right-0 z-20 flex items-center sm:right-2">
            <ArrowButton label={`Next: ${next.name}`} onClick={() => go(1)}>
              <ChevronRight size={22} aria-hidden="true" />
            </ArrowButton>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-xl text-center" aria-live="polite">
          <h2 className="font-serif text-3xl leading-tight sm:text-5xl">{room.name}</h2>
          <p className="mt-2 text-sm leading-relaxed opacity-85 sm:text-base">{room.tagline}</p>
          <p className="font-mono mt-3 text-[11px] tracking-wider uppercase opacity-80">
            From {bdt(room.fromBdt)} a night · {room.view} · {room.count} {room.count === 1 ? "suite" : "rooms"}
          </p>
          <p className="font-mono mt-3 text-[11px] tracking-[0.3em] opacity-60">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </p>
        </div>

        <BookingForm roomId={room.id} />
      </div>
    </section>
  );
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-black/20 transition hover:bg-black/35"
    >
      {children}
    </button>
  );
}

/** The room's photo as a floating window card. */
function PhotoCard({ room, still = false }: { room: Room; still?: boolean }) {
  return (
    <div style={{ perspective: "900px" }}>
      <div className={`rounded-[22px] bg-[#fbf7f0] p-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.55)] ${still ? "" : "sg-float"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={room.photo} alt={still ? "" : `${room.name} at ${HOTEL.name}`} className="h-[200px] w-[300px] rounded-[16px] object-cover sm:h-[280px] sm:w-[440px]" />
      </div>
    </div>
  );
}
