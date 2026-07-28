"use client";

import { motion } from "framer-motion";

type HamburgerProps = {
  onClick?: () => void;
};

export function Hamburger({ onClick }: HamburgerProps) {
  return (
    <motion.button
      type="button"
      className="group relative flex h-6 w-6 items-center justify-center bg-transparent"
      onClick={onClick}
      whileHover={{
        scale: 1.04,
      }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <span className="sr-only">Open menu</span>
      <motion.span
        className="flex flex-col items-start gap-1.5"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        {[
          { width: "w-6", shade: "bg-white/90", offset: 2 },
          { width: "w-5", shade: "bg-white/90", offset: -2 },
          { width: "w-4", shade: "bg-white/90", offset: 2 },
        ].map((line, index) => (
          <motion.span
            key={line.width}
            className={`h-0.5 ${line.width} rounded-full ${line.shade}`}
            variants={{
              rest: { x: 0 },
              hover: { x: line.offset },
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 16,
              delay: index * 0.05,
            }}
          />
        ))}
      </motion.span>
    </motion.button>
  );
}
