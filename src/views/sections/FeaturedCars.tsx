"use client";

import { motion } from "framer-motion";
import { Car } from "@/models/car.model";
import { CarCard } from "@/views/components/CarCard";

type FeaturedCarsProps = {
  cars: Car[];
};

export function FeaturedCars({ cars }: FeaturedCarsProps) {
  const featured = cars.slice(0, 3);

  return (
    <section className="mt-16 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-500">
            Featured
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-100">
            Signature fleet
          </h2>
          <p className="mt-3 max-w-xl text-sm text-zinc-400">
            Hand-selected icons for cinematic arrivals.
          </p>
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
            transition: { staggerChildren: 0.12 },
          },
        }}
      >
        {featured.map((car) => (
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
