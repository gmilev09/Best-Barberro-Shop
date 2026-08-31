import { About } from "@/components/about";
import { PageHero } from "@/components/page-hero";
import { Reviews } from "@/components/reviews";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Visit } from "@/components/visit";
import { SHOP } from "@/lib/shop";

export const metadata = {
  title: `За нас — ${SHOP.name} | Петрич`,
  description:
    "Бръснарският салон в сърцето на Петрич — прецизен занаят, качествени продукти и уютна атмосфера на ул. „Христо Чернопеев“ 2.",
};

export default function AboutPage() {
  return (
    <main className="relative">
      <SiteHeader />
      <PageHero
        eyebrow="За салона"
        title="За нас"
        accent="и занаята ни."
        copy={`${SHOP.name} е мястото, където прецизността среща характера — на три крачки от централния площад на ${SHOP.city}.`}
      />
      <About />
      <Reviews />
      <Visit />
      <SiteFooter />
    </main>
  );
}
