"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { AnimatedSpinner } from "@/components/ui/animated-spinner";

interface PlatinumLoaderProps {
  visible: boolean;
}

export default function PlatinumLoader({
  visible,
}: PlatinumLoaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="platinum-loader"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          role="status"
          aria-live="polite"
          aria-label="Loading Veltro"
        >
          <div className="flex flex-col items-center px-6 pb-safe text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <AnimatedSpinner
                size="7.5rem"
                className="max-sm:[--size:5.75rem]"
              />
            </motion.div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.18,
                duration: 0.45,
              }}
            >
              <Image
                src={assetPath("/icons/veltro_logo.svg")}
                alt="Veltro"
                width={620}
                height={124}
                className="h-auto w-[20rem] object-contain sm:w-[24rem]"
                priority
                unoptimized
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
