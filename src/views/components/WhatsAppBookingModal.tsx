"use client";

import Image from "next/image";
import { ArrowRight, Check, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import {
  formatRentalDate,
  isVehicleAvailable,
  rentalDurationInDays,
} from "@/lib/rental-availability";

export type BookingVehicle = {
  slug: string;
  brand: string;
  name: string;
  category: string;
  dailyRate: number;
  imageSrc: string;
};

type WhatsAppBookingModalProps = {
  vehicle: BookingVehicle;
  pickupDate: string;
  returnDate: string;
  onClose: () => void;
  onViewAvailable: () => void;
};

type FormErrors = Partial<Record<"fullName" | "phone" | "age", string>>;

const whatsappNumber = "96170335113";

export function WhatsAppBookingModal({
  vehicle,
  pickupDate,
  returnDate,
  onClose,
  onViewAvailable,
}: WhatsAppBookingModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAvailable, setIsAvailable] = useState(() =>
    isVehicleAvailable(vehicle.slug, pickupDate, returnDate),
  );

  useOverlayBehavior(true, onClose);

  const duration = rentalDurationInDays(pickupDate, returnDate);
  const estimatedTotal = duration * vehicle.dailyRate;
  const money = useMemo(
    () => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }),
    [],
  );

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (fullName.trim().length < 2) nextErrors.fullName = "Enter your full name.";
    if (phone.replace(/\D/g, "").length < 7) nextErrors.phone = "Enter a valid phone number.";
    const numericAge = Number(age);
    if (!age || !Number.isInteger(numericAge) || numericAge < 18) {
      nextErrors.age = "Driver must be at least 18 years old.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const availableNow = isVehicleAvailable(vehicle.slug, pickupDate, returnDate);
    setIsAvailable(availableNow);
    if (!availableNow || !validate()) return;

    const message = [
      "NEW RENTAL REQUEST",
      "",
      `Customer: ${fullName.trim()}`,
      `Phone: ${phone.trim()}`,
      "",
      `Vehicle: ${vehicle.brand} ${vehicle.name}`,
      `Category: ${vehicle.category}`,
      "",
      `Pickup: ${formatRentalDate(pickupDate)} — ${pickupTime || "To be confirmed"}`,
      `Return: ${formatRentalDate(returnDate)}`,
      `Rental Period: ${duration} ${duration === 1 ? "Day" : "Days"}`,
      "",
      `Daily Rate: $${money.format(vehicle.dailyRate)}`,
      `Estimated Total: $${money.format(estimatedTotal)}`,
      "",
      `Driver Age: ${age}`,
      "",
      "Notes:",
      notes.trim() || "None",
      "",
      "Please confirm availability and the reservation.",
    ].join("\n");

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const fieldClassName =
    "mt-1.5 h-11 w-full border border-white/12 bg-white/[0.035] px-3 text-sm text-white outline-none transition focus:border-[var(--brand-red)]";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/78 p-0 backdrop-blur-md sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
      <div className="relative max-h-[96dvh] w-full overflow-y-auto border border-white/12 bg-[#080808] shadow-[0_30px_100px_rgba(0,0,0,0.75)] sm:max-w-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#080808]/95 px-5 py-4 backdrop-blur-xl sm:px-7">
          <div>
            <p className="text-[0.52rem] uppercase tracking-[0.24em] text-[var(--brand-red)]">Rental request</p>
            <h2 id="booking-modal-title" className="mt-1 font-display text-xl font-bold uppercase tracking-[-0.03em] text-white sm:text-2xl">Request This Vehicle</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close booking request" className="grid size-10 place-items-center border border-white/10 text-white/60 transition hover:border-white/25 hover:text-white"><X size={18} /></button>
        </div>

        <div className="grid gap-6 px-5 py-5 sm:grid-cols-[0.8fr_1.2fr] sm:px-7 sm:py-6">
          <aside>
            <div className="overflow-hidden border border-white/10 bg-white/[0.025]">
              <div className="relative h-40 bg-black"><Image src={vehicle.imageSrc} alt={`${vehicle.brand} ${vehicle.name}`} fill sizes="(max-width: 639px) 100vw, 320px" className="object-cover" /></div>
              <div className="p-4">
                <p className="text-[0.5rem] uppercase tracking-[0.2em] text-white/45">{vehicle.brand} · {vehicle.category}</p>
                <h3 className="mt-1 font-display text-xl font-bold uppercase text-white">{vehicle.name}</h3>
                <dl className="mt-4 space-y-2 border-t border-white/10 pt-3 text-xs">
                  <div className="flex justify-between gap-4"><dt className="text-white/42">Pickup</dt><dd className="text-right text-white/80">{formatRentalDate(pickupDate)}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-white/42">Return</dt><dd className="text-right text-white/80">{formatRentalDate(returnDate)}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-white/42">Duration</dt><dd className="text-right text-white/80">{duration} {duration === 1 ? "day" : "days"}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-white/42">Daily rate</dt><dd className="text-right text-white/80">${money.format(vehicle.dailyRate)}</dd></div>
                  <div className="flex justify-between gap-4 border-t border-white/10 pt-2 font-semibold"><dt className="text-white/65">Estimated total</dt><dd className="text-[var(--brand-red)]">${money.format(estimatedTotal)}</dd></div>
                </dl>
              </div>
            </div>
          </aside>

          <form onSubmit={handleSubmit} noValidate>
            <div className={`mb-4 flex items-center gap-2 border px-3 py-2.5 text-xs ${isAvailable ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300" : "border-[var(--brand-red)]/30 bg-[var(--brand-red)]/8 text-red-300"}`}>
              {isAvailable ? <Check size={15} /> : <X size={15} />}
              <span>{isAvailable ? "Available for your selected dates" : "This vehicle is no longer available for the selected dates."}</span>
            </div>

            {isAvailable ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-[0.55rem] uppercase tracking-[0.15em] text-white/55">Full Name *<input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" className={fieldClassName} aria-invalid={Boolean(errors.fullName)} />{errors.fullName ? <span className="mt-1 block normal-case tracking-normal text-red-300">{errors.fullName}</span> : null}</label>
                <label className="text-[0.55rem] uppercase tracking-[0.15em] text-white/55">Phone Number *<input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" autoComplete="tel" className={fieldClassName} aria-invalid={Boolean(errors.phone)} />{errors.phone ? <span className="mt-1 block normal-case tracking-normal text-red-300">{errors.phone}</span> : null}</label>
                <label className="text-[0.55rem] uppercase tracking-[0.15em] text-white/55">Pickup Time<input value={pickupTime} onChange={(event) => setPickupTime(event.target.value)} type="time" className={fieldClassName} /></label>
                <label className="text-[0.55rem] uppercase tracking-[0.15em] text-white/55">Age *<input value={age} onChange={(event) => setAge(event.target.value)} type="number" min="18" inputMode="numeric" className={fieldClassName} aria-invalid={Boolean(errors.age)} />{errors.age ? <span className="mt-1 block normal-case tracking-normal text-red-300">{errors.age}</span> : null}</label>
                <label className="sm:col-span-2 text-[0.55rem] uppercase tracking-[0.15em] text-white/55">Notes / Special Request<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="mt-1.5 w-full resize-none border border-white/12 bg-white/[0.035] px-3 py-2.5 text-sm normal-case tracking-normal text-white outline-none transition focus:border-[var(--brand-red)]" /></label>
              </div>
            ) : null}

            <p className="mt-4 text-[0.65rem] leading-5 text-white/42">Your reservation is confirmed only after confirmation from our team on WhatsApp.</p>

            {isAvailable ? (
              <PrimaryButton type="submit" className="mt-4 w-full">Continue on WhatsApp <ArrowRight size={15} /></PrimaryButton>
            ) : (
              <PrimaryButton type="button" onClick={onViewAvailable} className="mt-4 w-full">View Available Vehicles</PrimaryButton>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
