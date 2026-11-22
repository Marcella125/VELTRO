import { assetPath } from "@/lib/asset-path";

const generatedCardImages: Record<string, string> = {
  "lamborghini-evo-spyder": "/images/lambo specs.png",
  "velour-phantom": "/images/lambo specs.png",
  "ferrari-296-gtb": "/images/ferrari-296-card.png",
  "porsche-911-carrera-4s": "/images/porsche-911-card.png",
  "bmw-m8-competition": "/images/bmw-m8-card.png",
};

export function carCardImage(slug: string, fallback: string) {
  return assetPath(generatedCardImages[slug] ?? fallback);
}
