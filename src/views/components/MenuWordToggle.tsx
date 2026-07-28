"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MenuWordToggleProps = {
  open?: boolean;
  onToggle?: (next: boolean) => void;
  className?: string;
  tone?: "light" | "dark";
};

export function MenuWordToggle({
  open,
  onToggle,
  className,
  tone = "light",
}: MenuWordToggleProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const isDarkTone = tone === "dark";
  const lineClassName = isDarkTone ? "bg-[#111111]" : "bg-white/90";

  const handleToggle = () => {
    const next = !isOpen;
    if (!isControlled) {
      setInternalOpen(next);
    }
    onToggle?.(next);
  };

  return (
    <motion.button
      type="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      onClick={handleToggle}
      className={cn(
        isOpen
          ? isDarkTone
            ? "group inline-flex size-11 items-center justify-center border border-transparent bg-transparent text-[#111111] transition-[border-color,background-color,box-shadow,transform] duration-[var(--transition-normal)] ease-[var(--ease-premium)] hover:border-black/18 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#dedede]"
            : "group inline-flex size-11 items-center justify-center border border-transparent bg-transparent text-white/95 transition-[border-color,background-color,box-shadow,transform] duration-[var(--transition-normal)] ease-[var(--ease-premium)] hover:border-[var(--border-subtle)] hover:bg-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          : isDarkTone
            ? "group inline-flex size-11 items-center justify-center border border-black/8 bg-transparent text-[#111111] transition-[border-color,background-color,box-shadow,transform] duration-[var(--transition-normal)] ease-[var(--ease-premium)] hover:border-black/18 hover:bg-black/[0.04]"
            : "group inline-flex size-11 items-center justify-center border border-transparent bg-transparent text-white/95 transition-[border-color,background-color,box-shadow,transform] duration-[var(--transition-normal)] ease-[var(--ease-premium)] hover:border-[var(--border-subtle)] hover:bg-black/25",
        className
      )}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
    >
      <div className="relative h-4 w-5">
        <motion.span
          className={cn("absolute left-0 top-1/2 h-0.5 w-5 rounded-full", lineClassName)}
          initial={false}
          animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className={cn("absolute left-0 top-1/2 h-0.5 w-5 rounded-full", lineClassName)}
          initial={false}
          animate={isOpen ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className={cn("absolute left-0 top-1/2 h-0.5 w-5 rounded-full", lineClassName)}
          initial={false}
          animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.button>
  );
}
