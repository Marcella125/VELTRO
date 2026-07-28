"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PlatinumLoader from "@/components/platinum-loader";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";

const MINIMUM_DURATION = 800;
const MAXIMUM_DURATION = 3000;

export default function AppLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [shouldBypassLoader, setShouldBypassLoader] = useState(() => {
    if (pathname !== "/") return false;
    if (typeof window === "undefined") return true;
    return (
      sessionStorage.getItem("platinum-home-intro-complete") !== "true"
    );
  });

  useEffect(() => {
    if (pathname !== "/") {
      setShouldBypassLoader(false);
      return;
    }

    setShouldBypassLoader(
      sessionStorage.getItem("platinum-home-intro-complete") !== "true"
    );
  }, [pathname]);

  useEffect(() => {
    if (shouldBypassLoader) return;

    const startedAt = performance.now();
    let minimumTimer: ReturnType<typeof setTimeout> | undefined;
    const fallbackTimer: ReturnType<typeof setTimeout> = setTimeout(() => {
      setVisible(false);
    }, MAXIMUM_DURATION);

    const hideLoader = () => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, MINIMUM_DURATION - elapsed);

      minimumTimer = setTimeout(() => {
        setVisible(false);
      }, remaining);
    };

    const waitForPage = async () => {
      try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }

        if (document.readyState === "complete") {
          hideLoader();
          return;
        }

        window.addEventListener("load", hideLoader, {
          once: true,
        });
      } catch {
        hideLoader();
      }
    };

    void waitForPage();

    return () => {
      if (minimumTimer) clearTimeout(minimumTimer);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      window.removeEventListener("load", hideLoader);
    };
  }, [shouldBypassLoader]);

  useEffect(() => {
    if (!visible) return;

    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [visible]);

  useEffect(() => {
    document.body.dataset.appLoading =
      !shouldBypassLoader && visible ? "true" : "false";

    return () => {
      delete document.body.dataset.appLoading;
    };
  }, [shouldBypassLoader, visible]);

  return <PlatinumLoader visible={!shouldBypassLoader && visible} />;
}
