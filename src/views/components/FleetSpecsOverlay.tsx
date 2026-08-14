"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  type LucideIcon,
  Leaf,
  Palette,
  Disc3,
  Settings2,
  Timer,
  Wind,
  X,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useState } from "react";
import { assetPath } from "@/lib/asset-path";
import type { Car } from "@/models/car.model";
import { PageFooterNote } from "@/views/components/PageFooterNote";
import { SiteHeader } from "@/views/components/SiteHeader";

type FleetSpecsOverlayProps = {
  car: Car;
  displayBrand: string;
  displayName: string;
  imageSrc: string;
  engineImageSrc?: string;
  engineLabel?: string;
  powerLabel?: string;
  driveLabel?: string;
  onClose: () => void;
  onLogoClick: () => void;
  backLabel?: string;
};

const categories = [
  "Performance",
  "Driving Dynamics & Technology",
  "Wheels, Tires & Brakes",
  "Design & Comfort",
  "Fuel Consumption & Emission",
] as const;

type SpecCategory = (typeof categories)[number];

const getSpecValue = (car: Car, label: string) =>
  car.specs.find((spec) => spec.label === label)?.value ?? "";

const mobileCategoryMeta: Record<
  SpecCategory,
  {
    shortLabel: string;
    icon: LucideIcon;
  }
> = {
  Performance: {
    shortLabel: "Performance",
    icon: Activity,
  },
  "Driving Dynamics & Technology": {
    shortLabel: "Driving Dynamics & Technology",
    icon: Settings2,
  },
  "Wheels, Tires & Brakes": {
    shortLabel: "Wheels, Tires & Brakes",
    icon: Disc3,
  },
  "Design & Comfort": {
    shortLabel: "Design & Comfort",
    icon: Palette,
  },
  "Fuel Consumption & Emission": {
    shortLabel: "Fuel Consumption & Emission",
    icon: Leaf,
  },
};

