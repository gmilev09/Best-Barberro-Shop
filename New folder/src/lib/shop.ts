/* ------------------------------------------------------------------
   Единствен източник на истина за данните на Best Barberro Shop.
   Информация от Google профила на обекта (ул. „Христо Чернопеев“ 2,
   Петрич) — използва се и за първоначално зареждане на базата данни.
------------------------------------------------------------------- */

export const SHOP = {
  name: "Best Barberro Shop",
  tagline: "Където се раждат легендите",
  city: "Петрич",
  addressLine1: "ул. „Христо Чернопеев“ 2",
  addressLine2: "Център, 2850 Петрич, България",
  phoneDisplay: "089 575 1796",
  phoneHref: "tel:+359895751796",
  rating: 5.0,
  reviewCount: 22,
  googleReviewsUrl:
    "https://search.google.com/local/reviews?placeid=ChIJSYhhiI8pqhQR6rcd2XFlbL0",
  facebookUrl: "https://www.facebook.com/profile.php?id=100088793320274",
  googleMapsUrl:
    "https://maps.google.com/maps?daddr=41.39862880,23.20907450",
  mapEmbed:
    "https://maps.google.com/maps?q=41.3986288,23.2090745&z=16&ie=UTF8&iwloc=&output=embed",
  timezone: "Europe/Sofia",
  coordinates: "41.40° N · 23.21° E",
} as const;

export interface DayHours {
  day: string;
  short: string;
  open: number;
  close: number;
  closed?: boolean;
}

/* Минути от полунощ. Вт–Съб: 09:30–19:00 · Нед и Пон: почивен ден.
   Индексът съответства на JS getDay(): 0 = неделя. */
export const HOURS: DayHours[] = [
  { day: "Неделя", short: "Нед", open: 0, close: 0, closed: true },
  { day: "Понеделник", short: "Пон", open: 0, close: 0, closed: true },
  { day: "Вторник", short: "Вт", open: 570, close: 1140 },
  { day: "Сряда", short: "Ср", open: 570, close: 1140 },
  { day: "Четвъртък", short: "Чет", open: 570, close: 1140 },
  { day: "Петък", short: "Пет", open: 570, close: 1140 },
  { day: "Събота", short: "Съб", open: 570, close: 1140 },
];

/** Ред на седмицата за показване (понеделник първи). */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

/** Префикс за basePath при статичен износ (GitHub Pages: /<repo>/...). */
export function withBase(path: string): string {
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return prefix && path.startsWith("/") ? `${prefix}${path}` : path;
}

/** 24-часов формат: "09:30", "19:00" */
export function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function toHHMM(mins: number): string {
  return formatMinutes(mins);
}

/** Текуща дата (ГГГГ-ММ-ДД) и минути от деня в часовата зона на салона. */
export function nowInShop(): { date: string; minutes: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SHOP.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
    day: dayMap[get("weekday")] ?? 0,
  };
}

export interface ServiceSeed {
  slug: string;
  name: string;
  description: string;
  category: "chair" | "color-care";
  priceLabel: string;
  priceCents: number; // в стотинки
  durationMinutes: number;
  sortOrder: number;
}

