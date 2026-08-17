"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ActionLink } from "@/components/ui/action-link";
import { CloseButton } from "@/components/ui/close-button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { assetPath } from "@/lib/asset-path";
import type { Car } from "@/models/car.model";
import { FleetSpecsOverlay } from "@/views/components/FleetSpecsOverlay";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import { PageFooterNote } from "@/views/components/PageFooterNote";


const heroSlides = [
  assetPath("/Home bg.png"),
  assetPath("/Home bg.png"),
  assetPath("/Home bg.png"),
];

const detailSlides = [
  assetPath("/images/CBLambo.jpeg"),
  assetPath("/images/CBLambo.jpeg"),
  assetPath("/images/CBLambo.jpeg"),
];

const socialIcons = [
  { id: "instagram", icon: assetPath("/icons/instagram.svg") },
  { id: "tiktok", icon: assetPath("/icons/tiktok.svg") },
  { id: "x", icon: assetPath("/icons/X.svg") },
];

type FeatureStat = {
  title: string;
  label: string;
  note?: string;
};

type AppTab = "home" | "performance" | "car" | "settings" | "contact" | "help";

type SpecSection = {
  title: string;
  rows: { label: string; value: string }[];
};

type SpecCategory =
  | "Performance"
  | "Driving Dynamics & Technology"
  | "Wheels, Tyres & Brakes"
  | "Design & Comfort"
  | "Dimensions & Weight"
  | "Fuel Consumption & Emissions (WLTP)"
  | "Powertrain & Engine";

const featureStats: FeatureStat[] = [
  { title: "2023", label: "Year" },
  { title: "Black Matte", label: "Color" },
  { title: "640 HP", label: "Horsepower" },
  { title: "7-Speed DCT", label: "Transmission" },
  { title: "325 km/h", label: "Top Speed" },
  { title: "0-100 in 3.1 s", label: "Acceleration" },
];

const specsLeft: SpecSection[] = [
  {
    title: "Powertrain & Engine",
    rows: [
      { label: "Engine", value: "Naturally aspirated V10" },
      { label: "Displacement", value: "5.2 L" },
      { label: "Max Power", value: "640 hp @ 8,000 rpm" },
      { label: "Max Torque", value: "600 Nm @ 6,500 rpm" },
      { label: "Transmission", value: "7-speed dual-clutch (LDF)" },
      { label: "Drivetrain", value: "RWD with torque vectoring" },
    ],
  },
  {
    title: "Performance",
    rows: [
      { label: "0–100 km/h", value: "3.1 s" },
      { label: "0–200 km/h", value: "9.1 s" },
      { label: "Top Speed", value: "325 km/h" },
      { label: "Power-to-Weight", value: "2.09 kg/hp" },
    ],
  },
  {
    title: "Dimensions & Weight",
    rows: [
      { label: "Length", value: "4,520 mm" },
      { label: "Width", value: "2,236 mm (with mirrors)" },
      { label: "Height", value: "1,180 mm" },
      { label: "Wheelbase", value: "2,620 mm" },
      { label: "Dry Weight", value: "1,542 kg" },
    ],
  },
  {
    title: "Wheels, Tyres & Brakes",
    rows: [
      { label: "Front", value: "245/30 ZR20, carbon-ceramic" },
      { label: "Rear", value: "305/30 ZR20, carbon-ceramic" },
      { label: "Brake Discs", value: "CCM, cross-drilled" },
      { label: "Calipers", value: "6-piston front / 4-piston rear" },
    ],
  },
];