export function FleetSpecsOverlay({
  car,
  displayBrand,
  displayName,
  imageSrc,
  engineImageSrc,
  engineLabel,
  powerLabel,
  driveLabel,
  onClose,
  onLogoClick,
  backLabel = "Back To Fleet",
}: FleetSpecsOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<SpecCategory>("Performance");
  const power = powerLabel ?? getSpecValue(car, "Power") ?? "640 HP";
  const acceleration = getSpecValue(car, "0-60") || "3.1s";
  const drivetrain = driveLabel ?? getSpecValue(car, "Drive") ?? "AWD";
  const engine = engineLabel ?? "V10";
  const bottomEngineImageSrc = engineImageSrc ?? assetPath("/images/lambo eng.png");
  const interior = getSpecValue(car, "Interior") || "Driver-focused cabin";
  const audio = getSpecValue(car, "Audio") || "Premium audio";
  const topSpeed = getSpecValue(car, "Top Speed") || "325 KM/H";
  const torque = getSpecValue(car, "Torque") || "600 Nm";
  const zeroToHundred = getSpecValue(car, "0-100") || "3.1 s";
  const tires = getSpecValue(car, "Tires") || "Pirelli P Zero";
  const brakes = getSpecValue(car, "Brakes") || "Carbon ceramic";
  const wheels = getSpecValue(car, "Wheels") || "20/21 in forged";
  const comfort = getSpecValue(car, "Comfort") || "Adaptive suspension";
  const design = getSpecValue(car, "Design") || "Aerodynamic body kit";
  const consumption = getSpecValue(car, "Consumption") || "13.7 L/100KM";
  const emissions = getSpecValue(car, "Emissions") || "311 g/km";
  const dailyPrice = new Intl.NumberFormat("en-US").format(car.pricePerDay);
  const description =
    `${displayBrand} ${displayName} blends dramatic presence, sharp dynamics, and premium driver focus.`; 
  const whatsappNumber = "+96170335113";
  const whatsappMessage = `Hello, I'm interested in the ${displayBrand} ${displayName} rental. Please share availability.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
    /[^\d+]/g,
    ""
  )}?text=${encodeURIComponent(whatsappMessage)}`;
  const categoryContent: Record<
    SpecCategory,
    {
      title: string;
      subtitle: string;
      description: string;
      priceLabel: string;
      tiles: { label: string; value: string; detail: string }[];
      mobileRows: {
        label: string;
        value: string;
        detail: string;
        icon: LucideIcon;
      }[];
    }
  > = {
    Performance: {
      title: "Performance",
      subtitle: "Engineered To Thrill",
      description,
      priceLabel: `$${dailyPrice} / day`,
      tiles: [
        { label: "Engine", value: engine, detail: "Naturally aspirated" },
        { label: "Max Power", value: power, detail: "Peak output" },
        { label: "Max Torque", value: torque, detail: "Mid-range punch" },
        { label: "0-100", value: zeroToHundred, detail: "Launch performance" },
        { label: "Top Speed", value: topSpeed, detail: "Maximum velocity" },
        { label: "Drivetrain", value: drivetrain, detail: "Road-ready grip" },
      ],
      mobileRows: [
        { label: "Engine", value: "5.2 L", detail: `${engine} configuration`, icon: Settings2 },
        { label: "Max Power", value: power, detail: "@ 8,000 rpm", icon: Activity },
        { label: "Max Torque", value: torque, detail: "@ 6,500 rpm", icon: Wind },
        { label: "0-100 km/h", value: zeroToHundred, detail: "Acceleration", icon: Timer },
        { label: "Top Speed", value: topSpeed, detail: "(Electronically limited)", icon: Disc3 },
      ],
    },
    "Driving Dynamics & Technology": {
      title: "Dynamics",
      subtitle: "Precision In Motion",
      description,
      priceLabel: `$${dailyPrice} / day`,
      tiles: [
        { label: "0-60", value: acceleration, detail: "Immediate response" },
        { label: "Drivetrain", value: drivetrain, detail: "Traction balance" },
        { label: "Suspension", value: comfort, detail: "Adaptive damping" },
        { label: "Steering", value: "Dynamic ratio", detail: "Sharper turn-in" },
        { label: "Drive Modes", value: "Strada / Sport / Corsa", detail: "Configurable feel" },
        { label: "Displays", value: "Digital cluster", detail: "Driver-focused tech" },
      ],
      mobileRows: [
        { label: "0-60", value: acceleration, detail: "Immediate response", icon: Timer },
        { label: "Drivetrain", value: drivetrain, detail: "Traction balance", icon: Disc3 },
        { label: "Suspension", value: comfort, detail: "Adaptive damping", icon: Settings2 },
        { label: "Steering", value: "Dynamic ratio", detail: "Sharper turn-in", icon: Activity },
        { label: "Drive Modes", value: "Strada / Sport / Corsa", detail: "Configurable feel", icon: Palette },
      ],
    },
    "Wheels, Tires & Brakes": {
      title: "Running Gear",
      subtitle: "Grip And Stopping Power",
      description,
      priceLabel: `$${dailyPrice} / day`,
      tiles: [
        { label: "Wheels", value: wheels, detail: "Performance setup" },
        { label: "Tires", value: tires, detail: "High-grip compound" },
        { label: "Brakes", value: brakes, detail: "Fade-resistant stopping" },
        { label: "Front Setup", value: "Ventilated discs", detail: "Track-capable" },
        { label: "Rear Setup", value: "Multi-piston calipers", detail: "Balanced braking" },
        { label: "Chassis", value: "Lightweight alloy", detail: "Sharper response" },
      ],
      mobileRows: [
        { label: "Wheels", value: wheels, detail: "Performance setup", icon: Disc3 },
        { label: "Tires", value: tires, detail: "High-grip compound", icon: Disc3 },
        { label: "Brakes", value: brakes, detail: "Fade-resistant stopping", icon: Activity },
        { label: "Front Setup", value: "Ventilated discs", detail: "Track-capable", icon: Settings2 },
        { label: "Rear Setup", value: "Multi-piston calipers", detail: "Balanced braking", icon: Settings2 },
      ],
    },
    "Design & Comfort": {
      title: "Design & Comfort",
      subtitle: "Driver-Focused Luxury",
      description,
      priceLabel: `$${dailyPrice} / day`,
      tiles: [
        { label: "Cabin", value: interior, detail: "Luxury finish" },
        { label: "Audio", value: audio, detail: "Immersive sound" },
        { label: "Seats", value: "Sport bucket seats", detail: "Supportive posture" },
        { label: "Comfort", value: comfort, detail: "Everyday usability" },
        { label: "Design", value: design, detail: "Aggressive stance" },
        { label: "Roof", value: "Open-top spyder", detail: "Convertible drama" },
      ],
      mobileRows: [
        { label: "Cabin", value: interior, detail: "Luxury finish", icon: Palette },
        { label: "Audio", value: audio, detail: "Immersive sound", icon: Settings2 },
        { label: "Seats", value: "Sport bucket seats", detail: "Supportive posture", icon: Disc3 },
        { label: "Comfort", value: comfort, detail: "Everyday usability", icon: Activity },
        { label: "Roof", value: "Open-top spyder", detail: "Convertible drama", icon: Wind },
      ],
    },
    "Fuel Consumption & Emission": {
      title: "Efficiency",
      subtitle: "Operational Profile",
      description,
      priceLabel: `$${dailyPrice} / day`,
      tiles: [
        { label: "Consumption", value: consumption, detail: "Combined estimate" },
        { label: "Emissions", value: emissions, detail: "CO2 output" },
        { label: "Fuel Type", value: "Premium unleaded", detail: "Required octane" },
        { label: "Tank", value: "83 L", detail: "Touring range" },
        { label: "Range", value: getSpecValue(car, "Range") || "410 mi", detail: "Extended driving" },
        { label: "Compliance", value: "EU / GCC spec", detail: "Market-ready setup" },
      ],
      mobileRows: [
        { label: "Consumption", value: consumption, detail: "Combined estimate", icon: Leaf },
        { label: "Emissions", value: emissions, detail: "CO2 output", icon: Wind },
        { label: "Fuel Type", value: "Premium unleaded", detail: "Required octane", icon: Settings2 },
        { label: "Tank", value: "83 L", detail: "Touring range", icon: Disc3 },
        { label: "Range", value: getSpecValue(car, "Range") || "410 mi", detail: "Extended driving", icon: Activity },
      ],
    },
  };
  const activeContent = categoryContent[activeCategory];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black text-[#F5F5F5]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.3)_34%,rgba(0,0,0,0.72)_58%,rgba(0,0,0,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.32)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_40%_at_82%_24%,rgba(255,255,255,0.04),transparent_62%)]" />
      </div>

      <div className="relative z-10 mx-auto flex h-dvh w-full max-w-350 flex-col overflow-hidden px-0 pb-0 pt-0 sm:px-10 sm:pb-6 sm:pt-6">
        <div className="flex min-h-0 flex-1 flex-col sm:hidden">
          <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="bg-[#050505] px-0 pb-6 pt-2">
              <div className="px-4 pb-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onLogoClick}
                    aria-label="Veltro home"
                    className="inline-flex items-center"
                  >
                    <Image
                      src={assetPath("/icons/veltro_logo.svg")}
                      alt="Veltro"
                      width={420}
                      height={84}
                      className="h-14 w-auto object-contain"
                      priority
                      unoptimized
                    />
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close specifications"
                    className="inline-flex h-10 w-10 items-center justify-center text-white/88"
                  >
                    <X className="h-7 w-7 stroke-[1.5]" />
                  </button>
                </div>
              </div>

              <div className="mt-[1cm] px-5 pb-3">
                <div className="translate-x-[0.4cm] font-body text-[0.64rem] uppercase tracking-[0.18em] text-white/62">
                  <span className="text-[var(--brand-red)]">01</span>
                  <span className="px-2 text-white/34">/</span>
                  <span>{displayBrand}</span>
                </div>
                <h2 className="mt-2 translate-x-[0.3cm] font-display text-[1.72rem] font-black uppercase leading-[0.9] tracking-[-0.05em] text-white">
                  {displayName}
                </h2>
              </div>

              <div className="px-5 pt-1">
                <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex w-max gap-2.5">
                  {categories.map((category) => {
                    const active = category === activeCategory;
                    const meta = mobileCategoryMeta[category];
                    const CategoryIcon = meta.icon;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`relative flex h-[72px] w-[116px] shrink-0 snap-start flex-col items-center justify-center gap-2 px-3 pb-3 pt-3 text-center transition ${
                          active
                            ? "text-[var(--brand-red)]"
                            : "text-white/72"
                        }`}
                      >
                        {active ? (
                          <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[var(--brand-red)]" />
                        ) : null}
                        <CategoryIcon className={`h-4.5 w-4.5 ${active ? "text-[var(--brand-red)]" : "text-white/65"}`} strokeWidth={1.7} />
                        <span className={`font-body text-[0.42rem] uppercase leading-[1.3] tracking-[0.08em] ${active ? "text-[var(--brand-red)]" : "text-white/68"}`}>
                          {meta.shortLabel}
                        </span>
                      </button>
                    );
                  })}
                  </div>
                </div>
              </div>

              <div className="px-5 pt-4">
                <div className="rounded-[22px] border border-white/7 bg-[radial-gradient(120%_100%_at_0%_0%,rgba(255,255,255,0.02),rgba(255,255,255,0)_48%),linear-gradient(180deg,#0b0b0c_0%,#070708_100%)] px-5 pb-5 pt-5 shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
                  <h3 className="font-display text-[1.6rem] font-medium uppercase tracking-[0.08em] text-white">
                    {activeContent.title}
                  </h3>
                  <div className="mt-2 h-px w-10 bg-[var(--brand-red)]" />
                  <p className="mt-2 text-[0.82rem] leading-[1.36] text-white/58">
                    {activeContent.description}
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {activeContent.mobileRows.map((row) => {
                      const RowIcon = row.icon;

                      return (
                        <div
                          key={`${activeCategory}-${row.label}`}
                          className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-[#090909] px-3 py-3"
                        >
                          <RowIcon className="h-5 w-5 shrink-0 text-white/70" strokeWidth={1.5} />

                          <div className="min-w-0 flex-1">
                            <div className="font-body text-[0.62rem] uppercase tracking-[0.18em] text-white">
                              {row.label}
                            </div>
                            <div className="mt-0.5 text-[0.8rem] leading-[1.24] text-white/54">
                              {row.detail}
                            </div>
                          </div>

                          <div className="shrink-0 pl-2 font-display text-[0.82rem] uppercase tracking-[0.08em] text-[var(--brand-red)]">
                            {row.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex sm:shrink-0">
          <SiteHeader
            title="Fleet"
            className="shrink-0"
            onLogoClick={onLogoClick}
            titleTone="light"
            compact
          />
        </div>

        <div className="mt-[calc(1rem-0.1cm)] hidden min-h-0 flex-1 flex-col gap-3 sm:flex xl:mt-[calc(1.25rem-0.1cm)] xl:grid xl:grid-cols-[minmax(0,0.98fr)_minmax(470px,1.02fr)] xl:grid-rows-[minmax(0,0.94fr)] xl:gap-4">
          <section className="relative min-h-0 overflow-hidden border border-[#242428] bg-[#0A0A0B]">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `url("${imageSrc}")`,
                backgroundPosition: "left 0 top 0",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,0,3,0.28)_0%,rgba(0,0,0,0.34)_48%,rgba(0,0,0,0.78)_100%)]" />
            <div className="relative z-10 flex h-full flex-col p-4.5 sm:p-6">
              <button
                type="button"
                onClick={onClose}
                className="group inline-flex w-fit items-center gap-3 text-[0.68rem] uppercase tracking-[0.22em] text-white/70 transition-colors duration-200 hover:text-white"
              >
                <span
                  aria-hidden="true"
                  className="text-[0.9rem] leading-none text-[var(--brand-red)] transition-transform duration-200 group-hover:-translate-x-0.5"
                >
                  {"<"}
                </span>
                <span>{backLabel}</span>
              </button>

              <div className="mt-auto max-w-[20rem]">
                <p className="type-eyebrow text-white/62">{displayBrand}</p>
                <h2 className="mt-2 font-display text-[2.1rem] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white sm:text-[2.85rem]">
                  {displayName}
                </h2>
                <p className="mt-2.5 font-display text-[0.76rem] uppercase tracking-[0.16em] text-white/74">
                  <span>{engine}</span>
                  <span className="px-2 text-[var(--brand-red)]">/</span>
                  <span>{power}</span>
                  <span className="px-2 text-[var(--brand-red)]">/</span>
                  <span>{drivetrain}</span>
                </p>
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display mt-4 inline-flex min-w-[12.8rem] items-center justify-center border border-[var(--brand-red)] bg-[var(--brand-red)] px-4.5 py-3 text-[0.68rem] font-medium uppercase tracking-[0.19em] text-white transition hover:brightness-110"
                >
                  <span>WhatsApp</span>
                </Link>
              </div>
            </div>
          </section>

          <section className="grid min-h-0 gap-3 xl:grid-rows-[minmax(0,1fr)_124px]">
            <div className="grid min-h-0 overflow-hidden border border-white/8 bg-[#0A0A0B] md:grid-cols-[170px_minmax(0,1fr)]">
              <div className="grid auto-rows-fr border-b border-white/8 md:border-b-0 md:border-r md:border-white/8">
                {categories.map((category) => {
                  const active = category === activeCategory;

                  return (
                    <button
                      type="button"
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`flex w-full items-center justify-start border-b border-white/8 px-5 py-3 text-left last:border-b-0 sm:px-6 ${
                        active ? "border-l border-l-[var(--brand-red)] bg-white/[0.02]" : ""
                      }`}
                    >
                      <div
                        className={`font-display text-[0.64rem] uppercase tracking-[0.17em] ${
                          active ? "text-[var(--brand-red)]" : "text-white/48"
                        }`}
                      >
                        {category}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex min-h-0 flex-col p-4.5 sm:p-5.5">
                <div className="pb-2.5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-[1.5rem] font-medium uppercase tracking-[0.08em] text-white sm:text-[1.7rem]">
                      {activeContent.title}
                    </h3>
                    <span className="translate-y-[0.32cm] font-display text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-white/88">
                      {activeContent.priceLabel}
                    </span>
                  </div>
                  <p className="mt-1 font-display text-[0.66rem] uppercase tracking-[0.18em] text-white/42">
                    {activeContent.subtitle}
                  </p>
                  <p className="mt-2 max-w-[30rem] text-[0.78rem] leading-[1.55] text-white/56">
                    {activeContent.description}
                  </p>
                </div>

                <div className="grid flex-1 grid-cols-1 border-t border-white/8 md:grid-cols-2">
                  {activeContent.tiles.map((tile, index) => (
                    <div
                      key={`${displayName}-${activeCategory}-${tile.label}`}
                      className={`flex min-h-[76px] border-b border-white/8 px-1 py-2.5 sm:px-2 ${
                        index % 2 === 0 ? "md:border-r md:border-white/8 md:pr-6" : "md:pl-6"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-display text-[0.58rem] uppercase tracking-[0.18em] text-white/42">
                          {tile.label}
                        </div>
                        <div className="mt-1 font-display text-[1.08rem] font-medium leading-[1.05] text-white">
                          {tile.value}
                        </div>
                        <div className="mt-0.5 text-[0.58rem] uppercase tracking-[0.13em] text-white/36">
                          {tile.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border border-white/8 bg-[#0A0A0B]">
              <Image
                src={bottomEngineImageSrc}
                alt=""
                fill
                sizes="(max-width: 1279px) 100vw, 45vw"
                className="object-cover object-center"
              />
            </div>
          </section>
        </div>
      </div>
      <PageFooterNote />
    </div>
  );
}


