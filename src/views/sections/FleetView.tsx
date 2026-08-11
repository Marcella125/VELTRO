"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CloseButton } from "@/components/ui/close-button";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { usePageTransition } from "@/hooks/use-page-transition";
import { assetPath } from "@/lib/asset-path";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import { PageFooterNote } from "@/views/components/PageFooterNote";
import type { Car } from "@/models/car.model";

type FleetViewProps = {
  cars: Car[];
};

type ActiveBrandFilter = "all" | BrandFilter["id"];

type BrandFilter = {
  id: "porsche" | "mercedes" | "ferrari" | "bmw" | "lamborghini";
  logoSrc?: string;
  alt: string;
  carBrands: string[];
};

type FleetPresentation = {
  imageSrc: string;
  displayBrand?: string;
  displayName?: string;
  displayPower?: string;
  displayDrive?: string;
};

const brandFilters: BrandFilter[] = [
  {
    id: "porsche",
    logoSrc: assetPath("/platinum-brandsArtboard-4.png"),
    alt: "Porsche logo",
    carBrands: ["Aurelia"],
  },
  {
    id: "mercedes",
    logoSrc: assetPath("/platinum-brandsArtboard-3.png"),
    alt: "Mercedes logo",
    carBrands: ["Velvetis"],
  },
  {
    id: "ferrari",
    logoSrc: assetPath("/platinum-brandsArtboard-1.png"),
    alt: "Ferrari logo",
    carBrands: ["Nocturne"],
  },
  {
    id: "bmw",
    logoSrc: assetPath("/platinum-brandsArtboard-5.png"),
    alt: "BMW logo",
    carBrands: ["Maison Valtor"],
  },
  {
    id: "lamborghini",
    logoSrc: assetPath("/platinum-brandsArtboard-2.png"),
    alt: "Lamborghini logo",
    carBrands: ["Solenne", "Imperium"],
  },
];

const fleetPresentationBySlug: Record<string, FleetPresentation> = {
  "obsidian-gt": {
    imageSrc: assetPath("/lambo fleet.png"),
    displayBrand: "Lamborghini",
    displayName: "Evo Spyder",
    displayPower: "640 HP",
    displayDrive: "AWD",
  },
  "crimson-eclipse": {
    imageSrc: assetPath("/porshe fleet.png"),
    displayBrand: "Porsche",
    displayName: "911 Carrera 4S",
    displayPower: "450 HP",
    displayDrive: "AWD",
  },
  "onyx-sabre": {
    imageSrc: assetPath("/ferrari fleet.png"),
    displayBrand: "Ferrari",
    displayName: "296 GTB",
    displayPower: "830 HP",
    displayDrive: "RWD",
  },
  "velour-phantom": {
    imageSrc: assetPath("/lambo fleet.png"),
    displayBrand: "Lamborghini",
    displayName: "Evo Spyder",
    displayPower: "640 HP",
    displayDrive: "AWD",
  },
  "ember-revenant": {
    imageSrc: assetPath("/porshe fleet.png"),
    displayBrand: "Porsche",
    displayName: "911 Carrera 4S",
    displayPower: "450 HP",
    displayDrive: "AWD",
  },
  "midnight-regal": {
    imageSrc: assetPath("/ferrari fleet.png"),
    displayBrand: "Ferrari",
    displayName: "296 GTB",
    displayPower: "830 HP",
    displayDrive: "RWD",
  },
};

const getSpecValue = (car: Car, label: string) =>
  car.specs.find((spec) => spec.label === label)?.value ?? "";

function chunkArray<T>(items: T[], size: number): T[][] {
  return Array.from(
    { length: Math.ceil(items.length / size) },
    (_, index) => items.slice(index * size, index * size + size)
  );
}

