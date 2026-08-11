"use client";

import { type ReactNode } from "react";

type IntroExperienceProps = {
  children: ReactNode;
  sessionKey?: string;
};

export function IntroExperience({
  children,
  sessionKey: _sessionKey,
}: IntroExperienceProps) {
  return <>{children}</>;
}
