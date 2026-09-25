"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, CarFront, Gauge, Palette, Settings2, Timer, Zap } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { PrimaryButton } from "@/components/ui/primary-button";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import type { Car } from "@/models/car.model";

type CarDetailsProps = { car: Car };

type VehiclePresentation = {
  brand: string;
  name: string;
  description: string;
  images: { src: string; label: string; position?: string }[];
  year: number;
  body: string;
  rate?: number;
  color: string;
  engine: string;
  power: string;
  transmission: string;
  topSpeed: string;
  acceleration: string;
};

const presentations: Record<string, VehiclePresentation> = {
  "obsidian-gt": {
    brand: "Lamborghini",
    name: "EVO Spyder",
    description: "Open-air Italian performance, shaped around a naturally aspirated V10 and razor-sharp all-wheel-drive control.",
    images: [
      { src: assetPath("/images/lambo specs.png"), label: "Exterior" },
      { src: assetPath("/lambo fleet.png"), label: "Front profile" },
      { src: assetPath("/images/lambo eng.png"), label: "V10 engine" },
    ],
    year: 2023, body: "Spyder", rate: 3300, color: "Black matte", engine: "5.2L V10", power: "640 hp", transmission: "7-speed DCT", topSpeed: "325 km/h", acceleration: "3.1 sec",
  },
  "crimson-eclipse": {
    brand: "Porsche", name: "911 Carrera 4S",
    description: "An everyday supercar with timeless lines, all-wheel-drive confidence and a responsive twin-turbo flat-six.",
    images: [
      { src: assetPath("/images/porshe specs.png"), label: "Exterior" },
      { src: assetPath("/porshe fleet.png"), label: "Front profile" },
      { src: assetPath("/images/porshe eng.png"), label: "Flat-six engine" },
    ],
    year: 2023, body: "Coupe", color: "Jet black", engine: "3.0L flat-six", power: "450 hp", transmission: "8-speed PDK", topSpeed: "306 km/h", acceleration: "3.4 sec",
  },
  "onyx-sabre": {
    brand: "Ferrari", name: "296 GTB",
    description: "A compact mid-engine berlinetta pairing instant hybrid response with the emotion of a Ferrari V6.",
    images: [
      { src: assetPath("/images/ferrari specs.png"), label: "Exterior" },
      { src: assetPath("/ferrari fleet.png"), label: "Front profile" },
      { src: assetPath("/images/ferrari eng.png"), label: "Hybrid V6" },
    ],
    year: 2024, body: "Coupe", color: "Rosso Corsa", engine: "3.0L V6 hybrid", power: "830 hp", transmission: "8-speed DCT", topSpeed: "330 km/h", acceleration: "2.9 sec",
  },
  "velour-phantom": {
    brand: "Lamborghini", name: "Huracan STO",
    description: "Road-legal race engineering, dramatic aerodynamics and rear-wheel-drive V10 performance in its purest form.",
    images: [
      { src: assetPath("/images/lambo specs.png"), label: "Exterior" },
      { src: assetPath("/lambo fleet.png"), label: "Front profile" },
      { src: assetPath("/images/lambo eng.png"), label: "V10 engine" },
    ],
    year: 2022, body: "Coupe", color: "Nero Noctis", engine: "5.2L V10", power: "640 hp", transmission: "7-speed DCT", topSpeed: "310 km/h", acceleration: "3.0 sec",
  },
  "ember-revenant": {
    brand: "Mercedes-AMG", name: "GT R",
    description: "A front-mid-engine grand tourer with motorsport-bred dynamics and a thunderous handcrafted V8 biturbo.",
    images: [
      { src: assetPath("/images/porshe specs.png"), label: "Exterior" },
      { src: assetPath("/porshe fleet.png"), label: "Front profile" },
      { src: assetPath("/images/porshe eng.png"), label: "V8 biturbo" },
    ],
    year: 2024, body: "Coupe", color: "Obsidian black", engine: "4.0L V8 biturbo", power: "585 hp", transmission: "7-speed DCT", topSpeed: "318 km/h", acceleration: "3.6 sec",
  },
  "midnight-regal": {
    brand: "BMW", name: "M8 Competition",
    description: "Luxury grand touring meets M division performance, with immense V8 power and sure-footed xDrive traction.",
    images: [
      { src: assetPath("/images/ferrari specs.png"), label: "Exterior" },
      { src: assetPath("/ferrari fleet.png"), label: "Front profile" },
      { src: assetPath("/images/ferrari eng.png"), label: "V8 engine" },
    ],
    year: 2023, body: "Coupe", color: "Black sapphire", engine: "4.4L V8 biturbo", power: "625 hp", transmission: "8-speed auto", topSpeed: "305 km/h", acceleration: "3.2 sec",
  },
};

