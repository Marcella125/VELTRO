"use client";

import { AnimatePresence } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import { Hyperspeed } from "@/components/ui/hyperspeed";
import {
  playHyperspeedAudioDemo,
  stopHyperspeedAudioDemo,
} from "@/lib/hyperspeed-audio-demo";

type IntroExperienceProps = {
  children: ReactNode;
};

type IntroStage = "hyperspeed" | "done";

export function IntroExperience({
  children,
}: IntroExperienceProps) {
  const [stage, setStage] = useState<IntroStage>("hyperspeed");

  useEffect(() => {
    if (stage !== "hyperspeed") return;

    void playHyperspeedAudioDemo();

    return () => {
      stopHyperspeedAudioDemo();
    };
  }, [stage]);

  return (
    <>
      {children}
      <AnimatePresence>
        {stage === "hyperspeed" ? (
          <div className="fixed inset-0 z-[9998]">
            <Hyperspeed
              duration={4200}
              effectOptions={{
                fovSpeedUp: 210,
                speedUp: 3.2,
                movingAwaySpeed: [85, 110],
                movingCloserSpeed: [-170, -220],
              }}
              showLogoOverlay
              onComplete={() => setStage("done")}
            />
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
