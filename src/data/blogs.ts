import { assetPath } from "@/lib/asset-path";

export type BlogEntry = {
  id: string;
  title: string;
  summary: string;
  heroImage: string;
  body: string[];
  car: {
    name: string;
    image: string;
    horsepower: string;
    topSpeed: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

export const blogEntries: BlogEntry[] = [
  {
    id: "blog-cr7",
    title: "Discipline, Control, and the Ronaldo Image",
    summary:
      "Cristiano Ronaldo's public image is built on discipline: repetition, intent, and control.",
    heroImage: assetPath("/images/cr7.png"),
    body: [
      "Cristiano Ronaldo's public image is built around precision, repetition, and discipline. Every detail, from his physical preparation to the way he presents himself publicly, reinforces a clear sense of intent and control.",
      "That consistency is what makes the image memorable. The message is never scattered or accidental. It is structured, deliberate, and shaped by routine as much as by performance.",
      "In editorial terms, the appeal is not only success but clarity. The image works because it is repeated with discipline until it becomes unmistakable.",
    ],
    car: {
      name: "Lamborghini Urus",
      image: assetPath("/images/cars.png"),
      horsepower: "Performance",
      topSpeed: "Control",
      ctaLabel: "WhatsApp",
      ctaHref: "https://wa.me/96170335113?text=Hi%2C%20I'm%20interested%20in%20the%20Lamborghini%20Urus.",
    },
  },
  {
    id: "blog-sheikh",
    title: "Leadership Through Vision",
    summary:
      "Sheikh Mohammed bin Rashid Al Maktoum represents a leadership style shaped by long-term vision, stability, ambition, and authority.",
    heroImage: assetPath("/images/sheikh.png"),
    body: [
      "Sheikh Mohammed bin Rashid Al Maktoum represents a leadership style shaped by long-term vision, stability, ambition, and authority. His public presence communicates direction and confidence.",
      "The strength of that image comes from consistency. It frames leadership as something calm, measured, and future-facing rather than reactive or performative.",
      "What remains most visible is clarity of purpose. The identity is persuasive because it links authority with vision and makes both feel steady and durable.",
    ],
    car: {
      name: "Mercedes G60",
      image: assetPath("/images/cars.png"),
      horsepower: "Command",
      topSpeed: "Endurance",
      ctaLabel: "WhatsApp",
      ctaHref: "https://wa.me/96170335113?text=Hi%2C%20I'm%20interested%20in%20the%20Mercedes%20G60.",
    },
  },
  {
    id: "blog-ladygaga",
    title: "Expression, Confidence, and Presence",
    summary:
      "Lady Gaga's public identity is built on expression, confidence, reinvention, and presence.",
    heroImage: assetPath("/images/ladygaga.png"),
    body: [
      "Lady Gaga's public identity is built on expression, confidence, reinvention, and presence. Her image demonstrates how originality and consistency can create a memorable global brand.",
      "What stands out is not only boldness but control over transformation. Reinvention becomes effective because it still feels intentional, coherent, and unmistakably hers.",
      "The result is an identity built for recall. It proves that distinct expression, when sustained with confidence, can create lasting cultural presence.",
    ],
    car: {
      name: "Lamborghini Huracan EVO Spyder",
      image: assetPath("/images/cars.png"),
      horsepower: "Open-top",
      topSpeed: "Presence",
      ctaLabel: "WhatsApp",
      ctaHref: "https://wa.me/96170335113?text=Hi%2C%20I'm%20interested%20in%20the%20Lamborghini%20Huracan%20EVO%20Spyder.",
    },
  },
];
