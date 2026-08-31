import { HOURS, nowInShop, toHHMM } from "@/lib/shop";

export interface ExistingBooking {
  startTime: string; // "HH:MM"
  durationMinutes: number;
}

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export function intervalsOverlap(
  aStart: number,
  aDur: number,
  bStart: number,
  bDur: number,
): boolean {
  return aStart < bStart + bDur && bStart < aStart + aDur;
}

export function slotIsFree(
  startMin: number,
  duration: number,
  existing: ExistingBooking[],
): boolean {
  return !existing.some((b) =>
    intervalsOverlap(startMin, duration, toMin(b.startTime), b.durationMinutes),
  );
}

export function isoWeekday(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

/** Дали салонът е затворен в този ден (неделя и понеделник). */
export function isClosedDay(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  return !!HOURS[isoWeekday(date)].closed;
}

/** Работен прозорец за дата, или null когато резервация не е позволена. */
export function bookingWindow(date: string): { open: number; close: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const now = nowInShop();
  if (date < now.date) return null;
  // хоризонт за резервации: 30 дни
  const max = new Date(`${now.date}T12:00:00Z`);
  max.setUTCDate(max.getUTCDate() + 30);
  if (date > max.toISOString().slice(0, 10)) return null;
  const h = HOURS[isoWeekday(date)];
  if (h.closed) return null;
  return { open: h.open, close: h.close };
}

export interface SlotResult {
  time: string;
  available: boolean;
}

/**
 * Строи кандидат-слотове на всеки 30 минути. `isFree` получава началото
 * на слота (минути) и отговаря дали столът е свободен.
 */
export function buildSlots(
  date: string,
  durationMinutes: number,
  isFree: (startMin: number) => boolean,
): SlotResult[] | null {
  const window = bookingWindow(date);
  if (!window) return null;
  const now = nowInShop();
  const leadMin = 60; // резервации поне 1 час напред
  const slots: SlotResult[] = [];
  for (let t = window.open; t + durationMinutes <= window.close; t += 30) {
    const inPast = date === now.date && t < now.minutes + leadMin;
    slots.push({ time: toHHMM(t), available: !inPast && isFree(t) });
  }
  return slots;
}
