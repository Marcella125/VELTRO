export type CarSpec = {
  label: string;
  value: string;
};

export type Car = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  year: number;
  bodyType: string;
  purchasePrice: number;
  pricePerDay: number;
  currency: string;
  image: string;
  featured: boolean;
  status?: "Available" | "Reserved" | "Unavailable" | "Maintenance" | "Coming Soon";
  transmission?: string;
  engine?: string;
  horsepower?: number;
  description?: string;
  exteriorColor?: string;
  interiorColor?: string;
  specs: CarSpec[];
};
