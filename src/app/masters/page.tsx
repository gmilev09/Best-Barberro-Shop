import { Masters } from "@/components/masters";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getBarbers } from "@/lib/data";
import { SHOP } from "@/lib/shop";

export const metadata = {
  title: `Майстори — ${SHOP.name} | Петрич`,
  description:
    "Запознай се с осемте майстора на Best Barberro Shop — над 150 години общ опит зад бръснарския стол в Петрич.",
};

export default async function MastersPage() {
  const barbers = await getBarbers();
  return (
    <main className="relative">
      <SiteHeader />
      <PageHero
        eyebrow="Екипът"
        title="Майсторите"
        accent="зад стола."
        copy="Всеки със своя почерк, всички с една цел — да излезеш от салона в най-добрата си форма."
      />
      <Masters barbers={barbers} />
      <SiteFooter />
    </main>
  );
}
