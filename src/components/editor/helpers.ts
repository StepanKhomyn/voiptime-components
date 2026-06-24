// ─── Whitelist ────────────────────────────────────────────────────────────────

/**
 * Теги що браузер генерує через execCommand + стандартна редакторська розмітка.
 * <font> — execCommand('fontName') / execCommand('fontSize')
 * <strong>,<em>,<s> — execCommand('bold') / 'italic' / 'strikeThrough') у Chrome
 * <b>,<i>,<u>,<strike> — те саме у Firefox / Safari
 */
const ALLOWED_TAGS = new Set([
  // Блочні
  'p',
  'div',
  'br',
  'hr',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'pre',
  'code',
  'ul',
  'ol',
  'li',
  // Inline форматування
  'b',
  'strong',
  'i',
  'em',
  'u',
  's',
  'strike',
  'del',
  'sub',
  'sup',
  'font', // execCommand('fontName') вставляє саме <font face="...">
  'span',
  // Медіа
  'a',
  'img',
  // Таблиці
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'caption',
]);

/**
 * Дозволені атрибути — глобально для всіх тегів.
 * Конкретні обмеження (href, src) додатково перевіряються нижче.
 */
const ALLOWED_ATTRS = new Set([
  'style',
  'class',
  'href',
  'target',
  'rel',
  'src',
  'alt',
  'width',
  'height',
  'face',
  'size',
  'color', // <font> атрибути
  'colspan',
  'rowspan',
]);

// ─── CSS sanitizer ────────────────────────────────────────────────────────────

/**
 * CSS властивості що можуть виконати JS або завантажити зовнішній ресурс.
 * Повний список: https://owasp.org/www-community/attacks/CSS_Injection
 */
const FORBIDDEN_CSS_PROPS = new Set([
  'behavior', // IE: behavior: url(...)
  '-moz-binding', // Firefox XUL binding
  'filter', // IE: filter: progid:DXImageTransform...
]);

/** Паттерни значень що виконують код навіть у дозволених CSS властивостях */
const DANGEROUS_CSS_VALUE = /expression\s*\(|javascript\s*:|vbscript\s*:/i;

/**
 * Перевіряє кожну CSS-декларацію і повертає очищений style-рядок.
 * Використовує CSSStyleDeclaration браузера як парсер — він нормалізує
 * синтаксис і знімає більшість обфускацій ще до нашої перевірки.
 */
function sanitizeStyle(rawStyle: string): string {
  // Парсимо через браузерний CSS-парсер
  const el = document.createElement('span');
  el.setAttribute('style', rawStyle);
  const style = el.style;

  const safe: string[] = [];

  for (let i = 0; i < style.length; i++) {
    const prop = style[i];
    const value = style.getPropertyValue(prop);

    if (FORBIDDEN_CSS_PROPS.has(prop)) continue;
    if (DANGEROUS_CSS_VALUE.test(value)) continue;
    // url() в CSS може завантажити зовнішній ресурс або виконати JS
    // Дозволяємо тільки data: для зображень (background-image: url(data:image/...))
    if (/url\s*\(/i.test(value) && !/url\s*\(\s*['"]?data:image\//i.test(value)) continue;

    safe.push(`${prop}:${value}`);
  }

  return safe.join(';');
}

// ─── URL sanitizer ────────────────────────────────────────────────────────────

/** Дозволені протоколи в href / src */
const ALLOWED_PROTOCOLS = new Set(['https:', 'http:', 'ftp:', 'mailto:', 'tel:']);

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  // Відносні URL — безпечні
  if (trimmed.startsWith('/') || trimmed.startsWith('.') || trimmed.startsWith('#')) return true;

  try {
    const url = new URL(trimmed);
    return ALLOWED_PROTOCOLS.has(url.protocol);
  } catch {
    // URL() кидає помилку для відносних посилань в деяких браузерах — вважаємо безпечними
    return !/^[a-z][a-z0-9+\-.]*:/i.test(trimmed);
  }
}

// ─── Node cleaner ─────────────────────────────────────────────────────────────

function cleanNode(node: Node): void {
  // Видаляємо коментарі та processing instructions — можуть містити <!-- <script> -->
  if (node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    node.parentNode?.removeChild(node);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  // Тег не в whitelist — розпаковуємо вміст (не видаляємо дітей, бо текст треба зберегти)
  if (!ALLOWED_TAGS.has(tag)) {
    while (el.firstChild) el.parentNode?.insertBefore(el.firstChild, el);
    el.parentNode?.removeChild(el);
    return;
  }

  // Чистимо атрибути
  const attrs = Array.from(el.attributes);
  for (const attr of attrs) {
    const name = attr.name.toLowerCase();

    // on* — завжди XSS
    if (name.startsWith('on')) {
      el.removeAttribute(attr.name);
      continue;
    }

    if (!ALLOWED_ATTRS.has(name)) {
      el.removeAttribute(attr.name);
      continue;
    }

    // href / src — перевіряємо протокол
    if (name === 'href' || name === 'src') {
      if (!isSafeUrl(attr.value)) {
        el.removeAttribute(attr.name);
        continue;
      }
    }

    // style — очищаємо через CSS-парсер
    if (name === 'style') {
      const safe = sanitizeStyle(attr.value);
      if (safe) el.setAttribute('style', safe);
      else el.removeAttribute('style');
      continue;
    }
  }

  // Примусово додаємо rel до зовнішніх посилань
  if (tag === 'a' && el.getAttribute('target') === '_blank') {
    el.setAttribute('rel', 'noopener noreferrer');
  }

  // Рекурсивно чистимо дітей (з кінця, бо розпаковування змінює DOM)
  const children = Array.from(el.childNodes);
  for (let i = children.length - 1; i >= 0; i--) {
    cleanNode(children[i]);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Очищає HTML від XSS-загроз зберігаючи весь валідний редакторський розмітки.
 *
 * Захищає від:
 * - script/iframe/object ін'єкцій
 * - on* обробників подій
 * - javascript: / vbscript: в href та src
 * - CSS expression() та -moz-binding
 * - HTML-коментарів з вбудованим кодом
 */
export function customSanitizeHtml(html: string): string {
  if (!html) return '';

  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Видаляємо <head> повністю — там можуть бути <script>, <style>, <meta refresh>
  doc.head.innerHTML = '';

  const children = Array.from(doc.body.childNodes);
  for (let i = children.length - 1; i >= 0; i--) {
    cleanNode(children[i]);
  }

  return doc.body.innerHTML;
}

/**
 * Видаляє всі HTML теги, повертає чистий текст.
 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent ?? tmp.innerText ?? '';
}
