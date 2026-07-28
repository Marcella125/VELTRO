"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type HamburgerToggleProps = {
  open?: boolean;
  onToggle?: (next: boolean) => void;
  className?: string;
  size?: number;
  strokeWidth?: number;
};

const lineVariants = {
  closed: {
    opacity: 1,
  },
  open: {
    opacity: 1,
  },
};

export function HamburgerToggle({
  open,
  onToggle,
  className,
  size = 24,
  strokeWidth = 2,
}: HamburgerToggleProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const hitSize = Math.max(44, size + 20);

  const handleToggle = () => {
    const next = !isOpen;
    if (!isControlled) {
      setInternalOpen(next);
    }
    onToggle?.(next);
  };

  const linePositions = useMemo(() => {
    const pad = size * 0.2;
    const yTop = pad + strokeWidth;
    const yMid = size / 2;
    const yBot = size - pad - strokeWidth;
    return { yTop, yMid, yBot };
  }, [size, strokeWidth]);

  return (
    <motion.button
      type="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      onClick={handleToggle}
      className={`group inline-flex items-center justify-center rounded-full text-white ${className ?? ""}`}
      style={{ width: hitSize, height: hitSize }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 8px 20px rgba(255,255,255,0.15)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        className="text-white/95"
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        <motion.line
          x1={strokeWidth}
          x2={size - strokeWidth}
          y1={linePositions.yTop}
          y2={linePositions.yTop}
          variants={lineVariants}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          transform-origin="center"
          animate={
            isOpen
              ? {
                  rotate: 45,
                  y: linePositions.yMid - linePositions.yTop,
                }
              : { rotate: 0, y: 0 }
          }
        />
        <motion.line
          x1={strokeWidth}
          x2={size - strokeWidth}
          y1={linePositions.yMid}
          y2={linePositions.yMid}
          transition={{ duration: 0.2, ease: "easeOut" }}
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transform-origin="center"
        />
        <motion.line
          x1={strokeWidth}
          x2={size - strokeWidth}
          y1={linePositions.yBot}
          y2={linePositions.yBot}
          variants={lineVariants}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          transform-origin="center"
          animate={
            isOpen
              ? {
                  rotate: -45,
                  y: linePositions.yMid - linePositions.yBot,
                }
              : { rotate: 0, y: 0 }
          }
        />
      </motion.svg>
    </motion.button>
  );
}
