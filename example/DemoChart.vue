<script lang="ts" setup>
  import VChart from '@/components/charts/VChart.vue';
  import { ChartSegment } from '@/components/charts/types';

  const segments: ChartSegment[] = [
    {
      label: 'Voicemail',
      count: 456,
      color: '#f59e0b', // amber
    },
    {
      label: 'Human',
      count: 55,
      color: '#10b981', // green
    },
    {
      label: 'Not predicted',
      count: 644,
      color: '#ef4444', // red
    },
  ];
</script>

<template>
  <VChart :labels="true" :segments="segments" type="donut" />
  <VChart :segments="segments" type="horizontal-bar" />
  <VChart :left="{ label: 'Human', value: 120 }" :right="{ label: 'VM', value: 80 }" type="scale-bar" />
</template>
