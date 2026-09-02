"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { GALLERY, withBase } from "@/lib/shop";

export function Gallery() {
  return (
    <section id="gallery" className="border-b border-line bg-coal/40">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <SectionHeading
          eyebrow="Портфолиото"
          title="Горещо от"
          accent="салона."
          copy="Истинска работа, истински столове, нулеви филтри. Включително кадър от самия ни Google профил."
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {GALLERY.map((g, i) => (
            <motion.figure
              key={g.src}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: (i % 4) * 0.08,
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden border ${
                g.local ? "border-brass/60" : "border-line"
              } ${g.tall ? "row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-[4/3] md:aspect-[4/4.6]"}`}
            >
              <Image
                src={g.local ? withBase(g.src) : g.src}
                alt={g.alt}
                fill
                className={`object-cover transition-all duration-[1.5s] ease-out group-hover:scale-[1.06] ${
                  g.local
                    ? "grayscale-0"
                    : "grayscale-[45%] group-hover:grayscale-0"
                }`}
                sizes="(min-width: 768px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              {g.credit && (
                <span className="absolute left-3 top-3 border border-brass/60 bg-ink/75 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-brass backdrop-blur-sm">
                  {g.credit}
                </span>
              )}
              <figcaption className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="font-serif text-lg italic text-bone">{g.caption}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-brass">
                  0{i + 1}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
