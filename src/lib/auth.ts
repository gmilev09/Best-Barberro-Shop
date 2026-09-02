import { cookies } from "next/headers";

export const ADMIN_COOKIE = "bbs_admin";
const COOKIE_VALUE = "granted";

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === COOKIE_VALUE;
}

export function adminCookieValue() {
  return COOKIE_VALUE;
}
