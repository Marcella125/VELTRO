import { notFound } from "next/navigation";
import { cars } from "@/controllers/car.controller";
import { CarDetails } from "@/views/sections/CarDetails";

export const dynamicParams = false;

export function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

type CarDetailsPageProps = { params: Promise<{ slug: string }> };

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const { slug } = await params;
  const car = cars.find((entry) => entry.slug === slug);
  if (!car) notFound();
  return <CarDetails car={car} />;
}
