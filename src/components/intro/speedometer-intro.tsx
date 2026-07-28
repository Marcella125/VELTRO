"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ActionLink } from "@/components/ui/action-link";

type SpeedometerIntroProps = {
  onComplete: () => void;
  onSkip: () => void;
};

const MAX_DISPLAY_SPEED = 300;
const TARGET_SPEED = 150;
const SPEED_LABELS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300];

function polarPoint(radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: 200 + radius * Math.cos(angleRad),
    y: 200 + radius * Math.sin(angleRad),
  };
}

function arcPath(radius: number, startAngle: number, endAngle: number) {
  const start = polarPoint(radius, startAngle);
  const end = polarPoint(radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export function SpeedometerIntro({
  onComplete,
  onSkip,
}: SpeedometerIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const speed = useMotionValue(0);
  const [speedValue, setSpeedValue] = useState(0);
  const [isFinalSweep, setIsFinalSweep] = useState(false);
  const progress = Math.min(speedValue / MAX_DISPLAY_SPEED, 1);
  const needleAngle = 135 + progress * 270;
  const activeArcPath = useMemo(
    () => arcPath(148, 135, 135 + progress * 270),
    [progress]
  );

  useMotionValueEvent(speed, "change", (value) => {
    setSpeedValue(Math.max(0, Math.min(TARGET_SPEED, Math.round(value))));
  });

  useEffect(() => {
    let completeTimer: ReturnType<typeof setTimeout> | undefined;
    let finalSweepFrame: number | undefined;

    const finish = () => {
      if (completeTimer) clearTimeout(completeTimer);
      if (finalSweepFrame) window.cancelAnimationFrame(finalSweepFrame);
      onComplete();
    };

    const fallbackTimer = setTimeout(finish, prefersReducedMotion ? 1800 : 4200);

    if (prefersReducedMotion) {
      speed.set(TARGET_SPEED);
      finalSweepFrame = window.requestAnimationFrame(() => {
        setIsFinalSweep(true);
      });
      completeTimer = setTimeout(finish, 900);
      return () => {
        if (completeTimer) clearTimeout(completeTimer);
        if (fallbackTimer) clearTimeout(fallbackTimer);
        if (finalSweepFrame) window.cancelAnimationFrame(finalSweepFrame);
      };
    }

    const controls = animate(speed, TARGET_SPEED, {
      duration: 2.2,
      ease: [0.2, 0.88, 0.22, 1],
      onComplete: () => {
        setIsFinalSweep(true);
        completeTimer = setTimeout(finish, 320);
      },
    });

    return () => {
      controls.stop();
      if (completeTimer) clearTimeout(completeTimer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (finalSweepFrame) window.cancelAnimationFrame(finalSweepFrame);
    };
  }, [onComplete, prefersReducedMotion, speed]);

  return (
    <motion.section
      className="fixed inset-0 z-[9997] overflow-hidden bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.015,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }}
      aria-live="polite"
      role="status"
      aria-label={`Entering experience at ${speedValue} kilometers per hour`}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(70%_52%_at_50%_55%,rgba(177,18,38,0.18),transparent_70%)]"
          animate={{ opacity: isFinalSweep ? 1 : 0.62 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(34%_24%_at_50%_48%,rgba(177,18,38,0.22),transparent_78%)]"
          animate={{ scale: isFinalSweep ? 1.08 : 1, opacity: isFinalSweep ? 1 : 0.65 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.9)]" />
      </div>

      <div className="relative flex min-h-dvh items-center justify-center px-4 py-8 sm:px-8">
        <div className="relative flex w-full max-w-[54rem] items-center justify-center">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)]" />
          <motion.div
            className="relative aspect-square w-full max-w-[26rem] sm:max-w-[34rem] lg:max-w-[42rem]"
            animate={{
              scale: isFinalSweep ? 1.03 : 1,
              filter: isFinalSweep ? "brightness(1.06)" : "brightness(1)",
            }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              viewBox="0 0 400 400"
              className="h-full w-full overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="speedometer-red" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(177,18,38,0.15)" />
                  <stop offset="45%" stopColor="#b11226" />
                  <stop offset="100%" stopColor="#ff455d" />
                </linearGradient>
                <filter id="speedometer-glow">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d={arcPath(148, 135, 405)}
                fill="none"
                stroke="rgba(255,255,255,0.13)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d={activeArcPath}
                fill="none"
                stroke="url(#speedometer-red)"
                strokeWidth="10"
                strokeLinecap="round"
                filter="url(#speedometer-glow)"
              />

              {SPEED_LABELS.map((label) => {
                const angle = 135 + (label / MAX_DISPLAY_SPEED) * 270;
                const inner = polarPoint(126, angle);
                const outer = polarPoint(label % 60 === 0 ? 152 : 144, angle);
                const textPoint = polarPoint(102, angle);

                return (
                  <g key={label}>
                    <line
                      x1={inner.x}
                      y1={inner.y}
                      x2={outer.x}
                      y2={outer.y}
                      stroke={label <= TARGET_SPEED ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.34)"}
                      strokeWidth={label % 60 === 0 ? 2 : 1.25}
                      strokeLinecap="round"
                    />
                    <text
                      x={textPoint.x}
                      y={textPoint.y}
                      fill={label <= TARGET_SPEED ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.36)"}
                      fontSize="11"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ letterSpacing: "0.18em" }}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              <g
                style={{
                  transformOrigin: "200px 200px",
                  transform: `rotate(${needleAngle}deg)`,
                }}
              >
                <line
                  x1="200"
                  y1="200"
                  x2="200"
                  y2="78"
                  stroke="#f3f3f3"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.96"
                />
                <circle cx="200" cy="200" r="8" fill="#b11226" />
                <circle cx="200" cy="200" r="18" fill="rgba(177,18,38,0.22)" />
              </g>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="type-price text-[clamp(4rem,10vw,6.8rem)] leading-none text-white"
                animate={{ textShadow: isFinalSweep ? "0 0 24px rgba(177,18,38,0.35)" : "0 0 0 rgba(0,0,0,0)" }}
              >
                {speedValue}
              </motion.div>
              <div className="type-eyebrow mt-3 text-[12px] tracking-[0.28em] text-white/58">
                km/h
              </div>
              <div className="type-eyebrow mt-5 text-[10px] tracking-[0.42em] text-white/34">
                Platinum
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {!prefersReducedMotion && (
          <motion.div
            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.25 }}
          >
            <ActionLink type="button" onClick={onSkip} className="text-white/54">
              Skip Intro
            </ActionLink>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
