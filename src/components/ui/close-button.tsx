"use client";

import type { ButtonHTMLAttributes } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const closeButtonClassName =
  "group inline-flex size-11 items-center justify-center border border-[var(--border-subtle)] bg-black/20 text-white transition-[border-color,background-color,transform,opacity] duration-[var(--transition-normal)] ease-[var(--ease-premium)] hover:border-[var(--brand-red)] hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export function CloseButton({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      aria-label="Close"
      className={cn(closeButtonClassName, className)}
      {...props}
    >
      <X
        aria-hidden="true"
        className="size-5 transition-transform duration-[var(--transition-normal)] ease-[var(--ease-premium)] group-hover:rotate-90"
        strokeWidth={1.75}
      />
    </button>
  );
}
