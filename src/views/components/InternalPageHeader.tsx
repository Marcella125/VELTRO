"use client";

import { useRef } from "react";
import { SiteHeader } from "@/views/components/SiteHeader";

type InternalPageHeaderProps = {
  title: string;
  isDockOpen: boolean;
  onOpenChange: (next: boolean) => void;
  onSelect: (id: string) => void;
  onLogoClick: () => void;
  className?: string;
  surfaceClassName?: string;
};

export function InternalPageHeader({
  title,
  onOpenChange,
  onLogoClick,
  className,
  surfaceClassName,
}: InternalPageHeaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={containerRef} className={`relative z-40 ${className ?? ""}`}>
      <div className={`relative z-30 ${surfaceClassName ?? ""}`}>
        <SiteHeader
          title={title}
          className={`relative z-30 ${surfaceClassName ?? ""}`}
          onLogoClick={onLogoClick}
          titleTone="light"
          compact
          onMenuOpenChange={onOpenChange}
        />
      </div>
    </div>
  );
}
