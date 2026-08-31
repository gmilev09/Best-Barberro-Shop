import { asc } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { barbers, services } from "@/db/schema";
import {
  BARBER_CATALOG,
  SERVICE_CATALOG,
  type BarberSeed,
  type ServiceSeed,
} from "@/lib/shop";

export type ServiceDTO = ServiceSeed & { id: number };
export type BarberDTO = BarberSeed & { id: number };

/**
 * Reads services from the DB, seeding on first use.
 * Falls back to the static catalog if the DB is unavailable
 * (keeps build-time rendering and previews resilient).
 */
export async function getServices(): Promise<ServiceDTO[]> {
  try {
    await ensureSeeded();
    const rows = await db.select().from(services).orderBy(asc(services.sortOrder));
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description,
      category: r.category as ServiceSeed["category"],
      priceLabel: r.priceLabel,
      priceCents: r.priceCents,
      durationMinutes: r.durationMinutes,
      sortOrder: r.sortOrder,
    }));
  } catch {
    return SERVICE_CATALOG.map((s, i) => ({ ...s, id: i + 1 }));
  }
}

export async function getBarbers(): Promise<BarberDTO[]> {
  try {
    await ensureSeeded();
    const rows = await db.select().from(barbers).orderBy(asc(barbers.sortOrder));
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      years: r.years,
      quote: r.quote,
      imageUrl: r.imageUrl,
      specialties: r.specialties,
      sortOrder: r.sortOrder,
    }));
  } catch {
    return BARBER_CATALOG.map((b, i) => ({ ...b, id: i + 1 }));
  }
}
