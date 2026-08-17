"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { assetPath } from "@/lib/asset-path";
import { formatPrice } from "@/lib/utils";
import type { Car } from "@/models/car.model";
import { FleetSpecsOverlay } from "@/views/components/FleetSpecsOverlay";
import { PageFooterNote } from "@/views/components/PageFooterNote";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";

type FleetAllViewProps = {
  cars: Car[];
};

type FleetGridCard = {
  sourceSlug: string;
  imageSrc: string;
  specsImageSrc?: string;
  engineImageSrc?: string;
  brand: string;
  name: string;
  engine: string;
  power: string;
  drive: string;
};

type FleetBrandFilter =
  | "all"
  | "Lamborghini"
  | "Porsche"
  | "Ferrari"
  | "Mercedes-Benz"
  | "BMW";

const fleetGridCards: FleetGridCard[] = [
  {
    sourceSlug: "obsidian-gt",
    imageSrc: assetPath("/lambo fleet.png"),
    specsImageSrc: assetPath("/images/lambo specs.png"),
    engineImageSrc: assetPath("/images/lambo eng.png"),
    brand: "Lamborghini",
    name: "Evo Spyder",
    engine: "V10",
    power: "640 HP",
    drive: "AWD",
  },
  {
    sourceSlug: "crimson-eclipse",
    imageSrc: assetPath("/porshe fleet.png"),
    specsImageSrc: assetPath("/images/porshe specs.png"),
    engineImageSrc: assetPath("/images/porshe eng.png"),
    brand: "Porsche",
    name: "911 Carrera 4S",
    engine: "V10",
    power: "450 HP",
    drive: "AWD",
  },
  {
    sourceSlug: "onyx-sabre",
    imageSrc: assetPath("/ferrari fleet.png"),
    specsImageSrc: assetPath("/images/ferrari specs.png"),
    engineImageSrc: assetPath("/images/ferrari eng.png"),
    brand: "Ferrari",
    name: "296 GTB",
    engine: "V10",
    power: "830 HP",
    drive: "RWD",
  },
  {
    sourceSlug: "velour-phantom",
    imageSrc: assetPath("/lambo fleet.png"),
    specsImageSrc: assetPath("/images/lambo specs.png"),
    engineImageSrc: assetPath("/images/lambo eng.png"),
    brand: "Lamborghini",
    name: "Huracan STO",
    engine: "V10",
    power: "640 HP",
    drive: "RWD",
  },
  {
    sourceSlug: "ember-revenant",
    imageSrc: assetPath("/porshe fleet.png"),
    specsImageSrc: assetPath("/images/porshe specs.png"),
    engineImageSrc: assetPath("/images/porshe eng.png"),
    brand: "Mercedes-Benz",
    name: "AMG GT R",
    engine: "V8 Biturbo",
    power: "585 HP",
    drive: "RWD",
  },
  {
    sourceSlug: "midnight-regal",
    imageSrc: assetPath("/ferrari fleet.png"),
    specsImageSrc: assetPath("/images/ferrari specs.png"),
    engineImageSrc: assetPath("/images/ferrari eng.png"),
    brand: "BMW",
    name: "M8 Competition",
    engine: "V8",
    power: "625 HP",
    drive: "AWD",
  },
  {
    sourceSlug: "velour-phantom",
    imageSrc: assetPath("/lambo fleet.png"),
    specsImageSrc: assetPath("/images/lambo specs.png"),
    engineImageSrc: assetPath("/images/lambo eng.png"),
    brand: "Lamborghini",
    name: "Urus",
    engine: "V8",
    power: "650 HP",
    drive: "AWD",
  },
  {
    sourceSlug: "crimson-eclipse",
    imageSrc: assetPath("/porshe fleet.png"),
    specsImageSrc: assetPath("/images/porshe specs.png"),
    engineImageSrc: assetPath("/images/porshe eng.png"),
    brand: "Porsche",
    name: "Panamera GTS",
    engine: "V8",
    power: "460 HP",
    drive: "AWD",
  },
];

