"use client";

import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/asset-path";

type PageFooterNoteProps = {
  mobileClassName?: string;
  desktopClassName?: string;
  showDesktop?: boolean;
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
}: PageFooterNoteProps) {
  return (
    <>
      <div
        className={`page-footer-note fixed bottom-[calc(2.2vh-0.25cm)] left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 text-[10px] text-white/68 sm:hidden ${
          mobileClassName ?? ""
        }`}
      >
        <div className="flex items-center gap-3">
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
                width={14}
                height={14}
                className="h-3.5 w-3.5 object-contain opacity-90"
                unoptimized
              />
            </Link>
          ))}
        </div>
        <span className="h-3.5 w-px bg-white/16" />
        <p className="font-body font-medium uppercase tracking-[0.2em] text-white/62">
          {"\u00A9"} 2026 Platinum. All rights reserved.
        </p>
      </div>
      {showDesktop ? (
        <div
          className={`page-footer-note fixed bottom-[calc(4vh-0.4cm)] left-1/2 z-30 hidden -translate-x-1/2 items-center gap-4 text-white/68 sm:flex ${
            desktopClassName ?? ""
          }`}
        >
          <div className="flex items-center gap-4">
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
                  width={15}
                  height={15}
                  className="h-[15px] w-[15px] object-contain opacity-90"
                  unoptimized
                />
              </Link>
            ))}
          </div>
          <span className="h-4 w-px bg-white/16" />
          <p className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-white/62">
            {"\u00A9"} 2026 Platinum. All rights reserved.
          </p>
        </div>
      ) : null}
    </>
  );
}
