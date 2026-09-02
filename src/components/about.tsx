import { Coffee, Gem, Handshake, Users } from "lucide-react";
import Image from "next/image";
import { LineReveal, Reveal } from "@/components/reveal";
import { SHOP, withBase } from "@/lib/shop";

const FEATURES = [
  {
    icon: Handshake,
    title: "Личен подход",
    text: "Подстригване и грижа, съобразени точно с теб — никога по шаблон.",
  },
  {
    icon: Users,
    title: "Професионални бръснари",
    text: "Опитни майстори, за които занаятът е призвание.",
  },
  {
    icon: Gem,
    title: "Качествени продукти",
    text: "Най-добрите марки, за да изглеждаш безупречно и след салона.",
  },
  {
    icon: Coffee,
    title: "Уютна атмосфера",
    text: "Кафе, добра музика и спокойствие, докато чакаш своя ред.",
  },
];

const STATS = [
  { value: "5.0", label: "Рейтинг в Google" },
  { value: "22", label: "Петзвездни отзива" },
  { value: "8", label: "Майстора бръснари" },
  { value: "15", label: "Услуги в менюто" },
];

export function About() {
  return (
    <section id="craft" className="relative border-b border-line">
      <span className="pointer-events-none absolute -top-10 right-0 select-none font-display text-[28vw] leading-none text-outline-faint">
        ЗАНАЯТ
      </span>

      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <span className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-brass">
                <span className="h-px w-10 bg-brass/60" /> От сърцето на {SHOP.city}
              </span>
            </Reveal>
            <h2 className="font-display text-6xl uppercase leading-[0.9] tracking-wide text-bone md:text-7xl">
              <LineReveal>Бръснарски</LineReveal>
              <LineReveal delay={0.1}>
                <span className="text-outline">салон с характер</span>
              </LineReveal>
              <LineReveal delay={0.2}>
                <span className="font-serif lowercase italic tracking-normal text-brass">
                  и почерк.
                </span>
              </LineReveal>
            </h2>
            <Reveal delay={0.25} className="mt-8 max-w-lg">
              <p className="text-base leading-relaxed text-sand md:text-lg">
                Нашият екип от майстори бръснари обича да създава визия, която
                подхожда на твоя стил и те кара да се чувстваш уверен още щом
                станеш от стола.
              </p>
              <p className="mt-4 text-base leading-relaxed text-smoke">
                Това е повече от услуга — това е изживяване. Прецизност, търпение
                и чаша кафе, докато светът изчака отвън.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 border border-line sm:grid-cols-4">
              {STATS.map((s, i) => (
                <Reveal
                  key={s.label}
                  delay={i * 0.08}
                  className={`px-5 py-6 ${i !== 3 ? "sm:border-r sm:border-line" : ""} ${i % 2 === 0 ? "border-r border-line sm:border-r" : ""} ${i < 2 ? "border-b border-line sm:border-b-0" : ""}`}
                >
                  <div className="font-display text-4xl text-brass md:text-5xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-smoke">
                    {s.label}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="relative">
            <Reveal delay={0.15} className="relative">
              <div className="relative aspect-[4/5] overflow-hidden border border-line md:aspect-[5/6]">
                <Image
                  src="https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1000"
                  alt="Интериорът на Best Barberro Shop в Петрич — стол, огледало и шахматен под"
                  fill
                  className="object-cover transition-transform duration-[1.6s] ease-out hover:scale-105"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                  <span className="font-serif text-xl italic text-bone">
                    Салонът отвътре
                  </span>
                  <span className="shrink-0 border border-line bg-ink/70 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-sand backdrop-blur-sm">
                    Снимка от Google профила
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-5 -right-5 -z-10 hidden h-full w-full border border-brass/30 md:block" />
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className="h-full">
              <div className="group flex h-full flex-col gap-5 bg-ink p-7 transition-colors duration-500 hover:bg-carbon">
                <f.icon
                  className="h-6 w-6 text-brass transition-transform duration-500 group-hover:-translate-y-1"
                  strokeWidth={1.25}
                />
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-wide text-bone">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-smoke">{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
