# Best Barberro Shop — Петрич ✂️

Модерен двурежимен уебсайт за бръснарския салон **Best Barberro Shop** в
Петрич, България (ул. „Христо Чернопеев“ 2). Тъмен, кинематографичен дизайн,
цялото съдържание на български, реални данни от Google профила на салона и
работеща система за онлайн резервации.

| Режим | Къде работи | Резервации и админ панел |
|---|---|---|
| **Fullstack** | Next.js сървър + PostgreSQL | Реална база данни (Drizzle ORM), защитен вход, споделени за всички потребители |
| **Статичен (GitHub Pages)** | Всеки статичен хостинг | Демо резервации в `localStorage` на браузъра, демо вход за панела |

---

## Страници

`/` Начало · `/about` За нас · `/services` Услуги и цени · `/masters` Майстори ·
`/gallery` Галерия (вкл. снимка от Google профила на салона) · `/contact` Контакти ·
`/book` Запази час (4-стъпков асистент) · `/admin` Контролен панел за екипа

## Технологии

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4**, framer-motion, lucide-react
- **PostgreSQL** + **Drizzle ORM** (fullstack режим)
- Шрифтове с кирилица: Oswald, Playfair Display, Manrope

---

## 1. Локален старт (fullstack режим)

Изисква се **Node 20+** и **PostgreSQL**.

```bash
npm install
cp .env.example .env          # попълни DATABASE_URL (и ADMIN_PASSCODE при желание)
npx drizzle-kit push          # създава таблиците
npm run dev                   # http://localhost:3000
```

При първа заявка базата се зарежда автоматично с каталога на салона
(услуги, цени в лева, майстори).

- Работно време: **вторник–събота, 09:30–19:00** · неделя и понеделник — почивни
  (вградено и в резервационния двигател).
- Контролен панел: `http://localhost:3000/admin` — код `legends`
  (сменя се с `ADMIN_PASSCODE` в `.env`).

### Production старт със сървър

```bash
npm run build
npm start
```

---

## 2. GitHub Pages (статичен режим)

GitHub Pages обслужва само статични файлове, затова съществува специален износ
(`next build` → `./out`), в който:

- същият дизайн и всички страници се генерират като чист HTML/CSS/JS;
- `/book` изчислява свободните часове в браузъра и пази резервациите в
  `localStorage`;
- `/admin` работи с демо вход (`legends`) срещу същите локални данни;
- `/api/*` маршрутите се изключват автоматично от build-а.

### Локална проверка на статичния вариант

```bash
node scripts/build-static.mjs        # генерира ./out
npx serve out                        # или python3 -m http.server -d out
```

### Автоматичен деплой (вече е настроен)

1. Качи кода в GitHub репозитори (`main` клон).
2. В **Settings → Pages → Source** избери **GitHub Actions**.
3. Workflow-ът [.github/workflows/pages.yml](.github/workflows/pages.yml) ще
   билдне и публикува сайта на
   `https://<потребител>.github.io/<име-на-репото>/`.

> Репозиторито-страница (root домейн `https://<потребител>.github.io`)?
> Редактирай workflow-а и остави `BASE_PATH: ""`.

---

## Структура

```
src/
├─ app/
│  ├─ page.tsx, about/, services/, masters/, gallery/, contact/  # страници
│  ├─ book/                          # 4-стъпкова резервация
│  ├─ admin/                         # контролен панел (двурежимен)
│  └─ api/                           # услуги, наличност, резервации, вход (fullstack)
├─ components/                       # hero, меню, майстори, галерия, wizard, админ…
├─ lib/
│  ├─ shop.ts                        # ВСИЧКИ данни на салона (един източник)
│  ├─ slots.ts                       # двигател за свободни часове (споделен)
│  └─ local-bookings.ts              # localStorage тефтер (статичен режим)
├─ db/                               # Drizzle схема + seed (upsert)
scripts/build-static.mjs             # статичен износ за GitHub Pages
public/images/                       # hero, craft и реалната снимка на салона
```

## Бележки

- Снимката `public/images/shop-real.jpg` е реалният интериор от Google
  профила на салона; останалите кадри в галерията/майсторите са от Pexels.
- За промяна на услуги, цени, часове или отзиви редактирай само
  `src/lib/shop.ts` — промяната се отразява навсякъде (сайт, API, seed).

© 2026 Best Barberro Shop · MIT License
