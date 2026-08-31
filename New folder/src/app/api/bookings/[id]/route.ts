import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }
  const body = (await req.json().catch(() => ({}))) as { status?: string };
  const status = body.status ?? "";
  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }
  try {
    const [updated] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, numId))
      .returning({ id: bookings.id, status: bookings.status });
    if (!updated) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ booking: updated });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }
  try {
    await db.delete(bookings).where(eq(bookings.id, numId));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
