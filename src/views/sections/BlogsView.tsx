"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { ActionLink } from "@/components/ui/action-link";
import { CloseButton } from "@/components/ui/close-button";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { usePageTransition } from "@/hooks/use-page-transition";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
import { PageFooterNote } from "@/views/components/PageFooterNote";
import { blogEntries } from "@/data/blogs";

const blogCards = blogEntries.map((entry, index) => ({
  id: entry.id,
  number: String(index + 1).padStart(2, "0"),
  title: entry.title,
  summary: entry.summary,
  body: entry.body,
}));

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
  },
};

export function BlogsView() {
  const router = useRouter();
  const homeHref = "/";
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [activeBlogId, setActiveBlogId] = useState<string | null>(null);
  const [hasMobileScrolled, setHasMobileScrolled] = useState(false);
  const { overlay } = usePageTransition();

  const activeBlog =
    blogCards.find((entry) => entry.id === activeBlogId) ?? null;

  useOverlayBehavior(Boolean(activeBlog), () => setActiveBlogId(null));

  useEffect(() => {
    const handleScroll = () => {
      setHasMobileScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = (href: string) => {
    setIsDockOpen(false);
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
      setIsDockOpen(false);
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
    <motion.main
      className="relative min-h-[100dvh] overflow-x-hidden text-white platinum-blog-scroll"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>{overlay}</AnimatePresence>
      <div className="pointer-events-none fixed inset-0">
        <Image
          src={assetPath("/images/bgcar.png")}
          alt="Platinum blog background"
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

      <div
        className={`fixed inset-x-0 top-0 z-40 px-6 pb-3 pt-1 transition-[background-color,box-shadow,border-color] duration-200 sm:hidden ${
          hasMobileScrolled
            ? "border-b border-white/8 bg-[#000000] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="relative mx-auto w-full max-w-350">
          <InternalPageHeader
            title="Blogs"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            onLogoClick={() => navigateTo(homeHref)}
            surfaceClassName={hasMobileScrolled ? "bg-[#000000]" : undefined}
          />
        </div>
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-350 flex-col px-6 pb-6 pt-22 sm:px-10 sm:pt-6">
        <div className="relative z-40 hidden sm:block">
          <InternalPageHeader
            title="Blogs"
            isDockOpen={isDockOpen}
            onOpenChange={setIsDockOpen}
            onSelect={handleDockSelect}
            onLogoClick={() => navigateTo(homeHref)}
          />
        </div>

        <section className="relative z-10 mt-2 sm:mt-6 lg:mt-8">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 md:gap-5">
            {blogCards.map((card) => (
              <motion.article
                key={card.id}
                className="group flex h-full"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <div className="relative flex h-full min-h-[122px] w-full flex-col justify-between overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(8,8,8,0.96)_0%,rgba(20,9,11,0.94)_100%)] p-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition duration-300 group-hover:border-white/20 group-hover:shadow-[0_24px_70px_rgba(177,18,38,0.16)] sm:min-h-[260px] sm:p-6">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(177,18,38,0.18),transparent_52%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(177,18,38,0.5),transparent)] opacity-70" />

                  <div className="relative flex h-full flex-col">
                    <span className="type-hero-title text-[clamp(1.35rem,3.2vw,3.1rem)] leading-none font-semibold tracking-[-0.05em] text-white/30 sm:text-[clamp(2rem,4.8vw,3.1rem)]">
                      {card.number}
                    </span>

                    <div className="mt-1.5 max-w-[32rem] space-y-0.5 sm:mt-5 sm:space-y-3">
                      <h2 className="type-card-title text-[0.82rem] leading-[1.08] text-white sm:text-[1.1rem] sm:leading-[1.2] lg:text-[1.22rem]">
                        {card.title}
                      </h2>
                      <p className="type-body line-clamp-2 text-[0.7rem] leading-4 text-white/72 sm:line-clamp-none sm:text-[0.88rem] sm:leading-6 lg:text-[0.93rem]">
                        {card.summary}
                      </p>
                    </div>

                    <div className="mt-auto pt-2 sm:pt-6">
                      <ActionLink
                        type="button"
                        className="text-[0.68rem] sm:text-[0.78rem]"
                        onClick={() => setActiveBlogId(card.id)}
                        aria-haspopup="dialog"
                        aria-expanded={activeBlog?.id === card.id}
                      >
                        Read More
                      </ActionLink>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

      </div>
      <PageFooterNote />
      <p className="fixed bottom-[calc(4vh-0.5cm)] left-1/2 z-30 hidden -translate-x-1/2 text-center text-[11px] tracking-[0.03em] text-white/55 sm:block">
        Platinum all rights reserved &copy; 2026
      </p>

      <AnimatePresence>
        {activeBlog ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-0 py-0 backdrop-blur-sm sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveBlogId(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`blog-modal-title-${activeBlog.id}`}
              className="relative flex h-[100dvh] w-full max-w-none flex-col overflow-hidden border-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.985)_0%,rgba(20,9,11,0.985)_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.65)] sm:max-h-[min(88vh,760px)] sm:max-w-3xl sm:border sm:border-white/12"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(177,18,38,0.22),transparent_50%)]" />
              <div className="relative border-b border-white/10 px-4 pb-4 pt-[max(1.15rem,env(safe-area-inset-top))] sm:flex sm:items-start sm:justify-between sm:gap-6 sm:px-5 sm:py-5 lg:px-8 lg:py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-3 sm:space-y-4">
                    <span className="type-hero-title block text-[2.45rem] leading-none font-semibold tracking-[-0.06em] text-white/22 sm:text-[clamp(2.3rem,5vw,3.6rem)] sm:text-white/28">
                    {activeBlog.number}
                    </span>
                    <h2
                      id={`blog-modal-title-${activeBlog.id}`}
                      className="type-section-title max-w-2xl text-[1.72rem] leading-[1.04] text-white sm:text-[1.8rem] sm:leading-[1.08] lg:text-[2.4rem]"
                    >
                      {activeBlog.title}
                    </h2>
                  </div>
                  <CloseButton
                    onClick={() => setActiveBlogId(null)}
                    className="mt-0.5 shrink-0 border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-transparent sm:border-[var(--border-subtle)] sm:bg-black/20 sm:hover:border-[var(--brand-red)] sm:hover:bg-white/[0.04]"
                  />
                </div>
              </div>

              <div className="relative flex-1 overflow-y-auto pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(2rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 platinum-blog-scroll sm:px-5 sm:py-5 lg:px-8 lg:py-7">
                <div className="mx-auto max-w-[42rem] space-y-4 pr-2 text-left text-[0.98rem] leading-7 text-white/78 sm:space-y-5 sm:pr-0 sm:text-[1.04rem] sm:leading-8">
                  {activeBlog.body.map((paragraph, index) => (
                    <p key={`${activeBlog.id}-paragraph-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}
