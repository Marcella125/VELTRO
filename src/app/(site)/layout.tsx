import type { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col text-zinc-100">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
