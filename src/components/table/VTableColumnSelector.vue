<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import type { VTableColumnGroup, VTableColumnProps } from '@/components/table/types';
  import VIcon from '@/components/icon/VIcon.vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';
  import VButton from '@/components/button/VButton.vue';
  import { modalManager } from '@/components/modal/plugin';

  interface Props {
    columns: VTableColumnProps[];
    columnsSelector?: VTableColumnGroup[];
  }

  const props = withDefaults(defineProps<Props>(), {
    columnsSelector: () => [],
  });

  const emit = defineEmits<{
    'update-columns': [columns: VTableColumnProps[]];
  }>();

  // Стан компонента
  const workingColumns = ref<VTableColumnProps[]>([]);
  const expandedGroups = ref<Set<string>>(new Set());

  // Стан для drag & drop
  const draggedIndex = ref<number>(-1);
  const targetIndex = ref<number>(-1);
  const dropPosition = ref<'before' | 'after'>('before');

  // Обчислені властивості для статусу груп
  const groupStatuses = computed(() => {
    const statuses: Record<string, { checked: boolean; indeterminate: boolean }> = {};

    props.columnsSelector.forEach(group => {
      if (group.name === 'removed') {
        return;
      }

      const groupColumnProps = group.columns.map((col: VTableColumnProps) => col.prop);
      const selectedGroupColumns = workingColumns.value.filter(col => groupColumnProps.includes(col.prop));

      if (selectedGroupColumns.length === 0) {
        statuses[group.name] = { checked: false, indeterminate: false };
      } else if (selectedGroupColumns.length === group.columns.length) {
        statuses[group.name] = { checked: true, indeterminate: false };
      } else {
        statuses[group.name] = { checked: false, indeterminate: true };
      }
    });

    return statuses;
  });

  const regularGroups = computed(() => {
    return props.columnsSelector.filter(group => group.name !== 'removed');
  });

  // Перевірка чи колонка закріплена
  const isPinned = (column: VTableColumnProps) => column.pinnedLeft || column.pinnedRight;

  // Перевірка чи можна перетягувати колонку
  const canDragColumn = (column: VTableColumnProps) => !isPinned(column);

  // Знаходимо межі для переміщення
  const getDragBounds = () => {
    const columns = workingColumns.value;

    let lastPinnedLeftIndex = -1;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].pinnedLeft) {
        lastPinnedLeftIndex = i;
      }
    }

    let firstPinnedRightIndex = columns.length;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].pinnedRight) {
        firstPinnedRightIndex = i;
        break;
      }
    }

    return {
      minIndex: lastPinnedLeftIndex + 1,
      maxIndex: firstPinnedRightIndex - 1,
    };
  };

  // Перевірка чи можна вставити колонку в позицію
  const canDropAtPosition = (insertIndex: number) => {
    const bounds = getDragBounds();

    // Перевіряємо чи позиція в межах дозволеного діапазону
    if (insertIndex < bounds.minIndex || insertIndex > bounds.maxIndex + 1) {
      return false;
    }

    return true;
  };

  // Обробники drag & drop
  const handleDragStart = (event: DragEvent, index: number) => {
    const column = workingColumns.value[index];
    if (!canDragColumn(column)) {
      event.preventDefault();
      return;
    }

    draggedIndex.value = index;

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', column.prop);
    }

    document.body.style.cursor = 'grabbing';
  };

  const handleDragOver = (event: DragEvent, index: number) => {
    if (draggedIndex.value === -1) return;

    event.preventDefault();

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseY = event.clientY;
    const elementMiddle = rect.top + rect.height / 2;

    let insertIndex = index;
    let position: 'before' | 'after' = 'before';

    if (mouseY < elementMiddle) {
      insertIndex = index;
      position = 'before';
    } else {
      insertIndex = index + 1;
      position = 'after';
    }

    // Коригуємо індекс якщо тягнемо вниз
    if (draggedIndex.value < insertIndex) {
      insertIndex--;
    }

    if (canDropAtPosition(insertIndex)) {
      targetIndex.value = index;
      dropPosition.value = position;
      event.dataTransfer!.dropEffect = 'move';
    } else {
      targetIndex.value = -1;
      event.dataTransfer!.dropEffect = 'none';
    }
  };

  const handleDragLeave = () => {
    // Не скидаємо одразу, дамо трохи часу для переходу на сусідній елемент
    setTimeout(() => {
      if (draggedIndex.value === -1) {
        targetIndex.value = -1;
      }
    }, 50);
  };

  const handleDrop = (event: DragEvent, index: number) => {
    event.preventDefault();

    if (draggedIndex.value === -1 || targetIndex.value === -1) {
      resetDragState();
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseY = event.clientY;
    const elementMiddle = rect.top + rect.height / 2;

    let insertIndex = index;
    if (mouseY >= elementMiddle) {
      insertIndex = index + 1;
    }

    // Коригуємо індекс
    if (draggedIndex.value < insertIndex) {
      insertIndex--;
    }

    if (!canDropAtPosition(insertIndex) || insertIndex === draggedIndex.value) {
      resetDragState();
      return;
    }

    // Виконуємо переміщення
    const newColumns = [...workingColumns.value];
    const [movedColumn] = newColumns.splice(draggedIndex.value, 1);
    newColumns.splice(insertIndex, 0, movedColumn);

    workingColumns.value = newColumns;
    resetDragState();
  };

  const handleDragEnd = () => {
    resetDragState();
  };

  const resetDragState = () => {
    draggedIndex.value = -1;
    targetIndex.value = -1;
    dropPosition.value = 'before';
    document.body.style.cursor = '';
  };

  // CSS класи для візуального фідбеку
  const getItemClasses = (index: number) => {
    const classes = ['vt-columns-selector__panel-item'];

    if (draggedIndex.value === index) {
      classes.push('vt-columns-selector__panel-item--dragging');
    }

    if (targetIndex.value === index && dropPosition.value === 'before') {
      classes.push('vt-columns-selector__panel-item--drop-before');
    }

    if (targetIndex.value === index && dropPosition.value === 'after') {
      classes.push('vt-columns-selector__panel-item--drop-after');
    }

    return classes;
  };

  // Ініціалізація робочих копій
  const initializeWorkingCopies = () => {
    workingColumns.value = [...props.columns.map(col => ({ ...col }))];

    props.columnsSelector.forEach(group => {
      if (group.name !== 'removed') {
        expandedGroups.value.add(group.name);
      }
    });
  };

  // Обробка зміни стану окремої колонки
  const handleColumnToggle = (column: VTableColumnProps, isChecked: boolean) => {
    if (isChecked) {
      if (!workingColumns.value.some((col: VTableColumnProps) => col.prop === column.prop)) {
        workingColumns.value.push({ ...column });
      }
    } else {
      if (isPinned(column)) {
        return;
      }
      workingColumns.value = workingColumns.value.filter((col: VTableColumnProps) => col.prop !== column.prop);
    }
  };

  // Обробка зміни стану групи
  const handleGroupToggle = (group: VTableColumnGroup, isChecked: boolean) => {
    if (isChecked) {
      group.columns.forEach(column => {
        if (!workingColumns.value.some((col: VTableColumnProps) => col.prop === column.prop)) {
          workingColumns.value.push({ ...column });
        }
      });
    } else {
      const columnsToRemove: VTableColumnProps[] = [];

      group.columns.forEach(column => {
        const workingColumn = workingColumns.value.find((col: VTableColumnProps) => col.prop === column.prop);
        if (workingColumn && !isPinned(workingColumn)) {
          columnsToRemove.push(workingColumn);
        }
      });

      workingColumns.value = workingColumns.value.filter(
        (col: VTableColumnProps) => !columnsToRemove.some(removeCol => removeCol.prop === col.prop)
      );
    }
  };

  // Перевірка чи колонка вибрана
  const isColumnSelected = (column: VTableColumnProps) => {
    return workingColumns.value.some((col: VTableColumnProps) => col.prop === column.prop);
  };

  // Перевірка чи можна змінити стан колонки
  const canToggleColumn = (column: VTableColumnProps) => {
    const workingColumn = workingColumns.value.find((col: VTableColumnProps) => col.prop === column.prop);
    return !workingColumn || !isPinned(workingColumn);
  };

  // Розгортання/згортання групи
  const toggleGroup = (groupName: string) => {
    if (expandedGroups.value.has(groupName)) {
      expandedGroups.value.delete(groupName);
    } else {
      expandedGroups.value.add(groupName);
    }
  };

  // Обробники подій
  const handleSave = () => {
    emit('update-columns', [...workingColumns.value]);
    modalManager.close();
  };

  const handleCancel = () => {
    modalManager.close();
  };

  // Ініціалізація при монтуванні
  onMounted(() => {
    initializeWorkingCopies();
  });
</script>

<template>
  <div class="vt-columns-selector-body">
    <div class="vt-columns-selector">
      <!-- Вибрані колонки (зліва) -->
      <div class="vt-columns-selector__panel">
        <div
          v-for="(col, index) in workingColumns"
          :key="col.prop"
          :class="getItemClasses(index)"
          :draggable="canDragColumn(col)"
          @dragend="handleDragEnd"
          @dragleave="handleDragLeave"
          @dragover="handleDragOver($event, index)"
          @dragstart="handleDragStart($event, index)"
          @drop="handleDrop($event, index)"
        >
          <VIcon
            :class="{ 'vt-columns-selector__panel-item-icon--draggable': canDragColumn(col) }"
            :name="canDragColumn(col) ? 'columnsMove' : 'freeze'"
            class="vt-columns-selector__panel-item-icon"
          />
          <VCheckbox
            :checked="true"
            :disabled="isPinned(col)"
            :label="col.label"
            @change="checked => handleColumnToggle(col, checked)"
            @click.stop
          />
          <span v-if="isPinned(col)" class="vt-columns-selector__panel-item-pinned">pinned</span>
        </div>
      </div>

      <!-- Доступні колонки згруповані (справа) -->
      <div class="vt-columns-selector__available">
        <div v-for="group in regularGroups" :key="group.name" class="vt-columns-selector__group">
          <div class="vt-columns-selector__group-header" @click="toggleGroup(group.name)">
            <VCheckbox
              :checked="groupStatuses[group.name]?.checked || false"
              :indeterminate="groupStatuses[group.name]?.indeterminate || false"
              :label="group.label"
              @change="checked => handleGroupToggle(group, checked)"
              @click.stop
            />
            <VIcon v-if="group.icon" :name="group.icon" class="vt-columns-selector__group-icon" />
          </div>

          <div v-if="expandedGroups.has(group.name)" class="vt-columns-selector__group-columns">
            <div v-for="col in group.columns" :key="col.prop" class="vt-columns-selector__group-column">
              <VCheckbox
                :checked="isColumnSelected(col)"
                :disabled="!canToggleColumn(col)"
                :label="col.label"
                @change="checked => handleColumnToggle(col, checked)"
              />
              <span v-if="!canToggleColumn(col)" class="vt-columns-selector__pinned-note"> (закріплена) </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопки -->
    <div class="vt-modal__content-button">
      <VButton @click="handleCancel">Скасувати</VButton>
      <VButton icon="save" type="primary" @click="handleSave">Зберегти</VButton>
    </div>
  </div>
</template>
