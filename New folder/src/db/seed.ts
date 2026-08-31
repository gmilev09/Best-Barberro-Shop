import { db } from "@/db";
import { barbers, services } from "@/db/schema";
import { BARBER_CATALOG, SERVICE_CATALOG } from "@/lib/shop";

let seedPromise: Promise<void> | null = null;

/**
 * Идемпотентно зарежда услуги и майстори (upsert по slug —
 * винаги синхронизира базата с актуалния каталог).
 */
export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = doSeed().catch((err) => {
      seedPromise = null; // опитай пак при следваща заявка
      throw err;
    });
  }
  return seedPromise;
}

async function doSeed() {
  for (const s of SERVICE_CATALOG) {
    await db
      .insert(services)
      .values(s)
      .onConflictDoUpdate({
        target: services.slug,
        set: {
          name: s.name,
          description: s.description,
          category: s.category,
          priceLabel: s.priceLabel,
          priceCents: s.priceCents,
          durationMinutes: s.durationMinutes,
          sortOrder: s.sortOrder,
        },
      });
  }

  for (const b of BARBER_CATALOG) {
    await db
      .insert(barbers)
      .values(b)
      .onConflictDoUpdate({
        target: barbers.slug,
        set: {
          name: b.name,
          years: b.years,
          quote: b.quote,
          imageUrl: b.imageUrl,
          specialties: b.specialties,
          sortOrder: b.sortOrder,
        },
      });
  }
}
