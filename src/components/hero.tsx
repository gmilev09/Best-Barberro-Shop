"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SHOP, withBase } from "@/lib/shop";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function MaskedLine({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.2, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2100"
            alt="Атмосферата в Best Barberro Shop — кожени столове и месингова светлина"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-ink/40" />
      </div>

      {/* десен вертикален релс */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 items-center gap-6 lg:flex"
      >
        <span className="vertical-text text-[10px] uppercase tracking-[0.5em] text-smoke">
          {SHOP.addressLine1} · {SHOP.city}
        </span>
        <span className="h-24 w-px bg-line" />
        <span className="pole-stripes animate-pole h-28 w-2" />
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-16 pt-36 md:px-10 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
          className="mb-6 flex flex-wrap items-center gap-4"
        >
          <span className="flex items-center gap-2 border border-line bg-ink/50 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-sand backdrop-blur-sm">
            Бръснарски салон в сърцето на {SHOP.city}
          </span>
          <a
            href={SHOP.googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 border border-brass/40 bg-ink/50 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-brass backdrop-blur-sm transition-colors hover:border-brass"
          >
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-brass text-brass" />
              ))}
            </span>
            {SHOP.rating.toFixed(1)} · {SHOP.reviewCount} отзива в Google
          </a>
        </motion.div>

        <h1 className="font-display uppercase leading-[0.86] tracking-[0.005em]">
          <MaskedLine delay={0.65} className="text-[13vw] md:text-[10.5vw] xl:text-[8.8vw]">
            <span className="text-outline">Where</span>
            <span className="text-bone"> Legends</span>
          </MaskedLine>
          <MaskedLine delay={0.8} className="text-[13vw] md:text-[10.5vw] xl:text-[8.8vw]">
            <span className="text-brass">Are</span>
            <span className="text-outline"> Made</span>
            <span className="text-brass">.</span>
          </MaskedLine>
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.9, ease: EASE }}
            className="max-w-md text-base leading-relaxed text-sand md:text-lg"
          >
            Влез в {SHOP.name} и изживей върха на мъжката и дамската грижа в{" "}
            {SHOP.city}. Прецизни ръце, качествени продукти и уют, в който се
            оставаш за още едно кафе.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.9, ease: EASE }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/book"
              className="card-sheen group flex h-14 items-center gap-3 bg-brass px-8 font-display text-xl tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-bone"
            >
              ЗАПАЗИ СВОЯ ЧАС
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={1.5} />
            </Link>
            <Link
              href="/services"
              className="flex h-14 items-center border border-line px-8 font-display text-xl tracking-[0.1em] text-bone transition-colors duration-300 hover:border-brass hover:text-brass"
            >
              ЦЕНОРАЗПИСКА
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
