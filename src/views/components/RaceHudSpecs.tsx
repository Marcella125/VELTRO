"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type SpecItem = {
  label: string;
  value: string;
};

type TelemetryMetric = {
  label: string;
  value: number;
  max: number;
  unit?: string;
};

type RaceCategory = {
  id: string;
  label: string;
  icon: string;
  metrics?: TelemetryMetric[];
  specs?: SpecItem[];
  highlights?: string[];
};

export type RaceHudData = {
  title: string;
  subtitle?: string;
  categories: RaceCategory[];
};

type RaceHudProps = {
  data: RaceHudData;
  accentColor?: string;
};

function useCountUp(target: number, duration = 520) {
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

export function RaceHudTabs({
  categories,
  activeId,
  onChange,
  accentColor = "#b3242d",
}: {
  categories: RaceCategory[];
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
        onChange(categories[(currentIndex + 1) % categories.length].id);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        onChange(categories[(currentIndex - 1 + categories.length) % categories.length].id);
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
      className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
      role="tablist"
      aria-label="Race modes"
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
            aria-controls={`race-panel-${category.id}`}
            className={`group flex min-w-50 items-center gap-3 border px-4 py-3 text-left text-[12px] uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 lg:min-w-0 lg:w-full ${
              isActive
                ? "border-white/20 bg-black/70 text-white shadow-[0_8px_18px_rgba(0,0,0,0.5)]"
                : "border-white/10 bg-black/40 text-white/55 hover:border-white/25 hover:text-white"
            }`}
            style={{
              clipPath: "polygon(0 0, 96% 0, 100% 50%, 96% 100%, 0 100%)",
              boxShadow: isActive ? `inset 0 0 0 1px ${accentColor}` : "none",
            }}
            onClick={() => onChange(category.id)}
          >
            <span
              className="flex h-9 w-9 items-center justify-center border border-white/15 bg-white/5 text-[10px]"
              style={{
                color: isActive ? accentColor : "inherit",
                clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
              }}
              aria-hidden="true"
            >
              {category.icon}
            </span>
            <span className="font-semibold tracking-[0.24em]">{category.label}</span>
            {isActive && (
              <span
                className="ml-auto hidden h-10 w-0.5 lg:block"
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

export function TelemetryGauges({
  metrics,
  accentColor = "#b3242d",
}: {
  metrics: TelemetryMetric[];
  accentColor?: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {metrics.map((metric, index) => (
        <TelemetryCard
          key={`${metric.label}-${index}`}
          metric={metric}
          accentColor={accentColor}
          delay={0.04 * index}
        />
      ))}
    </div>
  );
}

function TelemetryCard({
  metric,
  accentColor,
  delay,
}: {
  metric: TelemetryMetric;
  accentColor: string;
  delay: number;
}) {
  const percent = Math.min(100, (metric.value / metric.max) * 100);
  const count = useCountUp(metric.value);

  return (
    <motion.div
      className="border border-white/10 bg-black/50 px-4 py-4"
      style={{ clipPath: "polygon(0 0, 96% 0, 100% 50%, 96% 100%, 0 100%)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay }}
    >
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/60">
        <span>{metric.label}</span>
        <span className="text-white/85">
          {count}
          {metric.unit ?? ""}
        </span>
      </div>
      <div className="mt-3 h-2 w-full bg-white/10">
        <div
          className="h-2"
          style={{
            width: `${percent}%`,
            backgroundColor: accentColor,
            boxShadow: `0 0 12px ${accentColor}55`,
          }}
        />
      </div>
    </motion.div>
  );
}

export function SpecGrid({ specs }: { specs: SpecItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {specs.map((spec, index) => (
        <motion.div
          key={`${spec.label}-${index}`}
          className="border border-white/10 bg-black/45 px-3 py-3 text-[12px] uppercase tracking-[0.18em] text-white/60"
          style={{ clipPath: "polygon(0 0, 94% 0, 100% 50%, 94% 100%, 0 100%)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.03 * index }}
        >
          <div className="text-[10px] text-white/40">{spec.label}</div>
          <div className="mt-2 text-base font-semibold text-white/90">{spec.value}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function RaceHudPanel({
  category,
  accentColor = "#b3242d",
}: {
  category: RaceCategory;
  accentColor?: string;
}) {
  const hasMetrics = category.metrics && category.metrics.length > 0;
  const hasSpecs = category.specs && category.specs.length > 0;
  const hasHighlights = category.highlights && category.highlights.length > 0;

  return (
    <motion.div
      key={category.id}
      id={`race-panel-${category.id}`}
      role="tabpanel"
      aria-live="polite"
      className="border border-white/10 bg-black/55 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-lg lg:p-8"
      style={{ borderRadius: "10px" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/45">
            Mode
          </p>
          <h3 className="mt-1 text-lg font-semibold uppercase tracking-[0.28em] text-white">
            {category.label}
          </h3>
        </div>
        <span
          className="h-1 w-24"
          style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
          aria-hidden="true"
        />
      </div>

      {hasMetrics && category.metrics ? (
        <div className="mt-6">
          <TelemetryGauges metrics={category.metrics} accentColor={accentColor} />
        </div>
      ) : null}

      {hasSpecs && category.specs ? (
        <div className="mt-6">
          <SpecGrid specs={category.specs} />
        </div>
      ) : null}

      {hasHighlights && category.highlights ? (
        <div className="mt-6 grid gap-2">
          {category.highlights.map((highlight, index) => (
            <motion.div
              key={`${highlight}-${index}`}
              className="flex items-center gap-3 border border-white/10 bg-black/50 px-3 py-2 text-[12px] uppercase tracking-[0.2em] text-white/65"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.02 * index }}
            >
              <span
                className="h-2 w-2"
                style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
                aria-hidden="true"
              />
              <span>{highlight}</span>
            </motion.div>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

export function RaceHudSpecsSection({ data, accentColor = "#b3242d" }: RaceHudProps) {
  const categories = useMemo(
    () =>
      data.categories.filter(
        (category) =>
          (category.metrics && category.metrics.length > 0) ||
          (category.specs && category.specs.length > 0) ||
          (category.highlights && category.highlights.length > 0)
      ),
    [data.categories]
  );
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const activeCategory = categories.find((category) => category.id === activeId);

  return (
    <section className="relative overflow-hidden bg-[#07090a] py-14 text-white">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black via-[#0b0f12] to-[#0a0d10]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(45deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[28px_28px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px) bg-size-[22px_22px]" />
      <div className="pointer-events-none absolute left-0 right-0 top-8 h-0.5 opacity-80" style={{ backgroundColor: accentColor }} />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        animate={{ opacity: [0.04, 0.1, 0.04] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative mx-auto w-full max-w-350 px-10 lg:px-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/45">
              Racing HUD Specs
            </p>
            <h2 className="mt-2 text-2xl font-semibold uppercase tracking-[0.28em] text-white">
              {data.title}
            </h2>
            {data.subtitle ? (
              <p className="mt-2 text-[12px] uppercase tracking-[0.22em] text-white/45">
                {data.subtitle}
              </p>
            ) : null}
          </div>
          <div
            className="hidden h-10 w-32 items-center justify-center border border-white/15 bg-black/40 text-[10px] uppercase tracking-[0.4em] text-white/70 lg:flex"
            style={{ boxShadow: `inset 0 0 12px ${accentColor}33` }}
          >
            Track Mode
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <RaceHudTabs
            categories={categories}
            activeId={activeId}
            onChange={setActiveId}
            accentColor={accentColor}
          />
          <AnimatePresence mode="wait">
            {activeCategory ? (
              <RaceHudPanel
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

export const supercarRaceHud: RaceHudData = {
  title: "Lamborghini EVO Spyder",
  subtitle: "Corsa Telemetry",
  categories: [
    {
      id: "overview",
      label: "OVERVIEW",
      icon: "OV",
      specs: [
        { label: "YEAR", value: "2023" },
        { label: "DRIVE", value: "AWD" },
        { label: "BODY", value: "ROADSTER" },
        { label: "WEIGHT", value: "1,540 KG" },
        { label: "FUEL", value: "PETROL" },
        { label: "TRANSMISSION", value: "7-SPEED DCT" },
      ],
      highlights: ["LAUNCH CONTROL", "TRACK SUSPENSION", "PERFORMANCE BRAKES"],
    },
    {
      id: "performance",
      label: "PERFORMANCE",
      icon: "PF",
      metrics: [
        { label: "POWER OUTPUT", value: 640, max: 700, unit: " HP" },
        { label: "TOP SPEED", value: 325, max: 350, unit: " KM/H" },
        { label: "0-100 KM/H", value: 3, max: 5, unit: " S" },
        { label: "TORQUE", value: 600, max: 700, unit: " NM" },
      ],
      specs: [
        { label: "AERO", value: "ACTIVE" },
        { label: "MODE", value: "CORSA" },
        { label: "TRACTION", value: "LDVI" },
      ],
    },
    {
      id: "powertrain",
      label: "POWERTRAIN",
      icon: "PT",
      specs: [
        { label: "ENGINE", value: "5.2L V10 NA" },
        { label: "INDUCTION", value: "N/A" },
        { label: "EXHAUST", value: "QUAD OUTLET" },
        { label: "GEARBOX", value: "LDF DCT" },
      ],
      highlights: ["MAGNETO-RHEO DAMPERS", "TORQUE VECTORING"],
    },
    {
      id: "handling",
      label: "HANDLING",
      icon: "HN",
      specs: [
        { label: "STEERING", value: "LAWS" },
        { label: "BRAKES", value: "CARBON CERAMIC" },
        { label: "SUSPENSION", value: "ADAPTIVE" },
      ],
      highlights: ["ALL-WHEEL STEERING", "TRACK CALIBRATION"],
    },
    {
      id: "dimensions",
      label: "DIMENSIONS",
      icon: "DM",
      specs: [
        { label: "LENGTH", value: "4,520 MM" },
        { label: "WIDTH", value: "1,933 MM" },
        { label: "HEIGHT", value: "1,116 MM" },
        { label: "WHEELBASE", value: "2,620 MM" },
      ],
    },
    {
      id: "tech",
      label: "TECH",
      icon: "TC",
      specs: [
        { label: "HUD", value: "RACE TELEMETRY" },
        { label: "DATA LOG", value: "ACTIVE" },
        { label: "DISPLAY", value: "8.4\" TOUCH" },
      ],
      highlights: ["DRIVE MODES: STRADA / SPORT / CORSA"],
    },
    {
      id: "safety",
      label: "SAFETY",
      icon: "SF",
      specs: [
        { label: "ESC", value: "ENABLED" },
        { label: "AIRBAGS", value: "MULTI" },
        { label: "CAMERAS", value: "REAR + SENSORS" },
      ],
    },
  ],
};

export const suvRaceHud: RaceHudData = {
  title: "Performance SUV",
  subtitle: "Track Utility",
  categories: [
    {
      id: "overview",
      label: "OVERVIEW",
      icon: "OV",
      specs: [
        { label: "SEATS", value: "7" },
        { label: "DRIVE", value: "AWD" },
        { label: "TOWING", value: "3,500 KG" },
        { label: "CARGO", value: "2,050 L" },
      ],
      highlights: ["LAUNCH CONTROL", "AIR SUSPENSION"],
    },
    {
      id: "performance",
      label: "PERFORMANCE",
      icon: "PF",
      metrics: [
        { label: "POWER", value: 520, max: 650, unit: " HP" },
        { label: "TORQUE", value: 750, max: 900, unit: " NM" },
      ],
      specs: [
        { label: "0-100 KM/H", value: "4.9 S" },
        { label: "TOP SPEED", value: "270 KM/H" },
      ],
    },
    {
      id: "tech",
      label: "TECH",
      icon: "TC",
      specs: [
        { label: "DRIVE MODES", value: "SPORT +" },
        { label: "CAMERAS", value: "360" },
        { label: "ASSIST", value: "LEVEL 2" },
      ],
    },
  ],
};

export const evRaceHud: RaceHudData = {
  title: "Electric Performance",
  subtitle: "Zero Emission Track",
  categories: [
    {
      id: "overview",
      label: "OVERVIEW",
      icon: "OV",
      specs: [
        { label: "DRIVE", value: "DUAL MOTOR" },
        { label: "RANGE", value: "520 KM" },
        { label: "CHARGING", value: "250 KW" },
      ],
    },
    {
      id: "performance",
      label: "PERFORMANCE",
      icon: "PF",
      metrics: [
        { label: "POWER", value: 750, max: 900, unit: " HP" },
        { label: "0-100 KM/H", value: 2, max: 5, unit: " S" },
        { label: "RANGE", value: 520, max: 600, unit: " KM" },
      ],
      highlights: ["TORQUE VECTORING", "TRACK BATTERY COOLING"],
    },
    {
      id: "tech",
      label: "TECH",
      icon: "TC",
      specs: [
        { label: "SOFTWARE", value: "TRACK MODE" },
        { label: "DISPLAY", value: "PANORAMIC HUD" },
      ],
    },
  ],
};