const whatsappNumber = "+96170335113";

export function CarDetails({ car }: CarDetailsProps) {
  const router = useRouter();
  const [isDockOpen, setIsDockOpen] = useState(true);
  const presentation = presentations[car.slug] ?? presentations["obsidian-gt"];

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 640px)");
    const syncMenu = () => setIsDockOpen(desktop.matches);
    const frame = window.requestAnimationFrame(syncMenu);
    desktop.addEventListener("change", syncMenu);
    return () => {
      window.cancelAnimationFrame(frame);
      desktop.removeEventListener("change", syncMenu);
    };
  }, []);

  const navigateTo = (href: string) => router.push(href);
  const whatsappUrl = useMemo(() => {
    const message = `Hi, I'm interested in the ${presentation.brand} ${presentation.name}. Please share availability and pricing.`;
    return `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  }, [presentation.brand, presentation.name]);

  const specs = [
    { label: "Year", value: String(presentation.year), icon: CalendarDays },
    { label: "Color", value: presentation.color, icon: Palette },
    { label: "Engine", value: presentation.engine, icon: Settings2 },
    { label: "Power", value: presentation.power, icon: Zap },
    { label: "Transmission", value: presentation.transmission, icon: Settings2 },
    { label: "Body", value: presentation.body, icon: CarFront },
    { label: "Top speed", value: presentation.topSpeed, icon: Gauge },
    { label: "0–100 km/h", value: presentation.acceleration, icon: Timer },
  ];

  const handleMenuSelect = (id: string) => {
    const routes: Record<string, string> = { home: "/#home", fleet: "/fleet/all", blogs: "/#blogs", mission: "/#mission", contact: "/#contact", faq: "/#faq" };
    if (routes[id]) navigateTo(routes[id]);
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-black text-white lg:h-dvh lg:overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <Image src={assetPath("/images/bgcar.png")} alt="" fill priority className="object-cover object-center opacity-35" />
        <div className="absolute inset-0 bg-[radial-gradient(85%_75%_at_42%_42%,rgba(88,88,88,0.2),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(177,18,38,0.12),transparent_28%,transparent_72%,rgba(177,18,38,0.06))]" />
        <div className="absolute inset-0 bg-black/58 shadow-[inset_0_0_150px_rgba(0,0,0,0.82)]" />
      </div>

      <header className="relative z-50 hidden h-[84px] border-b border-white/10 bg-black/82 backdrop-blur-md lg:block">
        <div className="relative flex h-full w-full items-center px-[4vw]">
          <Link href="/" aria-label="Veltro home" className="flex shrink-0 items-center">
            <Image src={assetPath("/icons/veltro_logo.svg")} alt="Veltro" width={680} height={136} priority unoptimized className="h-14 w-auto object-contain" />
          </Link>

          <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-10 xl:gap-12" aria-label="Primary navigation">
            {[
              ["Fleet", "/fleet/all"],
              ["Experience", "/#experience"],
              ["About", "/#mission"],
              ["Journal", "/#blogs"],
              ["FAQ", "/#faq"],
              ["Contact", "/#contact"],
            ].map(([label, href]) => (
              <Link key={label} href={href} className={`text-[0.6rem] font-medium uppercase tracking-[0.2em] transition-colors hover:text-white ${label === "Fleet" ? "text-white" : "text-white/68"}`}>
                {label}
              </Link>
            ))}
          </nav>

          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="ml-auto inline-flex h-11 min-w-[162px] items-center justify-center gap-4 bg-[var(--brand-red)] px-6 text-[0.59rem] font-semibold uppercase tracking-[0.19em] text-white transition-colors hover:bg-[var(--brand-red-dark)]">
            Book a Car
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden="true" />
          </a>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-350 flex-col px-5 pb-6 pt-5 max-[390px]:px-4 sm:px-10 sm:pt-6 lg:h-[calc(100dvh-84px)] lg:min-h-0 lg:pb-7 lg:pt-4">
        <div className="relative z-50 shrink-0 lg:hidden">
          <InternalPageHeader title={`${presentation.brand} ${presentation.name}`} isDockOpen={isDockOpen} onOpenChange={setIsDockOpen} onSelect={handleMenuSelect} onLogoClick={() => navigateTo("/")} />
        </div>

        <div className="mt-5 grid min-h-0 flex-1 gap-6 lg:mt-0 lg:grid-cols-[minmax(0,1.75fr)_minmax(310px,0.75fr)] lg:gap-7 xl:gap-9">
          <section className="flex min-h-0 flex-col">
            <div className="mb-4 flex shrink-0 flex-col justify-between gap-3 sm:flex-row sm:items-end lg:mb-3">
              <div>
                <p className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--brand-red)]">{presentation.brand} · {presentation.body}</p>
                <h1 className="mt-1 font-display text-[2rem] font-bold uppercase leading-[0.92] tracking-[-0.055em] text-white sm:text-[2.7rem] xl:text-[3.15rem]">{presentation.name}<span className="text-[var(--brand-red)]">.</span></h1>
              </div>
              <p className="max-w-md text-[0.7rem] leading-5 text-white/58 sm:text-right xl:text-[0.76rem]">{presentation.description}</p>
            </div>

            <div className="grid min-h-[520px] flex-1 grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,1.9fr)_minmax(190px,0.85fr)] sm:grid-rows-2 lg:min-h-0">
              {presentation.images.map((image, index) => (
                <figure key={image.src} className={`group relative min-h-56 overflow-hidden border border-white/10 bg-[#090909] ${index === 0 ? "sm:row-span-2" : ""}`}>
                  <Image src={image.src} alt={`${presentation.brand} ${presentation.name} ${image.label}`} fill priority sizes={index === 0 ? "(max-width: 1023px) 100vw, 58vw" : "(max-width: 1023px) 100vw, 24vw"} className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] ${image.position ?? "object-center"}`} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.72)_100%)]" />
                  <figcaption className="absolute bottom-3 left-3 flex items-center gap-2 text-[0.55rem] font-medium uppercase tracking-[0.2em] text-white/75"><span className="text-[var(--brand-red)]">0{index + 1}</span><span className="h-px w-5 bg-white/35" />{image.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <aside className="flex min-h-0 flex-col border border-white/10 bg-black/45 p-4 backdrop-blur-md sm:p-5 lg:overflow-hidden xl:p-6">
            <div className="flex shrink-0 items-start justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-[0.56rem] font-medium uppercase tracking-[0.22em] text-white/42">Rent per day</p>
                <div className="mt-1 flex items-baseline gap-2"><span className="font-display text-[1.75rem] font-semibold leading-none text-white xl:text-[2rem]">${(presentation.rate ?? car.pricePerDay).toLocaleString("en-US")}</span></div>
              </div>
              <div className="flex items-center gap-2 pt-1 text-[0.55rem] font-semibold uppercase tracking-[0.17em] text-emerald-300/90"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.75)]" />Available</div>
            </div>

            <div className="my-4 grid flex-1 grid-cols-2 content-stretch gap-px border border-white/10 bg-white/10">
              {specs.map((spec) => {
                const Icon = spec.icon;
                return <div key={spec.label} className="flex min-h-19 flex-col justify-between bg-[#0b0b0b]/95 p-3 xl:min-h-20 xl:p-3.5"><Icon className="h-4 w-4 text-[var(--brand-red)]" strokeWidth={1.6} aria-hidden="true" /><div className="mt-2.5"><p className="text-[0.76rem] font-semibold leading-tight text-white/92 xl:text-[0.84rem]">{spec.value}</p><p className="mt-1 text-[0.46rem] font-medium uppercase tracking-[0.17em] text-white/38">{spec.label}</p></div></div>;
              })}
            </div>

            <div className="shrink-0 space-y-2.5">
              <PrimaryButton href={whatsappUrl} target="_blank" rel="noreferrer" className="w-full"><Image src={assetPath("/icons/whatsapp.svg")} alt="" width={16} height={16} className="h-4 w-4" />Book on WhatsApp</PrimaryButton>
              <button type="button" onClick={() => navigateTo("/fleet/all")} className="h-10 w-full border border-white/12 text-[0.58rem] font-medium uppercase tracking-[0.18em] text-white/62 transition hover:border-white/30 hover:text-white">Back to fleet</button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
