import type { ReactNode } from "react";
import { Footer } from "@/views/components/Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col text-zinc-100">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[var(--background)]"
      />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
