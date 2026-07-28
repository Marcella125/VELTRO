"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

type DockItem = {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
};

type TopBarDockProps = {
  onSelect?: (id: DockItem["id"]) => void;
  variant?: "default" | "panel";
};

const items: DockItem[] = [
  { id: "home", label: "Home", icon: assetPath("/icons/Home.svg"), iconColor: "#ffffff" },
  { id: "blogs", label: "Blogs", icon: assetPath("/icons/Acceleration.svg"), iconColor: "#ffffff" },
  { id: "fleet", label: "Fleet", icon: assetPath("/icons/fleet.svg"), iconColor: "#ffffff" },
  { id: "mission", label: "Mission", icon: assetPath("/icons/mission.svg"), iconColor: "#ffffff" },
  { id: "contact", label: "Contact", icon: assetPath("/icons/contactus.svg"), iconColor: "#ffffff" },
  { id: "faq", label: "FAQ", icon: assetPath("/icons/FAQ.svg"), iconColor: "#ffffff" },
];

export function TopBarDock({
  onSelect,
  variant = "default",
}: TopBarDockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const isPanelVariant = variant === "panel";
  const activeIndex = useMemo(() => {
    if (!pathname) return 0;
    if (pathname.startsWith("/blogs")) return items.findIndex((i) => i.id === "blogs");
    if (pathname.startsWith("/fleet")) return items.findIndex((i) => i.id === "fleet");
    if (pathname.startsWith("/mission")) return items.findIndex((i) => i.id === "mission");
    if (pathname.startsWith("/contact")) return items.findIndex((i) => i.id === "contact");
    if (pathname.startsWith("/faq")) return items.findIndex((i) => i.id === "faq");
    if (pathname === "/") return items.findIndex((i) => i.id === "home");
    return 0;
  }, [pathname]);

  const handleSelect = (id: DockItem["id"]) => {
    onSelect?.(id);
  };

  return (
    <div className="relative">
      <div className="mx-auto w-full">
        <div
          className={cn(
            isPanelVariant
              ? "overflow-x-auto no-scrollbar"
              : "sm:mx-0 sm:w-auto",
            "w-full"
          )}
        >
          <div
            className={cn(
              isPanelVariant
                ? "grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:min-h-[112px] lg:items-start lg:justify-center lg:gap-4 xl:gap-6"
                : "grid grid-cols-3 items-stretch gap-0 sm:flex sm:h-24"
            )}
          >
            <div className={cn(isPanelVariant ? "contents lg:flex" : "contents sm:flex")}>
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            const showLabel =
              isPanelVariant
                ? false
                : hoveredIndex !== null
                  ? hoveredIndex === index
                  : isActive && item.id !== "home";

            const panelHovered = hoveredIndex === index;
            const backgroundColor = isPanelVariant
              ? undefined
              : panelHovered
                ? "#b3242d"
                : isActive
                  ? "#242628"
                  : undefined;
            const iconTint = isPanelVariant
              ? isActive
                ? "#b3242d"
                : panelHovered
                  ? "#b3242d"
                  : "#ffffff"
              : item.iconColor;
            const panelTextClassName = isActive
              ? "text-[var(--brand-red)]"
              : panelHovered
                ? "text-[var(--brand-red)]"
                : "text-white/88";

            return (
              <div
                key={item.id}
                className={cn(
                  "relative flex flex-col items-center",
                  isPanelVariant && "min-w-0"
                )}
              >
                <button
                  type="button"
                  className={cn(
                    "relative flex items-center justify-center",
                    isPanelVariant
                      ? cn(
                          "min-h-[112px] w-full min-w-0 flex-col items-center justify-center gap-3 px-4 py-5 text-center transition-[color,background-color,border-color,transform] duration-[var(--transition-normal)] ease-[var(--ease-premium)] hover:text-[var(--brand-red)] sm:min-h-[72px] sm:translate-y-[0.7cm] sm:gap-1 sm:py-0",
                          isActive
                            ? "bg-transparent text-white/88"
                            : panelHovered
                              ? "bg-white/[0.05] text-[var(--brand-red)]"
                            : "bg-transparent text-white/88"
                        )
                      : "h-24 w-full border border-white/10 bg-black/35 sm:h-24 sm:w-24 sm:border-0 sm:bg-transparent"
                  )}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    handleSelect(item.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleSelect(item.id);
                    }
                  }}
                  style={backgroundColor ? { backgroundColor } : undefined}
                >
                  <span
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    style={{
                      backgroundColor: iconTint,
                      WebkitMaskImage: `url(${item.icon})`,
                      maskImage: `url(${item.icon})`,
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                    }}
                    aria-hidden="true"
                  />

                  {isPanelVariant && (
                    <span
                      className={cn(
                        "font-display text-[13px] leading-none tracking-[0.01em] sm:text-[11px]",
                        panelTextClassName
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </button>

                {showLabel && (
                  <motion.span
                    className={cn(
                      "font-display pointer-events-none text-[13px] font-medium tracking-[0.01em] text-white/90",
                      isPanelVariant
                        ? "absolute -bottom-5 hidden lg:block"
                        : "absolute -bottom-5 hidden sm:block"
                    )}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </div>
            );
          })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
