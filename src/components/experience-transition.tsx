"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";
import { assetPath } from "@/lib/asset-path";
import {
  ENABLE_TEMP_HYPERSPEED_AUDIO,
  playHyperspeedAudioDemo,
  stopHyperspeedAudioDemo,
} from "@/lib/hyperspeed-audio-demo";
import { PortfolioIntro } from "@/components/intro/portfolio-intro";
import { Hyperspeed } from "@/components/ui/hyperspeed";

export type ExperienceStage =
  | "portfolio"
  | "fade-out-portfolio"
  | "hyperspeed"
  | "fade-out-hyperspeed"
  | "home";

type ExperienceTransitionProps = {
  children: ReactNode;
  sessionKey?: string;
  alwaysReplay?: boolean;
};

const easing = [0.22, 1, 0.36, 1] as const;
const PORTFOLIO_FADE_DURATION_MS = 400;
const INTRO_AUDIO_DURATION_MS = 11233;
const LOGO_STAGE_DURATION_MS = 4000;
const LOGO_REVEAL_DELAY_MS = 0;
const HYPERSPEED_DURATION_MS =
  INTRO_AUDIO_DURATION_MS - LOGO_STAGE_DURATION_MS - PORTFOLIO_FADE_DURATION_MS;
const INTRO_SEQUENCE_FAILSAFE_MS = 12000;
const hyperspeedEffect = {
  fovSpeedUp: 116,
  speedUp: 1.15,
  carLightsFade: 0.5,
  totalSideLightSticks: 28,
  lightPairsPerRoadWay: 46,
  brokenLinesWidthPercentage: 0.09,
  lightStickWidth: [0.12, 0.4] as [number, number],
  lightStickHeight: [1.3, 1.9] as [number, number],
  movingAwaySpeed: [74, 98] as [number, number],
  movingCloserSpeed: [-150, -186] as [number, number],
  carLightsLength: [16, 78] as [number, number],
  colors: {
    roadColor: 0x040404,
    islandColor: 0x120406,
    background: 0x000000,
    shoulderLines: 0xf4eee7,
    brokenLines: 0xd8d2ca,
    leftCars: [0xb11226, 0xd11421, 0x7a0d16],
    rightCars: [0xffffff, 0xe7d7c5, 0xb11226],
    sticks: 0xb11226,
  },
};

