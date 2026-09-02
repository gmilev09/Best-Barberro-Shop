"use client";

import { Scissors } from "lucide-react";

function MarqueeBlock({
  items,
  hidden,
}: {
  items: readonly string[];
  hidden?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="font-display text-2xl uppercase tracking-[0.12em] text-sand md:text-3xl">
            {item}
          </span>
          <Scissors className="h-4 w-4 rotate-90 text-brass" strokeWidth={1.5} />
        </span>
      ))}
    </div>
  );
}

export function Marquee({
  items,
  fast = false,
  className = "",
}: {
  items: readonly string[];
  fast?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border-y border-line bg-coal/70 py-4 ${className}`}
    >
      <div
        className={`flex w-max ${fast ? "animate-marquee-fast" : "animate-marquee"}`}
      >
        <MarqueeBlock items={items} />
        <MarqueeBlock items={items} hidden />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
