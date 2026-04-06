<script lang="ts" setup>
  import { computed } from 'vue';
  import type { ChartSegment } from '../types';

  const props = defineProps<{
    segments: ChartSegment[];
    showAxis?: boolean;
  }>();

  const filtered = computed(() => props.segments?.filter(s => s.count > 0) ?? []);
  const max = computed(() => Math.ceil(Math.max(...filtered.value.map(s => s.count), 0) / 10) * 10);
  const ticks = computed(() => {
    const step = max.value / 5;
    return Array.from({ length: 6 }, (_, i) => Math.round(step * i));
  });

  function barWidth(val: number) {
    return max.value ? (val / max.value) * 100 : 0;
  }

  function stripeWidth(i: number) {
    return barWidth(ticks.value[i + 1] - ticks.value[i]);
  }
</script>

<template>
  <div class="vt-chart__bar-container">
    <div class="vt-chart__bar-background">
      <div
        v-for="(tick, i) in ticks.slice(0, -1)"
        :key="i"
        :class="{ 'vt-chart__bar-stripe--gray': i % 2 === 0 }"
        :style="{ left: barWidth(tick) + '%', width: stripeWidth(i) + '%' }"
        class="vt-chart__bar-stripe"
      />
    </div>

    <div v-for="(seg, i) in filtered" :key="i" class="vt-chart__bar-item">
      <div class="vt-chart__bar-label">
        <component :is="seg.icon" v-if="seg.icon" class="vt-chart__bar-icon" />
        <span v-else :style="{ backgroundColor: seg.color }" class="vt-chart__bar-icon" />
      </div>
      <div class="vt-chart__bar-track">
        <div :style="{ width: barWidth(seg.count) + '%', backgroundColor: seg.color }" class="vt-chart__bar-fill">
          <div class="vt-chart__bar-tooltip">{{ seg.count }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showAxis" class="vt-chart__bar-axis">
    <div class="vt-chart__bar-axis-line" />
    <div v-for="tick in ticks" :key="tick" :style="{ left: barWidth(tick) + '%' }" class="vt-chart__bar-axis-tick">
      <div class="vt-chart__bar-axis-tick-mark" />
      <div class="vt-chart__bar-axis-tick-label">{{ tick }}</div>
    </div>
  </div>
</template>
