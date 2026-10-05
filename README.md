# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3
`<script setup>` SFCs, check out
the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in
the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

ПРАВИЛА ПУШУ НА ГІТ ХАБ

# Patch версія (0.0.29 → 0.0.30)

git commit -m "fix: виправлено помилку з компонентом"

# Minor версія (0.0.29 → 0.1.0)

git commit -m "feat: додано новий компонент Button"

# Major версія (0.0.29 → 1.0.0)

git commit -m "feat!: змінено API компонента
BREAKING CHANGE: параметр color тепер приймає тільки hex значення"

git push origin main

ПІСЛЯ ЦЬОГО ВЕСІЯ АВТОМАТИЧНО МІНЯЄТЬСЯ, БІЛДАЄТЬСЯ ТА ДЕПЛОЇТЬСЯ, А ТАКОЖ ВИСАВЛЯЄТЬСЯ НА NPM

генерування іконок
npm run generate-icons

# Іконки з Figma (src/icon-groups)

Іконки згруповані за розділами з Figma-файлу
[VT_icons_base](https://www.figma.com/design/6VQ3TVEZ2eEew06yQdjPFK/VT_icons_base--Copy-).
Кожна група — окрема папка в `src/icon-groups/<група>/`, назва іконки = префікс групи + назва:

```
src/icon-groups/
  left-menu/LeftMenuCrmIcon.vue   → <VIcon name="left_menu_crm" />
  phone/PhoneHangupIcon.vue       → <VIcon name="phone_hangup" />
  index.ts                        ← генерується автоматично, не редагувати
```

Однотонні іконки використовують `currentColor`, тому колір задається через `color`
(`<VIcon name="filter_save" color="#a82525" />`). Багатоколірні (месенджери, прапори, no-data,
`phone_answer_call`, `phone_hangup_call`) зберігають оригінальні кольори.

Старі іконки з `src/icons` (`arrowDown`, `filterSave`, ...) теж працюють у `VIcon`, але вони deprecated —
для нового коду використовуйте іконки з груп. Усі доступні іконки — в демо, розділ **Icon Groups** (`npm run dev`).

## Налаштування токена Figma (один раз)

1. Figma → Settings → Security → Personal access tokens → Generate new token, scope **File content: Read-only**.
2. Створіть у корені проєкту файл `.env.local` (він у `.gitignore`):

```
FIGMA_TOKEN=figd_xxxxxxxxxxxxxxxx
```

## Скрипти

| Команда | Що робить |
|---|---|
| `npm run fetch-icons` | Завантажує структуру файлу та SVG з Figma, оновлює кеш `.figma-cache`, перегенеровує `src/icon-groups` та `index.ts` |
| `npm run fetch-icons:offline` | Те саме, але з кешу `.figma-cache`, без запитів до Figma |
| `npm run generate-icon-groups` | Тільки перегенеровує `src/icon-groups/index.ts` з наявних `.vue` файлів |

## Як оновити іконки, коли дизайнер змінив Figma

1. Переконайтесь, що є `.env.local` з `FIGMA_TOKEN`.
2. Запустіть `npm run fetch-icons`.
3. Якщо скрипт повідомляє про **іконки без групи** — додайте новий фрейм Figma у `groups` в
   `scripts/icon-groups.config.cjs` і запустіть `npm run fetch-icons:offline`.
4. Якщо скрипт повідомляє про **дублікати назв** — додайте перейменування у `rename` і запустіть
   `npm run fetch-icons:offline`.
5. Перевірте результат у демо (`npm run dev` → Icon Groups) та `git diff src/icon-groups`.
6. Закомітьте зміни (`feat: оновлено іконки` / `fix: ...`).

> ⚠️ Figma має жорсткі ліміти на експорт (для деяких типів місць — кілька запитів на кілька днів).
> Якщо отримали `перевищено ліміт запитів, повторіть через N хв` — дочекайтесь або використайте токен
> акаунта з Dev/Full seat. Через це структура файлу та SVG кешуються у `.figma-cache` (не в git):
> **для зміни груп і назв Figma не потрібна** — достатньо `npm run fetch-icons:offline`.
> Кеш є тільки локально: на новій машині перший запуск має бути `npm run fetch-icons`.

## Конфігурація `scripts/icon-groups.config.cjs`

- `groups` — групи: `folder` (папка та префікс назви), `frames` (фрейми Figma, з яких беруться іконки),
  `strip` (слова, які прибираються з початку назви: `messageEdit` → `message_edit`, а не `message_message_edit`),
  `multicolor` / `multicolorIcons` — не замінювати кольори на `currentColor`.
- `rename` — ручні назви у форматі `'<папка>/<назва у Figma>': '<назва без префікса>'`
  (наприклад `'player/forword': 'forward'` → `player_forward`).
- `skipColors` — іконки з цими кольорами пропускаються (сірий `#828282` у легенді дизайнера —
  «не знаю, чи потрібні»).

