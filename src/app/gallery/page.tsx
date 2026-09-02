import { Gallery } from "@/components/gallery";
import { Marquee } from "@/components/marquee";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SHOP } from "@/lib/shop";

export const metadata = {
  title: `Галерия — ${SHOP.name} | Петрич`,
  description:
    "Кадри от салона и работата на майстрите в Best Barberro Shop, Петрич — включително снимки от нашия Google профил.",
};

const GALLERY_MARQUEE = [
  "Фейд след фейд",
  "Точни линии",
  "Жива брада",
  "Гладко бръснене",
  "Свежи кичури",
  "Детайл след детайл",
];

export default function GalleryPage() {
  return (
    <main className="relative">
      <SiteHeader />
      <PageHero
        eyebrow="Кадри от салона"
        title="Галерия"
        accent="в движение."
        copy="Работата говори сама за себе си — разгледай салона, инструментите и резултатите."
      />
      <Gallery />
      <Marquee items={GALLERY_MARQUEE} />
      <SiteFooter />
    </main>
  );
}
