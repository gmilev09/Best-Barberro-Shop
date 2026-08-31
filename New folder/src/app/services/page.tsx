import { Marquee } from "@/components/marquee";
import { PageHero } from "@/components/page-hero";
import { ServicesMenu } from "@/components/services-menu";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServices } from "@/lib/data";
import { MARQUEE_ITEMS, SHOP } from "@/lib/shop";

export const metadata = {
  title: `Услуги и цени — ${SHOP.name} | Петрич`,
  description:
    "Мъжко и дамско подстригване, оформяне на брада, бръснене с гореща кърпа, боядисване и кичури в Петрич. Виж цените и запази час онлайн.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <main className="relative">
      <SiteHeader />
      <PageHero
        eyebrow="Услуги и цени"
        title="Ценоразписка"
        accent="на занаята."
        copy="Честни цени, ясни услуги, нулеви компромиси. Избери своята и запази час за секунди."
      />
      <ServicesMenu services={services} />
      <Marquee items={MARQUEE_ITEMS} />
      <SiteFooter />
    </main>
  );
}
