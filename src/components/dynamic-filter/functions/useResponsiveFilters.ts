import { nextTick, onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue';

interface ResponsiveFiltersOptions {
  /** Виводити діагностику в консоль */
  debug?: boolean;
  /** Мінімальна ширина одного фільтра */
  minFilterWidth?: number;
  /** Запас, щоб не впиратися в край пікселя в піксель */
  reserve?: number;
  /** Ширина кнопки "Більше фільтрів", поки її ще не виміряли */
  triggerFallbackWidth?: number;
}

const px = (value: string | null | undefined, fallback = 0) => {
  const n = parseFloat(value || '');
  return Number.isNaN(n) ? fallback : n;
};

const outerWidth = (el: HTMLElement) => {
  const s = getComputedStyle(el);
  return el.getBoundingClientRect().width + px(s.marginLeft) + px(s.marginRight);
};

export function useResponsiveFilters(
  containerRef: Ref<HTMLElement | null>,
  actionsRef: Ref<HTMLElement | null>,
  dropdownTriggerRef: Ref<HTMLElement | null>,
  measurementContainerRef: Ref<HTMLElement | null>,
  slotNodesLength: Ref<number>,
  options: ResponsiveFiltersOptions = {}
) {
  const {
    debug = false,
    minFilterWidth = 150,
    reserve = 8,
    triggerFallbackWidth = 140,
  } = options;

  const visibleIndexes = ref<number[]>([]);

  let lastTriggerWidth = 0;
  let rafId = 0;
  let ro: ResizeObserver | null = null;
  let observedMeasureItems: HTMLElement[] = [];
  const timers = new Set<number>();
  let destroyed = false;

  const log = (...args: unknown[]) => {
    if (debug) console.log('[useResponsiveFilters]', ...args);
  };

  function later(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      timers.delete(id);
      if (!destroyed) fn();
    }, ms);
    timers.add(id);
  }

  // debounce через rAF
  function scheduleCalculate() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      calculate();
    });
  }

  function setVisible(next: number[]) {
    const prev = visibleIndexes.value;
    const same = prev.length === next.length && prev.every((v, i) => v === next[i]);
    if (!same) visibleIndexes.value = next;
  }

  function calculate() {
    if (destroyed) return;

    const el = containerRef.value;
    const measureRoot = measurementContainerRef.value;
    if (!el || !measureRoot) return;

    // Хедер, у якому лежить фільтр (фільтр + кнопки справа)
    const header = (el.closest('.vt-page__card-header') as HTMLElement | null) ?? el.parentElement;
    if (!header) return;

    const headerStyle = getComputedStyle(header);
    const headerContentWidth =
      header.clientWidth - px(headerStyle.paddingLeft) - px(headerStyle.paddingRight);

    if (headerContentWidth <= 0) {
      log('skip: header has zero width (hidden?)');
      return;
    }

    const headerGap = px(headerStyle.columnGap, 10);
    const elGap = px(getComputedStyle(el).columnGap, 10);

    // --- Сусідні елементи хедера (все, крім самого фільтра) ---
    const ownChild = Array.from(header.children).find(c => c === el || c.contains(el));
    const siblings = (Array.from(header.children) as HTMLElement[]).filter(c => {
      if (c === ownChild) return false;
      const s = getComputedStyle(c);
      return s.display !== 'none' && s.position !== 'absolute' && s.position !== 'fixed';
    });
    const siblingsWidth = siblings.reduce((sum, s) => sum + outerWidth(s), 0);

    // Скільки місця має весь блок фільтра (el)
    const elAvailable = headerContentWidth - siblingsWidth - headerGap * siblings.length;

    // --- Всередині el: [inline] [dropdown?] [actions] ---
    const actionsWidth = actionsRef.value ? outerWidth(actionsRef.value) : 0;
    const actionsBlock = actionsWidth > 0 ? actionsWidth + elGap : 0;

    if (dropdownTriggerRef.value) {
      const w = outerWidth(dropdownTriggerRef.value);
      if (w > 0) lastTriggerWidth = w;
    }
    const triggerBlock = (lastTriggerWidth || triggerFallbackWidth) + elGap;

    // --- Ширини фільтрів ---
    const measureItems = Array.from(
      measureRoot.querySelectorAll<HTMLElement>('.vt-page__card-filter__measure-element')
    );
    const widths = measureItems.map(i => Math.max(i.getBoundingClientRect().width, minFilterWidth));

    if (widths.length === 0) {
      setVisible([]);
      return;
    }

    const totalWidth = widths.reduce((a, b) => a + b, 0) + elGap * (widths.length - 1);
    const limitWithoutTrigger = elAvailable - actionsBlock - reserve;

    const pack = (limit: number) => {
      const result: number[] = [];
      let used = 0;
      for (let i = 0; i < widths.length; i++) {
        const w = widths[i] + (i > 0 ? elGap : 0);
        if (used + w <= limit) {
          result.push(i);
          used += w;
        } else {
          break;
        }
      }
      return result;
    };

    let next: number[];
    let mode: 'all' | 'with-trigger';
    if (totalWidth <= limitWithoutTrigger) {
      next = widths.map((_, i) => i);
      mode = 'all';
    } else {
      next = pack(limitWithoutTrigger - triggerBlock);
      mode = 'with-trigger';
    }

    if (debug) {
      log('calculate', {
        headerContentWidth,
        siblingsWidth,
        siblingsCount: siblings.length,
        headerGap,
        elAvailable,
        elGap,
        actionsWidth,
        triggerBlock,
        limitWithoutTrigger,
        widths,
        totalWidth,
        mode,
        visible: next,
        elClientWidth: el.clientWidth,
      });
    }

    setVisible(next);
  }

  // Стежимо за вимірювальними елементами (змінюється вміст/ширина фільтра)
  function observeMeasureItems() {
    if (!ro) return;
    observedMeasureItems.forEach(i => ro!.unobserve(i));
    observedMeasureItems = [];
    const root = measurementContainerRef.value;
    if (!root) return;
    observedMeasureItems = Array.from(
      root.querySelectorAll<HTMLElement>('.vt-page__card-filter__measure-element')
    );
    observedMeasureItems.forEach(i => ro!.observe(i));
  }

  const init = () => {
    // Перший розрахунок
    nextTick(() => {
      observeMeasureItems();
      later(calculate, 50);
    });

    window.addEventListener('resize', scheduleCalculate);

    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => scheduleCalculate());

      const el = containerRef.value;
      if (el) {
        ro.observe(el);
        const header = el.closest('.vt-page__card-header') ?? el.parentElement;
        if (header) ro.observe(header);
      }
      if (actionsRef.value) ro.observe(actionsRef.value);
      observeMeasureItems();
    }

    // Шрифти змінюють ширини
    (document as any).fonts?.ready?.then(() => scheduleCalculate());
  };

  const cleanup = () => {
    destroyed = true;
    window.removeEventListener('resize', scheduleCalculate);
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    timers.forEach(id => clearTimeout(id));
    timers.clear();
    if (ro) {
      ro.disconnect();
      ro = null;
    }
    observedMeasureItems = [];
  };

  // Зміна кількості слотів
  watch(slotNodesLength, () => {
    nextTick(() => {
      observeMeasureItems();
      later(calculate, 100);
    });
  });

  // Тригер дропдауну з'являється/зникає (v-if), кнопки дій змінюються
  watch(
    [actionsRef, dropdownTriggerRef],
    () => {
      nextTick(scheduleCalculate);
    },
    { flush: 'post' }
  );

  onMounted(init);
  onBeforeUnmount(cleanup);

  const forceRecalculate = () => later(calculate, 100);

  return {
    visibleIndexes,
    calculate,
    scheduleCalculate,
    forceRecalculate,
  };
}