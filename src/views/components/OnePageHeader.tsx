"use client";

import { SiteHeader } from "@/views/components/SiteHeader";

export function OnePageHeader() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[100] bg-gradient-to-b from-black/90 via-black/45 to-transparent px-5 pt-5 max-[390px]:px-4 sm:px-10 sm:pt-6">
      <SiteHeader
        title=""
        compact
        hideTitleOnMobile
        onLogoClick={() => scrollToSection("home")}
        onSelect={scrollToSection}
      />
    </div>
  );
}
