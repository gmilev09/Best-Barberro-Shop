import { desc, eq } from "drizzle-orm";
import { AdminDashboard, type AdminBooking } from "@/components/admin-dashboard";
import { AdminLogin } from "@/components/admin-login";
import { StaticAdmin } from "@/components/static-admin";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import { barbers, bookings, services } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { SHOP, nowInShop } from "@/lib/shop";

export const metadata = {
  title: "Контролен панел — Best Barberro Shop",
  robots: { index: false, follow: false },
};

const IS_STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export default async function AdminPage() {
  // Статичен режим (GitHub Pages) — демонстрационен панел с localStorage.
  if (IS_STATIC) {
    return <StaticAdmin />;
  }

  const authed = await isAdmin();

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-5">
        <AdminLogin showHint={!process.env.ADMIN_PASSCODE} />
      </main>
    );
  }

  await ensureSeeded();
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
      serviceName: services.name,
      servicePrice: services.priceLabel,
      servicePriceCents: services.priceCents,
      barberName: barbers.name,
    })
    .from(bookings)
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .innerJoin(barbers, eq(bookings.barberId, barbers.id))
    .orderBy(desc(bookings.bookingDate), desc(bookings.startTime));

  const data: AdminBooking[] = rows.map((r) => ({
    ...r,
    ref: `BBS-${String(r.id).padStart(4, "0")}`,
  }));

  return (
    <main className="min-h-screen bg-ink">
      <AdminDashboard
        initialBookings={data}
        today={nowInShop().date}
        shopName={SHOP.name}
      />
    </main>
  );
}
