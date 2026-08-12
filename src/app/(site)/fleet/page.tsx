import { cars } from "@/controllers/car.controller";
import { FleetView } from "@/views/sections/FleetView";

export default function FleetPage() {
  return <FleetView cars={cars} />;
}
