<script lang="ts" setup>
  import { inject, nextTick, onMounted, onUnmounted, type Slots, useSlots, watch } from 'vue';
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

  if (!columns) {
    console.error(
      'VTableColumn: не знайдено контекст таблиці. Переконайтеся, що компонент використовується всередині VTable.'
    );
  }

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

  let columnIndex = -1;

  // Додаємо колонку до масиву при монтуванні
  onMounted(() => {
    console.log('ADD', props.prop);
    nextTick(() => {
      if (!columns) return;
      const newColumn = createColumn();
      const existingIndex = columns.findIndex(c => c.prop === props.prop && c.label === props.label);
      if (existingIndex !== -1) {
        // Оновлюємо існуючу
        columns[existingIndex] = { ...columns[existingIndex], ...newColumn };
      } else {
        console.log('ADD1', columns);
        columns.push(newColumn);
        console.log('ADD2', columns);
        columnIndex = columns.length - 1;
      }
    });
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
      if (columns && columnIndex !== -1) {
        // Знаходимо колонку за prop (більш надійно ніж за індексом)
        const existingColumnIndex = columns.findIndex(col => col.prop === props.prop);
        if (existingColumnIndex !== -1) {
          // Оновлюємо існуючу колонку зі збереженням renderSlot
          const existingColumn = columns[existingColumnIndex];
          const updatedColumn = {
            ...createColumn(),
            renderSlot: existingColumn.renderSlot, // Зберігаємо існуючий renderSlot
          };

          // Замінюємо колонку
          columns[existingColumnIndex] = updatedColumn;
        }
      }
    },
    { deep: true }
  );

  // Видаляємо колонку з масиву при демонтуванні
  onUnmounted(() => {
    console.log('DELETE', props.prop);
    console.log('DELETE', columns);
    if (columns) {
      const index = columns.findIndex(col => col.prop === props.prop);
      if (index > -1) {
        columns.splice(index, 1);
      }
    }
  });
</script>

<template>
  <!-- Цей компонент не рендерить нічого, він тільки реєструє колонку -->
</template>
