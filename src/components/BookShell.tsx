import { Check } from "lucide-react";
import { HOTEL, bdt } from "@/lib/hotel";
import { DEPOSIT, SERVICE, VAT, type quote } from "@/lib/rules";

const STEPS = ["Room", "Details", "Pay"];

/** Header and step tracker shared by the booking pages. `step` is 1-based; 4 means done. */
export function BookShell({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <header className="border-b border-slate-200 bg-[#faf8f4]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <a href="/" className="leading-none text-slate-900">
            <span className="font-serif block text-2xl">{HOTEL.name}</span>
            <span className="font-mono mt-1 block text-[10px] tracking-[0.3em] text-slate-500 uppercase">{HOTEL.place}</span>
          </a>
          <ol aria-label="Booking steps" className="flex items-center gap-2 text-xs sm:gap-4 sm:text-sm">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const done = n < step;
              return (
                <li key={label} aria-current={n === step ? "step" : undefined} className={`flex items-center gap-1.5 ${n === step ? "text-slate-900" : "text-slate-400"}`}>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                      done ? "bg-[#2f6f73] text-white" : n === step ? "bg-slate-900 text-white" : "border border-slate-300"
                    }`}
                  >
                    {done ? <Check size={13} aria-hidden="true" /> : n}
                  </span>
                  <span className={n === step ? "" : "hidden sm:inline"}>{label}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pt-8 pb-24">{children}</main>
    </div>
  );
}

export function Alert({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mb-6 rounded-xl border border-[#a34a3f]/30 bg-[#a34a3f]/10 px-4 py-3 text-sm text-[#7d3329]">
      {children}
    </p>
  );
}

export function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 py-1.5 ${strong ? "border-t border-slate-200 pt-3 font-medium text-slate-900" : "text-slate-600"}`}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function Breakdown({ q, paid }: { q: ReturnType<typeof quote>; paid?: boolean }) {
  return (
    <dl className="mt-4 text-sm">
      <Line label={`${bdt(q.rate)} × ${q.nights} ${q.nights === 1 ? "night" : "nights"}`} value={bdt(q.room)} />
      <Line label={`Service charge (${pct(SERVICE)})`} value={bdt(q.service)} />
      <Line label={`VAT (${pct(VAT)})`} value={bdt(q.vat)} />
      <Line label="Total" value={bdt(q.total)} strong />
      <Line label={paid ? "Deposit paid" : `Pay now (${pct(DEPOSIT)} deposit)`} value={bdt(q.deposit)} />
      <Line label="Pay at the hotel" value={bdt(q.balance)} />
    </dl>
  );
}