export const SERVICE_CATALOG: ServiceSeed[] = [
  {
    slug: "haircut",
    name: "Мъжко подстригване",
    description:
      "Прецизно подстригване, съобразено с твоя стил, форма на лицето и тип коса. Създаваме визия, която подчертава характера ти.",
    category: "chair",
    priceLabel: "25 лв",
    priceCents: 2500,
    durationMinutes: 45,
    sortOrder: 1,
  },
  {
    slug: "haircut-beard",
    name: "Подстригване + брада",
    description:
      "Пълното грижовно изживяване — подстригване по мярка и перфектно оформена брада в един час на стол №1.",
    category: "chair",
    priceLabel: "35 лв",
    priceCents: 3500,
    durationMinutes: 60,
    sortOrder: 2,
  },
  {
    slug: "beard-trim",
    name: "Оформяне на брада",
    description:
      "Изваяваме и поддържаме брадата ти до съвършенство — чисти линии, балансирана форма и завършек с масло.",
    category: "chair",
    priceLabel: "15 лв",
    priceCents: 1500,
    durationMinutes: 30,
    sortOrder: 3,
  },
  {
    slug: "shape-up",
    name: "Контуриране",
    description:
      "Чист, остър контур, който кара всяка прическа да изглежда на ниво — линия на косата, бакенбарди и ръб на брадата.",
    category: "chair",
    priceLabel: "12 лв",
    priceCents: 1200,
    durationMinutes: 25,
    sortOrder: 4,
  },
  {
    slug: "hot-towel-shave",
    name: "Бръснене с гореща кърпа",
    description:
      "Горещата пара отпуска кожата и отваря порите, а ножът оставя перфектно гладък резултат. Класическият ритуал за лице или глава.",
    category: "chair",
    priceLabel: "20 лв",
    priceCents: 2000,
    durationMinutes: 40,
    sortOrder: 5,
  },
  {
    slug: "kids-haircut",
    name: "Детско подстригване",
    description:
      "Търпение и спокойна атмосфера, за да се чувства всяко дете комфортно — и да излезе с прическа, която обича.",
    category: "chair",
    priceLabel: "18 лв",
    priceCents: 1800,
    durationMinutes: 30,
    sortOrder: 6,
  },
  {
    slug: "womens-haircut",
    name: "Дамско подстригване",
    description:
      "Съобразяваме формата на лицето, текстурата на косата и ритъма на деня ти, за да създадем срязване, което ти личи.",
    category: "chair",
    priceLabel: "от 30 лв",
    priceCents: 3000,
    durationMinutes: 45,
    sortOrder: 7,
  },
  {
    slug: "grey-roots-men",
    name: "Сиви корени — мъже",
    description:
      "Дискретно прикриване на сивите корени с естествен резултат — връщаме увереността без никой да забележи трика.",
    category: "color-care",
    priceLabel: "25 лв",
    priceCents: 2500,
    durationMinutes: 45,
    sortOrder: 8,
  },
  {
    slug: "toner",
    name: "Тонер",
    description:
      "Освежаваме цвета и неутрализираме нежеланите оттенъци — повече блясък и по-дълъг живот на боята.",
    category: "color-care",
    priceLabel: "30 лв",
    priceCents: 3000,
    durationMinutes: 45,
    sortOrder: 9,
  },
  {
    slug: "root-color-women",
    name: "Боядисване на корени — дами",
    description:
      "Безупречна поддръжка на цвета — сливаме израстналите корени с дължините за естествен, трайна визия.",
    category: "color-care",
    priceLabel: "40 лв",
    priceCents: 4000,
    durationMinutes: 60,
    sortOrder: 10,
  },
  {
    slug: "womens-color",
    name: "Дамско боядисване",
    description:
      "Заедно избираме нюанса, който подхожда на тена и характера ти — цвят, който е само твой.",
    category: "color-care",
    priceLabel: "от 45 лв",
    priceCents: 4500,
    durationMinutes: 90,
    sortOrder: 11,
  },
  {
    slug: "highlights-half",
    name: "Кичури — половин глава",
    description:
      "Стратегически поставени кичури, които озаряват лицето и добавят слънчево измерение към косата.",
    category: "color-care",
    priceLabel: "от 55 лв",
    priceCents: 5500,
    durationMinutes: 90,
    sortOrder: 12,
  },
  {
    slug: "highlights-full",
    name: "Кичури — цяла глава",
    description:
      "Многоизмерен цвят с дълбочина и текстура — сияйна визия, която обръща погледи.",
    category: "color-care",
    priceLabel: "75+ лв",
    priceCents: 7500,
    durationMinutes: 120,
    sortOrder: 13,
  },
  {
    slug: "facial",
    name: "Фациална терапия",
    description:
      "Почистваща и хидратираща грижа за лицето — по-свежа, гладка и отпочинала кожа след всяка визита.",
    category: "color-care",
    priceLabel: "20 лв",
    priceCents: 2000,
    durationMinutes: 30,
    sortOrder: 14,
  },
  {
    slug: "wax-nose-ears",
    name: "Кола маска — нос и уши",
    description:
      "Нежно и ефективно премахване на нежеланите косъмчета — перфектният финал на всяка свежа визия.",
    category: "color-care",
    priceLabel: "8 лв",
    priceCents: 800,
    durationMinutes: 15,
    sortOrder: 15,
  },
];

export interface BarberSeed {
  slug: string;
  name: string;
  years: number;
  quote: string;
  imageUrl: string;
  specialties: string[];
  sortOrder: number;
}

