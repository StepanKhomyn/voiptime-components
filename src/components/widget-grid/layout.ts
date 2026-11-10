import type { VWidgetGridId, VWidgetGridItem, VWidgetGridLayout } from './types';

export const cloneLayout = (layout: VWidgetGridLayout): VWidgetGridLayout => layout.map(i => ({ ...i }));

export const collides = (a: VWidgetGridItem, b: VWidgetGridItem): boolean =>
  a.id !== b.id && a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export const layoutBottom = (layout: VWidgetGridLayout): number =>
  layout.reduce((max, i) => Math.max(max, i.y + i.h), 0);

const byPosition = (a: VWidgetGridItem, b: VWidgetGridItem) => a.y - b.y || a.x - b.x;

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** Обмежує розмір та позицію віджета його min/max і межами сітки */
export function clampItem(item: VWidgetGridItem, columns: number): VWidgetGridItem {
  const maxW = Math.min(item.maxW ?? columns, columns);
  const w = clamp(Math.round(item.w), Math.min(item.minW ?? 1, maxW), maxW);
  const h = clamp(Math.round(item.h), item.minH ?? 1, item.maxH ?? Infinity);
  const x = clamp(Math.round(item.x), 0, columns - w);
  const y = Math.max(0, Math.round(item.y));
  return { ...item, x, y, w, h };
}

/** Підтягує віджети вгору, наскільки дозволяють сусіди. Static-віджети не рухаються */
export function compactLayout(layout: VWidgetGridLayout): VWidgetGridLayout {
  const placed: VWidgetGridItem[] = layout.filter(i => i.static);
  const movable = layout.filter(i => !i.static).sort(byPosition);

  for (const item of movable) {
    item.y = Math.min(item.y, layoutBottom(placed));
    while (item.y > 0 && !placed.some(p => collides({ ...item, y: item.y - 1 }, p))) item.y--;
    // Якщо все ж перетинається (напр. зі static) — опускаємо нижче
    let hit: VWidgetGridItem | undefined;
    while ((hit = placed.find(p => collides(item, p)))) item.y = hit.y + hit.h;
    placed.push(item);
  }
  return layout;
}

/**
 * Розміщує активний віджет у новій позиції/розмірі та розсуває решту.
 * Рахується завжди від початкової (до жесту) розкладки, тож повернення курсору
 * назад відновлює все як було.
 *
 * Для кожного віджета, на який "наїхали", пробуємо по черзі:
 *   1) обмін — стати на початкове місце активного віджета (swap);
 *   2) стати над активним віджетом;
 *   3) зсунутися вниз.
 */
export function placeItem(
  startLayout: VWidgetGridLayout,
  activeId: VWidgetGridId,
  target: Pick<VWidgetGridItem, 'x' | 'y' | 'w' | 'h'>,
  options: { columns: number; compact: boolean; allowSwap: boolean },
): VWidgetGridLayout {
  const layout = cloneLayout(startLayout);
  const active = layout.find(i => i.id === activeId);
  if (!active) return layout;
  const origin = { ...active };

  Object.assign(active, clampItem({ ...active, ...target }, options.columns));

  // Static віджети непорушні: якщо активний на них наїхав — опускаємо його нижче
  let staticHit: VWidgetGridItem | undefined;
  while ((staticHit = layout.find(i => i.static && collides(active, i)))) active.y = staticHit.y + staticHit.h;

  const placed: VWidgetGridItem[] = [active, ...layout.filter(i => i.static)];
  const pending = layout.filter(i => i !== active && !i.static).sort(byPosition);

  const fits = (candidate: VWidgetGridItem, self: VWidgetGridItem) =>
    candidate.y >= 0 &&
    candidate.x >= 0 &&
    candidate.x + candidate.w <= options.columns &&
    !placed.some(p => collides(candidate, p)) &&
    !pending.some(p => p !== self && collides(candidate, p));

  for (const item of [...pending]) {
    if (placed.some(p => collides(item, p))) {
      const swap = { ...item, x: origin.x, y: origin.y };
      const above = { ...item, y: active.y - item.h };

      if (options.allowSwap && fits(swap, item)) {
        item.x = swap.x;
        item.y = swap.y;
      } else if (fits(above, item)) {
        item.y = above.y;
      } else {
        let hit: VWidgetGridItem | undefined;
        while ((hit = placed.find(p => collides(item, p)))) item.y = hit.y + hit.h;
      }
    }
    pending.splice(pending.indexOf(item), 1);
    placed.push(item);
  }

  return options.compact ? compactLayout(layout) : layout;
}

/** Нормалізує вхідну розкладку: межі, перетини, компактність */
export function normalizeLayout(layout: VWidgetGridLayout, columns: number, compact: boolean): VWidgetGridLayout {
  const result = layout.map(i => clampItem(i, columns));
  const placed: VWidgetGridItem[] = result.filter(i => i.static);
  for (const item of result.filter(i => !i.static).sort(byPosition)) {
    let hit: VWidgetGridItem | undefined;
    while ((hit = placed.find(p => collides(item, p)))) item.y = hit.y + hit.h;
    placed.push(item);
  }
  return compact ? compactLayout(result) : result;
}

export const sameLayout = (a: VWidgetGridLayout, b: VWidgetGridLayout): boolean =>
  a.length === b.length &&
  a.every(i => {
    const o = b.find(j => j.id === i.id);
    return !!o && o.x === i.x && o.y === i.y && o.w === i.w && o.h === i.h;
  });
