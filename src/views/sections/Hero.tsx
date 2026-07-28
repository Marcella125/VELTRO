"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Car } from "@/models/car.model";
import { CarCard } from "@/views/components/CarCard";

type HeroProps = {
  cars: Car[];
  tagline: string;
};

export function Hero({ cars, tagline }: HeroProps) {
  const showcase = cars.slice(0, 2);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-red-900/40 bg-zinc-950/80 p-12">
      <div
        className="absolute -right-32 -top-40 h-80 w-80 rounded-full bg-red-900/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative z-10 grid grid-cols-12 gap-10">
        <motion.div
          className="col-span-7 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-red-500">
            Platinum collection
          </p>
          <h1 className="text-5xl font-semibold leading-tight text-zinc-100">
            Arrive in silence. Leave an impression.
          </h1>
          <p className="max-w-xl text-base text-zinc-400">{tagline}</p>
          <div className="flex items-center gap-6">
            <Link
              href="/fleet"
              className="inline-flex items-center gap-3 rounded-full border border-red-600/60 bg-red-600/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-red-200 transition hover:bg-red-600/20"
            >
              Reserve now
              <span>-&gt;</span>
            </Link>
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Chauffeur optional
            </span>
          </div>
        </motion.div>
        <motion.div
          className="col-span-5 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          {showcase.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
