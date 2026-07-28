"use client";
import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/asset-path";
import { MenuWordToggle } from "@/views/components/MenuWordToggle";

type SiteHeaderProps = {
  title: string;
  isDockOpen: boolean;
  onToggle: (next: boolean) => void;
  className?: string;
  onLogoClick?: () => void;
  hideTitleOnMobile?: boolean;
  titleTone?: "light" | "dark";
  menuTone?: "light" | "dark";
  compact?: boolean;
};

export function SiteHeader({
  title,
  isDockOpen,
  onToggle,
  className,
  onLogoClick,
  hideTitleOnMobile,
  titleTone = "light",
  menuTone = "light",
  compact = false,
}: SiteHeaderProps) {
  const shouldHideTitle = hideTitleOnMobile ?? true;
  const homeHref = "/";
  const titleClassName =
    titleTone === "dark" ? "text-[#111111]/84" : "text-white/68";

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-transparent ${
        className ?? ""
      }`}
    >
      <div
        className={`relative mx-auto w-full max-w-350 ${
          compact ? "h-13 sm:h-14" : "h-14 sm:h-16"
        }`}
      >
        <Link
          href={homeHref}
          aria-label="Platinum home"
          className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center"
          onClick={(event) => {
            if (!onLogoClick) return;
            event.preventDefault();
            onLogoClick();
          }}
        >
          <Image
            src={assetPath("/icons/Platinumlogo.svg")}
            alt="Platinum"
            width={120}
            height={24}
            className={`w-auto object-contain ${
              compact ? "h-4.5 sm:h-5" : "h-5"
            }`}
            priority
            unoptimized
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <h1
            className={`type-nav ${titleClassName} ${
              compact ? "text-[15px]" : ""
            } ${
              shouldHideTitle ? "hidden sm:block" : ""
            }`}
          >
            {title}
          </h1>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <MenuWordToggle
            open={isDockOpen}
            onToggle={onToggle}
            tone={menuTone}
            className={compact ? "size-10" : undefined}
          />
        </div>
      </div>
    </header>
  );
}
