<template>
  <div
    ref="rootRef"
    :aria-describedby="canEdit ? hintId : undefined"
    :class="{
      'is-ready': isReady,
      'is-editing': canEdit,
      'is-interacting': !!interaction,
      'is-stacked': stacked,
      'has-long-press': longPress && !canEdit && !stacked,
    }"
    :style="rootStyle"
    class="vt-widget-grid"
    role="list"
    @pointerdown.self="selectItem(null)"
  >
    <!-- Клітинки сітки (лише в режимі редагування) -->
    <div v-if="canEdit && showGrid" v-memo="[cells, cellStyle]" aria-hidden="true" class="vt-widget-grid__cells">
      <span
        v-for="cell in cells"
        :key="cell.key"
        :style="{ ...cellStyle, left: `${cell.left}px`, top: `${cell.top}px`, '--vt-wg-d': `${cell.delay}ms` }"
        class="vt-widget-grid__cell"
      />
    </div>

    <!-- Тінь-місце, куди "сяде" віджет -->
    <div
      v-if="interaction?.type === 'drag' && placeholderRect"
      :style="rectStyle(placeholderRect)"
      aria-hidden="true"
      class="vt-widget-grid__placeholder"
    >
      <span class="vt-widget-grid__size">{{ placeholderItem!.w }} × {{ placeholderItem!.h }}</span>
    </div>

    <!-- Рамка, що йде за курсором під час зміни розміру (стиль ставиться напряму в DOM) -->
    <div v-if="interaction?.type === 'resize'" ref="frameRef" aria-hidden="true" class="vt-widget-grid__frame">
      <span class="vt-widget-grid__size">{{ placeholderItem?.w }} × {{ placeholderItem?.h }}</span>
    </div>

    <div
      v-for="(item, index) in layout"
      :key="item.id"
      :aria-label="t(LOCALE_KEYS.WIDGET_GRID_ITEM, { id: item.id, x: item.x + 1, y: item.y + 1, w: item.w, h: item.h })"
      :class="{
        'is-active': canEdit && activeId === item.id,
        'is-dragging': interaction?.id === item.id && interaction.type === 'drag',
        'is-resizing': interaction?.id === item.id && interaction.type === 'resize',
        'is-dropping': droppingId === item.id,
        'is-static': item.static,
        'is-locked': !isDraggable(item),
        'is-popping': poppingId === item.id,
      }"
      :data-id="item.id"
      :style="itemStyle(item, index)"
      :tabindex="canEdit ? 0 : undefined"
      class="vt-widget-grid__item"
      role="listitem"
      @focus="canEdit && selectItem(item.id)"
      @keydown="onItemKeydown($event, item)"
      @pointerdown="onItemPointerDown($event, item)"
      @contextmenu="onContextMenu"
    >
      <div class="vt-widget-grid__content">
        <slot :name="`item-${item.id}`" v-bind="slotProps(item)">
          <slot name="item" v-bind="slotProps(item)" />
        </slot>
      </div>

      <!-- Щит: у режимі редагування блокує кліки по вмісту (таблиці, кнопки) -->
      <div v-if="canEdit" class="vt-widget-grid__shield" />

      <template v-if="canEdit && isResizable(item)">
        <span
          v-for="handle in resizeHandles"
          :key="handle"
          :class="`vt-widget-grid__handle--${handle}`"
          :title="t(LOCALE_KEYS.WIDGET_GRID_RESIZE)"
          aria-hidden="true"
          class="vt-widget-grid__handle"
          @pointerdown.stop="onResizePointerDown($event, item, handle)"
        />
      </template>
    </div>

    <span :id="hintId" class="vt-widget-grid__sr-only">{{ t(LOCALE_KEYS.WIDGET_GRID_HINT) }}</span>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef, watch, type CSSProperties } from 'vue';
  import { useI18n } from '@/locales/useI18n';
  import { LOCALE_KEYS } from '@/locales/types';
  import { clamp, clampItem, cloneLayout, layoutBottom, normalizeLayout, placeItem, sameLayout } from './layout';
  import type {
    VWidgetGridEmits,
    VWidgetGridId,
    VWidgetGridItem,
    VWidgetGridLayout,
    VWidgetGridProps,
    VWidgetGridResizeHandle,
    VWidgetGridSlotProps,
  } from './types';

  const props = withDefaults(defineProps<VWidgetGridProps>(), {
    editing: false,
    columns: 12,
    rowHeight: 60,
    gap: 16,
    compact: true,
    longPress: true,
    longPressDelay: 450,
    dragHandle: undefined,
    resizeHandles: () => ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'],
    showGrid: true,
    stackBelow: 0,
  });

  const emit = defineEmits<VWidgetGridEmits>();

  defineSlots<{
    item?: (props: VWidgetGridSlotProps) => any;
    [name: string]: ((props: VWidgetGridSlotProps) => any) | undefined;
  }>();

  const { t } = useI18n();

  interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
  }

  interface Gesture {
    id: VWidgetGridId;
    pointerId: number;
    startX: number;
    startY: number;
    mode: 'press' | 'pending-drag' | 'pending-resize';
    handle?: VWidgetGridResizeHandle;
  }

  interface Interaction {
    type: 'drag' | 'resize';
    id: VWidgetGridId;
    handle?: VWidgetGridResizeHandle;
    startLayout: VWidgetGridLayout;
    startItem: VWidgetGridItem;
    startRect: Rect;
    /** Зсув точки захоплення відносно лівого верхнього кута віджета */
    grabX: number;
    grabY: number;
    /** Позиція курсора на старті (у координатах сітки) */
    originX: number;
    originY: number;
  }

  const RESIZE_CURSORS: Record<VWidgetGridResizeHandle, string> = {
    n: 'ns-resize',
    s: 'ns-resize',
    e: 'ew-resize',
    w: 'ew-resize',
    ne: 'nesw-resize',
    sw: 'nesw-resize',
    nw: 'nwse-resize',
    se: 'nwse-resize',
  };
  const DRAG_THRESHOLD = 4;
  const PRESS_TOLERANCE = 8;
  const AUTOSCROLL_EDGE = 60;
  const AUTOSCROLL_SPEED = 18;
  const hintId = `vt-widget-grid-hint-${Math.random().toString(36).slice(2, 9)}`;

  const rootRef = ref<HTMLElement | null>(null);
  const width = ref(0);
  const isReady = ref(false);
  const layout = ref<VWidgetGridLayout>(normalizeLayout(props.modelValue, props.columns, props.compact));
  const activeId = ref<VWidgetGridId | null>(null);
  // shallowRef: об'єкт жесту не змінюється, лише замінюється цілком
  const interaction = shallowRef<Interaction | null>(null);
  const frameRef = ref<HTMLElement | null>(null);
  const droppingId = ref<VWidgetGridId | null>(null);
  const poppingId = ref<VWidgetGridId | null>(null);

  let gesture: Gesture | null = null;
  let pressTimer: ReturnType<typeof setTimeout> | undefined;
  let dropTimer: ReturnType<typeof setTimeout> | undefined;
  let popTimer: ReturnType<typeof setTimeout> | undefined;
  let rafId = 0;
  let lastPointer: { x: number; y: number } | null = null;
  let pointerDirty = false;
  /**
   * Позиція під курсором оновлюється щокадру, тому вона НЕ реактивна:
   * пишемо її прямо в DOM (applyLive), без перерендеру Vue.
   * Реактивна лише розкладка — вона змінюється тільки при "перескоку" на іншу клітинку.
   */
  let live = { rect: { left: 0, top: 0, width: 0, height: 0 } as Rect, tilt: 0 };
  let liveEl: HTMLElement | null = null;
  let scrollParent: HTMLElement | Window | null = null;
  let resizeObserver: ResizeObserver | null = null;

  // ---------------- Геометрія ----------------

  const stacked = computed(() => props.stackBelow > 0 && width.value > 0 && width.value < props.stackBelow);
  const canEdit = computed(() => props.editing && !stacked.value);
  const colWidth = computed(() => Math.max(0, (width.value - props.gap * (props.columns - 1)) / props.columns));
  const cellX = computed(() => colWidth.value + props.gap);
  const cellY = computed(() => props.rowHeight + props.gap);

  const toRect = (item: Pick<VWidgetGridItem, 'x' | 'y' | 'w' | 'h'>): Rect => ({
    left: item.x * cellX.value,
    top: item.y * cellY.value,
    width: item.w * colWidth.value + (item.w - 1) * props.gap,
    height: item.h * props.rowHeight + (item.h - 1) * props.gap,
  });

  /** Позиції в режимі "стопки" (вузький екран): одна колонка у порядку y, x */
  const stackedRects = computed(() => {
    const map = new Map<VWidgetGridId, Rect>();
    let top = 0;
    [...layout.value]
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .forEach(item => {
        const height = item.h * props.rowHeight + (item.h - 1) * props.gap;
        map.set(item.id, { left: 0, top, width: width.value, height });
        top += height + props.gap;
      });
    return map;
  });

  const rectOf = (item: VWidgetGridItem): Rect =>
    stacked.value ? stackedRects.value.get(item.id)! : toRect(item);

  const rootHeight = computed(() => {
    if (stacked.value) {
      const rects = [...stackedRects.value.values()];
      return rects.length ? Math.max(...rects.map(r => r.top + r.height)) : 0;
    }
    const rows = layoutBottom(layout.value) + (canEdit.value ? 1 : 0);
    return rows > 0 ? rows * cellY.value - props.gap : 0;
  });

  const rootStyle = computed<CSSProperties>(() => ({ height: `${rootHeight.value}px` }));

  const cells = computed(() => {
    const rows = Math.max(1, Math.ceil((rootHeight.value + props.gap) / cellY.value));
    const list: { key: string; left: number; top: number; delay: number }[] = [];
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < props.columns; x++)
        list.push({ key: `${x}-${y}`, left: x * cellX.value, top: y * cellY.value, delay: Math.min((x + y) * 12, 400) });
    return list;
  });

  const cellStyle = computed(() => ({ width: `${colWidth.value}px`, height: `${props.rowHeight}px` }));

  const placeholderItem = computed(() =>
    interaction.value ? layout.value.find(i => i.id === interaction.value!.id) ?? null : null,
  );
  const placeholderRect = computed(() => (placeholderItem.value ? toRect(placeholderItem.value) : null));

  const rectStyle = (r: Rect): CSSProperties => ({
    transform: `translate3d(${r.left}px, ${r.top}px, 0)`,
    width: `${r.width}px`,
    height: `${r.height}px`,
  });

  function itemStyle(item: VWidgetGridItem, index: number): CSSProperties {
    const it = interaction.value;
    if (it?.id === item.id && it.type === 'drag') {
      // transform ставить applyLive() напряму в DOM
      const r = it.startRect;
      return { width: `${r.width}px`, height: `${r.height}px`, '--vt-wg-i': index } as CSSProperties;
    }
    return { ...rectStyle(rectOf(item)), '--vt-wg-i': index } as CSSProperties;
  }

  const slotProps = (item: VWidgetGridItem): VWidgetGridSlotProps => ({
    item,
    editing: canEdit.value,
    active: canEdit.value && activeId.value === item.id,
  });

  const isDraggable = (item: VWidgetGridItem) => !item.static && item.draggable !== false;
  const isResizable = (item: VWidgetGridItem) => !item.static && item.resizable !== false;

  // ---------------- Синхронізація з v-model ----------------

  watch(
    () => [props.modelValue, props.columns, props.compact] as const,
    () => {
      if (interaction.value) return;
      layout.value = normalizeLayout(props.modelValue, props.columns, props.compact);
    },
    { deep: true },
  );

  function commit(previous: VWidgetGridLayout) {
    if (sameLayout(previous, layout.value)) return;
    const result = cloneLayout(layout.value);
    emit('update:modelValue', result);
    emit('change', result);
  }

  watch(canEdit, value => {
    if (!value) {
      cancelInteraction();
      selectItem(null);
    }
  });

  function selectItem(id: VWidgetGridId | null) {
    if (activeId.value === id) return;
    activeId.value = id;
    emit('select', id);
  }

  // ---------------- Pointer ----------------

  function pointerInGrid(e: { clientX: number; clientY: number }) {
    const box = rootRef.value!.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  }

  function onItemPointerDown(e: PointerEvent, item: VWidgetGridItem) {
    if (stacked.value || e.button !== 0 || gesture) return;

    if (canEdit.value) {
      selectItem(item.id);
      if (!isDraggable(item)) return;
      if (props.dragHandle && !(e.target as HTMLElement).closest(props.dragHandle)) return;
      e.preventDefault(); // без виділення тексту
      startGesture(e, item, 'pending-drag');
      return;
    }

    if (props.longPress && isDraggable(item)) {
      startGesture(e, item, 'press');
      pressTimer = setTimeout(() => onLongPress(item), props.longPressDelay);
    }
  }

  function onResizePointerDown(e: PointerEvent, item: VWidgetGridItem, handle: VWidgetGridResizeHandle) {
    if (e.button !== 0 || gesture) return;
    e.preventDefault();
    selectItem(item.id);
    startGesture(e, item, 'pending-resize', handle);
  }

  function startGesture(e: PointerEvent, item: VWidgetGridItem, mode: Gesture['mode'], handle?: VWidgetGridResizeHandle) {
    gesture = { id: item.id, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, mode, handle };
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
  }

  function onLongPress(item: VWidgetGridItem) {
    if (!gesture || gesture.mode !== 'press') return;
    gesture.mode = 'pending-drag';
    if (!props.editing) emit('update:editing', true);
    selectItem(item.id);
    pop(item.id);
    try {
      navigator.vibrate?.(15);
    } catch {
      /* ignore */
    }
  }

  function pop(id: VWidgetGridId) {
    clearTimeout(popTimer);
    poppingId.value = id;
    popTimer = setTimeout(() => (poppingId.value = null), 400);
  }

  function onPointerMove(e: PointerEvent) {
    if (!gesture || e.pointerId !== gesture.pointerId) return;
    const dist = Math.hypot(e.clientX - gesture.startX, e.clientY - gesture.startY);

    if (gesture.mode === 'press') {
      if (dist > PRESS_TOLERANCE) endGesture();
      return;
    }

    if (!interaction.value) {
      if (dist < DRAG_THRESHOLD) return;
      if (!canEdit.value) return endGesture(); // батько не ввімкнув editing
      beginInteraction(gesture.mode === 'pending-resize' ? 'resize' : 'drag', gesture);
    }

    e.preventDefault();
    // Обробка — один раз на кадр у tick(), а не на кожну подію миші
    lastPointer = { x: e.clientX, y: e.clientY };
    pointerDirty = true;
  }

  function onPointerUp(e: PointerEvent) {
    if (gesture && e.pointerId !== gesture.pointerId) return;
    finishInteraction();
    endGesture();
  }

  function onPointerCancel(e: PointerEvent) {
    if (gesture && e.pointerId !== gesture.pointerId) return;
    cancelInteraction();
    endGesture();
  }

  function endGesture() {
    clearTimeout(pressTimer);
    gesture = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerCancel);
  }

  function onContextMenu(e: Event) {
    // Довге натискання на тачскрині не повинно відкривати контекстне меню
    if (gesture || canEdit.value) e.preventDefault();
  }

  // ---------------- Drag / Resize ----------------

  function beginInteraction(type: Interaction['type'], g: Gesture) {
    const item = layout.value.find(i => i.id === g.id);
    if (!item) return;
    const rect = toRect(item);
    const p = pointerInGrid({ clientX: g.startX, clientY: g.startY });

    interaction.value = {
      type,
      id: item.id,
      handle: g.handle,
      startLayout: cloneLayout(layout.value),
      startItem: { ...item },
      startRect: rect,
      grabX: p.x - rect.left,
      grabY: p.y - rect.top,
      originX: p.x,
      originY: p.y,
    };
    live = { rect: { ...rect }, tilt: 0 };
    liveEl = rootRef.value!.querySelector<HTMLElement>(`:scope > [data-id="${CSS.escape(String(item.id))}"]`);
    droppingId.value = null;
    scrollParent = findScrollParent(rootRef.value);
    const html = document.documentElement;
    html.style.setProperty('--vt-wg-cursor', type === 'drag' ? 'grabbing' : RESIZE_CURSORS[g.handle!]);
    html.classList.add('vt-widget-grid-busy');
    if (type === 'drag') emit('drag-start', { ...item });
    else emit('resize-start', { ...item });
    rafId = requestAnimationFrame(tick);
  }

  function updateInteraction() {
    const it = interaction.value;
    if (!it || !lastPointer) return;
    const p = pointerInGrid({ clientX: lastPointer.x, clientY: lastPointer.y });
    if (it.type === 'drag') updateDrag(it, p);
    else updateResize(it, p);
  }

  function updateDrag(it: Interaction, p: { x: number; y: number }) {
    const maxLeft = width.value - live.rect.width;
    const left = clamp(p.x - it.grabX, 0, Math.max(0, maxLeft));
    const top = Math.max(0, p.y - it.grabY);

    // Нахил "в бік руху" — як картка, яку тримаєш пальцем
    const dx = left - live.rect.left;
    live.tilt = clamp(live.tilt * 0.6 + dx * 0.25, -4, 4);
    live.rect = { ...live.rect, left, top };

    const target = { x: Math.round(left / cellX.value), y: Math.round(top / cellY.value), w: it.startItem.w, h: it.startItem.h };
    applyTarget(it, target, true);
  }

  function updateResize(it: Interaction, p: { x: number; y: number }) {
    const h = it.handle!;
    const s = it.startRect;
    const dx = p.x - it.originX;
    const dy = p.y - it.originY;
    const item = it.startItem;

    // n клітинок у px (без зовнішнього gap)
    const span = (n: number, cell: number) => n * cell - props.gap;
    const minW = span(Math.min(item.minW ?? 1, props.columns), cellX.value);
    const maxW = span(Math.min(item.maxW ?? props.columns, props.columns), cellX.value);
    const minH = span(item.minH ?? 1, cellY.value);
    const maxH = item.maxH ? span(item.maxH, cellY.value) : Infinity;

    let { left, top, width: w, height: hh } = s;
    const right = s.left + s.width;
    const bottom = s.top + s.height;

    if (h.includes('e')) w = clamp(s.width + dx, minW, Math.min(maxW, width.value - s.left));
    if (h.includes('w')) {
      w = clamp(s.width - dx, minW, Math.min(maxW, right));
      left = right - w;
    }
    if (h.includes('s')) hh = clamp(s.height + dy, minH, maxH);
    if (h.includes('n')) {
      hh = clamp(s.height - dy, minH, Math.min(maxH, bottom));
      top = bottom - hh;
    }

    live.rect = { left, top, width: w, height: hh };

    const gw = Math.max(1, Math.round((w + props.gap) / cellX.value));
    const gh = Math.max(1, Math.round((hh + props.gap) / cellY.value));
    const target = {
      w: gw,
      h: gh,
      x: h.includes('w') ? item.x + item.w - gw : item.x,
      y: h.includes('n') ? Math.max(0, item.y + item.h - gh) : item.y,
    };
    applyTarget(it, target, false);
  }

  let lastTargetKey = '';
  function applyTarget(it: Interaction, target: Pick<VWidgetGridItem, 'x' | 'y' | 'w' | 'h'>, allowSwap: boolean) {
    const fixed = clampItem({ ...it.startItem, ...target }, props.columns);
    const key = `${fixed.x}:${fixed.y}:${fixed.w}:${fixed.h}`;
    if (key === lastTargetKey) return;
    lastTargetKey = key;
    layout.value = placeItem(it.startLayout, it.id, fixed, {
      columns: props.columns,
      compact: props.compact,
      allowSwap,
    });
  }

  /** Пише "живу" позицію прямо в DOM — без перерендеру компонента */
  function applyLive() {
    const it = interaction.value;
    if (!it) return;
    const r = live.rect;
    if (it.type === 'drag') {
      if (liveEl)
        liveEl.style.transform = `translate3d(${r.left}px, ${r.top}px, 0) rotate(${live.tilt.toFixed(2)}deg) scale(1.03)`;
    } else if (frameRef.value) {
      const st = frameRef.value.style;
      st.transform = `translate3d(${r.left}px, ${r.top}px, 0)`;
      st.width = `${r.width}px`;
      st.height = `${r.height}px`;
    }
  }

  // Після кожного патчу Vue (напр. перескок на іншу клітинку) відновлюємо живу позицію
  onUpdated(applyLive);

  /** rAF-цикл: обробка курсора, автоскрол біля країв, згасання нахилу */
  function tick() {
    const it = interaction.value;
    if (!it) return;

    if (pointerDirty) {
      pointerDirty = false;
      updateInteraction();
    }

    if (lastPointer && scrollParent) {
      const box =
        scrollParent instanceof Window
          ? { top: 0, bottom: window.innerHeight }
          : scrollParent.getBoundingClientRect();
      let delta = 0;
      if (lastPointer.y < box.top + AUTOSCROLL_EDGE) delta = -AUTOSCROLL_SPEED * (1 - (lastPointer.y - box.top) / AUTOSCROLL_EDGE);
      else if (lastPointer.y > box.bottom - AUTOSCROLL_EDGE)
        delta = AUTOSCROLL_SPEED * (1 - (box.bottom - lastPointer.y) / AUTOSCROLL_EDGE);
      if (delta) {
        scrollParent.scrollBy(0, clamp(delta, -AUTOSCROLL_SPEED, AUTOSCROLL_SPEED));
        updateInteraction();
      }
    }

    if (it.type === 'drag' && Math.abs(live.tilt) > 0.01) live.tilt *= 0.85;

    applyLive();
    rafId = requestAnimationFrame(tick);
  }

  function finishInteraction() {
    const it = interaction.value;
    if (!it) return;
    if (pointerDirty) updateInteraction();
    stopInteraction();
    settle(it.id);
    const item = layout.value.find(i => i.id === it.id);
    commit(it.startLayout);
    if (!item) return;
    if (it.type === 'drag') emit('drag-end', { ...item });
    else emit('resize-end', { ...item });
  }

  function cancelInteraction() {
    const it = interaction.value;
    if (!it) return;
    stopInteraction();
    layout.value = it.startLayout;
    settle(it.id);
  }

  function stopInteraction() {
    cancelAnimationFrame(rafId);
    interaction.value = null;
    lastPointer = null;
    pointerDirty = false;
    liveEl = null;
    lastTargetKey = '';
    document.documentElement.classList.remove('vt-widget-grid-busy');
    document.documentElement.style.removeProperty('--vt-wg-cursor');
  }

  /** Віджет "сідає" на місце з пружинною анімацією */
  function settle(id: VWidgetGridId) {
    clearTimeout(dropTimer);
    droppingId.value = id;
    dropTimer = setTimeout(() => (droppingId.value = null), 450);
  }

  // ---------------- Клавіатура ----------------

  function onItemKeydown(e: KeyboardEvent, item: VWidgetGridItem) {
    if (!canEdit.value || interaction.value) return;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const d = delta[e.key];
    if (!d) return;
    e.preventDefault();

    const resize = e.shiftKey;
    if (resize ? !isResizable(item) : !isDraggable(item)) return;

    const target = resize
      ? { x: item.x, y: item.y, w: item.w + d[0], h: item.h + d[1] }
      : { x: item.x + d[0], y: item.y + d[1], w: item.w, h: item.h };

    const previous = cloneLayout(layout.value);
    layout.value = placeItem(previous, item.id, target, {
      columns: props.columns,
      compact: props.compact,
      allowSwap: !resize,
    });
    settle(item.id);
    commit(previous);
  }

  function onWindowKeydown(e: KeyboardEvent) {
    if (e.key !== 'Escape' || !canEdit.value) return;
    if (interaction.value) {
      cancelInteraction();
      endGesture();
    } else if (activeId.value !== null) {
      selectItem(null);
    } else {
      emit('update:editing', false);
    }
  }

  // ---------------- Утиліти ----------------

  function findScrollParent(el: HTMLElement | null): HTMLElement | Window {
    let node = el?.parentElement ?? null;
    while (node && node !== document.body) {
      const { overflowY } = getComputedStyle(node);
      if (/(auto|scroll|overlay)/.test(overflowY) && node.scrollHeight > node.clientHeight) return node;
      node = node.parentElement;
    }
    return window;
  }

  onMounted(() => {
    const el = rootRef.value!;
    width.value = el.clientWidth;
    resizeObserver = new ResizeObserver(entries => {
      width.value = entries[0].contentRect.width;
    });
    resizeObserver.observe(el);
    window.addEventListener('keydown', onWindowKeydown);
    // Вмикаємо анімації лише після першого розміщення, щоб не було "розльоту" при завантаженні
    nextTick(() => requestAnimationFrame(() => (isReady.value = true)));
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    window.removeEventListener('keydown', onWindowKeydown);
    stopInteraction();
    endGesture();
    clearTimeout(dropTimer);
    clearTimeout(popTimer);
  });

  defineExpose({
    /** Поточна (робоча) розкладка */
    layout,
    /** Скасувати поточне перетягування */
    cancel: cancelInteraction,
  });
</script>
