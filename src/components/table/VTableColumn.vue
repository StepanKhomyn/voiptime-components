<script lang="ts" setup>
  import { getCurrentInstance, inject, onBeforeMount, onUnmounted, type Slots, useSlots, watch } from 'vue';
  import type { VTableColumnProps } from './types';

  const props = withDefaults(defineProps<VTableColumnProps>(), {
    sortable: true,
    actionColumn: true,
    showOverflowTooltip: true,
    selectable: true,
    pinnedLeft: false,
    pinnedRight: false,
  });

  // Отримуємо слоти
  const slots = useSlots() as Slots & Record<string, any>;

  // Отримуємо масив колонок від батьківської таблиці
  const columns = inject<VTableColumnProps[]>('vt-table-columns');
  // Отримуємо функцію регістрації колонки з порядком
  const registerColumn = inject<(column: VTableColumnProps, instance: any) => void>('vt-register-column');
  const unregisterColumn = inject<(prop: string) => void>('vt-unregister-column');

  if (!columns || !registerColumn || !unregisterColumn) {
    console.error(
      'VTableColumn: не знайдено контекст таблиці. Переконайтеся, що компонент використовується всередині VTable.'
    );
  }

  const instance = getCurrentInstance();

  // Створюємо об'єкт колонки
  const createColumn = (): VTableColumnProps => ({
    prop: props.prop,
    label: props.label,
    width: props.width,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    sortable: props.sortable,
    pinnedLeft: props.pinnedLeft,
    pinnedRight: props.pinnedRight,
    actionColumn: props.actionColumn,
    showOverflowTooltip: props.showOverflowTooltip,
    selectable: props.selectable,
    // Зберігаємо слот - пріоритет: назва колонки -> default -> slot
    renderSlot: slots[props.prop] ?? slots.default ?? slots.slot,
  });

  // Реєструємо колонку при монтуванні
  onBeforeMount(() => {
    if (registerColumn && instance) {
      const column = createColumn();
      registerColumn(column, instance);
    }
  });

  // Спостерігаємо за змінами пропсів і оновлюємо колонку
  watch(
    () => [
      props.width,
      props.minWidth,
      props.maxWidth,
      props.sortable,
      props.pinnedLeft,
      props.pinnedRight,
      props.actionColumn,
      props.showOverflowTooltip,
      props.selectable,
      props.label,
    ],
    () => {
      if (registerColumn && instance) {
        const updatedColumn = createColumn();
        registerColumn(updatedColumn, instance);
      }
    },
    { deep: true }
  );

  // Видаляємо колонку при демонтуванні
  onUnmounted(() => {
    if (unregisterColumn) {
      unregisterColumn(props.prop);
    }
  });
</script>

<template>
  <!-- Цей компонент не рендерить нічого, він тільки реєструє колонку -->
</template>
