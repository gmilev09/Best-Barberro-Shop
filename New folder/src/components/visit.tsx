"use client";

import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { LineReveal, Reveal } from "@/components/reveal";
import { HOURS, SHOP, WEEK_ORDER, formatMinutes } from "@/lib/shop";
import { shopStatus } from "@/lib/status";

export function Visit() {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);
  const [today, setToday] = useState<number>(-1);

  useEffect(() => {
    const update = () => {
      setStatus(shopStatus());
      const dayName = new Intl.DateTimeFormat("en-US", {
        timeZone: SHOP.timezone,
        weekday: "short",
      }).format(new Date());
      const map: Record<string, number> = {
        Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
      };
      setToday(map[dayName] ?? -1);
    };
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="visit" className="relative border-b border-line bg-coal/40">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="mb-14 md:mb-20">
          <Reveal>
            <span className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-brass">
              <span className="h-px w-10 bg-brass/60" /> Намери салона
            </span>
          </Reveal>
          <h2 className="font-display text-6xl uppercase leading-[0.9] tracking-wide text-bone md:text-7xl xl:text-8xl">
            <LineReveal>В центъра —</LineReveal>
            <LineReveal delay={0.12}>
              <span className="text-outline">ул. „Христо</span>{" "}
              <span className="font-serif lowercase italic tracking-normal text-brass">
                Чернопеев“.
              </span>
            </LineReveal>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Reveal className="grid flex-1 gap-px border border-line bg-line sm:grid-cols-2">
              <div className="bg-ink p-7">
                <MapPin className="mb-5 h-5 w-5 text-brass" strokeWidth={1.5} />
                <h3 className="text-[11px] uppercase tracking-[0.3em] text-smoke">
                  Адрес
                </h3>
                <p className="mt-3 font-display text-3xl uppercase leading-tight tracking-wide text-bone">
                  {SHOP.addressLine1}
                </p>
                <p className="mt-1 text-sm text-sand">{SHOP.addressLine2}</p>
                <a
                  href={SHOP.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-brass transition-colors hover:text-bone"
                >
                  <Navigation className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Заведи ме
                </a>
              </div>
              <div className="bg-ink p-7">
                <Phone className="mb-5 h-5 w-5 text-brass" strokeWidth={1.5} />
                <h3 className="text-[11px] uppercase tracking-[0.3em] text-smoke">
                  Запазване на час
                </h3>
                <a
                  href={SHOP.phoneHref}
                  className="mt-3 block font-display text-4xl tracking-wide text-bone transition-colors hover:text-brass"
                >
                  {SHOP.phoneDisplay}
                </a>
                <p className="mt-3 text-sm leading-relaxed text-smoke">
                  Обади се за час още днес — или резервирай онлайн за по-малко
                  от минута.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="border border-line bg-ink p-7 md:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-brass" strokeWidth={1.5} />
                  <span className="font-display text-2xl uppercase tracking-wide text-bone">
                    Работно време
                  </span>
                </span>
                {status && (
                  <span
                    className={`flex items-center gap-2 border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] ${
                      status.open
                        ? "border-emerald-400/40 text-emerald-300"
                        : "border-ember/50 text-ember"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 animate-pulse rounded-full ${
                        status.open ? "bg-emerald-400" : "bg-ember"
                      }`}
                    />
                    {status.label}
                  </span>
                )}
              </div>
              <ul>
                {WEEK_ORDER.map((d) => {
                  const h = HOURS[d];
                  const isToday = d === today;
                  return (
                    <li
                      key={h.day}
                      className={`flex items-baseline justify-between border-b border-line/70 py-3 text-sm last:border-none ${
                        isToday ? "text-brass" : "text-sand"
                      }`}
                    >
                      <span className="flex items-center gap-3 uppercase tracking-[0.2em]">
                        {h.day}
                        {isToday && (
                          <span className="border border-brass/50 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-brass">
                            Днес
                          </span>
                        )}
                      </span>
                      {h.closed ? (
                        <span className="font-display text-lg tracking-wider text-ember/80">
                          Почивен ден
                        </span>
                      ) : (
                        <span
                          className={`font-display text-lg tracking-wider ${
                            isToday ? "text-brass" : "text-bone"
                          }`}
                        >
                          {formatMinutes(h.open)} — {formatMinutes(h.close)}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative min-h-[420px] border border-line lg:min-h-0">
            <iframe
              title={`Карта до ${SHOP.name}`}
              src={SHOP.mapEmbed}
              className="map-dark absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink to-transparent p-5 pt-14">
              <span className="font-serif text-lg italic text-bone">
                Столът те очаква.
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-smoke">
                {SHOP.coordinates}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
