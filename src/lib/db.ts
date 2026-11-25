import "server-only";
import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { ROOMS } from "./hotel";
import { HOLD_MINUTES, quote, roomsLeft, nightsBetween } from "./rules";

// shortcut: one local SQLite file; move to Postgres (Supabase) with an exclusion constraint before going live.
const g = globalThis as unknown as { seagullDb?: DatabaseSync };
function db() {
  if (!g.seagullDb) {
    mkdirSync("data", { recursive: true });
    const d = new DatabaseSync("data/seagull.db");
    d.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS bookings (
        ref TEXT PRIMARY KEY,
        room_id TEXT NOT NULL,
        checkin TEXT NOT NULL,
        checkout TEXT NOT NULL,
        guests INTEGER NOT NULL,
        rate INTEGER NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        notes TEXT,
        total INTEGER NOT NULL,
        deposit INTEGER NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('held', 'confirmed', 'cancelled')),
        hold_expires_at INTEGER NOT NULL,
        payment_method TEXT,
        paid_at INTEGER,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS bookings_room_dates ON bookings (room_id, checkin, checkout);
    `);
    g.seagullDb = d;
  }
  return g.seagullDb;
}

export type Booking = {
  ref: string;
  room_id: string;
  checkin: string;
  checkout: string;
  guests: number;
  rate: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  total: number;
  deposit: number;
  status: "held" | "confirmed" | "cancelled";
  hold_expires_at: number;
  payment_method: string | null;
  paid_at: number | null;
  created_at: number;
};

/** Bookings that occupy a room: confirmed ones, and holds that have not run out. */
function taken(roomId: string, checkin: string, checkout: string, exceptRef = "") {
  return db()
    .prepare(
      `SELECT checkin, checkout FROM bookings
       WHERE room_id = ? AND checkin < ? AND checkout > ? AND ref != ?
         AND (status = 'confirmed' OR (status = 'held' AND hold_expires_at > ?))`,
    )
    .all(roomId, checkout, checkin, exceptRef, Date.now()) as { checkin: string; checkout: string }[];
}

export function availability(checkin: string, checkout: string) {
  const nights = nightsBetween(checkin, checkout);
  return ROOMS.map((room) => ({
    room,
    left: roomsLeft(room.allotment, checkin, checkout, taken(room.id, checkin, checkout)),
    quote: quote(room.fromBdt, nights),
  }));
}

/** Runs fn inside a write lock, so two guests can never take the last room at the same moment. */
function exclusive<T>(fn: () => T): T {
  const d = db();
  d.exec("BEGIN IMMEDIATE");
  try {
    const out = fn();
    d.exec("COMMIT");
    return out;
  } catch (e) {
    d.exec("ROLLBACK");
    throw e;
  }
}

export class SoldOut extends Error {}

export function createHold(input: {
  roomId: string;
  checkin: string;
  checkout: string;
  guests: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
}) {
  const room = ROOMS.find((r) => r.id === input.roomId);
  if (!room) throw new Error("Unknown room");
  const q = quote(room.fromBdt, nightsBetween(input.checkin, input.checkout));
  return exclusive(() => {
    if (roomsLeft(room.allotment, input.checkin, input.checkout, taken(room.id, input.checkin, input.checkout)) < 1) throw new SoldOut();
    const ref = `SG-${randomBytes(5).toString("hex").toUpperCase()}`;
    const now = Date.now();
    db()
      .prepare(
        `INSERT INTO bookings (ref, room_id, checkin, checkout, guests, rate, name, phone, email, notes, total, deposit, status, hold_expires_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'held', ?, ?)`,
      )
      .run(ref, room.id, input.checkin, input.checkout, input.guests, room.fromBdt, input.name, input.phone, input.email, input.notes, q.total, q.deposit, now + HOLD_MINUTES * 60_000, now);
    return ref;
  });
}

export function getBooking(ref: string) {
  return db().prepare("SELECT * FROM bookings WHERE ref = ?").get(ref) as Booking | undefined;
}

/** Marks the deposit paid. If the hold ran out meanwhile, it still succeeds as long as the room is free. */
export function confirmPayment(ref: string, method: string) {
  return exclusive(() => {
    const b = getBooking(ref);
    if (!b) throw new Error("Unknown booking");
    if (b.status === "confirmed") return;
    if (b.status !== "held") throw new SoldOut();
    const room = ROOMS.find((r) => r.id === b.room_id)!;
    if (b.hold_expires_at <= Date.now() && roomsLeft(room.allotment, b.checkin, b.checkout, taken(b.room_id, b.checkin, b.checkout, b.ref)) < 1) {
      db().prepare("UPDATE bookings SET status = 'cancelled' WHERE ref = ?").run(ref);
      throw new SoldOut();
    }
    db().prepare("UPDATE bookings SET status = 'confirmed', payment_method = ?, paid_at = ? WHERE ref = ?").run(method, Date.now(), ref);
  });
}