const specsRight: SpecSection[] = [
  {
    title: "Fuel Consumption & Emissions (WLTP)",
    rows: [
      { label: "Combined", value: "13.9 L/100 km" },
      { label: "CO₂ Emissions", value: "332 g/km" },
      { label: "Fuel Type", value: "Premium unleaded" },
    ],
  },
  {
    title: "Driving Dynamics & Technology",
    rows: [
      { label: "Chassis", value: "Aluminum & carbon composite" },
      { label: "Aero", value: "Active aero, rear diffuser" },
      { label: "Modes", value: "STRADA / SPORT / CORSA" },
      { label: "Steering", value: "EPS with rear-wheel steer" },
    ],
  },
  {
    title: "Design & Comfort",
    rows: [
      { label: "Roof", value: "Electro-hydraulic soft top" },
      { label: "Interior", value: "Alcantara + carbon inlays" },
      { label: "Seats", value: "Sport bucket, heated" },
      { label: "Infotainment", value: "8.4\" HMI, Apple CarPlay" },
    ],
  },
];

const getSpecByTitle = (list: SpecSection[], title: string) =>
  list.find((section) => section.title === title);

const specCategories: SpecCategory[] = [
  "Performance",
  "Driving Dynamics & Technology",
  "Wheels, Tyres & Brakes",
  "Design & Comfort",
  "Dimensions & Weight",
  "Fuel Consumption & Emissions (WLTP)",
  "Powertrain & Engine",
];

const allSpecSections = [...specsLeft, ...specsRight];
const homeHeroMeta = {
  eyebrow: "01",
  marque: "Lamborghini",
  titleLead: "EVO",
  titleAccent: "SPYDER",
  featureLine: "V10 • AWD • OPEN AIR",
  description: "Italian performance. Open-air exhilaration.",
};

const evoSpecCar: Car = {
  id: "hero-evo-spyder",
  slug: "hero-evo-spyder",
  name: "Evo Spyder",
  brand: "Lamborghini",
  year: 2023,
  bodyType: "Spyder",
  pricePerDay: 1600,
  image: "lambo-specs",
  featured: true,
  specs: [
    { label: "Power", value: "640 HP" },
    { label: "Torque", value: "600 Nm" },
    { label: "0-60", value: "2.9s" },
    { label: "0-100", value: "3.1 s" },
    { label: "Drive", value: "AWD" },
    { label: "Top Speed", value: "325 KM/H" },
    { label: "Interior", value: "Onyx leather" },
    { label: "Audio", value: "16 speaker studio" },
    { label: "Wheels", value: "20/21 in forged" },
    { label: "Tires", value: "Pirelli P Zero" },
    { label: "Brakes", value: "Carbon ceramic" },
    { label: "Comfort", value: "Adaptive suspension" },
    { label: "Design", value: "Aerodynamic body kit" },
    { label: "Consumption", value: "13.7 L/100KM" },
    { label: "Emissions", value: "311 g/km" },
    { label: "Range", value: "410 mi" },
  ],
};