export function ExperienceTransition({
  children,
  sessionKey,
  alwaysReplay = false,
}: ExperienceTransitionProps) {
  useReducedMotion();
  const shouldReduceMotion = false;
  const [isHydrated, setIsHydrated] = useState(false);
  const [stage, setStage] = useState<ExperienceStage>("portfolio");
  const [hasStarted, setHasStarted] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const failsafeRef = useRef<number | null>(null);

  const shouldShowIntro =
    stage === "portfolio" || stage === "fade-out-portfolio";
  const shouldShowBlackLayer = stage !== "portfolio";
  const shouldMountHyperspeed = stage === "hyperspeed";

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const skipIntro = params.get("intro") === "false";

    if (alwaysReplay) {
      setIsHydrated(true);
      setStage(skipIntro ? "home" : "portfolio");
      return;
    }

    setIsHydrated(true);

    const forceReplay = params.get("intro") === "true";
    const hasCompleted = sessionKey
      ? sessionStorage.getItem(sessionKey) === "true"
      : false;

    if (!forceReplay && hasCompleted) {
      setStage("home");
      return;
    }

    setStage("portfolio");
  }, [alwaysReplay, sessionKey]);

  useEffect(() => {
    if (!isHydrated) return;

    if (stage !== "home") {
      lockBodyScroll();
      return () => unlockBodyScroll();
    }

    unlockBodyScroll();
  }, [isHydrated, stage]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (stage === "fade-out-portfolio") {
      timeoutRef.current = window.setTimeout(() => {
        if (shouldReduceMotion) {
          if (sessionKey) {
            sessionStorage.setItem(sessionKey, "true");
          }
          setStage("home");
          return;
        }
        setStage("hyperspeed");
      }, PORTFOLIO_FADE_DURATION_MS);
      return;
    }

    if (stage === "fade-out-hyperspeed") {
      timeoutRef.current = window.setTimeout(() => {
        if (sessionKey) {
          sessionStorage.setItem(sessionKey, "true");
        }
        setStage("home");
      }, LOGO_REVEAL_DELAY_MS + LOGO_STAGE_DURATION_MS);
    }
  }, [sessionKey, shouldReduceMotion, stage]);

  useEffect(() => {
    if (!hasStarted) return;

    failsafeRef.current = window.setTimeout(() => {
      if (sessionKey) {
        sessionStorage.setItem(sessionKey, "true");
      }
      setStage("home");
    }, INTRO_SEQUENCE_FAILSAFE_MS);

    return () => {
      if (failsafeRef.current) {
        clearTimeout(failsafeRef.current);
        failsafeRef.current = null;
      }
    };
  }, [hasStarted, sessionKey]);

  useEffect(() => {
    if (stage === "home" && failsafeRef.current) {
      clearTimeout(failsafeRef.current);
      failsafeRef.current = null;
    }
  }, [stage]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
      stopHyperspeedAudioDemo();
    };
  }, []);

  const handleEnter = useMemo(
    () => () => {
      if (hasStarted || stage !== "portfolio") return;
      if (ENABLE_TEMP_HYPERSPEED_AUDIO) {
        void playHyperspeedAudioDemo(INTRO_AUDIO_DURATION_MS);
      }
      setHasStarted(true);
      setStage("fade-out-portfolio");
    },
    [hasStarted, stage]
  );

  const blackOpacity =
    stage === "fade-out-portfolio" || stage === "fade-out-hyperspeed" ? 1 : 0;

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <motion.div
        className="relative"
        initial={false}
        animate={{ opacity: stage === "home" ? 1 : 0 }}
        transition={{ duration: 0.5, ease: easing }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {shouldMountHyperspeed ? (
          <motion.div
            key="hyperspeed"
            className="fixed inset-0 z-[9996]"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === "hyperspeed" ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: stage === "hyperspeed" ? 0.35 : 0.45,
              ease: easing,
            }}
          >
            <Hyperspeed
              duration={HYPERSPEED_DURATION_MS}
              reducedMotion={shouldReduceMotion}
              showLogoOverlay={false}
              effectOptions={hyperspeedEffect}
              onComplete={() => {
                setStage((current) =>
                  current === "hyperspeed" ? "fade-out-hyperspeed" : current
                );
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        className="pointer-events-none fixed inset-0 z-[9997] bg-black"
        initial={false}
        animate={{ opacity: shouldShowBlackLayer ? blackOpacity : 0 }}
        transition={{
          duration:
            stage === "fade-out-portfolio"
              ? 0.4
              : stage === "fade-out-hyperspeed"
                ? 0.45
                : stage === "home"
                  ? 0.5
                  : 0.35,
          ease: easing,
        }}
      />

      <AnimatePresence>
        {stage === "fade-out-hyperspeed" ? (
          <motion.div
            key="hyperspeed-logo"
            className="pointer-events-none fixed inset-0 z-[9998] flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.22,
              delay: LOGO_REVEAL_DELAY_MS / 1000,
              ease: easing,
            }}
          >
            <Image
              src={assetPath("/icons/Platinumlogo.svg")}
              alt=""
              width={180}
              height={36}
              unoptimized
              aria-hidden="true"
              className="h-auto w-[9rem] object-contain sm:w-[11rem]"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {shouldShowIntro ? (
          <motion.div
            key="portfolio-intro-shell"
            className="fixed inset-0 z-[9998]"
            initial={false}
            animate={{
              opacity:
                stage === "portfolio"
                  ? 1
                  : stage === "fade-out-portfolio"
                    ? 0
                    : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easing }}
          >
            <PortfolioIntro onEnter={handleEnter} disabled={hasStarted} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
