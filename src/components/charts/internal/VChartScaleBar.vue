<script lang="ts" setup>
  import { computed } from 'vue';
  import type { ScaleBarSide } from '../types';

  const props = defineProps<{ left: ScaleBarSide; right: ScaleBarSide }>();

  const total = computed(() => props.left.value + props.right.value);
  const leftPct = computed(() => (total.value ? (props.left.value / total.value) * 100 : 0));
  const rightPct = computed(() => (total.value ? (props.right.value / total.value) * 100 : 0));
</script>

<template>
  <div class="vt-chart__scale-bar">
    <div class="vt-chart__scale-bar-header">
      <div class="flex flex-align-center gap-5">
        <span class="vt-chart__scale-bar-label">{{ left.label }}</span>
        <span class="vt-chart__scale-bar-value">{{ left.value }}</span>
      </div>
      <div class="flex flex-align-center gap-5">
        <span class="vt-chart__scale-bar-label">{{ right.label }}</span>
        <span class="vt-chart__scale-bar-value">{{ right.value }}</span>
      </div>
    </div>
    <div class="vt-chart__scale-bar-track">
      <div :style="{ width: leftPct + '%' }" class="vt-chart__scale-bar-segment vt-chart__scale-bar-segment--left" />
      <div :style="{ width: rightPct + '%' }" class="vt-chart__scale-bar-segment vt-chart__scale-bar-segment--right" />
    </div>
  </div>
</template>
