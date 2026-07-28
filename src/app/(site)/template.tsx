"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PAGE_TRANSITION_DURATION_MS } from "@/components/page-transition-provider";

export default function SiteTemplate({ children }: { children: ReactNode }) {
  useReducedMotion();

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, ease: "linear" }}
    >
      {children}
    </motion.div>
  );
}
