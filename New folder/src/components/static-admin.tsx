"use client";

import {
  BadgeDollarSign,
  CalendarDays,
  Check,
  Clock3,
  Lock,
  LogOut,
  RefreshCw,
  Scissors,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  deleteLocalBooking,
  readLocalBookings,
  staticAdminLoggedIn,
  staticAdminLogin,
  staticAdminLogout,
  updateLocalBooking,
  type LocalBooking,
} from "@/lib/local-bookings";
import { SHOP, nowInShop, withBase } from "@/lib/shop";

const STATUS_FILTERS = [
  { key: "all", label: "Всички" },
  { key: "pending", label: "Чакащи" },
  { key: "confirmed", label: "Потвърдени" },
  { key: "cancelled", label: "Отменени" },
] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "Чакащ",
  confirmed: "Потвърден",
  cancelled: "Отменен",
};

const statusStyles: Record<string, string> = {
  pending: "border-amber-400/50 text-amber-300 bg-amber-400/10",
  confirmed: "border-emerald-400/50 text-emerald-300 bg-emerald-400/10",
  cancelled: "border-ember/60 text-ember bg-ember/10",
};

function humanDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("bg-BG", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** Демонстрационен панел за статичния (GitHub Pages) режим. */
export function StaticAdmin() {
  const [logged, setLogged] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [list, setList] = useState<LocalBooking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    setLogged(staticAdminLoggedIn());
    setList(readLocalBookings());
  }, []);

  const today = useMemo(() => nowInShop().date, []);

  if (logged === null) {
    return <div className="flex min-h-screen items-center justify-center bg-ink" />;
  }

  if (!logged) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-5">
        <div className="w-full max-w-md border border-line bg-coal/50 p-8 md:p-10">
          <div className="pole-stripes mb-8 h-1.5 w-full" />
          <span className="flex h-12 w-12 items-center justify-center border border-brass/60 text-brass">
            <Scissors className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <h1 className="mt-6 font-display text-5xl uppercase tracking-wide text-bone">
            Контролен <span className="text-brass">панел</span>
          </h1>
          <p className="mt-2 text-sm text-smoke">
            Демо режим (GitHub Pages) — резервациите се пазят в браузъра на това
            устройство.
          </p>
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              const ok = staticAdminLogin(passcode);
              setError(!ok);
              if (ok) {
                setLogged(true);
                setList(readLocalBookings());
              }
            }}
          >
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-smoke">
                Код за достъп
              </span>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-smoke" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full border border-line bg-ink py-3.5 pl-11 pr-4 text-bone placeholder:text-smoke/50 focus:border-brass focus:outline-none"
                />
              </div>
            </label>
            {error && (
              <p className="mt-4 border border-ember/50 bg-ember/10 px-4 py-3 text-sm text-bone">
                Грешен код.
              </p>
            )}
            <button
              type="submit"
              className="mt-6 w-full bg-brass py-4 font-display text-xl tracking-[0.1em] text-ink transition-colors hover:bg-bone"
            >
              ВЛЕЗ В САЛОНА
            </button>
          </form>
          <p className="mt-6 text-center text-[11px] uppercase tracking-[0.18em] text-smoke">
            Демо код: <span className="text-brass">legends</span>
          </p>
          <a
            href={withBase("/")}
            className="mt-4 block text-center text-[11px] uppercase tracking-[0.18em] text-smoke transition-colors hover:text-brass"
          >
            ← Обратно към сайта
          </a>
        </div>
      </div>
    );
  }

  const filtered = list.filter(
    (b) =>
      (statusFilter === "all" || b.status === statusFilter) &&
      (!dateFilter || b.date === dateFilter),
  );

  const todayCount = list.filter((b) => b.date === today && b.status !== "cancelled").length;
  const pending = list.filter((b) => b.status === "pending").length;
  const weekEnd = new Date(`${today}T12:00:00Z`);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
  const weekEndIso = weekEnd.toISOString().slice(0, 10);
  const weekRevenue =
    list
      .filter((b) => b.status !== "cancelled" && b.date >= today && b.date <= weekEndIso)
      .reduce((sum, b) => sum + b.priceCents, 0) / 100;

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-10">
        <div className="border border-brass/40 bg-brass/10 px-5 py-3.5 text-center text-[11px] uppercase tracking-[0.2em] text-brass">
          Демо режим — резервациите се пазят в браузъра на това устройство (GitHub Pages)
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-7">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center border border-brass/60 text-brass">
              <Scissors className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <h1 className="font-display text-4xl uppercase tracking-wide text-bone">
                Контролен <span className="text-brass">панел</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.28em] text-smoke">
                {SHOP.name} · Демо тефтер
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setList(readLocalBookings())}
              className="flex h-11 items-center gap-2 border border-line px-4 text-[11px] uppercase tracking-[0.18em] text-sand transition-colors hover:border-brass hover:text-brass"
            >
              <RefreshCw className="h-4 w-4" /> Обнови
            </button>
            <a
              href={withBase("/")}
              className="flex h-11 items-center border border-line px-4 text-[11px] uppercase tracking-[0.18em] text-sand transition-colors hover:border-brass hover:text-brass"
            >
              Към сайта
            </a>
            <button
              onClick={() => {
                staticAdminLogout();
                setLogged(false);
              }}
              className="flex h-11 items-center gap-2 border border-ember/50 px-4 text-[11px] uppercase tracking-[0.18em] text-ember transition-colors hover:bg-ember hover:text-bone"
            >
              <LogOut className="h-4 w-4" /> Изход
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-3">
          {[
            { icon: CalendarDays, label: "Столове днес", value: String(todayCount) },
            { icon: Clock3, label: "Чакащи потвърждение", value: String(pending) },
            {
              icon: BadgeDollarSign,
              label: "Очакван оборот · 7 дни",
              value: `${weekRevenue.toLocaleString("bg-BG")} лв`,
            },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-5 bg-ink p-6">
              <s.icon className="h-6 w-6 text-brass" strokeWidth={1.25} />
              <div>
                <div className="font-display text-4xl text-bone">{s.value}</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-smoke">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                statusFilter === s.key
                  ? "border-brass bg-brass/10 text-brass"
                  : "border-line text-smoke hover:border-sand/40 hover:text-sand"
              }`}
            >
              {s.label}
            </button>
          ))}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-line bg-ink px-4 py-2 text-sm text-sand [color-scheme:dark] focus:border-brass focus:outline-none"
          />
          {(dateFilter || statusFilter !== "all") && (
            <button
              onClick={() => {
                setDateFilter("");
                setStatusFilter("all");
              }}
              className="text-[11px] uppercase tracking-[0.18em] text-ember hover:text-bone"
            >
              Изчисти
            </button>
          )}
          <span className="ml-auto text-[11px] uppercase tracking-[0.18em] text-smoke">
            {filtered.length} {filtered.length === 1 ? "резервация" : "резервации"}
          </span>
        </div>

        <div className="mt-5 overflow-x-auto border border-line">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-coal/60 text-[10px] uppercase tracking-[0.24em] text-smoke">
                <th className="px-5 py-4 font-normal">Реф.</th>
                <th className="px-5 py-4 font-normal">Клиент</th>
                <th className="px-5 py-4 font-normal">Услуга</th>
                <th className="px-5 py-4 font-normal">Майстор</th>
                <th className="px-5 py-4 font-normal">Кога</th>
                <th className="px-5 py-4 font-normal">Статус</th>
                <th className="px-5 py-4 text-right font-normal">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-smoke">
                    <Scissors className="mx-auto mb-4 h-6 w-6 text-smoke/50" />
                    Все още няма резервации — запази час от страницата за
                    резервации и той ще се появи тук.
                  </td>
                </tr>
              )}
              {[...filtered]
                .sort((a, b) => (a.date === b.date ? b.time.localeCompare(a.time) : b.date.localeCompare(a.date)))
                .map((b) => (
                  <tr
                    key={b.id}
                    className={`border-b border-line/60 transition-colors last:border-none hover:bg-carbon/40 ${
                      b.status === "cancelled" ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-display text-lg tracking-wider text-brass">
                      {b.ref}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-bone">{b.name}</div>
                      <a href={`tel:${b.phone}`} className="text-xs text-smoke transition-colors hover:text-brass">
                        {b.phone}
                      </a>
                      {b.notes && (
                        <div className="mt-1 max-w-[220px] truncate font-serif text-xs italic text-smoke" title={b.notes}>
                          „{b.notes}“
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-bone">{b.service}</div>
                      <div className="text-xs text-smoke">
                        {b.priceLabel} · {b.durationMinutes} мин
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sand">{b.barber}</td>
                    <td className="px-5 py-4">
                      <div className="text-bone">{humanDate(b.date)}</div>
                      <div className="text-xs text-smoke">{b.time}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${statusStyles[b.status] ?? "border-line text-smoke"}`}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {b.status === "pending" && (
                          <button
                            onClick={() => {
                              updateLocalBooking(b.id, { status: "confirmed" });
                              setList(readLocalBookings());
                            }}
                            title="Потвърди"
                            className="flex h-9 w-9 items-center justify-center border border-emerald-400/40 text-emerald-300 transition-colors hover:bg-emerald-400 hover:text-ink"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            onClick={() => {
                              updateLocalBooking(b.id, { status: "cancelled" });
                              setList(readLocalBookings());
                            }}
                            title="Отмени"
                            className="flex h-9 w-9 items-center justify-center border border-ember/50 text-ember transition-colors hover:bg-ember hover:text-bone"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        {b.status === "cancelled" && (
                          <button
                            onClick={() => {
                              deleteLocalBooking(b.id);
                              setList(readLocalBookings());
                            }}
                            title="Изтрий записа"
                            className="flex h-9 w-9 items-center justify-center border border-line text-smoke transition-colors hover:border-ember hover:text-ember"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-smoke">
          Пълноценният вариант с база данни (PostgreSQL) се пуска локално или на
          хостинг със сървър — виж README.
        </p>
      </div>
    </div>
  );
}
