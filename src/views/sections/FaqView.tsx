"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import { PageFooterNote } from "@/views/components/PageFooterNote";

const faqs = [
  {
    q: "How do I make a reservation?",
    a: "You can make a reservation through our website or by contacting the Veltro team directly. We confirm availability, timing, and final delivery details before handover.",
  },
  {
    q: "What documents do I need to rent a car?",
    a: "A valid driving license, passport, Emirates ID, or equivalent identity documentation may be required depending on residency status and vehicle category.",
  },
  {
    q: "Is there a mileage limit?",
    a: "Each rental includes a defined mileage allowance. The exact limit depends on the selected vehicle and rental duration, and any additional usage is quoted transparently.",
  },
  {
    q: "Can I cancel or modify my reservation?",
    a: "Yes. Reservation changes and cancellations are handled case by case based on timing, vehicle availability, and the booking terms confirmed at checkout.",
  },
  {
    q: "Do you offer chauffeur services?",
    a: "Selected experiences may be arranged with a professional driver upon request. Availability depends on scheduling and the type of booking requested.",
  },
  {
    q: "What happens in case of an accident?",
    a: "Our team provides immediate guidance and support. You should contact Veltro as soon as possible so we can assist with the next steps, documentation, and recovery arrangements.",
  },
] as const;

export function FaqView({ embedded = false }: { embedded?: boolean }) {
  const Root = embedded ? "div" : "main";
  const router = useRouter();
  const homeHref = "/";
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (embedded) return;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [embedded]);

  const navigateTo = (href: string) => {
    router.push(href);
  };

  const handleDockSelect = (id: string) => {
    if (embedded) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (id === "home") return navigateTo(homeHref);
    if (id === "fleet") return navigateTo("/fleet");
    if (id === "blogs") return navigateTo("/blogs");
    if (id === "mission") return navigateTo("/mission");
    if (id === "contact") return navigateTo("/contact");
    if (id === "faq") return;
  };

  return (
    <Root className="relative h-dvh overflow-hidden bg-black text-white">
      <div className={`pointer-events-none ${embedded ? "absolute" : "fixed"} inset-0`}>
        <Image
          src={assetPath("/images/FAQ.png")}
          alt="Veltro FAQ background"
          fill
          priority
          className="object-cover object-[78%_68%] sm:object-[80%_62%] lg:object-[86%_70%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.88)_28%,rgba(0,0,0,0.62)_48%,rgba(0,0,0,0.26)_68%,rgba(0,0,0,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.08)_45%,rgba(0,0,0,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_18%_18%,rgba(255,255,255,0.08),transparent_56%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_48%_at_82%_84%,rgba(255,255,255,0.09),transparent_52%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[34vh] bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.02)_28%,rgba(0,0,0,0.18)_52%,rgba(0,0,0,0.74)_100%)]" />
        <div className="absolute inset-x-[34%] bottom-[11vh] h-[14vh] bg-[radial-gradient(50%_100%_at_50%_50%,rgba(255,255,255,0.07),transparent_72%)] blur-2xl" />
        <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.82)]" />
      </div>

      <div className="relative mx-auto flex h-dvh w-full max-w-350 flex-col px-5 pt-5 max-[390px]:px-4 sm:px-10 sm:pt-6">
        <div className={`sticky top-0 z-40 -mx-5 px-5 pb-3 max-[390px]:-mx-4 max-[390px]:px-4 sm:-mx-10 sm:px-10 ${embedded ? "hidden" : ""}`}>
          <InternalPageHeader
            title="FAQ"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            surfaceClassName="bg-black sm:bg-transparent"
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>
        {embedded ? <h2 className="relative z-30 flex h-16 shrink-0 items-end pb-2 font-display text-[1.75rem] font-black uppercase leading-none tracking-[-0.04em] text-white sm:h-20 sm:pb-3 sm:text-[2.4rem]">FAQ&apos;S<span className="text-[var(--brand-red)]">.</span></h2> : null}

        <section className="relative z-10 flex flex-1 items-start justify-start pt-2 sm:pt-5 lg:pt-6">
          <div className="w-full max-w-[46rem]">
            <div className="max-w-[18rem] sm:max-w-[21rem] lg:max-w-[22rem]">
              <h1 className="font-display text-[1.5rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-[2rem] lg:text-[2.2rem]">
                EVERYTHING YOU NEED TO KNOW<span className="text-[var(--brand-red)]">.</span>
              </h1>

              <div className="mt-6 h-px w-12 bg-[var(--brand-red)]" />
            </div>

            <div className="mt-6 max-w-[30rem] sm:mt-7">
              {faqs.map((item, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <article
                    key={item.q}
                    className="border-b border-white/10"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex((current) => (current === index ? null : index))
                      }
                      aria-expanded={isOpen}
                      className="group flex w-full items-start gap-4 py-3.5 text-left sm:gap-6 sm:py-4"
                    >
                      <span className="font-display text-[0.8rem] leading-none text-[var(--brand-red)] sm:pt-1 sm:text-[0.88rem]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 flex-1 pr-2">
                        <h2 className="font-display text-[0.95rem] leading-[1.2] text-white/92 transition-colors duration-300 group-hover:text-white sm:text-[1.04rem]">
                          {item.q}
                        </h2>
                      </div>

                      <span
                        className={`mt-0.5 font-display text-[1rem] leading-none transition-colors duration-300 sm:mt-1 sm:text-[1.15rem] ${
                          isOpen ? "text-[var(--brand-red)]" : "text-white/48 group-hover:text-white/84"
                        }`}
                        aria-hidden="true"
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-3 pl-[2.1rem] pr-8 sm:pb-4 sm:pl-[3.1rem] sm:pr-12">
                            <p className="max-w-[26rem] text-[0.82rem] leading-6 text-white/58 sm:text-[0.86rem] sm:leading-7">
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
    </Root>
  );
}
