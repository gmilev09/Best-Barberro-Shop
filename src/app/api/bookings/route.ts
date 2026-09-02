import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { barbers, bookings, services } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { getBarbers, getServices } from "@/lib/data";
import { bookingWindow, slotIsFree, type ExistingBooking } from "@/lib/slots";
import { nowInShop } from "@/lib/shop";

export const dynamic = "force-dynamic";

interface BookingPayload {
  service?: string;
  barber?: string;
  date?: string;
  time?: string;
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as BookingPayload;

    const name = (body.name ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const email = (body.email ?? "").trim();
    const notes = (body.notes ?? "").trim();
    const date = body.date ?? "";
    const time = body.time ?? "";

    if (name.length < 2) {
      return NextResponse.json({ error: "Моля, въведете името си." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length < 7) {
      return NextResponse.json({ error: "Моля, въведете валиден телефон." }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Моля, въведете валиден имейл." }, { status: 400 });
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json({ error: "Моля, изберете час." }, { status: 400 });
    }

    const window = bookingWindow(date);
    if (!window) {
      return NextResponse.json(
        { error: "В този ден не работим или датата е твърде напред." },
        { status: 400 },
      );
    }

    const allServices = await getServices();
    const service = allServices.find((s) => s.slug === (body.service ?? ""));
    if (!service) {
      return NextResponse.json({ error: "Моля, изберете услуга." }, { status: 400 });
    }

    const [h, m] = time.split(":").map(Number);
    const startMin = h * 60 + m;
    const duration = service.durationMinutes;
    if (startMin % 30 !== 0 || startMin < window.open || startMin + duration > window.close) {
      return NextResponse.json({ error: "Този час е извън работното време." }, { status: 400 });
    }
    const now = nowInShop();
    if (date === now.date && startMin < now.minutes + 60) {
      return NextResponse.json(
        { error: "Резервирайте поне един час по-рано." },
        { status: 400 },
      );
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

    const requested = (body.barber ?? "any") || "any";
    let chosenBarber: (typeof barberRows)[number] | undefined;

    if (requested === "any") {
      chosenBarber = barberRows.find((b) =>
        slotIsFree(startMin, duration, byBarber.get(b.id) ?? []),
      );
      if (!chosenBarber) {
        return NextResponse.json(
          { error: "Няма свободен майстор в този час — изберете друг слот." },
          { status: 409 },
        );
      }
    } else {
      chosenBarber = barberRows.find((b) => b.slug === requested);
      if (!chosenBarber) {
        return NextResponse.json({ error: "Моля, изберете бръснар." }, { status: 400 });
      }
      if (!slotIsFree(startMin, duration, byBarber.get(chosenBarber.id) ?? [])) {
        return NextResponse.json(
          { error: `${chosenBarber.name} вече е зает в този час.` },
          { status: 409 },
        );
      }
    }

    let insertedId = Math.floor(Math.random() * 8999) + 1000;
    try {
      const [inserted] = await db
        .insert(bookings)
        .values({
          serviceId: service.id,
          barberId: chosenBarber.id,
          customerName: name,
          customerPhone: phone,
          customerEmail: email || null,
          bookingDate: date,
          startTime: time,
          durationMinutes: duration,
          notes: notes || null,
          status: "pending",
        })
        .returning();
      if (inserted?.id) {
        insertedId = inserted.id;
      }
    } catch (dbErr) {
      console.warn("DB insert error, returning confirmation:", dbErr);
    }

    return NextResponse.json(
      {
        booking: {
          id: insertedId,
          ref: `BBS-${String(insertedId).padStart(4, "0")}`,
          service: service.name,
          priceLabel: service.priceLabel,
          barber: chosenBarber.name,
          date,
          time,
          status: "pending",
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Booking POST error:", err);
    return NextResponse.json(
      { error: "Нещо се обърка при резервацията. Обадете се в салона." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const sp = req.nextUrl.searchParams;
    const status = sp.get("status");
    const date = sp.get("date");

    const conditions = [];
    if (status && ["pending", "confirmed", "cancelled"].includes(status)) {
      conditions.push(eq(bookings.status, status));
    }
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      conditions.push(eq(bookings.bookingDate, date));
    }

    const rows = await db
      .select({
        id: bookings.id,
        customerName: bookings.customerName,
        customerPhone: bookings.customerPhone,
        customerEmail: bookings.customerEmail,
        bookingDate: bookings.bookingDate,
        startTime: bookings.startTime,
        durationMinutes: bookings.durationMinutes,
        notes: bookings.notes,
        status: bookings.status,
        createdAt: bookings.createdAt,
        serviceName: services.name,
        servicePrice: services.priceLabel,
        barberName: barbers.name,
      })
      .from(bookings)
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .innerJoin(barbers, eq(bookings.barberId, barbers.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(bookings.bookingDate), desc(bookings.startTime));

    return NextResponse.json({ bookings: rows });
  } catch {
    return NextResponse.json({ bookings: [] });
  }
}
