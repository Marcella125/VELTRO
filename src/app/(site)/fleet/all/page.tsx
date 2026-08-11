import { carController } from "@/controllers/car.controller";
import { FleetAllView } from "@/views/sections/FleetAllView";

export default async function FleetAllPage() {
  const cars = await carController.getAll();

  return <FleetAllView cars={cars} />;
}
