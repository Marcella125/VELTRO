"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { PrimaryButton } from "@/components/ui/primary-button";

type PortfolioIntroProps = {
  onEnter: () => void;
  disabled?: boolean;
};

const DESCRIPTION =
  "An original front-end and UI/UX concept created to explore premium automotive design, responsive interfaces, and refined digital interactions.";
const META = "Personal portfolio project created by marcella moussa";

export function PortfolioIntro({
  onEnter,
  disabled = false,
}: PortfolioIntroProps) {
  return (
    <motion.section
      className="fixed inset-0 z-[9998] overflow-hidden bg-[#040405] text-white"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
      }}
      aria-labelledby="portfolio-intro-title"
      aria-describedby="portfolio-intro-description"
    >
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={assetPath("/Platinum Intro.png")}
          alt=""
          fill
          priority
          className="object-cover object-center"
          aria-hidden="true"
        />
      </div>

      <div className="relative flex min-h-dvh w-full flex-col px-6 pt-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Image
            src={assetPath("/icons/Platinumlogo.svg")}
            alt="Platinum"
            width={120}
            height={24}
            className="h-5 w-auto object-contain"
            priority
            unoptimized
          />
        </div>

        <div className="flex flex-1 items-center">
          <div className="w-full max-w-[43rem]">
            <motion.h1
              id="portfolio-intro-title"
              className="type-section-title max-w-none whitespace-nowrap !text-[clamp(calc(1.7rem-14px),calc(2.8vw-14px),calc(3.45rem-14px))] tracking-[-0.04em] text-white"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              Platinum -{" "}
              <span className="text-[var(--brand-red)]">Luxury</span> Automotive
              Experience
            </motion.h1>

            <motion.p
              id="portfolio-intro-description"
              className="type-body mt-7 max-w-[37rem] !text-[16px] leading-[1.64] text-white/74 sm:!text-[17px]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.42,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {DESCRIPTION}
            </motion.p>

            <motion.div
              className="mt-9"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.38,
                delay: 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <PrimaryButton
                type="button"
                onClick={onEnter}
                disabled={disabled}
                className="min-w-[15.5rem] px-8 disabled:translate-y-0 disabled:cursor-default disabled:shadow-none disabled:opacity-70"
              >
                Enter Experience
              </PrimaryButton>

              <p className="type-eyebrow mt-5 !text-[8px] tracking-[0.22em] text-white/36 sm:!text-[9px]">
                {META}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
