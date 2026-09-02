"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MoveRight, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import type { ServiceDTO } from "@/lib/data";
import { SHOP } from "@/lib/shop";

const TABS = [
  { key: "chair", label: "Стол №1", sub: "Подстригване · Брада · Бръснене" },
  { key: "color-care", label: "Цвят и грижа", sub: "Боядисване · Кожа · Детайли" },
] as const;

export function ServicesMenu({ services }: { services: ServiceDTO[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("chair");
  const list = services.filter((s) => s.category === tab);

  return (
    <section id="menu" className="relative border-b border-line bg-coal/40">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <SectionHeading
          eyebrow="Разгледай услугите"
          title="Повече от услуга —"
          accent="изживяване."
          copy="Петнадесет начина да излезеш по-остър, отколкото си влязъл. Всяка услуга започва с консултация, а финалът се проверява два пъти в огледалото."
        />

        <div className="mb-12 flex flex-wrap gap-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`group flex flex-col items-start border px-6 py-4 text-left transition-all duration-400 ${
                tab === t.key
                  ? "border-brass bg-brass/10"
                  : "border-line hover:border-sand/50"
              }`}
            >
              <span
                className={`font-display text-2xl uppercase tracking-wide transition-colors ${
                  tab === t.key ? "text-brass" : "text-bone group-hover:text-brass"
                }`}
              >
                {t.label}
              </span>
              <span className="mt-0.5 text-[10px] uppercase tracking-[0.24em] text-smoke">
                {t.sub}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border-t border-line">
              {list.map((s, i) => (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={`/book?service=${s.slug}`}
                    className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-5 border-b border-line py-6 transition-colors duration-400 hover:bg-carbon/60 md:grid-cols-[64px_1fr_auto_auto_120px_48px] md:gap-x-8 md:px-4"
                  >
                    <span className="font-serif text-lg italic text-smoke md:text-xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-display text-3xl uppercase tracking-wide text-bone transition-colors duration-300 group-hover:text-brass md:text-4xl">
                        {s.name}
                      </span>
                      <span className="mt-1 hidden max-w-xl text-sm leading-relaxed text-smoke md:block">
                        {s.description}
                      </span>
                    </span>
                    <span className="hidden text-[11px] uppercase tracking-[0.2em] text-smoke md:block">
                      {s.durationMinutes} мин
                    </span>
                    <span className="dotted-leader hidden h-4 w-full min-w-8 self-end md:block" />
                    <span className="text-right font-display text-2xl text-brass md:text-3xl">
                      {s.priceLabel}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center border border-line text-sand transition-all duration-400 group-hover:border-brass group-hover:bg-brass group-hover:text-ink md:h-11 md:w-11">
                      <MoveRight className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-0.5" strokeWidth={1.5} />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border border-line bg-ink/60 p-7 md:flex-row md:items-center">
          <p className="max-w-xl text-sm leading-relaxed text-sand">
            <span className="font-serif text-lg italic text-brass">Без час също си добре дошъл, </span>
            ако има свободен стол. За час още днес или в последния момент —
            обади се и ще направим невъзможното да те поберем.
          </p>
          <a
            href={SHOP.phoneHref}
            className="flex h-12 items-center gap-3 border border-brass/60 px-6 font-display text-lg tracking-[0.1em] text-brass transition-colors duration-300 hover:bg-brass hover:text-ink"
          >
            <Phone className="h-4 w-4" strokeWidth={1.5} />
            {SHOP.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
