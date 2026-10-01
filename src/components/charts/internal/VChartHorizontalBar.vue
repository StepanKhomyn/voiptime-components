<script lang="ts" setup>
  import { computed } from 'vue';
  import type { BarSortOrder, ChartSegment } from '../types';
  import VIcon from '@/components/icon/VIcon.vue';

  const props = withDefaults(
    defineProps<{
      segments: ChartSegment[];
      showAxis?: boolean;
      showPercent?: boolean;
      sort?: BarSortOrder;
    }>(),
    { showAxis: false, showPercent: false, sort: 'none' },
  );

  const filtered = computed(() => props.segments?.filter(s => s.count > 0) ?? []);

  const sorted = computed(() => {
    if (props.sort === 'none') return filtered.value;
    const dir = props.sort === 'asc' ? 1 : -1;
    return [...filtered.value].sort((a, b) => (a.count - b.count) * dir);
  });

  const total = computed(() => filtered.value.reduce((sum, s) => sum + s.count, 0));
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

  function percentOf(seg: ChartSegment) {
    if (seg.percent !== undefined) return seg.percent;
    return total.value ? Math.round((seg.count / total.value) * 100) : 0;
  }
</script>

<template>
  <div :class="['vt-chart__bar', { 'vt-chart__bar--with-percent': showPercent }]">
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

      <div v-for="seg in sorted" :key="seg.label" class="vt-chart__bar-item">
        <div class="vt-chart__bar-label">
          <VIcon v-if="seg.icon" :name="seg.icon" class="vt-chart__bar-icon" />
          <span v-else :style="{ backgroundColor: seg.color }" class="vt-chart__bar-icon" />
        </div>
        <div class="vt-chart__bar-track">
          <div :style="{ width: barWidth(seg.count) + '%', backgroundColor: seg.color }" class="vt-chart__bar-fill">
            <div class="vt-chart__bar-tooltip">
              <span class="vt-chart__bar-count">{{ seg.count }}</span>
              <span v-if="showPercent" class="vt-chart__bar-percent">{{ percentOf(seg) }}%</span>
            </div>
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
  </div>
</template>