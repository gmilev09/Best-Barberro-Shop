import { HOURS, formatMinutes, SHOP } from "@/lib/shop";

/** Клиентски безопасен статус „отворено сега“ според часовата зона на салона. */
export function shopStatus(now: Date = new Date()): {
  open: boolean;
  label: string;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SHOP.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const dow = dayMap[get("weekday")] ?? 0;
  const minutes = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
  const today = HOURS[dow];

  const nextOpenLabel = (fromDow: number) => {
    for (let i = 1; i <= 7; i++) {
      const d = HOURS[(fromDow + i) % 7];
      if (!d.closed) return `Отваря в ${d.short.toLowerCase()} ${formatMinutes(d.open)}`;
    }
    return "Затворено";
  };

  if (!today.closed) {
    if (minutes >= today.open && minutes < today.close) {
      return { open: true, label: `Отворено · до ${formatMinutes(today.close)}` };
    }
    if (minutes < today.open) {
      return { open: false, label: `Отваря днес в ${formatMinutes(today.open)}` };
    }
  }
  return { open: false, label: nextOpenLabel(dow) };
}
