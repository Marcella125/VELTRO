"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function TrackHudFooter() {
  return (
    <footer className="bg-linear-to-b from-[#8f1b23] via-[#b3242d] to-[#7a161d] text-white">
      <div className="h-px w-full bg-white/10" />
      <div className="mx-auto w-full max-w-400 px-6 py-6 lg:px-16">
        <div className="grid gap-6 text-center md:grid-cols-3 md:items-center md:text-left">
          <div>
            <div className="text-[14px] font-semibold tracking-[0.12em]">Platinum</div>
            <div className="mt-2 text-[11px] tracking-[0.08em] text-white/80">
              Luxury Performance Rentals
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-[0.2em] text-white/85 md:justify-center">
            <Link
              href="/"
              className="transition hover:text-white hover:underline hover:decoration-white/40"
            >
              Home
            </Link>
            <span className="text-white/40">&#8226;</span>
            <Link
              href="/fleet"
              className="transition hover:text-white hover:underline hover:decoration-white/40"
            >
              Fleet
            </Link>
            <span className="text-white/40">&#8226;</span>
            <Link
              href="/contact"
              className="transition hover:text-white hover:underline hover:decoration-white/40"
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col items-center gap-2 text-[11px] tracking-[0.08em] text-white/85 md:items-end">
            <motion.a
              href="https://wa.me/96170335113"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
              whileHover={{ scale: 1.05 }}
            >
              WhatsApp: +961 70 335 113
            </motion.a>
            <motion.a
              href="mailto:info@platinumrentals.com"
              className="transition hover:text-white"
              whileHover={{ scale: 1.05 }}
            >
              info@platinumrentals.com
            </motion.a>
          </div>
        </div>

        <div className="mt-6 text-center text-[10px] tracking-widest text-white/70">
          Platinum all rights reserved (c) 2026
        </div>
      </div>
    </footer>
  );
}
