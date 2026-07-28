"use client";

import { type ReactNode } from "react";
import { ExperienceTransition } from "@/components/experience-transition";

type IntroExperienceProps = {
  children: ReactNode;
  sessionKey?: string;
};

export function IntroExperience({
  children,
  sessionKey,
}: IntroExperienceProps) {
  return (
    <ExperienceTransition sessionKey={sessionKey}>
      {children}
    </ExperienceTransition>
  );
}
