import { notFound } from "next/navigation";
import { getPublicCars } from "@/controllers/car.controller";
import { CarDetails } from "@/views/sections/CarDetails";

export const dynamic = "force-dynamic";
type CarDetailsPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
};

export default async function CarDetailsPage({ params, searchParams }: CarDetailsPageProps) {
  const { slug } = await params;
  const { from } = await searchParams;
  const car = getPublicCars().find((entry) => entry.slug === slug);
  if (!car) notFound();
  const fromHome = from === "home";
  return (
    <CarDetails
      car={car}
      returnHref={fromHome ? "/#fleet" : "/fleet"}
      returnLabel={fromHome ? "Back to home" : "Back to fleet"}
    />
  );
}
