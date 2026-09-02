import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { getBarbers, getServices } from "@/lib/data";
import { buildSlots, slotIsFree, type ExistingBooking } from "@/lib/slots";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const date = sp.get("date") ?? "";
    const serviceSlug = sp.get("service") ?? "";
    const barberSlug = sp.get("barber") ?? "any";

    const allServices = await getServices();
    const service = allServices.find((s) => s.slug === serviceSlug);
    if (!service) {
      return NextResponse.json({ error: "unknown_service" }, { status: 400 });
    }

    const barberRows = await getBarbers();
    let dayRows: { barberId: number; startTime: string; durationMinutes: number }[] = [];

    try {
      dayRows = await db
        .select({
          barberId: bookings.barberId,
          startTime: bookings.startTime,
          durationMinutes: bookings.durationMinutes,
        })
        .from(bookings)
        .where(and(eq(bookings.bookingDate, date), ne(bookings.status, "cancelled")));
    } catch {
      dayRows = [];
    }

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
  } catch (e) {
    console.error("Availability error:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
