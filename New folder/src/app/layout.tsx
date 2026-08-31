import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Oswald, Playfair_Display } from "next/font/google";
import "./globals.css";

const display = Oswald({
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-bebas",
});

const serif = Playfair_Display({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-instrument",
});

const sans = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext", "latin-ext"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Best Barberro Shop — Тук се раждат легендите | Петрич",
  description:
    "Бръснарски салон в сърцето на Петрич. Мъжко и дамско подстригване, брада, бръснене с гореща кърпа и боядисване. Запази час онлайн — ул. „Христо Чернопеев“ 2, Петрич.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bg" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body className="bg-ink text-bone">
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
