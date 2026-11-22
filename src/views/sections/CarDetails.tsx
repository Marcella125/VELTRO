"use client";

import { useEffect, useState, type ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CarProfile,
  Engine,
  Gauge,
  GearSix,
  Lightning,
  Seat,
  Timer,
} from "@phosphor-icons/react";
import { assetPath } from "@/lib/asset-path";
import type { Car } from "@/models/car.model";

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
    rate: 3300,
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
  const reduceMotion = useReducedMotion();

  const name = override?.name ?? car.name.replace(new RegExp(`^${car.brand}\\s*`, "i"), "");
  const description = override?.description ?? car.description ?? `${car.year} ${car.brand} ${name}, prepared for an exceptional drive.`;
  const rate = override?.rate ?? car.pricePerDay;
  const bookingHref = `https://wa.me/96170335467?text=${encodeURIComponent(`I would like to book the ${car.brand} ${name}.`)}`;

  const performance = [
    { icon: Lightning, value: `${car.horsepower || 0} HP`, label: "Power output" },
    { icon: Timer, value: override?.acceleration ?? "On request", label: "Acceleration 0–100 km/h" },
    { icon: Gauge, value: override?.topSpeed ?? "On request", label: "Maximum speed" },
    { icon: GearSix, value: car.transmission || "Automatic", label: override?.torque ? `${override.torque} torque` : "Transmission" },
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
      <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
        <div className="mx-auto flex h-[4.25rem] max-w-[92rem] items-center px-4 sm:h-[4.75rem] sm:px-8 lg:px-12">
          <Link href="/" aria-label="Go to Veltro home" className="relative shrink-0 lg:left-[-1cm]">
            <Image src={assetPath("/icons/veltro_logo.svg")} alt="Veltro" width={680} height={136} priority unoptimized className="h-10 w-auto sm:h-14" />
          </Link>
          <nav className="ml-auto hidden items-center gap-9 lg:flex lg:translate-x-[1cm]">
            {[[returnHref, "Fleet"], ["/#experience", "Experience"], ["/#contact", "Contact"]].map(([href, label]) => (
              <Link key={label} href={href} className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white/66 transition hover:text-[#d7ff21]">{label}</Link>
            ))}
          </nav>
          <a href={bookingHref} target="_blank" rel="noreferrer" className="ml-10 hidden h-10 items-center gap-3 rounded-lg bg-[#d7ff21] px-6 text-[0.65rem] font-extrabold uppercase tracking-[0.13em] text-black transition hover:bg-white lg:flex lg:translate-x-[1cm]">
            Inquire <ArrowRight size={15} />
          </a>
          <Link href={returnHref} aria-label={returnLabel} className="ml-auto grid size-10 place-items-center rounded-full border border-white/20 text-white/70 lg:hidden">
            <ArrowLeft size={17} />
          </Link>
        </div>
      </header>

      <div className="absolute inset-0">
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

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[100rem] flex-col px-5 pb-24 pt-24 sm:px-8 sm:pt-28 lg:h-full lg:min-h-0 lg:px-12 lg:pb-8 lg:pt-28">
        <section className="max-w-[27rem]">
          <Link href={returnHref} className="mb-5 inline-flex items-center gap-2 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-white/55 transition hover:text-[#d7ff21]">
            <ArrowLeft size={14} /> Back to fleet
          </Link>
          <motion.div initial={reduceMotion ? false : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center gap-4 text-[0.52rem] font-bold uppercase tracking-[0.42em] text-white/65">
              {car.brand}<span className="h-px w-10 bg-[#d7ff21]" />
            </div>
            <h1 className="mt-3 text-[clamp(1.55rem,2.8vw,2.75rem)] font-extrabold uppercase italic leading-[0.9] tracking-[-0.04em]">{name}</h1>
            <p className="mt-3 max-w-[22rem] text-[0.62rem] leading-[1.65] text-white/58 sm:text-[0.68rem]">{description}</p>
          </motion.div>

          <div className="mt-7 grid gap-2 sm:mt-9">
            {performance.map(({ icon: Icon, value, label }, index) => (
              <motion.div key={label} initial={reduceMotion ? false : { opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + index * 0.07, duration: 0.5 }} className="relative grid grid-cols-[3rem_1fr] items-center gap-3 py-2.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-[17rem] after:bg-white/10 last:after:hidden">
                <span className="grid size-9 place-items-center rounded-lg border border-white/18 bg-black/20 text-[#d7ff21] backdrop-blur-sm"><Icon size={18} weight="light" /></span>
                <div><strong className="block text-[1.35rem] font-semibold leading-none tracking-[-0.04em]">{value}</strong><span className="mt-1 block text-[0.48rem] uppercase tracking-[0.1em] text-white/43">{label}</span></div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <a href={bookingHref} target="_blank" rel="noreferrer" className="flex h-11 min-w-44 items-center justify-center gap-3 rounded-lg bg-[#d7ff21] px-6 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-black transition hover:bg-white">Reserve now <ArrowRight size={15} /></a>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/78 drop-shadow-[0_1px_8px_rgba(0,0,0,.8)]">${rate.toLocaleString("en-US")} / day</span>
          </div>
        </section>

        <aside className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-1 rounded-2xl border border-white/10 bg-[#090A0B]/72 p-1.5 backdrop-blur-xl lg:absolute lg:bottom-auto lg:left-auto lg:right-7 lg:top-1/2 lg:-translate-x-0 lg:-translate-y-1/2 lg:flex-col lg:gap-0 lg:rounded-[1.4rem] lg:px-2 lg:py-3">
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
    </main>
  );
}
