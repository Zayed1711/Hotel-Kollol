import type { Metadata, Viewport } from "next";
import { Anton, Cormorant_Garamond, DM_Serif_Display, Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { HOTEL, THEME } from "@/lib/hotel";

const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif" });
const cormorant = Cormorant_Garamond({ weight: ["500", "600"], subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif" });
const dmSerif = DM_Serif_Display({ weight: "400", subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif" });
const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = IBM_Plex_Sans({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono" });
const serif = { fraunces, cormorant, "dm-serif": dmSerif }[THEME.serif];

export const metadata: Metadata = {
  title: `${HOTEL.name}, ${HOTEL.place}`,
  description: "A hotel in Cox's Bazar. Book direct for the best rate.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: THEME.paper };

// The hotel's palette as CSS variables; components only ever use var(--c-*).
const palette = {
  "--c-paper": THEME.paper,
  "--c-sand": THEME.sand,
  "--c-ink": THEME.ink,
  "--c-accent": THEME.accent,
  "--c-accent-dark": THEME.accentDark,
  "--c-on-accent": THEME.onAccent,
  "--c-deep": THEME.deep,
  "--c-deep-text": THEME.deepText,
  "--c-warm": THEME.warm,
} as React.CSSProperties;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" style={palette} className={`${serif.variable} ${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
