<script lang="ts" setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import type { ChartSegment } from '../types';

  const props = defineProps<{
    segments: ChartSegment[];
    size?: number;
    labels?: boolean;
  }>();

  const size = props.size ?? 200;
  const canvas = ref<HTMLCanvasElement | null>(null);
  const hoveredIndex = ref<number | null>(null);
  const labelX = ref(0);
  const labelY = ref(0);

  const processedSegments = computed(() => {
    if (!props.segments?.length || props.segments.every(s => !s.count)) {
      return [{ label: '', count: 0, renderCount: 1, color: '#f2f2f2' }];
    }
    return props.segments.map(s => ({ ...s, renderCount: s.count }));
  });

  const total = computed(() => processedSegments.value.reduce((sum, s) => sum + s.renderCount, 0));

  watch(processedSegments, drawChart, { immediate: true });
  onMounted(drawChart);

  function drawChart() {
    if (!canvas.value) return;
    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    const cx = size / 2,
      cy = size / 2;
    const outer = size / 2,
      inner = outer / 2;
    let start = 0;

    processedSegments.value.forEach(seg => {
      const angle = (seg.renderCount / total.value) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, outer, start, start + angle);
      ctx.arc(cx, cy, inner, start + angle, start, true);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      start += angle;
    });
  }

  function handleHover(e: MouseEvent) {
    const cx = size / 2,
      cy = size / 2;
    const dist = Math.hypot(e.offsetX - cx, e.offsetY - cy);
    if (dist < size / 4 || dist > size / 2) {
      resetHover();
      return;
    }

    let angle = Math.atan2(e.offsetY - cy, e.offsetX - cx);
    if (angle < 0) angle += 2 * Math.PI;

    let start = 0;
    for (let i = 0; i < processedSegments.value.length; i++) {
      const slice = (processedSegments.value[i].renderCount / total.value) * 2 * Math.PI;
      if (angle >= start && angle < start + slice) {
        hoveredIndex.value = i;
        const d = size * 0.375;
        labelX.value = cx + Math.cos(angle) * d - 10;
        labelY.value = cy + Math.sin(angle) * d - 10;
        return;
      }
      start += slice;
    }
    resetHover();
  }

  function resetHover() {
    hoveredIndex.value = null;
  }
</script>

<template>
  <div class="vt-chart__donut-container" @mouseleave="resetHover" @mousemove="handleHover">
    <canvas ref="canvas" :height="size" :width="size" />
    <div
      v-if="hoveredIndex !== null"
      :style="{ left: labelX + 'px', top: labelY + 'px' }"
      class="vt-chart__donut-count"
    >
      {{ processedSegments[hoveredIndex].count }}
    </div>
  </div>

  <div v-if="labels" class="vt-chart__donut-labels">
    <div v-for="(seg, i) in processedSegments" :key="i" class="vt-chart__donut-label pr-20">
      <span :style="{ backgroundColor: seg.color }" class="vt-chart__legend-color" />
      <span class="vt-chart__legend-text">{{ seg.label }}</span>
    </div>
  </div>
</template>
