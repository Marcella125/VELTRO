export const carStatuses = ["Available", "Reserved", "Unavailable", "Maintenance", "Coming Soon"] as const;
export type CarStatus = (typeof carStatuses)[number];

export type AdminCar = {
  id: string;
  slug: string;
  display_name: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  vin: string;
  plate_number: string;
  mileage: number;
  body_type: string;
  transmission: string;
  fuel_type: string;
  engine: string;
  horsepower: number;
  exterior_color: string;
  interior_color: string;
  description: string;
  owner_id: string;
  owner_name: string;
  owner_phone: string;
  ownership_type: string;
  date_received: string;
  owner_price: number;
  listed_price: number;
  minimum_price: number;
  currency: string;
  commission_percentage: number;
  commission_amount: number;
  internal_expenses: number;
  financial_notes: string;
  status: CarStatus;
  published: number;
  featured: number;
  new_arrival: number;
  display_order: number;
  cover_image: string;
  video_url: string;
  created_at: string;
  updated_at: string;
  created_by: string;
};

export type Owner = {
  id: string;
  full_name: string;
  phone: string;
  secondary_phone: string;
  email: string;
  address: string;
  reference_number: string;
  notes: string;
  vehicle_count: number;
  active_vehicles: number;
};

export type Reservation = {
  id: string;
  car_id: string;
  car_name: string;
  customer_name: string;
  phone: string;
  email: string;
  reservation_date: string;
  deposit_amount: number;
  currency: string;
  payment_status: string;
  expiry_date: string;
  notes: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed" | "Expired";
};

export type HistoryItem = {
  id: string;
  car_id: string;
  car_name: string;
  action: string;
  details: string;
  created_at: string;
  created_by: string;
};

export type AdminSnapshot = {
  cars: AdminCar[];
  owners: Owner[];
  reservations: Reservation[];
  history: HistoryItem[];
  settings: Record<string, string>;
};
