import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Visit } from "@/components/visit";
import { SHOP } from "@/lib/shop";

export const metadata = {
  title: `Контакти — ${SHOP.name} | Петрич`,
  description: `Намери ${SHOP.name} на ${SHOP.addressLine1}, ${SHOP.city}. Обади се на ${SHOP.phoneDisplay} или запази час онлайн. Вт–Съб 09:30–19:00.`,
};

export default function ContactPage() {
  return (
    <main className="relative">
      <SiteHeader />
      <PageHero
        eyebrow="Контакти и локация"
        title="Ела на"
        accent="гости."
        copy="Три крачки от центъра на Петрич — с кафе в ръка и стол, който те чака."
      />
      <Visit />
      <SiteFooter />
    </main>
  );
}
