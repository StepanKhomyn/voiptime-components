// vnodeToCode.ts v4 — named slots підтримка
import { Comment, Fragment, Text, type VNode } from 'vue';

export function vnodeToCode(vnodes: VNode | VNode[], indent = 0): string {
  const nodes = Array.isArray(vnodes) ? vnodes : [vnodes];
  const pad = '  '.repeat(indent);
  return nodes
    .map(vnode => nodeToString(vnode, indent, pad))
    .filter(Boolean)
    .join('\n');
}

function nodeToString(vnode: VNode, indent: number, pad: string): string {
  // ── Текст ──────────────────────────────────────────────────────────────────
  if (vnode.type === Text || (typeof vnode.type === 'symbol' && String(vnode.type).includes('Text'))) {
    const text = String(vnode.children ?? '').trim();
    return text ? `${pad}${text}` : '';
  }

  // ── Коментар ───────────────────────────────────────────────────────────────
  if (vnode.type === Comment) return '';

  // ── Fragment ───────────────────────────────────────────────────────────────
  if (vnode.type === Fragment) {
    return vnodeToCode(normalizeChildren(vnode.children), indent);
  }

  const tag = getTagName(vnode.type);
  const props = buildProps(vnode.props ?? {});
  const children = getChildren(vnode); // default slot як масив VNode
  const slots = getNamedSlots(vnode); // { slotName: VNode[] }

  const hasDefault = children.length > 0;
  const hasNamed = Object.keys(slots).length > 0;

  // ── Self-closing ───────────────────────────────────────────────────────────
  if (!hasDefault && !hasNamed) {
    return `${pad}<${tag}${props ? ' ' + props : ''} />`;
  }

  // ── З контентом ───────────────────────────────────────────────────────────
  const innerParts: string[] = [];

  // default slot
  if (hasDefault) {
    const childCode = vnodeToCode(children, indent + 1);
    innerParts.push(childCode);
  }

  // named slots → <template #name>...</template>
  for (const [slotName, slotNodes] of Object.entries(slots)) {
    const slotCode = vnodeToCode(slotNodes, indent + 2);
    const slotPad = '  '.repeat(indent + 1);
    innerParts.push(`${slotPad}<template #${slotName}>\n${slotCode}\n${slotPad}</template>`);
  }

  const inner = innerParts.join('\n');

  // Inline якщо тільки short default text і нема named slots
  if (!hasNamed && !inner.includes('\n') && inner.trim().length < 40 && !inner.trim().startsWith('<')) {
    return `${pad}<${tag}${props ? ' ' + props : ''}>${inner.trim()}</${tag}>`;
  }

  return `${pad}<${tag}${props ? ' ' + props : ''}>\n${inner}\n${pad}</${tag}>`;
}

// ─── Tag name ────────────────────────────────────────────────────────────────
function getTagName(type: VNode['type']): string {
  if (typeof type === 'string') return type;
  if (typeof type === 'object' && type !== null) {
    const comp = type as { __name?: string; name?: string };
    return comp.__name ?? comp.name ?? 'Component';
  }
  return 'Component';
}

// ─── Props ───────────────────────────────────────────────────────────────────
function buildProps(rawProps: Record<string, unknown>): string {
  const props = { ...rawProps };
  const parts: string[] = [];

  // v-model: modelValue + onUpdate:modelValue
  if ('modelValue' in props && 'onUpdate:modelValue' in props) {
    const varName = extractVModelName(props['onUpdate:modelValue'] as Function);
    parts.push(varName ? `v-model="${varName}"` : 'v-model');
    delete props['modelValue'];
    delete props['onUpdate:modelValue'];
  }

  // іменовані v-model: modelFoo + onUpdate:modelFoo
  for (const key of Object.keys(props)) {
    if (key.startsWith('onUpdate:')) {
      const modelName = key.slice('onUpdate:'.length);
      if (modelName in props) {
        const varName = extractVModelName(props[key] as Function);
        parts.push(varName ? `v-model:${modelName}="${varName}"` : `v-model:${modelName}`);
        delete props[modelName];
        delete props[key];
      }
    }
  }

  for (const [key, val] of Object.entries(props)) {
    const part = propToString(key, val);
    if (part) parts.push(part);
  }

  return parts.join(' ');
}

