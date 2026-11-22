"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type LuxuryDatePickerProps = {
  label: string;
  value: string;
  min: string;
  onChange: (value: string) => void;
};

const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function LuxuryDatePicker({ label, value, min, onChange }: LuxuryDatePickerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value ? parseDate(value) : parseDate(min)));
  const minimumDate = useMemo(() => parseDate(min), [min]);
  const selectedDate = value ? parseDate(value) : null;

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

  const calendarDays = useMemo(() => {
    const firstDay = viewMonth.getDay();
    const mondayOffset = (firstDay + 6) % 7;
    const gridStart = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1 - mondayOffset);
    return Array.from({ length: 42 }, (_, index) =>
      new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index),
    );
  }, [viewMonth]);

  const formattedValue = selectedDate
    ? new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(selectedDate)
    : "Select date";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (!open && value) setViewMonth(startOfMonth(parseDate(value)));
          setOpen((current) => !current);
        }}
        className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 text-left transition ${open ? "border-[#d7ff21]/50 bg-[#d7ff21]/[0.075] shadow-[0_0_24px_rgba(215,255,33,.06)]" : "border-white/12 bg-white/[0.045] hover:border-white/22 hover:bg-white/[0.065]"}`}
      >
        <span className={`grid size-8 shrink-0 place-items-center rounded-full transition ${open ? "bg-[#d7ff21] text-black" : "bg-white/[0.045] text-[#d7ff21]"}`}><CalendarDays size={15} /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/40">{label}</span>
          <span className={`mt-0.5 block text-sm font-medium ${value ? "text-white/90" : "text-white/35"}`}>{formattedValue}</span>
        </span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label={`Choose ${label.toLowerCase()}`}
          className="absolute left-0 top-[calc(100%+.55rem)] z-[80] w-[20rem] rounded-2xl border border-white/15 bg-[#080a09]/98 p-4 shadow-[0_32px_90px_rgba(0,0,0,.82),0_0_34px_rgba(215,255,33,.06),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-2xl max-md:w-[min(20rem,calc(100vw-3rem))]"
        >
          <div className="flex items-center justify-between px-1 pb-3">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#d7ff21]">{label}</p>
              <strong className="mt-1 block text-base font-bold uppercase text-white">
                {viewMonth.toLocaleDateString("en", { month: "long", year: "numeric" })}
              </strong>
            </div>
            <div className="flex gap-1">
              <button type="button" aria-label="Previous month" onClick={() => setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))} className="grid size-8 place-items-center rounded-full bg-white/[0.045] text-white/45 transition hover:bg-white/10 hover:text-white"><ChevronLeft size={15} /></button>
              <button type="button" aria-label="Next month" onClick={() => setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))} className="grid size-8 place-items-center rounded-full bg-white/[0.045] text-white/45 transition hover:bg-white/10 hover:text-white"><ChevronRight size={15} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-y border-white/[0.06] py-2">
            {weekDays.map((day) => <span key={day} className="text-center text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-white/35">{day}</span>)}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {calendarDays.map((date) => {
              const dateValue = toDateValue(date);
              const outsideMonth = date.getMonth() !== viewMonth.getMonth();
              const disabled = date < minimumDate;
              const selected = value === dateValue;
              const today = dateValue === toDateValue(new Date());
              return (
                <button
                  key={dateValue}
                  type="button"
                  disabled={disabled}
                  aria-label={date.toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })}
                  aria-pressed={selected}
                  onClick={() => {
                    onChange(dateValue);
                    setOpen(false);
                  }}
                  className={`relative grid aspect-square place-items-center rounded-lg text-xs font-medium transition ${selected ? "bg-[#d7ff21] font-bold text-black shadow-[0_0_18px_rgba(215,255,33,.18)]" : disabled ? "cursor-not-allowed text-white/10" : outsideMonth ? "text-white/18 hover:bg-white/[0.04]" : "text-white/68 hover:bg-white/[0.08] hover:text-white"}`}
                >
                  {date.getDate()}
                  {today && !selected ? <span className="absolute bottom-1 size-0.5 rounded-full bg-[#d7ff21]" /> : null}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] px-1 pt-3">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/35 transition hover:text-white">Clear</button>
            <button type="button" onClick={() => { const next = minimumDate > new Date() ? minimumDate : new Date(); onChange(toDateValue(next)); setOpen(false); }} className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[#d7ff21] transition hover:text-white">Earliest available</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
