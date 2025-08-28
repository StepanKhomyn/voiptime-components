<script lang="ts" setup>
  import { computed, inject, onBeforeUnmount, onMounted, useSlots } from 'vue';
  import type { VtOptionEmits, VtOptionProps, VtSelectContext } from './types';
  import { VtSelectContextKey } from './types';

  // Пропси
  const props = defineProps<VtOptionProps>();

  // Емітери
  const emit = defineEmits<VtOptionEmits>();

  // Слоти
  const slots = useSlots();

  // Інжектимо контекст від батьківського Select
  const selectContext = inject<VtSelectContext>(VtSelectContextKey);

  if (!selectContext) {
    console.warn('VOption повинен використовуватися всередині VSelect');
  }

  // Створюємо об'єкт опції
  const option = computed(() => ({
    label: props.label,
    value: props.value,
    disabled: props.disabled || false,
    group: props.group,
  }));

  // Реєструємо опцію при монтуванні
  onMounted(() => {
    if (selectContext) {
      // Передаємо слот якщо є
      const slotContent = slots.default;
      selectContext.registerOption(option.value);
    }
  });

  // Видаляємо опцію при демонтуванні
  onBeforeUnmount(() => {
    if (selectContext) {
      selectContext.unregisterOption(props.value);
    }
  });
</script>

<template>
  <!-- VOption тепер тільки реєструється, але не рендериться -->
  <!-- Рендеринг відбувається в VtSelect через v-for -->
  <div style="display: none">
    <slot />
  </div>
</template>
