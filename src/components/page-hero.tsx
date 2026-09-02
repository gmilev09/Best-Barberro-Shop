"use client";

import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Заглавна лента за вътрешните страници. */
export function PageHero({
  eyebrow,
  title,
  accent,
  copy,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  copy?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-coal/40">
      <span className="pointer-events-none absolute -right-6 top-4 select-none font-display text-[20vw] leading-none text-outline-faint">
        {title.split(" ")[0]}
      </span>
      <div className="relative mx-auto max-w-[1600px] px-5 pb-16 pt-40 md:px-10 md:pb-20 md:pt-48">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-brass"
        >
          <span className="h-px w-10 bg-brass/60" />
          {eyebrow}
        </motion.span>
        <h1 className="mt-4 font-display text-7xl uppercase leading-[0.9] tracking-wide text-bone md:text-8xl xl:text-9xl">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            >
              {title}
            </motion.span>
          </span>
          {accent && (
            <span className="block overflow-hidden">
              <motion.span
                className="block font-serif lowercase italic tracking-normal text-brass"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, delay: 0.28, ease: EASE }}
              >
                {accent}
              </motion.span>
            </span>
          )}
        </h1>
        {copy && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className="mt-6 max-w-xl text-base leading-relaxed text-sand md:text-lg"
          >
            {copy}
          </motion.p>
        )}
      </div>
    </div>
  );
}
