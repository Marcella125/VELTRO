"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { assetPath } from "@/lib/asset-path";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import { PageFooterNote } from "@/views/components/PageFooterNote";

const missionHighlights = [
  { number: "01", label: "Premium Fleet" },
  { number: "02", label: "Exceptional Service" },
  { number: "03", label: "Trust & Reliability" },
  { number: "04", label: "Passion Driven" },
] as const;

export function MissionView() {
  const router = useRouter();
  const homeHref = "/";
  const [isDockOpen, setIsDockOpen] = useState(true);

  useEffect(() => {
    document.body.classList.add("mission-desktop-lock");

    return () => {
      document.body.classList.remove("mission-desktop-lock");
    };
  }, []);

  const navigateTo = (href: string) => {
    router.push(href);
  };

  const handleDockSelect = (id: string) => {
    if (id === "home") return navigateTo(homeHref);
    if (id === "fleet") return navigateTo("/fleet");
    if (id === "blogs") return navigateTo("/blogs");
    if (id === "mission") return;
    if (id === "contact") return navigateTo("/contact");
    if (id === "faq") return navigateTo("/faq");
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-black text-white lg:h-dvh lg:min-h-dvh">
      <div className="pointer-events-none fixed inset-0">
        <Image
          src={assetPath("/images/Mission bg.png")}
          alt="Veltro mission background"
          fill
          priority
          className="object-cover object-[74%_center] sm:object-[76%_center] lg:object-[72%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.84)_0%,rgba(0,0,0,0.72)_22%,rgba(0,0,0,0.32)_46%,rgba(0,0,0,0.03)_64%,rgba(0,0,0,0.28)_82%,rgba(0,0,0,0.54)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_0%,rgba(0,0,0,0.08)_54%,rgba(0,0,0,0.22)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-350 flex-col px-6 pb-10 pt-5 sm:px-10 sm:pt-6 sm:pb-12 lg:h-dvh lg:min-h-dvh lg:pb-6">
        <div className="relative z-30">
          <InternalPageHeader
            title="Mission"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>

        <section className="relative z-10 flex flex-1 flex-col justify-between pt-12 sm:pt-14 lg:pb-20 lg:pt-14">
          <div className="max-w-[18rem] sm:max-w-[21rem] lg:max-w-[22rem]">
            <h1 className="font-display text-[2rem] font-semibold uppercase leading-[0.98] tracking-[-0.03em] text-white sm:text-[2.8rem] lg:text-[3.1rem]">
              Driven by passion<span className="text-[var(--brand-red)]">.</span>
              <br />
              Defined by excellence<span className="text-[var(--brand-red)]">.</span>
            </h1>

            <div className="mt-6 h-px w-12 bg-[var(--brand-red)]" />

            <div className="font-body mt-7 max-w-[18rem] text-[0.9rem] leading-7 text-white/72 sm:max-w-[21rem] sm:text-[1rem] sm:leading-8">
              <p>
                We don&apos;t simply provide exceptional cars.
                <br />
                We create experiences built around them.
                <br />
                Every detail is shaped to feel effortless, elevated, and memorable.
              </p>
            </div>
          </div>

          <div className="grid max-w-[31rem] grid-cols-2 gap-x-5 gap-y-5 sm:max-w-[35rem] sm:grid-cols-4 sm:gap-x-6 lg:max-w-[33rem]">
            {missionHighlights.map((item, index) => (
              <div
                key={item.number}
                className={`relative pr-2 ${index < missionHighlights.length - 1 ? "sm:after:absolute sm:after:right-0 sm:after:top-0 sm:after:h-[4.2rem] sm:after:w-px sm:after:bg-white/16" : ""}`}
              >
                <p className="font-display text-[1rem] leading-none text-[var(--brand-red)] sm:text-[1.05rem]">
                  {item.number}
                </p>
                <p className="mt-3 font-body text-[0.62rem] uppercase leading-6 tracking-[0.14em] text-white/78 sm:text-[0.68rem]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <PageFooterNote />
    </main>
  );
}
