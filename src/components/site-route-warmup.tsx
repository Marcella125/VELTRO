"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { primarySiteRoutes, warmupRouteAssets } from "@/lib/site-navigation";

const prefetchedRoutes = new Set<string>();

export function SiteRouteWarmup() {
  const router = useRouter();

  useEffect(() => {
    primarySiteRoutes.forEach((href) => {
      if (prefetchedRoutes.has(href)) return;

      prefetchedRoutes.add(href);
      router.prefetch(href);
      warmupRouteAssets(href);
    });
  }, [router]);

  return null;
}
