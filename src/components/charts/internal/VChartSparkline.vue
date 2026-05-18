<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import type { SparklineDataPoint, SparklineSeries } from '../types';

  const props = defineProps<{
    points: SparklineDataPoint[];
    series: SparklineSeries[];
    height?: number;
    area?: boolean;
  }>();

  // ── Canvas refs ───────────────────────────────────────────────────────────────
  const wrapper = ref<HTMLDivElement | null>(null);
  const canvas = ref<HTMLCanvasElement | null>(null);
  const canvasWidth = ref(600);
  const canvasHeight = computed(() => props.height ?? 160);

  // ── Tooltip state ─────────────────────────────────────────────────────────────
  const tooltip = ref<{
    visible: boolean;
    x: number;
    y: number;
    pointIndex: number;
  }>({ visible: false, x: 0, y: 0, pointIndex: -1 });

  // ── Layout constants ──────────────────────────────────────────────────────────
  const PAD = { top: 16, right: 16, bottom: 32, left: 48 };

  // ── Data helpers ──────────────────────────────────────────────────────────────
  function valuesFor(key: 'primary' | 'secondary') {
    return props.points.map(p => (key === 'primary' ? p.primary : (p.secondary ?? 0)));
  }

  const primaryMax = computed(() => {
    const raw = Math.max(...valuesFor('primary'), 0);
    return raw > 0 ? raw * 1.15 : 1;
  });

  const secondaryMax = computed(() => {
    if (!props.series.some(s => s.key === 'secondary')) return 0;
    const raw = Math.max(...valuesFor('secondary'), 0);
    return raw > 0 ? raw * 1.15 : 1;
  });

  // ── Coordinate mappers ────────────────────────────────────────────────────────
  function xAt(i: number, w: number) {
    const n = props.points.length;
    const plotW = w - PAD.left - PAD.right;
    return PAD.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  }

  function yAt(val: number, maxVal: number, h: number) {
    const plotH = h - PAD.top - PAD.bottom;
    if (maxVal <= 0 || (val === 0 && primaryMax.value === 1)) {
      return PAD.top + plotH / 2;
    }
    return PAD.top + plotH - (val / maxVal) * plotH;
  }

  // ── Draw ──────────────────────────────────────────────────────────────────────
  function draw() {
    const cvs = canvas.value;
    if (!cvs || !props.points.length) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const W = canvasWidth.value;
    const H = canvasHeight.value;
    const dpr = window.devicePixelRatio || 1;
    cvs.width = W * dpr;
    cvs.height = H * dpr;
    cvs.style.width = W + 'px';
    cvs.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    const gridTicks = 4;
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridTicks; i++) {
      const y = PAD.top + ((H - PAD.top - PAD.bottom) / gridTicks) * i;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(W - PAD.right, y);
      ctx.stroke();

      // Y-axis labels (left axis = primary series)
      const val = primaryMax.value * (1 - i / gridTicks);
      const ser = props.series.find(s => s.key === 'primary');
      const label = ser?.format ? ser.format(val) : val.toFixed(2);
      ctx.fillStyle = '#aaa';
      ctx.font = '10px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(label, PAD.left - 6, y + 3);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    ctx.fillStyle = '#aaa';
    ctx.font = '10px system-ui, sans-serif';
    props.points.forEach((p, i) => {
      const x = xAt(i, W);
      ctx.fillText(p.label, x, H - PAD.bottom + 14);
    });

    // Draw each series
    props.series.forEach(ser => {
      const vals = valuesFor(ser.key);
      const maxVal = ser.key === 'primary' ? primaryMax.value : secondaryMax.value;
      const pts = vals.map((v, i) => ({ x: xAt(i, W), y: yAt(v, maxVal, H) }));

      // Area fill (primary only)
      if (props.area && ser.key === 'primary') {
        ctx.beginPath();
        pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.lineTo(pts[pts.length - 1].x, H - PAD.bottom);
        ctx.lineTo(pts[0].x, H - PAD.bottom);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, PAD.top, 0, H - PAD.bottom);
        grad.addColorStop(0, ser.color + '30');
        grad.addColorStop(1, ser.color + '00');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Line
      ctx.beginPath();
      ctx.strokeStyle = ser.color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();

      // Dots
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = ser.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    // Hover crosshair
    if (tooltip.value.visible && tooltip.value.pointIndex >= 0) {
      const i = tooltip.value.pointIndex;
      const x = xAt(i, W);
      ctx.beginPath();
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(x, PAD.top);
      ctx.lineTo(x, H - PAD.bottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Highlight dots
      props.series.forEach(ser => {
        const vals = valuesFor(ser.key);
        const maxVal = ser.key === 'primary' ? primaryMax.value : secondaryMax.value;
        const y = yAt(vals[i], maxVal, H);
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = ser.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      const allZero = props.points.every(p => p.primary === 0);
      if (allZero) {
        ctx.save();
        ctx.fillStyle = '#bbb';
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('немає даних', W / 2, PAD.top + (H - PAD.top - PAD.bottom) / 2 - 14);
        ctx.restore();
      }
    }
  }

  // ── Mouse handling ────────────────────────────────────────────────────────────
  function onMouseMove(e: MouseEvent) {
    const cvs = canvas.value;
    if (!cvs) return;
    const rect = cvs.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const W = canvasWidth.value;

    let closestIdx = -1;
    let closestDist = Infinity;
    props.points.forEach((_, i) => {
      const dist = Math.abs(xAt(i, W) - mx);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    if (closestIdx >= 0 && closestDist < 40) {
      tooltip.value = { visible: true, x: mx, y: my, pointIndex: closestIdx };
    } else {
      tooltip.value = { ...tooltip.value, visible: false, pointIndex: -1 };
    }
    draw();
  }

  function onMouseLeave() {
    tooltip.value = { visible: false, x: 0, y: 0, pointIndex: -1 };
    draw();
  }

  // ── Resize observer ───────────────────────────────────────────────────────────
  let ro: ResizeObserver | null = null;
  onMounted(() => {
    if (wrapper.value) {
      ro = new ResizeObserver(entries => {
        canvasWidth.value = entries[0].contentRect.width || 600;
        draw();
      });
      ro.observe(wrapper.value);
      canvasWidth.value = wrapper.value.clientWidth || 600;
    }
    draw();
  });
  onUnmounted(() => ro?.disconnect());
  watch(() => [props.points, props.series], draw, { deep: true });
</script>

<template>
  <div ref="wrapper" class="vt-chart__sparkline-wrapper" @mouseleave="onMouseLeave" @mousemove="onMouseMove">
    <canvas ref="canvas" />

    <!-- Tooltip -->
    <div
      v-if="tooltip.visible && tooltip.pointIndex >= 0"
      :style="{
        left: Math.min(tooltip.x + 12, canvasWidth - 140) + 'px',
        top: tooltip.y - 10 + 'px',
      }"
      class="vt-chart__sparkline-tooltip"
    >
      <div class="vt-chart__sparkline-tooltip-date">
        {{ points[tooltip.pointIndex].label }}
      </div>
      <div v-for="ser in series" :key="ser.key" class="vt-chart__sparkline-tooltip-row">
        <span :style="{ background: ser.color }" class="vt-chart__sparkline-tooltip-dot" />
        <span class="vt-chart__sparkline-tooltip-label">{{ ser.label }}</span>
        <span class="vt-chart__sparkline-tooltip-value">
          {{
            ser.format
              ? ser.format(
                  ser.key === 'primary'
                    ? points[tooltip.pointIndex].primary
                    : (points[tooltip.pointIndex].secondary ?? 0)
                )
              : ser.key === 'primary'
                ? points[tooltip.pointIndex].primary
                : (points[tooltip.pointIndex].secondary ?? 0)
          }}
        </span>
      </div>
    </div>
  </div>

  <!-- Legend -->
  <div class="vt-chart__sparkline-legend">
    <div v-for="ser in series" :key="ser.key" class="vt-chart__sparkline-legend-item">
      <span :style="{ background: ser.color }" class="vt-chart__legend-color" />
      <span class="vt-chart__legend-text">{{ ser.label }}</span>
    </div>
  </div>
</template>
