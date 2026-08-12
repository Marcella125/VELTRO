"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [activeSpecCard, setActiveSpecCard] = useState<{
    car: Car;
    card: FleetGridCard;
  } | null>(null);
  const [activeBrand, setActiveBrand] = useState<FleetBrandFilter>("all");

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

      <div className="relative z-10 mx-auto flex h-dvh w-full max-w-350 flex-col px-6 pb-6 pt-5 sm:px-10 sm:pt-6">
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
                onClick={() => setActiveBrand("all")}
                className={`border px-4 py-2 transition ${
                  activeBrand === "all"
                    ? "border-[var(--brand-red)] text-white"
                    : "border-white/12 text-white/58 hover:border-white/22 hover:text-white/82"
                }`}
              >
                All Vehicles
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

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-x-3 gap-y-0 [&>article:nth-child(n+2)]:-mt-8 sm:[&>article:nth-child(n+2)]:mt-0 sm:[&>article:nth-child(n+3)]:-mt-8 xl:[&>article:nth-child(n+3)]:mt-0 xl:[&>article:nth-child(n+5)]:-mt-8 sm:grid-cols-2 xl:grid-cols-4">
            {visibleCards.map((card, index) => {
              const sourceCar = carBySlug.get(card.sourceSlug) ?? cars[0];

              return (
                <article
                  key={`${card.name}-${index}`}
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
                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
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

        </section>
      </div>
      <PageFooterNote />

      <AnimatePresence>
        {activeSpecCard ? (
          <FleetSpecsOverlay
            car={activeSpecCard.car}
            displayBrand={activeSpecCard.card.brand}
            displayName={activeSpecCard.card.name}
            imageSrc={activeSpecCard.card.imageSrc}
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


