<!-- VOption.vue - виправлена реактивна версія -->
<script lang="ts" setup>
  import { computed, inject, onBeforeUnmount, onMounted, useSlots, watch } from 'vue';
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

  // ВИПРАВЛЕННЯ 1: Створюємо реактивний об'єкт опції
  const option = computed(() => ({
    label: props.label,
    value: props.value,
    disabled: props.disabled || false,
    group: props.group,
  }));

  // ВИПРАВЛЕННЯ 2: Функція для реєстрації з правильною передачею слотів
  const registerCurrentOption = () => {
    if (selectContext) {
      // Правильно передаємо слот контент як функцію
      const slotContent = slots.default ? () => slots.default!() : null;
      selectContext.registerOption(option.value, slotContent);
      console.log('VOption registered:', option.value.label); // Для дебагу
    }
  };

  // ВИПРАВЛЕННЯ 3: Функція для видалення реєстрації
  const unregisterCurrentOption = () => {
    if (selectContext) {
      selectContext.unregisterOption(props.value);
      console.log('VOption unregistered:', props.value); // Для дебагу
    }
  };

  // ВИПРАВЛЕННЯ 4: Watcher для оновлення опції при зміні пропсів
  watch(
    option,
    (newOption, oldOption) => {
      if (selectContext && oldOption) {
        // Перереєструємо опцію при зміні
        const slotContent = slots.default ? () => slots.default!() : null;
        selectContext.registerOption(newOption, slotContent);
        console.log('VOption updated:', newOption.label); // Для дебагу
      }
    },
    { deep: true }
  );

  // ВИПРАВЛЕННЯ 5: Watcher для слотів
  watch(
    () => slots.default,
    () => {
      // Перереєструємо при зміні слотів
      registerCurrentOption();
    }
  );

  // Реєструємо опцію при монтуванні
  onMounted(() => {
    registerCurrentOption();
  });

  // Видаляємо опцію при демонтуванні
  onBeforeUnmount(() => {
    unregisterCurrentOption();
  });
</script>

<template>
  <!-- VOption тепер тільки реєструється, але не рендериться -->
  <!-- Рендеринг відбувається в VtSelect через v-for -->
  <div style="display: none" aria-hidden="true">
    <slot />
  </div>
</template>
