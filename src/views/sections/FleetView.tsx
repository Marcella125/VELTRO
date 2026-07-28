"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionLink } from "@/components/ui/action-link";
import { CloseButton } from "@/components/ui/close-button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { usePageTransition } from "@/hooks/use-page-transition";
import { assetPath } from "@/lib/asset-path";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import type { Car } from "@/models/car.model";

type FleetViewProps = {
  cars: Car[];
};

type BrandFilter = {
  id: "all" | "porsche" | "mercedes" | "ferrari" | "bmw" | "lamborghini";
  logoSrc?: string;
  alt: string;
  carBrands: string[];
};

type FleetPresentation = {
  imageSrc: string;
  acceleration: string;
  topSpeed: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
      delay: index * 0.05,
    },
  }),
};

const brandFilters: BrandFilter[] = [
  { id: "all", alt: "All brands", carBrands: [] },
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
    imageSrc: assetPath("/images/cars.png"),
    acceleration: "2.9 s",
    topSpeed: "332 km/h",
  },
  "crimson-eclipse": {
    imageSrc: assetPath("/images/cars.png"),
    acceleration: "3.1 s",
    topSpeed: "325 km/h",
  },
  "onyx-sabre": {
    imageSrc: assetPath("/images/cars.png"),
    acceleration: "3.7 s",
    topSpeed: "305 km/h",
  },
  "velour-phantom": {
    imageSrc: assetPath("/images/cars.png"),
    acceleration: "4.6 s",
    topSpeed: "285 km/h",
  },
  "ember-revenant": {
    imageSrc: assetPath("/images/cars.png"),
    acceleration: "2.7 s",
    topSpeed: "338 km/h",
  },
  "midnight-regal": {
    imageSrc: assetPath("/images/cars.png"),
    acceleration: "4.3 s",
    topSpeed: "296 km/h",
  },
};

const formatFleetPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(price);

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
    useState<BrandFilter["id"]>("all");
  const [cardsPerGroup, setCardsPerGroup] = useState(4);
  const [activeSpecCar, setActiveSpecCar] = useState<Car | null>(null);
  const scrollAreaRef = useRef<HTMLElement | null>(null);
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

  const vehicleGroups = useMemo(
    () => chunkArray(filteredCars, cardsPerGroup),
    [cardsPerGroup, filteredCars]
  );

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeBrandFilter]);

  useEffect(() => {
    const updateCardsPerGroup = () => {
      if (window.innerWidth >= 1280) {
        setCardsPerGroup(4);
        return;
      }
      if (window.innerWidth >= 768) {
        setCardsPerGroup(2);
        return;
      }
      setCardsPerGroup(1);
    };

    updateCardsPerGroup();
    window.addEventListener("resize", updateCardsPerGroup);
    return () => window.removeEventListener("resize", updateCardsPerGroup);
  }, []);

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

  return (
    <motion.main
      className="relative h-dvh overflow-hidden text-[#F5F5F5]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>{overlay}</AnimatePresence>
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={assetPath("/images/bgcar.png")}
          alt="Platinum fleet background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_60%_30%,rgba(193,18,31,0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_70%,rgba(0,0,0,0.8),transparent_60%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.75)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
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
                <div className="mx-auto flex min-w-max items-center justify-center gap-3 sm:gap-5">
                  {brandFilters.map((filter) => {
                    const isActive = filter.id === activeBrandFilter;

                    return (
                      <button
                        key={filter.id}
                        type="button"
                        aria-pressed={isActive}
                        aria-label={filter.alt}
                        onClick={() => setActiveBrandFilter(filter.id)}
                        className="group relative flex min-h-11 items-center justify-center px-2 py-2"
                      >
                        {filter.logoSrc ? (
                          <Image
                            src={filter.logoSrc}
                            alt={filter.alt}
                            width={72}
                            height={40}
                            className={`h-10 w-auto object-contain transition-[opacity,filter,transform] duration-[var(--transition-normal)] ease-[var(--ease-premium)] sm:h-12 ${
                              isActive
                                ? "opacity-100 brightness-110"
                                : "opacity-50 grayscale-[0.1] group-hover:opacity-78"
                            }`}
                          />
                        ) : (
                          <span
                            className={`type-eyebrow text-[11px] tracking-[0.18em] transition-colors duration-[var(--transition-normal)] ${
                              isActive
                                ? "text-white"
                                : "text-white/48 group-hover:text-white/74"
                            }`}
                          >
                            All
                          </span>
                        )}

                        <span
                          className={`pointer-events-none absolute inset-x-2 -bottom-0.5 h-px bg-[var(--brand-red)] transition-[opacity,transform,box-shadow] duration-[var(--transition-normal)] ease-[var(--ease-premium)] ${
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

            <main
              ref={scrollAreaRef}
              className="no-scrollbar mt-6 grid min-h-0 flex-1 auto-rows-[100%] overflow-y-auto overscroll-contain snap-y snap-mandatory sm:mt-8 lg:mt-10"
            >
              {filteredCars.length === 0 ? (
                <section className="flex h-full min-h-0 snap-start snap-always flex-col justify-start overflow-hidden">
                  <div className="rounded-[28px] border border-white/10 bg-black/18 px-6 py-14 text-center backdrop-blur-md">
                    <h2 className="type-card-title text-white">No vehicles available</h2>
                    <p className="type-body mt-3 text-[15px] text-white/66">
                      Select another brand to browse the available collection.
                    </p>
                  </div>
                </section>
              ) : (
                <>
                  {vehicleGroups.map((group, groupIndex) => (
                    <section
                      key={`fleet-group-${groupIndex}`}
                      className="flex h-full min-h-0 snap-start snap-always flex-col justify-center overflow-hidden py-3"
                    >
                      <div className="grid auto-rows-fr grid-cols-1 content-center gap-3.5 md:grid-cols-2 xl:grid-cols-4 xl:gap-4">
                          {group.map((car, index) => {
                            const presentation = fleetPresentationBySlug[car.slug] ?? {
                              imageSrc: assetPath("/images/cars.png"),
                              acceleration: getSpecValue(car, "0-60") || "3.0 s",
                              topSpeed: "320 km/h",
                            };
                            const horsepower = getSpecValue(car, "Power");
                            const whatsappHref = `https://wa.me/96170335113?text=${encodeURIComponent(
                              `Hello, I'm interested in the ${car.name} rental. Please share availability.`
                            )}`;

                            return (
                              <motion.article
                                key={car.id}
                                className="group flex h-full min-h-[26.75rem] flex-col rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.76)_0%,rgba(16,16,17,0.82)_60%,rgba(21,10,12,0.88)_100%)] p-3.5 shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-[border-color,box-shadow] duration-[260ms] ease-[var(--ease-premium)] hover:border-white/18 hover:shadow-[0_14px_28px_rgba(177,18,38,0.12)] sm:p-4"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                custom={groupIndex * cardsPerGroup + index}
                              >
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 rounded-t-[22px] bg-[radial-gradient(70%_95%_at_50%_0%,rgba(177,18,38,0.18),transparent_72%)] opacity-80" />

                                <div className="relative flex h-full flex-col">
                                  <div className="min-h-[3rem]">
                                    <h2 className="type-card-title text-[clamp(1.12rem,1.45vw,1.4rem)] leading-[1.08] text-white">
                                      {car.name}
                                    </h2>
                                    <p className="type-label mt-1 text-[11px] text-white/48">
                                      {car.year} / {car.bodyType}
                                    </p>
                                  </div>

                                  <div className="relative mt-2.5 w-full aspect-[16/8]">
                                    <motion.div
                                      className="absolute inset-0 flex items-center justify-center"
                                      whileHover={{ y: -5, scale: 1.02 }}
                                      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                      <Image
                                        src={presentation.imageSrc}
                                        alt={car.name}
                                        fill
                                        priority={groupIndex === 0}
                                        loading={groupIndex === 0 ? "eager" : "lazy"}
                                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
                                        className="object-contain object-center drop-shadow-[0_28px_34px_rgba(0,0,0,0.46)]"
                                      />
                                    </motion.div>
                                  </div>

                                  <div className="mt-3.5 grid grid-cols-3 gap-1 border-t border-white/8 pt-2.5">
                                    <div className="text-center">
                                      <p className="type-label whitespace-nowrap text-[9px] uppercase tracking-[0.08em] text-white/42">
                                        Power
                                      </p>
                                      <p className="type-nav mt-0.5 whitespace-nowrap text-[12px] text-white/92">
                                        {horsepower}
                                      </p>
                                    </div>
                                    <div className="text-center">
                                      <p className="type-label whitespace-nowrap text-[9px] uppercase tracking-[0.08em] text-white/42">
                                        Top Speed
                                      </p>
                                      <p className="type-nav mt-0.5 whitespace-nowrap text-[12px] text-white/92">
                                        {presentation.topSpeed}
                                      </p>
                                    </div>
                                    <div className="text-center">
                                      <p className="type-label whitespace-nowrap text-[9px] uppercase tracking-[0.08em] text-white/42">
                                        0-60
                                      </p>
                                      <p className="type-nav mt-0.5 whitespace-nowrap text-[12px] text-white/92">
                                        {presentation.acceleration}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-[calc(0.3cm+0.875rem)] flex items-end gap-1.5">
                                    <Image
                                      src={assetPath("/DubaiCurrency.svg")}
                                      alt="Dubai currency"
                                      width={18}
                                      height={18}
                                      className="mb-0.5 h-3 w-3 object-contain opacity-90 sm:h-3.5 sm:w-3.5"
                                    />
                                    <span className="type-price text-[clamp(1.25rem,1.6vw,1.55rem)] text-[var(--brand-red)]">
                                      {formatFleetPrice(car.pricePerDay)}
                                    </span>
                                    <span className="type-button pb-0.5 text-[11px] text-white/44">
                                      / day
                                    </span>
                                  </div>

                                  <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
                                    <PrimaryButton
                                      href={whatsappHref}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="min-w-[120px] rounded-none px-4 sm:h-10 sm:w-auto"
                                    >
                                      WhatsApp
                                    </PrimaryButton>

                                    <ActionLink
                                      type="button"
                                      className="justify-center sm:justify-start"
                                      onClick={() => setActiveSpecCar(car)}
                                    >
                                      View Details
                                    </ActionLink>
                                  </div>
                                </div>
                              </motion.article>
                            );
                          })}
                      </div>
                    </section>
                  ))}
                </>
              )}
            </main>

            <p className="shrink-0 pb-[calc(1.5rem-0.2cm)] pt-4 text-center text-[11px] tracking-[0.03em] text-white/55">
              Platinum all rights reserved &copy; 2026
            </p>
          </div>
        </div>
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
    </motion.main>
  );
}
