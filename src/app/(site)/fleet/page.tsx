import { getPublicCars } from "@/controllers/car.controller";
import { FleetView } from "@/views/sections/FleetView";

export const dynamic = "force-dynamic";

export default function FleetPage() {
  return <FleetView cars={getPublicCars()} />;
}
