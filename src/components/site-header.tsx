"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, Scissors, Share2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/nav";
import { SHOP } from "@/lib/shop";
import { shopStatus } from "@/lib/status";

function StatusChip() {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const update = () => setStatus(shopStatus());
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);
  if (!status) return null;
  return (
    <span className="hidden items-center gap-2 border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-sand lg:flex">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status.open ? "bg-emerald-400" : "bg-ember"
        } animate-pulse`}
      />
      {status.label}
    </span>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-ink/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-brass/60 bg-ink/40 text-brass transition-colors duration-300 group-hover:bg-brass group-hover:text-ink">
              <Scissors className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-[22px] tracking-[0.06em]">
                BEST BARBERRO SHOP
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-smoke">
                Бръснарски салон · Петрич
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-[13px] uppercase tracking-[0.16em] text-sand transition-colors hover:text-bone"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brass transition-all duration-400 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <StatusChip />
            <a
              href={SHOP.phoneHref}
              className="hidden h-11 w-11 items-center justify-center border border-line text-sand transition-colors hover:border-brass hover:text-brass md:flex"
              aria-label={`Обади се на ${SHOP.phoneDisplay}`}
            >
              <Phone className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <Link
              href="/book"
              className="card-sheen hidden h-11 items-center bg-brass px-6 font-display text-lg tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-bone md:flex"
            >
              ЗАПАЗИ ЧАС
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center border border-line text-bone xl:hidden"
              aria-label="Отвори менюто"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink"
          >
            <div className="pole-stripes animate-pole h-1.5 w-full" />
            <div className="flex h-20 items-center justify-between px-5 md:px-10">
              <span className="font-display text-2xl tracking-[0.06em]">
                BEST BARBERRO SHOP
              </span>
              <button
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center border border-line text-bone"
                aria-label="Затвори менюто"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-6 md:px-12">
              {[...NAV, { label: "Запази час", href: "/book" }].map((item, i) => (
                <motion.div
                  key={item.href + item.label}
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 border-b border-line py-3.5"
                  >
                    <span className="text-xs tracking-[0.3em] text-brass">
                      0{i + 1}
                    </span>
                    <span className="font-display text-5xl uppercase tracking-wide text-bone transition-colors group-hover:text-brass md:text-6xl">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 pb-8 text-[11px] uppercase tracking-[0.2em] text-smoke md:px-12">
              <span>{SHOP.addressLine1}, {SHOP.city}</span>
              <span className="flex items-center gap-4">
                <a
                  href={SHOP.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sand transition-colors hover:text-brass"
                >
                  <Share2 className="h-4 w-4" /> Facebook
                </a>
                <a href={SHOP.phoneHref} className="text-brass">
                  {SHOP.phoneDisplay}
                </a>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
