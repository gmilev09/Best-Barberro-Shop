import { ExternalLink, Quote, Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { REVIEWS, SHOP } from "@/lib/shop";

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`flex gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-brass text-brass" strokeWidth={0} />
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden border-b border-line">
      <span className="pointer-events-none absolute -top-8 right-0 select-none font-display text-[26vw] leading-none text-outline-faint">
        ДОКАЗ
      </span>
      <div className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <span className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-brass">
                <span className="h-px w-10 bg-brass/60" /> Какво казват клиентите
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="font-display text-[9rem] leading-[0.85] text-bone md:text-[12rem]">
                {SHOP.rating.toFixed(1)}
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <Stars className="mt-4" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand">
                Оценка в Google — базирана на{" "}
                <span className="text-brass">{SHOP.reviewCount} отзива</span> от
                най-надължените глави в {SHOP.city}.
              </p>
              <a
                href={SHOP.googleReviewsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 border border-brass/50 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-brass transition-colors hover:bg-brass hover:text-ink"
              >
                Виж отзивите в Google
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            </Reveal>
          </div>

          <div className="flex flex-col gap-5">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08}>
                <article
                  className={`group relative border border-line p-7 transition-colors duration-500 hover:border-brass/50 md:p-9 ${
                    i === 0 ? "bg-carbon/70" : "bg-coal/40 hover:bg-carbon/50"
                  }`}
                >
                  <Quote
                    className="absolute right-7 top-7 h-8 w-8 text-brass/25 transition-colors duration-500 group-hover:text-brass/60"
                    strokeWidth={1}
                  />
                  <Stars />
                  <p
                    className={`mt-5 leading-relaxed text-bone/95 ${
                      i === 0
                        ? "font-serif text-xl italic md:text-2xl"
                        : "text-base md:text-lg"
                    }`}
                  >
                    „{r.text}“
                  </p>
                  <footer className="mt-6 flex items-center justify-between border-t border-line pt-5">
                    <span className="font-display text-xl uppercase tracking-wide text-bone">
                      {r.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-smoke">
                      {r.tag}
                    </span>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
