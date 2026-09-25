"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, CarFront, ChevronDown, Gauge, MapPin, Menu, Users, X } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import type { Car } from "@/models/car.model";

type FleetAllViewProps = { cars: Car[] };
type Brand = "All cars" | "Lamborghini" | "Porsche" | "Ferrari" | "Mercedes" | "BMW";

const vehicleImages = {
  Lamborghini: assetPath("/lambo fleet.png"),
  Porsche: assetPath("/porshe fleet.png"),
  Ferrari: assetPath("/ferrari fleet.png"),
  Mercedes: assetPath("/porshe fleet.png"),
  BMW: assetPath("/ferrari fleet.png"),
} as const;

const fleetVehicles = [
  { slug: "obsidian-gt", brand: "Lamborghini", name: "EVO Spyder", engine: "V10", power: "640 HP", seats: "2 Seats", price: "$1,600" },
  { slug: "crimson-eclipse", brand: "Porsche", name: "911 Carrera 4S", engine: "3.0L TT", power: "443 HP", seats: "4 Seats", price: "$1,850" },
  { slug: "onyx-sabre", brand: "Ferrari", name: "296 GTB", engine: "V6 Hybrid", power: "819 HP", seats: "2 Seats", price: "$1,200" },
  { slug: "velour-phantom", brand: "Lamborghini", name: "Huracan STO", engine: "V10", power: "640 HP", seats: "2 Seats", price: "$1,980" },
  { slug: "ember-revenant", brand: "Mercedes", name: "AMG GT R", engine: "V8 Biturbo", power: "585 HP", seats: "2 Seats", price: "$2,100" },
  { slug: "midnight-regal", brand: "BMW", name: "M8 Competition", engine: "V8", power: "625 HP", seats: "4 Seats", price: "$2,400" },
] as const;

const brands: Brand[] = ["All cars", "Lamborghini", "Porsche", "Ferrari", "Mercedes", "BMW"];

const whatsappNumber = "96170335113";

