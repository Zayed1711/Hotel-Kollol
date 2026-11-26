import { test } from "node:test";
import assert from "node:assert/strict";
import { nextNights, normalisePhone, quote, roomsLeft, stayError } from "./rules.ts";

test("busiest night decides what is left, not the number of overlapping bookings", () => {
  // Two bookings that overlap the stay but not each other use one room on any night.
  const taken = [
    { checkin: "2026-12-01", checkout: "2026-12-03" },
    { checkin: "2026-12-03", checkout: "2026-12-05" },
  ];
  assert.equal(roomsLeft(2, "2026-12-01", "2026-12-05", taken), 1);
  assert.equal(roomsLeft(1, "2026-12-01", "2026-12-05", [...taken, { checkin: "2026-12-04", checkout: "2026-12-06" }]), 0);
  // Checking out on the day someone checks in is not a clash.
  assert.equal(roomsLeft(1, "2026-12-05", "2026-12-06", taken), 1);
});

test("stay dates are validated", () => {
  const today = "2026-11-25";
  assert.equal(stayError("2026-11-26", "2026-11-28", today), null);
  assert.match(stayError("2026-11-24", "2026-11-28", today)!, /past/);
  assert.match(stayError("2026-11-28", "2026-11-28", today)!, /after/);
  assert.match(stayError("2026-02-30", "2026-03-02", today)!, /Choose/);
  assert.match(stayError("2026-12-01", "2027-01-15", today)!, /30 nights/);
});

test("quote adds service charge, VAT on top, and a 30% deposit", () => {
  const q = quote(10000, 2);
  assert.deepEqual(q, { nights: 2, rate: 10000, room: 20000, service: 2000, vat: 3300, total: 25300, deposit: 7590, balance: 17710 });
});

test("phone numbers", () => {
  assert.equal(normalisePhone("01766-666530"), "+8801766666530");
  assert.equal(normalisePhone("+880 1766 666530"), "+8801766666530");
  assert.equal(normalisePhone("0176666653"), null);
  assert.equal(normalisePhone("01266666530"), null);
});

test("live music nights", () => {
  // 2026-11-26 is a Thursday.
  assert.deepEqual(nextNights("2026-11-26", [4, 5, 6], 4), ["2026-11-26", "2026-11-27", "2026-11-28", "2026-12-03"]);
  assert.deepEqual(nextNights("2026-11-26", [], 3), []);
});
