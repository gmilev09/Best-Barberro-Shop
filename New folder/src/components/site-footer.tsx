import { ArrowRight, MapPin, Phone, Scissors, Share2 } from "lucide-react";
import Link from "next/link";
import { LineReveal, Reveal } from "@/components/reveal";
import { NAV } from "@/lib/nav";
import { SHOP } from "@/lib/shop";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden">
      {/* Финален призив */}
      <div className="relative border-b border-line">
        <div className="mx-auto max-w-[1600px] px-5 py-24 text-center md:px-10 md:py-36">
          <Reveal>
            <span className="mb-6 inline-block text-[11px] uppercase tracking-[0.4em] text-brass">
              Не се примирявай с обикновеното
            </span>
          </Reveal>
          <h2 className="font-display uppercase leading-[0.88] tracking-wide">
            <LineReveal className="text-[13vw] md:text-[9vw]">
              <span className="text-bone">Готов за</span>
            </LineReveal>
            <LineReveal delay={0.12} className="text-[13vw] md:text-[9vw]">
              <span className="text-outline">своя</span>{" "}
              <span className="text-brass">стол?</span>
            </LineReveal>
          </h2>
          <Reveal delay={0.25} className="mt-12">
            <Link
              href="/book"
              className="card-sheen group inline-flex h-16 items-center gap-4 bg-brass px-10 font-display text-2xl tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-bone"
            >
              ЗАПАЗИ ЧАС ОНЛАЙН
              <ArrowRight
                className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2"
                strokeWidth={1.5}
              />
            </Link>
            <p className="mt-6 text-sm text-smoke">
              или се обади на{" "}
              <a href={SHOP.phoneHref} className="text-brass hover:text-bone">
                {SHOP.phoneDisplay}
              </a>{" "}
              — вт–съб, 09:30–19:00
            </p>
          </Reveal>
        </div>
      </div>

      {/* Тяло на футъра */}
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,2fr)] md:gap-8">
          <div>
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center border border-brass/60 text-brass">
                <Scissors className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="font-display text-3xl tracking-[0.06em] text-bone">
                BEST BARBERRO SHOP
              </span>
            </span>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-smoke">
              {SHOP.tagline}. Бръснарски салон в сърцето на {SHOP.city} —
              прецизна грижа за господа и дами, атмосфера за легенди.
            </p>
            <a
              href={SHOP.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 border border-line px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-sand transition-colors hover:border-brass hover:text-brass"
            >
              <Share2 className="h-3.5 w-3.5" /> Последвай ни
            </a>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.3em] text-smoke">
              Салонът
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-sand">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-brass" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="transition-colors hover:text-brass" href="/admin">
                  Вход за екипа
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.3em] text-smoke">
              Контакти
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-sand">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" strokeWidth={1.5} />
                <span>
                  {SHOP.addressLine1}
                  <br />
                  {SHOP.addressLine2}
                </span>
              </li>
              <li>
                <a
                  href={SHOP.phoneHref}
                  className="flex items-center gap-2 text-brass transition-colors hover:text-bone"
                >
                  <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {SHOP.phoneDisplay}
                </a>
              </li>
              <li>Вторник – Събота · 09:30 – 19:00</li>
              <li>Неделя и Понеделник · почивен ден</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-line pt-7 text-[10px] uppercase tracking-[0.2em] text-smoke md:flex-row">
          <span>© 2026 {SHOP.name}. Всички права запазени.</span>
          <span>
            {SHOP.city}, България · {SHOP.coordinates}
          </span>
        </div>
      </div>
    </footer>
  );
}
