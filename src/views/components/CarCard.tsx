"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Car } from "@/models/car.model";
import { formatPrice } from "@/lib/utils";

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  return (
    <motion.article
      className="flex h-full flex-col justify-between rounded-2xl border border-red-900/30 bg-zinc-950/80 p-6"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          {car.brand}
        </p>
        <h3 className="text-2xl font-semibold text-zinc-100">{car.name}</h3>
        <p className="text-sm text-zinc-400">
          {car.year} / {car.bodyType}
        </p>
      </div>
      <div className="mt-6 h-32 rounded-xl border border-red-900/30 bg-radial-gradient(circle_at_top,rgba(220,38,38,0.35),transparent_65%)"></div>
      <div className="mt-6 flex items-center justify-between text-sm text-zinc-400">
        <span className="text-zinc-200">{formatPrice(car.pricePerDay)}</span>
        <span className="text-xs uppercase tracking-[0.2em] text-red-400">
          Per day
        </span>
      </div>
      <Link
        className="mt-6 inline-flex items-center justify-between text-xs uppercase tracking-[0.3em] text-zinc-300 transition-colors hover:text-red-400"
        href={`/cars/${car.slug}`}
      >
        Explore
        <span className="text-red-400">-&gt;</span>
      </Link>
    </motion.article>
  );
}
