"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { CloseButton } from "@/components/ui/close-button";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import { PageFooterNote } from "@/views/components/PageFooterNote";
import { blogEntries } from "@/data/blogs";

const blogFilters = ["All", "Automotive", "Lifestyle", "Experience", "News", "Stories"] as const;

type BlogFilter = (typeof blogFilters)[number];

export function BlogsView({ embedded = false }: { embedded?: boolean }) {
  const Root = embedded ? "div" : "main";
  const router = useRouter();
  const homeHref = "/";
  const mobileCarouselRef = useRef<HTMLDivElement | null>(null);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [activeBlogId, setActiveBlogId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<BlogFilter>("All");
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);

  const filteredBlogs = useMemo(() => {
    if (activeFilter === "All") return blogEntries;
    if (activeFilter === "Stories") {
      return blogEntries.filter(
        (entry) => entry.category === "Experience" || entry.category === "Lifestyle"
      );
    }
    return blogEntries.filter((entry) => entry.category === activeFilter);
  }, [activeFilter]);

  const activeBlog = useMemo(
    () => blogEntries.find((entry) => entry.id === activeBlogId) ?? null,
    [activeBlogId]
  );

  useOverlayBehavior(Boolean(activeBlog), () => setActiveBlogId(null));

  useEffect(() => {
    if (embedded) return;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [embedded]);

  useEffect(() => {
    setActiveMobileSlide(0);
    if (mobileCarouselRef.current) {
      mobileCarouselRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [activeFilter]);

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
    if (id === "blogs") return;
    if (id === "mission") return navigateTo("/mission");
    if (id === "contact") return navigateTo("/contact");
    if (id === "faq") return navigateTo("/faq");
  };

  return (
    <Root className="relative h-dvh overflow-hidden bg-black text-white">
      <div className={`pointer-events-none ${embedded ? "absolute" : "fixed"} inset-0`}>
        <Image
          src={assetPath("/images/bgcar.png")}
          alt="Veltro blog background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#1f1f1f_0%,#111111_38%,#050505_70%,#000_100%)] opacity-[0.78]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_58%_at_50%_48%,rgba(255,255,255,0.14),transparent_62%)]" />
        <div className="absolute inset-0 bg-black/54" />
        <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.74)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/60 via-black/24 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/66 via-black/28 to-transparent" />
      </div>

      <div className="relative mx-auto flex h-dvh w-full max-w-350 flex-col px-5 pt-5 max-[390px]:px-4 sm:px-10 sm:pt-6">
        <div className={`relative z-30 ${embedded ? "hidden" : ""}`}>
          <InternalPageHeader
            title="Blogs"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            surfaceClassName="bg-black sm:bg-transparent"
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>
        {embedded ? <h2 className="flex h-16 shrink-0 items-end pb-2 font-display text-[1.75rem] font-black uppercase leading-none tracking-[-0.04em] text-white sm:h-20 sm:pb-3 sm:text-[2.4rem]">Blogs<span className="text-[var(--brand-red)]">.</span></h2> : null}

        <section className="relative z-10 mt-7 flex min-h-0 flex-1 flex-col">
          <div className="text-[0.64rem] uppercase tracking-[0.14em] text-white/58">
            <div className="hidden flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center sm:hidden">
              {blogFilters.map((filter) => {
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`min-h-10 min-w-[5.25rem] px-1 py-2 transition ${
                      isActive ? "text-white" : "text-white/58"
                    }`}
                  >
                    <span
                      className={`inline-flex h-full items-center border-b pb-1 ${
                        isActive
                          ? "border-[var(--brand-red)]"
                          : "border-transparent"
                      }`}
                    >
                      {filter}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="hidden items-center gap-x-5 gap-y-3 sm:flex sm:flex-wrap">
              {blogFilters.map((filter, index) => {
                const isActive = activeFilter === filter;

                return (
                  <div key={filter} className="flex items-center gap-x-5">
                    <button
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`transition ${
                        isActive ? "text-white" : "text-white/58 hover:text-white/82"
                      }`}
                    >
                      <span
                        className={`inline-flex items-center border-b pb-1 ${
                          isActive
                            ? "border-[var(--brand-red)]"
                            : "border-transparent"
                        }`}
                      >
                        {filter}
                      </span>
                    </button>
                    {index < blogFilters.length - 1 ? (
                      <span className="text-white/24">|</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            ref={mobileCarouselRef}
            className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden sm:hidden"
            onScroll={(event) => {
              const target = event.currentTarget;
              const slideWidth = target.clientWidth + 16;
              if (slideWidth <= 0) return;
              const nextIndex = Math.round(target.scrollLeft / slideWidth);
              if (nextIndex !== activeMobileSlide) {
                setActiveMobileSlide(nextIndex);
              }
            }}
          >
            {filteredBlogs.map((entry) => (
              <button
                key={`${entry.id}-mobile`}
                type="button"
                onClick={() => setActiveBlogId(entry.id)}
                className="group flex min-h-[31rem] w-full shrink-0 snap-center flex-col overflow-hidden border border-white/10 bg-[#0b0c0e] text-left shadow-[0_24px_70px_rgba(0,0,0,0.52)] transition-[transform,border-color,box-shadow] duration-300 max-[390px]:min-h-[28.5rem]"
                aria-haspopup="dialog"
                aria-expanded={activeBlog?.id === entry.id}
              >
                <div className="relative h-[15.5rem] overflow-hidden border-b border-white/8 shadow-[inset_0_-26px_36px_rgba(0,0,0,0.5)] max-[390px]:h-[14rem]">
                  <Image
                    src={entry.heroImage}
                    alt={entry.title}
                    fill
                    className="object-cover object-center grayscale transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.28)_45%,rgba(0,0,0,0.58)_100%)]" />
                </div>

                <div className="flex flex-1 flex-col px-3 pb-3 pt-3">
                  <p className="type-button text-[0.54rem] uppercase tracking-[0.2em] text-[var(--brand-red)]">
                    {entry.category}
                  </p>

                  <h2 className="mt-2 type-card-title text-[1rem] leading-[1.08] text-white">
                    {entry.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-[0.72rem] leading-4.5 text-white/58">
                    {entry.summary}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/8 pt-3">
                    <div className="flex flex-wrap items-center gap-1.5 text-[0.52rem] uppercase tracking-[0.16em] text-white/42">
                      <span>{entry.publishedAt}</span>
                      <span className="text-white/24">•</span>
                      <span>{entry.readTime}</span>
                    </div>

                    <span className="inline-flex size-6 items-center justify-center text-[var(--brand-red)] transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight className="size-3" strokeWidth={1.8} />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
            {filteredBlogs.map((entry, index) => (
              <button
                key={`${entry.id}-dot`}
                type="button"
                aria-label={`Go to blog ${index + 1}`}
                onClick={() => {
                  const carousel = mobileCarouselRef.current;
                  if (!carousel) return;
                  carousel.scrollTo({
                    left: index * (carousel.clientWidth + 16),
                    behavior: "smooth",
                  });
                  setActiveMobileSlide(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  activeMobileSlide === index
                    ? "w-6 bg-[var(--brand-red)]"
                    : "w-1.5 bg-white/28"
                }`}
              />
            ))}
          </div>

          <div className="hidden min-h-0 grid-cols-1 gap-3 overflow-y-auto pb-4 sm:mt-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:mt-4 lg:grid-cols-3 lg:gap-4">
            {filteredBlogs.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setActiveBlogId(entry.id)}
                className="group flex h-full flex-col overflow-hidden border border-white/10 bg-[#0b0c0e] text-left shadow-[0_24px_70px_rgba(0,0,0,0.52)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:shadow-[0_30px_80px_rgba(0,0,0,0.64)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-haspopup="dialog"
                aria-expanded={activeBlog?.id === entry.id}
              >
                <div className="relative aspect-[1.06/0.58] overflow-hidden border-b border-white/8 shadow-[inset_0_-26px_36px_rgba(0,0,0,0.5)]">
                  <Image
                    src={entry.heroImage}
                    alt={entry.title}
                    fill
                    className="object-cover object-center grayscale transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.28)_45%,rgba(0,0,0,0.58)_100%)]" />
                </div>

                <div className="flex min-h-[10.5rem] flex-1 flex-col px-3 pb-3 pt-3 sm:px-3.5 sm:pb-3.5">
                  <p className="type-button text-[0.54rem] uppercase tracking-[0.2em] text-[var(--brand-red)] sm:text-[0.58rem]">
                    {entry.category}
                  </p>

                  <h2 className="mt-2 type-card-title text-[1rem] leading-[1.08] text-white sm:text-[1.12rem]">
                    {entry.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-[0.72rem] leading-4.5 text-white/58 sm:text-[0.76rem]">
                    {entry.summary}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/8 pt-3">
                    <div className="flex flex-wrap items-center gap-1.5 text-[0.52rem] uppercase tracking-[0.16em] text-white/42 sm:text-[0.56rem]">
                      <span>{entry.publishedAt}</span>
                      <span className="text-white/24">•</span>
                      <span>{entry.readTime}</span>
                    </div>

                    <span className="inline-flex size-6 items-center justify-center text-[var(--brand-red)] transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight className="size-3" strokeWidth={1.8} />
                    </span>
                  </div>
                </div>
              </button>
            ))}
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

      <AnimatePresence>
        {activeBlog ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 px-0 py-0 backdrop-blur-sm sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveBlogId(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`blog-modal-title-${activeBlog.id}`}
              className="relative flex h-[100dvh] w-full max-w-none flex-col overflow-hidden border-0 bg-[linear-gradient(180deg,rgba(6,6,6,0.99)_0%,rgba(15,15,15,0.99)_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.65)] sm:h-auto sm:max-h-[min(88vh,760px)] sm:max-w-3xl sm:border sm:border-white/12"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative flex h-full min-h-0 flex-col sm:max-h-[min(88vh,760px)]">
                <div className="relative border-b border-white/10 px-4 pb-4 pt-[max(1.15rem,env(safe-area-inset-top))] sm:px-6 sm:py-6 lg:px-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="type-button text-[0.66rem] uppercase tracking-[0.22em] text-[var(--brand-red)] sm:text-[0.7rem]">
                        {activeBlog.category}
                      </p>
                      <h2
                        id={`blog-modal-title-${activeBlog.id}`}
                        className="mt-3 type-section-title max-w-2xl text-[1.72rem] leading-[1.04] text-white sm:text-[1.8rem] sm:leading-[1.08] lg:text-[2.2rem]"
                      >
                        {activeBlog.title}
                      </h2>
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.66rem] uppercase tracking-[0.2em] text-white/40">
                        <span>{activeBlog.publishedAt}</span>
                        <span className="text-white/22">•</span>
                        <span>{activeBlog.readTime}</span>
                      </div>
                    </div>

                    <CloseButton
                      onClick={() => setActiveBlogId(null)}
                      className="mt-0.5 shrink-0 border-transparent! bg-transparent! shadow-none hover:border-transparent! hover:bg-transparent!"
                    />
                  </div>
                </div>

                <div className="relative flex-1 overflow-y-auto px-[max(1.5rem,env(safe-area-inset-left))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pr-[max(2rem,env(safe-area-inset-right))] pt-5 platinum-blog-scroll sm:px-6 sm:py-6 lg:px-8 lg:py-7">
                  <div className="mx-auto max-w-[42rem] space-y-5 pr-2 text-left text-[0.98rem] leading-7 text-white/78 sm:pr-0 sm:text-[1.02rem] sm:leading-8">
                    <p className="text-white/62">{activeBlog.summary}</p>
                    {activeBlog.body.map((paragraph, index) => (
                      <p key={`${activeBlog.id}-paragraph-${index}`}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Root>
  );
}
