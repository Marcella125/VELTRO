import { cars } from "@/controllers/car.controller";
import { FleetAllView } from "@/views/sections/FleetAllView";

export default function FleetAllPage() {
  return <FleetAllView cars={cars} />;
}
