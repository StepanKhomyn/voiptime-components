<template>
  <div ref="rootRef" :class="`is-${currentLayout}`" class="vt-donut-summary">
    <div class="vt-donut-summary__chart">
      <VChartDonut :segments="chartSegments" :size="size" show-counts />
    </div>

    <div class="vt-donut-summary__legend">
      <div class="vt-donut-summary__total">
        <span class="vt-donut-summary__title">{{ title }}</span>
        <span class="vt-donut-summary__total-value">
          <slot name="total">{{ total || 0 }}</slot>
        </span>
      </div>

      <div class="vt-donut-summary__list">
        <div
          v-for="(block, b) in blocks"
          :key="block.group ?? `item-${b}`"
          :class="{ 'vt-donut-summary__group': block.group, 'is-flat': block.flat }"
          class="vt-donut-summary__block"
        >
          <div
            v-for="(item, i) in block.items"
            :key="`${item.label}-${i}`"
            :class="{ 'is-heading': !item.color && !item.icon && !item.level }"
            class="vt-donut-summary__item"
          >
            <span class="vt-donut-summary__label">
              <template v-if="item.level">
                <span v-for="n in item.level - 1" :key="n" class="vt-donut-summary__indent" />
                <VIcon class="vt-donut-summary__branch" name="arrows_new_line" />
              </template>
              <VIcon v-if="item.icon" :color="item.color" :name="item.icon" class="vt-donut-summary__icon" />
              <span
                v-else-if="item.color"
                :style="{ background: item.color }"
                class="vt-donut-summary__dot"
              />
              <span class="vt-donut-summary__text">{{ item.label }}</span>
            </span>
            <span class="vt-donut-summary__value">{{ item.value ?? (item.count || 0) }}</span>
            <span v-if="item.percent !== false" class="vt-donut-summary__percent">{{ percentOf(item) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import VChartDonut from '@/components/charts/internal/VChartDonut.vue';
  import type { ChartSegment } from '@/components/charts/types';
  import type { VDonutSummaryItem, VDonutSummaryLayout, VDonutSummaryProps } from './types';

  /**
   * Кільцева діаграма з легендою для віджета дашборду.
   * Сама обирає розкладку і діаметр під місце, яке має (зазвичай — тіло VWidgetCard у клітинці VWidgetGrid):
   * - row: діаграма зліва, легенда справа; діаметр — за висотою, minSize…maxSize;
   * - column: ширини не вистачає на обидві — легенда під діаграмою; діаметр — за шириною;
   * - compact: низький широкий віджет — маленька діаграма, групи легенди в один рядок.
   */
  const props = withDefaults(defineProps<VDonutSummaryProps>(), {
    segments: undefined,
    minSize: 150,
    maxSize: 250,
    layout: undefined,
  });

  /** Діаграма (min 250) + легенда (min 275) + проміжок 20 */
  const ROW_MIN_WIDTH = 545;
  /** Широкий віджет переходить у compact, лише коли легенда стовпчиком не вміщається за висотою */
  const COMPACT_MIN_WIDTH = 700;
  /** Оцінка висоти легенди стовпчиком: рядок підсумку + рядки пунктів */
  const TOTAL_ROW_HEIGHT = 42;
  const ITEM_ROW_HEIGHT = 27;

  const rootRef = ref<HTMLElement | null>(null);
  const width = ref(0);
  const availableHeight = ref(0);
  let observer: ResizeObserver | null = null;

  const autoLayout = computed<VDonutSummaryLayout>(() => {
    if (!width.value) return 'row';
    if (width.value < ROW_MIN_WIDTH) return 'column';
    const legendHeight = TOTAL_ROW_HEIGHT + props.items.length * ITEM_ROW_HEIGHT;
    if (width.value >= COMPACT_MIN_WIDTH && legendHeight > availableHeight.value) return 'compact';
    return 'row';
  });

  const currentLayout = computed(() => props.layout ?? autoLayout.value);

  const clamp = (v: number) => Math.max(props.minSize, Math.min(v, props.maxSize));

  const size = computed(() => {
    if (!width.value) return clamp(200);
    if (currentLayout.value === 'column') {
      // Під діаграмою має лишитись видно хоча б початок легенди
      const byHeight = availableHeight.value ? Math.max(props.minSize, availableHeight.value - 100) : props.maxSize;
      return Math.floor(Math.min(width.value, props.maxSize, byHeight));
    }
    return Math.floor(clamp(availableHeight.value || props.maxSize));
  });

  const chartSegments = computed<ChartSegment[]>(
    () =>
      props.segments ??
      props.items
        .filter(item => item.color && item.chart !== false)
        .map(item => ({ label: item.label, count: item.count || 0, color: item.color! })),
  );

  /** Рядки, згруповані в блоки: сусідні з однаковою `group` — разом */
  const blocks = computed(() => {
    const list: { group?: string; flat?: boolean; items: VDonutSummaryItem[] }[] = [];
    props.items.forEach(item => {
      const last = list[list.length - 1];
      if (item.group && last?.group === item.group) last.items.push(item);
      else list.push({ group: item.group, items: [item] });
    });
    // В один рядок (compact) стають лише пласкі групи — дерево з «↳» лишається стовпчиком
    list.forEach(block => (block.flat = block.items.every(item => !item.level)));
    return list;
  });

  const percentOf = (item: VDonutSummaryItem) => {
    const base = item.percentBase ?? props.total;
    return base ? `${Math.round(((item.count || 0) / base) * 100)}%` : '0%';
  };

  function measure() {
    const root = rootRef.value;
    if (!root) return;
    width.value = root.clientWidth;
    const parent = root.parentElement;
    if (!parent) return;
    const style = getComputedStyle(parent);
    availableHeight.value = parent.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  }

  onMounted(() => {
    const root = rootRef.value!;
    observer = new ResizeObserver(measure);
    observer.observe(root);
    if (root.parentElement) observer.observe(root.parentElement);
    measure();
  });

  onBeforeUnmount(() => observer?.disconnect());
</script>
