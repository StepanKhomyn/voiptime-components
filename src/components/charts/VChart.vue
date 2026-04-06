<script lang="ts" setup>
  import type { DonutChartProps, HorizontalBarChartProps, ScaleBarChartProps, VChartProps } from './types';

  import VChartDonut from './internal/VChartDonut.vue';
  import VChartHorizontalBar from './internal/VChartHorizontalBar.vue';
  import VChartScaleBar from './internal/VChartScaleBar.vue';

  import './chart.scss';

  const props = defineProps<VChartProps>();
</script>

<template>
  <div class="vt-chart">
    <VChartDonut
      v-if="props.type === 'donut'"
      :labels="(props as DonutChartProps).labels"
      :segments="(props as DonutChartProps).segments"
      :size="(props as DonutChartProps).size"
    />

    <VChartHorizontalBar
      v-else-if="props.type === 'horizontal-bar'"
      :segments="(props as HorizontalBarChartProps).segments"
      :show-axis="(props as HorizontalBarChartProps).showAxis"
    />

    <VChartScaleBar
      v-else-if="props.type === 'scale-bar'"
      :left="(props as ScaleBarChartProps).left"
      :right="(props as ScaleBarChartProps).right"
    />
  </div>
</template>
