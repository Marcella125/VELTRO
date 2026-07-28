"use client";

import { IntroExperience } from "@/components/intro/intro-experience";
import { HeroShowcase } from "@/views/sections/HeroShowcase";

export function HomeExperience() {
  return (
    <IntroExperience sessionKey="platinum-home-intro-complete">
      <HeroShowcase />
    </IntroExperience>
  );
}
