"use client";

import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { assetPath } from "@/lib/asset-path";
import { formatPrice } from "@/lib/utils";
import { FleetSpecsOverlay } from "@/views/components/FleetSpecsOverlay";
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
  specsImageSrc?: string;
  engineImageSrc?: string;
  displayBrand?: string;
  displayName?: string;
  displayEngine?: string;
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
    specsImageSrc: assetPath("/images/lambo specs.png"),
    engineImageSrc: assetPath("/images/lambo eng.png"),
    displayBrand: "Lamborghini",
    displayName: "Evo Spyder",
    displayEngine: "V10",
    displayPower: "640 HP",
    displayDrive: "AWD",
  },
  "crimson-eclipse": {
    imageSrc: assetPath("/porshe fleet.png"),
    specsImageSrc: assetPath("/images/porshe specs.png"),
    engineImageSrc: assetPath("/images/porshe eng.png"),
    displayBrand: "Porsche",
    displayName: "911 Carrera 4S",
    displayEngine: "Flat-6",
    displayPower: "450 HP",
    displayDrive: "AWD",
  },
  "onyx-sabre": {
    imageSrc: assetPath("/ferrari fleet.png"),
    specsImageSrc: assetPath("/images/ferrari specs.png"),
    engineImageSrc: assetPath("/images/ferrari eng.png"),
    displayBrand: "Ferrari",
    displayName: "296 GTB",
    displayEngine: "V6 Hybrid",
    displayPower: "830 HP",
    displayDrive: "RWD",
  },
  "velour-phantom": {
    imageSrc: assetPath("/lambo fleet.png"),
    specsImageSrc: assetPath("/images/lambo specs.png"),
    engineImageSrc: assetPath("/images/lambo eng.png"),
    displayBrand: "Lamborghini",
    displayName: "Huracan STO",
    displayEngine: "V10",
    displayPower: "640 HP",
    displayDrive: "RWD",
  },
  "ember-revenant": {
    imageSrc: assetPath("/porshe fleet.png"),
    specsImageSrc: assetPath("/images/porshe specs.png"),
    engineImageSrc: assetPath("/images/porshe eng.png"),
    displayBrand: "Mercedes-Benz",
    displayName: "AMG GT R",
    displayEngine: "V8 Biturbo",
    displayPower: "585 HP",
    displayDrive: "RWD",
  },
  "midnight-regal": {
    imageSrc: assetPath("/ferrari fleet.png"),
    specsImageSrc: assetPath("/images/ferrari specs.png"),
    engineImageSrc: assetPath("/images/ferrari eng.png"),
    displayBrand: "BMW",
    displayName: "M8 Competition",
    displayEngine: "V8",
    displayPower: "625 HP",
    displayDrive: "AWD",
  },
};

function chunkArray<T>(items: T[], size: number): T[][] {
  return Array.from(
    { length: Math.ceil(items.length / size) },
    (_, index) => items.slice(index * size, index * size + size)
  );
}

