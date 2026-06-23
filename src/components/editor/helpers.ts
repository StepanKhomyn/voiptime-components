import { ALLOWED_TAGS, ALLOWED_ATTRS } from './constants';

/**
 * Очищає HTML від потенційно небезпечних тегів та атрибутів (проста XSS санітизація)
 */
export function customSanitizeHtml(html: string): string {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  function cleanNode(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      if (!ALLOWED_TAGS.has(tagName)) {
        while (el.firstChild) el.parentNode?.insertBefore(el.firstChild, el);
        el.parentNode?.removeChild(el);
        return;
      }

      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value.toLowerCase().trim();
        if (!ALLOWED_ATTRS.has(attrName) || attrName.startsWith('on') || attrValue.startsWith('javascript:')) {
          el.removeAttribute(attr.name);
        }
      }
    }

    const children = Array.from(node.childNodes);
    for (let i = children.length - 1; i >= 0; i--) {
      cleanNode(children[i]);
    }
  }

  cleanNode(body);
  return body.innerHTML;
}

/**
 * Видаляє абсолютно всі HTML теги, повертаючи чистий текст
 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent ?? tmp.innerText ?? '';
}
