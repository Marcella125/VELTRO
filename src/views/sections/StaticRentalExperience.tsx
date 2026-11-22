"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type TouchEvent as ReactTouchEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  CaretDown as ChevronDown,
  CaretLeft,
  CaretRight,
  List as Menu,
  X,
} from "@phosphor-icons/react";
import { Armchair, CarFront, ChevronLeft, ChevronRight, Gem, Headset, Mail, MapPin, MapPinned, Phone, ShieldCheck } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import type { Car } from "@/models/car.model";

const navItems = [
  ["fleet", "Fleet"],
  ["experience", "Experience"],
  ["shop", "Shop"],
  ["faq", "FAQs"],
  ["contact", "Contact"],
] as const;

const faqs = [
  ["What do I need to book?", "A valid driving licence and identity document. Our concierge confirms any vehicle-specific requirements before payment."],
  ["Can the car be delivered?", "Yes. Delivery and collection can be arranged across Beirut and selected destinations in Lebanon."],
  ["Is insurance included?", "Every rental includes clear insurance terms. Your exact coverage and excess are shared before the booking is confirmed."],
  ["What is the minimum rental age?", "Age requirements vary by vehicle. Our concierge will confirm the minimum age and driving-experience requirements for your selected car."],
  ["Is a security deposit required?", "Yes. The deposit amount depends on the vehicle and rental duration, and all payment details are confirmed clearly before booking."],
  ["Can I drive outside Beirut?", "Yes. Many vehicles can be driven across Lebanon, subject to the agreed rental terms and any destination-specific restrictions."],
] as const;

const fleetShowcaseOrder = [
  { slug: "lamborghini-evo-spyder", image: "/images/lambo side.png" },
  { slug: "porsche-911-carrera-4s", image: "/images/porshe side.png" },
  { slug: "ferrari-296-gtb", image: "/images/ferrari side.png" },
  { slug: "bmw-m8-competition", image: "/images/bmw side.png" },
] as const;

function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Kicker({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p data-scroll-text className={`flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.34em] ${dark ? "text-black/58" : "text-white/65"}`}>
      <span className="h-3.5 w-0.5 -skew-x-12 bg-[#d7ff21]" />
      {children}
    </p>
  );
}

function DisplayTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-hero text-[clamp(1.8rem,4.2vw,3.8rem)] font-bold uppercase italic leading-[0.79] tracking-[-0.07em] text-[#f2eee7] ${className}`}>
      {children}
    </h2>
  );
}

