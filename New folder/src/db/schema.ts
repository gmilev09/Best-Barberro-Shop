import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  date,
  index,
} from "drizzle-orm/pg-core";

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "chair" | "color-care"
  priceLabel: text("price_label").notNull(),
  priceCents: integer("price_cents").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const barbers = pgTable("barbers", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  years: integer("years_experience").notNull(),
  quote: text("quote").notNull(),
  imageUrl: text("image_url").notNull(),
  specialties: text("specialties").array().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id),
    barberId: integer("barber_id")
      .notNull()
      .references(() => barbers.id),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email"),
    bookingDate: date("booking_date", { mode: "string" }).notNull(), // YYYY-MM-DD
    startTime: text("start_time").notNull(), // HH:MM 24h
    durationMinutes: integer("duration_minutes").notNull(),
    notes: text("notes"),
    status: text("status").notNull().default("pending"), // pending | confirmed | cancelled
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("bookings_barber_date_idx").on(t.barberId, t.bookingDate)],
);

export type ServiceRow = typeof services.$inferSelect;
export type BarberRow = typeof barbers.$inferSelect;
export type BookingRow = typeof bookings.$inferSelect;
