import { onBeforeUnmount, onMounted, type Ref } from 'vue';

export default function useDetectOutsideClick(
  component: Ref<HTMLElement | null>,
  callback: () => void,
  excludeRefs: Ref<HTMLElement | null>[] = [],
) {
  if (!component) return;

  const listener = (event: Event) => {
    const path = event.composedPath();

    if (event.target !== component.value && path.includes(component.value as EventTarget)) {
      return;
    }

    if (excludeRefs.some((ref) => ref.value && path.includes(ref.value as EventTarget))) {
      return;
    }

    if (typeof callback === 'function') {
      callback();
    }
  };

  onMounted(() => {
    window.addEventListener('click', listener);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', listener);
  });

  return { listener };
}