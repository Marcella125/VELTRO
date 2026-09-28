"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, CarFront, ChevronDown, Gauge, Menu, Users, X } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { isValidRentalPeriod, isVehicleAvailable } from "@/lib/rental-availability";
import type { Car } from "@/models/car.model";
import { WhatsAppBookingModal, type BookingVehicle } from "@/views/components/WhatsAppBookingModal";

type FleetAllViewProps = { cars: Car[] };
type Brand = "All cars" | "Lamborghini" | "Porsche" | "Ferrari" | "Mercedes" | "BMW";
type CarType = "All Vehicles" | "SUV" | "Sedan" | "Sports" | "Luxury";
type AppliedSearch = { pickupDate: string; returnDate: string; carType: CarType };
type FleetVehicle = BookingVehicle & { transmission: string; seats: number; power: string };

const vehicleImages = {
  Lamborghini: assetPath("/lambo fleet.png"), Porsche: assetPath("/porshe fleet.png"),
  Ferrari: assetPath("/ferrari fleet.png"), Mercedes: assetPath("/porshe fleet.png"), BMW: assetPath("/ferrari fleet.png"),
} as const;

const fleetVehicles: FleetVehicle[] = [
  { slug: "obsidian-gt", brand: "Lamborghini", name: "EVO Spyder", category: "Sports", transmission: "Automatic", power: "640 HP", seats: 2, dailyRate: 1600, imageSrc: vehicleImages.Lamborghini },
  { slug: "crimson-eclipse", brand: "Porsche", name: "911 Carrera 4S", category: "Sports", transmission: "Automatic", power: "443 HP", seats: 4, dailyRate: 1850, imageSrc: vehicleImages.Porsche },
  { slug: "onyx-sabre", brand: "Ferrari", name: "296 GTB", category: "Sports", transmission: "Automatic", power: "819 HP", seats: 2, dailyRate: 1200, imageSrc: vehicleImages.Ferrari },
  { slug: "velour-phantom", brand: "Lamborghini", name: "Huracan STO", category: "Sports", transmission: "Automatic", power: "640 HP", seats: 2, dailyRate: 1980, imageSrc: vehicleImages.Lamborghini },
  { slug: "ember-revenant", brand: "Mercedes", name: "AMG GT R", category: "Luxury", transmission: "Automatic", power: "585 HP", seats: 2, dailyRate: 2100, imageSrc: vehicleImages.Mercedes },
  { slug: "midnight-regal", brand: "BMW", name: "M8 Competition", category: "Sedan", transmission: "Automatic", power: "625 HP", seats: 4, dailyRate: 2400, imageSrc: vehicleImages.BMW },
];

const brands: Brand[] = ["All cars", "Lamborghini", "Porsche", "Ferrari", "Mercedes", "BMW"];
const carTypes: CarType[] = ["All Vehicles", "SUV", "Sedan", "Sports", "Luxury"];

function getLocalToday() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

