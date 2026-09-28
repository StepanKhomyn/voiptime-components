import { onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue';

const MEASURE_SELECTOR = '.vt-page__card-filter__measure-element';
const INLINE_SELECTOR = '.vt-page__card-filter__inline';
const DROPDOWN_SELECTOR = '.vt-page__card-filter__dropdown';

const MIN_FILTER_WIDTH = 150;
// Запасна ширина кнопки «Більше», поки її ще жодного разу не було в DOM
const FALLBACK_TRIGGER_WIDTH = 140;
// Запас на субпіксельні округлення
const SAFETY = 2;

const px = (value: string | null | undefined): number => {
  const n = parseFloat(value ?? '');
  return Number.isFinite(n) ? n : 0; // "normal" / "" / NaN -> 0
};

const outerWidth = (node: HTMLElement): number => {
  const s = getComputedStyle(node);
  return node.getBoundingClientRect().width + px(s.marginLeft) + px(s.marginRight);
};

const sameArray = (a: number[], b: number[]): boolean => a.length === b.length && a.every((v, i) => v === b[i]);

export function useResponsiveFilters(
  containerRef: Ref<HTMLElement | null>,
  actionsRef: Ref<HTMLElement | null>,
  dropdownTriggerRef: Ref<HTMLElement | null>,
  measurementContainerRef: Ref<HTMLElement | null>,
  slotNodesLength: Ref<number>
) {
  const visibleIndexes = ref<number[]>([]);
  // true після першого успішного розрахунку (можна використати, щоб не показувати фільтр до цього)
  const isReady = ref(false);

  let triggerWidth = FALLBACK_TRIGGER_WIDTH;
  let rafId = 0;
  let ro: ResizeObserver | null = null;
  let disposed = false;
  const observed = new Set<Element>();

  function calculate() {
    const el = containerRef.value;
    const measureRoot = measurementContainerRef.value;
    if (disposed || !el || !measureRoot) return;

    // display:none (прихована вкладка, keep-alive) — зберігаємо попередній стан,
    // ResizeObserver спрацює, коли елемент знову з'явиться
    if (el.getClientRects().length === 0) return;

    const elStyle = getComputedStyle(el);
    const contentWidth =
      el.getBoundingClientRect().width -
      px(elStyle.paddingLeft) -
      px(elStyle.paddingRight) -
      px(elStyle.borderLeftWidth) -
      px(elStyle.borderRightWidth);

    const outerGap = px(elStyle.columnGap); // gap між __inline / __dropdown / __actions
    const inline = el.querySelector<HTMLElement>(`:scope > ${INLINE_SELECTOR}`);
    const innerGap = inline ? px(getComputedStyle(inline).columnGap) : outerGap; // gap між фільтрами

    // Запам'ятовуємо реальну ширину кнопки «Більше», коли вона є в DOM
    const trigger = dropdownTriggerRef.value;
    if (trigger) {
      const host = trigger.closest<HTMLElement>(DROPDOWN_SELECTOR) ?? trigger;
      const w = outerWidth(host);
      if (w > 0) triggerWidth = w;
    }

    // Кнопки дій завжди в DOM: gap перед ними є навіть коли вони порожні
    const actions = actionsRef.value;
    const actionsReserve = actions ? outerWidth(actions) + outerGap : 0;
    const triggerReserve = triggerWidth + outerGap;

    const widths = Array.from(measureRoot.querySelectorAll<HTMLElement>(MEASURE_SELECTOR)).map(node =>
      Math.max(node.getBoundingClientRect().width, MIN_FILTER_WIDTH)
    );

    const fit = (available: number): number[] => {
      const result: number[] = [];
      let used = 0;
      for (let i = 0; i < widths.length; i++) {
        const w = widths[i] + (i > 0 ? innerGap : 0);
        if (used + w > available) break;
        result.push(i);
        used += w;
      }
      return result;
    };

    const available = contentWidth - actionsReserve - SAFETY;

    // Прохід 1: чи вміщаються ВСІ без кнопки «Більше»
    let next = fit(available);
    // Прохід 2: не вміщаються — резервуємо місце під кнопку
    if (next.length < widths.length) {
      next = fit(available - triggerReserve);
    }

    if (!sameArray(visibleIndexes.value, next)) {
      visibleIndexes.value = next;
    }
    isReady.value = true;
  }

  // Синхронізуємо список елементів, за якими стежить ResizeObserver
  function syncObserved() {
    const observer = ro;
    if (!observer) return;

    const targets = new Set<Element>();
    const add = (node: Element | null | undefined) => {
      if (node) targets.add(node);
    };

    add(containerRef.value);
    add(measurementContainerRef.value);
    add(actionsRef.value);
    const trigger = dropdownTriggerRef.value;
    add(trigger ? (trigger.closest(DROPDOWN_SELECTOR) ?? trigger) : null);
    measurementContainerRef.value?.querySelectorAll(MEASURE_SELECTOR).forEach(node => add(node));

    observed.forEach(node => {
      if (!targets.has(node)) {
        observer.unobserve(node);
        observed.delete(node);
      }
    });
    targets.forEach(node => {
      if (!observed.has(node)) {
        observer.observe(node);
        observed.add(node);
      }
    });
  }

  // rAF-коалесинг: не більше одного розрахунку за кадр
  function scheduleCalculate() {
    if (disposed || rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      if (disposed) return;
      syncObserved();
      calculate();
    });
  }

  onMounted(() => {
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => scheduleCalculate());
    }
    syncObserved();
    calculate(); // синхронно, до першого paint — без мигання

    // Ширини фільтрів залежать від шрифтів
    document.fonts?.ready.then(() => scheduleCalculate());
  });

  onBeforeUnmount(() => {
    disposed = true;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    ro?.disconnect();
    ro = null;
    observed.clear();
  });

  // DOM вже оновлений (flush: 'post'), тому рахуємо одразу, а не на наступному кадрі
  watch(
    slotNodesLength,
    () => {
      syncObserved();
      calculate();
      scheduleCalculate();
    },
    { flush: 'post' }
  );

  // З'явилась/зникла кнопка «Більше» або дії — беремо її реальну ширину
  watch(
    [actionsRef, dropdownTriggerRef],
    () => {
      syncObserved();
      calculate();
    },
    { flush: 'post' }
  );

  return {
    visibleIndexes,
    isReady,
    calculate,
    scheduleCalculate,
    forceRecalculate: scheduleCalculate,
  };
}
