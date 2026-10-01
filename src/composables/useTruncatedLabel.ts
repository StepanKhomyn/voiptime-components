import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

export function useTruncatedLabel(labelRef: Ref<HTMLElement | undefined>, getText: () => string | undefined) {
  const isTruncated = ref(false);
  let observer: ResizeObserver | null = null;
  let rafId = 0;

  const measure = () => {
    const el = labelRef.value;
    isTruncated.value = !!el && el.scrollWidth - el.clientWidth > 1;
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