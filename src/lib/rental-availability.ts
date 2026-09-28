export type RentalStatus = "reserved" | "rented";

export type VehicleReservation = {
  vehicleSlug: string;
  startDate: string;
  endDate: string;
  status: RentalStatus;
};

// Mock source of truth. Replace this array with an API response when a backend is added.
export const vehicleReservations: VehicleReservation[] = [
  { vehicleSlug: "obsidian-gt", startDate: "2026-10-10", endDate: "2026-10-15", status: "reserved" },
  { vehicleSlug: "crimson-eclipse", startDate: "2026-10-12", endDate: "2026-10-18", status: "rented" },
  { vehicleSlug: "onyx-sabre", startDate: "2026-11-04", endDate: "2026-11-09", status: "reserved" },
  { vehicleSlug: "velour-phantom", startDate: "2026-10-22", endDate: "2026-10-27", status: "rented" },
  { vehicleSlug: "ember-revenant", startDate: "2026-12-01", endDate: "2026-12-06", status: "reserved" },
  { vehicleSlug: "midnight-regal", startDate: "2026-11-16", endDate: "2026-11-21", status: "rented" },
];

function toDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function isValidRentalPeriod(pickupDate: string, returnDate: string) {
  if (!pickupDate || !returnDate) return false;
  return toDate(returnDate).getTime() > toDate(pickupDate).getTime();
}

export function rentalDurationInDays(pickupDate: string, returnDate: string) {
  if (!isValidRentalPeriod(pickupDate, returnDate)) return 0;
  return Math.ceil((toDate(returnDate).getTime() - toDate(pickupDate).getTime()) / 86_400_000);
}

export function isVehicleAvailable(
  vehicleSlug: string,
  pickupDate: string,
  returnDate: string,
  reservations: VehicleReservation[] = vehicleReservations,
) {
  if (!isValidRentalPeriod(pickupDate, returnDate)) return false;

  const requestedStart = toDate(pickupDate).getTime();
  const requestedEnd = toDate(returnDate).getTime();

  return !reservations.some((reservation) => {
    if (reservation.vehicleSlug !== vehicleSlug) return false;
    const reservationStart = toDate(reservation.startDate).getTime();
    const reservationEnd = toDate(reservation.endDate).getTime();
    return requestedStart < reservationEnd && requestedEnd > reservationStart;
  });
}

export function formatRentalDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(toDate(value));
}
