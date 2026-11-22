import type { ReactNode } from "react";
import { ScrollTextReveals } from "@/components/scroll-text-reveals";
import { SiteRouteWarmup } from "@/components/site-route-warmup";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-typography relative flex min-h-screen flex-col text-zinc-100">
      <SiteRouteWarmup />
      <ScrollTextReveals />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
