// Завантажує іконки з Figma та генерує Vue-компоненти у src/icon-groups/<група>/
// Запуск: npm run fetch-icons            - завантажити з Figma
//         npm run fetch-icons:offline    - перегенерувати з кешу .figma-cache (без запитів до Figma)
// Потрібен FIGMA_TOKEN у .env.local (Figma -> Settings -> Security -> Personal access tokens)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('./icon-groups.config.cjs');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.resolve(ROOT, config.outputDir);
const FIGMA_API = 'https://api.figma.com/v1';
const MAX_ICON_FRAME_SIZE = 32;
const IMAGES_BATCH_SIZE = 100;
const DOWNLOAD_CONCURRENCY = 10;
const DOWNLOAD_RETRIES = 3;
const CACHE_DIR = path.join(ROOT, '.figma-cache');
const OFFLINE = process.argv.includes('--offline');

// ----------------- Утиліти -----------------

function readToken() {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN;

  for (const file of ['.env.local', '.env']) {
    const envPath = path.join(ROOT, file);
    if (!fs.existsSync(envPath)) continue;
    const match = fs.readFileSync(envPath, 'utf8').match(/^FIGMA_TOKEN=(.+)$/m);
    if (match) return match[1].trim();
  }

  throw new Error('Не знайдено FIGMA_TOKEN. Додайте його у .env.local: FIGMA_TOKEN=figd_...');
}

// Кириличні літери, схожі на латинські (дизайнери інколи їх змішують: "Сalendar")
const LOOKALIKES = {
  а: 'a',
  с: 'c',
  е: 'e',
  о: 'o',
  р: 'p',
  х: 'x',
  і: 'i',
  у: 'y',
  к: 'k',
  м: 'm',
  т: 't',
  н: 'h',
  в: 'b',
};

function normalizeKey(str) {
  return str.trim().replace(/[а-яіїєґ]/gi, ch => {
    const latin = LOOKALIKES[ch.toLowerCase()];
    if (!latin) return ch;
    return ch === ch.toLowerCase() ? latin : latin.toUpperCase();
  });
}

function toWords(str) {
  return normalizeKey(str)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(word => word.toLowerCase());
}

const toSnake = str => toWords(str).join('_');
const toPascal = str =>
  toWords(str)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join('');

