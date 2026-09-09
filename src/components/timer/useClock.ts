// composables/useClock.ts
import { onMounted, onUnmounted, ref } from 'vue';

let subscribers = 0;
const now = ref(Date.now());
let intervalId: ReturnType<typeof setInterval> | null = null;

export function useClock() {
  onMounted(() => {
    subscribers++;
    if (!intervalId)
      intervalId = setInterval(() => {
        now.value = Date.now();
      }, 1000);
  });
  onUnmounted(() => {
    subscribers--;
    if (subscribers === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });
  return { now };
}
