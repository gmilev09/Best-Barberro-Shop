/**
 * Локален тефтер за СТАТИЧНИЯ (GitHub Pages) режим — без сървър.
 * Резервациите се пазят в localStorage на браузъра и се споделят между
 * формата за запазване и демонстрационния контролен панел.
 */

import { intervalsOverlap } from "@/lib/slots";

export interface LocalBooking {
  id: number;
  ref: string;
  serviceSlug: string;
  service: string;
  priceLabel: string;
  priceCents: number;
  barberSlug: string;
  barber: string;
  date: string; // ГГГГ-ММ-ДД
  time: string; // HH:MM
  durationMinutes: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  status: string; // pending | confirmed | cancelled
  createdAt: string;
}

const KEY = "bbs_bookings_v1";
const ADMIN_KEY = "bbs_admin_static_v1";

export function toMinutesOfDay(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function readLocalBookings(): LocalBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as LocalBooking[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLocalBookings(list: LocalBooking[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function addLocalBooking(
  data: Omit<LocalBooking, "id" | "ref" | "status" | "createdAt"> & {
    status?: string;
  },
): LocalBooking {
  const list = readLocalBookings();
  const id = list.reduce((max, b) => Math.max(max, b.id), 0) + 1;
  const record: LocalBooking = {
    ...data,
    id,
    ref: `BBS-${String(id).padStart(4, "0")}`,
    status: data.status ?? "pending",
    createdAt: new Date().toISOString(),
  };
  list.push(record);
  writeLocalBookings(list);
  return record;
}

export function updateLocalBooking(
  id: number,
  patch: Partial<LocalBooking>,
): void {
  const list = readLocalBookings().map((b) =>
    b.id === id ? { ...b, ...patch } : b,
  );
  writeLocalBookings(list);
}

export function deleteLocalBooking(id: number): void {
  writeLocalBookings(readLocalBookings().filter((b) => b.id !== id));
}

/** Заети интервали на даден майстор в даден ден (без отменените). */
export function occupiedIntervals(
  barberSlug: string,
  date: string,
): { startMin: number; duration: number }[] {
  return readLocalBookings()
    .filter((b) => b.barberSlug === barberSlug && b.date === date && b.status !== "cancelled")
    .map((b) => ({ startMin: toMinutesOfDay(b.time), duration: b.durationMinutes }));
}

export function barberFreeAt(
  barberSlug: string,
  date: string,
  startMin: number,
  duration: number,
): boolean {
  return !occupiedIntervals(barberSlug, date).some((o) =>
    intervalsOverlap(startMin, duration, o.startMin, o.duration),
  );
}

/* Демо вход за статичния админ */
export function staticAdminLogin(passcode: string): boolean {
  if (typeof window === "undefined") return false;
  const ok = passcode === "legends";
  if (ok) window.localStorage.setItem(ADMIN_KEY, "1");
  return ok;
}

export function staticAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_KEY) === "1";
}

export function staticAdminLogout(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_KEY);
}