export function FleetView({ cars }: FleetViewProps) {
  const router = useRouter();
  const homeHref = "/";
  const prefersReducedMotion = useReducedMotion();
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [activeBrandFilter, setActiveBrandFilter] =
    useState<ActiveBrandFilter>("all");
  const [activeSpecCar, setActiveSpecCar] = useState<Car | null>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const { overlay, runTransition } = usePageTransition();

  useOverlayBehavior(Boolean(activeSpecCar), () => setActiveSpecCar(null));

  const navigateTo = (href: string) => {
    setIsDockOpen(false);
    runTransition(() => router.push(href));
  };

  const filteredCars = useMemo(() => {
    if (activeBrandFilter === "all") return cars;

    const selectedFilter = brandFilters.find(
      (filter) => filter.id === activeBrandFilter
    );

    if (!selectedFilter) return cars;
    return cars.filter((car) => selectedFilter.carBrands.includes(car.brand));
  }, [activeBrandFilter, cars]);

  const vehiclePages = useMemo(() => chunkArray(filteredCars, 3), [filteredCars]);

  useEffect(() => {
    document.body.classList.remove("home-scroll-hidden");
    document.body.classList.remove("rideit-open");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setActivePageIndex(0);
  }, [activeBrandFilter]);

  const handleDockSelect = (id: string) => {
    if (id === "fleet") {
      setIsDockOpen(false);
      return;
    }
    if (id === "home") return navigateTo(homeHref);
    if (id === "blogs") return navigateTo("/blogs");
    if (id === "mission") return navigateTo("/mission");
    if (id === "contact") return navigateTo("/contact");
    if (id === "faq") return navigateTo("/faq");
  };

  const activeSpecRows = activeSpecCar?.specs ?? [];
  const hasPreviousPage = activePageIndex > 0;
  const hasNextPage = activePageIndex < vehiclePages.length - 1;
  const showFleetArrows =
    activeBrandFilter === "all" || filteredCars.length > 4;
  const currentPageCars = vehiclePages[activePageIndex] ?? [];

  return (
    <main className="relative h-dvh overflow-hidden text-[#F5F5F5]">
      <AnimatePresence>{overlay}</AnimatePresence>
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={assetPath("/images/bgcar.png")}
          alt="Platinum fleet background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#240407_0%,#100103_38%,#050505_70%,#000_100%)] opacity-[0.78]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_58%_at_50%_48%,rgba(140,10,18,0.28),transparent_62%)]" />
        <div className="absolute inset-0 bg-black/54" />
        <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.74)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/60 via-black/24 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/66 via-black/28 to-transparent" />
      </div>

      <div className="relative z-10 flex h-dvh flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-350 flex-1 flex-col overflow-hidden px-6 pt-6 sm:px-10">
          <header className="relative z-40 shrink-0">
            <InternalPageHeader
              title="Fleet"
              isDockOpen={isDockOpen}
              onOpenChange={setIsDockOpen}
              onSelect={handleDockSelect}
              onLogoClick={() => navigateTo(homeHref)}
            />
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <section className="relative z-30 mt-3 shrink-0 pb-3 sm:mt-4">
              <div className="no-scrollbar -mx-2 overflow-x-auto px-2">
                <div className="mx-auto flex min-w-max items-center justify-center gap-1.5 sm:gap-5">
                  <button
                    type="button"
                    aria-label="View all vehicles"
                    onClick={() => navigateTo("/fleet/all")}
                    className="group relative flex min-h-11 min-w-[4.4rem] items-center justify-center px-2.5 py-2 sm:min-w-[4.8rem] sm:px-3"
                  >
                    <span className="type-eyebrow rounded-none border border-white/12 px-3 py-1.5 text-center text-[10px] leading-[1.15] tracking-[0.16em] text-white/72 transition-[color,border-color,background-color] duration-[var(--transition-normal)] group-hover:border-[var(--brand-red)]/55 group-hover:text-white">
                      VIEW
                      <br />
                      ALL
                    </span>
                  </button>
                  {brandFilters.map((filter) => {
                    const isActive = filter.id === activeBrandFilter;

                    return (
                      <button
                        key={filter.id}
                        type="button"
                        aria-pressed={isActive}
                        aria-label={filter.alt}
                        onClick={() => setActiveBrandFilter(filter.id)}
                        className="group relative flex min-h-11 items-center justify-center px-1 py-2 sm:px-2"
                      >
                        {filter.logoSrc ? (
                          <Image
                            src={filter.logoSrc}
                            alt={filter.alt}
                            width={72}
                            height={40}
                            className={`h-7 w-auto object-contain transition-[opacity,filter,transform] duration-[var(--transition-normal)] ease-[var(--ease-premium)] sm:h-12 ${
                              isActive
                                ? "opacity-100 brightness-110"
                                : "opacity-50 grayscale-[0.1] group-hover:opacity-78"
                            }`}
                          />
                        ) : null}

                        <span
                          className={`pointer-events-none absolute ${
                            "inset-x-2"
                          } -bottom-0.5 h-px bg-[var(--brand-red)] transition-[opacity,transform,box-shadow] duration-[var(--transition-normal)] ease-[var(--ease-premium)] ${
                            isActive
                              ? "opacity-100 shadow-[0_0_12px_rgba(177,18,38,0.45)]"
                              : "scale-x-75 opacity-0 group-hover:scale-x-100 group-hover:opacity-60"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <main className="-translate-y-[1cm] mt-5 flex min-h-0 flex-1 items-stretch sm:mt-6">
              {filteredCars.length === 0 ? (
                <section className="flex h-full min-h-0 flex-col justify-start overflow-hidden">
                  <div className="rounded-[28px] border border-white/10 bg-black/18 px-6 py-14 text-center backdrop-blur-md">
                    <h2 className="type-card-title text-white">No vehicles available</h2>
                    <p className="type-body mt-3 text-[15px] text-white/66">
                      Select another brand to browse the available collection.
                    </p>
                  </div>
                </section>
              ) : (
                <div className="flex min-h-0 flex-1 items-center gap-3 lg:gap-5">
                  <button
                    type="button"
                    aria-label="Previous fleet page"
                    onClick={() => setActivePageIndex((current) => Math.max(current - 1, 0))}
                    disabled={!hasPreviousPage}
                    className={`${showFleetArrows ? "hidden lg:flex" : "hidden"} h-9 w-12 shrink-0 items-center justify-center text-[2.4rem] leading-none transition ${
                      hasPreviousPage ? "text-white/82 hover:text-white" : "text-white/24"
                    }`}
                  >
                    ←
                  </button>

                  <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {currentPageCars.map((car, index) => {
                      const presentation = fleetPresentationBySlug[car.slug] ?? {
                        imageSrc: assetPath("/images/cars.png"),
                      };
                      const absoluteIndex = activePageIndex * 3 + index;
                      const displayBrand = presentation.displayBrand ?? car.brand;
                      const displayName = presentation.displayName ?? car.name;
                      const horsepower =
                        presentation.displayPower ?? getSpecValue(car, "Power") ?? "640 HP";
                      const drive =
                        presentation.displayDrive ?? getSpecValue(car, "Drive") ?? "AWD";

                      return (
                        <article
                          key={car.id}
                          className="relative flex min-h-0 flex-col overflow-hidden border border-[rgba(177,18,38,0.55)]"
                        >
                          <button
                            type="button"
                            onClick={() => setActiveSpecCar(car)}
                            className="group block w-full flex-1 text-left"
                          >
                            <div className="relative h-[20rem] overflow-hidden sm:h-[22rem] lg:h-[24rem]">
                              <Image
                                src={presentation.imageSrc}
                                alt={displayName}
                                fill
                                priority={absoluteIndex < 3}
                                loading={absoluteIndex < 3 ? "eager" : "lazy"}
                                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                className="object-cover object-center"
                              />
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.35)_100%)]" />

                              <div className="absolute left-0 top-0 z-10 min-w-0 px-5 pt-4 sm:px-6 sm:pt-5">
                                <div className="min-w-0">
                                  <p className="type-eyebrow text-white/62">{displayBrand}</p>
                                  <h2 className="-translate-x-[0.1cm] mt-2 font-display text-[1.95rem] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white sm:text-[2.25rem] lg:text-[2.45rem]">
                                    {displayName}
                                  </h2>
                                  <p className="mt-4 font-display text-[0.72rem] uppercase tracking-[0.14em] text-white/70 sm:text-[0.76rem]">
                                    <span>V10</span>
                                    <span className="px-2 text-[var(--brand-red)]">•</span>
                                    <span>{horsepower}</span>
                                    <span className="px-2 text-[var(--brand-red)]">•</span>
                                    <span>{drive}</span>
                                  </p>
                                </div>
                              </div>

                              <div className="absolute bottom-4 left-5 z-10 sm:bottom-5 sm:left-6">
                                <span className="font-display inline-flex items-center gap-3 text-[0.82rem] uppercase tracking-[0.16em] text-white/86 transition group-hover:text-white">
                                  <span>Explore Vehicle</span>
                                  <span className="relative -translate-y-[0.05cm] inline-flex items-center self-center text-[1.3rem] font-semibold leading-none text-[var(--brand-red)]">→</span>
                                </span>
                              </div>
                            </div>
                          </button>
                        </article>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    aria-label="Next fleet page"
                    onClick={() =>
                      setActivePageIndex((current) =>
                        Math.min(current + 1, Math.max(vehiclePages.length - 1, 0))
                      )
                    }
                    disabled={!hasNextPage}
                    className={`${showFleetArrows ? "hidden lg:flex" : "hidden"} h-9 w-12 shrink-0 items-center justify-center text-[2.4rem] leading-none transition ${
                      hasNextPage ? "text-[var(--brand-red)]" : "text-[var(--brand-red)]/35"
                    }`}
                  >
                    →
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <PageFooterNote />

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
              aria-labelledby="fleet-specifications-title"
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
              <div className="specs-noise pointer-events-none absolute inset-0" />

              <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0B0D]/92 px-7 pb-3 pt-3 backdrop-blur sm:px-9 sm:pt-4">
                <div className="flex items-center justify-between">
                  <div
                    id="fleet-specifications-title"
                    className="type-eyebrow text-[#F5F5F5]"
                  >
                    Specifications
                  </div>
                  <CloseButton onClick={() => setActiveSpecCar(null)} />
                </div>
              </div>

              <div className="platinum-specs-scroll mt-4 flex-1 overflow-y-auto px-7 pb-6 sm:px-9 sm:pb-8">
                <div className="hidden sm:grid sm:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] sm:gap-10 lg:gap-14">
                  <div
                    className="border-r border-white/8 pr-8"
                    role="tablist"
                    aria-orientation="vertical"
                    aria-label="Specification categories"
                  >
                    <div className="space-y-1">
                      <button
                        type="button"
                        role="tab"
                        tabIndex={0}
                        aria-selected="true"
                        className="group relative block w-full border-l border-[#C1121F] py-3 pl-7 pr-3 text-left text-[#C1121F]"
                      >
                        <span className="type-eyebrow block text-[#C1121F]">01</span>
                        <span className="type-nav mt-1 block leading-6 font-semibold">
                          Technical Data
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative min-w-0">
                    <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 bg-[radial-gradient(circle,rgba(193,18,31,0.12),transparent_72%)] blur-[22px]" />
                    <motion.section
                      key={activeSpecCar.id}
                      role="tabpanel"
                      className="relative space-y-4"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                    >
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
                    </motion.section>
                  </div>
                </div>

                <div className="sm:hidden">
                  <div className="space-y-3 border-b border-white/10 pb-5">
                    <p className="type-eyebrow text-white/42">01 Technical Data</p>
                    <h3 className="type-card-title text-[#F5F5F5]">
                      {activeSpecCar.name}
                    </h3>
                  </div>

                  <div className="mt-6 space-y-0">
                    {activeSpecRows.map((specRow) => (
                      <div
                        key={`${activeSpecCar.id}-mobile-${specRow.label}`}
                        className="grid grid-cols-1 gap-1 border-b border-white/10 py-3"
                      >
                        <span className="type-label text-[#8A8A8F]">
                          {specRow.label}
                        </span>
                        <span className="type-spec-value leading-6 text-[#F5F5F5]">
                          {specRow.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
