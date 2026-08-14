import type { ReactNode } from "react";
import { SiteRouteWarmup } from "@/components/site-route-warmup";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col text-zinc-100">
      <SiteRouteWarmup />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
