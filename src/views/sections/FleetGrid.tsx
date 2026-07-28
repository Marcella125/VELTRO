"use client";

import { motion } from "framer-motion";
import { Car } from "@/models/car.model";
import { CarCard } from "@/views/components/CarCard";

type FleetGridProps = {
  cars: Car[];
  title?: string;
  subtitle?: string;
};

export function FleetGrid({
  cars,
  title = "Fleet",
  subtitle = "Signature vehicles tailored for decisive arrivals.",
}: FleetGridProps) {
  return (
    <section className="mt-16 space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-500">
            Collection
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-100">
            {title}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-zinc-400">{subtitle}</p>
        </div>
      </div>
      <motion.div
        className="grid grid-cols-12 gap-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {cars.map((car) => (
          <motion.div
            key={car.id}
            className="col-span-4"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <CarCard car={car} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
