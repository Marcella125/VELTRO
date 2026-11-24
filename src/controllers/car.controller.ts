import "server-only";
import { getPublicInventory } from "@/lib/database";
import type { Car } from "@/models/car.model";

type PublicCarRow = {
  id: string; slug: string; name: string; brand: string; year: number; bodyType: string;
  purchasePrice: number; pricePerDay: number; currency: string; image: string; featured: number; status: Car["status"];
  transmission: string; engine: string; horsepower: number; description: string;
  exteriorColor: string; interiorColor: string;
};

function mapPublicCar(row: PublicCarRow): Car {
  return {
    id: row.id, slug: row.slug, name: row.name, brand: row.brand, year: row.year,
    bodyType: row.bodyType, purchasePrice: Math.max(1, Number(row.purchasePrice)),
    pricePerDay: Math.max(1, Number(row.pricePerDay)), currency: row.currency || "USD",
    image: row.image, featured: Boolean(row.featured), status: row.status,
    transmission: row.transmission, engine: row.engine, horsepower: row.horsepower,
    description: row.description, exteriorColor: row.exteriorColor, interiorColor: row.interiorColor,
    specs: [
      { label: "Power", value: `${row.horsepower} hp` },
      { label: "Transmission", value: row.transmission },
      { label: "Interior", value: row.interiorColor },
      { label: "Engine", value: row.engine },
    ],
  };
}

export function getPublicCars(): Car[] {
  return (getPublicInventory() as unknown as PublicCarRow[]).map(mapPublicCar);
}

export const carController = {
  getAll: async () => getPublicCars(),
  getFeatured: async () => getPublicCars().filter((car) => car.featured),
  getBySlug: async (slug: string) => getPublicCars().find((car) => car.slug === slug) ?? null,
};