function chunkArray<T>(items: T[], size: number): T[][] {
  return Array.from(
    { length: Math.ceil(items.length / size) },
    (_, index) => items.slice(index * size, index * size + size)
  );
}

export function FleetAllView({ cars }: FleetAllViewProps) {
  const router = useRouter();
  const mobileCarouselRef = useRef<HTMLDivElement | null>(null);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [activeSpecCard, setActiveSpecCard] = useState<{
    car: Car;
    card: FleetGridCard;
  } | null>(null);
  const [activeBrand, setActiveBrand] = useState<FleetBrandFilter>("all");
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);

  useOverlayBehavior(Boolean(activeSpecCard), () => setActiveSpecCard(null));

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

  const brandFilters: FleetBrandFilter[] = [
    "Lamborghini",
    "Porsche",
    "Ferrari",
    "Mercedes-Benz",
    "BMW",
  ];

  const visibleCards = useMemo(
    () =>
      activeBrand === "all"
        ? fleetGridCards
        : fleetGridCards.filter((card) => card.brand === activeBrand),
    [activeBrand]
  );
  const mobileSlides = useMemo(() => chunkArray(visibleCards, 2), [visibleCards]);

  useEffect(() => {
    setActiveMobileSlide(0);
    if (mobileCarouselRef.current) {
      mobileCarouselRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [activeBrand]);

  const navigateTo = (href: string) => {
    router.push(href);
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

  return (
    <main className="relative h-dvh overflow-hidden text-[#F5F5F5]">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={assetPath("/images/bgcar.png")}
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#1f1f1f_0%,#111111_38%,#050505_70%,#000_100%)] opacity-[0.78]" />
        <div className="absolute inset-0 bg-[radial-gradient(92%_66%_at_50%_48%,rgba(255,255,255,0.18),transparent_68%)]" />
        <div className="absolute inset-0 bg-black/54" />
        <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.74)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/60 via-black/24 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/66 via-black/28 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-dvh w-full max-w-350 flex-col px-5 pt-5 max-[390px]:px-4 sm:px-10 sm:pt-6">
        <header className="relative z-40 shrink-0">
          <InternalPageHeader
            title="Fleet"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            surfaceClassName="bg-black sm:bg-transparent"
            onLogoClick={() => navigateTo("/")}
          />
        </header>

        <section className="mt-7 flex min-h-0 flex-1 flex-col gap-4">
          <div className="text-[0.64rem] uppercase tracking-[0.14em] text-white/58">
            <div className="sm:hidden">
              <div className="grid grid-cols-3 gap-x-3 gap-y-3 text-center">
                <button
                  type="button"
                  onClick={() => setActiveBrand("all")}
                  className={`min-h-10 px-2 py-2 transition ${
                    activeBrand === "all"
                      ? "text-white"
                      : "text-white/58"
                  }`}
                >
                  <span
                    className={`inline-flex h-full items-center border-b pb-1 ${
                      activeBrand === "all"
                        ? "border-[var(--brand-red)]"
                        : "border-transparent"
                    }`}
                  >
                    All Vehicles
                  </span>
                </button>
                {brandFilters.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setActiveBrand(brand)}
                    className={`min-h-10 px-1 transition ${
                      activeBrand === brand ? "text-white" : "text-white/58"
                    }`}
                  >
                    <span
                      className={`inline-flex h-full items-center border-b pb-1 ${
                        activeBrand === brand
                          ? "border-[var(--brand-red)]"
                          : "border-transparent"
                      }`}
                    >
                      {brand}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden items-center justify-between gap-4 sm:flex">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <button
                  type="button"
                  onClick={() => setActiveBrand("all")}
                  className={`transition ${
                    activeBrand === "all"
                      ? "text-white"
                      : "text-white/58 hover:text-white/82"
                  }`}
                >
                  <span
                    className={`inline-flex items-center border-b pb-1 ${
                      activeBrand === "all"
                        ? "border-[var(--brand-red)]"
                        : "border-transparent"
                    }`}
                  >
                    All Vehicles
                  </span>
                </button>
                {brandFilters.map((brand, index) => (
                  <div key={brand} className="flex items-center gap-x-5">
                    <button
                      type="button"
                      onClick={() => setActiveBrand(brand)}
                      className={`transition ${
                        activeBrand === brand
                          ? "text-white"
                          : "text-white/58 hover:text-white/82"
                      }`}
                    >
                      {brand}
                    </button>
                    {index < brandFilters.length - 1 ? (
                      <span className="text-white/24">|</span>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span>Sort By</span>
                <span className="font-semibold text-white">Newest</span>
                <ChevronDown className="size-3 text-[var(--brand-red)]" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <div
              ref={mobileCarouselRef}
              className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden sm:hidden"
              onScroll={(event) => {
                const target = event.currentTarget;
                const slideWidth = target.clientWidth + 16;
                if (slideWidth <= 0) return;
                const nextIndex = Math.round(target.scrollLeft / slideWidth);
                if (nextIndex !== activeMobileSlide) {
                  setActiveMobileSlide(nextIndex);
                }
              }}
            >
              {mobileSlides.map((slide, slideIndex) => (
                <div
                  key={`mobile-slide-${slideIndex}`}
                  className="flex w-full shrink-0 snap-center flex-col gap-4"
                >
                  {slide.map((card, cardIndex) => {
                    const sourceCar = carBySlug.get(card.sourceSlug) ?? cars[0];
                    const absoluteIndex = slideIndex * 2 + cardIndex;

                    return (
                      <article
                        key={`${card.name}-mobile-${absoluteIndex}`}
                        className="relative aspect-[1.4/1] overflow-hidden border border-white/8 bg-black/20 transition-[transform,border-color,box-shadow] duration-300"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveSpecCard({ car: sourceCar, card })}
                          className="group block h-full w-full text-left"
                        >
                          <div className="relative h-full overflow-hidden">
                            <Image
                              src={card.imageSrc}
                              alt={card.name}
                              fill
                              priority={absoluteIndex < 2}
                              loading={absoluteIndex < 2 ? "eager" : "lazy"}
                              sizes="100vw"
                              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.05)_35%,rgba(0,0,0,0.42)_100%)]" />

                            <div className="absolute left-0 top-0 z-10 px-3.5 pt-3.5">
                              <p className="type-eyebrow text-[8.5px] text-white/62">
                                <span className="text-[var(--brand-red)]">
                                  {String(absoluteIndex + 1).padStart(2, "0")}
                                </span>
                                <span>{` / ${card.brand}`}</span>
                              </p>
                              <h2 className="mt-1.5 font-display text-[17.1px] font-black uppercase leading-[0.94] tracking-[-0.05em] text-white">
                                {card.name}
                              </h2>
                            </div>

                            <div className="absolute bottom-2 right-3.5 z-10 flex flex-col items-end text-right">
                              <span className="font-display text-[12.4px] font-semibold leading-none text-white">
                                {formatPrice(sourceCar.pricePerDay)}
                              </span>
                              <span className="mt-1 font-display text-[7.6px] uppercase tracking-[0.16em] text-white/62">
                                Rent Per Day
                              </span>
                            </div>

                            <div className="absolute bottom-2 left-3 z-10">
                              <span className="font-display inline-flex items-center justify-center border border-[var(--brand-red)] bg-[var(--brand-red)] px-2 py-1 text-[6.2px] font-medium uppercase tracking-[0.16em] text-white transition group-hover:brightness-110">
                                <span>Book This Vehicle</span>
                              </span>
                            </div>
                          </div>
                        </button>
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
              {mobileSlides.map((_, index) => (
                <button
                  key={`mobile-slide-dot-${index}`}
                  type="button"
                  aria-label={`Go to vehicle slide ${index + 1}`}
                  onClick={() => {
                    const carousel = mobileCarouselRef.current;
                    if (!carousel) return;
                    carousel.scrollTo({
                      left: index * (carousel.clientWidth + 16),
                      behavior: "smooth",
                    });
                    setActiveMobileSlide(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    activeMobileSlide === index
                      ? "w-6 bg-[var(--brand-red)]"
                      : "w-1.5 bg-white/28"
                  }`}
                />
              ))}
            </div>

            <div className="hidden min-h-0 flex-1 grid-cols-1 gap-3 sm:grid sm:grid-cols-2 sm:gap-4 xl:grid-cols-4 xl:gap-4">
              {visibleCards.map((card, index) => {
                const sourceCar = carBySlug.get(card.sourceSlug) ?? cars[0];

                return (
                  <article
                    key={`${card.name}-desktop-${index}`}
                    className="relative aspect-[1.4/1] overflow-hidden border border-white/8 bg-black/20 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:shadow-[0_24px_60px_rgba(0,0,0,0.48)] sm:aspect-[1.38/1] xl:aspect-[1.32/1]"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveSpecCard({ car: sourceCar, card })}
                      className="group block h-full w-full text-left"
                    >
                      <div className="relative h-full overflow-hidden">
                        <Image
                          src={card.imageSrc}
                          alt={card.name}
                          fill
                          priority={index < 4}
                          loading={index < 4 ? "eager" : "lazy"}
                          sizes="(max-width: 1279px) 50vw, 25vw"
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.05)_35%,rgba(0,0,0,0.42)_100%)]" />

                        <div className="absolute left-0 top-0 z-10 px-3.5 pt-3.5">
                          <p className="type-eyebrow text-[8.5px] text-white/62">
                            <span className="text-[var(--brand-red)]">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span>{` / ${card.brand}`}</span>
                          </p>
                          <h2 className="mt-1.5 font-display text-[17.1px] font-black uppercase leading-[0.94] tracking-[-0.05em] text-white sm:text-[22.7px] xl:text-[16.3px]">
                            {card.name}
                          </h2>
                        </div>

                        <div className="absolute bottom-2 right-3.5 z-10 flex flex-col items-end text-right">
                          <span className="font-display text-[12.4px] font-semibold leading-none text-white sm:text-[14px] xl:text-[12.9px]">
                            {formatPrice(sourceCar.pricePerDay)}
                          </span>
                          <span className="mt-1 font-display text-[7.6px] uppercase tracking-[0.16em] text-white/62 sm:text-[8.5px] xl:text-[7.8px]">
                            Rent Per Day
                          </span>
                        </div>

                        <div className="absolute bottom-2 left-3 z-10">
                          <span className="font-display inline-flex items-center justify-center border border-[var(--brand-red)] bg-[var(--brand-red)] px-2 py-1 text-[6.2px] font-medium uppercase tracking-[0.16em] text-white transition group-hover:brightness-110 sm:px-2.5 sm:text-[6.8px]">
                            <span>Book This Vehicle</span>
                          </span>
                        </div>
                      </div>
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

        </section>

        <PageFooterNote
          showDesktop={false}
          mobilePlacement="static"
          mobileSurfaceClassName="border-t border-white/8 bg-black"
          mobileClassName="w-full pb-safe sm:hidden"
        />
      </div>
      <PageFooterNote mobileClassName="hidden" />

      <AnimatePresence>
        {activeSpecCard ? (
          <FleetSpecsOverlay
            car={activeSpecCard.car}
            displayBrand={activeSpecCard.card.brand}
            displayName={activeSpecCard.card.name}
            imageSrc={activeSpecCard.card.specsImageSrc ?? activeSpecCard.card.imageSrc}
            engineImageSrc={activeSpecCard.card.engineImageSrc}
            engineLabel={activeSpecCard.card.engine}
            powerLabel={activeSpecCard.card.power}
            driveLabel={activeSpecCard.card.drive}
            onClose={() => setActiveSpecCard(null)}
            onLogoClick={() => navigateTo("/")}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}


