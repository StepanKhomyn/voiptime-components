<script lang="ts" setup>
  import { computed } from 'vue';
  import type { VTimerDurationProps } from './types';
  import { useClock } from '@/components/timer/useClock';

  const props = defineProps<VTimerDurationProps>();

  const { now } = useClock();

  const formatTime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return days > 0 ? `${days}d. ${formattedTime}` : formattedTime;
  };

  const formattedTime = computed(() => {
    if (!props.timestamp) return '-';
    const elapsedSeconds = Math.floor((now.value - props.timestamp) / 1000);
    return formatTime(Math.max(0, elapsedSeconds));
  });
</script>

<template>
  <span class="vt-timer-duration">{{ formattedTime }}</span>
</template>
