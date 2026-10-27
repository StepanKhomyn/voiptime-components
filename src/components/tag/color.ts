type Rgb = [number, number, number];

const WHITE: Rgb = [255, 255, 255];
const BLACK: Rgb = [0, 0, 0];
// --color-gray-1 — темний текст для світлих solid-тегів
const DARK_TEXT: Rgb = [51, 51, 51];

// Частка основного кольору у фоні soft-тега (має збігатися з --vt-tag-bg у tag.scss)
const SOFT_BG_RATIO = 0.12;
// WCAG AA для звичайного тексту
const MIN_TEXT_CONTRAST = 4.5;

let canvasContext: CanvasRenderingContext2D | null = null;

/**
 * Приводить будь-який CSS-колір (hex, назва, rgb(), hsl(), oklch(), var(--...)) до RGB.
 * Колір резолвиться в контексті елемента, тому працюють і змінні, задані на предках.
 * Через canvas — бо getComputedStyle для oklch()/color() повертає не rgb.
 */
const resolveColor = (color: string, context: HTMLElement): Rgb | null => {
  const probe = document.createElement('span');
  probe.style.color = color;
  if (!probe.style.color) return null;

  probe.style.display = 'none';
  context.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  canvasContext ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!canvasContext) return null;

  canvasContext.clearRect(0, 0, 1, 1);
  canvasContext.fillStyle = computed;
  canvasContext.fillRect(0, 0, 1, 1);
  const [r, g, b] = canvasContext.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
};

const channelLuminance = (value: number) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]: Rgb) =>
  0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);

const contrast = (a: Rgb, b: Rgb) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

const mix = (from: Rgb, to: Rgb, weight: number): Rgb =>
  from.map((channel, i) => Math.round(channel + (to[i] - channel) * weight)) as Rgb;

const toCss = ([r, g, b]: Rgb) => `rgb(${r}, ${g}, ${b})`;

/**
 * Відтінки, які не можна вивести чистим CSS: читабельний текст на м'якому фоні
 * (затемнюємо основний колір, доки контраст не дотягне до AA) і колір тексту на solid-фоні.
 * Фон, бордер і ховер виводяться з --vt-tag-main прямо в tag.scss.
 */
export const deriveTagPalette = (color: string, context: HTMLElement): Record<string, string> | null => {
  const main = resolveColor(color, context);
  if (!main) return null;

  const softBg = mix(WHITE, main, SOFT_BG_RATIO);
  let text = main;
  for (let darken = 0.05; contrast(text, softBg) < MIN_TEXT_CONTRAST && darken <= 1; darken += 0.05) {
    text = mix(main, BLACK, darken);
  }

  const onMain = contrast(WHITE, main) >= contrast(DARK_TEXT, main) ? WHITE : DARK_TEXT;

  return {
    '--vt-tag-text': toCss(text),
    '--vt-tag-on-main': toCss(onMain),
  };
};
