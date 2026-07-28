"use client";

import { assetPath } from "@/lib/asset-path";

const ENABLE_TEMP_HYPERSPEED_AUDIO = true;
const INTRO_AUDIO_SRC = assetPath("/Intro%20Sound.mp3");

let introAudio: HTMLAudioElement | null = null;
let activePlayback:
  | {
      audio: HTMLAudioElement;
      done: Promise<void>;
      resolveDone: () => void;
      endedHandler: () => void;
    }
  | null = null;

function getIntroAudio() {
  if (typeof window === "undefined" || !ENABLE_TEMP_HYPERSPEED_AUDIO) {
    return null;
  }

  if (!introAudio) {
    introAudio = new Audio(INTRO_AUDIO_SRC);
    introAudio.preload = "auto";
    introAudio.volume = 0.9;
  }

  return introAudio;
}

function clearActivePlayback(playback: typeof activePlayback) {
  if (!playback) return;
  playback.audio.removeEventListener("ended", playback.endedHandler);
  if (activePlayback === playback) {
    activePlayback = null;
  }
  playback.resolveDone();
}

export function stopHyperspeedAudioDemo() {
  if (!activePlayback) return;

  activePlayback.audio.pause();
  activePlayback.audio.currentTime = 0;
  clearActivePlayback(activePlayback);
}

export function stopExistingTypingAudio() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent("platinum:stop-typing-audio"));
}

export function isHyperspeedAudioDemoPlaying() {
  return activePlayback !== null;
}

export async function playHyperspeedAudioDemo(
  _durationMs = 4600
): Promise<void> {
  if (!ENABLE_TEMP_HYPERSPEED_AUDIO) {
    return;
  }

  if (activePlayback) {
    return activePlayback.done;
  }

  const audio = getIntroAudio();
  if (!audio) {
    return;
  }

  stopExistingTypingAudio();

  audio.pause();
  audio.currentTime = 0;

  let resolveDone: (() => void) | null = null;
  const done = new Promise<void>((resolve) => {
    resolveDone = resolve;
  });

  const endedHandler = () => {
    if (activePlayback?.audio === audio) {
      clearActivePlayback(activePlayback);
    }
  };

  activePlayback = {
    audio,
    done,
    resolveDone: () => resolveDone?.(),
    endedHandler,
  };

  audio.addEventListener("ended", endedHandler, { once: false });

  try {
    await audio.play();
  } catch {
    clearActivePlayback(activePlayback);
  }

  return done;
}

export { ENABLE_TEMP_HYPERSPEED_AUDIO };
