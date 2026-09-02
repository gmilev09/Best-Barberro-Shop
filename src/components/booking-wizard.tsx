"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  Phone,
  Scissors,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { BarberDTO, ServiceDTO } from "@/lib/data";
import {
  addLocalBooking,
  barberFreeAt,
  readLocalBookings,
  toMinutesOfDay,
} from "@/lib/local-bookings";
import { SHOP, formatMinutes } from "@/lib/shop";
import {
  buildSlots,
  isClosedDay,
  slotIsFree,
  type ExistingBooking,
} from "@/lib/slots";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Статичен режим (GitHub Pages) — без сървър, резервации в браузъра. */
const IS_STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

type Step = 0 | 1 | 2 | 3 | 4;

interface Slot {
  time: string;
  available: boolean;
}

interface Confirmation {
  ref: string;
  service: string;
  priceLabel: string;
  barber: string;
  date: string;
  time: string;
}

const STEP_LABELS = ["Услуга", "Майстор", "Дата и час", "Данни"];
const DOW_BG = ["НЕД", "ПОН", "ВТ", "СР", "ЧЕТ", "ПЕТ", "СЪБ"];

function humanDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("bg-BG", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function nextDays(count: number) {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: SHOP.timezone });
  const today = fmt.format(new Date());
  const days: { iso: string; dow: string; num: number; month: string; closed: boolean }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + i);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      iso,
      dow: DOW_BG[d.getUTCDay()],
      num: d.getUTCDate(),
      month: d.toLocaleDateString("bg-BG", { timeZone: "UTC", month: "short" }),
      closed: isClosedDay(iso),
    });
  }
  return days;
}

const toLabel = (t: string) =>
  formatMinutes(Number(t.split(":")[0]) * 60 + Number(t.split(":")[1]));

