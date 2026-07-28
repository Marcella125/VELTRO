"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ActionLink } from "@/components/ui/action-link";
import { CloseButton } from "@/components/ui/close-button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { usePageTransition } from "@/hooks/use-page-transition";
import { assetPath } from "@/lib/asset-path";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";


const heroSlides = [
  assetPath("/images/lamboevospyder.jpeg"),
  assetPath("/images/lamboevospyderback.jpeg"),
  assetPath("/images/lamboevospyder.jpeg"),
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

export function HeroShowcase() {
  const router = useRouter();
  const homeHref = "/";
  const prefersReducedMotion = useReducedMotion();
  const specTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [index, setIndex] = useState(0);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState<"home" | "rideit">("home");
  const [activeTab, setActiveTab] = useState<AppTab>("car");
  const [isHudOpen, setIsHudOpen] = useState(false);
  const [activeSpecCategory, setActiveSpecCategory] = useState<SpecCategory>("Performance");
  const swipeStartY = useRef<number | null>(null);
  const swipeDeltaY = useRef(0);
  const { runTransition } = usePageTransition();

  const totalSlides = currentApp === "home" ? heroSlides.length : detailSlides.length;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [totalSlides]);

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

  const slideSrc = useMemo(
    () => (currentApp === "home" ? heroSlides : detailSlides)[index],
    [index, currentApp]
  );

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

  const enterRideIt = () =>
    runTransition(() => {
      setCurrentApp("rideit");
      setActiveTab("car");
    }, { awaitNavigation: false });

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
      setIsDockOpen(false);
      runTransition(() => {
        setCurrentApp("home");
        router.push(homeHref);
      });
      return;
    }
    if (id === "blogs") {
      setIsDockOpen(false);
      runTransition(() => {
        router.push("/blogs");
      });
      return;
    }
    if (id === "fleet") {
      setIsDockOpen(false);
      runTransition(() => {
        router.push("/fleet");
      });
      return;
    }
    if (id === "mission") {
      setIsDockOpen(false);
      runTransition(() => {
        router.push("/mission");
      });
      return;
    }
    if (id === "contact") {
      setIsDockOpen(false);
      runTransition(() => {
        router.push("/contact");
      });
      return;
    }
    if (id === "faq") {
      setIsDockOpen(false);
      runTransition(() => {
        router.push("/faq");
      });
    }
  };

  return (
    <section className="relative min-h-screen">
      {/* Background slideshow (desktop) */}
      <div className="fixed inset-0 hidden sm:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideSrc}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            <Image
              src={slideSrc}
              alt="Lamborghini EVO Spyder"
              fill
              priority
              quality={100}
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-red-700/20 blur-[120px]" />
      </div>
      {/* Mobile background */}
      <div className="fixed inset-0 sm:hidden">
        <Image
          src={assetPath("/back1.jpg")}
          alt=""
          fill
          priority
          quality={90}
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <div className="relative z-30">
          <div className="mx-auto w-full max-w-350 px-6 pt-5 sm:px-10">
            <InternalPageHeader
              title={headerTitle}
              isDockOpen={isDockOpen}
              onOpenChange={(next) => {
                setIsDockOpen(next);
                if (next && isHudOpen) {
                  setIsHudOpen(false);
                }
              }}
              onSelect={handleDockSelect}
              onLogoClick={() => {
                if (currentApp === "rideit") {
                  setCurrentApp("home");
                  setIsDockOpen(false);
                  return;
                }
                setIsDockOpen(false);
                runTransition(() => router.push(homeHref));
              }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
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
              {/* Social icons */}
              <div className="social-icons-left-center">
                {socialIcons.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-transparent"
                    whileHover={{ scale: 1.08, boxShadow: "0 0 18px rgba(255,255,255,0.25)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <span
                      className="h-4 w-4"
                      style={{
                        backgroundColor: "#ffffff",
                        WebkitMaskImage: `url(${item.icon})`,
                        maskImage: `url(${item.icon})`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                      }}
                      aria-hidden="true"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Desktop spacer (keeps original vertical rhythm) */}
              <div className="hidden flex-1 sm:block" />

              {/* Mobile hero layout */}
              <div className="relative flex flex-1 flex-col px-6 pb-10 pt-10 sm:hidden">
                <div className="flex-1" />

                <div className="relative mt-[22vh]">
                  <Image
                    src={assetPath("/pattern1.svg")}
                    alt=""
                    width={600}
                    height={380}
                    className="pointer-events-none absolute -bottom-[10%] left-1/2 -translate-x-1/2 opacity-60"
                  />

                  <div className="flex items-center justify-center gap-4 pb-4">
                    {heroSlides.map((_, dotIndex) => (
                      <motion.button
                        key={`mobile-dot-${dotIndex}`}
                        type="button"
                        onClick={() => setIndex(dotIndex)}
                        className="relative flex h-3 w-3 items-center justify-center"
                        animate={{ scale: dotIndex === index ? 1.2 : 1 }}
                        transition={{ type: "spring", stiffness: 280, damping: 16 }}
                        aria-label={`Go to slide ${dotIndex + 1}`}
                      >
                        <span
                          className={`block h-2.5 w-2.5 rounded-full ${
                            dotIndex === index ? "bg-[#b3242d]" : "bg-white/90"
                          }`}
                        />
                        {dotIndex === index && (
                          <span className="absolute h-1.5 w-1.5 rounded-full bg-black" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  <p className="type-card-title mt-2 text-center text-[18px] text-white/95">
                    Lamborghini EVO Spyder
                  </p>
                  <p className="type-body mt-3 text-[11px] leading-[1.5] text-white/80 text-justify">
                    Lamborghini Huracan EVO Spyder brings open‑top V10 performance with sharp, confident handling.
                    Its aggressive design and iconic presence make every arrival unforgettable.
                    Refined materials and a driver‑focused cockpit keep every moment pure Lamborghini.
                  </p>

                  <motion.button
                    type="button"
                    className="type-button mt-6 h-12 w-full bg-[#b3242d] text-white"
                    onClick={enterRideIt}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 240, damping: 20 }}
                  >
                    Ride it
                  </motion.button>
                </div>
              </div>

              {/* Desktop hero layout */}
              <div className="mx-auto mt-2 hidden w-full max-w-350 items-end justify-between pl-16 pr-4 sm:flex">
                <div className="flex-1">
                  <p className="type-card-title mb-3 text-[18px] text-white/90">
                    Lamborghini EVO Spyder
                  </p>
                  <p
                    className="text-white/85 text-justify"
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.6",
                      fontWeight: 400,
                    }}
                  >
                    Experience pure Italian supercar excitement with the Lamborghini Huracan EVO Spyder, a high-performance convertible
                    available for rent. Built for drivers who demand aggressive design, naturally aspirated V10 power, and open-top driving thrills,
                    the EVO Spyder delivers breathtaking acceleration, precision handling, and iconic Lamborghini presence. Whether cruising
                    city streets or arriving in style at exclusive destinations, this supercar guarantees an unforgettable luxury experience.
                    Carbon-fiber details, bespoke materials, and a driver-focused cockpit elevate every moment, while advanced dynamics keep
                    the ride precise and composed. From sunrise coastal runs to exclusive evening arrivals, the EVO Spyder turns every mile into
                    an event and every stop into a statement.
                  </p>
                </div>

                <div className="relative mt-0 flex w-105 shrink-0 items-center justify-end gap-6">
                  <Image
                    src={assetPath("/pattern1.svg")}
                    alt=""
                    width={800}
                    height={600}
                    className="pointer-events-none absolute -right-32 opacity-85"
                    style={{ top: "-392px" }}
                  />
                  <PrimaryButton
                    type="button"
                    className="relative z-10 w-56"
                    onClick={enterRideIt}
                  >
                    Ride It
                  </PrimaryButton>
                </div>
              </div>
              <p className="mt-4 mb-4 hidden text-center text-[11px] tracking-[0.03em] text-white/55 sm:block">
                Platinum all rights reserved &copy; 2026
              </p>
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
              {/* Social icons (same placement) */}
              <div className="social-icons-left-center">
                {socialIcons.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-transparent"
                    whileHover={{ scale: 1.08, boxShadow: "0 0 18px rgba(255,255,255,0.25)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <span
                      className="h-4 w-4"
                      style={{
                        backgroundColor: "#ffffff",
                        WebkitMaskImage: `url(${item.icon})`,
                        maskImage: `url(${item.icon})`,
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                      }}
                      aria-hidden="true"
                    />
                  </motion.button>
                ))}
              </div>

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

                    <div className="mt-5 flex items-end gap-2 text-[#b3242d]">
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
      <AnimatePresence>
        {isHudOpen && (
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
                open: { opacity: 0.9 },
              }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => setIsHudOpen(false)}
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="specifications-title"
              className="relative mx-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-350 flex-col overflow-hidden border border-white/10 bg-[#0B0B0D] shadow-[0_24px_80px_rgba(0,0,0,0.62)] sm:max-h-[calc(100dvh-2.5rem)]"
              variants={{
                closed: prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 10 },
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
                    id="specifications-title"
                    className="type-eyebrow text-[#F5F5F5]"
                  >
                    Specifications
                  </div>
                  <CloseButton onClick={() => setIsHudOpen(false)} />
                </div>
              </div>

              <div className="platinum-specs-scroll mt-4 flex-1 overflow-y-auto px-7 pb-6 sm:px-9 sm:pb-8">
                <div className="sm:hidden">
                  <label
                    htmlFor="spec-category-select"
                    className="type-eyebrow mb-2 block text-white/46"
                  >
                    Category
                  </label>
                  <div className="border-b border-white/10 pb-5">
                    <select
                      id="spec-category-select"
                      value={activeSpecCategory}
                      onChange={(event) =>
                        setActiveSpecCategory(event.target.value as SpecCategory)
                      }
                      className="type-button w-full border border-white/10 bg-[#0F0F12] px-4 py-3 text-left text-white outline-none transition focus:border-[#C1121F]/70"
                    >
                      {specCategories.map((category) => (
                        <option key={category} value={category}>
                          {getSpecCategoryNumber(category)} {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="hidden sm:grid sm:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] sm:gap-10 lg:gap-14">
                  <div
                    className="border-r border-white/8 pr-8"
                    role="tablist"
                    aria-orientation="vertical"
                    aria-label="Specification categories"
                  >
                    <div className="space-y-1">
                      {specCategories.map((category, categoryIndex) => {
                        const isActive = activeSpecCategory === category;
                        const tabId = `spec-tab-${categoryIndex}`;
                        const panelId = `spec-panel-${categoryIndex}`;

                        return (
                          <button
                            key={category}
                            ref={(node) => {
                              specTabRefs.current[categoryIndex] = node;
                            }}
                            id={tabId}
                            type="button"
                            role="tab"
                            tabIndex={isActive ? 0 : -1}
                            aria-selected={isActive}
                            aria-controls={panelId}
                            onClick={() => setActiveSpecCategory(category)}
                            onKeyDown={(event) => handleSpecTabKeyDown(event, categoryIndex)}
                            className={`group relative block w-full border-l py-3 pl-5 pr-3 text-left transition ${
                              isActive
                                ? "border-[#C1121F] pl-7 text-[#C1121F]"
                                : "border-transparent text-white/48 hover:text-white/82"
                            }`}
                          >
                            <span
                              className={`type-eyebrow block ${
                                isActive ? "text-[#C1121F]" : "text-white/35"
                              }`}
                            >
                              {getSpecCategoryNumber(category)}
                            </span>
                            <span
                              className={`type-nav mt-1 block leading-6 ${
                                isActive ? "font-semibold" : "font-medium"
                              }`}
                            >
                              {category}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative min-w-0">
                    <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 bg-[radial-gradient(circle,rgba(193,18,31,0.12),transparent_72%)] blur-[22px]" />
                    <AnimatePresence mode="wait">
                      <motion.section
                        key={activeSpecSection.title}
                        id={`spec-panel-${specCategories.indexOf(activeSpecCategory)}`}
                        role="tabpanel"
                        aria-labelledby={`spec-tab-${specCategories.indexOf(activeSpecCategory)}`}
                        className="relative space-y-4"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.24, ease: "easeOut" }}
                      >
                        <div className="space-y-3 border-b border-white/10 pb-5">
                          <p className="type-eyebrow text-white/42">
                            {getSpecCategoryNumber(activeSpecCategory)} Technical Data
                          </p>
                          <h3 className="type-section-title text-[#F5F5F5]">
                            {activeSpecSection.title}
                          </h3>
                        </div>

                        <div className="space-y-0">
                          {activeSpecSection.rows.map((specRow) => (
                            <div
                              key={`${activeSpecSection.title}-${specRow.label}`}
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
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-6 sm:hidden">
                  <AnimatePresence mode="wait">
                    <motion.section
                      key={activeSpecSection.title}
                      id={`spec-panel-${specCategories.indexOf(activeSpecCategory)}`}
                      role="tabpanel"
                      aria-labelledby={`spec-tab-${specCategories.indexOf(activeSpecCategory)}`}
                      className="space-y-4"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                    >
                      <div className="space-y-3 border-b border-white/10 pb-5">
                        <p className="type-eyebrow text-white/42">
                          {getSpecCategoryNumber(activeSpecCategory)} Technical Data
                        </p>
                        <h3 className="type-card-title text-[#F5F5F5]">
                          {activeSpecSection.title}
                        </h3>
                      </div>

                      <div className="space-y-0">
                        {activeSpecSection.rows.map((specRow) => (
                          <div
                            key={`${activeSpecSection.title}-${specRow.label}`}
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
                    </motion.section>
                  </AnimatePresence>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero dots (only in hero view) */}
      {currentApp === "home" && (
        <div className="absolute right-10 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
          {heroSlides.map((_, dotIndex) => (
            <motion.button
              key={`dot-${dotIndex}`}
              type="button"
              onClick={() => setIndex(dotIndex)}
              className="relative flex h-3 w-3 items-center justify-center"
              animate={{ scale: dotIndex === index ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 16 }}
              aria-label={`Go to slide ${dotIndex + 1}`}
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full ${
                  dotIndex === index ? "bg-[#b3242d]" : "bg-white/90"
                }`}
              />
              {dotIndex === index && <span className="absolute h-1.5 w-1.5 rounded-full bg-black" />}
            </motion.button>
          ))}
        </div>
      )}
    </section>
  );
}
