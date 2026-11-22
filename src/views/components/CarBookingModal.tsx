"use client";

import { CalendarDays, Check, UserRound, Upload } from "lucide-react";
import { useMemo, useState, type FormEvent, type MouseEvent } from "react";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { LuxuryDatePicker } from "@/views/components/LuxuryDatePicker";
import { LuxuryTimePicker } from "@/views/components/LuxuryTimePicker";

type BookingCar = {
  brand: string;
  name: string;
  year: number;
  dailyRate: number;
};

type CarBookingModalProps = {
  car: BookingCar;
  onClose: () => void;
};

type FormErrors = Partial<Record<"fullName" | "phone" | "pickupDate" | "returnDate" | "age" | "license", string>>;

const whatsappNumber = "96170335113";

function localDateValue(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function rentalDays(pickupDate: string, returnDate: string) {
  if (!pickupDate || !returnDate) return 0;
  const start = new Date(`${pickupDate}T00:00:00`).getTime();
  const end = new Date(`${returnDate}T00:00:00`).getTime();
  return Math.max(0, Math.ceil((end - start) / 86_400_000));
}

export function CarBookingModal({ car, onClose }: CarBookingModalProps) {
  const today = useMemo(() => localDateValue(), []);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [age, setAge] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useOverlayBehavior(true, onClose);

  const duration = rentalDays(pickupDate, returnDate);
  const estimatedTotal = duration * car.dailyRate;
  const numericAge = Number(age);
  const isUnder18 = age !== "" && Number.isFinite(numericAge) && numericAge < 18;

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (fullName.trim().length < 2) nextErrors.fullName = "Enter your full name.";
    if (phone.replace(/\D/g, "").length < 7) nextErrors.phone = "Enter a valid phone number.";
    if (!pickupDate || pickupDate < today) nextErrors.pickupDate = "Choose a valid pickup date.";
    if (!returnDate || returnDate <= pickupDate) nextErrors.returnDate = "Return must be after pickup.";
    if (!Number.isInteger(numericAge) || numericAge < 18) nextErrors.age = "Driver must be at least 18.";
    if (!licenseFile) nextErrors.license = "Select a driver’s license image or PDF.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const message = [
      "NEW CAR BOOKING REQUEST",
      "",
      `Customer: ${fullName.trim()}`,
      `Phone: ${phone.trim()}`,
      `Driver age: ${age}`,
      "",
      `Vehicle: ${car.year} ${car.brand} ${car.name}`,
      `Daily rate: $${car.dailyRate.toLocaleString("en-US")}`,
      "",
      `Pickup date: ${pickupDate}`,
      `Return date: ${returnDate}`,
      `Pickup time: ${pickupTime || "To be confirmed"}`,
      `Rental duration: ${duration} ${duration === 1 ? "day" : "days"}`,
      `Estimated total: $${estimatedTotal.toLocaleString("en-US")}`,
      `Delivery location: ${deliveryLocation.trim() || "To be confirmed"}`,
      `Driver’s license file: ${licenseFile?.name ?? "Not selected"}`,
      "Please attach the selected driver’s license file in this WhatsApp chat.",
      "",
      "Notes:",
      notes.trim() || "None",
      "",
      "Please confirm availability and booking details.",
    ].join("\n");

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const inputClassName = "mt-2 h-11 w-full rounded-lg border border-white/12 bg-white/[0.045] px-3 text-sm text-white outline-none transition [color-scheme:dark] placeholder:text-white/25 focus:border-[#d7ff21]/70";
  const errorClassName = "mt-1.5 block text-xs normal-case tracking-normal text-red-300";

  return (
    <div onMouseDown={handleBackdropClick} className="fixed inset-x-0 bottom-0 top-[4.25rem] z-40 flex items-end justify-center bg-black/72 backdrop-blur-xl sm:top-[4.75rem] sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Car booking request">
      <div className="store-ui no-scrollbar relative max-h-full w-full max-w-[92rem] overflow-y-auto rounded-t-[1.75rem] border border-white/15 bg-black shadow-[0_-18px_65px_rgba(0,0,0,.65),0_38px_140px_rgba(0,0,0,.92),inset_0_1px_0_rgba(255,255,255,.08)] ring-1 ring-inset ring-white/[0.035] sm:rounded-[1.75rem]">
        <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-4xl p-5 sm:p-8 lg:p-10">
          <div className="mb-6 border-b border-white/10 pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7ff21]">Booking request</p>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-[-0.04em] text-white sm:text-3xl">{car.brand} {car.name}</h2>
          </div>
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#d7ff21]/20 bg-[#d7ff21]/[0.055] p-3 text-sm leading-5 text-white/65"><Check size={16} className="mt-0.5 shrink-0 text-[#d7ff21]" /> This sends a booking request. Your reservation is confirmed only after our team replies on WhatsApp.</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Full name *<input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" className={inputClassName} aria-invalid={Boolean(errors.fullName)} />{errors.fullName ? <span className={errorClassName}>{errors.fullName}</span> : null}</label>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Phone number *<input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" autoComplete="tel" className={inputClassName} aria-invalid={Boolean(errors.phone)} />{errors.phone ? <span className={errorClassName}>{errors.phone}</span> : null}</label>
            <div><LuxuryDatePicker label="Pickup date" value={pickupDate} min={today} onChange={(value) => { setPickupDate(value); if (returnDate && returnDate <= value) setReturnDate(""); }} />{errors.pickupDate ? <span className={errorClassName}>{errors.pickupDate}</span> : null}</div>
            <div><LuxuryDatePicker label="Return date" value={returnDate} min={pickupDate || today} onChange={setReturnDate} />{errors.returnDate ? <span className={errorClassName}>{errors.returnDate}</span> : null}</div>
            <LuxuryTimePicker label="Pickup time" value={pickupTime} onChange={setPickupTime} />
            <div>
              <label className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 transition ${Boolean(errors.age) || isUnder18 ? "border-red-400/45 bg-red-400/[0.055]" : "border-white/12 bg-white/[0.045] focus-within:border-[#d7ff21]/50 focus-within:bg-[#d7ff21]/[0.075] focus-within:shadow-[0_0_24px_rgba(215,255,33,.06)] hover:border-white/22 hover:bg-white/[0.065]"}`}>
                <span className={`grid size-8 shrink-0 place-items-center rounded-full transition ${age ? "bg-[#d7ff21] text-black" : "bg-white/[0.055] text-[#d7ff21]"}`}><UserRound size={15} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/40">Driver age *</span>
                  <input value={age} onChange={(event) => setAge(event.target.value)} type="number" min="18" inputMode="numeric" placeholder="Enter age" className="mt-0.5 block w-full appearance-none bg-transparent text-sm font-medium text-white/90 outline-none placeholder:text-white/35 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" aria-invalid={Boolean(errors.age) || isUnder18} />
                </span>
              </label>
              {isUnder18 ? <span className={errorClassName}>You must be at least 18 to request a vehicle.</span> : errors.age ? <span className={errorClassName}>{errors.age}</span> : null}
            </div>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55 sm:col-span-2">Delivery location<input value={deliveryLocation} onChange={(event) => setDeliveryLocation(event.target.value)} placeholder="City, hotel, or address" className={inputClassName} /></label>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55 sm:col-span-2">Driver&apos;s license *
              <span className={`mt-2 flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${errors.license ? "border-red-400/45 bg-red-400/[0.055]" : licenseFile ? "border-[#d7ff21]/45 bg-[#d7ff21]/[0.055]" : "border-dashed border-white/18 bg-white/[0.035] hover:border-[#d7ff21]/40"}`}>
                <span className={`grid size-9 shrink-0 place-items-center rounded-full ${licenseFile ? "bg-[#d7ff21] text-black" : "bg-white/[0.055] text-[#d7ff21]"}`}><Upload size={16} /></span>
                <span className="min-w-0 normal-case tracking-normal"><strong className="block truncate text-sm font-semibold text-white/82">{licenseFile?.name ?? "Upload driver’s license"}</strong><span className="mt-0.5 block text-xs text-white/35">JPG, PNG, or PDF · attach it in WhatsApp after submitting</span></span>
                <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={(event) => { setLicenseFile(event.target.files?.[0] ?? null); setErrors((current) => ({ ...current, license: undefined })); }} className="sr-only" />
              </span>
              {errors.license ? <span className={errorClassName}>{errors.license}</span> : null}
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55 sm:col-span-2">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Flight details or special request" className="mt-2 w-full resize-none rounded-lg border border-white/12 bg-white/[0.045] px-3 py-3 text-sm normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-[#d7ff21]/70" /></label>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
            <span className="flex items-center gap-2 text-sm text-white/55"><CalendarDays size={16} className="text-[#d7ff21]" /> {duration ? `${duration} ${duration === 1 ? "day" : "days"}` : "Select your dates"}</span>
            <strong className="text-lg text-[#d7ff21]">{duration ? `$${estimatedTotal.toLocaleString("en-US")}` : `$${car.dailyRate.toLocaleString("en-US")} / day`}</strong>
          </div>

          <button type="submit" disabled={isUnder18} className="mt-5 h-12 w-full rounded-lg bg-[#d7ff21] text-sm font-extrabold uppercase tracking-[0.1em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30">Reserve now</button>
        </form>
      </div>
    </div>
  );
}
