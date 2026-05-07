<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps<{
    value: number;
    label?: string;
    sublabel?: string;
    color?: string;
    trackColor?: string;
    size?: number;
    strokeWidth?: number;
  }>();

  const size = computed(() => props.size ?? 160);
  const sw = computed(() => props.strokeWidth ?? 14);
  const color = computed(() => props.color ?? 'var(--color-primary-main, #6c5ce7)');
  const trackColor = computed(() => props.trackColor ?? '#eee');

  // Arc geometry
  const cx = computed(() => size.value / 2);
  const cy = computed(() => size.value / 2);
  const r = computed(() => (size.value - sw.value) / 2);
  const circumference = computed(() => 2 * Math.PI * r.value);

  // We use a 270° arc (start at 135°, end at 45° going clockwise)
  const ARC_DEG = 270;
  const arcLen = computed(() => (ARC_DEG / 360) * circumference.value);
  const gapLen = computed(() => circumference.value - arcLen.value);

  // Start angle: 135° from 3 o'clock = 135° rotation
  const START_DEG = 135;

  // Filled portion
  const filled = computed(() => Math.max(0, Math.min(1, props.value / 100)));
  const filledLen = computed(() => filled.value * arcLen.value);
  const dashArray = computed(() => `${filledLen.value} ${circumference.value - filledLen.value}`);
  const trackDashArray = computed(() => `${arcLen.value} ${gapLen.value}`);

  // Clamp displayed value
  const display = computed(() => Math.round(Math.max(0, Math.min(100, props.value))));
</script>

<template>
  <div class="vt-chart__radial-wrapper" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="vt-chart__radial-svg">
      <!-- Track arc -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="r"
        :stroke="trackColor"
        :stroke-width="sw"
        :stroke-dasharray="trackDashArray"
        :stroke-dashoffset="0"
        :transform="`rotate(${START_DEG} ${cx} ${cy})`"
        fill="none"
        stroke-linecap="round"
      />

      <!-- Filled arc (animated) -->
      <circle
        :cx="cx"
        :cy="cy"
        :r="r"
        :stroke="color"
        :stroke-width="sw"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="0"
        :transform="`rotate(${START_DEG} ${cx} ${cy})`"
        fill="none"
        stroke-linecap="round"
        class="vt-chart__radial-fill"
      />
    </svg>

    <!-- Center text -->
    <div class="vt-chart__radial-center">
      <span class="vt-chart__radial-pct" :style="{ color }">{{ display }}%</span>
      <span v-if="label" class="vt-chart__radial-label">{{ label }}</span>
      <span v-if="sublabel" class="vt-chart__radial-sublabel">{{ sublabel }}</span>
    </div>
  </div>
</template>
