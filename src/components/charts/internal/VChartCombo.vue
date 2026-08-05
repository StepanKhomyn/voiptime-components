<script lang="ts" setup>
  import { onMounted, ref, watch, computed, nextTick } from 'vue';
  import type { ComboChartPadding, ComboDataPoint, ComboSeriesConfig } from '../types';

  interface ChartPoint {
    x: number;
    y: number;
  }

  interface ComboHoverData {
    category: string;
    values: Record<string, number>;
    x: number;
    y: number;
  }

  const props = defineProps<{
    data: ComboDataPoint[];
    seriesConfig: Record<string, ComboSeriesConfig>;
    categoryKey: string;
    width?: number;
    height?: number;
    padding?: ComboChartPadding;
  }>();

  const canvas = ref<HTMLCanvasElement | null>(null);
  const hoveredData = ref<ComboHoverData | null>(null);

  const width = computed(() => props.width || 800);
  const height = computed(() => props.height || 400);
  const padding = computed<ComboChartPadding>(() => props.padding || { top: 20, right: 60, bottom: 60, left: 60 });

  const leftAxisSeries = computed(() =>
    Object.keys(props.seriesConfig).filter(key => props.seriesConfig[key].axis !== 'right'),
  );

  const rightAxisSeries = computed(() =>
    Object.keys(props.seriesConfig).filter(key => props.seriesConfig[key].axis === 'right'),
  );

  function computeRange(seriesKeys: string[], forcePercent: boolean) {
    if (!props.data || props.data.length === 0 || seriesKeys.length === 0) {
      return { min: 0, max: 100 };
    }

    if (forcePercent && seriesKeys.some(key => key === 'SL')) {
      return { min: 0, max: 100 };
    }

    let min = Infinity;
    let max = -Infinity;

    props.data.forEach(item => {
      seriesKeys.forEach(seriesKey => {
        const value = Number(item[seriesKey]);
        if (!isNaN(value)) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
    });

    if (min === Infinity || max === -Infinity) {
      return { min: 0, max: 100 };
    }

    const range = max - min;
    const paddingPercent = 0.1;

    return {
      min: Math.max(0, min - range * paddingPercent),
      max: max + range * paddingPercent,
    };
  }

  const leftAxisRange = computed(() => computeRange(leftAxisSeries.value, false));
  const rightAxisRange = computed(() => computeRange(rightAxisSeries.value, true));

  function getYCoordinate(value: number, axis: 'left' | 'right', chartHeight: number): number {
    const range = axis === 'left' ? leftAxisRange.value : rightAxisRange.value;
    const normalizedValue = (value - range.min) / (range.max - range.min);
    return padding.value.top + chartHeight - normalizedValue * chartHeight;
  }

  function updateCanvasSize() {
    if (!canvas.value) return;

    const container = canvas.value.parentElement;
    if (container) {
      const containerWidth = container.clientWidth;
      canvas.value.width = containerWidth || width.value;
      canvas.value.height = height.value;

      nextTick(() => drawChart());
    }
  }

  watch(
    () => [props.data, props.seriesConfig],
    () => {
      if (canvas.value) updateCanvasSize();
    },
    { deep: true },
  );

  onMounted(() => {
    if (canvas.value) {
      const resizeObserver = new ResizeObserver(() => updateCanvasSize());
      const container = canvas.value.parentElement;
      if (container) resizeObserver.observe(container);
    }

    setTimeout(() => updateCanvasSize(), 100);
  });

  function getSeriesColor(seriesKey: string): string {
    return props.seriesConfig[seriesKey]?.color || '#000';
  }

  function drawChart() {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    const currentWidth = canvas.value.width;
    const currentHeight = canvas.value.height;
    const chartWidth = currentWidth - padding.value.left - padding.value.right;
    const chartHeight = currentHeight - padding.value.top - padding.value.bottom;

    ctx.clearRect(0, 0, currentWidth, currentHeight);

    if (!props.data || props.data.length === 0) return;

    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333';

    drawGrid(ctx, chartWidth, chartHeight);
    drawAxes(ctx, chartWidth, chartHeight);
    drawBars(ctx, chartWidth, chartHeight);
    drawLines(ctx, chartWidth, chartHeight);
    drawLabels(ctx, chartWidth, chartHeight);
  }

  function drawGrid(ctx: CanvasRenderingContext2D, chartWidth: number, chartHeight: number) {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const y = padding.value.top + (chartHeight / steps) * i;
      ctx.beginPath();
      ctx.moveTo(padding.value.left, y);
      ctx.lineTo(padding.value.left + chartWidth, y);
      ctx.stroke();
    }

    const barWidth = chartWidth / props.data.length;
    for (let i = 0; i <= props.data.length; i++) {
      const x = padding.value.left + barWidth * i;
      ctx.beginPath();
      ctx.moveTo(x, padding.value.top);
      ctx.lineTo(x, padding.value.top + chartHeight);
      ctx.stroke();
    }
  }

  function drawAxes(ctx: CanvasRenderingContext2D, chartWidth: number, chartHeight: number) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(padding.value.left, padding.value.top);
    ctx.lineTo(padding.value.left, padding.value.top + chartHeight);
    ctx.stroke();

    if (rightAxisSeries.value.length > 0) {
      ctx.beginPath();
      ctx.moveTo(padding.value.left + chartWidth, padding.value.top);
      ctx.lineTo(padding.value.left + chartWidth, padding.value.top + chartHeight);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(padding.value.left, padding.value.top + chartHeight);
    ctx.lineTo(padding.value.left + chartWidth, padding.value.top + chartHeight);
    ctx.stroke();

    if (leftAxisSeries.value.length > 0) {
      ctx.fillStyle = '#666';
      ctx.textAlign = 'right';
      const steps = 5;
      const range = leftAxisRange.value.max - leftAxisRange.value.min;
      const stepValue = Math.ceil(range / steps);
      for (let i = 0; i <= steps; i++) {
        const value = leftAxisRange.value.min + stepValue * i;
        const y = padding.value.top + chartHeight - (i / steps) * chartHeight;
        ctx.fillText(value.toString(), padding.value.left - 10, y + 4);
      }
    }

    if (rightAxisSeries.value.length > 0) {
      ctx.textAlign = 'left';
      const steps = 5;
      for (let i = 0; i <= steps; i++) {
        const value = rightAxisRange.value.max - (rightAxisRange.value.max - rightAxisRange.value.min) * (i / steps);
        const y = padding.value.top + (chartHeight / steps) * i;
        ctx.fillText(`${Math.round(value)}%`, padding.value.left + chartWidth + 10, y + 4);
      }
    }
  }

  function drawBars(ctx: CanvasRenderingContext2D, chartWidth: number, chartHeight: number) {
    const barWidth = chartWidth / props.data.length;
    const barSeries = Object.keys(props.seriesConfig).filter(key => props.seriesConfig[key].type === 'bar');
    const barSeriesWidth = (barWidth * 0.8) / barSeries.length;

    props.data.forEach((item, index) => {
      const x = padding.value.left + barWidth * index;

      barSeries.forEach((seriesKey, seriesIndex) => {
        const value = Number(item[seriesKey]);
        if (isNaN(value)) return;

        const axis = props.seriesConfig[seriesKey].axis || 'left';
        const barY = getYCoordinate(value, axis, chartHeight);
        const barHeight = padding.value.top + chartHeight - barY;
        const barX = x + barWidth * 0.1 + barSeriesWidth * seriesIndex;

        ctx.fillStyle = props.seriesConfig[seriesKey].color;
        ctx.fillRect(barX, barY, barSeriesWidth, barHeight);
      });
    });
  }

  function drawLines(ctx: CanvasRenderingContext2D, chartWidth: number, chartHeight: number) {
    const barWidth = chartWidth / props.data.length;
    const lineSeries = Object.keys(props.seriesConfig).filter(key => props.seriesConfig[key].type === 'line');

    lineSeries.forEach(seriesKey => {
      const config = props.seriesConfig[seriesKey];
      ctx.strokeStyle = config.color;
      ctx.fillStyle = config.color;
      ctx.lineWidth = 2;

      const axis = config.axis || 'left';
      const validPoints: ChartPoint[] = [];

      props.data.forEach((item, index) => {
        const value = Number(item[seriesKey]);
        if (!isNaN(value)) {
          const x = padding.value.left + barWidth * index + barWidth / 2;
          const y = getYCoordinate(value, axis, chartHeight);
          validPoints.push({ x, y });
        }
      });

      if (validPoints.length > 1) {
        ctx.beginPath();
        ctx.moveTo(validPoints[0].x, validPoints[0].y);

        for (let i = 1; i < validPoints.length; i++) {
          const prev = validPoints[i - 1];
          const curr = validPoints[i];

          const tension = 0.3;
          const cpX1 = prev.x + (curr.x - prev.x) * tension;
          const cpY1 = prev.y;
          const cpX2 = curr.x - (curr.x - prev.x) * tension;
          const cpY2 = curr.y;

          ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, curr.x, curr.y);
        }
        ctx.stroke();
      }

      validPoints.forEach(point => {
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      });
    });
  }

  function drawLabels(ctx: CanvasRenderingContext2D, chartWidth: number, chartHeight: number) {
    const barWidth = chartWidth / props.data.length;

    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';

    props.data.forEach((item, index) => {
      const x = padding.value.left + barWidth * index + barWidth / 2;
      const label = String(item[props.categoryKey]);
      ctx.fillText(label, x, padding.value.top + chartHeight + 20);
    });
  }

  function handleHover(event: MouseEvent) {
    const rect = canvas.value?.getBoundingClientRect();
    if (!rect || !canvas.value) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const chartWidth = canvas.value.width - padding.value.left - padding.value.right;
    const chartHeight = canvas.value.height - padding.value.top - padding.value.bottom;

    if (
      mouseX < padding.value.left ||
      mouseX > padding.value.left + chartWidth ||
      mouseY < padding.value.top ||
      mouseY > padding.value.top + chartHeight
    ) {
      resetHover();
      return;
    }

    const barWidth = chartWidth / props.data.length;
    const categoryIndex = Math.floor((mouseX - padding.value.left) / barWidth);

    if (categoryIndex >= 0 && categoryIndex < props.data.length) {
      const item = props.data[categoryIndex];
      const values: Record<string, number> = {};

      Object.keys(props.seriesConfig).forEach(key => {
        const value = Number(item[key]);
        if (!isNaN(value)) values[key] = value;
      });

      hoveredData.value = {
        category: String(item[props.categoryKey]),
        values,
        x: mouseX - 50,
        y: mouseY - 10,
      };
    }
  }

  function resetHover() {
    hoveredData.value = null;
  }
</script>

<template>
  <div class="vt-chart__combo-container">
    <div class="vt-chart__combo-canvas-wrapper" @mousemove="handleHover" @mouseleave="resetHover">
      <canvas ref="canvas" class="vt-chart__combo-canvas" :width="width" :height="height"></canvas>

      <div
        v-if="hoveredData"
        class="vt-chart__combo-tooltip"
        :style="{ left: hoveredData.x + 'px', top: hoveredData.y + 'px' }"
      >
        <div><strong>{{ hoveredData.category }}</strong></div>
        <div v-for="(value, key) in hoveredData.values" :key="key" class="vt-chart__combo-tooltip-item">
          <span :style="{ backgroundColor: getSeriesColor(key) }" class="vt-chart__legend-color" />
          <span>{{ key }}: {{ key === 'SL' ? value + '%' : value }}</span>
        </div>
      </div>
    </div>

    <div class="vt-chart__combo-legend">
      <div v-for="(series, key) in seriesConfig" :key="key" class="vt-chart__combo-legend-item">
        <span :style="{ backgroundColor: series.color }" class="vt-chart__legend-color" />
        <span class="vt-chart__legend-text">{{ key }}</span>
      </div>
    </div>
  </div>
</template>