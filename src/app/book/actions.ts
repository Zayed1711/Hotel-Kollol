"use server";

import { redirect } from "next/navigation";
import { ROOMS } from "@/lib/hotel";
import { SoldOut, confirmPayment, createHold } from "@/lib/db";
import { PAYMENT_METHODS, normalisePhone, stayError } from "@/lib/rules";


const text = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

/** Step 2 → 3: checks everything again on the server, then holds the room. */
export async function holdRoom(form: FormData) {
  const roomId = text(form, "room", 40);
  const checkin = text(form, "checkin", 10);
  const checkout = text(form, "checkout", 10);
  const guests = Number(form.get("guests"));
  const back = (error: string) =>
    redirect(`/book?${new URLSearchParams({ room: roomId, checkin, checkout, guests: String(guests), error })}#details`);

  const room = ROOMS.find((r) => r.id === roomId);
  const dateError = stayError(checkin, checkout);
  if (!room) back("Choose a room.");
  if (dateError) back(dateError);
  if (!Number.isInteger(guests) || guests < 1 || guests > room!.maxGuests) back(`This room sleeps up to ${room!.maxGuests}.`);

  const name = text(form, "name", 80);
  const phone = normalisePhone(text(form, "phone", 20));
  const email = text(form, "email", 120) || null;
  const notes = text(form, "notes", 500) || null;
  if (name.length < 2) back("Please enter the guest's full name.");
  if (!phone) back("Please enter a Bangladeshi mobile number, like 01712-345678.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) back("That email address doesn't look right.");

  let ref: string;
  try {
    ref = createHold({ roomId, checkin, checkout, guests, name, phone: phone!, email, notes });
  } catch (e) {
    if (e instanceof SoldOut) back("Sorry, that room has just been booked for these dates. Please pick another.");
    throw e;
  }
  redirect(`/book/${ref!}`);
}

// shortcut: payment is simulated; wire SSLCommerz (bKash, Nagad, cards) once the hotel has a merchant account.
export async function payDeposit(form: FormData) {
  const ref = text(form, "ref", 20);
  const method = text(form, "method", 10);
  if (!(PAYMENT_METHODS as readonly string[]).includes(method)) redirect(`/book/${ref}?error=method`);
  try {
    confirmPayment(ref, method);
  } catch (e) {
    if (e instanceof SoldOut) redirect(`/book/${ref}?error=soldout`);
    throw e;
  }
  redirect(`/book/${ref}`);
}