const px = (id: number, w = 800, h = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

export const BARBER_CATALOG: BarberSeed[] = [
  {
    slug: "georgi",
    name: "Георги",
    years: 25,
    quote:
      "Прецизирал съм класическото бръснарство до изкуство — безупречни подстригвания, оформяне на брада и бръснене с гореща кърпа.",
    imageUrl: px(19225142),
    specialties: ["Класика", "Гореща кърпа", "Терапии"],
    sortOrder: 1,
  },
  {
    slug: "rita",
    name: "Рита",
    years: 30,
    quote:
      "Обичам да помагам на клиентите да постигнат визията си — от свежо подстригване до наситен цвят и възстановяващи терапии.",
    imageUrl: px(3993305),
    specialties: ["Дамски срязвания", "Цвят", "Терапии"],
    sortOrder: 2,
  },
  {
    slug: "david",
    name: "Давид",
    years: 20,
    quote:
      "Двадесет години безкомпромисна грижа за всяка детайл — да излезеш от стола в най-добрата си форма.",
    imageUrl: px(8552629),
    specialties: ["Скин фейд", "Брада", "Пълен сервиз"],
    sortOrder: 3,
  },
  {
    slug: "chris",
    name: "Крис",
    years: 28,
    quote:
      "Повече от две десетилетия трансформирам визии — прецизни подстригвания и сложни дизайни с брада.",
    imageUrl: px(18483771),
    specialties: ["Прецизност", "Дизайн брада", "Контури"],
    sortOrder: 4,
  },
  {
    slug: "lika",
    name: "Лика",
    years: 16,
    quote:
      "Страст към детайла и любов към занаята — топ подстригвания и луксозна грижа, създадена да издигне стила ти.",
    imageUrl: px(9709014),
    specialties: ["Луксозна грижа", "Срязвания", "Стайлинг"],
    sortOrder: 5,
  },
  {
    slug: "rafael",
    name: "Рафаел",
    years: 12,
    quote:
      "Прецизни подстригвания, експертна грижа за брадата и традиционно бръснене — цялостно изживяване от начало до край.",
    imageUrl: px(8552627),
    specialties: ["Гореща кърпа", "Брада", "Терапии"],
    sortOrder: 6,
  },
  {
    slug: "evgeni",
    name: "Евгени",
    years: 8,
    quote:
      "Всяка услуга е повече от подстригване — тя е изживяване, след което излизаш отпочинал и уверен.",
    imageUrl: px(13758248),
    specialties: ["Прецизност", "Брада", "Възстановяване"],
    sortOrder: 7,
  },
  {
    slug: "anna",
    name: "Анна",
    years: 15,
    quote:
      "Отдадена съм на занаята — качествени срязвания, безшевни фейдове и внимание към всеки детайл.",
    imageUrl: px(3993303),
    specialties: ["Фейдове", "Срязвания", "Детайли"],
    sortOrder: 8,
  },
];

export const REVIEWS = [
  {
    name: "Николай П.",
    text: "Вече три години не ходя другаде и не съжалявам нито веднъж. Отделят време, грижат се за детайла и винаги намират място при спешност. Фейдът ми 3/2/1 е перфектен всеки път.",
    tag: "Постоянен клиент",
  },
  {
    name: "Георги М.",
    text: "Топ място! Истински професионалисти, страхотна атмосфера и чувство за хумор. Винаги излизам доволен — препоръчвам на всеки.",
    tag: "Google отзив",
  },
  {
    name: "Стоян Д.",
    text: "Най-доброто подстригване в Петрич!",
    tag: "Google отзив",
  },
  {
    name: "Васил К.",
    text: "След бръсненето с гореща кърпа излизаш нов човек. Чиста работа, уютен салон, точен час. Пет звезди са малко.",
    tag: "Google отзив",
  },
  {
    name: "Мария С.",
    text: "Запазих час онлайн за две минути, посрещнаха ме с кафе и усмивка. Салонът е уютен, а резултатът — безупречен.",
    tag: "Google отзив",
  },
] as const;

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  credit?: string;
  tall?: boolean;
  local?: boolean;
}

export const GALLERY: GalleryItem[] = [
  {
    src: "/images/shop-real.jpg",
    alt: "Интериорът на Best Barberro Shop на ул. „Христо Чернопеев“ 2 в Петрич",
    caption: "Нашият салон",
    credit: "Снимка от Google профила",
    tall: true,
    local: true,
  },
  {
    src: px(12464841, 1200, 800),
    alt: "Детайлизиране на скин фейд с ножче",
    caption: "Работа с нож",
  },
  {
    src: px(34702982, 1200, 800),
    alt: "Класическо подстригване с ножица",
    caption: "Класически занаят",
  },
  {
    src: px(16372624),
    alt: "Гребен и бръснач върху кожен бръснарски стол",
    caption: "Инструментите",
    tall: true,
  },
  {
    src: px(12464838, 1200, 800),
    alt: "Бръснене на глава с прав нож в близък план",
    caption: "Гореща кърпа",
  },
  {
    src: px(9971240, 1200, 800),
    alt: "Довършителни движения с машинка и гребен",
    caption: "Детайлни минания",
  },
  {
    src: px(14781974, 1200, 800),
    alt: "Подстригване в процес под студийна светлина",
    caption: "На стола",
  },
  {
    src: px(36043163, 1200, 800),
    alt: "Машинка за подстригване в близък план",
    caption: "Механика на фейда",
  },
];

export const MARQUEE_ITEMS = [
  "Подстригване",
  "Оформяне на брада",
  "Гореща кърпа",
  "Скин фейд",
  "Контуриране",
  "Боядисване",
  "Фациална терапия",
  "Детски часове",
  "Сиви корени",
  "Кафе на гости",
] as const;
