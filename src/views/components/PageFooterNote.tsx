"use client";

import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/asset-path";

type PageFooterNoteProps = {
  mobileClassName?: string;
  desktopClassName?: string;
  showDesktop?: boolean;
  mobilePlacement?: "fixed" | "static";
  mobileSurfaceClassName?: string;
  mobileSize?: "default" | "compact";
};

const socialLinks = [
  {
    href: "https://www.instagram.com/platinumeditionofficial?igsh=MTJ4bzNjeWk2cDZoYQ%3D%3D",
    label: "Instagram",
    icon: assetPath("/icons/instagram.svg"),
  },
  {
    href: "https://www.tiktok.com/@platinumeditionofficial?_r=1&_t=ZS-92Jxmr9Bg5S",
    label: "TikTok",
    icon: assetPath("/icons/tiktok.svg"),
  },
  {
    href: "#",
    label: "X",
    icon: assetPath("/icons/X.svg"),
  },
];

export function PageFooterNote({
  mobileClassName,
  desktopClassName,
  showDesktop = true,
  mobilePlacement = "fixed",
  mobileSurfaceClassName,
  mobileSize = "default",
}: PageFooterNoteProps) {
  const useCompactMobileSize = mobileSize === "compact";
  const mobilePlacementClassName =
    mobilePlacement === "static"
      ? useCompactMobileSize
        ? "relative left-auto bottom-auto w-full max-w-none translate-x-0 flex-col items-center justify-center gap-1 whitespace-normal px-6 py-2 text-center"
        : "relative left-auto bottom-auto min-h-[68px] w-full max-w-none translate-x-0 flex-col items-center justify-center gap-1 whitespace-normal px-6 py-3 text-center"
      : "fixed bottom-[calc(1.6vh-0.25cm)] left-1/2 w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-3 whitespace-nowrap";

  return (
    <>
      <div
        className={`page-footer-note z-30 flex text-[9px] text-white/68 sm:hidden ${mobilePlacementClassName} ${
          mobileSurfaceClassName ?? ""
        } ${
          mobileClassName ?? ""
        }`}
      >
        <div
          className={`flex items-center ${
            useCompactMobileSize ? "gap-2.5" : mobilePlacement === "static" ? "gap-4" : "gap-2.5"
          }`}
        >
          {socialLinks.map((item) => (
            <Link
              key={`mobile-${item.label}`}
              href={item.href}
              aria-label={item.label}
              target={item.href !== "#" ? "_blank" : undefined}
              rel={item.href !== "#" ? "noreferrer" : undefined}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={16}
                height={16}
                className={`object-contain opacity-90 ${
                  useCompactMobileSize
                    ? "h-[16px] w-[16px]"
                    : mobilePlacement === "static"
                    ? "h-[17px] w-[17px]"
                    : "h-[16px] w-[16px]"
                }`}
                unoptimized
              />
            </Link>
          ))}
        </div>
        <p
          className={`font-body font-medium text-white/62 ${
            useCompactMobileSize
              ? "whitespace-nowrap text-[9px] tracking-[0.17em]"
              : mobilePlacement === "static"
              ? "whitespace-normal text-[8.5px] tracking-[0.22em]"
              : "whitespace-nowrap text-[9px] tracking-[0.17em]"
          }`}
        >
          {"\u00A9"} 2026 Veltro. All rights reserved.
        </p>
      </div>
      {showDesktop ? (
        <div
          className={`page-footer-note fixed bottom-[calc(3.1vh-0.4cm)] left-1/2 z-30 hidden w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3.5 whitespace-nowrap text-white/68 sm:flex ${
            desktopClassName ?? ""
          }`}
        >
          <div className="flex items-center gap-3">
            {socialLinks.map((item) => (
              <Link
                key={`desktop-${item.label}`}
                href={item.href}
                aria-label={item.label}
                target={item.href !== "#" ? "_blank" : undefined}
                rel={item.href !== "#" ? "noreferrer" : undefined}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={12}
                  height={12}
                className="h-[12px] w-[12px] object-contain opacity-90"
                unoptimized
              />
              </Link>
            ))}
          </div>
          <span className="h-4 w-px bg-white/16" />
          <p className="font-body whitespace-nowrap text-[9.5px] font-medium tracking-[0.17em] text-white/62">
            {"\u00A9"} 2026 Veltro. All rights reserved.
          </p>
        </div>
      ) : null}
    </>
  );
}