export function FleetAllView({ cars }: FleetAllViewProps) {
  const router = useRouter();
  const resultsRef = useRef<HTMLElement | null>(null);
  const [activeBrand, setActiveBrand] = useState<Brand>("All cars");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [carType, setCarType] = useState<CarType>("All Vehicles");
  const [searchError, setSearchError] = useState("");
  const [appliedSearch, setAppliedSearch] = useState<AppliedSearch | null>(null);
  const [bookingVehicle, setBookingVehicle] = useState<FleetVehicle | null>(null);
  const today = useMemo(() => getLocalToday(), []);
  const availableSlugs = useMemo(() => new Set(cars.map((car) => car.slug)), [cars]);

  useEffect(() => {
    fleetVehicles.forEach((vehicle) => {
      if (availableSlugs.has(vehicle.slug)) router.prefetch(`/cars/${vehicle.slug}`);
    });
  }, [availableSlugs, router]);

  const visibleVehicles = useMemo(() => {
    const filtered = fleetVehicles.filter((vehicle) => {
      const matchesBrand = activeBrand === "All cars" || vehicle.brand === activeBrand;
      const matchesType = !appliedSearch || appliedSearch.carType === "All Vehicles" || vehicle.category === appliedSearch.carType;
      return matchesBrand && matchesType;
    });
    if (!appliedSearch) return filtered;
    return [...filtered].sort((first, second) => {
      const firstAvailable = isVehicleAvailable(first.slug, appliedSearch.pickupDate, appliedSearch.returnDate);
      const secondAvailable = isVehicleAvailable(second.slug, appliedSearch.pickupDate, appliedSearch.returnDate);
      return Number(secondAvailable) - Number(firstAvailable);
    });
  }, [activeBrand, appliedSearch]);

  const handlePickupChange = (value: string) => {
    setPickupDate(value);
    if (returnDate && returnDate <= value) setReturnDate("");
    setSearchError("");
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pickupDate || !returnDate) return setSearchError("Select pickup and return dates.");
    if (!isValidRentalPeriod(pickupDate, returnDate)) return setSearchError("Return date must be after the pickup date.");
    setSearchError("");
    setAppliedSearch({ pickupDate, returnDate, carType });
    window.requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const viewAvailableVehicles = () => {
    setBookingVehicle(null);
    window.requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-black/90 backdrop-blur-xl">
        <div className="relative mx-auto flex h-[4.5rem] max-w-350 items-center px-5 sm:px-10">
          <Link href="/#home" aria-label="Veltro home"><Image src={assetPath("/icons/veltro_logo.svg")} alt="Veltro" width={680} height={136} className="h-11 w-auto" priority unoptimized /></Link>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 xl:flex">
            {[["/#fleet", "Fleet"], ["/#experience", "Experience"], ["/#mission", "About"], ["/#blogs", "Journal"], ["/#faq", "FAQ"], ["/#contact", "Contact"]].map(([href, label]) => <Link key={href} href={href} className="text-[0.58rem] uppercase tracking-[0.15em] text-white/55 transition hover:text-white">{label}</Link>)}
          </nav>
          <Link href="/#contact" className="ml-auto hidden h-9 items-center gap-2 bg-[var(--brand-red)] px-5 text-[0.57rem] font-semibold uppercase tracking-[0.15em] xl:flex">Request a car <ArrowRight size={13} /></Link>
          <button type="button" onClick={() => setMenuOpen((value) => !value)} className="ml-auto grid size-10 place-items-center xl:hidden" aria-label="Toggle menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
        {menuOpen ? <nav className="border-t border-white/8 bg-black px-5 py-3 xl:hidden">{[["/#fleet", "Fleet"], ["/#experience", "Experience"], ["/#mission", "About"], ["/#blogs", "Journal"], ["/#faq", "FAQ"], ["/#contact", "Contact"]].map(([href, label]) => <Link key={href} href={href} className="flex items-center justify-between border-b border-white/8 py-3 text-xs uppercase tracking-[0.15em] text-white/65">{label}<ArrowRight size={13} className="text-[var(--brand-red)]" /></Link>)}</nav> : null}
      </header>

      <section className="relative overflow-hidden border-b border-white/8 px-5 pb-8 pt-28 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_25%,rgba(177,18,38,.14),transparent_30%),linear-gradient(110deg,#080808,#000)]" />
        <div className="relative z-10 mx-auto max-w-350">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/50">Fleet</p>
          <h1 className="mt-2 font-display text-[clamp(2.2rem,4vw,4.2rem)] font-black uppercase leading-none tracking-[-0.045em]">Find your next drive<span className="text-[var(--brand-red)]">.</span></h1>
          <p className="mt-3 text-sm text-white/52">Select your dates to see vehicles available for your journey.</p>
          <form onSubmit={handleSearch} className="mt-7 grid overflow-hidden rounded border border-white/14 bg-[#11161b]/95 md:grid-cols-[1fr_1fr_1fr_auto]" noValidate>
            <label className="flex min-h-17 items-center gap-3 border-b border-white/10 px-4 md:border-b-0 md:border-r"><CalendarDays size={18} className="shrink-0 text-white/62" /><span className="min-w-0 flex-1"><span className="block text-[0.5rem] uppercase tracking-[0.16em] text-white/48">Pickup date</span><input type="date" value={pickupDate} min={today} onChange={(event) => handlePickupChange(event.target.value)} className="mt-1 block w-full bg-transparent text-xs text-white/75 outline-none [color-scheme:dark]" /></span></label>
            <label className="flex min-h-17 items-center gap-3 border-b border-white/10 px-4 md:border-b-0 md:border-r"><CalendarDays size={18} className="shrink-0 text-white/62" /><span className="min-w-0 flex-1"><span className="block text-[0.5rem] uppercase tracking-[0.16em] text-white/48">Return date</span><input type="date" value={returnDate} min={pickupDate || today} onChange={(event) => { setReturnDate(event.target.value); setSearchError(""); }} className="mt-1 block w-full bg-transparent text-xs text-white/75 outline-none [color-scheme:dark]" /></span></label>
            <label className="relative flex min-h-17 items-center gap-3 border-b border-white/10 px-4 md:border-b-0 md:border-r"><CarFront size={18} className="shrink-0 text-white/62" /><span className="min-w-0 flex-1"><span className="block text-[0.5rem] uppercase tracking-[0.16em] text-white/48">Car type</span><select value={carType} onChange={(event) => setCarType(event.target.value as CarType)} className="mt-1 block w-full appearance-none bg-transparent text-xs text-white/75 outline-none">{carTypes.map((type) => <option key={type} value={type} className="bg-[#11161b]">{type}</option>)}</select></span><ChevronDown size={13} className="pointer-events-none text-white/42" /></label>
            <button type="submit" className="m-3 flex min-h-11 items-center justify-center gap-2 bg-[var(--brand-red)] px-7 text-[0.57rem] font-semibold uppercase tracking-[0.16em] transition hover:bg-[var(--brand-red-dark)]">Search vehicles <ArrowRight size={13} /></button>
          </form>
          {searchError ? <p className="mt-2 text-xs text-red-300" role="alert">{searchError}</p> : null}
        </div>
      </section>

      <section ref={resultsRef} className="relative scroll-mt-20 px-5 py-9 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_5%,rgba(255,255,255,.045),transparent_36%),radial-gradient(circle_at_8%_85%,rgba(177,18,38,.09),transparent_26%),#000]" />
        <div className="relative z-10 mx-auto max-w-350">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">{brands.map((brand) => <button key={brand} type="button" onClick={() => setActiveBrand(brand)} className={`rounded border px-3 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.14em] transition ${activeBrand === brand ? "border-[var(--brand-red)] text-[var(--brand-red)]" : "border-transparent text-white/48 hover:text-white"}`}>{brand}</button>)}</div>
            <p className="text-[0.58rem] uppercase tracking-[0.14em] text-white/38" aria-live="polite">{appliedSearch ? `${visibleVehicles.length} matching vehicle${visibleVehicles.length === 1 ? "" : "s"}` : "Select dates to check availability"}</p>
          </div>
          {visibleVehicles.length ? <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleVehicles.map((vehicle, index) => {
              const canOpenDetails = availableSlugs.has(vehicle.slug);
              const detailsHref = canOpenDetails ? `/cars/${vehicle.slug}` : "/#contact";
              const availableForDates = appliedSearch ? isVehicleAvailable(vehicle.slug, appliedSearch.pickupDate, appliedSearch.returnDate) : null;
              return <article key={vehicle.slug} className="overflow-hidden border border-white/14 bg-[linear-gradient(180deg,#080808,#020202)] shadow-[0_18px_50px_rgba(0,0,0,.42)]">
                <div className="flex items-center justify-between gap-3 px-5 pt-5"><p className="text-[0.54rem] uppercase tracking-[0.16em] text-white/50"><span className="text-[var(--brand-red)]">{String(index + 1).padStart(2, "0")}</span> / {vehicle.brand}</p><span className={`flex items-center gap-2 text-right text-[0.52rem] ${availableForDates === true ? "text-emerald-300/90" : availableForDates === false ? "text-red-300/75" : "text-white/42"}`}><i className={`size-1.5 shrink-0 rounded-full ${availableForDates === true ? "bg-emerald-400" : availableForDates === false ? "bg-[var(--brand-red)]" : "bg-white/30"}`} />{availableForDates === true ? "Available for your dates ✓" : availableForDates === false ? "Unavailable for selected dates" : "Select dates to check"}</span></div>
                <div className="px-5 pt-2"><h2 className="font-display text-[1.75rem] font-black uppercase tracking-[-0.045em]">{vehicle.name}</h2><p className="mt-1 text-[0.52rem] uppercase tracking-[0.15em] text-white/42">{vehicle.category}</p></div>
                <div className="relative mt-2 h-[18rem]"><Image src={vehicle.imageSrc} alt={vehicle.name} fill sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw" className="object-cover" /></div>
                <div className="grid grid-cols-3 border-y border-white/10 px-5 py-3 text-[0.54rem] text-white/58"><span className="flex items-center gap-2"><Gauge size={13} />{vehicle.transmission}</span><span className="flex items-center justify-center gap-2"><Gauge size={13} />{vehicle.power}</span><span className="flex items-center justify-end gap-2"><Users size={13} />{vehicle.seats} Seats</span></div>
                <div className="px-5 py-4"><strong className="text-2xl">${vehicle.dailyRate.toLocaleString("en-US")}</strong><span className="ml-2 text-[0.55rem] text-white/40">/ day</span></div>
                <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                  <button type="button" onClick={() => availableForDates && setBookingVehicle(vehicle)} disabled={!availableForDates} className="flex h-11 items-center justify-center gap-2 bg-[var(--brand-red)] px-2 text-center text-[0.52rem] font-semibold uppercase tracking-[0.11em] text-white transition enabled:hover:bg-[var(--brand-red-dark)] disabled:cursor-not-allowed disabled:bg-white/8 disabled:text-white/28">{availableForDates === false ? "Unavailable for selected dates" : appliedSearch ? "Book on WhatsApp" : "Select dates to book"}{availableForDates ? <Image src={assetPath("/icons/whatsapp.svg")} alt="" width={14} height={14} className="h-3.5 w-3.5" /> : null}</button>
                  <Link href={detailsHref} prefetch={canOpenDetails} onPointerEnter={() => canOpenDetails && router.prefetch(detailsHref)} onFocus={() => canOpenDetails && router.prefetch(detailsHref)} className="flex h-11 items-center justify-center gap-2 border border-white/22 bg-white/[.03] px-2 text-center text-[0.52rem] font-semibold uppercase tracking-[0.11em] text-white/78 transition hover:border-white/42 hover:bg-white/[.07] hover:text-white">View Specifications <ArrowRight size={12} /></Link>
                </div>
              </article>;
            })}
          </div> : <div className="mt-6 border border-white/10 bg-white/[0.025] px-6 py-16 text-center"><h2 className="font-display text-xl font-semibold uppercase">No matching vehicles</h2><p className="mt-2 text-sm text-white/45">Try another vehicle type or brand.</p></div>}
        </div>
      </section>

      {bookingVehicle && appliedSearch ? <WhatsAppBookingModal vehicle={bookingVehicle} pickupDate={appliedSearch.pickupDate} returnDate={appliedSearch.returnDate} onClose={() => setBookingVehicle(null)} onViewAvailable={viewAvailableVehicles} /> : null}
    </main>
  );
}
