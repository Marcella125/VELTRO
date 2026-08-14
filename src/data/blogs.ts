import { assetPath } from "@/lib/asset-path";

export type BlogEntry = {
  id: string;
  category: "Automotive" | "Lifestyle" | "Experience" | "News";
  publishedAt: string;
  readTime: string;
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
    id: "evolution-of-italian-engineering",
    category: "Automotive",
    publishedAt: "May 24, 2024",
    readTime: "5 min read",
    title: "The Evolution of Italian Engineering",
    summary:
      "A look into the legacy of Italian performance and design, from dramatic proportions to mechanical clarity.",
    heroImage: assetPath("/images/blog 3.png"),
    body: [
      "Italian supercars have always treated engineering as theatre. Performance matters, but so does the feeling of occasion: the lines, the proportions, the soundtrack, and the way each control feels intentional.",
      "That philosophy is what keeps cars like the Huracan EVO Spyder relevant beyond raw numbers. The experience is built around balance, precision, and a design language that communicates speed before the car even moves.",
      "For luxury rental clients, that legacy still matters. They are not only choosing acceleration; they are choosing the emotional clarity of an icon shaped by decades of uncompromising engineering.",
    ],
    car: {
      name: "Lamborghini Huracan EVO Spyder",
      image: assetPath("/images/cars.png"),
      horsepower: "640 HP",
      topSpeed: "325 KM/H",
      ctaLabel: "WhatsApp",
      ctaHref:
        "https://wa.me/96170335113?text=Hi%2C%20I'm%20interested%20in%20the%20Lamborghini%20Huracan%20EVO%20Spyder.",
    },
  },
  {
    id: "drive-beyond-the-ordinary",
    category: "Experience",
    publishedAt: "May 10, 2024",
    readTime: "4 min read",
    title: "Drive Beyond the Ordinary",
    summary:
      "Why the journey matters just as much as the destination when the car is built to engage every sense.",
    heroImage: assetPath("/images/blog 2.png"),
    body: [
      "A high-performance rental changes the rhythm of a drive. The route becomes part of the experience, not just the distance between two appointments or destinations.",
      "Open-top cars are especially good at this. They amplify sound, atmosphere, and pace in a way that makes even familiar roads feel deliberate and cinematic.",
      "That is why premium clients often ask for more than specifications. They want a car that turns motion into memory, with presence strong enough to reshape the entire journey.",
    ],
    car: {
      name: "Lamborghini Huracan EVO Spyder",
      image: assetPath("/images/cars.png"),
      horsepower: "Open-top",
      topSpeed: "V10",
      ctaLabel: "WhatsApp",
      ctaHref:
        "https://wa.me/96170335113?text=Hi%2C%20I'm%20interested%20in%20the%20Lamborghini%20Huracan%20EVO%20Spyder.",
    },
  },
  {
    id: "a-new-chapter-is-coming",
    category: "News",
    publishedAt: "May 10, 2024",
    readTime: "3 min read",
    title: "A New Chapter Is Coming",
    summary:
      "Something extraordinary is on the horizon, shaped around sharper curation, stronger visuals, and a more refined fleet story.",
    heroImage: assetPath("/images/blog 1.png"),
    body: [
      "Veltro continues to refine how it presents the fleet, the stories around it, and the experience clients can expect before they ever make contact.",
      "That means stronger editorial direction, sharper vehicle presentation, and content that feels closer to the cars themselves: confident, precise, and unmistakably premium.",
      "The next phase is not about noise. It is about a tighter point of view and a more coherent luxury experience across the site and the fleet.",
    ],
    car: {
      name: "Lamborghini Huracan EVO Spyder",
      image: assetPath("/images/cars.png"),
      horsepower: "New drop",
      topSpeed: "Soon",
      ctaLabel: "WhatsApp",
      ctaHref:
        "https://wa.me/96170335113?text=Hi%2C%20I'm%20interested%20in%20the%20Lamborghini%20Huracan%20EVO%20Spyder.",
    },
  },
];
