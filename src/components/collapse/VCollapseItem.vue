<script lang="ts" setup>
  import { computed, inject, onBeforeUnmount } from 'vue';
  import type { CollapseContext, CollapseItemEmits, CollapseItemProps } from './types';

  const props = withDefaults(defineProps<CollapseItemProps>(), {
    disabled: false,
  });

  const emit = defineEmits<CollapseItemEmits>();
  const collapseContext = inject<CollapseContext>('collapseContext');

  if (!collapseContext) {
    throw new Error('VCollapseItem must be used within VCollapse');
  }

  const isActive = computed(() => collapseContext.activeNames.includes(props.name));

  const handleHeaderClick = () => {
    if (props.disabled) return;
    collapseContext.toggle(props.name);
    emit('toggle', props.name);
  };

  // ── Обчислення доступної висоти ──────────────────────────────────────────
  function getAvailableHeight(wrapEl: HTMLElement): number | null {
    const collapseEl = wrapEl.closest('.vt-collapse') as HTMLElement | null;
    if (!collapseEl) return null;

    const parentHeight = collapseEl.clientHeight;
    if (!parentHeight) return null;

    const headers = collapseEl.querySelectorAll('.vt-collapse-item__header');
    const headersHeight = Array.from(headers).reduce((sum, h) => sum + (h as HTMLElement).offsetHeight, 0);

    // Враховуємо інші відкриті wrap-и (не поточний)
    const wraps = collapseEl.querySelectorAll('.vt-collapse-item__wrap');
    const otherWrapsHeight = Array.from(wraps).reduce((sum, w) => {
      if (w === wrapEl) return sum;
      return sum + (w as HTMLElement).offsetHeight;
    }, 0);

    return parentHeight - headersHeight - otherWrapsHeight;
  }

  // ── ResizeObserver для динамічного оновлення висоти ──────────────────────
  let resizeObserver: ResizeObserver | null = null;
  let currentWrap: HTMLElement | null = null;

  function applyMaxHeight(wrapEl: HTMLElement) {
    const available = getAvailableHeight(wrapEl);
    const contentHeight = wrapEl.scrollHeight;

    if (available !== null && available > 0 && contentHeight > available) {
      wrapEl.style.maxHeight = available + 'px';
      wrapEl.style.overflowY = 'auto';
    } else {
      wrapEl.style.maxHeight = 'none';
      wrapEl.style.overflowY = 'visible';
    }
  }

  function startObserving(wrapEl: HTMLElement) {
    currentWrap = wrapEl;
    resizeObserver = new ResizeObserver(() => {
      if (currentWrap) applyMaxHeight(currentWrap);
    });

    // Спостерігаємо за батьківським collapse
    const collapseEl = wrapEl.closest('.vt-collapse') as HTMLElement | null;
    if (collapseEl) resizeObserver.observe(collapseEl);
    resizeObserver.observe(wrapEl);
  }

  function stopObserving() {
    resizeObserver?.disconnect();
    resizeObserver = null;
    currentWrap = null;
  }

  onBeforeUnmount(() => stopObserving());

  // ── Анімація ─────────────────────────────────────────────────────────────
  const onEnter = (el: Element) => {
    const element = el as HTMLElement;
    element.style.height = '0';
    element.style.maxHeight = 'none';
    element.style.overflow = 'hidden';
    void element.offsetHeight;

    const contentHeight = element.scrollHeight;
    const available = getAvailableHeight(element);

    if (available !== null && available > 0 && contentHeight > available) {
      element.style.height = available + 'px';
    } else {
      element.style.height = contentHeight + 'px';
    }
  };

  const onAfterEnter = (el: Element) => {
    const element = el as HTMLElement;
    element.style.height = 'auto';
    element.style.overflow = 'visible';
    // Після анімації — вмикаємо динамічне обмеження
    applyMaxHeight(element);
    startObserving(element);
  };

  const onLeave = (el: Element) => {
    stopObserving();
    const element = el as HTMLElement;
    element.style.maxHeight = 'none';
    element.style.height = element.offsetHeight + 'px';
    element.style.overflow = 'hidden';
    void element.offsetHeight;
    element.style.height = '0';
  };

  const onAfterLeave = (el: Element) => {
    const element = el as HTMLElement;
    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.style.maxHeight = 'none';
  };
</script>
