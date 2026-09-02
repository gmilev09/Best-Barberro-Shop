import { NextResponse } from "next/server";
import { getBarbers } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const masters = await getBarbers();
  return NextResponse.json({ barbers: masters });
}
