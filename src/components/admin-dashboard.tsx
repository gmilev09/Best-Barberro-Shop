"use client";

import {
  BadgeDollarSign,
  CalendarDays,
  Check,
  Clock3,
  Loader2,
  LogOut,
  RefreshCw,
  Scissors,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatMinutes } from "@/lib/shop";

export interface AdminBooking {
  id: number;
  ref: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  bookingDate: string;
  startTime: string;
  durationMinutes: number;
  notes: string | null;
  status: string;
  serviceName: string;
  servicePrice: string;
  servicePriceCents: number;
  barberName: string;
}

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

function timeLabel(t: string) {
  const [h, m] = t.split(":").map(Number);
  return formatMinutes(h * 60 + m);
}

function humanDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("bg-BG", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const statusStyles: Record<string, string> = {
  pending: "border-amber-400/50 text-amber-300 bg-amber-400/10",
  confirmed: "border-emerald-400/50 text-emerald-300 bg-emerald-400/10",
  cancelled: "border-ember/60 text-ember bg-ember/10",
};

export function AdminDashboard({
  initialBookings,
  today,
  shopName,
}: {
  initialBookings: AdminBooking[];
  today: string;
  shopName: string;
}) {
  const router = useRouter();
  const [list, setList] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(
    () =>
      list.filter(
        (b) =>
          (statusFilter === "all" || b.status === statusFilter) &&
          (!dateFilter || b.bookingDate === dateFilter),
      ),
    [list, statusFilter, dateFilter],
  );

  const stats = useMemo(() => {
    const todayRows = list.filter((b) => b.bookingDate === today && b.status !== "cancelled");
    const pending = list.filter((b) => b.status === "pending").length;
    const weekEnd = new Date(`${today}T12:00:00Z`);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
    const weekEndIso = weekEnd.toISOString().slice(0, 10);
    const weekRevenue = list
      .filter((b) => b.status !== "cancelled" && b.bookingDate >= today && b.bookingDate <= weekEndIso)
      .reduce((sum, b) => sum + b.servicePriceCents, 0);
    return { todayCount: todayRows.length, pending, weekRevenue: weekRevenue / 100 };
  }, [list, today]);

  async function setStatus(id: number, status: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setList((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: number) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setList((prev) => prev.filter((b) => b.id !== id));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function refresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setList(
          (data.bookings as Omit<AdminBooking, "ref">[]).map((b) => ({
            ...b,
            ref: `BBS-${String(b.id).padStart(4, "0")}`,
          })),
        );
      }
    } finally {
      setRefreshing(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-10">
      {/* Горна лента */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-7">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center border border-brass/60 text-brass">
            <Scissors className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <h1 className="font-display text-4xl uppercase tracking-wide text-bone">
              Контролен <span className="text-brass">панел</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.28em] text-smoke">
              {shopName} · Тефтер с часове
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="flex h-11 items-center gap-2 border border-line px-4 text-[11px] uppercase tracking-[0.18em] text-sand transition-colors hover:border-brass hover:text-brass"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Обнови
          </button>
          <Link
            href="/"
            className="flex h-11 items-center border border-line px-4 text-[11px] uppercase tracking-[0.18em] text-sand transition-colors hover:border-brass hover:text-brass"
          >
            Към сайта
          </Link>
          <button
            onClick={logout}
            className="flex h-11 items-center gap-2 border border-ember/50 px-4 text-[11px] uppercase tracking-[0.18em] text-ember transition-colors hover:bg-ember hover:text-bone"
          >
            <LogOut className="h-4 w-4" /> Изход
          </button>
        </div>
      </div>

      {/* Статистики */}
      <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-3">
        {[
          { icon: CalendarDays, label: "Столове днес", value: String(stats.todayCount) },
          { icon: Clock3, label: "Чакащи потвърждение", value: String(stats.pending) },
          {
            icon: BadgeDollarSign,
            label: "Очакван оборот · 7 дни",
            value: `${stats.weekRevenue.toLocaleString("bg-BG")} лв`,
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

      {/* Филтри */}
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

      {/* Таблица */}
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
                  Няма резервации по тези филтри — тефтерът е чист.
                </td>
              </tr>
            )}
            {filtered.map((b) => (
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
                  <div className="text-bone">{b.customerName}</div>
                  <a
                    href={`tel:${b.customerPhone}`}
                    className="text-xs text-smoke transition-colors hover:text-brass"
                  >
                    {b.customerPhone}
                  </a>
                  {b.notes && (
                    <div className="mt-1 max-w-[220px] truncate font-serif text-xs italic text-smoke" title={b.notes}>
                      „{b.notes}“
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="text-bone">{b.serviceName}</div>
                  <div className="text-xs text-smoke">
                    {b.servicePrice} · {b.durationMinutes} мин
                  </div>
                </td>
                <td className="px-5 py-4 text-sand">{b.barberName}</td>
                <td className="px-5 py-4">
                  <div className="text-bone">{humanDate(b.bookingDate)}</div>
                  <div className="text-xs text-smoke">{timeLabel(b.startTime)}</div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block border px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${statusStyles[b.status] ?? "border-line text-smoke"}`}
                  >
                    {STATUS_LABELS[b.status] ?? b.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {busyId === b.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-brass" />
                    ) : (
                      <>
                        {b.status === "pending" && (
                          <button
                            onClick={() => setStatus(b.id, "confirmed")}
                            title="Потвърди"
                            className="flex h-9 w-9 items-center justify-center border border-emerald-400/40 text-emerald-300 transition-colors hover:bg-emerald-400 hover:text-ink"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            onClick={() => setStatus(b.id, "cancelled")}
                            title="Отмени"
                            className="flex h-9 w-9 items-center justify-center border border-ember/50 text-ember transition-colors hover:bg-ember hover:text-bone"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        {b.status === "cancelled" && (
                          <button
                            onClick={() => remove(b.id)}
                            title="Изтрий записа"
                            className="flex h-9 w-9 items-center justify-center border border-line text-smoke transition-colors hover:border-ember hover:text-ember"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-smoke">
        Съвет — отмененият час освобождава слота онлайн веднага. Потвърждавай столовете, щом клиентите се обадят.
      </p>
    </div>
  );
}
