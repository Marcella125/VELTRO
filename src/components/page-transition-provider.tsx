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
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export const PAGE_TRANSITION_DURATION_MS = 210;
const PAGE_TRANSITION_ACTION_DELAY_MS = 70;
const PAGE_TRANSITION_FALLBACK_MS = 700;

type PageTransitionOptions = {
  awaitNavigation?: boolean;
};

type PageTransitionContextValue = {
  isTransitioning: boolean;
  runTransition: (action: () => void, options?: PageTransitionOptions) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentRouteKeyRef = useRef(pathname);
  const navigationStartedRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const startTimeoutRef = useRef<number | null>(null);
  const finishTimeoutRef = useRef<number | null>(null);

  const clearTimeouts = useCallback(() => {
    if (startTimeoutRef.current) {
      window.clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }
    if (finishTimeoutRef.current) {
      window.clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }
  }, []);

  const finishTransition = useCallback(() => {
    clearTimeouts();
    setIsTransitioning(false);
    isTransitioningRef.current = false;
    navigationStartedRef.current = false;
  }, [clearTimeouts]);

  const scheduleFinish = useCallback(
    (delayMs: number) => {
      if (finishTimeoutRef.current) {
        window.clearTimeout(finishTimeoutRef.current);
      }

      finishTimeoutRef.current = window.setTimeout(() => {
        finishTransition();
      }, delayMs);
    },
    [finishTransition]
  );

  useEffect(() => {
    if (currentRouteKeyRef.current === pathname) return;

    currentRouteKeyRef.current = pathname;

    if (!navigationStartedRef.current) return;

    scheduleFinish(PAGE_TRANSITION_DURATION_MS);
  }, [pathname, scheduleFinish]);

  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  const runTransition = useCallback(
    (action: () => void, options?: PageTransitionOptions) => {
      if (isTransitioningRef.current) return;

      isTransitioningRef.current = true;
      navigationStartedRef.current = true;
      setIsTransitioning(true);

      startTimeoutRef.current = window.setTimeout(() => {
        action();
        scheduleFinish(
          options?.awaitNavigation === false
            ? PAGE_TRANSITION_DURATION_MS
            : PAGE_TRANSITION_FALLBACK_MS
        );
      }, PAGE_TRANSITION_ACTION_DELAY_MS);
    },
    [scheduleFinish]
  );

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, runTransition }}>
      {children}
      <AnimatePresence>
        {isTransitioning ? (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[9990] overflow-hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: PAGE_TRANSITION_DURATION_MS / 1000, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_55%,rgba(0,0,0,0.46),rgba(0,0,0,0.98)_72%)]"
              initial={{ opacity: 0.35 }}
              animate={{ opacity: 0.92 }}
              exit={{ opacity: 0 }}
              transition={{ duration: PAGE_TRANSITION_DURATION_MS / 1000, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute inset-y-[-18%] left-[-26%] w-[44%] rotate-[7deg] bg-[linear-gradient(90deg,transparent_0%,rgba(177,18,38,0.04)_18%,rgba(177,18,38,0.52)_50%,rgba(177,18,38,0.08)_82%,transparent_100%)] blur-[20px]"
              initial={{ x: '-22%', opacity: 0 }}
              animate={{ x: '238%', opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              className="absolute inset-y-[-8%] left-[-18%] w-[22%] rotate-[7deg] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.02)_30%,rgba(255,255,255,0.18)_52%,rgba(255,255,255,0.03)_72%,transparent_100%)] blur-[10px]"
              initial={{ opacity: 0 }}
              animate={{ x: '320%', opacity: 0.95 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              className="absolute inset-0 bg-[radial-gradient(42%_28%_at_50%_58%,rgba(177,18,38,0.2),transparent_72%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.72 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            />

            <motion.div
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,transparent_14%,transparent_84%,rgba(0,0,0,0.24)_100%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
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
