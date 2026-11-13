<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import type { ComboChartPadding, ComboDataPoint, ComboSeriesConfig } from '../types';
  import { useI18n } from '@/locales/useI18n';
  import { LOCALE_KEYS } from '@/locales/types';
  import VIcon from '@/components/icon/VIcon.vue';

  /**
   * Комбінований графік: згруповані стовпці + лінії, дві осі Y (ліва — значення, права — %).
   *
   * Розмір береться з контейнера (ResizeObserver), тож графік ніколи не виходить за його межі.
   * `height` — загальна висота разом з легендою; без неї графік заповнює висоту батька.
   * `width` лишився для сумісності: ширина завжди дорівнює ширині контейнера.
   */
  const props = defineProps<{
    data: ComboDataPoint[];
    seriesConfig: Record<string, ComboSeriesConfig>;
    categoryKey: string;
    width?: number;
    height?: number;
    padding?: ComboChartPadding;
  }>();

  const { t } = useI18n();

  const FONT_SIZE = 11;
  /** Приблизна ширина символу підпису для розрахунку відступів і проріджування */
  const CHAR_WIDTH = 6.5;
  const MAX_BAR_WIDTH = 28;
  const BAR_RADIUS = 3;
  const Y_TICKS = 5;
  /** Нижче цієї висоти області графіка малювати немає сенсу */
  const MIN_PLOT_HEIGHT = 40;

  /* ================= SIZE ================= */

  const plot = ref<HTMLElement | null>(null);
  const plotWidth = ref(0);
  const plotHeight = ref(0);
  let ro: ResizeObserver | null = null;

  onMounted(() => {
    if (!plot.value) return;
    ro = new ResizeObserver(([entry]) => {
      plotWidth.value = Math.floor(entry.contentRect.width);
      plotHeight.value = Math.floor(entry.contentRect.height);
    });
    ro.observe(plot.value);
  });
  onUnmounted(() => ro?.disconnect());

  const rootStyle = computed(() => (props.height ? { height: `${props.height}px` } : {}));

  /* ================= SERIES ================= */

  const seriesKeys = computed(() => Object.keys(props.seriesConfig));
  const barSeries = computed(() => seriesKeys.value.filter(k => props.seriesConfig[k].type === 'bar'));
  const lineSeries = computed(() => seriesKeys.value.filter(k => props.seriesConfig[k].type === 'line'));
  const leftSeries = computed(() => seriesKeys.value.filter(k => props.seriesConfig[k].axis !== 'right'));
  const rightSeries = computed(() => seriesKeys.value.filter(k => props.seriesConfig[k].axis === 'right'));

  const hasData = computed(() => !!props.data?.length);

  const value = (item: ComboDataPoint, key: string): number | null => {
    const v = Number(item[key]);
    return Number.isFinite(v) ? v : null;
  };

  /* ================= SCALES ================= */

  /** «Гарний» крок осі: 1, 2, 2.5, 5 × 10^n */
  const niceStep = (raw: number) => {
    if (raw <= 0) return 1;
    const pow = 10 ** Math.floor(Math.log10(raw));
    const n = raw / pow;
    const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return m * pow;
  };

  const leftScale = computed(() => {
    let max = 0;
    props.data?.forEach(item => leftSeries.value.forEach(k => (max = Math.max(max, value(item, k) ?? 0))));
    const step = Math.max(1, niceStep(max / Y_TICKS));
    const top = Math.max(step * Y_TICKS, Math.ceil(max / step) * step);
    const ticks: number[] = [];
    for (let v = 0; v <= top + step / 2; v += step) ticks.push(+v.toFixed(6));
    return { max: top, ticks };
  });

  /** Права вісь — відсотки 0–100 (SL). Якщо значення більші — розширюємо */
  const rightScale = computed(() => {
    let max = 100;
    props.data?.forEach(item => rightSeries.value.forEach(k => (max = Math.max(max, value(item, k) ?? 0))));
    const top = Math.ceil(max / 20) * 20;
    const step = top / Y_TICKS;
    return { max: top, ticks: Array.from({ length: Y_TICKS + 1 }, (_, i) => Math.round(step * i)) };
  });

  const formatTick = (v: number) => (Math.abs(v) >= 10000 ? `${+(v / 1000).toFixed(1)}k` : `${+v.toFixed(2)}`);

  /* ================= LAYOUT ================= */

  const pad = computed<ComboChartPadding>(() => {
    if (props.padding) return props.padding;
    const leftLabel = Math.max(...leftScale.value.ticks.map(v => formatTick(v).length), 1);
    return {
      top: 8,
      right: rightSeries.value.length ? 44 : 12,
      bottom: 24,
      left: Math.ceil(leftLabel * CHAR_WIDTH) + 12,
    };
  });

  const inner = computed(() => ({
    width: Math.max(0, plotWidth.value - pad.value.left - pad.value.right),
    height: Math.max(0, plotHeight.value - pad.value.top - pad.value.bottom),
  }));

  const band = computed(() => (hasData.value ? inner.value.width / props.data.length : 0));

  const yLeft = (v: number) => pad.value.top + inner.value.height - (v / leftScale.value.max) * inner.value.height;
  const yRight = (v: number) => pad.value.top + inner.value.height - (v / rightScale.value.max) * inner.value.height;
  const yFor = (key: string, v: number) => (props.seriesConfig[key].axis === 'right' ? yRight(v) : yLeft(v));
  const xCenter = (i: number) => pad.value.left + band.value * i + band.value / 2;
  const baseline = computed(() => pad.value.top + inner.value.height);

  /** Стовпець із заокругленими верхніми кутами */
  const barPath = (x: number, y: number, w: number, h: number) => {
    if (h <= 0 || w <= 0) return '';
    const r = Math.min(BAR_RADIUS, w / 2, h);
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  };

  const bars = computed(() => {
    if (!hasData.value || !barSeries.value.length || inner.value.height <= 0) return [];
    const count = barSeries.value.length;
    const group = Math.min(band.value * 0.72, MAX_BAR_WIDTH * count);
    const gap = count > 1 && group / count > 6 ? 2 : 0;
    const w = Math.max(1, (group - gap * (count - 1)) / count);

    return props.data.flatMap((item, i) => {
      const start = xCenter(i) - group / 2;
      return barSeries.value.map((key, s) => {
        const v = Math.max(0, value(item, key) ?? 0);
        const y = yFor(key, v);
        return {
          key: `${i}-${key}`,
          d: barPath(start + s * (w + gap), y, w, baseline.value - y),
          color: props.seriesConfig[key].color,
          index: i,
        };
      });
    });
  });

  /** Плавна крива через точки (горизонтальні дотичні — без «перельотів» вище/нижче точок) */
  const smoothPath = (pts: { x: number; y: number }[]) => {
    if (!pts.length) return '';
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1];
      const c = pts[i];
      const dx = (c.x - p.x) * 0.4;
      d += `C${p.x + dx},${p.y} ${c.x - dx},${c.y} ${c.x},${c.y}`;
    }
    return d;
  };

  const lines = computed(() => {
    if (!hasData.value || inner.value.height <= 0) return [];
    return lineSeries.value.map(key => {
      const pts = props.data
        .map((item, i) => {
          const v = value(item, key);
          return v === null ? null : { x: xCenter(i), y: yFor(key, v), index: i };
        })
        .filter((p): p is { x: number; y: number; index: number } => !!p);
      return { key, color: props.seriesConfig[key].color, d: smoothPath(pts), points: pts };
    });
  });

  /** Точки на лінії показуємо, лише коли між ними є місце */
  const showDots = computed(() => band.value >= 14);

  /** Підписи осі X проріджуємо, щоб не налазили один на одного */
  const xLabels = computed(() => {
    if (!hasData.value || band.value <= 0) return [];
    const longest = Math.max(...props.data.map(item => String(item[props.categoryKey] ?? '').length), 1);
    const every = Math.max(1, Math.ceil((longest * CHAR_WIDTH + 8) / band.value));
    return props.data
      .map((item, i) => ({ i, text: String(item[props.categoryKey] ?? ''), x: xCenter(i) }))
      .filter(l => l.i % every === 0);
  });

  /* ================= HOVER ================= */

  const hoverIndex = ref<number | null>(null);
  const pointer = ref({ x: 0, y: 0 });
  const tooltip = ref<HTMLElement | null>(null);

  const onMove = (e: MouseEvent) => {
    if (!plot.value || !hasData.value || band.value <= 0) return;
    const rect = plot.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const i = Math.floor((x - pad.value.left) / band.value);
    if (i < 0 || i >= props.data.length || y < pad.value.top || y > baseline.value) {
      hoverIndex.value = null;
      return;
    }
    hoverIndex.value = i;
    pointer.value = { x, y };
  };

  const onLeave = () => (hoverIndex.value = null);

  const hovered = computed(() => {
    if (hoverIndex.value === null) return null;
    const item = props.data[hoverIndex.value];
    if (!item) return null;
    return {
      category: String(item[props.categoryKey] ?? ''),
      rows: seriesKeys.value
        .map(key => ({ key, value: value(item, key), config: props.seriesConfig[key] }))
        .filter(r => r.value !== null),
    };
  });

  /** Тултіп тримаємо в межах графіка: біля правого краю — ліворуч від курсора */
  const tooltipStyle = computed(() => {
    const w = tooltip.value?.offsetWidth ?? 160;
    const h = tooltip.value?.offsetHeight ?? 80;
    const offset = 14;
    let left = pointer.value.x + offset;
    if (left + w > plotWidth.value) left = pointer.value.x - offset - w;
    const top = Math.min(Math.max(0, pointer.value.y - h / 2), Math.max(0, plotHeight.value - h));
    return { left: `${Math.max(0, left)}px`, top: `${top}px` };
  });

  const formatValue = (key: string, v: number | null) =>
    v === null ? '' : props.seriesConfig[key].axis === 'right' ? `${v}%` : `${v}`;
