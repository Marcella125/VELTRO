"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type LuxuryTimePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const hours = Array.from({ length: 12 }, (_, index) => index + 1);
const minutes = ["00", "15", "30", "45"] as const;

function parseTime(value: string) {
  const [rawHour = "10", rawMinute = "00"] = value.split(":");
  const hour24 = Number(rawHour);
  return {
    hour: hour24 % 12 || 12,
    minute: minutes.includes(rawMinute as (typeof minutes)[number]) ? rawMinute : "00",
    period: hour24 >= 12 ? "PM" : "AM",
  } as const;
}

function toTimeValue(hour: number, minute: string, period: string) {
  const hour24 = period === "PM" ? (hour % 12) + 12 : hour % 12;
  return `${String(hour24).padStart(2, "0")}:${minute}`;
}

function formatTime(value: string) {
  if (!value) return "Select time";
  const parsed = parseTime(value);
  return `${parsed.hour}:${parsed.minute} ${parsed.period}`;
}

export function LuxuryTimePicker({ label, value, onChange }: LuxuryTimePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = parseTime(value);
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(initial.period);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const openPicker = () => {
    const parsed = parseTime(value);
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
    setOpen((current) => !current);
  };

  return (
    <div ref={rootRef} className="relative">
      <button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={openPicker} className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 text-left transition ${open ? "border-[#d7ff21]/50 bg-[#d7ff21]/[0.075] shadow-[0_0_24px_rgba(215,255,33,.06)]" : "border-white/12 bg-white/[0.045] hover:border-white/22 hover:bg-white/[0.065]"}`}>
        <span className={`grid size-8 shrink-0 place-items-center rounded-full transition ${open ? "bg-[#d7ff21] text-black" : "bg-white/[0.055] text-[#d7ff21]"}`}><Clock3 size={15} /></span>
        <span className="min-w-0 flex-1"><span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/40">{label}</span><span className={`mt-0.5 block text-sm font-medium ${value ? "text-white/90" : "text-white/35"}`}>{formatTime(value)}</span></span>
      </button>

      {open ? (
        <div role="dialog" aria-label={`Choose ${label.toLowerCase()}`} className="absolute left-0 top-[calc(100%+.55rem)] z-[80] w-[20rem] rounded-2xl border border-white/15 bg-[#080a09]/98 p-4 shadow-[0_32px_90px_rgba(0,0,0,.82),0_0_34px_rgba(215,255,33,.06),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-2xl max-md:w-[min(20rem,calc(100vw-3rem))]">
          <div className="flex items-center justify-between border-b border-white/[0.07] pb-3"><div><p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#d7ff21]">{label}</p><strong className="mt-1 block text-xl font-bold text-white">{hour}:{minute} {period}</strong></div><Clock3 size={20} className="text-white/25" /></div>

          <div className="mt-4">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/35">Hour</p>
            <div className="mt-2 grid grid-cols-6 gap-1.5">{hours.map((option) => <button key={option} type="button" onClick={() => setHour(option)} className={`grid h-9 place-items-center rounded-lg text-xs font-bold transition ${hour === option ? "bg-[#d7ff21] text-black" : "bg-white/[0.045] text-white/60 hover:bg-white/10 hover:text-white"}`}>{option}</button>)}</div>
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto] gap-4">
            <div><p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/35">Minutes</p><div className="mt-2 grid grid-cols-4 gap-1.5">{minutes.map((option) => <button key={option} type="button" onClick={() => setMinute(option)} className={`h-9 rounded-lg text-xs font-bold transition ${minute === option ? "bg-[#d7ff21] text-black" : "bg-white/[0.045] text-white/60 hover:bg-white/10 hover:text-white"}`}>{option}</button>)}</div></div>
            <div><p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/35">Period</p><div className="mt-2 flex gap-1.5">{(["AM", "PM"] as const).map((option) => <button key={option} type="button" onClick={() => setPeriod(option)} className={`h-9 rounded-lg px-3 text-xs font-bold transition ${period === option ? "bg-[#d7ff21] text-black" : "bg-white/[0.045] text-white/60 hover:bg-white/10 hover:text-white"}`}>{option}</button>)}</div></div>
          </div>

          <div className="mt-4 flex gap-2 border-t border-white/[0.07] pt-4"><button type="button" onClick={() => { onChange(""); setOpen(false); }} className="h-10 flex-1 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-[0.1em] text-white/45 transition hover:border-white/25 hover:text-white">Clear</button><button type="button" onClick={() => { onChange(toTimeValue(hour, minute, period)); setOpen(false); }} className="h-10 flex-[1.5] rounded-lg bg-[#d7ff21] text-xs font-extrabold uppercase tracking-[0.1em] text-black transition hover:bg-white">Set time</button></div>
        </div>
      ) : null}
    </div>
  );
}
