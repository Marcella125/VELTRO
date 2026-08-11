"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export const PAGE_TRANSITION_DURATION_MS = 520;
const PAGE_TRANSITION_REVEAL_DELAY_MS = 280;
const PAGE_TRANSITION_BROWSER_REVEAL_MS = 260;

type PageTransitionOptions = {
  awaitNavigation?: boolean;
};

type PageTransitionContextValue = {
  isTransitioning: boolean;
  phase: "idle" | "covering" | "revealing";
  runTransition: (action: () => void, options?: PageTransitionOptions) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "covering" | "revealing">("idle");
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualNavigationRef = useRef(false);
  const browserNavigationRef = useRef(false);
  const previousPathnameRef = useRef(pathname);

  const clearTimers = useCallback(() => {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    revealTimerRef.current = null;
    resetTimerRef.current = null;
  }, []);

  const runTransition = useCallback(
    (action: () => void, _options?: PageTransitionOptions) => {
      if (prefersReducedMotion) {
        action();
        return;
      }

      clearTimers();
      manualNavigationRef.current = true;
      action();

      revealTimerRef.current = setTimeout(() => {
        setPhase("revealing");
      }, PAGE_TRANSITION_REVEAL_DELAY_MS);

      resetTimerRef.current = setTimeout(() => {
        setPhase("idle");
      }, PAGE_TRANSITION_DURATION_MS);
    },
    [clearTimers, prefersReducedMotion]
  );

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handlePopState = () => {
      browserNavigationRef.current = true;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (pathname === previousPathnameRef.current) return;
    previousPathnameRef.current = pathname;

    if (manualNavigationRef.current) {
      manualNavigationRef.current = false;
      browserNavigationRef.current = false;
      return;
    }

    if (prefersReducedMotion || !browserNavigationRef.current) return;

    browserNavigationRef.current = false;
    clearTimers();
    setPhase("revealing");
    resetTimerRef.current = setTimeout(() => {
      setPhase("idle");
    }, PAGE_TRANSITION_BROWSER_REVEAL_MS);
  }, [clearTimers, pathname, prefersReducedMotion]);

  return (
    <PageTransitionContext.Provider
      value={{ isTransitioning: phase !== "idle", phase, runTransition }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransitionContext() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error("usePageTransition must be used within PageTransitionProvider");
  }

  return context;
}
