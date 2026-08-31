import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieValue } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { passcode?: string };
  const expected = process.env.ADMIN_PASSCODE ?? "legends";

  if (!body.passcode || body.passcode !== expected) {
    return NextResponse.json({ error: "Incorrect access code." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24h
  });
  return res;
}
