import { LineReveal, Reveal } from "@/components/reveal";

export function SectionHeading({
  eyebrow,
  title,
  accent,
  copy,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`mb-14 flex flex-col gap-6 md:mb-20 ${
        align === "center"
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={align === "center" ? "max-w-3xl" : "max-w-2xl"}>
        <Reveal>
          <span
            className={`mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-brass ${
              align === "center" ? "justify-center" : ""
            }`}
          >
            <span className="h-px w-10 bg-brass/60" />
            {eyebrow}
            {align === "center" && <span className="h-px w-10 bg-brass/60" />}
          </span>
        </Reveal>
        <h2 className="font-display text-6xl uppercase leading-[0.9] tracking-wide text-bone md:text-7xl xl:text-8xl">
          <LineReveal>{title}</LineReveal>
          {accent && (
            <LineReveal delay={0.12}>
              <span className="font-serif lowercase italic tracking-normal text-brass">
                {accent}
              </span>
            </LineReveal>
          )}
        </h2>
      </div>
      {copy && (
        <Reveal delay={0.2}>
          <p
            className={`max-w-sm text-sm leading-relaxed text-smoke md:text-base ${
              align === "center" ? "" : "md:pb-2 md:text-right"
            }`}
          >
            {copy}
          </p>
        </Reveal>
      )}
    </div>
  );
}