export function StaticRentalExperience({ cars }: { cars: Car[] }) {
  const showcaseFleet = fleetShowcaseOrder
    .map(({ slug, image }) => {
      const car = cars.find((candidate) => candidate.slug === slug);
      return car ? { ...car, showcaseImage: assetPath(image) } : null;
    })
    .filter((car): car is Car & { showcaseImage: string } => car !== null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeFleetIndex, setActiveFleetIndex] = useState(0);
  const fleetSectionRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const fleetIntroRef = useRef<HTMLDivElement>(null);
  const fleetStageRef = useRef<HTMLDivElement>(null);
  const activeFleetImageRef = useRef<HTMLDivElement>(null);
  const activeFleetInfoRef = useRef<HTMLDivElement>(null);
  const fleetTouchStartRef = useRef<{ x: number; y: number } | null>(null);

  const activeFleet = showcaseFleet[activeFleetIndex % Math.max(showcaseFleet.length, 1)];
  const previousFleet = showcaseFleet[(activeFleetIndex - 1 + showcaseFleet.length) % Math.max(showcaseFleet.length, 1)];
  const nextFleet = showcaseFleet[(activeFleetIndex + 1) % Math.max(showcaseFleet.length, 1)];

  useEffect(() => {
    const updateHeader = () => {
      const scrollTop = Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop);
      setHeaderScrolled(scrollTop > 0);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    document.addEventListener("scroll", updateHeader, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", updateHeader);
      document.removeEventListener("scroll", updateHeader, { capture: true });
    };
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const mobile = window.matchMedia("(max-width: 639px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mobile.matches || reduceMotion.matches) return;

    const revealItems = Array.from(page.querySelectorAll<HTMLElement>("[data-mobile-reveal]"));
    page.classList.add("mobile-reveal-ready");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.mobileVisible = "true";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });

    revealItems.forEach((item, index) => {
      item.style.setProperty("--mobile-reveal-delay", `${(index % 4) * 55}ms`);
      observer.observe(item);
    });

    return () => {
      observer.disconnect();
      page.classList.remove("mobile-reveal-ready");
    };
  }, []);

  useLayoutEffect(() => {
    const section = fleetSectionRef.current;
    const intro = fleetIntroRef.current;
    const stage = fleetStageRef.current;

    if (!section || !intro || !stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const context = gsap.context(() => {
      if (reduceMotion.matches) return;
      gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 76%",
          toggleActions: "play none none reverse",
        },
      })
        .from(intro.children, { autoAlpha: 0, y: 28, duration: 0.9, stagger: 0.09 })
        .from(stage, { autoAlpha: 0, y: 52, scale: 0.98, duration: 1.2 }, "-=0.55");
    }, section);

    return () => context.revert();
  }, [showcaseFleet.length]);

  useLayoutEffect(() => {
    const image = activeFleetImageRef.current;
    const info = activeFleetInfoRef.current;
    if (!image || !info || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(image, { autoAlpha: 0, x: 26, scale: 0.94 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.85, ease: "power4.out" });
      gsap.fromTo(info.children, { autoAlpha: 0, y: 13 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.055, ease: "power3.out" });
    }, fleetSectionRef);

    return () => context.revert();
  }, [activeFleetIndex]);

  const navigate = (id: string) => {
    setMenuOpen(false);
    jumpTo(id);
  };

  const handleFleetTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    fleetTouchStartRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const handleFleetTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const start = fleetTouchStartRef.current;
    const touch = event.changedTouches[0];
    fleetTouchStartRef.current = null;
    if (!start || !touch || !window.matchMedia("(max-width: 639px)").matches) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    setActiveFleetIndex((index) => deltaX < 0
      ? (index + 1) % showcaseFleet.length
      : (index - 1 + showcaseFleet.length) % showcaseFleet.length);
  };

  return (
    <main ref={pageRef} className="min-h-screen overflow-x-hidden bg-[#070809] text-[#f2eee7] selection:bg-[#d7ff21] selection:text-black">
      <header
        style={{ backgroundColor: headerScrolled ? "#090A0B" : "transparent" }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${headerScrolled ? "shadow-[0_12px_35px_rgba(0,0,0,.22)] backdrop-blur-xl" : ""}`}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-[92rem] items-center px-4 sm:h-[4.75rem] sm:px-8 lg:px-12">
          <button type="button" onClick={() => navigate("home")} aria-label="Go to Veltro home" className="relative shrink-0 lg:left-[-1cm]">
            <Image src={assetPath("/icons/veltro_logo.svg")} alt="Veltro" width={680} height={136} priority unoptimized className="h-10 w-auto sm:h-14" />
          </button>

          <nav className="ml-auto hidden items-center gap-9 lg:flex lg:translate-x-[1cm]">
            {navItems.map(([id, label]) => (
              <button key={id} type="button" onClick={() => navigate(id)} className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white/66 transition hover:text-[#d7ff21]">
                {label}
              </button>
            ))}
          </nav>

          <button type="button" onClick={() => navigate("contact")} className="ml-10 hidden h-10 items-center gap-3 rounded-lg bg-[#d7ff21] px-6 text-[0.65rem] font-extrabold uppercase tracking-[0.13em] text-black transition hover:bg-white lg:flex lg:translate-x-[1cm]">
            Inquire <ArrowRight size={15} />
          </button>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" className="ml-auto grid size-11 place-items-center lg:hidden">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen ? (
          <nav className="border-t border-white/10 bg-[#090A0B] px-5 py-3 lg:hidden">
            {navItems.map(([id, label]) => (
              <button key={id} type="button" onClick={() => navigate(id)} className="flex w-full items-center justify-between border-b border-white/8 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                {label}<ArrowRight size={15} className="text-[#d7ff21]" />
              </button>
            ))}
          </nav>
        ) : null}
      </header>

      <section id="home" className="relative flex min-h-[100svh] scroll-mt-20 items-center overflow-hidden pt-20 sm:items-end">
        <Image src={assetPath("/images/home-hero-mobile-v2.png")} alt="Veltro luxury car rental in Beirut" fill priority sizes="100vw" quality={92} className="object-cover object-center sm:hidden" />
        <Image src={assetPath("/images/Home bg.png")} alt="Veltro luxury car rental banner" fill priority sizes="100vw" quality={92} className="hidden object-cover object-center sm:block" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,4,5,.96)_0%,rgba(3,4,5,.77)_30%,rgba(3,4,5,.08)_68%,rgba(3,4,5,.12)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25)_0%,transparent_44%,rgba(2,3,4,.88)_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[92rem] -translate-y-16 px-5 sm:translate-y-0 sm:px-8 sm:pb-14 sm:pt-28 lg:px-12 lg:pb-16 lg:pt-32">
          <div className="mx-auto max-w-[47rem] text-center">
            <p className="mb-6 flex items-center justify-center gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-white/76 sm:text-[0.72rem]">
              Luxury car rental
            </p>
            <h1 className="font-hero text-[clamp(1.65rem,calc(4.35vw-4px),3.65rem)] font-bold uppercase italic leading-[0.76] tracking-[-0.08em] text-[#f2eee7] drop-shadow-2xl">
              Drive the<br /><span className="text-[#d7ff21]">extraordinary.</span>
            </h1>
            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 min-[430px]:flex-row min-[430px]:items-center sm:gap-4">
              <button type="button" onClick={() => navigate("fleet")} className="group flex h-12 w-full items-center justify-center gap-4 rounded-lg bg-[#d7ff21] px-7 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-black transition hover:bg-white min-[430px]:w-auto min-[430px]:min-w-52 sm:text-[0.7rem] sm:tracking-[0.15em]">
                Explore fleet <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </button>
              <button type="button" onClick={() => navigate("experience")} className="flex h-12 items-center justify-center gap-3 px-3 text-[0.64rem] font-bold uppercase tracking-[0.13em] text-white/84 transition hover:text-[#d7ff21] min-[430px]:justify-start sm:text-[0.68rem]">
                <span className="grid size-10 place-items-center rounded-full border border-white/45"><ArrowDown size={16} /></span> The experience
              </button>
            </div>
          </div>

        </div>

      </section>

      <section ref={fleetSectionRef} id="fleet" className="font-body relative h-[calc(100svh-4.25rem)] min-h-[35rem] scroll-mt-[4.25rem] overflow-hidden bg-[#070809] py-7 sm:h-[calc(100svh-4.75rem)] sm:min-h-[37rem] sm:scroll-mt-20 sm:py-8">
        <Image src={assetPath("/images/showroom bg mobile.png")} alt="" fill sizes="100vw" quality={92} aria-hidden="true" className="object-cover object-center sm:hidden" />
        <div className="relative z-10 mx-auto flex h-full min-h-0 max-w-[100rem] flex-col px-5 sm:px-8 lg:px-12">
          <div ref={fleetIntroRef} className="text-center">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.46em] text-white/72 sm:text-[0.7rem]">Our fleet</p>
            <h2 className="font-fleet-heading mt-3 text-[clamp(2rem,5vw,4.8rem)] uppercase leading-[0.82] tracking-[-0.035em] text-[#f2eee7] sm:mt-4">
              Iconic <span className="text-[#d7ff21]">machines.</span>
            </h2>
            <p className="mt-3 text-[0.52rem] font-semibold uppercase tracking-[0.4em] text-white/55 sm:text-[0.6rem]">A curated selection of exceptional cars.</p>
          </div>

          {activeFleet ? (
            <div
              ref={fleetStageRef}
              className="relative mt-1 flex min-h-0 translate-y-[calc(-5rem+1cm)] flex-1 touch-pan-y flex-col sm:translate-y-0"
              onTouchStart={handleFleetTouchStart}
              onTouchEnd={handleFleetTouchEnd}
            >
              <div className="relative min-h-[12rem] flex-1 sm:min-h-[14rem]">
                {previousFleet ? (
                  <div className="pointer-events-none absolute left-[0.2cm] bottom-[calc(4%+0.5cm)] hidden h-[34%] w-[22%] opacity-30 blur-[.2px] md:block">
                    <Image src={previousFleet.showcaseImage} alt="" fill sizes="40vw" className="object-contain object-right-bottom" />
                  </div>
                ) : null}
                {nextFleet ? (
                  <div className="pointer-events-none absolute right-[0.2cm] bottom-[calc(4%+0.5cm)] hidden h-[34%] w-[22%] opacity-30 blur-[.2px] md:block">
                    <Image src={nextFleet.showcaseImage} alt="" fill sizes="40vw" className="object-contain object-left-bottom" />
                  </div>
                ) : null}

                <div ref={activeFleetImageRef} key={activeFleet.id} className="absolute inset-x-[5%] bottom-[calc(20%-1cm)] top-[2%] sm:inset-x-[20%] sm:bottom-[4%] sm:top-[14%] lg:inset-x-[24%]">
                  <Image src={activeFleet.showcaseImage} alt={`${activeFleet.brand} ${activeFleet.name}`} fill priority={activeFleetIndex === 0} sizes="(max-width: 767px) 96vw, 70vw" className="object-contain object-bottom drop-shadow-[0_30px_32px_rgba(0,0,0,.72)]" />
                </div>

                <button type="button" onClick={() => setActiveFleetIndex((index) => (index - 1 + showcaseFleet.length) % showcaseFleet.length)} aria-label="Previous vehicle" className="absolute left-0 top-[26%] z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-[#d7ff21]/65 text-white transition hover:border-[#d7ff21] hover:bg-[#d7ff21] hover:text-black sm:left-[8%] sm:grid sm:size-12">
                  <CaretLeft size={20} weight="bold" />
                </button>
                <button type="button" onClick={() => setActiveFleetIndex((index) => (index + 1) % showcaseFleet.length)} aria-label="Next vehicle" className="absolute right-0 top-[26%] z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-[#d7ff21]/65 text-white transition hover:border-[#d7ff21] hover:bg-[#d7ff21] hover:text-black sm:right-[8%] sm:grid sm:size-12">
                  <CaretRight size={20} weight="bold" />
                </button>

                <div className="pointer-events-none absolute inset-x-0 bottom-[3%] flex translate-y-[1cm] items-center justify-center gap-2 text-[0.5rem] font-bold uppercase tracking-[0.28em] text-white/55 sm:hidden">
                  Swipe <ArrowRight size={13} className="text-[#d7ff21]" />
                </div>
              </div>

              <div ref={activeFleetInfoRef} className="relative z-10 -mt-1 translate-y-[1cm] shrink-0 text-center sm:-mt-2 sm:translate-y-0">
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.38em] text-white/72 sm:text-[0.66rem]">{activeFleet.brand}</p>
                <h3 className="font-body mt-2 text-[clamp(1.55rem,3.4vw,3.3rem)] font-extrabold uppercase italic leading-none tracking-[-0.045em] text-[#f2eee7]">
                  {activeFleet.name.replace(new RegExp(`^${activeFleet.brand}\\s*`, "i"), "")}
                </h3>
                <Link href={`/cars/${activeFleet.slug}?from=home`} className="group mx-auto mt-4 flex h-11 w-fit min-w-52 items-center justify-center gap-4 rounded-lg bg-[#d7ff21] px-7 text-[0.64rem] font-extrabold uppercase tracking-[0.13em] text-black transition hover:bg-white sm:text-[0.68rem] sm:tracking-[0.15em]">
                  View details <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section id="experience" className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#070809] py-10 scroll-mt-[4.25rem] sm:scroll-mt-20 sm:py-14 lg:py-10">
        <div className="relative z-10 mx-auto grid w-full max-w-[92rem] gap-6 px-4 sm:gap-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-12">
          <div data-mobile-reveal>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.46em] text-white/72 sm:text-[0.7rem]">Discover</p>
            <h2 className="font-fleet-heading mt-3 max-w-[32rem] text-[clamp(2rem,5vw,4.8rem)] uppercase leading-[0.82] tracking-[-0.035em] text-[#f2eee7] sm:mt-4">
              The Veltro<br /><span className="text-[#d7ff21]">experience.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-5">
              {[
                [CarFront, "Premium fleet", "A curated selection of high-performance and luxury vehicles."],
                [MapPinned, "Drive Beirut", "Experience Lebanon's most iconic roads and scenic destinations."],
                [Headset, "Dedicated concierge", "A simple, personalized booking experience from start to finish."],
                [Gem, "A complete experience", "More than a rental, a premium journey built around performance, service, and style."],
              ].map(([Icon, title, copy], index) => {
                const CardIcon = Icon as typeof CarFront;
                return (
                  <article data-mobile-reveal key={title as string} className="flex min-h-[11.5rem] flex-col items-center justify-center rounded-[1.35rem] border border-white/90 bg-black px-2.5 py-4 text-center transition duration-500 hover:-translate-y-1 sm:min-h-[14rem] sm:rounded-[2rem] sm:border-2 sm:px-5 sm:py-6">
                    {index === 0 ? (
                      <span
                        aria-hidden="true"
                        className="h-6 w-12 bg-[#d7ff21] sm:h-8 sm:w-16"
                        style={{
                          WebkitMaskImage: `url("${assetPath("/icons/fleet.svg")}")`,
                          maskImage: `url("${assetPath("/icons/fleet.svg")}")`,
                          WebkitMaskPosition: "center",
                          maskPosition: "center",
                          WebkitMaskRepeat: "no-repeat",
                          maskRepeat: "no-repeat",
                          WebkitMaskSize: "contain",
                          maskSize: "contain",
                        }}
                      />
                    ) : (
                      <CardIcon size={48} strokeWidth={1.35} className="size-9 text-[#d7ff21] sm:size-12" />
                    )}
                    <h3 className="font-body mt-3 text-[0.82rem] font-extrabold uppercase italic leading-[0.95] tracking-[-0.025em] text-white sm:mt-5 sm:text-[1.2rem] lg:text-[1.35rem]">{title as string}</h3>
                    <p className="mt-2 max-w-[13.5rem] text-[0.58rem] leading-[1.35] text-white/72 sm:mt-4 sm:text-[0.7rem] lg:text-[0.76rem]">{copy as string}</p>
                  </article>
                );
              })}
          </div>
        </div>
      </section>

      <section id="shop" aria-label="Veltro shop and accessories" className="flex scroll-mt-[4.25rem] flex-col overflow-hidden border-t border-white/15 bg-black sm:h-[calc(100svh-4.75rem)] sm:scroll-mt-[4.75rem]">
        <div data-mobile-reveal className="w-full shrink-0 px-5 py-9 text-left sm:hidden">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.46em] text-white/55 sm:text-[0.65rem]">The shop</p>
          <h2 className="font-fleet-heading mt-3 text-[clamp(2rem,5vw,4.4rem)] uppercase leading-[0.82] tracking-[-0.035em] text-white">
            Veltro <span className="text-[#d7ff21]">essentials.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:min-h-0 sm:flex-1 sm:grid-cols-2 sm:grid-rows-2">
        <article data-mobile-reveal data-image-slot="veltro-gifts" className="group relative flex h-[55svh] min-h-[22rem] items-end justify-center overflow-hidden border-b border-white/15 bg-[radial-gradient(circle_at_25%_20%,rgba(215,255,33,.14),transparent_30%),linear-gradient(145deg,#111_0%,#050505_58%,#0a0b08_100%)] p-5 text-center sm:h-auto sm:min-h-0 sm:border-r sm:p-6 md:p-8">
          <Image src={assetPath("/images/veltro gifts.png")} alt="Veltro branded gifts collection" fill sizes="(max-width: 767px) 100vw, 50vw" quality={92} className="object-cover object-center transition duration-700 group-hover:scale-[1.025]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(0,0,0,.82)_100%)]" />
          <div className="relative z-10 mb-2 sm:-mb-5">
            <h2 className="font-body text-[clamp(0.9rem,2.35vw,2rem)] font-extrabold uppercase italic leading-none tracking-[-0.04em] text-white lg:text-[1.35rem] xl:text-[1.5rem]">Veltro gifts</h2>
            <a href="#contact" className="mt-2 inline-flex items-center gap-1.5 text-[0.62rem] font-medium text-white/78 transition hover:text-[#d7ff21] sm:mt-3 sm:gap-2 sm:text-xs">Shop now <ArrowRight size={13} /></a>
          </div>
        </article>

        {[
          ["interior-accessories", Armchair, "Interior accessories"],
          ["exterior-accessories", ShieldCheck, "Exterior accessories"],
        ].map(([slot, Icon, title], index) => {
          const TileIcon = Icon as typeof Armchair;
          return (
            <article data-mobile-reveal key={slot as string} data-image-slot={slot as string} className={`group relative flex h-[55svh] min-h-[22rem] items-end justify-center overflow-hidden border-b border-white/15 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,.08),transparent_34%),linear-gradient(145deg,#111,#030303)] p-5 text-center sm:h-auto sm:min-h-0 md:p-7 ${index === 1 ? "sm:border-r" : ""}`}>
              {index < 2 ? (
                <>
                  <Image
                    src={assetPath(index === 0 ? "/images/veltro interior.png" : "/images/veltro exterior.png")}
                    alt={index === 0 ? "Veltro premium interior accessories" : "Veltro premium exterior accessories"}
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    quality={92}
                    className="object-cover object-center transition duration-700 group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(0,0,0,.82)_100%)]" />
                </>
              ) : (
                <TileIcon size={170} strokeWidth={0.55} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] text-white/[0.065] transition duration-700 group-hover:scale-105 group-hover:text-[#d7ff21]/10" />
              )}
              <div className="relative z-10 mb-2 sm:-mb-3">
                <h3 className="font-body text-[clamp(0.78rem,2.3vw,2rem)] font-extrabold uppercase italic leading-none tracking-[-0.035em] text-white lg:text-[1.35rem] xl:text-[1.5rem]">{title as string}</h3>
                <a href="#contact" className="mt-2 inline-flex items-center gap-1.5 text-[0.6rem] font-medium text-white/76 transition hover:text-[#d7ff21] sm:mt-3 sm:gap-2 sm:text-sm">Shop now <ArrowRight size={13} /></a>
              </div>
            </article>
          );
        })}

        <article data-mobile-reveal data-image-slot="shop-collection" className="relative flex h-[55svh] min-h-[22rem] flex-col items-center justify-center overflow-hidden border-b border-white/15 bg-[#f2f3f3] px-2 py-5 text-center text-black sm:h-auto sm:min-h-0 sm:px-5 sm:py-4">
          <button type="button" aria-label="Previous products" className="absolute left-0 top-[35%] grid size-8 place-items-center transition hover:text-[#93b000] sm:left-4 sm:size-10"><ChevronLeft size={24} strokeWidth={1.4} /></button>
          <button type="button" aria-label="Next products" className="absolute right-0 top-[35%] grid size-8 place-items-center transition hover:text-[#93b000] sm:right-4 sm:size-10"><ChevronRight size={24} strokeWidth={1.4} /></button>
          <div className="flex w-[82%] items-stretch justify-center gap-2 sm:w-[78%] sm:gap-2.5 lg:gap-4">
            {[
              ["cap.png", "Veltro cap"],
              ["hoodie.png", "Veltro hoodie"],
              ["sweatshirt.png", "Veltro sweatshirt"],
              ["socks.png", "Veltro socks"],
              ["bonne.png", "Veltro beanie"],
            ].map(([file, alt], index) => (
              <div key={file} className={`relative h-24 flex-1 overflow-hidden rounded-lg bg-white shadow-[0_8px_28px_rgba(0,0,0,.08)] sm:h-24 sm:rounded-xl lg:h-28 xl:h-32 ${index === 0 || index === 4 ? "hidden sm:block" : ""}`}>
                <Image src={`${assetPath(`/images/clothes shop/${file}`)}?v=2`} alt={alt} fill sizes="(max-width: 767px) 25vw, 10vw" className="object-contain p-1" />
              </div>
            ))}
          </div>
          <h2 className="mt-5 font-body text-[clamp(1.15rem,2.8vw,2.5rem)] font-extrabold uppercase italic leading-none tracking-[-0.04em] sm:mt-2 lg:text-[1.35rem] xl:text-[1.5rem]">Shop the collection</h2>
          <a href="#contact" className="mt-2 inline-flex items-center gap-1.5 text-[0.68rem] font-medium transition hover:text-[#7d9400] sm:gap-2 sm:text-sm">Explore all <ArrowRight size={13} /></a>
        </article>
        </div>
      </section>

      <section id="faq" className="relative flex min-h-[100svh] scroll-mt-[4.25rem] items-center overflow-hidden bg-[#0b0c0d] py-10 sm:scroll-mt-[4.75rem] sm:py-20 lg:py-28">
        <div className="relative z-10 mx-auto grid w-full max-w-[92rem] gap-6 px-5 sm:gap-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div data-mobile-reveal><p data-scroll-text className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-white/65">Good to know</p><DisplayTitle className="mt-3 sm:mt-6">Questions,<br />answered.</DisplayTitle></div>
          <div data-mobile-reveal className="border-t border-white/14">
            {faqs.map(([question, answer], index) => {
              const open = activeFaq === index;
              return <article key={question} className="border-b border-white/14"><button type="button" onClick={() => setActiveFaq(open ? -1 : index)} className="flex w-full items-center gap-4 py-4 text-left sm:gap-5 sm:py-6"><span className="font-hero text-base font-bold italic text-[#d7ff21] sm:text-lg">0{index + 1}</span><span className="flex-1 text-xs font-bold uppercase tracking-[0.07em] sm:text-sm sm:tracking-[0.08em]">{question}</span><ChevronDown size={18} className={`transition ${open ? "rotate-180 text-[#d7ff21]" : "text-white/40"}`} /></button>{open ? <p className="max-w-2xl pb-4 pl-9 text-xs leading-5 text-white/52 sm:pb-6 sm:pl-12 sm:text-sm sm:leading-6">{answer}</p> : null}</article>;
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="relative flex min-h-[calc(100svh-4.75rem)] scroll-mt-[4.75rem] items-center overflow-hidden border-t border-white/10 bg-black py-14 sm:py-16">
        <Image src={assetPath("/images/faq bg.png")} alt="" fill sizes="100vw" quality={92} aria-hidden="true" className="object-cover object-center" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/55" />
        <div data-mobile-reveal className="relative z-10 mx-auto w-full max-w-[92rem] px-5 text-center sm:px-8 lg:px-12">
          <p data-scroll-text className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-white/65">Start your journey</p>
          <DisplayTitle className="mx-auto mt-5 max-w-4xl !text-[clamp(2.35rem,3.8vw,3.7rem)] !leading-[0.84] sm:mt-6">Your next drive<br /><span className="text-[#d7ff21]">starts here.</span></DisplayTitle>
          <p className="mx-auto mt-5 max-w-[32rem] text-[0.78rem] leading-6 text-white/55 sm:mt-6 sm:text-sm">Tell us where you want to go. Our concierge will match the right car to the moment.</p>
          <a href="https://wa.me/96170335467" className="mx-auto mt-7 flex h-13 w-fit min-w-60 items-center justify-center gap-4 rounded-lg bg-[#d7ff21] px-8 text-[0.66rem] font-extrabold uppercase tracking-[0.15em] text-black shadow-[0_12px_40px_rgba(0,0,0,.28)] transition hover:-translate-y-0.5 hover:bg-white sm:min-w-64">Talk to concierge <ArrowRight size={16} /></a>
        </div>
      </section>

      <footer className="relative overflow-hidden border-t border-white/10 bg-[#050506]">
        <Image src={assetPath("/images/footer bg.png")} alt="" fill sizes="100vw" quality={92} aria-hidden="true" className="object-cover object-bottom" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-[92rem] px-5 pb-4 pt-8 sm:px-8 sm:pb-6 sm:pt-9 lg:px-12 lg:pt-10">
          <div data-mobile-reveal className="grid gap-7 border-b border-white/10 pb-7 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.7fr_1fr] lg:gap-12 lg:pb-9">
            <div>
              <Image src={assetPath("/icons/veltro_logo.svg")} alt="Veltro" width={680} height={136} unoptimized className="h-8 w-auto sm:h-10" />
              <p className="mt-3 max-w-sm text-[0.68rem] leading-5 text-white/48 sm:text-[0.72rem]">Beirut&apos;s premium luxury car rental experience. Iconic machines, personal service, and every detail handled.</p>
            </div>

            <div>
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-white/38">Explore</p>
              <nav className="mt-4 flex flex-col items-start gap-2.5">
                {navItems.map(([id, label]) => (
                  <button key={id} type="button" onClick={() => navigate(id)} className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/66 transition hover:text-[#d7ff21]">{label}</button>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-white/38">Contact</p>
              <div className="mt-4 space-y-3 text-[0.7rem] text-white/62">
                <p className="flex items-center gap-3"><MapPin size={16} strokeWidth={1.5} className="shrink-0 text-[#d7ff21]" /> Beirut, Lebanon</p>
                <a href="tel:+96170335467" className="flex items-center gap-3 transition hover:text-white"><Phone size={16} strokeWidth={1.5} className="shrink-0 text-[#d7ff21]" /> +961 70 335 467</a>
                <a href="mailto:info@veltro.com" className="flex items-center gap-3 transition hover:text-white"><Mail size={16} strokeWidth={1.5} className="shrink-0 text-[#d7ff21]" /> info@veltro.com</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4 text-[0.54rem] uppercase tracking-[0.14em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Veltro. All rights reserved.</p>
            <p>Luxury car rental · Beirut, Lebanon</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
