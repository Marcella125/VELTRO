"use client";

import type { ReactNode } from "react";
import { PageTransition } from "@/views/components/PageTransition";

export default function SiteTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
