import { HomeExperience } from "@/views/sections/HomeExperience";
import { getPublicCars } from "@/controllers/car.controller";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return <HomeExperience cars={getPublicCars()} />;
}
