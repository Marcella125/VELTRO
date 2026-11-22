"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector = [
  ".site-typography main section h1",
  ".site-typography main section h2",
  ".site-typography main section h3",
  ".site-typography [data-scroll-text]",
].join(", ");

export function ScrollTextReveals() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector))
      .filter((element) => !element.closest("[data-no-scroll-reveal]"));

    if (!elements.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    elements.forEach((element, index) => {
      element.classList.add("scroll-text-reveal");
      element.style.setProperty("--scroll-text-delay", `${(index % 3) * 55}ms`);
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-scroll-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-scroll-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
