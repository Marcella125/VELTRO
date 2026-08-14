"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { PrimaryButton } from "@/components/ui/primary-button";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";

const carSlides = [
  assetPath("/images/lamboevospyder.jpeg"),
  assetPath("/images/lamboevospyderback.jpeg"),
];

const socialIcons = [
  {
    id: "instagram",
    icon: assetPath("/icons/instagram.svg"),
    href: "https://www.instagram.com/platinumeditionofficial?igsh=MTJ4bzNjeWk2cDZoYQ%3D%3D",
  },
  {
    id: "tiktok",
    icon: assetPath("/icons/tiktok.svg"),
    href: "https://www.tiktok.com/@platinumeditionofficial?_r=1&_t=ZS-92Jxmr9Bg5S",
  },
  { id: "x", icon: assetPath("/icons/X.svg"), href: "#" },
];

type FeatureStat = {
  title: string;
  label: string;
  note?: string;
};

const featureStats: FeatureStat[] = [
  { title: "2023", label: "Year" },
  { title: "Black\nMatte", label: "Color" },
  { title: "640 hp", label: "Horsepower" },
  {
    title: "7-speed\nautomatic",
    label: "Transmission",
    note: "Lamborghini Doppia Frizione (LDF)",
  },
  { title: "325 km/h", label: "Top Speed" },
  { title: "0-100 km/h\n(3.1 seconds)", label: "Acceleration" },
];

const specSections = [
  {
    title: "Powertrain & Engine",
    lines: [
      "Naturally aspirated V10 with torque vectoring.",
      "7-speed dual-clutch transmission.",
      "Rear-wheel drive performance tuning.",
    ],
  },
  {
    title: "Performance",
    lines: ["0–100 km/h in 3.1 seconds.", "Top speed 325 km/h."],
  },
  {
    title: "Dimensions & Weight",
    lines: [
      "Lightweight aluminum and carbon-fiber architecture.",
      "Low-slung, wide stance for stability.",
    ],
  },
  {
    title: "Wheels, Tires & Brakes",
    lines: [
      "Forged performance wheels.",
      "High-grip tires with carbon-ceramic brakes.",
    ],
  },
  {
    title: "Fuel Consumption & Emissions (WLTP)",
    lines: [
      "Balanced efficiency with supercar performance.",
      "WLTP figures available on request.",
    ],
  },
  {
    title: "Driving Dynamics & Technology",
    lines: [
      "Active aerodynamics and adaptive damping.",
      "Advanced traction and stability controls.",
    ],
  },
  {
    title: "Design & Comfort",
    lines: [
      "Bespoke Italian interior craftsmanship.",
      "Convertible roof with open-air touring.",
    ],
  },
];

const whatsappNumber = "+96170335113";
const whatsappMessage =
  "Hi, I'm interested in Lamborghini EVO Spyder. Please share availability and pricing.";

