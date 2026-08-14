"use client";

import { useEffect, useMemo, useState } from "react";
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

const blogFilters = ["All", "Automotive", "Lifestyle", "Experience", "News"] as const;

type BlogFilter = (typeof blogFilters)[number];

export function BlogsView() {
  const router = useRouter();
  const homeHref = "/";
  const [isDockOpen, setIsDockOpen] = useState(true);
  const [activeBlogId, setActiveBlogId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<BlogFilter>("All");

  const filteredBlogs = useMemo(() => {
    if (activeFilter === "All") return blogEntries;
    return blogEntries.filter((entry) => entry.category === activeFilter);
  }, [activeFilter]);

  const activeBlog = useMemo(
    () => blogEntries.find((entry) => entry.id === activeBlogId) ?? null,
    [activeBlogId]
  );

  useOverlayBehavior(Boolean(activeBlog), () => setActiveBlogId(null));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const navigateTo = (href: string) => {
    router.push(href);
  };

  const handleDockSelect = (id: string) => {
    if (id === "home") {
      navigateTo(homeHref);
      return;
    }
    if (id === "fleet") {
      navigateTo("/fleet");
      return;
    }
    if (id === "blogs") {
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
    <main className="relative h-dvh overflow-hidden bg-black text-white">
      <div className="pointer-events-none fixed inset-0">
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

      <div className="relative mx-auto flex h-dvh w-full max-w-350 flex-col px-6 pb-12 pt-5 sm:px-10 sm:pt-6">
        <div className="relative z-30">
          <InternalPageHeader
            title="Blogs"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>

        <section className="relative z-10 mt-3 sm:mt-6">
          <div className="overflow-x-auto pb-3 no-scrollbar">
            <div className="flex min-w-max items-center gap-4 pb-4 text-[0.64rem] uppercase tracking-[0.14em] text-white/58 sm:gap-5">
              {blogFilters.map((filter, index) => {
                const isActive = activeFilter === filter;
                return (
                  <div key={filter} className="flex items-center gap-4 sm:gap-5">
                    <button
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`transition ${
                        isActive
                          ? filter === "All"
                            ? "border border-[var(--brand-red)] px-4 py-2 text-white"
                            : "text-white"
                          : "text-white/58 hover:text-white/82"
                      }`}
                    >
                      {filter}
                    </button>
                    {index < blogFilters.length - 1 ? (
                      <span className="text-white/24">|</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:-mt-[0.75rem] sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-4">
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
      </div>

      <PageFooterNote />

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
    </main>
  );
}
