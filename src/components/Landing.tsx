"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { CONTACT, HALLS, HOTEL, ROOMS, bdt } from "@/lib/hotel";
import { ChatWidget } from "./ChatWidget";
import { RoomStage } from "./RoomStage";
import { StayStory } from "./StayStory";
import { Dining, Events, Facts, Footer, Offers } from "./Sections";

const NAV = [
  ["Rooms", "#rooms"],
  ["Dining", "#dining"],
  ["Events", "#events"],
  ["Offers", "#offers"],
  ["Contact", "#contact"],
].filter(([label]) => label !== "Events" || HALLS.length);

/** The chosen room colours the header and carries into the phone's booking bar. */
export function Landing() {
  const [index, setIndex] = useState(0);
  const room = ROOMS[index]!;

  return (
    <main>
      <header className="absolute inset-x-0 top-0 z-20 transition-colors duration-700" style={{ color: room.text }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`} className="leading-none">
            <span className="font-serif block text-2xl">{HOTEL.name}</span>
            <span className="font-mono mt-1 block text-[10px] tracking-[0.3em] uppercase opacity-75">{HOTEL.place}</span>
          </a>
          <nav aria-label="Main" className="hidden items-center gap-7 text-sm md:flex">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="opacity-85 transition hover:opacity-100">
                {label}
              </a>
            ))}
          </nav>
          <a href="#book" className="rounded-full border border-current px-4 py-2 text-sm font-medium transition hover:bg-white/15">
            Book now
          </a>
        </div>
      </header>

      <div id="rooms">
        <RoomStage index={index} onChange={setIndex} />
      </div>
      <Facts />
      <StayStory />
      <Offers />
      <Dining />
      <Events />
      <Footer />
      <ChatWidget />

      {/* Phones: price and the two ways to book, always in reach. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-[#faf8f4]/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-500">{room.name}</p>
            <p className="font-serif text-lg leading-tight text-slate-900">
              {bdt(room.fromBdt)} <span className="text-xs text-slate-500">/ night</span>
            </p>
          </div>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}`}
            aria-label="Chat on WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-slate-900"
          >
            <MessageCircle size={18} aria-hidden="true" />
          </a>
          <a href="#book" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white">
            Book
          </a>
        </div>
      </div>
    </main>
  );
}
