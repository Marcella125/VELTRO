"use client";

import { usePageTransitionContext } from "@/components/page-transition-provider";

export function usePageTransition() {
  const { isTransitioning, runTransition } = usePageTransitionContext();

  return {
    isTransitioning,
    overlay: null,
    runTransition,
  };
}
