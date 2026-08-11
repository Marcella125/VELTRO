"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { usePageTransition } from "@/hooks/use-page-transition";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import { PageFooterNote } from "@/views/components/PageFooterNote";

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

export function FaqView() {
  const router = useRouter();
  const homeHref = "/";
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
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
    <main className="relative min-h-dvh text-white">
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

      <div className="relative mx-auto flex min-h-dvh w-full max-w-350 flex-col px-6 pb-4 pt-4 sm:px-10 sm:pb-10">
        <div className="sticky top-0 z-40 -mx-6 px-6 pb-3 pt-2 sm:-mx-10 sm:px-10">
          <InternalPageHeader
            title="FAQ"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>

        <section className="mt-3 flex flex-1 items-start justify-center pt-2 pb-28 sm:mt-6 sm:pt-3 sm:pb-32 lg:mt-4 lg:pt-5 lg:pb-36">
          <div className="w-full max-w-[980px] sm:-translate-y-4 lg:-translate-y-8">
            <div className="space-y-1 sm:hidden">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <article
                    key={item.q}
                    className="group relative overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(8,8,8,0.96)_0%,rgba(20,9,11,0.94)_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(177,18,38,0.18),transparent_52%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                    <button
                      type="button"
                      className="relative flex w-full items-center justify-between gap-2.5 px-2.5 py-2 text-left"
                      onClick={() =>
                        setOpenFaqIndex((current) => (current === index ? null : index))
                      }
                      aria-expanded={isOpen}
                    >
                      <div className="min-w-0">
                        <span className="type-eyebrow text-white/30">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h2 className="type-card-title mt-1 text-[0.66rem] leading-[1.08] text-white/92">
                          {item.q}
                        </h2>
                      </div>
                      <ChevronDown
                        className={`size-3.5 shrink-0 text-white/72 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="relative border-t border-white/8 px-2.5 pb-2.5 pt-1.5">
                            <p className="type-body text-[0.58rem] leading-[1.28] text-white/66">
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </article>
                );
              })}
            </div>

            <div className="hidden grid-cols-1 gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-6 lg:gap-2.5 xl:gap-3">
              {faqs.map((item, index) => (
                <article
                  key={item.q}
                  className={`group relative overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(8,8,8,0.96)_0%,rgba(20,9,11,0.94)_100%)] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_70px_rgba(177,18,38,0.16)] sm:p-2 ${
                    index < 3
                      ? "lg:col-span-2"
                      : index === 3
                        ? "lg:col-start-2 lg:col-span-2"
                        : "lg:col-start-4 lg:col-span-2"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(177,18,38,0.18),transparent_52%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(177,18,38,0.5),transparent)] opacity-70" />

                  <div className="relative flex h-full flex-col">
                    <span className="type-eyebrow text-white/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h2 className="type-card-title mt-1 text-[0.64rem] leading-[1.08] text-white/92 sm:text-[0.7rem]">
                      {item.q}
                    </h2>

                    <p className="type-body mt-0.5 text-[0.56rem] leading-[1.24] text-white/60">
                      {item.a}
                    </p>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>
      </div>
      <PageFooterNote />
    </main>
  );
}
