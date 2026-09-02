/** Навигация на сайта — споделена между хедъра (клиент) и футъра (сървър). */
export const NAV = [
  { label: "Начало", href: "/" },
  { label: "За нас", href: "/about" },
  { label: "Услуги", href: "/services" },
  { label: "Майстори", href: "/masters" },
  { label: "Галерия", href: "/gallery" },
  { label: "Контакти", href: "/contact" },
] as const;
