"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { ActionLink } from "@/components/ui/action-link";
import { CloseButton } from "@/components/ui/close-button";
import { useOverlayBehavior } from "@/hooks/use-overlay-behavior";
import { usePageTransition } from "@/hooks/use-page-transition";
import { InternalPageHeader } from "@/views/components/InternalPageHeader";
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
  const { overlay, runTransition } = usePageTransition();

  const activeBlog =
    blogCards.find((entry) => entry.id === activeBlogId) ?? null;

  useOverlayBehavior(Boolean(activeBlog), () => setActiveBlogId(null));

  const navigateTo = (href: string) => {
    setIsDockOpen(false);
    runTransition(() => router.push(href));
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
      className="relative min-h-screen max-h-screen overflow-y-auto text-white platinum-blog-scroll"
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

      <div className="relative mx-auto flex min-h-screen w-full max-w-350 flex-col px-6 pb-6 pt-6 sm:px-10">
        <InternalPageHeader
          title="Blogs"
          isDockOpen={isDockOpen}
          onOpenChange={setIsDockOpen}
          onSelect={handleDockSelect}
          onLogoClick={() => navigateTo(homeHref)}
        />

        <section className="mt-4 sm:mt-6 lg:mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {blogCards.map((card) => (
              <motion.article
                key={card.id}
                className="group flex h-full"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <div className="relative flex h-full min-h-[240px] w-full flex-col justify-between overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(8,8,8,0.96)_0%,rgba(20,9,11,0.94)_100%)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition duration-300 group-hover:border-white/20 group-hover:shadow-[0_24px_70px_rgba(177,18,38,0.16)] sm:min-h-[260px] sm:p-6">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(177,18,38,0.18),transparent_52%)] opacity-70 transition duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(177,18,38,0.5),transparent)] opacity-70" />

                  <div className="relative flex h-full flex-col">
                    <span className="type-hero-title text-[clamp(2rem,4.8vw,3.1rem)] leading-none font-semibold tracking-[-0.05em] text-white/30">
                      {card.number}
                    </span>

                    <div className="mt-5 max-w-[32rem] space-y-3">
                      <h2 className="type-card-title text-[1.1rem] leading-[1.2] text-white sm:text-[1.22rem]">
                        {card.title}
                      </h2>
                      <p className="type-body text-[0.88rem] leading-6 text-white/72 sm:text-[0.93rem]">
                        {card.summary}
                      </p>
                    </div>

                    <div className="mt-auto pt-6">
                      <ActionLink
                        type="button"
                        className="text-[0.78rem]"
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

        <p className="fixed bottom-[calc(4vh-0.5cm)] left-1/2 z-30 hidden -translate-x-1/2 text-center text-[11px] tracking-[0.03em] text-white/55 sm:block">
          Platinum all rights reserved &copy; 2026
        </p>

      <AnimatePresence>
        {activeBlog ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveBlogId(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`blog-modal-title-${activeBlog.id}`}
              className="relative flex max-h-[min(88vh,760px)] w-full max-w-3xl flex-col overflow-hidden border border-white/12 bg-[linear-gradient(180deg,rgba(7,7,7,0.98)_0%,rgba(20,9,11,0.98)_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(177,18,38,0.22),transparent_50%)]" />
              <div className="relative flex items-start justify-between gap-6 border-b border-white/10 px-5 py-5 sm:px-8 sm:py-6">
                <div className="space-y-4">
                  <span className="type-hero-title text-[clamp(2.3rem,5vw,3.6rem)] leading-none font-semibold tracking-[-0.06em] text-white/28">
                    {activeBlog.number}
                  </span>
                  <h2
                    id={`blog-modal-title-${activeBlog.id}`}
                    className="type-section-title max-w-2xl text-[1.8rem] leading-[1.08] text-white sm:text-[2.4rem]"
                  >
                    {activeBlog.title}
                  </h2>
                </div>
                <CloseButton
                  onClick={() => setActiveBlogId(null)}
                />
              </div>

              <div className="relative overflow-y-auto px-5 py-5 platinum-blog-scroll sm:px-8 sm:py-7">
                <div className="space-y-5 text-[0.98rem] leading-8 text-white/78 sm:text-[1.04rem]">
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