</script>

<template>
  <div class="vt-chart__combo" :style="rootStyle">
    <div class="vt-chart__combo-legend">
      <div v-for="key in seriesKeys" :key="key" class="vt-chart__combo-legend-item">
        <span
          class="vt-chart__combo-marker"
          :class="`vt-chart__combo-marker--${seriesConfig[key].type}`"
          :style="{ '--vt-combo-color': seriesConfig[key].color }"
        />
        <span>{{ key }}</span>
      </div>
    </div>

    <div ref="plot" class="vt-chart__combo-plot" @mousemove="onMove" @mouseleave="onLeave">
      <div v-if="!hasData" class="vt-chart__combo-empty">
        <VIcon name="files_empty" />
        <span>{{ t(LOCALE_KEYS.TABLE_EMPTY) }}</span>
      </div>

      <svg
        v-else-if="plotWidth > 0 && plotHeight >= MIN_PLOT_HEIGHT"
        class="vt-chart__combo-svg"
        :width="plotWidth"
        :height="plotHeight"
        :viewBox="`0 0 ${plotWidth} ${plotHeight}`"
      >
        <!-- Сітка -->
        <g class="vt-chart__combo-grid">
          <line
            v-for="(tick, i) in leftScale.ticks"
            :key="`g${i}`"
            :x1="pad.left"
            :x2="pad.left + inner.width"
            :y1="yLeft(tick)"
            :y2="yLeft(tick)"
          />
        </g>

        <!-- Підписи осей -->
        <g class="vt-chart__combo-axis-text" :font-size="FONT_SIZE">
          <text
            v-for="(tick, i) in leftScale.ticks"
            :key="`lt${i}`"
            :x="pad.left - 8"
            :y="yLeft(tick)"
            text-anchor="end"
            dominant-baseline="middle"
          >
            {{ formatTick(tick) }}
          </text>
          <template v-if="rightSeries.length">
            <text
              v-for="(tick, i) in rightScale.ticks"
              :key="`rt${i}`"
              :x="pad.left + inner.width + 8"
              :y="yRight(tick)"
              text-anchor="start"
              dominant-baseline="middle"
            >
              {{ tick }}%
            </text>
          </template>
          <text v-for="label in xLabels" :key="`x${label.i}`" :x="label.x" :y="baseline + 16" text-anchor="middle">
            {{ label.text }}
          </text>
        </g>

        <!-- Підсвітка категорії під курсором -->
        <rect
          v-if="hoverIndex !== null"
          class="vt-chart__combo-hover"
          :x="pad.left + band * hoverIndex"
          :y="pad.top"
          :width="band"
          :height="inner.height"
        />

        <line
          class="vt-chart__combo-baseline"
          :x1="pad.left"
          :x2="pad.left + inner.width"
          :y1="baseline"
          :y2="baseline"
        />

        <g>
          <path
            v-for="bar in bars"
            :key="bar.key"
            :d="bar.d"
            :fill="bar.color"
            :opacity="hoverIndex === null || hoverIndex === bar.index ? 1 : 0.45"
          />
        </g>

        <g v-for="line in lines" :key="line.key">
          <path
            :d="line.d"
            fill="none"
            :stroke="line.color"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          <template v-for="p in line.points" :key="p.index">
            <circle
              v-if="showDots || hoverIndex === p.index"
              :cx="p.x"
              :cy="p.y"
              :r="hoverIndex === p.index ? 4.5 : 3"
              class="vt-chart__combo-dot"
              :stroke="line.color"
            />
          </template>
        </g>
      </svg>

      <div v-if="hovered" ref="tooltip" class="vt-chart__combo-tooltip" :style="tooltipStyle">
        <div class="vt-chart__combo-tooltip-title">{{ hovered.category }}</div>
        <div v-for="row in hovered.rows" :key="row.key" class="vt-chart__combo-tooltip-item">
          <span
            class="vt-chart__combo-marker"
            :class="`vt-chart__combo-marker--${row.config.type}`"
            :style="{ '--vt-combo-color': row.config.color }"
          />
          <span class="vt-chart__combo-tooltip-label">{{ row.key }}</span>
          <span class="vt-chart__combo-tooltip-value">{{ formatValue(row.key, row.value) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