export function CarDetails() {
  const router = useRouter();
  const homeHref = "/";
  const [index, setIndex] = useState(0);
  const [isDockOpen, setIsDockOpen] = useState(true);

  const navigateTo = (href: string) => {
    router.push(href);
  };

  const whatsappUrl = useMemo(() => {
    const normalized = whatsappNumber.replace(/[^\d+]/g, "");
    return `https://wa.me/${normalized}?text=${encodeURIComponent(whatsappMessage)}`;
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0a0f10]">
      <section className="relative min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black via-[#0a0f10] to-[#111314]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute -left-10 top-24 h-72 w-72 rounded-full bg-[#b3242d]/30 blur-[140px]" />
        <div className="pointer-events-none absolute left-[38%] top-44 h-64 w-64 rounded-full bg-[#b3242d]/25 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-80 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.0)_55%)] opacity-40" />
        <div className="pointer-events-none absolute -right-8 bottom-0 h-56 w-72 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_2px,transparent_2px,transparent_12px)] opacity-[0.12]" />
        <div className="relative z-20 mx-auto w-full max-w-350 px-6 pt-5 sm:px-10 sm:pt-6 lg:px-0">
          <InternalPageHeader
            title="Lamborghini EVO Spyder"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={(id) => {
              if (id === "home") return navigateTo(homeHref);
              if (id === "blogs") return navigateTo("/blogs");
              if (id === "fleet") return navigateTo("/fleet");
              if (id === "mission") return navigateTo("/mission");
              if (id === "contact") return navigateTo("/contact");
              if (id === "faq") return navigateTo("/faq");
            }}
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>

        <div className="relative z-10 flex min-h-[70vh] flex-col justify-center transition-all duration-300">
          <div className="mx-auto flex w-full max-w-350 flex-col gap-12 px-16 pb-10 pt-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex w-full flex-1 flex-col items-start">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={carSlides[index]}
                  className="relative w-full max-w-140"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="pointer-events-none absolute -bottom-6 left-10 h-16 w-[80%] rounded-full bg-black/70 blur-[30px]" />
                  <Image
                    src={carSlides[index]}
                    alt="Lamborghini EVO Spyder"
                    width={900}
                    height={520}
                    priority
                    className="h-auto w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 max-w-xl space-y-3">
                <h1 className="type-section-title text-[2rem] text-white">
                  Lamborghini EVO Spyder
                </h1>
                <p className="type-body text-[13px] leading-5 text-white/70">
                  Experience pure Italian supercar excitement with the Lamborghini Huracan
                  EVO Spyder, a high-performance convertible available for rent. Built for
                  drivers who demand aggressive design, naturally aspirated V10 power, and
                  open-top driving thrills, the EVO Spyder delivers breathtaking
                  acceleration and precision handling.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 lg:hidden">
                {carSlides.map((_, dotIndex) => (
                  <button
                    key={`mobile-dot-${dotIndex}`}
                    type="button"
                    onClick={() => setIndex(dotIndex)}
                    className={`h-2.5 w-2.5 rounded-full ${
                      dotIndex === index ? "bg-[#b3242d]" : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative flex w-full items-start justify-between gap-8 lg:w-auto lg:justify-end lg:pt-8">
              <div className="hidden flex-col items-center gap-3 lg:flex">
                {carSlides.map((_, dotIndex) => (
                  <motion.button
                    key={`detail-dot-${dotIndex}`}
                    type="button"
                    onClick={() => setIndex(dotIndex)}
                    className="relative flex h-3 w-3 items-center justify-center"
                    animate={{ scale: dotIndex === index ? 1.2 : 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                  >
                    <span
                      className={`block h-2.5 w-2.5 rounded-full ${
                        dotIndex === index ? "bg-[#b3242d]" : "bg-white/50"
                      }`}
                    />
                    {dotIndex === index && (
                      <span className="absolute h-1.5 w-1.5 rounded-full bg-black" />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="w-full max-w-[292px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,18,18,0.82),rgba(12,12,12,0.72))] p-5 shadow-none backdrop-blur-sm lg:mt-4 lg:w-[292px]">
                <div className="text-center text-[24px] font-semibold tracking-[0.01em] text-[#c62a34]">
                  {"\u00D0"} 3,300.00
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {featureStats.map((item) => (
                    <div
                      key={item.title}
                      className="flex min-h-[78px] flex-col items-center justify-center rounded-[20px] border border-white/8 bg-white/[0.03] px-3 py-3 text-center"
                    >
                      <div
                        className={`whitespace-pre-line font-semibold leading-5 text-white/90 ${
                          item.label === "Transmission" ? "text-[14px]" : "text-[15px]"
                        }`}
                      >
                        {item.title}
                      </div>
                      {item.note ? (
                        <div className="mt-1.5 text-[8px] leading-3.5 text-white/72">
                          {item.note}
                        </div>
                      ) : null}
                      <div className="mt-1 text-[8px] uppercase tracking-[0.16em] text-white/50">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                <PrimaryButton
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 w-full"
                >
                  WhatsApp
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>

        <div className="social-icons-left-center">
          {socialIcons.map((item) => (
            <motion.a
              key={item.id}
              href={item.href}
              target={item.href !== "#" ? "_blank" : undefined}
              rel={item.href !== "#" ? "noreferrer" : undefined}
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
            </motion.a>
          ))}
        </div>
      </section>

      <section className="bg-white text-black">
        <div className="mx-auto w-full max-w-350 px-16 py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {specSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight text-black">
                  {section.title}
                </h2>
                <div className="space-y-2 text-sm leading-6 text-black/70">
                  {section.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
