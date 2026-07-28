import { carController } from "@/controllers/car.controller";
import { FleetView } from "@/views/sections/FleetView";

export default async function FleetPage() {
  const cars = await carController.getAll();

  return <FleetView cars={cars} />;
}