export function BookingWizard({
  services,
  barbers,
}: {
  services: ServiceDTO[];
  barbers: BarberDTO[];
}) {
  const params = useSearchParams();

  const initialService =
    services.find((s) => s.slug === params.get("service")) ?? null;
  const initialBarberParam = params.get("barber");
  const initialBarber =
    barbers.find((b) => b.slug === initialBarberParam) ??
    (initialBarberParam === "any" ? "any" : null);

  const [step, setStep] = useState<Step>(
    initialService ? (initialBarber ? 2 : 1) : 0,
  );
  const [service, setService] = useState<ServiceDTO | null>(initialService);
  const [barber, setBarber] = useState<BarberDTO | "any" | null>(initialBarber);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const [serverSlots, setServerSlots] = useState<Slot[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const reloadSlots = useCallback(() => {
    setSlotsLoading(true);
    setSlotsError(null);
    setReloadToken((t) => t + 1);
  }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const days = useMemo(() => nextDays(14), []);
  const dateClosed = date ? isClosedDay(date) : false;

  const staticSlots = useMemo(() => {
    if (!IS_STATIC || !service || !date || isClosedDay(date)) return null;
    const duration = service.durationMinutes;
    const target = barber && barber !== "any" ? barber.slug : null;
    const busyOf = (slug: string): ExistingBooking[] =>
      readLocalBookings()
        .filter(
          (x) => x.barberSlug === slug && x.date === date && x.status !== "cancelled",
        )
        .map((x) => ({ startTime: x.time, durationMinutes: x.durationMinutes }));
    return buildSlots(date, duration, (start) => {
      if (target) return slotIsFree(start, duration, busyOf(target));
      return barbers.some((b) => slotIsFree(start, duration, busyOf(b.slug)));
    });
  }, [service, date, barber, barbers]);

  const slots = IS_STATIC ? staticSlots : serverSlots;

  useEffect(() => {
    if (IS_STATIC || !service || !date || isClosedDay(date) || step !== 2) {
      return;
    }

    let ignore = false;
    const barberSlug = !barber || barber === "any" ? "any" : barber.slug;

    fetch(`/api/availability?date=${date}&service=${service.slug}&barber=${barberSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("load_failed");
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          setServerSlots(data.slots as Slot[]);
          setSlotsError(null);
          setSlotsLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setServerSlots(null);
          setSlotsError("Не успяхме да заредим свободните часове — опитай отново.");
          setSlotsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [service, date, barber, step, reloadToken]);

  const canNext =
    (step === 0 && !!service) ||
    (step === 1 && !!barber) ||
    (step === 2 && !!date && !!time) ||
    step === 3;

  const barberLabel = !barber
    ? null
    : barber === "any"
      ? "Първият свободен майстор"
      : barber.name;

  async function submit() {
    if (!service || !date || !time) return;
    setError(null);

    if (IS_STATIC) {
      const duration = service.durationMinutes;
      const startMin = toMinutesOfDay(time);
      const chosen =
        !barber || barber === "any"
          ? barbers.find((b) => barberFreeAt(b.slug, date, startMin, duration))
          : barber;
      if (!chosen) {
        setError("Няма свободен майстор в този час — изберете друг слот.");
        setStep(2);
        return;
      }
      if (!barberFreeAt(chosen.slug, date, startMin, duration)) {
        setError(`${chosen.name} вече е зает в този час.`);
        setStep(2);
        return;
      }
      const rec = addLocalBooking({
        serviceSlug: service.slug,
        service: service.name,
        priceLabel: service.priceLabel,
        priceCents: service.priceCents,
        barberSlug: chosen.slug,
        barber: chosen.name,
        date,
        time,
        durationMinutes: duration,
        name,
        phone,
        email,
        notes,
      });
      setConfirmation({
        ref: rec.ref,
        service: rec.service,
        priceLabel: rec.priceLabel,
        barber: rec.barber,
        date: rec.date,
        time: rec.time,
      });
      setStep(4);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: service.slug,
          barber: !barber || barber === "any" ? "any" : barber.slug,
          date,
          time,
          name,
          phone,
          email,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Нещо се обърка. Обади се в салона.");
        if (res.status === 409) {
          setStep(2);
          reloadSlots();
        }
        return;
      }
      setConfirmation(data.booking as Confirmation);
      setStep(4);
    } catch {
      setError("Проблем с връзката — опитай пак или се обади в салона.");
    } finally {
      setSubmitting(false);
    }
  }

  const detailsValid = name.trim().length >= 2 && phone.replace(/\D/g, "").length >= 7;

  return (
    <div className="mx-auto grid max-w-[1400px] gap-10 px-5 md:px-10 lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* Релс на прогреса */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <ol className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-0">
          {STEP_LABELS.map((label, i) => {
            const done = step > i || step === 4;
            const active = step === i;
            return (
              <li
                key={label}
                className="flex shrink-0 items-center gap-4 border-line lg:border-l lg:py-5 lg:pl-6"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center border font-display text-lg transition-colors duration-300 ${
                    done
                      ? "border-brass bg-brass text-ink"
                      : active
                        ? "border-brass text-brass"
                        : "border-line text-smoke"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : `0${i + 1}`}
                </span>
                <span
                  className={`hidden text-[11px] uppercase tracking-[0.2em] sm:block ${
                    active ? "text-bone" : done ? "text-sand" : "text-smoke"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Обобщение */}
        {step < 4 && (
          <div className="mt-8 hidden border border-line bg-coal/50 p-6 lg:block">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-smoke">
              Твоят час
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-smoke">
                  <Scissors className="h-3.5 w-3.5" /> Услуга
                </dt>
                <dd className="text-right text-bone">{service?.name ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-smoke">
                  <User className="h-3.5 w-3.5" /> Майстор
                </dt>
                <dd className="text-right text-bone">{barberLabel ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-smoke">
                  <CalendarDays className="h-3.5 w-3.5" /> Дата
                </dt>
                <dd className="text-right text-bone">{date ? humanDate(date) : "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-smoke">
                  <Clock className="h-3.5 w-3.5" /> Час
                </dt>
                <dd className="text-right text-bone">{time ? toLabel(time) : "—"}</dd>
              </div>
            </dl>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-smoke">
                Цена
              </span>
              <span className="font-display text-2xl text-brass">
                {service?.priceLabel ?? "—"}
              </span>
            </div>
            {IS_STATIC && (
              <p className="mt-4 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-smoke/70">
                Демо режим · резервацията се пази в браузъра
              </p>
            )}
          </div>
        )}
      </aside>

      {/* Панели */}
      <div className="min-h-[480px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <Panel key="s0" title="Избери услуга" eyebrow="Стъпка 01 — Менюто">
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => {
                      setService(s);
                      setStep(1);
                    }}
                    className={`group flex items-center justify-between gap-4 border p-5 text-left transition-all duration-300 ${
                      service?.slug === s.slug
                        ? "border-brass bg-brass/10"
                        : "border-line hover:border-sand/40 hover:bg-carbon/50"
                    }`}
                  >
                    <span>
                      <span className="block font-display text-2xl uppercase tracking-wide text-bone group-hover:text-brass">
                        {s.name}
                      </span>
                      <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-smoke">
                        {s.durationMinutes} мин · {s.category === "chair" ? "Стол №1" : "Цвят и грижа"}
                      </span>
                    </span>
                    <span className="font-display text-xl text-brass">{s.priceLabel}</span>
                  </button>
                ))}
              </div>
            </Panel>
          )}

          {step === 1 && (
            <Panel key="s1" title="Избери майстор" eyebrow="Стъпка 02 — Екипът">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <button
                  onClick={() => {
                    setBarber("any");
                    setStep(2);
                  }}
                  className={`flex items-center gap-4 border p-5 text-left transition-all duration-300 ${
                    barber === "any"
                      ? "border-brass bg-brass/10"
                      : "border-dashed border-sand/40 hover:border-brass hover:bg-carbon/50"
                  }`}
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-line text-brass">
                    <Users className="h-6 w-6" strokeWidth={1.25} />
                  </span>
                  <span>
                    <span className="block font-display text-2xl uppercase tracking-wide text-bone">
                      Първи свободен
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-smoke">
                      Най-бързият път към стола
                    </span>
                  </span>
                </button>
                {barbers.map((b) => (
                  <button
                    key={b.slug}
                    onClick={() => {
                      setBarber(b);
                      setStep(2);
                    }}
                    className={`group flex items-center gap-4 border p-4 text-left transition-all duration-300 ${
                      barber !== "any" && barber?.slug === b.slug
                        ? "border-brass bg-brass/10"
                        : "border-line hover:border-sand/40 hover:bg-carbon/50"
                    }`}
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden border border-line">
                      <Image
                        src={b.imageUrl}
                        alt={b.name}
                        fill
                        className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        sizes="56px"
                      />
                    </span>
                    <span>
                      <span className="block font-display text-2xl uppercase tracking-wide text-bone group-hover:text-brass">
                        {b.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-smoke">
                        {b.years} г. опит
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </Panel>
          )}

          {step === 2 && (
            <Panel key="s2" title="Дата и час" eyebrow="Стъпка 03 — Графикът">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {days.map((d) => (
                  <button
                    key={d.iso}
                    onClick={() => {
                      setDate(d.iso);
                      setTime(null);
                      setServerSlots(null);
                      if (!IS_STATIC && !d.closed) {
                        setSlotsLoading(true);
                        setSlotsError(null);
                      }
                    }}
                    className={`flex w-[72px] shrink-0 flex-col items-center border px-2 py-4 transition-all duration-300 ${
                      date === d.iso
                        ? "border-brass bg-brass text-ink"
                        : d.closed
                          ? "border-line/50 opacity-50 hover:border-sand/40"
                          : "border-line hover:border-sand/40"
                    }`}
                  >
                    <span className={`text-[10px] tracking-[0.2em] ${date === d.iso ? "text-ink/70" : "text-smoke"}`}>
                      {d.dow}
                    </span>
                    <span className="mt-1 font-display text-3xl">{d.num}</span>
                    <span className={`text-[10px] uppercase tracking-[0.16em] ${date === d.iso ? "text-ink/70" : "text-smoke"}`}>
                      {d.closed ? "почивен" : d.month}
                    </span>
                  </button>
                ))}
              </div>

              {!date ? (
                <EmptyNote>Избери ден, за да видиш свободните столове.</EmptyNote>
              ) : dateClosed ? (
                <div className="border border-line bg-coal/50 p-6 text-sm leading-relaxed text-sand">
                  <span className="font-serif text-lg italic text-brass">Почивен ден. </span>
                  В неделя и понеделник почива и ножът — избери ден от вторник до
                  събота (09:30 – 19:00).
                </div>
              ) : slotsLoading ? (
                <div className="flex items-center gap-3 border border-line p-6 text-sand">
                  <Loader2 className="h-5 w-5 animate-spin text-brass" />
                  Проверяваме тефтера…
                </div>
              ) : slotsError ? (
                <div className="flex items-center justify-between gap-4 border border-ember/50 bg-ember/10 p-6 text-sm text-bone">
                  {slotsError}
                  <button onClick={reloadSlots} className="border border-line px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-brass hover:border-brass">
                    Отново
                  </button>
                </div>
              ) : slots ? (
                slots.every((s) => !s.available) ? (
                  <EmptyNote>
                    Всичко е заето в този ден — пробвай друг или се обади за място в последния момент.
                  </EmptyNote>
                ) : (
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        disabled={!s.available}
                        onClick={() => setTime(s.time)}
                        className={`border py-3 font-display text-lg tracking-wider transition-all duration-200 ${
                          time === s.time
                            ? "border-brass bg-brass text-ink"
                            : s.available
                              ? "border-line text-bone hover:border-brass hover:text-brass"
                              : "cursor-not-allowed border-line/50 text-smoke/40 line-through"
                        }`}
                      >
                        {toLabel(s.time)}
                      </button>
                    ))}
                  </div>
                )
              ) : null}

              <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-smoke">
                Вт – Съб 09:30 – 19:00 · Нед и Пон почивни · Резервации поне 1 час напред
              </p>
            </Panel>
          )}

          {step === 3 && (
            <Panel key="s3" title="Твоите данни" eyebrow="Стъпка 04 — Почти готово">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Име и фамилия *">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван Петров"
                    className="w-full border border-line bg-ink px-4 py-3.5 text-bone placeholder:text-smoke/50 focus:border-brass focus:outline-none"
                  />
                </Field>
                <Field label="Телефон *">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="089 555 1234"
                    inputMode="tel"
                    className="w-full border border-line bg-ink px-4 py-3.5 text-bone placeholder:text-smoke/50 focus:border-brass focus:outline-none"
                  />
                </Field>
                <Field label="Имейл (по желание)" className="sm:col-span-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ti@example.com"
                    inputMode="email"
                    className="w-full border border-line bg-ink px-4 py-3.5 text-bone placeholder:text-smoke/50 focus:border-brass focus:outline-none"
                  />
                </Field>
                <Field label="Бележка за бръснаря (по желание)" className="sm:col-span-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Фейд 3/2/1, брадата остави по-къдрава…"
                    rows={3}
                    className="w-full resize-none border border-line bg-ink px-4 py-3.5 text-bone placeholder:text-smoke/50 focus:border-brass focus:outline-none"
                  />
                </Field>
              </div>

              {error && (
                <p className="mt-5 border border-ember/50 bg-ember/10 px-5 py-4 text-sm text-bone">
                  {error}
                </p>
              )}

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                <p className="text-sm text-smoke">
                  Ако нещо се промени, ще се обадим на{" "}
                  <span className="text-sand">{phone || "твоя номер"}</span>.
                </p>
                <button
                  onClick={submit}
                  disabled={!detailsValid || submitting}
                  className={`card-sheen flex h-14 items-center gap-3 px-8 font-display text-xl tracking-[0.1em] transition-colors ${
                    detailsValid && !submitting
                      ? "bg-brass text-ink hover:bg-bone"
                      : "cursor-not-allowed bg-carbon text-smoke"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> ЗАПАЗВАМЕ СТОЛА…
                    </>
                  ) : (
                    <>
                      ПОТВЪРДИ ЧАСА <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
                    </>
                  )}
                </button>
              </div>
            </Panel>
          )}

          {step === 4 && confirmation && (
            <motion.div
              key="s4"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="border border-brass/50 bg-coal/60 p-8 text-center md:p-14"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 200, damping: 14 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-brass bg-brass/10"
              >
                <CheckCircle2 className="h-10 w-10 text-brass" strokeWidth={1.25} />
              </motion.div>
              <h3 className="mt-8 font-display text-6xl uppercase tracking-wide text-bone md:text-7xl">
                Часът е <span className="text-brass">твой.</span>
              </h3>
              <p className="mt-3 font-serif text-xl italic text-sand">
                Столът ще те чака — влизаш като легенда.
              </p>

              <div className="mx-auto mt-10 grid max-w-2xl gap-px border border-line bg-line text-left sm:grid-cols-2">
                {[
                  ["Референция", confirmation.ref],
                  ["Услуга", `${confirmation.service} · ${confirmation.priceLabel}`],
                  ["Майстор", confirmation.barber],
                  ["Кога", `${humanDate(confirmation.date)} · ${toLabel(confirmation.time)}`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-ink p-5">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-smoke">{k}</div>
                    <div className="mt-1.5 font-display text-2xl tracking-wide text-bone">{v}</div>
                  </div>
                ))}
              </div>

              <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-smoke">
                Покажи референцията на рецепция. Закъсняваш? Обади се на{" "}
                <a href={SHOP.phoneHref} className="text-brass">
                  {SHOP.phoneDisplay}
                </a>{" "}
                и ще задържим стола.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="flex items-center border border-line px-7 py-3.5 font-display text-lg tracking-[0.1em] text-bone transition-colors hover:border-brass hover:text-brass"
                >
                  КЪМ НАЧАЛОТО
                </Link>
                <button
                  onClick={() => {
                    setStep(0);
                    setService(null);
                    setBarber(null);
                    setDate(null);
                    setTime(null);
                    setConfirmation(null);
                  }}
                  className="flex items-center gap-2 border border-brass/60 px-7 py-3.5 font-display text-lg tracking-[0.1em] text-brass transition-colors hover:bg-brass hover:text-ink"
                >
                  <Sparkles className="h-4 w-4" /> ОЩЕ ЕДИН ЧАС
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Долна навигация */}
        {step < 4 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => (Math.max(0, s - 1) as Step))}
              disabled={step === 0}
              className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                step === 0 ? "cursor-not-allowed text-smoke/40" : "text-sand hover:text-brass"
              }`}
            >
              <ArrowLeft className="h-4 w-4" /> Назад
            </button>
            {step < 3 && (
              <button
                onClick={() => canNext && setStep((s) => (Math.min(3, s + 1) as Step))}
                className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  canNext ? "text-sand hover:text-brass" : "cursor-not-allowed text-smoke/40"
                }`}
              >
                Напред <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <span className="text-[11px] uppercase tracking-[0.3em] text-brass">{eyebrow}</span>
      <h2 className="mb-8 mt-2 font-display text-5xl uppercase tracking-wide text-bone md:text-6xl">
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-smoke">
        {label}
      </span>
      {children}
    </label>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border border-dashed border-line p-6 text-sm text-smoke">
      <Phone className="h-4 w-4 text-brass" />
      {children}
    </div>
  );
}
