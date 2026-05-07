<script lang="ts" setup>
  import type {
    DonutChartProps,
    HorizontalBarChartProps,
    RadialProgressChartProps,
    ScaleBarChartProps,
    SparklineChartProps,
    TreemapChartProps,
    VChartProps,
  } from './types';

  import VChartDonut from './internal/VChartDonut.vue';
  import VChartHorizontalBar from './internal/VChartHorizontalBar.vue';
  import VChartRadialProgress from './internal/VChartRadialProgress.vue';
  import VChartScaleBar from './internal/VChartScaleBar.vue';
  import VChartSparkline from './internal/VChartSparkline.vue';
  import VChartTreemap from './internal/VChartTreemap.vue';

  import './chart.scss';

  const props = defineProps<VChartProps>();
</script>

<template>
  <div class="vt-chart">
    <!-- Existing chart types ─────────────────────────────────────────── -->
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

    <!-- New chart types ──────────────────────────────────────────────── -->
    <VChartSparkline
      v-else-if="props.type === 'sparkline'"
      :points="(props as SparklineChartProps).points"
      :series="(props as SparklineChartProps).series"
      :height="(props as SparklineChartProps).height"
      :area="(props as SparklineChartProps).area"
    />

    <VChartTreemap
      v-else-if="props.type === 'treemap'"
      :nodes="(props as TreemapChartProps).nodes"
      :format="(props as TreemapChartProps).format"
      :height="(props as TreemapChartProps).height"
    />

    <VChartRadialProgress
      v-else-if="props.type === 'radial-progress'"
      :value="(props as RadialProgressChartProps).value"
      :label="(props as RadialProgressChartProps).label"
      :sublabel="(props as RadialProgressChartProps).sublabel"
      :color="(props as RadialProgressChartProps).color"
      :track-color="(props as RadialProgressChartProps).trackColor"
      :size="(props as RadialProgressChartProps).size"
      :stroke-width="(props as RadialProgressChartProps).strokeWidth"
    />
  </div>
</template>
