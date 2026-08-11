"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CloseButton } from "@/components/ui/close-button";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { usePageTransition } from "@/hooks/use-page-transition";
import { assetPath } from "@/lib/asset-path";
import type { Car } from "@/models/car.model";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";

type FleetAllViewProps = {
  cars: Car[];
};

type FleetGridCard = {
  sourceSlug: string;
  imageSrc: string;
  brand: string;
  name: string;
  engine: string;
  power: string;
  drive: string;
};

const fleetGridCards: FleetGridCard[] = [
  {
    sourceSlug: "obsidian-gt",
    imageSrc: assetPath("/lambo fleet.png"),
    brand: "Lamborghini",
    name: "Evo Spyder",
    engine: "V10",
    power: "640 HP",
    drive: "AWD",
  },
  {
    sourceSlug: "crimson-eclipse",
    imageSrc: assetPath("/porshe fleet.png"),
    brand: "Porsche",
    name: "911 Carrera 4S",
    engine: "V10",
    power: "450 HP",
    drive: "AWD",
  },
  {
    sourceSlug: "onyx-sabre",
    imageSrc: assetPath("/ferrari fleet.png"),
    brand: "Ferrari",
    name: "296 GTB",
    engine: "V10",
    power: "830 HP",
    drive: "RWD",
  },
  {
    sourceSlug: "velour-phantom",
    imageSrc: assetPath("/lambo fleet.png"),
    brand: "Lamborghini",
    name: "Huracan STO",
    engine: "V10",
    power: "640 HP",
    drive: "RWD",
  },
  {
    sourceSlug: "ember-revenant",
    imageSrc: assetPath("/porshe fleet.png"),
    brand: "Mercedes-Benz",
    name: "AMG GT R",
    engine: "V8 Biturbo",
    power: "585 HP",
    drive: "RWD",
  },
  {
    sourceSlug: "midnight-regal",
    imageSrc: assetPath("/ferrari fleet.png"),
    brand: "BMW",
    name: "M8 Competition",
    engine: "V8",
    power: "625 HP",
    drive: "AWD",
  },
  {
    sourceSlug: "velour-phantom",
    imageSrc: assetPath("/lambo fleet.png"),
    brand: "Lamborghini",
    name: "Urus",
    engine: "V8",
    power: "650 HP",
    drive: "AWD",
  },
  {
    sourceSlug: "crimson-eclipse",
    imageSrc: assetPath("/porshe fleet.png"),
    brand: "Porsche",
    name: "Panamera GTS",
    engine: "V8",
    power: "460 HP",
    drive: "AWD",
  },
];

