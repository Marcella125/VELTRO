"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { primarySiteRoutes, warmupRouteAssets } from "@/lib/site-navigation";
import { FullscreenMenu } from "@/views/components/FullscreenMenu";
import { HamburgerToggle } from "@/views/components/HamburgerToggle";

type SiteHeaderProps = {
  title: string;
  className?: string;
  onLogoClick?: () => void;
  onSelect?: (id: string) => void;
  hideTitleOnMobile?: boolean;
  titleTone?: "light" | "dark";
  compact?: boolean;
  menuOpen?: boolean;
  onMenuOpenChange?: (next: boolean) => void;
};

export function SiteHeader({
  title,
  className,
  onLogoClick,
  onSelect,
  hideTitleOnMobile,
  titleTone = "light",
  compact = false,
  menuOpen,
  onMenuOpenChange,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isMenuControlled = menuOpen !== undefined;
  const isMenuOpen = isMenuControlled ? menuOpen : internalMenuOpen;
  const homeHref = "/";
  const titleClassName =
    titleTone === "dark" ? "text-[#111111]/84" : "text-white/80";
  const navItems = [
    { href: "/", label: "Home", active: pathname === "/" },
    { href: "/fleet", label: "Fleet", active: pathname?.startsWith("/fleet") },
    { href: "/blogs", label: "Blogs", active: pathname?.startsWith("/blogs") },
    { href: "/mission", label: "Mission", active: pathname?.startsWith("/mission") },
    {
      href: "/contact",
      label: "Contact",
      active: pathname?.startsWith("/contact"),
    },
    { href: "/faq", label: "FAQ", active: pathname?.startsWith("/faq") },
  ];

  useEffect(() => {
    primarySiteRoutes.forEach((href) => {
      router.prefetch(href);
    });
  }, [router]);

  const prepareRoute = (href: string) => {
    router.prefetch(href);
    warmupRouteAssets(href);
  };

  const handleMenuOpenChange = (next: boolean) => {
    if (!isMenuControlled) {
      setInternalMenuOpen(next);
    }
    onMenuOpenChange?.(next);
  };

  const handleMenuSelect = (id: string) => {
    handleMenuOpenChange(false);
    onSelect?.(id);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-transparent ${
          className ?? ""
        }`}
      >
        <div
          className={`relative mx-auto w-full max-w-350 ${
            compact ? "h-12 sm:h-13" : "h-14 sm:h-16"
          }`}
        >
          <Link
            href={homeHref}
            aria-label="Veltro home"
            className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center"
            onClick={(event) => {
              if (!onLogoClick) return;
              event.preventDefault();
              onLogoClick();
            }}
          >
            <Image
              src={assetPath("/icons/veltro_logo.svg")}
              alt="Veltro"
              width={680}
              height={136}
              className={`w-auto object-contain ${
                compact ? "h-14 sm:h-15" : "h-22"
              }`}
              priority
              unoptimized
            />
          </Link>
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex">
            <div
              className={`pointer-events-auto ${
                isMenuOpen ? "flex" : "hidden"
              } items-center gap-6 transition-[opacity,visibility] duration-200 ${
                isMenuOpen
                  ? "visible opacity-100"
                  : "invisible opacity-0"
              }`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => prepareRoute(item.href)}
                  onFocus={() => prepareRoute(item.href)}
                  className={`group flex flex-col items-center transition-transform duration-200 ${
                    isMenuOpen ? "translate-y-0" : "-translate-y-1"
                  }`}
                >
                  <span
                    className={`font-display ${
                      compact ? "text-[0.64rem]" : "text-[0.72rem]"
                    } uppercase tracking-[0.12em] transition ${
                      item.active
                        ? "text-white"
                        : `${titleClassName} group-hover:text-white`
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`mt-1 h-px transition ${
                      item.active
                        ? "w-[2.6rem] bg-[var(--brand-red)]"
                        : "w-0 bg-[var(--brand-red)]"
                    }`}
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <HamburgerToggle
              open={isMenuOpen}
              onToggle={handleMenuOpenChange}
              size={compact ? 22 : 24}
              strokeWidth={1.8}
              className={compact ? "h-10 w-10 rounded-none" : "h-11 w-11 rounded-none"}
            />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen ? (
          <div className="sm:hidden">
            <FullscreenMenu
              onClose={() => handleMenuOpenChange(false)}
              onSelect={handleMenuSelect}
            />
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