export function HeroShowcase() {
  const router = useRouter();
  const homeHref = "/";
  const prefersReducedMotion = useReducedMotion();
  const specTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState<"home" | "rideit">("home");
  const [activeTab, setActiveTab] = useState<AppTab>("car");
  const [isHudOpen, setIsHudOpen] = useState(false);
  const [isMobileSpecMenuOpen, setIsMobileSpecMenuOpen] = useState(false);
  const [activeSpecCategory, setActiveSpecCategory] = useState<SpecCategory>("Performance");
  const swipeStartY = useRef<number | null>(null);
  const swipeDeltaY = useRef(0);

  const navigateTo = (href: string) => {
    document.body.classList.remove("home-scroll-hidden");
    router.push(href);
  };

  useEffect(() => {
    const body = document.body;
    if (currentApp === "home") {
      body.classList.add("home-scroll-hidden");
      return;
    }
    body.classList.remove("home-scroll-hidden");
    return () => {
      body.classList.remove("home-scroll-hidden");
    };
  }, [currentApp]);

  // Keep body scroll enabled so every page remains scrollable.

  useOverlayBehavior(isHudOpen, () => setIsHudOpen(false));

  useEffect(() => {
    if (currentApp !== "rideit" || isHudOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCurrentApp("home");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentApp, isHudOpen]);

  const slideSrc = currentApp === "home" ? heroSlides[0] : detailSlides[0];

  const whatsappNumber = "+96170335113";
  const whatsappMessage =
    "Hello, I'm interested in the Lamborghini EVO Spyder rental. Please share availability.";
  const whatsappUrl = useMemo(() => {
    const normalized = whatsappNumber.replace(/[^\d+]/g, "");
    return `https://wa.me/${normalized}?text=${encodeURIComponent(whatsappMessage)}`;
  }, [whatsappMessage, whatsappNumber]);

  const heroDescription =
    "Open-top V10 performance with razor-sharp dynamics, dramatic presence, and a cockpit designed for pure driver focus.";
  const activeSpecSection =
    allSpecSections.find((section) => section.title === activeSpecCategory) ?? allSpecSections[0];

  const handleViewFeatures = () => {
    setIsMobileSpecMenuOpen(false);
    setActiveSpecCategory("Performance");
    setIsHudOpen(true);
  };
  const openEvoSpecs = () => {
    setIsMobileSpecMenuOpen(false);
    setActiveSpecCategory("Performance");
    setIsHudOpen(true);
  };
  const handleSpecTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();
      const direction =
        event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (currentIndex + direction + specCategories.length) % specCategories.length;
      const nextCategory = specCategories[nextIndex];
      setActiveSpecCategory(nextCategory);
      specTabRefs.current[nextIndex]?.focus();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveSpecCategory(specCategories[currentIndex]);
    }
  };

  const getSpecCategoryNumber = (category: SpecCategory) =>
    String(specCategories.indexOf(category) + 1).padStart(2, "0");

  const rideitTabs: Record<AppTab, { title: string; description: string; stats: FeatureStat[] }> =
    {
      home: {
        title: "Lamborghini EVO Spyder",
        description:
          "Explore the EVO Spyder lineup with premium details, signature styling, and a driver-focused cockpit built for everyday elegance.",
        stats: featureStats,
      },
      performance: {
        title: "Performance",
        description:
          "Track-ready output, precision handling, and calibrated dynamics designed for aggressive acceleration and stable high-speed runs.",
        stats: featureStats,
      },
      car: {
        title: "Lamborghini EVO Spyder",
        description:
          "Experience pure Italian supercar excitement with the Lamborghini Huracan EVO Spyder, a high-performance convertible available for rent. Built for drivers who demand aggressive design, naturally aspirated V10 power, and open-top driving thrills, the EVO Spyder delivers breathtaking acceleration, precision handling, and iconic Lamborghini presence. Whether cruising city streets or arriving in style at exclusive destinations, this supercar guarantees an unforgettable luxury experience. Carbon-fiber details, bespoke materials, and a driver-focused cockpit elevate every moment, while advanced dynamics keep the ride precise and composed. From sunrise coastal runs to exclusive evening arrivals, the EVO Spyder turns every mile into an event and every stop into a statement.",
        stats: featureStats,
      },
      settings: {
        title: "Controls",
        description:
          "Configure drive modes, adaptive systems, and cockpit preferences to tailor the EVO Spyder experience.",
        stats: featureStats,
      },
      contact: {
        title: "Contact",
        description:
          "Reach the concierge team for availability, delivery, and tailored rental support.",
        stats: featureStats,
      },
      help: {
        title: "Help",
        description:
          "Find quick support for bookings, requirements, and ride assistance.",
        stats: featureStats,
      },
    };

  const dockItems = [
    { id: "home" as const, label: "Home", icon: assetPath("/icons/Home.svg") },
    { id: "performance" as const, label: "Performance", icon: assetPath("/icons/Acceleration.svg") },
    { id: "car" as const, label: "Car", icon: assetPath("/icons/fleet.svg") },
    { id: "settings" as const, label: "Controls", icon: assetPath("/icons/mission.svg") },
    { id: "contact" as const, label: "Contact", icon: assetPath("/icons/contactus.svg") },
    { id: "help" as const, label: "Help", icon: assetPath("/icons/FAQ.svg") },
  ];

  const enterRideIt = () => {
    setCurrentApp("rideit");
    setActiveTab("car");
  };

  const closeRideIt = () => {
    setCurrentApp("home");
  };

  const handleRideItTouchStart = (event: React.TouchEvent) => {
    swipeStartY.current = event.touches[0]?.clientY ?? null;
    swipeDeltaY.current = 0;
  };

  const handleRideItTouchMove = (event: React.TouchEvent) => {
    if (swipeStartY.current === null) return;
    swipeDeltaY.current = swipeStartY.current - (event.touches[0]?.clientY ?? 0);
  };

  const handleRideItTouchEnd = () => {
    if (swipeDeltaY.current > 70) {
      closeRideIt();
    }
    swipeStartY.current = null;
    swipeDeltaY.current = 0;
  };

  const activeRideItTab = rideitTabs[activeTab] ?? rideitTabs.car;
  const headerTitle = currentApp === "rideit" ? "" : "Home";
  const showRideItDock = currentApp === "rideit" && !isHudOpen;

  const handleDockSelect = (id: string) => {
    if (id === "home") {
      setCurrentApp("home");
      router.push(homeHref);
      return;
    }
    if (id === "blogs") {
      navigateTo("/blogs");
      return;
    }
    if (id === "fleet") {
      navigateTo("/fleet");
      return;
    }
    if (id === "mission") {
      navigateTo("/mission");
      return;
    }
    if (id === "contact") {
      navigateTo("/contact");
      return;
    }
    if (id === "faq") {
      navigateTo("/faq");
    }
  };

  return (
    <section className="relative min-h-screen">
      {/* Background slideshow (desktop) */}
      <div className="fixed inset-0 hidden sm:block">
        <div className="absolute inset-0">
          <Image
            src={currentApp === "home" ? assetPath("/Home bg.png") : slideSrc}
            alt="Lamborghini EVO Spyder"
            fill
            priority
            quality={100}
            className="object-cover object-center"
          />
        </div>
      </div>
      {/* Mobile background */}
      <div className="fixed inset-0 bg-black sm:hidden">
        {currentApp === "rideit" ? (
          <div className="absolute inset-0">
            <Image
              src={assetPath("/back3.jpg")}
              alt=""
              fill
              priority
              quality={90}
              className="object-cover object-center"
            />
          </div>
        ) : null}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <div className="relative z-30">
          <div className="absolute inset-x-0 top-0 h-full bg-black sm:hidden" />
          <div className="mx-auto w-full max-w-350 px-5 pt-5 max-[390px]:px-4 sm:px-10 sm:pt-6">
            <InternalPageHeader
              title={headerTitle}
              isDockOpen={isDockOpen}
              onOpenChange={setIsDockOpen}
              onSelect={handleDockSelect}
              surfaceClassName="bg-black sm:bg-transparent"
              onLogoClick={() => {
                if (currentApp === "rideit") {
                  setCurrentApp("home");
                  return;
                }
                navigateTo(homeHref);
              }}
            />
          </div>
        </div>

        <AnimatePresence mode="sync">
          {/* HERO VIEW */}
          {currentApp === "home" ? (
            <motion.div
              key="hero-view"
              className="relative flex flex-1 flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              {/* Mobile hero layout */}
              <div className="flex flex-1 flex-col sm:hidden">
                <div className="relative flex flex-1 flex-col overflow-hidden bg-black">
                  <div className="relative min-h-0 flex-1">
                    <Image
                      src={assetPath("/images/Home bg mobile.png")}
                      alt="Lamborghini EVO Spyder"
                      fill
                      priority
                      quality={95}
                      className="object-cover object-center-bottom"
                      sizes="100vw"
                    />

                    <div className="absolute inset-x-0 top-0 z-10 px-5 pt-5 max-[390px]:px-4 max-[390px]:pt-4">
                      <div className="mt-3 max-[390px]:mt-1">
                        <div className="ml-[0.2cm] inline-flex items-center gap-2 font-body text-[0.82rem] font-medium uppercase leading-none tracking-[0.18em] text-white/62 max-[390px]:text-[0.7rem] max-[390px]:tracking-[0.14em]">
                          <span className="text-[var(--brand-red)]">{homeHeroMeta.eyebrow}</span>
                          <span className="text-white/38">/</span>
                          <span>{homeHeroMeta.marque}</span>
                        </div>

                        <div className="mt-6 max-[390px]:mt-4">
                          <p className="font-display text-[5.45rem] font-black leading-[0.82] tracking-[-0.09em] text-white max-[390px]:text-[4.1rem] max-[390px]:leading-[0.84]">
                            {homeHeroMeta.titleLead}
                          </p>
                          <p className="font-display -mt-1 text-[2.85rem] font-black leading-[0.9] tracking-[-0.055em] text-[var(--brand-red)] max-[390px]:text-[2.1rem]">
                            {homeHeroMeta.titleAccent}
                          </p>
                        </div>

                        <p className="mt-4 font-body text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white/72 max-[390px]:mt-3 max-[390px]:text-[0.68rem] max-[390px]:tracking-[0.14em]">
                          <span>V10</span>
                          <span className="px-2 text-[var(--brand-red)]">•</span>
                          <span>AWD</span>
                          <span className="px-2 text-[var(--brand-red)]">•</span>
                          <span>OPEN AIR</span>
                        </p>

                        <div className="mt-7 h-px w-14 bg-[var(--brand-red)] max-[390px]:mt-5 max-[390px]:w-10" />
                      </div>

                      <p className="mt-7 max-w-[15.5rem] font-body text-[16px] leading-[1.28] text-white/82 max-[390px]:mt-5 max-[390px]:max-w-[12rem] max-[390px]:text-[14px] max-[390px]:leading-[1.2]">
                        Italian performance.
                        <br />
                        Open-air exhilaration.
                      </p>

                      <div className="mt-7 max-[390px]:mt-5">
                        <button
                          type="button"
                          onClick={openEvoSpecs}
                          className="font-display inline-flex h-[2.4rem] min-w-[12.5rem] items-center justify-center border border-[var(--brand-red)] bg-[var(--brand-red)] px-4 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white max-[390px]:h-[2.2rem] max-[390px]:min-w-[10.75rem] max-[390px]:px-3 max-[390px]:text-[0.64rem] max-[390px]:tracking-[0.12em]"
                        >
                          <span className="text-center">Explore The Evo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <PageFooterNote
                  showDesktop={false}
                  mobilePlacement="static"
                  mobileSurfaceClassName="border-t border-white/8 bg-black"
                  mobileClassName="w-full pb-safe"
                />
              </div>

              {/* Desktop hero layout */}
              <div className="relative mx-auto hidden h-full w-full max-w-350 flex-1 sm:block">
                <div className="relative z-10 grid h-full grid-cols-[minmax(340px,390px)_minmax(0,1fr)] items-center gap-6 px-8 pb-10 pt-6 lg:px-10">
                  <div className="self-center -translate-x-[0.2cm] translate-y-[1.5cm] max-w-[22rem]">
                    <div className="font-body translate-x-[0.28cm] text-[0.95rem] font-medium uppercase tracking-[0.2em] text-white/62">
                      <span className="text-[var(--brand-red)]">{homeHeroMeta.eyebrow}</span>
                      <span className="px-2.5 text-white/38">/</span>
                      <span>{homeHeroMeta.marque}</span>
                    </div>

                    <div className="mt-6">
                      <h1 className="font-display text-[clamp(6.55rem,8.06vw,7.7rem)] font-black leading-[0.8] tracking-[-0.105em] text-white">
                        {homeHeroMeta.titleLead}
                      </h1>
                      <p className="font-display mt-1 text-[clamp(3.25rem,4.22vw,3.8rem)] font-black leading-[0.84] tracking-[-0.06em] text-[var(--brand-red)]">
                        {homeHeroMeta.titleAccent}
                      </p>
                    </div>

                    <p className="mt-4 font-body text-[0.88875rem] font-medium uppercase tracking-[0.22em] text-white/72">
                      <span>V10</span>
                      <span className="px-2 text-[var(--brand-red)]">•</span>
                      <span>AWD</span>
                      <span className="px-2 text-[var(--brand-red)]">•</span>
                      <span>OPEN AIR</span>
                    </p>

                    <div className="mt-5 h-px w-14 bg-[var(--brand-red)]" />

                    <p className="mt-5 max-w-[16rem] font-body text-[1.18rem] leading-[1.24] text-white/82">
                      Italian performance.
                      <br />
                      Open-air exhilaration.
                    </p>

                    <div className="mt-7">
                      <button
                        type="button"
                        onClick={openEvoSpecs}
                        className="font-display inline-flex h-[2.65rem] min-w-[13.85rem] items-center justify-center border border-[var(--brand-red)] bg-[var(--brand-red)] px-4 text-[0.76rem] font-medium uppercase tracking-[0.19em] text-white"
                      >
                        <span className="text-center">Explore The Evo</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative flex h-full items-end justify-center" />
                </div>
              </div>
            </motion.div>
          ) : (
            /* DETAIL VIEW */
            <motion.div
              key="detail-view"
              className="fixed inset-0 z-20 flex flex-col overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              <div className="relative mx-auto flex min-h-screen w-full max-w-350 items-center px-6 pb-10 pt-24 sm:px-10 sm:pb-12">
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.18)_18%,rgba(0,0,0,0.62)_100%)]" />
                <div className="relative z-10 grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-12">
                  <motion.div
                    className="max-w-[760px] lg:col-start-2 lg:w-full lg:max-w-[500px]"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                  >
                    <h2 className="type-card-title text-white sm:text-[28px]">
                      Lamborghini EVO Spyder
                    </h2>

                    <div className="mt-5 flex items-end gap-2 text-white sm:text-[#b3242d]">
                      <span className="type-price text-[15px] sm:text-[16px]">€</span>
                      <span className="type-price">
                        3,300
                      </span>
                      <span className="type-price-suffix pb-1 text-white/58">
                        / Day
                      </span>
                    </div>

                    <p className="type-body mt-6 max-w-[32rem] text-white/74 lg:max-w-[28rem]">
                      Open-top V10 performance with razor-sharp dynamics, dramatic presence, and a cockpit designed for pure driver focus.
                    </p>

                    <div className="mt-8">
                      <PrimaryButton
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-[220px] px-9"
                      >
                        Rent Now
                      </PrimaryButton>
                    </div>
                  </motion.div>

                  <motion.div
                    className="max-w-[460px] lg:col-start-2 lg:w-full lg:max-w-[500px]"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
                  >
                    <div className="border-t border-white/8 pt-6">
                      <div className="flex flex-wrap items-center justify-start gap-x-5 gap-y-3 text-white/72">
                      {featureStats.map((item, statIndex) => (
                        <motion.div
                          key={item.label}
                          className="group inline-flex items-center gap-3"
                          whileHover={{ y: -1 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <span className="h-[3px] w-[3px] rounded-full bg-white/28" aria-hidden="true" />
                          <div className="inline-flex items-baseline gap-2">
                            <span className="type-spec-value text-white/92 transition-colors duration-200 group-hover:text-white">
                              {item.title}
                            </span>
                            <span className="type-eyebrow text-[10px] text-white/44">
                              {item.label}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                      </div>
                    </div>

                    <div className="mt-7 flex justify-start">
                      <ActionLink
                        type="button"
                        onClick={handleViewFeatures}
                        className="text-white/68 hover:text-white"
                      >
                        View Specifications
                      </ActionLink>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Specs Overlay */}
      {isHudOpen ? (
        <FleetSpecsOverlay
          car={evoSpecCar}
          displayBrand="Lamborghini"
          displayName="Evo Spyder"
          imageSrc={assetPath("/images/lambo specs.png")}
          engineLabel="V10"
          powerLabel="640 HP"
          driveLabel="AWD"
          onClose={() => setIsHudOpen(false)}
          onLogoClick={() => navigateTo("/")}
          backLabel="Back To Home"
        />
      ) : null}

      <PageFooterNote
        mobileClassName={currentApp === "home" ? "hidden" : ""}
      />
    </section>
  );
}
