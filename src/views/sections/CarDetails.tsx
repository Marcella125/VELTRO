"use client";

import { useEffect, useState, type ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CarProfile,
  Engine,
  Gauge,
  GearSix,
  Lightning,
  Seat,
  Timer,
  X,
} from "@phosphor-icons/react";
import { assetPath } from "@/lib/asset-path";
import type { Car } from "@/models/car.model";
import { CarBookingModal } from "@/views/components/CarBookingModal";

type CarDetailsProps = { car: Car; returnHref?: string; returnLabel?: string };
type GalleryIcon = ComponentType<{ className?: string }>;
type GalleryView = { label: string; src: string; icon: GalleryIcon; iconClassName?: string };

function FleetCarIcon({ className }: { className?: string }) {
  const iconUrl = assetPath("/icons/fleet.svg");

  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className ?? ""}`}
      style={{
        WebkitMaskImage: `url("${iconUrl}")`,
        maskImage: `url("${iconUrl}")`,
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

const lamboGallery: GalleryView[] = [
  { label: "Front", src: assetPath("/images/lambo/lambo front.png"), icon: FleetCarIcon, iconClassName: "h-3.5 w-8" },
  { label: "Rear", src: assetPath("/images/lambo/lambo rear.png"), icon: FleetCarIcon, iconClassName: "h-3.5 w-8" },
  { label: "Interior", src: assetPath("/images/lambo/lambo interior.png"), icon: Seat, iconClassName: "size-[1.55rem] stroke-[1.2]" },
  { label: "Engine", src: assetPath("/images/lambo/lambo eng.png"), icon: Engine, iconClassName: "size-[1.55rem] stroke-[1.2]" },
];

const porscheGallery: GalleryView[] = [
  { label: "Front", src: assetPath("/images/porshe/porshe front.png"), icon: FleetCarIcon, iconClassName: "h-3.5 w-8" },
  { label: "Rear", src: assetPath("/images/porshe/porshe rear.png"), icon: FleetCarIcon, iconClassName: "h-3.5 w-8" },
  { label: "Interior", src: assetPath("/images/porshe/interior.png"), icon: Seat, iconClassName: "size-[1.55rem] stroke-[1.2]" },
  { label: "Engine", src: assetPath("/images/porshe/porshe eng.png"), icon: Engine, iconClassName: "size-[1.55rem] stroke-[1.2]" },
];

const bmwGallery: GalleryView[] = [
  { label: "Front", src: assetPath("/images/BMW/bmw front.png"), icon: FleetCarIcon, iconClassName: "h-3.5 w-8" },
  { label: "Rear", src: assetPath("/images/BMW/bmw rear.png"), icon: FleetCarIcon, iconClassName: "h-3.5 w-8" },
  { label: "Interior", src: assetPath("/images/BMW/bmw interior.png"), icon: Seat, iconClassName: "size-[1.55rem] stroke-[1.2]" },
  { label: "Engine", src: assetPath("/images/BMW/bmw eng.png"), icon: Engine, iconClassName: "size-[1.55rem] stroke-[1.2]" },
];

const ferrariGallery: GalleryView[] = [
  { label: "Front", src: assetPath("/images/ferrari/ferrari front.png"), icon: FleetCarIcon, iconClassName: "h-3.5 w-8" },
  { label: "Rear", src: assetPath("/images/ferrari/ferrari rear.png"), icon: FleetCarIcon, iconClassName: "h-3.5 w-8" },
  { label: "Interior", src: assetPath("/images/ferrari/interior.png"), icon: Seat, iconClassName: "size-[1.55rem] stroke-[1.2]" },
  { label: "Engine", src: assetPath("/images/ferrari/ferrari eng.png"), icon: Engine, iconClassName: "size-[1.55rem] stroke-[1.2]" },
];

const detailOverrides: Record<string, { name: string; description: string; acceleration: string; topSpeed: string; torque: string; rate?: number }> = {
  "lamborghini-evo-spyder": {
    name: "Huracán EVO Spyder",
    description: "Open-air V10 performance, unmistakable presence, and precise Lamborghini dynamics.",
    acceleration: "3.1 s",
    topSpeed: "325 km/h",
    torque: "600 Nm",
  },
};

export function CarDetails({ car, returnHref = "/#fleet", returnLabel = "Fleet" }: CarDetailsProps) {
  const override = detailOverrides[car.slug];
  const isLamborghini = car.slug.startsWith("lamborghini");
  const isPorsche = car.slug.startsWith("porsche");
  const isBmw = car.slug.startsWith("bmw");
  const isFerrari = car.slug.startsWith("ferrari");
  const gallery: GalleryView[] = isLamborghini
    ? lamboGallery
    : isPorsche
      ? porscheGallery
      : isBmw
        ? bmwGallery
        : isFerrari
          ? ferrariGallery
          : [{ label: "Exterior", src: assetPath(car.image), icon: CarProfile }];
  const [activeView, setActiveView] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const name = override?.name ?? car.name.replace(new RegExp(`^${car.brand}\\s*`, "i"), "");
  const description = override?.description ?? car.description ?? `${car.year} ${car.brand} ${name}, prepared for an exceptional drive.`;
  const rate = override?.rate ?? car.pricePerDay;

  const performance = [
    { icon: Lightning, value: `${car.horsepower || 0} HP`, label: "Power output", mobileLabel: "Power" },
    { icon: Timer, value: override?.acceleration ?? "On request", label: "Acceleration 0–100 km/h", mobileLabel: "0–100 km/h" },
    { icon: Gauge, value: override?.topSpeed ?? "On request", label: "Maximum speed", mobileLabel: "Top speed" },
    { icon: GearSix, value: car.transmission || "Automatic", label: override?.torque ? `${override.torque} torque` : "Transmission", mobileLabel: "Gearbox" },
  ];

  const moveGallery = (direction: number) => {
    if (gallery.length < 2) return;
    setActiveView((current) => (current + direction + gallery.length) % gallery.length);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") moveGallery(-1);
      if (event.key === "ArrowRight") moveGallery(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <main className="relative min-h-[100svh] overflow-x-hidden bg-[#090A0B] text-white lg:h-[100svh] lg:overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-50 bg-[#090A0B] shadow-[0_12px_35px_rgba(0,0,0,.22)]">
        <div className="mx-auto flex h-[4.25rem] max-w-[92rem] items-center px-4 sm:h-[4.75rem] sm:px-8 lg:px-12">
          <Link href="/" aria-label="Go to Veltro home" className="relative shrink-0 lg:left-[-1cm]">
            <Image src={assetPath("/icons/veltro_logo.svg")} alt="Veltro" width={680} height={136} priority unoptimized className="h-10 w-auto sm:h-14" />
          </Link>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex">
            {[[returnHref, "Fleet"], ["/#experience", "Experience"], ["/#shop", "Shop"], ["/#faq", "FAQs"], ["/#contact", "Contact"]].map(([href, label]) => (
              <Link key={label} href={href} className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white/66 transition hover:text-[#d7ff21]">{label}</Link>
            ))}
          </nav>
          {bookingOpen ? (
            <button type="button" onClick={() => setBookingOpen(false)} aria-label="Close booking form" className="ml-auto grid size-11 place-items-center text-white/75 transition hover:text-[#d7ff21] lg:translate-x-[1cm]"><X size={22} /></button>
          ) : (
            <Link href={returnHref} aria-label={`Back to ${returnLabel}`} className="ml-auto grid size-11 place-items-center text-white/75 transition hover:text-[#d7ff21] lg:translate-x-[1cm]">
              <X size={22} />
            </Link>
          )}
        </div>
      </header>

      <div className="absolute inset-0 hidden lg:block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={gallery[activeView].src}
            initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image src={gallery[activeView].src} alt={`${car.brand} ${name} ${gallery[activeView].label}`} fill priority sizes="100vw" className="object-contain object-center" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,8,.97)_0%,rgba(5,7,8,.78)_24%,rgba(5,7,8,.13)_51%,rgba(5,7,8,.08)_72%,rgba(5,7,8,.72)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.22)_0%,transparent_24%,transparent_68%,rgba(0,0,0,.74)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[100rem] flex-col px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:h-full lg:min-h-0 lg:px-12 lg:pb-8 lg:pt-28">
        <section className="max-w-[27rem]">
          <motion.div initial={reduceMotion ? false : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center gap-4 text-[0.52rem] font-bold uppercase tracking-[0.42em] text-white/65">
              {car.brand}<span className="h-px w-10 bg-[#d7ff21]" />
            </div>
            <h1 className="mt-3 text-[clamp(1.55rem,2.8vw,2.75rem)] font-extrabold uppercase italic leading-[0.9] tracking-[-0.04em]">{name}</h1>
            <p className="mt-3 max-w-[22rem] text-[0.62rem] leading-[1.65] text-white/58 sm:text-[0.68rem]">{description}</p>
          </motion.div>

          <div className="mt-4 grid grid-cols-4 rounded-full border border-white/10 bg-white/[0.025] p-1 lg:hidden">
            {gallery.map(({ label }, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveView(index)}
                aria-pressed={activeView === index}
                className={`h-8 rounded-full text-[0.48rem] font-semibold uppercase tracking-[0.08em] transition ${activeView === index ? "bg-[#d7ff21] text-black" : "text-white/55 hover:text-white"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative -mx-5 mt-2 h-[13rem] overflow-hidden border-y border-white/10 sm:-mx-8 sm:h-[18rem] lg:hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={gallery[activeView].src}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image src={gallery[activeView].src} alt={`${car.brand} ${name} ${gallery[activeView].label}`} fill priority sizes="100vw" className="object-contain object-center" />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,10,11,.12)_0%,transparent_50%,rgba(9,10,11,.45)_100%)]" />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-white/[0.025] p-1 shadow-[0_18px_45px_rgba(0,0,0,.2)] sm:mt-6 sm:gap-2 sm:p-2 lg:mt-9 lg:grid-cols-1 lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            {performance.map(({ icon: Icon, value, label, mobileLabel }, index) => (
              <motion.div key={label} initial={reduceMotion ? false : { opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + index * 0.07, duration: 0.5 }} className="relative flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 text-center sm:gap-2 sm:py-2.5 lg:grid lg:grid-cols-[3rem_1fr] lg:items-center lg:justify-start lg:gap-3 lg:rounded-none lg:px-0 lg:py-2.5 lg:text-left lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:h-px lg:after:w-[17rem] lg:after:bg-white/10 lg:last:after:hidden">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-[#d7ff21]/25 bg-[#d7ff21]/[0.06] text-[#d7ff21] lg:size-9 lg:border-white/18 lg:bg-black/20 lg:backdrop-blur-sm"><Icon size={17} weight="light" /></span>
                <div className="min-w-0 w-full"><strong className="block truncate text-[0.68rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[0.82rem] lg:text-[1.35rem] lg:leading-none lg:tracking-[-0.04em]">{value}</strong><span className="mt-1.5 block truncate text-[0.34rem] font-medium uppercase tracking-[0.08em] text-white/40 sm:text-[0.4rem] lg:hidden">{mobileLabel}</span><span className="mt-1 hidden text-[0.48rem] uppercase tracking-[0.1em] text-white/43 lg:block">{label}</span></div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 sm:mt-6">
            <button type="button" onClick={() => setBookingOpen(true)} className="flex h-11 min-w-44 items-center justify-center gap-3 rounded-lg bg-[#d7ff21] px-6 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-black transition hover:bg-white">Reserve now <ArrowRight size={15} /></button>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/78 drop-shadow-[0_1px_8px_rgba(0,0,0,.8)]">${rate.toLocaleString("en-US")} / day</span>
          </div>
        </section>

        <aside className="absolute right-7 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-0 rounded-[1.4rem] border border-white/10 bg-[#090A0B]/72 px-2 py-3 backdrop-blur-xl lg:flex">
          {gallery.map(({ label, icon: Icon, iconClassName }, index) => (
            <button key={label} type="button" onClick={() => setActiveView(index)} aria-label={`Show ${label} view`} aria-pressed={activeView === index} className={`group flex h-14 w-16 flex-col items-center justify-center gap-1 rounded-xl border text-[0.45rem] font-semibold transition sm:w-20 lg:h-[4.65rem] lg:w-[4.65rem] ${activeView === index ? "border-[#d7ff21] bg-[#d7ff21]/8 text-white shadow-[0_0_25px_rgba(215,255,33,.12)]" : "border-transparent text-white/55 hover:bg-white/5 hover:text-white"}`}>
              <span className={`grid size-8 place-items-center transition-colors duration-300 ${activeView === index ? "text-[#d7ff21]" : "text-white/55 group-hover:text-white"}`}>
                <Icon className={iconClassName ?? "size-[1.35rem] stroke-[1.45]"} />
              </span>
              {label}
            </button>
          ))}
        </aside>

      </div>
      {bookingOpen ? <CarBookingModal car={{ brand: car.brand, name, year: car.year, dailyRate: rate }} onClose={() => setBookingOpen(false)} /> : null}
    </main>
  );
}