export function FleetView({ cars }: FleetViewProps) {
  const router = useRouter();
  const [isDockOpen, setIsDockOpen] = useState(true);
  const [activeBrandFilter, setActiveBrandFilter] =
    useState<ActiveBrandFilter>("all");
  const [activeSpecCar, setActiveSpecCar] = useState<Car | null>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);

  useOverlayBehavior(Boolean(activeSpecCar), () => setActiveSpecCar(null));

  const navigateTo = (href: string) => {
    router.push(href);
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
      return;
    }
    if (id === "home") return navigateTo("/");
    if (id === "blogs") return navigateTo("/blogs");
    if (id === "mission") return navigateTo("/mission");
    if (id === "contact") return navigateTo("/contact");
    if (id === "faq") return navigateTo("/faq");
  };

  const activeSpecPresentation = activeSpecCar
    ? fleetPresentationBySlug[activeSpecCar.slug] ?? {
        imageSrc: assetPath("/images/cars.png"),
        displayBrand: activeSpecCar.brand,
        displayName: activeSpecCar.name,
      }
    : null;
  const hasPreviousPage = activePageIndex > 0;
  const hasNextPage = activePageIndex < vehiclePages.length - 1;
  const showFleetArrows =
    activeBrandFilter === "all" || filteredCars.length > 4;
  const currentPageCars = vehiclePages[activePageIndex] ?? [];

  return (
    <main className="relative h-dvh overflow-hidden text-[#F5F5F5]">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={assetPath("/images/bgcar.png")}
          alt="Veltro fleet background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#1f1f1f_0%,#111111_38%,#050505_70%,#000_100%)] opacity-[0.78]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_58%_at_50%_48%,rgba(255,255,255,0.14),transparent_62%)]" />
        <div className="absolute inset-0 bg-black/54" />
        <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.74)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/60 via-black/24 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/66 via-black/28 to-transparent" />
      </div>

      <div className="relative z-10 flex h-dvh flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-350 flex-1 flex-col overflow-hidden px-6 pt-5 sm:px-10 sm:pt-6">
          <header className="relative z-40 shrink-0">
            <InternalPageHeader
              title="Fleet"
              isDockOpen={isDockOpen}
              onOpenChange={setIsDockOpen}
              onSelect={handleDockSelect}
              onLogoClick={() => navigateTo("/")}
            />
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <section className="relative z-30 mt-3 shrink-0 pb-3 sm:mt-4">
              <div className="no-scrollbar -mx-2 overflow-x-auto px-2">
                <div className="mx-auto flex min-w-max items-center justify-center gap-1.5 sm:gap-5">
                  <button
                    type="button"
                    aria-label="All cars"
                    onClick={() => navigateTo("/fleet/all")}
                    className="group relative flex min-h-11 min-w-[4.4rem] items-center justify-center px-2.5 py-2 sm:min-w-[4.8rem] sm:px-3"
                  >
                    <span className="type-eyebrow rounded-none border border-white/12 px-3 py-1.5 text-center text-[10px] leading-[1.15] tracking-[0.16em] text-white/72 transition-[color,border-color,background-color] duration-[var(--transition-normal)] group-hover:border-[var(--brand-red)]/55 group-hover:text-white">
                      ALL
                      <br />
                      CARS
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

                      return (
                        <article
                          key={car.id}
                          className="relative flex min-h-0 flex-col overflow-hidden border border-white/8 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:shadow-[0_24px_60px_rgba(0,0,0,0.48)]"
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
                                className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.35)_100%)]" />

                              <div className="absolute left-0 top-0 z-10 min-w-0 px-5 pt-4 sm:px-6 sm:pt-5">
                                <div className="min-w-0">
                                  <p className="type-eyebrow text-white/62">
                                    <span className="text-[var(--brand-red)]">
                                      {String(absoluteIndex + 1).padStart(2, "0")}
                                    </span>
                                    <span>{` / ${displayBrand}`}</span>
                                  </p>
                                  <h2 className="-translate-x-[0.1cm] mt-2 font-display text-[1.95rem] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white sm:text-[2.25rem] lg:text-[2.45rem]">
                                    {displayName}
                                  </h2>
                                </div>
                              </div>

                              <div className="absolute bottom-4 right-5 z-10 flex flex-col items-end text-right sm:bottom-5 sm:right-6">
                                <span className="font-display text-[1.22rem] font-semibold leading-none text-white sm:text-[1.34rem]">
                                  {formatPrice(car.pricePerDay)}
                                </span>
                                <span className="mt-1 font-display text-[0.68rem] uppercase tracking-[0.18em] text-white/62 sm:text-[0.74rem]">
                                  Rent Per Day
                                </span>
                              </div>

                              <div className="absolute bottom-4 left-4 z-10 sm:bottom-5 sm:left-5">
                                <span className="font-display inline-flex items-center justify-center border border-[var(--brand-red)] bg-[var(--brand-red)] px-3 py-1.5 text-[0.52rem] font-medium uppercase tracking-[0.18em] text-white transition group-hover:brightness-110 sm:px-3.5 sm:text-[0.58rem]">
                                  <span>Book This Vehicle</span>
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
          <FleetSpecsOverlay
            car={activeSpecCar}
            displayBrand={activeSpecPresentation?.displayBrand ?? activeSpecCar.brand}
            displayName={activeSpecPresentation?.displayName ?? activeSpecCar.name}
            imageSrc={activeSpecPresentation?.specsImageSrc ?? activeSpecPresentation?.imageSrc ?? assetPath("/images/cars.png")}
            engineImageSrc={activeSpecPresentation?.engineImageSrc}
            engineLabel={activeSpecPresentation?.displayEngine}
            powerLabel={activeSpecPresentation?.displayPower}
            driveLabel={activeSpecPresentation?.displayDrive}
            onClose={() => setActiveSpecCar(null)}
            onLogoClick={() => navigateTo("/")}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}



