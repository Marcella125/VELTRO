import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/asset-path";

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

export function Footer() {
  return (
    <footer className="site-footer border-t border-white/8 bg-black/92">
      <div className="mx-auto flex max-w-350 items-center justify-center px-6 py-5 sm:px-10 sm:py-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-white/82 sm:gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                target={item.href !== "#" ? "_blank" : undefined}
                rel={item.href !== "#" ? "noreferrer" : undefined}
                className="transition hover:opacity-100"
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={16}
                  height={16}
                  className="h-4 w-4 object-contain opacity-90"
                  unoptimized
                />
              </Link>
            ))}
          </div>
          <span className="hidden h-4 w-px bg-white/18 sm:block" />
          <p className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-white/68 sm:text-[12px]">
            {"\u00A9"} 2026 Platinum. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
