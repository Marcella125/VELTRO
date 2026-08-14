import { assetPath } from "@/lib/asset-path";

export const primarySiteRoutes = [
  "/",
  "/fleet",
  "/fleet/all",
  "/blogs",
  "/mission",
  "/contact",
  "/faq",
] as const;

const sharedRouteAssets = [
  assetPath("/Menu bg.png"),
  assetPath("/images/menu mobile.png"),
];

const routeWarmupAssets: Record<string, string[]> = {
  "/": [
    assetPath("/Home bg.png"),
    assetPath("/images/Home bg mobile.png"),
    assetPath("/back3.jpg"),
  ],
  "/fleet": [
    assetPath("/images/bgcar.png"),
    assetPath("/lambo fleet.png"),
    assetPath("/porshe fleet.png"),
    assetPath("/ferrari fleet.png"),
  ],
  "/fleet/all": [
    assetPath("/images/bgcar.png"),
    assetPath("/lambo fleet.png"),
    assetPath("/porshe fleet.png"),
    assetPath("/ferrari fleet.png"),
  ],
  "/blogs": [
    assetPath("/images/bgcar.png"),
    assetPath("/images/blog 1.png"),
    assetPath("/images/blog 2.png"),
    assetPath("/images/blog 3.png"),
  ],
  "/mission": [assetPath("/images/Mission bg.png")],
  "/contact": [assetPath("/images/contact.png")],
  "/faq": [assetPath("/images/FAQ.png")],
};

const warmedImageAssets = new Set<string>();

export function getRouteWarmupAssets(href: string) {
  return [...sharedRouteAssets, ...(routeWarmupAssets[href] ?? [])];
}

export function warmupRouteAssets(href: string) {
  if (typeof window === "undefined") return;

  getRouteWarmupAssets(href).forEach((src) => {
    if (warmedImageAssets.has(src)) return;

    warmedImageAssets.add(src);

    const image = new window.Image();
    image.decoding = "async";
    (image as HTMLImageElement & { fetchPriority?: "high" | "low" | "auto" }).fetchPriority =
      "high";
    image.src = src;
  });
}
