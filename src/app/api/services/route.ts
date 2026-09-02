import { NextResponse } from "next/server";
import { getServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getServices();
  return NextResponse.json({ services: catalog });
}
