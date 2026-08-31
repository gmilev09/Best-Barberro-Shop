import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { barbers, bookings, services } from "@/db/schema";
import { buildSlots, slotIsFree, type ExistingBooking } from "@/lib/slots";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await ensureSeeded();
    const sp = req.nextUrl.searchParams;
    const date = sp.get("date") ?? "";
    const serviceSlug = sp.get("service") ?? "";
    const barberSlug = sp.get("barber") ?? "any";

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.slug, serviceSlug))
      .limit(1);
    if (!service) {
      return NextResponse.json({ error: "unknown_service" }, { status: 400 });
    }

    const barberRows = await db.select().from(barbers);
    const dayRows = await db
      .select({
        barberId: bookings.barberId,
        startTime: bookings.startTime,
        durationMinutes: bookings.durationMinutes,
      })
      .from(bookings)
      .where(and(eq(bookings.bookingDate, date), ne(bookings.status, "cancelled")));

    const byBarber = new Map<number, ExistingBooking[]>();
    for (const r of dayRows) {
      const arr = byBarber.get(r.barberId) ?? [];
      arr.push({ startTime: r.startTime, durationMinutes: r.durationMinutes });
      byBarber.set(r.barberId, arr);
    }

    const target =
      barberSlug !== "any"
        ? barberRows.find((b) => b.slug === barberSlug) ?? null
        : null;
    if (barberSlug !== "any" && !target) {
      return NextResponse.json({ error: "unknown_barber" }, { status: 400 });
    }

    const duration = service.durationMinutes;
    const slots = buildSlots(date, duration, (start) => {
      if (target) {
        return slotIsFree(start, duration, byBarber.get(target.id) ?? []);
      }
      return barberRows.some((b) =>
        slotIsFree(start, duration, byBarber.get(b.id) ?? []),
      );
    });

    if (!slots) {
      return NextResponse.json({ error: "date_not_bookable" }, { status: 400 });
    }
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
