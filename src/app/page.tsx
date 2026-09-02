import { About } from "@/components/about";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Masters } from "@/components/masters";
import { Reviews } from "@/components/reviews";
import { ServicesMenu } from "@/components/services-menu";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Visit } from "@/components/visit";
import { getBarbers, getServices } from "@/lib/data";
import { MARQUEE_ITEMS } from "@/lib/shop";

const SECOND_MARQUEE = [
  "Скин фейд",
  "Прав нож",
  "Дизайн на косата",
  "Масло и восък",
  "Сиви корени",
  "Горещи кърпи",
  "Кафе за гости",
  "Петрич",
];

export default async function Home() {
  const [services, barbers] = await Promise.all([getServices(), getBarbers()]);

  return (
    <main className="relative">
      <SiteHeader />
      <Hero />
      <Marquee items={MARQUEE_ITEMS} />
      <About />
      <ServicesMenu services={services} />
      <Masters barbers={barbers} />
      <Marquee items={SECOND_MARQUEE} fast />
      <Gallery />
      <Reviews />
      <Visit />
      <SiteFooter />
    </main>
  );
}