function propToString(key: string, val: unknown): string | null {
  if (val === null || val === undefined) return null;
  if (key === 'style' || key === 'innerHTML') return null;

  if (key.startsWith('on') && typeof val === 'function') {
    if (key.startsWith('onUpdate:')) return null;
    const name = getFunctionName(val as Function);
    const event = key.slice(2).replace(/^([A-Z])/, c => c.toLowerCase());
    return name ? `@${event}="${name}"` : `@${event}="..."`;
  }

  if (key === 'class') {
    const cls = normalizeClass(val);
    return cls ? `class="${cls}"` : null;
  }

  if (val === true) return key;
  if (val === false) return null;
  if (typeof val === 'string') return `${key}="${val}"`;

  return `:${key}="${formatValue(val)}"`;
}

// ─── Children: default slot ───────────────────────────────────────────────────
function getChildren(vnode: VNode): VNode[] {
  // Рядковий/числовий контент
  if (typeof vnode.children === 'string' || typeof vnode.children === 'number') {
    return [{ type: Text, children: String(vnode.children) } as VNode];
  }

  // Масив (без слотів)
  if (Array.isArray(vnode.children)) {
    return (vnode.children as unknown[]).flat() as VNode[];
  }

  // Об'єкт слотів — беремо тільки default
  if (vnode.children && typeof vnode.children === 'object') {
    const slots = vnode.children as Record<string, unknown>;
    if (typeof slots.default === 'function') {
      try {
        return normalizeChildren((slots.default as () => VNode[])());
      } catch {
        return [];
      }
    }
  }

  return [];
}

// ─── Named slots (всі крім default) ─────────────────────────────────────────
function getNamedSlots(vnode: VNode): Record<string, VNode[]> {
  if (!vnode.children || typeof vnode.children !== 'object' || Array.isArray(vnode.children)) {
    return {};
  }

  const slots = vnode.children as Record<string, unknown>;
  const result: Record<string, VNode[]> = {};

  for (const [name, fn] of Object.entries(slots)) {
    // Пропускаємо default і службові поля Vue (_)
    if (name === 'default' || name.startsWith('_')) continue;
    if (typeof fn !== 'function') continue;

    try {
      const nodes = normalizeChildren((fn as () => VNode[])());
      if (nodes.length) result[name] = nodes;
    } catch {
      /* ігноруємо */
    }
  }

  return result;
}

// ─── Утиліти ─────────────────────────────────────────────────────────────────
function extractVModelName(handler: unknown): string {
  if (typeof handler !== 'function') return '';
  const src = handler.toString();

  const paramMatch = src.match(/^\s*\(?\s*([\w$]+)\s*\)?\s*=>/);
  const param = paramMatch?.[1];
  if (!param) return '';

  const escapedParam = param.replace(/\$/g, '\\$');
  const assignRegex = new RegExp(`\\(?\\s*([\\w$]+(?:\\.[\\w$]+)*)\\s*\\)?\\s*=\\s*${escapedParam}(?!\\s*=>)`);
  const match = src.match(assignRegex);
  const result = match?.[1];

  if (!result || result === param) return '';
  return result;
}

function getFunctionName(fn: Function): string {
  const name = fn.name ?? '';
  if (name && name !== 'bound ') {
    return name.startsWith('bound ') ? name.slice(6) : name;
  }
  const src = fn.toString();
  const match = src.match(/^(?:async\s+)?function\s+([\w$]+)/) || src.match(/^(?:async\s+)?([\w$]+)\s*=>/);
  const parsed = match?.[1];
  if (!parsed || parsed === '$event' || parsed === '_ctx') return '';
  return parsed;
}

function normalizeClass(val: unknown): string {
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return (val as string[]).filter(Boolean).join(' ');
  if (typeof val === 'object' && val !== null) {
    return Object.entries(val as Record<string, boolean>)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(' ');
  }
  return '';
}

function formatValue(val: unknown): string {
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val);
    } catch {
      return '...';
    }
  }
  return String(val);
}

function normalizeChildren(children: unknown): VNode[] {
  if (!children) return [];
  if (Array.isArray(children)) return (children as unknown[]).flat() as VNode[];
  return [children as VNode];
}