export function FleetAllView({ cars }: FleetAllViewProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [activeSpecCar, setActiveSpecCar] = useState<Car | null>(null);
  const { overlay, runTransition } = usePageTransition();

  useOverlayBehavior(Boolean(activeSpecCar), () => setActiveSpecCar(null));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const carBySlug = useMemo(
    () => new Map(cars.map((car) => [car.slug, car])),
    [cars]
  );

  const navigateTo = (href: string) => {
    setIsDockOpen(false);
    runTransition(() => router.push(href));
  };

  const handleDockSelect = (id: string) => {
    if (id === "fleet") {
      navigateTo("/fleet");
      return;
    }
    if (id === "home") return navigateTo("/");
    if (id === "blogs") return navigateTo("/blogs");
    if (id === "mission") return navigateTo("/mission");
    if (id === "contact") return navigateTo("/contact");
    if (id === "faq") return navigateTo("/faq");
  };

  const activeSpecRows = activeSpecCar?.specs ?? [];

  return (
    <main className="relative h-dvh overflow-hidden text-[#F5F5F5]">
      <AnimatePresence>{overlay}</AnimatePresence>

      <div className="pointer-events-none absolute inset-0">
        <Image
          src={assetPath("/images/bgcar.png")}
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#240407_0%,#100103_38%,#050505_70%,#000_100%)] opacity-[0.78]" />
        <div className="absolute inset-0 bg-[radial-gradient(92%_66%_at_50%_48%,rgba(140,10,18,0.4),transparent_68%)]" />
        <div className="absolute inset-0 bg-black/54" />
        <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.74)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/60 via-black/24 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/66 via-black/28 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-dvh w-full max-w-350 flex-col px-6 pb-6 pt-6 sm:px-10">
        <header className="relative z-40 shrink-0">
          <InternalPageHeader
            title="Fleet"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            onLogoClick={() => navigateTo("/")}
          />
        </header>

        <section className="mt-7 flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[0.64rem] uppercase tracking-[0.14em] text-white/58">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                type="button"
                className="border border-[var(--brand-red)] px-4 py-2 text-white"
              >
                All Vehicles
              </button>
              <span>Lamborghini</span>
              <span className="text-white/24">|</span>
              <span>Porsche</span>
              <span className="text-white/24">|</span>
              <span>Ferrari</span>
              <span className="text-white/24">|</span>
              <span>Mercedes-Benz</span>
              <span className="text-white/24">|</span>
              <span>BMW</span>
            </div>

            <div className="flex items-center gap-3">
              <span>Sort By</span>
              <span className="font-semibold text-white">Newest</span>
              <ChevronDown className="size-3 text-[var(--brand-red)]" strokeWidth={1.8} />
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {fleetGridCards.map((card, index) => {
              const sourceCar = carBySlug.get(card.sourceSlug) ?? cars[0];

              return (
                <article
                  key={`${card.name}-${index}`}
                  className="relative aspect-[1.4/1] overflow-hidden border border-[rgba(177,18,38,0.72)] bg-black/20 sm:aspect-[1.38/1] xl:aspect-[1.32/1]"
                >
                  <button
                    type="button"
                    onClick={() => setActiveSpecCar(sourceCar)}
                    className="group block h-full w-full text-left"
                  >
                    <div className="relative h-full overflow-hidden">
                      <Image
                        src={card.imageSrc}
                        alt={card.name}
                        fill
                        priority={index < 4}
                        loading={index < 4 ? "eager" : "lazy"}
                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
                        className="object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.05)_35%,rgba(0,0,0,0.42)_100%)]" />

                      <div className="absolute left-0 top-0 z-10 px-3.5 pt-3.5">
                        <p className="type-eyebrow text-[8.5px] text-white/62">
                          {card.brand}
                        </p>
                        <h2 className="mt-1.5 font-display text-[17.1px] font-black uppercase leading-[0.94] tracking-[-0.05em] text-white sm:text-[22.7px] xl:text-[16.3px]">
                          {card.name}
                        </h2>
                        <p className="mt-2.5 font-display text-[7.82px] uppercase tracking-[0.14em] text-white/68 sm:text-[8.78px]">
                          <span>{card.engine}</span>
                          <span className="px-1.5 text-[var(--brand-red)]">•</span>
                          <span>{card.power}</span>
                          <span className="px-1.5 text-[var(--brand-red)]">•</span>
                          <span>{card.drive}</span>
                        </p>
                      </div>

                      <div className="absolute bottom-2 left-3.5 z-10">
                        <span className="font-display inline-flex items-center gap-2 text-[8.14px] uppercase tracking-[0.16em] text-white/84 transition group-hover:text-white sm:text-[8.78px]">
                          <span>Explore Vehicle</span>
                          <span className="inline-flex items-center self-center text-[0.88rem] font-semibold leading-none text-[var(--brand-red)]">
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>

          <div className="flex shrink-0 justify-center pt-1">
            <button
              type="button"
              className="font-display inline-flex min-w-[10.5rem] items-center justify-center gap-3 border border-white/12 px-6 py-2.5 text-[0.62rem] uppercase tracking-[0.16em] text-white/72"
            >
              <span>Load More Vehicles</span>
              <ChevronDown className="size-3 text-[var(--brand-red)]" strokeWidth={1.8} />
            </button>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {activeSpecCar ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-3 py-3 text-[#F5F5F5] sm:px-5 sm:py-5"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.button
              type="button"
              aria-label="Close specifications"
              className="absolute inset-0 bg-black"
              variants={{
                closed: { opacity: 0 },
                open: { opacity: 1 },
              }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => setActiveSpecCar(null)}
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="fleet-all-specifications-title"
              className="relative mx-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-350 flex-col overflow-hidden border border-white/10 bg-[#0B0B0D] shadow-[0_24px_80px_rgba(0,0,0,0.62)] sm:max-h-[calc(100dvh-2.5rem)]"
              variants={{
                closed: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
                open: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0B0D]/92 px-7 pb-3 pt-3 backdrop-blur sm:px-9 sm:pt-4">
                <div className="flex items-center justify-between">
                  <div
                    id="fleet-all-specifications-title"
                    className="type-eyebrow text-[#F5F5F5]"
                  >
                    Specifications
                  </div>
                  <CloseButton onClick={() => setActiveSpecCar(null)} />
                </div>
              </div>

              <div className="platinum-specs-scroll mt-4 flex-1 overflow-y-auto px-7 pb-6 sm:px-9 sm:pb-8">
                <div className="space-y-3 border-b border-white/10 pb-5">
                  <p className="type-eyebrow text-white/42">01 Technical Data</p>
                  <h3 className="type-section-title text-[#F5F5F5]">
                    {activeSpecCar.name}
                  </h3>
                </div>

                <div className="space-y-0">
                  {activeSpecRows.map((specRow) => (
                    <div
                      key={`${activeSpecCar.id}-${specRow.label}`}
                      className="grid grid-cols-[minmax(0,1fr)_minmax(180px,auto)] items-start gap-6 border-b border-white/10 py-4"
                    >
                      <span className="type-label text-[#8A8A8F]">
                        {specRow.label}
                      </span>
                      <span className="type-spec-value text-right leading-6 text-[#F5F5F5]">
                        {specRow.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
