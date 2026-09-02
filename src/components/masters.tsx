"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import type { BarberDTO } from "@/lib/data";

export function Masters({ barbers }: { barbers: BarberDTO[] }) {
  return (
    <section id="masters" className="relative overflow-hidden border-b border-line">
      <span className="pointer-events-none absolute top-6 left-0 select-none font-display text-[19vw] leading-none text-outline-faint">
        МАЙСТОРИ
      </span>
      <div className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <SectionHeading
          eyebrow="Запознай се с екипа"
          title="Умелите ръце на"
          accent="легендарния екип."
          copy="Осем майстора с общо над 150 години зад стола. Избери своя човек — или се довери на салона да те срещне с правилния."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {barbers.map((b, i) => (
            <motion.div
              key={b.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: (i % 4) * 0.1,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={i % 2 === 1 ? "lg:mt-14" : ""}
            >
              <Link
                href={`/book?barber=${b.slug}`}
                className="group block border border-line bg-coal/40 transition-colors duration-500 hover:border-brass/60"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={b.imageUrl}
                    alt={`${b.name}, майстор бръснар в Best Barberro Shop`}
                    fill
                    className="object-cover grayscale transition-all duration-[1.4s] ease-out group-hover:scale-105 group-hover:grayscale-0"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
                  <span className="absolute left-4 top-4 flex items-center gap-1.5 border border-line bg-ink/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-sand backdrop-blur-sm">
                    <BadgeCheck className="h-3.5 w-3.5 text-brass" strokeWidth={1.5} />
                    {b.years} г. опит
                  </span>
                  <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-serif text-base italic leading-snug text-bone/95">
                      „{b.quote}“
                    </p>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <h3 className="font-display text-3xl uppercase tracking-wide text-bone transition-colors duration-300 group-hover:text-brass">
                      {b.name}
                    </h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-smoke">
                      {b.specialties.join(" · ")}
                    </p>
                  </div>
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-line text-sand transition-all duration-400 group-hover:border-brass group-hover:bg-brass group-hover:text-ink">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
