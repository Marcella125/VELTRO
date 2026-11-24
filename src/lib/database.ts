import "server-only";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { AdminCar, AdminSnapshot, HistoryItem, Owner, Reservation } from "@/lib/admin-types";

const globalDatabase = globalThis as typeof globalThis & { __veltroDb?: DatabaseSync; __veltroDbSchemaVersion?: number };
const schemaVersion = 4;

function databasePath() {
  return process.env.VELTRO_DB_PATH ?? path.join(process.cwd(), ".data", "veltro.db");
}

function initialize(db: DatabaseSync) {
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS owners (
      id TEXT PRIMARY KEY, full_name TEXT NOT NULL, phone TEXT NOT NULL, secondary_phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '', reference_number TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, created_by TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL, brand TEXT NOT NULL, model TEXT NOT NULL,
      trim TEXT NOT NULL DEFAULT '', year INTEGER NOT NULL, vin TEXT NOT NULL UNIQUE, plate_number TEXT NOT NULL UNIQUE,
      mileage INTEGER NOT NULL DEFAULT 0, body_type TEXT NOT NULL DEFAULT '', transmission TEXT NOT NULL DEFAULT '',
      fuel_type TEXT NOT NULL DEFAULT '', engine TEXT NOT NULL DEFAULT '', horsepower INTEGER NOT NULL DEFAULT 0,
      exterior_color TEXT NOT NULL DEFAULT '', interior_color TEXT NOT NULL DEFAULT '', description TEXT NOT NULL DEFAULT '',
      owner_id TEXT NOT NULL REFERENCES owners(id), ownership_type TEXT NOT NULL DEFAULT 'Consignment',
      date_received TEXT NOT NULL, owner_price REAL NOT NULL DEFAULT 0, listed_price REAL NOT NULL DEFAULT 0,
      minimum_price REAL NOT NULL DEFAULT 0, currency TEXT NOT NULL DEFAULT 'AED', commission_percentage REAL NOT NULL DEFAULT 0,
      commission_amount REAL NOT NULL DEFAULT 0, internal_expenses REAL NOT NULL DEFAULT 0, financial_notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Available', published INTEGER NOT NULL DEFAULT 1, featured INTEGER NOT NULL DEFAULT 0,
      new_arrival INTEGER NOT NULL DEFAULT 0, display_order INTEGER NOT NULL DEFAULT 0,
      cover_image TEXT NOT NULL DEFAULT '/images/cars.png', video_url TEXT NOT NULL DEFAULT '', deleted_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, created_by TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS car_images (
      id TEXT PRIMARY KEY, car_id TEXT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
      url TEXT NOT NULL, alt_text TEXT NOT NULL DEFAULT '', display_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY, car_id TEXT NOT NULL REFERENCES cars(id), customer_name TEXT NOT NULL, phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '', reservation_date TEXT NOT NULL, deposit_amount REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'AED', payment_status TEXT NOT NULL DEFAULT 'Unpaid', expiry_date TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'Pending', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, created_by TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY, car_id TEXT NOT NULL UNIQUE REFERENCES cars(id), buyer_name TEXT NOT NULL, buyer_phone TEXT NOT NULL,
      buyer_email TEXT NOT NULL DEFAULT '', final_selling_price REAL NOT NULL, currency TEXT NOT NULL DEFAULT 'AED',
      sale_date TEXT NOT NULL, payment_method TEXT NOT NULL, payment_status TEXT NOT NULL, salesperson TEXT NOT NULL,
      commission REAL NOT NULL DEFAULT 0, notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS car_history (
      id TEXT PRIMARY KEY, car_id TEXT NOT NULL REFERENCES cars(id), action TEXT NOT NULL, details TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, created_by TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_cars_status_published ON cars(status, published);
    CREATE INDEX IF NOT EXISTS idx_cars_owner_id ON cars(owner_id);
    CREATE INDEX IF NOT EXISTS idx_reservations_car_status ON reservations(car_id, status);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_reservations_active_car ON reservations(car_id)
      WHERE status IN ('Pending', 'Confirmed');
    CREATE INDEX IF NOT EXISTS idx_history_car_created ON car_history(car_id, created_at DESC);
  `);

  const settingInsert = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  [["dealership_name", "Veltro"], ["currency", "AED"], ["contact_email", "concierge@veltrorental.com"], ["phone", "+971 4 555 0198"], ["sold_behavior", "Hide sold vehicles"]].forEach(([key, value]) => settingInsert.run(key, value));

  const count = Number(db.prepare("SELECT COUNT(*) AS count FROM cars").get()?.count ?? 0);
  if (!count) seed(db);
  db.prepare("UPDATE cars SET status = 'Unavailable', published = 0 WHERE status = 'Sold'").run();
  db.prepare("UPDATE cars SET listed_price = ROUND(listed_price / 300) WHERE listed_price > 10000").run();

  const marketPricingVersion = "lebanon-market-pricing-v1";
  const pricingApplied = db.prepare("SELECT value FROM settings WHERE key = ?").get(marketPricingVersion);
  if (!pricingApplied) {
    const updateDailyRate = db.prepare("UPDATE cars SET listed_price = ?, currency = 'USD', updated_at = CURRENT_TIMESTAMP WHERE slug = ?");
    const marketRates: Array<[string, number]> = [
      ["lamborghini-evo-spyder", 1400],
      ["porsche-911-carrera-4s", 450],
      ["ferrari-296-gtb", 2800],
      ["lamborghini-huracan-sto", 1400],
      ["mercedes-amg-gtr", 700],
      ["bmw-m8-competition", 600],
    ];

    db.exec("BEGIN");
    try {
      marketRates.forEach(([slug, rate]) => updateDailyRate.run(rate, slug));
      db.prepare("UPDATE settings SET value = 'USD', updated_at = CURRENT_TIMESTAMP WHERE key = 'currency'").run();
      settingInsert.run(marketPricingVersion, new Date().toISOString());
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  const showroomPricingVersion = "showroom-sale-pricing-v1";
  const showroomPricingApplied = db.prepare("SELECT value FROM settings WHERE key = ?").get(showroomPricingVersion);
  if (!showroomPricingApplied) {
    const updateSalePrice = db.prepare("UPDATE cars SET minimum_price = ?, currency = 'USD', updated_at = CURRENT_TIMESTAMP WHERE slug = ?");
    const showroomPrices: Array<[string, number]> = [
      ["lamborghini-evo-spyder", 995000],
      ["porsche-911-carrera-4s", 530000],
      ["ferrari-296-gtb", 1210000],
      ["lamborghini-huracan-sto", 1100000],
      ["mercedes-amg-gtr", 405000],
      ["bmw-m8-competition", 555000],
    ];

    db.exec("BEGIN");
    try {
      showroomPrices.forEach(([slug, price]) => updateSalePrice.run(price, slug));
      settingInsert.run(showroomPricingVersion, new Date().toISOString());
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}

function seed(db: DatabaseSync) {
  const adminId = "admin-1";
  db.prepare("INSERT OR IGNORE INTO admin_users (id, email, full_name) VALUES (?, ?, ?)").run(adminId, "veltroadmin@gmail.com", "Veltro Admin");
  const owners = [
    ["owner-1", "Karim Haddad", "+971 50 284 1190", "karim.h@example.com", "Dubai, UAE", "OWN-2041"],
    ["owner-2", "Maya Rahal", "+971 55 923 4108", "maya.r@example.com", "Abu Dhabi, UAE", "OWN-2042"],
    ["owner-3", "Veltro Fleet", "+971 4 555 0198", "fleet@veltro.ae", "Dubai, UAE", "OWN-0001"],
  ];
  const ownerInsert = db.prepare("INSERT INTO owners (id, full_name, phone, email, address, reference_number, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
  owners.forEach((owner) => ownerInsert.run(...owner, adminId));

  const cars = [
    ["car-1", "lamborghini-evo-spyder", "Lamborghini Evo Spyder", "Lamborghini", "Huracan", "EVO Spyder", 2024, "ZHWUT5ZF1RLA10001", "D 87941", 8400, "Convertible", "Automatic", "Petrol", "V10", 640, "Arancio Borealis", "Nero Ade", "Open-air V10 theatre, curated for unforgettable drives.", "owner-1", "Consignment", "2026-08-18", 910000, 1400, 995000, 4.5, 49275, 7200, "Available", 1, 1, 1, 1, "/lambo fleet.png"],
    ["car-2", "porsche-911-carrera-4s", "Porsche 911 Carrera 4S", "Porsche", "911", "Carrera 4S", 2023, "WP0AB2A91PS220002", "P 11472", 17200, "Coupe", "PDK", "Petrol", "Flat-6", 450, "GT Silver", "Black leather", "An everyday supercar with precise all-wheel-drive performance.", "owner-2", "Customer Vehicle", "2026-08-26", 485000, 450, 530000, 5, 28250, 3900, "Reserved", 1, 1, 0, 2, "/porshe fleet.png"],
    ["car-3", "ferrari-296-gtb", "Ferrari 296 GTB", "Ferrari", "296", "GTB", 2024, "ZFF99SLA8R0300003", "F 29603", 3200, "Coupe", "DCT", "Hybrid", "V6 Hybrid", 830, "Rosso Corsa", "Nero", "A compact hybrid berlinetta with extraordinary response and balance.", "owner-3", "Veltro Owned", "2026-09-03", 1120000, 2800, 1210000, 0, 0, 12800, "Available", 1, 1, 1, 3, "/ferrari fleet.png"],
    ["car-4", "lamborghini-huracan-sto", "Lamborghini Huracan STO", "Lamborghini", "Huracan", "STO", 2022, "ZHWUA6ZF9NLA40004", "D 52014", 12600, "Coupe", "Automatic", "Petrol", "V10", 640, "Blu Laufey", "Nero Cosmus", "Track-focused Huracan with road-going usability.", "owner-1", "Consignment", "2026-07-12", 1020000, 1400, 1100000, 4, 47200, 11400, "Maintenance", 0, 0, 0, 4, "/lambo fleet.png"],
    ["car-5", "mercedes-amg-gtr", "Mercedes-AMG GT R", "Mercedes-Benz", "AMG GT", "R", 2021, "WDDYJ7KA7MA050005", "G 81821", 23800, "Coupe", "DCT", "Petrol", "V8 Biturbo", 585, "AMG Green Hell", "Black Alcantara", "A dramatic front-engine performance coupe with immense presence.", "owner-2", "Consignment", "2026-06-28", 365000, 700, 405000, 5, 21750, 6400, "Sold", 0, 0, 0, 5, "/porshe fleet.png"],
    ["car-6", "bmw-m8-competition", "BMW M8 Competition", "BMW", "M8", "Competition", 2023, "WBSGV0C04PCH60006", "B 94031", 9100, "Gran Coupe", "Automatic", "Petrol", "V8", 625, "Frozen Black", "Sakhir Orange", "Four-door grand touring with supercar pace.", "owner-3", "Veltro Owned", "2026-09-21", 510000, 600, 555000, 0, 0, 2800, "Coming Soon", 1, 0, 1, 6, "/ferrari fleet.png"],
  ];
  const insert = db.prepare(`INSERT INTO cars (id, slug, display_name, brand, model, trim, year, vin, plate_number, mileage, body_type, transmission, fuel_type, engine, horsepower, exterior_color, interior_color, description, owner_id, ownership_type, date_received, owner_price, listed_price, minimum_price, commission_percentage, commission_amount, internal_expenses, status, published, featured, new_arrival, display_order, cover_image, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  cars.forEach((car) => insert.run(...car, adminId));
  db.prepare("INSERT INTO reservations (id, car_id, customer_name, phone, email, reservation_date, deposit_amount, currency, payment_status, expiry_date, notes, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run("res-1", "car-2", "Omar Nasser", "+971 55 840 1922", "omar.n@example.com", "2026-09-27", 15000, "AED", "Paid", "2026-10-03", "Client requested delivery to DIFC.", "Confirmed", adminId);
  db.prepare("INSERT INTO sales (id, car_id, buyer_name, buyer_phone, buyer_email, final_selling_price, currency, sale_date, payment_method, payment_status, salesperson, commission, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run("sale-1", "car-5", "Nadia Faris", "+971 50 332 6110", "nadia.f@example.com", 420000, "AED", "2026-09-12", "Bank transfer", "Paid", "Jad", 21000, "Handover completed.", adminId);
  const history = db.prepare("INSERT INTO car_history (id, car_id, action, details, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?)");
  history.run("hist-1", "car-6", "Vehicle added", "BMW M8 Competition added as Coming Soon", "2026-09-21 10:14:00", adminId);
  history.run("hist-2", "car-2", "Status changed", "Available → Reserved", "2026-09-27 16:32:00", adminId);
  history.run("hist-3", "car-2", "Reservation created", "Reservation confirmed for Omar Nasser", "2026-09-27 16:31:00", adminId);
  history.run("hist-4", "car-5", "Vehicle sold", "Reserved → Sold", "2026-09-12 13:05:00", adminId);
}

export function getDatabase() {
  if (!globalDatabase.__veltroDb) {
    const dbFile = databasePath();
    mkdirSync(path.dirname(dbFile), { recursive: true });
    globalDatabase.__veltroDb = new DatabaseSync(dbFile);
  }
  if (globalDatabase.__veltroDbSchemaVersion !== schemaVersion) {
    initialize(globalDatabase.__veltroDb);
    globalDatabase.__veltroDbSchemaVersion = schemaVersion;
  }
  return globalDatabase.__veltroDb;
}

const carSelect = `SELECT cars.*, owners.full_name AS owner_name, owners.phone AS owner_phone
  FROM cars JOIN owners ON owners.id = cars.owner_id WHERE cars.deleted_at IS NULL`;

export function getAdminSnapshot(): AdminSnapshot {
  const db = getDatabase();
  const cars = db.prepare(`${carSelect} ORDER BY cars.created_at DESC, cars.display_order`).all() as unknown as AdminCar[];
  const owners = db.prepare(`SELECT owners.*, COUNT(cars.id) AS vehicle_count,
    SUM(CASE WHEN cars.deleted_at IS NULL THEN 1 ELSE 0 END) AS active_vehicles
    FROM owners LEFT JOIN cars ON cars.owner_id = owners.id GROUP BY owners.id ORDER BY owners.full_name`).all() as unknown as Owner[];
  const reservations = db.prepare(`SELECT reservations.*, cars.display_name AS car_name FROM reservations
    JOIN cars ON cars.id = reservations.car_id ORDER BY reservations.created_at DESC`).all() as unknown as Reservation[];
  const history = db.prepare(`SELECT car_history.*, cars.display_name AS car_name FROM car_history
    JOIN cars ON cars.id = car_history.car_id
    WHERE LOWER(car_history.action) NOT LIKE '%sold%' AND LOWER(car_history.details) NOT LIKE '%sold%'
    ORDER BY car_history.created_at DESC LIMIT 100`).all() as unknown as HistoryItem[];
  const settings = Object.fromEntries(db.prepare("SELECT key, value FROM settings").all().map((row) => [String(row.key), String(row.value)]));
  return JSON.parse(JSON.stringify({ cars, owners, reservations, history, settings })) as AdminSnapshot;
}

export function updateSettings(input: Record<string, unknown>) {
  const db = getDatabase();
  const allowed = ["dealership_name", "currency", "contact_email", "phone", "sold_behavior"];
  const statement = db.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP");
  allowed.forEach((key) => { if (input[key] !== undefined) statement.run(key, String(input[key])); });
}

export function createCar(input: Record<string, unknown>, createdBy: string) {
  const db = getDatabase();
  const id = randomUUID();
  const name = String(input.display_name || `${input.brand ?? ""} ${input.model ?? ""}`).trim();
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${id.slice(0, 6)}`;
  const fields = ["brand", "model", "trim", "vin", "plate_number", "body_type", "transmission", "fuel_type", "engine", "exterior_color", "interior_color", "description", "owner_id", "ownership_type", "date_received", "currency", "financial_notes", "status", "cover_image", "video_url"];
  const text = Object.fromEntries(fields.map((field) => [field, String(input[field] ?? "")]));
  const number = (field: string, fallback = 0) => Number(input[field] ?? fallback);
  db.prepare(`INSERT INTO cars (id, slug, display_name, brand, model, trim, year, vin, plate_number, mileage, body_type, transmission, fuel_type, engine, horsepower, exterior_color, interior_color, description, owner_id, ownership_type, date_received, owner_price, listed_price, minimum_price, currency, commission_percentage, commission_amount, internal_expenses, financial_notes, status, published, featured, new_arrival, display_order, cover_image, video_url, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, slug, name, text.brand, text.model, text.trim, number("year", new Date().getFullYear()), text.vin, text.plate_number, number("mileage"), text.body_type, text.transmission, text.fuel_type, text.engine, number("horsepower"), text.exterior_color, text.interior_color, text.description, text.owner_id, text.ownership_type || "Consignment", text.date_received || new Date().toISOString().slice(0, 10), number("owner_price"), number("listed_price"), number("minimum_price"), text.currency || "AED", number("commission_percentage"), number("commission_amount"), number("internal_expenses"), text.financial_notes, text.status || "Available", number("published"), number("featured"), number("new_arrival"), number("display_order"), text.cover_image || "/images/cars.png", text.video_url, createdBy);
  const gallery = Array.isArray(input.gallery_images) ? input.gallery_images.map(String) : [];
  const imageInsert = db.prepare("INSERT INTO car_images (id, car_id, url, alt_text, display_order) VALUES (?, ?, ?, ?, ?)");
  gallery.forEach((url, index) => imageInsert.run(randomUUID(), id, url, name, index));
  addHistory(id, "Vehicle added", `${name} added`, createdBy);
  return id;
}

export function updateCar(id: string, input: Record<string, unknown>, createdBy: string) {
  const db = getDatabase();
  const current = db.prepare("SELECT status, display_name FROM cars WHERE id = ? AND deleted_at IS NULL").get(id);
  if (!current) throw new Error("Car not found");
  const allowed = ["display_name", "brand", "model", "trim", "year", "vin", "plate_number", "mileage", "body_type", "transmission", "fuel_type", "engine", "horsepower", "exterior_color", "interior_color", "description", "owner_id", "ownership_type", "date_received", "owner_price", "listed_price", "minimum_price", "currency", "commission_percentage", "commission_amount", "internal_expenses", "financial_notes", "status", "published", "featured", "new_arrival", "display_order", "cover_image", "video_url"];
  const entries = Object.entries(input).filter(([key, value]) => allowed.includes(key) && value !== undefined);
  if (!entries.length) return;
  db.prepare(`UPDATE cars SET ${entries.map(([key]) => `${key} = ?`).join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...entries.map(([, value]) => value), id);
  const nextStatus = input.status ? String(input.status) : String(current.status);
  const detail = nextStatus !== current.status ? `${current.status} → ${nextStatus}` : `${current.display_name} details updated`;
  addHistory(id, nextStatus !== current.status ? "Status changed" : "Vehicle updated", detail, createdBy);
}

export function removeCar(id: string, createdBy: string) {
  const db = getDatabase();
  const row = db.prepare("SELECT status FROM cars WHERE id = ?").get(id);
  if (!row) throw new Error("Car not found");
  db.prepare("UPDATE cars SET deleted_at = CURRENT_TIMESTAMP, published = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
  addHistory(id, "Vehicle archived", "Removed from active inventory", createdBy);
}

export function createOwner(input: Record<string, unknown>, createdBy: string) {
  const db = getDatabase();
  const id = randomUUID();
  db.prepare("INSERT INTO owners (id, full_name, phone, secondary_phone, email, address, reference_number, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run(id, String(input.full_name), String(input.phone), String(input.secondary_phone ?? ""), String(input.email ?? ""), String(input.address ?? ""), String(input.reference_number ?? ""), String(input.notes ?? ""), createdBy);
  return id;
}

export function createReservation(input: Record<string, unknown>, createdBy: string) {
  const db = getDatabase();
  const id = randomUUID();
  db.prepare("INSERT INTO reservations (id, car_id, customer_name, phone, email, reservation_date, deposit_amount, currency, payment_status, expiry_date, notes, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run(id, String(input.car_id), String(input.customer_name), String(input.phone), String(input.email ?? ""), String(input.reservation_date), Number(input.deposit_amount ?? 0), String(input.currency ?? "AED"), String(input.payment_status ?? "Unpaid"), String(input.expiry_date), String(input.notes ?? ""), String(input.status ?? "Pending"), createdBy);
  addHistory(String(input.car_id), "Reservation created", `Reservation created for ${input.customer_name}`, createdBy);
  if (input.status === "Confirmed") updateCar(String(input.car_id), { status: "Reserved" }, createdBy);
  return id;
}

export function updateReservation(id: string, status: string, returnAvailable: boolean, createdBy: string) {
  const db = getDatabase();
  const reservation = db.prepare("SELECT car_id FROM reservations WHERE id = ?").get(id);
  if (!reservation) throw new Error("Reservation not found");
  db.prepare("UPDATE reservations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id);
  if (status === "Confirmed") updateCar(String(reservation.car_id), { status: "Reserved" }, createdBy);
  if ((status === "Cancelled" || status === "Expired") && returnAvailable) updateCar(String(reservation.car_id), { status: "Available" }, createdBy);
  addHistory(String(reservation.car_id), "Reservation updated", `Reservation marked ${status}`, createdBy);
}

function addHistory(carId: string, action: string, details: string, createdBy: string) {
  getDatabase().prepare("INSERT INTO car_history (id, car_id, action, details, created_by) VALUES (?, ?, ?, ?, ?)")
    .run(randomUUID(), carId, action, details, createdBy);
}

export function getPublicInventory() {
  const db = getDatabase();
  return db.prepare(`SELECT id, slug, display_name AS name, brand, year, body_type AS bodyType,
    CASE WHEN minimum_price > 0 THEN minimum_price WHEN owner_price > 0 THEN owner_price ELSE listed_price END AS purchasePrice,
    listed_price AS pricePerDay, currency, cover_image AS image, featured, engine, horsepower, transmission,
    exterior_color AS exteriorColor, interior_color AS interiorColor, description, status
    FROM cars WHERE published = 1 AND deleted_at IS NULL AND status != 'Sold' ORDER BY display_order, created_at DESC`).all();
}
