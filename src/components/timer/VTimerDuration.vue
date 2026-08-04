<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import type { VTimerDurationProps } from './types';

  const props = defineProps<VTimerDurationProps>();

  const elapsedSeconds = ref(0);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const formatTime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return days > 0 ? `${days}d. ${formattedTime}` : formattedTime;
  };

  const formattedTime = computed(() => {
    return props.timestamp ? formatTime(elapsedSeconds.value) : '-';
  });

  const updateElapsed = () => {
    if (props.timestamp) {
      elapsedSeconds.value = Math.floor((Date.now() - props.timestamp) / 1000);
    }
  };

  const startTimer = () => {
    stopTimer();
    if (!props.timestamp) return;

    updateElapsed();
    intervalId = setInterval(updateElapsed, 1000);
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  watch(
    () => props.timestamp,
    () => startTimer()
  );

  onMounted(() => startTimer());
  onUnmounted(() => stopTimer());
</script>

<template>
  <span class="vt-timer-duration">{{ formattedTime }}</span>
</template>