function toHex({ r, g, b }) {
  return (
    '#' +
    [r, g, b]
      .map(v =>
        Math.round(v * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}

async function figmaGet(url, token) {
  let response = await fetch(url, { headers: { 'X-Figma-Token': token } });

  // Ліміт запитів Figma: чекаємо стільки, скільки просить сервер, і пробуємо ще раз
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('retry-after')) || 60;
    if (retryAfter > 300) {
      throw new Error(`Figma API: перевищено ліміт запитів, повторіть через ${Math.ceil(retryAfter / 60)} хв`);
    }
    console.log(`⏳ Ліміт запитів Figma, очікування ${retryAfter} с...`);
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    response = await fetch(url, { headers: { 'X-Figma-Token': token } });
  }

  if (!response.ok) {
    throw new Error(`Figma API ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

async function downloadText(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      if (attempt >= DOWNLOAD_RETRIES) throw new Error(`${url}: ${error.cause?.message || error.message}`);
    }
  }
}

async function runWithConcurrency(items, limit, task) {
  const queue = [...items];
  const workers = Array.from({ length: limit }, async () => {
    while (queue.length) await task(queue.shift());
  });
  await Promise.all(workers);
}

// ----------------- Пошук іконок у дереві Figma -----------------

function hasComponentInside(node) {
  return (node.children || []).some(
    child => ['COMPONENT', 'INSTANCE'].includes(child.type) || hasComponentInside(child)
  );
}

function isIconNode(node) {
  if (['COMPONENT', 'INSTANCE'].includes(node.type)) return true;

  // Іконки, які дизайнер не зробив компонентом, але це окремий маленький фрейм
  const box = node.absoluteBoundingBox;
  return (
    node.type === 'FRAME' &&
    box &&
    box.width <= MAX_ICON_FRAME_SIZE &&
    box.height <= MAX_ICON_FRAME_SIZE &&
    !hasComponentInside(node)
  );
}

function collectColors(node, colors = new Set()) {
  if (node.visible === false) return colors;

  [...(node.fills || []), ...(node.strokes || [])]
    .filter(paint => paint.visible !== false && paint.type === 'SOLID')
    .forEach(paint => colors.add(toHex(paint.color)));

  (node.children || []).forEach(child => collectColors(child, colors));
  return colors;
}

function collectIcons(node, framePath = [], result = []) {
  if (node.visible === false) return result;

  if (isIconNode(node)) {
    result.push({ id: node.id, name: node.name, framePath, colors: collectColors(node) });
    return result;
  }

  (node.children || []).forEach(child => collectIcons(child, [...framePath, node.name], result));
  return result;
}

// ----------------- Розподіл по групах -----------------

const frameKey = segments => segments.map(segment => normalizeKey(segment).toLowerCase()).join('/');

function findGroup(icon) {
  // Шлях включає саму іконку, щоб можна було прив'язати окрему іконку з кореня секції (напр. "chatVIP")
  const fullPath = [...icon.framePath, icon.name];
  let best = null;

  for (const group of config.groups) {
    for (const frame of group.frames) {
      const target = frameKey(frame.split('/'));
      for (let length = fullPath.length; length > 0; length--) {
        if (frameKey(fullPath.slice(0, length)) === target && (!best || length > best.length)) {
          best = { group, length };
        }
      }
    }
  }

  return best?.group;
}

function buildIconName(icon, group) {
  const override = config.rename[`${group.folder}/${icon.name.trim()}`];
  const words = toWords(override || icon.name);

  if (!override) {
    const strip = (group.strip || []).map(word => word.toLowerCase());
    while (words.length > 1 && strip.includes(words[0])) words.shift();
  }

  const prefix = toSnake(group.folder);
  return `${prefix}_${words.join('_')}`;
}

// ----------------- Обробка SVG -----------------

function prefixIds(svg, prefix) {
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  return ids.reduce(
    (result, id) =>
      result
        .split(`id="${id}"`)
        .join(`id="${prefix}-${id}"`)
        .split(`url(#${id})`)
        .join(`url(#${prefix}-${id})`)
        .split(`href="#${id}"`)
        .join(`href="#${prefix}-${id}"`),
    svg
  );
}

// Замінює всі кольори на currentColor, окрім none та посилань на градієнти.
// Вміст <mask> та <clipPath> не чіпаємо - там колір визначає видимість, а не заливку
function applyCurrentColor(svg) {
  return svg
    .split(/(<(?:mask|clipPath)\b[\s\S]*?<\/(?:mask|clipPath)>)/)
    .map(part => {
      if (/^<(mask|clipPath)\b/.test(part)) return part;
      return part.replace(/\b(fill|stroke|stop-color)="(?!none|url\()[^"]*"/g, '$1="currentColor"');
    })
    .join('');
}

function svgToVue(svg, { multicolor, idPrefix }) {
  let result = svg.trim().replace(/<\?xml[^>]*>\s*/, '');
  result = prefixIds(result, idPrefix);
  if (!multicolor) result = applyCurrentColor(result);

  const indented = result
    .split('\n')
    .map(line => `  ${line}`)
    .join('\n');

  return `<template>\n${indented}\n</template>\n`;
}

// ----------------- Кеш -----------------
// Figma має жорсткі ліміти на експорт, тому структура файлу та SVG зберігаються у .figma-cache.
// З --offline іконки генеруються тільки з кешу (напр. після зміни груп або назв у конфігу)

const svgCachePath = id => path.join(CACHE_DIR, 'svg', `${id.replace(/[^a-zA-Z0-9]/g, '-')}.svg`);

function readCache(file) {
  const cachePath = path.join(CACHE_DIR, file);
  if (!fs.existsSync(cachePath)) {
    throw new Error(`Немає кешу ${path.relative(ROOT, cachePath)}. Запустіть без --offline`);
  }
  return fs.readFileSync(cachePath, 'utf8');
}

function writeCache(file, content) {
  const cachePath = path.join(CACHE_DIR, file);
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, content, 'utf8');
}

async function loadFigmaFile(token) {
  if (OFFLINE) return JSON.parse(readCache('file.json'));

  console.log('🔍 Завантаження структури файлу Figma...');
  const file = await figmaGet(`${FIGMA_API}/files/${config.fileKey}`, token);
  writeCache('file.json', JSON.stringify(file));
  return file;
}

async function loadSvgs(icons, token) {
  if (OFFLINE) {
    return Object.fromEntries(icons.map(icon => [icon.id, readCache(path.relative(CACHE_DIR, svgCachePath(icon.id)))]));
  }

  console.log('⬇️  Експорт SVG...');
  const svgUrls = {};
  for (let i = 0; i < icons.length; i += IMAGES_BATCH_SIZE) {
    const ids = icons.slice(i, i + IMAGES_BATCH_SIZE).map(icon => icon.id);
    const { images } = await figmaGet(
      `${FIGMA_API}/images/${config.fileKey}?ids=${encodeURIComponent(ids.join(','))}&format=svg&svg_include_id=false&svg_simplify_stroke=true`,
      token
    );
    Object.assign(svgUrls, images);
  }

  const svgs = {};
  await runWithConcurrency(icons, DOWNLOAD_CONCURRENCY, async icon => {
    if (!svgUrls[icon.id]) throw new Error(`Figma не повернула SVG для ${icon.figmaName} (${icon.id})`);
    svgs[icon.id] = await downloadText(svgUrls[icon.id]);
  });

  icons.forEach(icon => writeCache(path.relative(CACHE_DIR, svgCachePath(icon.id)), svgs[icon.id]));
  return svgs;
}

// ----------------- Основна функція -----------------

function resolveIcons(file) {
  const section = file.document.children.flatMap(page => page.children).find(node => node.name === config.rootSection);

  if (!section) throw new Error(`Секцію "${config.rootSection}" не знайдено у файлі Figma`);

  const ignoredFrames = config.ignoreFrames.map(name => normalizeKey(name).toLowerCase());
  const nodes = section.children
    .filter(node => !ignoredFrames.includes(normalizeKey(node.name).toLowerCase()))
    .flatMap(node => collectIcons(node));

  const skipColors = config.skipColors.map(color => color.toLowerCase());
  const icons = [];
  const skipped = [];
  const unmapped = [];

  for (const node of nodes) {
    if ([...node.colors].some(color => skipColors.includes(color))) {
      skipped.push(node);
      continue;
    }

    const group = findGroup(node);
    if (!group) {
      unmapped.push(node);
      continue;
    }

    const name = buildIconName(node, group);
    icons.push({
      ...node,
      group,
      name,
      figmaName: node.name,
      componentName: `${toPascal(name)}Icon`,
      multicolor: Boolean(group.multicolor || group.multicolorIcons?.includes(node.name.trim())),
    });
  }

  if (unmapped.length) {
    const list = unmapped.map(icon => `   - ${[...icon.framePath, icon.name].join(' / ')}`).join('\n');
    throw new Error(`Іконки без групи (додайте фрейм у icon-groups.config.cjs):\n${list}`);
  }

  const duplicates = icons.filter((icon, index) => icons.findIndex(other => other.name === icon.name) !== index);
  if (duplicates.length) {
    const list = duplicates.map(icon => `   - ${icon.name} (Figma: ${icon.figmaName})`).join('\n');
    throw new Error(`Дублікати назв (додайте rename у icon-groups.config.cjs):\n${list}`);
  }

  return { icons, skipped };
}

async function fetchFigmaIcons() {
  const token = OFFLINE ? null : readToken();
  const file = await loadFigmaFile(token);
  const { icons, skipped } = resolveIcons(file);

  console.log(`📦 Знайдено ${icons.length} іконок, пропущено ${skipped.length} (skipColors)`);

  // Спочатку завантажуємо все, щоб при помилці мережі не втратити поточні іконки
  const svgs = await loadSvgs(icons, token);

  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });

  for (const icon of icons) {
    const dir = path.join(OUTPUT_DIR, icon.group.folder);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, `${icon.componentName}.vue`),
      svgToVue(svgs[icon.id], { multicolor: icon.multicolor, idPrefix: icon.name.replace(/_/g, '-') }),
      'utf8'
    );
  }

  console.log(`✅ Іконки збережено у ${config.outputDir}`);
  if (skipped.length) {
    console.log(`⏭️  Пропущено: ${skipped.map(icon => icon.name).join(', ')}`);
  }

  try {
    execSync(`npx prettier --write "${config.outputDir}/**/*.vue"`, { cwd: ROOT, stdio: 'ignore' });
  } catch {
    console.warn('⚠️  Не вдалося відформатувати файли prettier-ом');
  }

  require('./generate-icon-groups.cjs');
}

if (require.main === module) {
  fetchFigmaIcons().catch(error => {
    console.error('❌ Помилка:', error.message);
    process.exit(1);
  });
}

module.exports = { resolveIcons, svgCachePath, CACHE_DIR };
