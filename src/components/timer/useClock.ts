// composables/useClock.ts
import { onMounted, onUnmounted, ref } from 'vue';

let subscribers = 0;
const now = ref(Date.now());
let intervalId: ReturnType<typeof setInterval> | null = null;

// Браузер пригальмовує setInterval у фонових вкладках, тож при поверненні на вкладку оновлюємо час одразу
const tick = () => {
  now.value = Date.now();
};

export function useClock() {
  onMounted(() => {
    subscribers++;
    if (!intervalId) {
      // now міг "застигнути", поки не було підписників — синхронізуємо одразу
      now.value = Date.now();
      intervalId = setInterval(tick, 1000);
      document.addEventListener('visibilitychange', tick);
    }
  });
  onUnmounted(() => {
    subscribers--;
    if (subscribers === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      document.removeEventListener('visibilitychange', tick);
    }
  });
  return { now };
}
