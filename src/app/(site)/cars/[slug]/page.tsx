import { notFound } from "next/navigation";
import { getPublicCars } from "@/controllers/car.controller";
import { CarDetails } from "@/views/sections/CarDetails";

export const dynamic = "force-dynamic";
type CarDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const { slug } = await params;
  const car = getPublicCars().find((entry) => entry.slug === slug);
  if (!car) notFound();
  return (
    <CarDetails
      car={car}
      returnHref="/#fleet"
      returnLabel="Fleet"
    />
  );
}
