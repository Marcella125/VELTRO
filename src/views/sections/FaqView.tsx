"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { usePageTransition } from "@/hooks/use-page-transition";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";

const faqs = [
  {
    q: "How can I book a car with Platinum?",
    a: "Booking is simple via WhatsApp or a phone call. Share your preferred car and rental dates, and we will confirm availability.",
  },
  {
    q: "Can I modify or cancel my booking?",
    a: "Yes. Contact us as early as possible and we will assist based on availability and our cancellation policy.",
  },
  {
    q: "What documents are required to rent a car?",
    a: "A valid driving license plus passport, Emirates ID, or equivalent identity documentation may be required for verification before handover.",
  },
  {
    q: "What type of driving license do I need?",
    a: "UAE residents need a valid UAE license. Visitors can use an international license or approved home-country license where applicable.",
  },
  {
    q: "What is included in the rental price?",
    a: "Standard insurance, a set mileage allowance, and basic support are included. Specific inclusions vary by vehicle.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
  },
};

export function FaqView() {
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
    if (id === "mission") return navigateTo("/mission");
    if (id === "contact") return navigateTo("/contact");
    if (id === "faq") return setIsDockOpen(false);
  };

  return (
    <motion.main
      className="relative h-dvh overflow-hidden text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>{overlay}</AnimatePresence>
      <div className="pointer-events-none fixed inset-0">
        <Image
          src={assetPath("/images/bgcar.png")}
          alt="Platinum FAQ background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/48" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_75%_at_50%_46%,rgba(0,0,0,0.7),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_12%_56%,rgba(177,18,38,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_88%_36%,rgba(177,18,38,0.16),transparent_58%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.78)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/65 via-black/22 to-transparent" />
      </div>

      <div className="relative mx-auto flex h-dvh w-full max-w-350 flex-col overflow-hidden px-6 pb-10 pt-4 sm:px-10">
        <div className="sticky top-0 z-40 -mx-6 px-6 pb-3 pt-2 sm:-mx-10 sm:px-10">
          <InternalPageHeader
            title="FAQ"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>

        <section className="mt-4 flex flex-1 items-center justify-center pb-20 sm:mt-6 lg:mt-4">
          <div className="w-full max-w-[980px]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4 xl:gap-4.5">
              {faqs.map((item, index) => (
                <motion.article
                  key={item.q}
                  className={`group relative overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(8,8,8,0.96)_0%,rgba(20,9,11,0.94)_100%)] p-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_70px_rgba(177,18,38,0.16)] sm:p-3 ${
                    index < 3
                      ? "lg:col-span-2"
                      : index === 3
                        ? "lg:col-start-2 lg:col-span-2"
                        : "lg:col-start-4 lg:col-span-2"
                  }`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, ease: "easeOut", delay: index * 0.03 }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(177,18,38,0.18),transparent_52%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(177,18,38,0.5),transparent)] opacity-70" />

                  <div className="relative flex h-full flex-col">
                    <span className="type-eyebrow text-white/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h2 className="type-card-title mt-1.5 text-[0.84rem] leading-[1.18] text-white/92 sm:text-[0.88rem]">
                      {item.q}
                    </h2>

                    <p className="type-body mt-1 text-[0.73rem] leading-[1.42] text-white/60">
                      {item.a}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>

          </div>
        </section>

        <p className="fixed bottom-[calc(4vh-0.5cm)] left-1/2 z-30 hidden -translate-x-1/2 text-center text-[11px] tracking-[0.03em] text-white/55 sm:block">
          Platinum all rights reserved &copy; 2026
        </p>
      </div>
    </motion.main>
  );
}
