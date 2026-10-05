import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

// Стандартна перевірка: текст елемента не вміщається по ширині
export const isElementOverflowing = (el: HTMLElement): boolean => el.scrollWidth - el.clientWidth > 1;

// Перевірка для кількох частин тексту (напр. плейсхолдер діапазону): обрізана хоча б одна
export const isAnyChildOverflowing = (el: HTMLElement): boolean =>
  isElementOverflowing(el) || Array.from(el.children).some(child => isElementOverflowing(child as HTMLElement));

let measureContext: CanvasRenderingContext2D | null = null;

// Плейсхолдер нативного input не має власного елемента, тому міряємо його ширину через canvas
export const isInputPlaceholderOverflowing = (el: HTMLElement): boolean => {
  const input = el as HTMLInputElement;
  if (!input.placeholder) return false;

  measureContext ??= document.createElement('canvas').getContext('2d');
  if (!measureContext) return false;

  const style = getComputedStyle(input);
  measureContext.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

  const availableWidth = input.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  return measureContext.measureText(input.placeholder).width - availableWidth > 1;
};

export function useTruncatedLabel(
  labelRef: Ref<HTMLElement | undefined>,
  getText: () => string | undefined,
  isOverflowing: (el: HTMLElement) => boolean = isElementOverflowing
) {
  const isTruncated = ref(false);
  let observer: ResizeObserver | null = null;
  let rafId = 0;

  const measure = () => {
    const el = labelRef.value;
    isTruncated.value = !!el && isOverflowing(el);
  };

  const check = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(measure);
  };

  const tooltipText = () => (isTruncated.value ? (getText() ?? '') : '');

  watch(
    labelRef,
    (el, _old, onCleanup) => {
      observer?.disconnect();
      if (!el) {
        isTruncated.value = false;
        return;
      }

      observer = new ResizeObserver(check);
      observer.observe(el);
      if (el.parentElement) observer.observe(el.parentElement);
      measure();

      onCleanup(() => observer?.disconnect());
    },
    { flush: 'post' }
  );

  watch(getText, check, { flush: 'post' });

  onBeforeUnmount(() => {
    observer?.disconnect();
    cancelAnimationFrame(rafId);
  });

  return { isTruncated, tooltipText, recheck: measure };
}