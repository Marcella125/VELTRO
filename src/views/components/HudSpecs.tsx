"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type SpecItem = {
  label: string;
  value: string;
};

type HudMeter = {
  label: string;
  value: number;
  max: number;
  unit?: string;
};

type HudCategory = {
  id: string;
  label: string;
  icon: string;
  specs?: SpecItem[];
  meters?: HudMeter[];
  highlights?: string[];
};

export type HudSpecsData = {
  title: string;
  categories: HudCategory[];
};

type HudSpecsProps = {
  data: HudSpecsData;
  accentColor?: string;
};

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let frameId = 0;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / duration);
      setValue(Math.round(target * progress));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [target, duration]);

  return value;
}

export function HudTabs({
  categories,
  activeId,
  onChange,
  accentColor = "#b3242d",
}: {
  categories: HudCategory[];
  activeId: string;
  onChange: (id: string) => void;
  accentColor?: string;
}) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = categories.findIndex((cat) => cat.id === activeId);
      if (currentIndex === -1) return;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % categories.length;
        onChange(categories[nextIndex].id);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        const nextIndex = (currentIndex - 1 + categories.length) % categories.length;
        onChange(categories[nextIndex].id);
      }
      if (event.key === "Home") {
        event.preventDefault();
        onChange(categories[0].id);
      }
      if (event.key === "End") {
        event.preventDefault();
        onChange(categories[categories.length - 1].id);
      }
    },
    [activeId, categories, onChange]
  );

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
      role="tablist"
      aria-label="Spec categories"
      onKeyDown={handleKeyDown}
    >
      {categories.map((category) => {
        const isActive = category.id === activeId;
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`spec-panel-${category.id}`}
            className={`group flex min-w-45 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 lg:min-w-0 lg:w-full ${
              isActive
                ? "border-white/15 bg-white/10 text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
                : "border-white/5 bg-white/6 text-white/60 hover:border-white/10 hover:text-white"
            }`}
            onClick={() => onChange(category.id)}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.2em]"
              style={{
                color: isActive ? accentColor : "inherit",
              }}
              aria-hidden="true"
            >
              {category.icon}
            </span>
            <span className="text-sm font-medium tracking-[0.02em]">
              {category.label}
            </span>
            {isActive && (
              <span
                className="ml-auto hidden h-10 w-0.5 rounded-full lg:block"
                style={{ backgroundColor: accentColor }}
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function SpecPanel({
  category,
  accentColor = "#b3242d",
}: {
  category: HudCategory;
  accentColor?: string;
}) {
  const hasSpecs = category.specs && category.specs.length > 0;
  const hasMeters = category.meters && category.meters.length > 0;
  const hasHighlights = category.highlights && category.highlights.length > 0;

  return (
    <motion.div
      key={category.id}
      id={`spec-panel-${category.id}`}
      role="tabpanel"
      aria-live="polite"
      className="rounded-3xl border border-white/10 bg-white/6 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-8"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold tracking-[0.02em] text-white">
          {category.label}
        </h3>
        <span className="text-[11px] uppercase tracking-[0.3em] text-white/50">
          Tech HUD
        </span>
      </div>

      {hasSpecs && (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {category.specs?.map((spec, index) => (
            <motion.div
              key={`${spec.label}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.06 * index }}
            >
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                {spec.label}
              </div>
              <div className="mt-2 text-base font-semibold text-white/90">
                {spec.value}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {hasMeters && (
        <div className="mt-6 space-y-4">
          {category.meters?.map((meter, index) => (
            <HudMeterRow
              key={`${meter.label}-${index}`}
              meter={meter}
              accentColor={accentColor}
              delay={0.05 * index}
            />
          ))}
        </div>
      )}

      {hasHighlights && (
        <div className="mt-6 grid gap-3">
          {category.highlights?.map((highlight, index) => (
            <motion.div
              key={`${highlight}-${index}`}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/70"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.04 * index }}
            >
              <span
                className="mt-1 h-2 w-2 rounded-full"
                style={{ backgroundColor: accentColor }}
                aria-hidden="true"
              />
              <span>{highlight}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function HudMeterRow({
  meter,
  accentColor,
  delay,
}: {
  meter: HudMeter;
  accentColor: string;
  delay: number;
}) {
  const percentage = Math.min(100, (meter.value / meter.max) * 100);
  const count = useCountUp(meter.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
    >
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>{meter.label}</span>
        <span>
          {count}
          {meter.unit ?? ""}
        </span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-white/10">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>
    </motion.div>
  );
}

export function HudSpecsSection({ data, accentColor = "#b3242d" }: HudSpecsProps) {
  const categories = data.categories.filter(
    (category) =>
      (category.specs && category.specs.length > 0) ||
      (category.meters && category.meters.length > 0) ||
      (category.highlights && category.highlights.length > 0)
  );
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const activeCategory = categories.find((category) => category.id === activeId);

  return (
    <section className="relative overflow-hidden bg-[#0b0f10] py-14 text-white">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#0b0f10] via-[#0f1315] to-[#0a0d0f]" />
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-[140px]" />
      <div className="pointer-events-none absolute left-16 top-16 h-60 w-60 rounded-full bg-white/5 blur-[140px]" />
      <div className="pointer-events-none absolute right-12 top-1/2 h-40 w-72 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_12px)] opacity-[0.12]" />

      <div className="relative mx-auto w-full max-w-350 px-10 lg:px-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">
              Vehicle Specs
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[0.02em] text-white">
              {data.title}
            </h2>
          </div>
          <div
            className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs uppercase tracking-[0.3em] lg:flex"
            style={{ color: accentColor }}
          >
            HUD
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <HudTabs
            categories={categories}
            activeId={activeId}
            onChange={setActiveId}
            accentColor={accentColor}
          />
          <AnimatePresence mode="wait">
            {activeCategory ? (
              <SpecPanel
                key={activeCategory.id}
                category={activeCategory}
                accentColor={accentColor}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export const supercarHudSpecs: HudSpecsData = {
  title: "Lamborghini EVO Spyder",
  categories: [
    {
      id: "overview",
      label: "Overview",
      icon: "OV",
      specs: [
        { label: "Year", value: "2023" },
        { label: "Drive", value: "AWD" },
        { label: "Body", value: "Roadster" },
        { label: "Seats", value: "2" },
        { label: "Transmission", value: "7-speed DCT" },
        { label: "Fuel", value: "Petrol" },
      ],
      highlights: [
        "Open-air V10 experience with precision handling.",
        "Carbon-fiber cockpit with bespoke finishes.",
      ],
    },
    {
      id: "performance",
      label: "Performance",
      icon: "PF",
      specs: [
        { label: "0-100 km/h", value: "3.1 s" },
        { label: "Top Speed", value: "325 km/h" },
        { label: "Horsepower", value: "640 hp" },
        { label: "Torque", value: "600 Nm" },
      ],
      meters: [
        { label: "Power Output", value: 640, max: 700, unit: " hp" },
        { label: "Top Speed", value: 325, max: 350, unit: " km/h" },
      ],
    },
    {
      id: "powertrain",
      label: "Powertrain",
      icon: "PT",
      specs: [
        { label: "Engine", value: "5.2L V10 NA" },
        { label: "Induction", value: "Naturally Aspirated" },
        { label: "Drivetrain", value: "AWD" },
        { label: "Exhaust", value: "Quad Outlet" },
      ],
      highlights: [
        "Lamborghini Doppia Frizione dual-clutch.",
        "Magneto-rheological adaptive suspension.",
      ],
    },
    {
      id: "dimensions",
      label: "Dimensions",
      icon: "DM",
      specs: [
        { label: "Length", value: "4,520 mm" },
        { label: "Width", value: "1,933 mm" },
        { label: "Height", value: "1,116 mm" },
        { label: "Wheelbase", value: "2,620 mm" },
        { label: "Weight", value: "1,540 kg" },
      ],
    },
    {
      id: "technology",
      label: "Technology",
      icon: "TC",
      specs: [
        { label: "Infotainment", value: "8.4\" Touch HUD" },
        { label: "Steering", value: "LAWS" },
        { label: "Traction", value: "LDVI" },
        { label: "Drive Modes", value: "ANIMA" },
      ],
      highlights: [
        "Advanced driver display with telemetry modes.",
        "Adaptive aero for high-speed stability.",
      ],
    },
    {
      id: "comfort",
      label: "Comfort",
      icon: "CM",
      specs: [
        { label: "Upholstery", value: "Leather / Alcantara" },
        { label: "Climate", value: "Dual-zone" },
        { label: "Lighting", value: "Ambient LED" },
      ],
      highlights: ["Soft-top roof with fast electronic actuation."],
    },
    {
      id: "safety",
      label: "Safety",
      icon: "SF",
      specs: [
        { label: "Brakes", value: "Carbon-ceramic" },
        { label: "Stability", value: "ESC + ABS" },
        { label: "Cameras", value: "Rear + Sensors" },
      ],
    },
  ],
};

export const suvHudSpecs: HudSpecsData = {
  title: "Luxury SUV Package",
  categories: [
    {
      id: "overview",
      label: "Overview",
      icon: "OV",
      specs: [
        { label: "Seats", value: "7" },
        { label: "Drivetrain", value: "AWD" },
        { label: "Cargo", value: "2,050 L" },
        { label: "Towing", value: "3,500 kg" },
      ],
      highlights: ["Commanding ride height with executive comfort."],
    },
    {
      id: "performance",
      label: "Performance",
      icon: "PF",
      specs: [
        { label: "0-100 km/h", value: "4.9 s" },
        { label: "Power", value: "520 hp" },
      ],
      meters: [{ label: "Torque", value: 750, max: 900, unit: " Nm" }],
    },
    {
      id: "comfort",
      label: "Comfort",
      icon: "CM",
      specs: [
        { label: "Suspension", value: "Air Ride" },
        { label: "Seats", value: "Heated / Ventilated" },
        { label: "Sound", value: "Premium Surround" },
      ],
      highlights: ["Three-row luxury with acoustic glass."],
    },
  ],
};

export const evHudSpecs: HudSpecsData = {
  title: "Electric Performance",
  categories: [
    {
      id: "overview",
      label: "Overview",
      icon: "OV",
      specs: [
        { label: "Range", value: "520 km" },
        { label: "Drivetrain", value: "Dual Motor AWD" },
        { label: "Charging", value: "250 kW" },
      ],
    },
    {
      id: "performance",
      label: "Performance",
      icon: "PF",
      specs: [
        { label: "0-100 km/h", value: "2.9 s" },
        { label: "Power", value: "750 hp" },
      ],
      meters: [
        { label: "Range", value: 520, max: 600, unit: " km" },
        { label: "Charge Rate", value: 250, max: 350, unit: " kW" },
      ],
    },
    {
      id: "technology",
      label: "Technology",
      icon: "TC",
      specs: [
        { label: "Autonomy", value: "Level 2+" },
        { label: "Display", value: "Panoramic HUD" },
        { label: "Audio", value: "Studio Reference" },
      ],
      highlights: ["Adaptive regen with personalized drive modes."],
    },
  ],
};
