"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { assetPath } from "@/lib/asset-path";
import type { Car } from "@/models/car.model";
import { SiteHeader } from "@/views/components/SiteHeader";

type FleetSpecsOverlayProps = {
  car: Car;
  displayBrand: string;
  displayName: string;
  imageSrc: string;
  engineLabel?: string;
  powerLabel?: string;
  driveLabel?: string;
  onClose: () => void;
  onLogoClick: () => void;
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

export function FleetSpecsOverlay({
  car,
  displayBrand,
  displayName,
  imageSrc,
  engineLabel,
  powerLabel,
  driveLabel,
  onClose,
  onLogoClick,
}: FleetSpecsOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<SpecCategory>("Performance");
  const power = powerLabel ?? getSpecValue(car, "Power") ?? "640 HP";
  const acceleration = getSpecValue(car, "0-60") || "3.1s";
  const drivetrain = driveLabel ?? getSpecValue(car, "Drive") ?? "AWD";
  const engine = engineLabel ?? "V10";
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
    },
  };
  const activeContent = categoryContent[activeCategory];

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-black text-[#F5F5F5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.3)_34%,rgba(0,0,0,0.72)_58%,rgba(0,0,0,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.32)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_40%_at_82%_24%,rgba(255,255,255,0.04),transparent_62%)]" />
      </div>

      <div className="relative z-10 mx-auto flex h-dvh w-full max-w-350 flex-col overflow-hidden px-6 pb-6 pt-5 sm:px-10 sm:pt-6">
        <SiteHeader
          title="Fleet"
          className="shrink-0"
          onLogoClick={onLogoClick}
          titleTone="light"
          compact
        />

        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 xl:mt-5 xl:grid xl:grid-cols-[minmax(0,0.98fr)_minmax(470px,1.02fr)] xl:gap-5">
          <section className="relative min-h-0 overflow-hidden border border-[#242428] bg-white">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `url("${assetPath("/images/lambo specs.png")}")`,
                backgroundPosition: "left top",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,0,3,0.28)_0%,rgba(0,0,0,0.34)_48%,rgba(0,0,0,0.78)_100%)]" />
            <div className="relative z-10 flex h-full flex-col p-5 sm:p-7">
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
                <span>Back To Fleet</span>
              </button>

              <div className="mt-auto max-w-[21rem]">
                <p className="type-eyebrow text-white/62">{displayBrand}</p>
                <h2 className="mt-2 font-display text-[2.45rem] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white sm:text-[3.55rem]">
                  {displayName}
                </h2>
                <p className="mt-3 font-display text-[0.82rem] uppercase tracking-[0.16em] text-white/74">
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
                  className="font-display mt-5 inline-flex min-w-[13.85rem] items-center justify-center border border-[var(--brand-red)] bg-[var(--brand-red)] px-5 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.19em] text-white transition hover:brightness-110"
                >
                  <span>WhatsApp</span>
                </Link>
              </div>
            </div>
          </section>

          <section className="grid min-h-0 gap-3 xl:grid-rows-[minmax(0,1fr)_160px]">
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

              <div className="flex min-h-0 flex-col p-5 sm:p-6">
                <div className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-[1.65rem] font-medium uppercase tracking-[0.08em] text-white sm:text-[1.85rem]">
                      {activeContent.title}
                    </h3>
                    <span className="translate-y-[0.4cm] font-display text-[0.9rem] font-semibold uppercase tracking-[0.08em] text-white/88">
                      {activeContent.priceLabel}
                    </span>
                  </div>
                  <p className="mt-1 font-display text-[0.7rem] uppercase tracking-[0.18em] text-white/42">
                    {activeContent.subtitle}
                  </p>
                  <p className="mt-2 max-w-[30rem] text-[0.82rem] leading-[1.6] text-white/56">
                    {activeContent.description}
                  </p>
                </div>

                <div className="grid flex-1 grid-cols-1 border-t border-white/8 md:grid-cols-2">
                  {activeContent.tiles.map((tile, index) => (
                    <div
                      key={`${displayName}-${activeCategory}-${tile.label}`}
                      className={`flex min-h-[84px] border-b border-white/8 px-1 py-3 sm:px-2 ${
                        index % 2 === 0 ? "md:border-r md:border-white/8 md:pr-6" : "md:pl-6"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-display text-[0.62rem] uppercase tracking-[0.18em] text-white/42">
                          {tile.label}
                        </div>
                        <div className="mt-1 font-display text-[1.18rem] font-medium leading-[1.05] text-white">
                          {tile.value}
                        </div>
                        <div className="mt-0.5 text-[0.62rem] uppercase tracking-[0.13em] text-white/36">
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
                src={assetPath("/images/lambo eng.png")}
                alt=""
                fill
                sizes="(max-width: 1279px) 100vw, 45vw"
                className="object-cover object-center opacity-72"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.38)_100%)]" />
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}


