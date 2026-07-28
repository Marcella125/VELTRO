import { carController } from "@/controllers/car.controller";
import { CarDetails } from "@/views/sections/CarDetails";

export const dynamicParams = false;

export async function generateStaticParams() {
  const cars = await carController.getAll();
  return cars.map((car) => ({ slug: car.slug }));
}

type CarDetailsPageProps = {
  params: { slug: string };
};

export default function CarDetailsPage(_props: CarDetailsPageProps) {
  return <CarDetails />;
}
