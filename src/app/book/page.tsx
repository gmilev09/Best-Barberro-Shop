import { Suspense } from "react";
import { BookingWizard } from "@/components/booking-wizard";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getBarbers, getServices } from "@/lib/data";
import { SHOP } from "@/lib/shop";

export const metadata = {
  title: `Запази час — ${SHOP.name} | Петрич`,
  description:
    "Резервирай онлайн подстригване, брада, бръснене с гореща кърпа или боядисване в Петрич. Избери майстор и час — отнема по-малко от минута.",
};

function WizardFallback() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <div className="h-[480px] animate-pulse border border-line bg-coal/40" />
    </div>
  );
}

export default async function BookPage() {
  const [services, barbers] = await Promise.all([getServices(), getBarbers()]);

  return (
    <main className="relative min-h-screen">
      <SiteHeader />
      <div className="border-b border-line bg-coal/40">
        <div className="mx-auto max-w-[1600px] px-5 pb-14 pt-40 md:px-10">
          <span className="text-[11px] uppercase tracking-[0.4em] text-brass">
            Онлайн резервация · Потвърждение до час
          </span>
          <h1 className="mt-3 font-display text-7xl uppercase leading-[0.9] tracking-wide text-bone md:text-8xl">
            Запази своя <span className="text-outline-brass">стол.</span>
          </h1>
        </div>
      </div>
      <div className="py-16 md:py-20">
        <Suspense fallback={<WizardFallback />}>
          <BookingWizard services={services} barbers={barbers} />
        </Suspense>
      </div>
      <SiteFooter />
    </main>
  );
}