function getWhatsAppBookingUrl(brand: string, name: string) {
  const message = `Hi, I'm interested in booking the ${brand} ${name}. Please share availability.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function FleetAllView({ cars }: FleetAllViewProps) {
  const [activeBrand, setActiveBrand] = useState<Brand>("All cars");
  const [menuOpen, setMenuOpen] = useState(false);
  const availableSlugs = useMemo(() => new Set(cars.map((car) => car.slug)), [cars]);
  const visibleVehicles = fleetVehicles.filter((vehicle) => activeBrand === "All cars" || vehicle.brand === activeBrand);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-black/90 backdrop-blur-xl">
        <div className="relative mx-auto flex h-[4.5rem] max-w-350 items-center px-5 sm:px-10">
          <Link href="/#home" aria-label="Veltro home"><Image src={assetPath("/icons/veltro_logo.svg")} alt="Veltro" width={680} height={136} className="h-11 w-auto" priority unoptimized /></Link>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 xl:flex">
            {[['/#fleet','Fleet'],['/#experience','Experience'],['/#mission','About'],['/#blogs','Journal'],['/#faq','FAQ'],['/#contact','Contact']].map(([href,label]) => <Link key={href} href={href} className="text-[0.58rem] uppercase tracking-[0.15em] text-white/55 transition hover:text-white">{label}</Link>)}
          </nav>
          <Link href="/#contact" className="ml-auto hidden h-9 items-center gap-2 bg-[var(--brand-red)] px-5 text-[0.57rem] font-semibold uppercase tracking-[0.15em] xl:flex">Book a car <ArrowRight size={13}/></Link>
          <button type="button" onClick={() => setMenuOpen((value) => !value)} className="ml-auto grid size-10 place-items-center xl:hidden" aria-label="Toggle menu">{menuOpen ? <X size={21}/> : <Menu size={21}/>}</button>
        </div>
        {menuOpen ? <nav className="border-t border-white/8 bg-black px-5 py-3 xl:hidden">{[['/#fleet','Fleet'],['/#experience','Experience'],['/#mission','About'],['/#blogs','Journal'],['/#faq','FAQ'],['/#contact','Contact']].map(([href,label]) => <Link key={href} href={href} className="flex items-center justify-between border-b border-white/8 py-3 text-xs uppercase tracking-[0.15em] text-white/65">{label}<ArrowRight size={13} className="text-[var(--brand-red)]"/></Link>)}</nav> : null}
      </header>

      <section className="relative overflow-hidden border-b border-white/8 px-5 pb-8 pt-28 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_25%,rgba(177,18,38,.14),transparent_30%),linear-gradient(110deg,#080808,#000)]" />
        <div className="relative z-10 mx-auto max-w-350">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/50">Fleet</p>
          <h1 className="mt-2 font-display text-[clamp(2.2rem,4vw,4.2rem)] font-black uppercase leading-none tracking-[-0.045em]">Find your next drive<span className="text-[var(--brand-red)]">.</span></h1>
          <p className="mt-3 text-sm text-white/52">A curated fleet of the world&apos;s most desirable cars, ready for your next journey.</p>
          <div className="mt-7 grid overflow-hidden rounded border border-white/14 bg-[#11161b]/95 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            {[[CalendarDays,"Pickup date","Select date"],[CalendarDays,"Return date","Select date"],[MapPin,"Location","Select location"],[CarFront,"Brand","All brands"]].map(([Icon,label,value])=>{const FieldIcon=Icon as typeof CalendarDays;return <button key={label as string} type="button" className="flex min-h-17 items-center gap-3 border-b border-white/10 px-4 text-left md:border-b-0 md:border-r"><FieldIcon size={18} className="text-white/62"/><span className="flex-1"><span className="block text-[0.5rem] uppercase tracking-[0.16em] text-white/48">{label as string}</span><span className="mt-1 block text-xs text-white/66">{value as string}</span></span><ChevronDown size={13} className="text-white/42"/></button>})}
            <button type="button" className="m-3 flex min-h-11 items-center justify-center gap-2 bg-[var(--brand-red)] px-7 text-[0.57rem] font-semibold uppercase tracking-[0.16em]">Search vehicles <ArrowRight size={13}/></button>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-9 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_5%,rgba(255,255,255,.045),transparent_36%),radial-gradient(circle_at_8%_85%,rgba(177,18,38,.09),transparent_26%),#000]" />
        <div className="relative z-10 mx-auto max-w-350">
          <div className="flex flex-wrap gap-3">{brands.map((brand) => <button key={brand} type="button" onClick={() => setActiveBrand(brand)} className={`rounded border px-3 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.14em] transition ${activeBrand === brand ? 'border-[var(--brand-red)] text-[var(--brand-red)]' : 'border-transparent text-white/48 hover:text-white'}`}>{brand}</button>)}</div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleVehicles.map((vehicle, index) => {
              const canOpenDetails = availableSlugs.has(vehicle.slug);
              return <article key={`${vehicle.slug}-${index}`} className="overflow-hidden border border-white/14 bg-[linear-gradient(180deg,#080808,#020202)] shadow-[0_18px_50px_rgba(0,0,0,.42)]">
                <div className="flex items-center justify-between px-5 pt-5"><p className="text-[0.54rem] uppercase tracking-[0.16em] text-white/50"><span className="text-[var(--brand-red)]">{String(index + 1).padStart(2,'0')}</span> / {vehicle.brand}</p><span className="flex items-center gap-2 text-[0.52rem] text-white/52"><i className="size-1.5 rounded-full bg-[var(--brand-red)]"/>Available now</span></div>
                <h2 className="px-5 pt-2 font-display text-[1.75rem] font-black uppercase tracking-[-0.045em]">{vehicle.name}</h2>
                <div className="relative mt-2 h-[18rem]"><Image src={vehicleImages[vehicle.brand]} alt={vehicle.name} fill className="object-cover"/></div>
                <div className="grid grid-cols-3 border-y border-white/10 px-5 py-3 text-[0.54rem] text-white/58"><span className="flex items-center gap-2"><Gauge size={13}/>{vehicle.engine}</span><span className="flex items-center justify-center gap-2"><Gauge size={13}/>{vehicle.power}</span><span className="flex items-center justify-end gap-2"><Users size={13}/>{vehicle.seats}</span></div>
                <div className="px-5 py-4"><strong className="text-2xl">{vehicle.price}</strong><span className="ml-2 text-[0.55rem] text-white/40">/ day</span></div>
                <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                  <a href={getWhatsAppBookingUrl(vehicle.brand, vehicle.name)} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-2 bg-[var(--brand-red)] px-2 text-center text-[0.52rem] font-semibold uppercase tracking-[0.13em] transition hover:brightness-110">Book on WhatsApp <Image src={assetPath("/icons/whatsapp.svg")} alt="" width={14} height={14} className="h-3.5 w-3.5" /></a>
                  <Link href={canOpenDetails ? `/cars/${vehicle.slug}` : '/#contact'} className="flex h-11 items-center justify-center gap-2 border border-white/22 bg-white/[.03] px-2 text-center text-[0.52rem] font-semibold uppercase tracking-[0.13em] text-white/78 transition hover:border-white/42 hover:bg-white/[.07] hover:text-white">View specifications <ArrowRight size={12}/></Link>
                </div>
              </article>;
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
