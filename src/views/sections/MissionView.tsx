"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { usePageTransition } from "@/hooks/use-page-transition";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import { useState } from "react";

const missionCopy = {
  mission:
    "Platinum elevates every drive through precision, performance, and effortless luxury. We deliver refined experiences that go beyond traditional car rentals.",
  vision:
    "To set the standard for premium sports car rentals where transparency, confidence, and world-class service define every journey.",
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MissionView() {
  const router = useRouter();
  const homeHref = "/";
  const [isDockOpen, setIsDockOpen] = useState(false);
  const { overlay, runTransition } = usePageTransition();

  const navigateTo = (href: string) => {
    setIsDockOpen(false);
    runTransition(() => router.push(href));
  };

  const handleDockSelect = (id: string) => {
    if (id === "home") return navigateTo(homeHref);
    if (id === "fleet") return navigateTo("/fleet");
    if (id === "blogs") return navigateTo("/blogs");
    if (id === "mission") return setIsDockOpen(false);
    if (id === "contact") return navigateTo("/contact");
    if (id === "faq") return navigateTo("/faq");
  };

  return (
    <motion.main
      className="relative min-h-dvh overflow-hidden text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>{overlay}</AnimatePresence>
      <div className="pointer-events-none fixed inset-0">
        <Image
          src={assetPath("/images/bgcar.png")}
          alt="Platinum mission background"
          fill
          priority
          className="object-cover object-center"
        />
        <Image
          src={assetPath("/pattern1.svg")}
          alt=""
          width={800}
          height={600}
          className="absolute left-1/2 top-[10%] w-[140%] -translate-x-1/2 opacity-60 sm:top-[6%] sm:w-[120%] sm:opacity-70"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_60%_30%,rgba(193,18,31,0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_70%,rgba(0,0,0,0.8),transparent_60%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.75)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-350 flex-col px-6 pb-12 pt-5 sm:px-10 sm:pb-16">
        <div className="relative z-30">
          <InternalPageHeader
            title="Mission"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>

        <section className="mt-2 flex flex-1 items-start pt-6 sm:mt-3 sm:pt-8 lg:mt-4 lg:pt-10">
          <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-5">
            <motion.article
              className="group flex h-full"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="relative flex h-full min-h-[280px] w-full flex-col justify-between overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(8,8,8,0.96)_0%,rgba(20,9,11,0.94)_100%)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition duration-300 group-hover:border-white/20 group-hover:shadow-[0_24px_70px_rgba(177,18,38,0.16)] sm:min-h-[320px] sm:p-6 lg:min-h-[360px]"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(177,18,38,0.18),transparent_52%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(177,18,38,0.5),transparent)] opacity-70" />

                <div className="relative flex h-full flex-col">
                  <span className="type-hero-title text-[clamp(2.3rem,5vw,3.8rem)] leading-none font-semibold tracking-[-0.05em] text-white/28">
                    01
                  </span>

                  <div className="mt-5 max-w-[34rem] space-y-4">
                    <h1 className="type-card-title text-[1.35rem] leading-[1.08] text-white sm:text-[1.7rem]">
                      Mission
                    </h1>
                    <p className="type-body text-[0.92rem] leading-7 text-white/72 sm:text-[0.98rem]">
                      {missionCopy.mission}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>

            <motion.article
              className="group flex h-full"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: "easeOut", delay: 0.05 }}
            >
              <div className="relative flex h-full min-h-[240px] w-full flex-col justify-between overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(7,7,7,0.98)_0%,rgba(20,9,11,0.96)_100%)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition duration-300 group-hover:border-white/20 group-hover:shadow-[0_24px_70px_rgba(177,18,38,0.14)] sm:min-h-[260px] sm:p-6 lg:min-h-[360px]"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(177,18,38,0.16),transparent_52%)] opacity-60 transition duration-300 group-hover:opacity-90" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(177,18,38,0.42),transparent)] opacity-70" />

                <div className="relative flex h-full flex-col">
                  <span className="type-hero-title text-[clamp(2.3rem,5vw,3.8rem)] leading-none font-semibold tracking-[-0.05em] text-white/24">
                    02
                  </span>

                  <div className="mt-5 max-w-[28rem] space-y-4">
                    <h2 className="type-card-title text-[1.28rem] leading-[1.08] text-white sm:text-[1.58rem]">
                      Vision
                    </h2>
                    <p className="type-body text-[0.9rem] leading-7 text-white/68 sm:text-[0.96rem]">
                      {missionCopy.vision}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </section>
      </div>
    </motion.main>
  );
}
