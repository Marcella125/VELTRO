import { StaticRentalExperience } from "@/views/sections/StaticRentalExperience";
import type { Car } from "@/models/car.model";

export function HomeExperience({ cars }: { cars: Car[] }) {
  return <StaticRentalExperience cars={cars} />;
}
