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
  pricePerDay: number;
  image: string;
  featured: boolean;
  specs: CarSpec[];
};
