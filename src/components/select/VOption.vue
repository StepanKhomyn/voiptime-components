// VOption.vue - виправлена версія
<script lang="ts" setup>
  import { computed, inject, onBeforeUnmount, onMounted, useSlots } from 'vue';
  import type { VtOptionEmits, VtSelectContext, VtSelectOption } from './types';
  import { VtSelectContextKey } from './types';

  // Пропси
  const props = defineProps<VtSelectOption>();

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
  }));

  // Реєструємо опцію при монтуванні
  onMounted(() => {
    if (selectContext) {
      // ВИПРАВЛЕННЯ: правильно передаємо слот контент
      const slotContent = slots.default ? () => slots.default!() : null;
      selectContext.registerOption(option.value, slotContent);
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
