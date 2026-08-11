"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { assetPath } from "@/lib/asset-path";
import { HamburgerToggle } from "@/views/components/HamburgerToggle";

type FullscreenMenuProps = {
  onClose: () => void;
  onSelect: (id: string) => void;
};

const menuEntries = [
  { id: "home", order: "01", label: "Home" },
  { id: "fleet", order: "02", label: "Fleet" },
  { id: "blogs", order: "03", label: "Blogs" },
  { id: "mission", order: "04", label: "Mission" },
  { id: "contact", order: "05", label: "Contact" },
  { id: "faq", order: "06", label: "FAQ" },
];

export function FullscreenMenu({ onClose, onSelect }: FullscreenMenuProps) {
  const pathname = usePathname();

  const activeId = (() => {
    if (!pathname) return "home";
    if (pathname.startsWith("/fleet")) return "fleet";
    if (pathname.startsWith("/blogs")) return "blogs";
    if (pathname.startsWith("/mission")) return "mission";
    if (pathname.startsWith("/contact")) return "contact";
    if (pathname.startsWith("/faq")) return "faq";
    return "home";
  })();

  return (
    <motion.div
      className="fixed inset-0 z-[120] overflow-hidden bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0">
        <Image
          src={assetPath("/Menu bg.png")}
          alt=""
          fill
          priority
          quality={100}
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex h-full flex-col pb-6 sm:pb-8">
        <div className="mx-auto w-full max-w-350 px-6 pt-5 sm:px-10 sm:pt-6">
          <div className="relative h-12 sm:h-13">
            <Link
              href="/"
              aria-label="Platinum home"
              className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center"
              onClick={(event) => {
                event.preventDefault();
                onSelect("home");
              }}
            >
              <Image
                src={assetPath("/icons/Platinumlogo.svg")}
                alt="Platinum"
                width={120}
                height={24}
                className="h-4 w-auto object-contain sm:h-4.5"
                priority
                unoptimized
              />
            </Link>

            <div className="absolute right-0 top-1/2 -translate-y-[calc(50%+1px)]">
              <HamburgerToggle
                open
                onToggle={(next) => {
                  if (!next) onClose();
                }}
                size={22}
                strokeWidth={1.8}
                className="h-10 w-10 rounded-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center px-6 sm:px-10">
          <div className="w-full max-w-[30rem] translate-x-[3cm]">
            <nav className="space-y-5 sm:space-y-6">
              {menuEntries.map((entry, index) => {
                const isActive = entry.id === activeId;

                return (
                  <motion.button
                    key={entry.id}
                    type="button"
                    onClick={() => onSelect(entry.id)}
                    className="group flex w-full items-center gap-4 text-left sm:gap-6"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.06 * index,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span className="font-display min-w-[2rem] text-[0.92rem] font-medium tracking-[0.1em] text-[var(--brand-red)] sm:text-[1.05rem]">
                      {entry.order}
                    </span>
                    <span className="font-display text-[0.8575rem] font-medium leading-none text-white/28 sm:text-[0.9875rem]">/</span>
                    <span
                      className={`font-display text-[0.95rem] uppercase tracking-[0.1em] transition sm:text-[1.5rem] ${
                        isActive
                          ? "font-normal text-white"
                          : "font-normal text-white/92 group-hover:text-white"
                      }`}
                    >
                      {entry.label}
                    </span>
                    {isActive ? (
                      <span className="hidden h-px flex-1 bg-[linear-gradient(90deg,rgba(193,18,31,0.95),transparent)] sm:block" />
                    ) : null}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
