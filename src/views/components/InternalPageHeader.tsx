"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SiteHeader } from "@/views/components/SiteHeader";
import { TopBarDock } from "@/views/components/TopBarDock";

type InternalPageHeaderProps = {
  title: string;
  isDockOpen: boolean;
  onOpenChange: (next: boolean) => void;
  onSelect: (id: string) => void;
  onLogoClick: () => void;
  className?: string;
};

export function InternalPageHeader({
  title,
  isDockOpen,
  onOpenChange,
  onSelect,
  onLogoClick,
  className,
}: InternalPageHeaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isDockOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isDockOpen, onOpenChange]);

  const handleSelect = (id: string) => {
    onOpenChange(false);
    onSelect(id);
  };

  return (
    <div ref={containerRef} className={`relative z-40 ${className ?? ""}`}>
      <div className="relative z-30">
        <SiteHeader
          title={title}
          isDockOpen={isDockOpen}
          onToggle={onOpenChange}
          className="relative z-30"
          onLogoClick={onLogoClick}
          menuTone="light"
          titleTone="light"
          compact
        />
        <div className="mt-3 h-px w-full bg-white/6" />
      </div>

      <AnimatePresence initial={false}>
        {isDockOpen ? (
          <motion.div
            key="internal-page-dock"
            className="absolute inset-x-0 top-full z-20 overflow-hidden border-x border-b border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.92)_0%,rgba(20,9,11,0.94)_100%)] shadow-[0_22px_44px_rgba(0,0,0,0.34)] backdrop-blur-xl"
            initial={{ opacity: 0, y: -10, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-2 pb-1 pt-2 sm:px-3">
              <TopBarDock variant="panel" onSelect={handleSelect} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
