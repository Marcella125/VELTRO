"use client";

import { useEffect, useRef } from "react";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";

export function useOverlayBehavior(isOpen: boolean, onClose: () => void) {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    lockBodyScroll();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unlockBodyScroll();

      const focusTarget = previouslyFocusedRef.current;
      if (focusTarget) {
        window.requestAnimationFrame(() => focusTarget.focus());
      }
    };
  }, [isOpen, onClose]);
}
