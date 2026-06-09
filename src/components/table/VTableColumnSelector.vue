<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import type { VTableColumnGroup, VTableColumnProps } from '@/components/table/types';
  import VIcon from '@/components/icon/VIcon.vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';
  import VButton from '@/components/button/VButton.vue';
  import { modalManager } from '@/components/modal/plugin';
  import { useI18n } from '@/locales/useI18n';
  import { LOCALE_KEYS } from '@/locales/types';

  interface WorkingColumn extends VTableColumnProps {
    _visible: boolean;
  }

  interface Props {
    columns: VTableColumnProps[];
    defaultColumns?: VTableColumnProps[];
    columnsSelector?: VTableColumnGroup[];
  }

  const props = withDefaults(defineProps<Props>(), {
    columnsSelector: () => [],
    defaultColumns: () => [],
  });

  const emit = defineEmits<{
    'update-columns': [columns: VTableColumnProps[]];
  }>();

  const { t } = useI18n();

  // ─── Core state ───────────────────────────────────────────────────────────
  // workingColumns містить ВСІ колонки (активні + неактивні) з флагом _visible
  const workingColumns = ref<WorkingColumn[]>([]);
  const expandedGroups = ref<Set<string>>(new Set());

  // ─── Drag & drop state ────────────────────────────────────────────────────
  const draggedIndex = ref<number>(-1);
  const targetIndex = ref<number>(-1);
  const dropPosition = ref<'before' | 'after'>('before');

  // ─── Derived lists ────────────────────────────────────────────────────────

  /** Колонки які зараз активні (показуються в таблиці) */
  const activeColumns = computed(() => workingColumns.value.filter(col => col._visible));

  /** Колонки які зараз неактивні */
  const inactiveColumns = computed(() => workingColumns.value.filter(col => !col._visible));

  /** Тільки активні колонки для лівої панелі drag & drop (індекси відносно activeColumns) */
  const activeColumnsForDrag = computed(() => activeColumns.value);

  // ─── Group logic ──────────────────────────────────────────────────────────

  const regularGroups = computed(() => props.columnsSelector.filter(g => g.name !== 'removed'));

  const groupStatuses = computed(() => {
    const statuses: Record<string, { checked: boolean; indeterminate: boolean }> = {};

    regularGroups.value.forEach(group => {
      const groupProps = new Set(group.columns.map(c => c.prop));
      const visibleCount = workingColumns.value.filter(c => groupProps.has(c.prop) && c._visible).length;
      const total = group.columns.length;

      if (visibleCount === 0) {
        statuses[group.name] = { checked: false, indeterminate: false };
      } else if (visibleCount === total) {
        statuses[group.name] = { checked: true, indeterminate: false };
      } else {
        statuses[group.name] = { checked: false, indeterminate: true };
      }
    });

    return statuses;
  });

  // ─── Pinned helpers ───────────────────────────────────────────────────────

  const isPinned = (column: VTableColumnProps) => !!(column.pinnedLeft || column.pinnedRight);
  const canDragColumn = (column: VTableColumnProps) => !isPinned(column);

  // ─── Initialization ───────────────────────────────────────────────────────

  const initializeWorkingCopies = () => {
    // Активні prop'и (ті що зараз в таблиці)
    const activePropSet = new Set(props.columns.map(c => c.prop));

    // Збираємо всі унікальні колонки: спочатку з columnsSelector (для порядку в правій панелі),
    // потім з defaultColumns, потім з поточних активних
    const allColumnsMap = new Map<string, VTableColumnProps>();

    // 1. Поточні активні — вони мають найактуальніший стан (width, pinned тощо)
    props.columns.forEach(col => allColumnsMap.set(col.prop, col));

    // 2. Default columns — для тих що були видалені
    props.defaultColumns.forEach(col => {
      if (!allColumnsMap.has(col.prop)) {
        allColumnsMap.set(col.prop, col);
      }
    });

    // 3. columnsSelector — для тих що є в групах але не в defaultColumns
    props.columnsSelector.forEach(group => {
      group.columns.forEach(col => {
        if (!allColumnsMap.has(col.prop)) {
          allColumnsMap.set(col.prop, col);
        }
      });
    });

    // Будуємо workingColumns: спочатку активні (зберігаємо порядок), потім неактивні
    const active: WorkingColumn[] = props.columns.map(col => ({
      ...allColumnsMap.get(col.prop)!,
      _visible: true,
    }));

    const inactive: WorkingColumn[] = [];
    allColumnsMap.forEach((col, prop) => {
      if (!activePropSet.has(prop)) {
        inactive.push({ ...col, _visible: false });
      }
    });

    workingColumns.value = [...active, ...inactive];

    // Розгортаємо всі групи за замовчуванням
    regularGroups.value.forEach(group => expandedGroups.value.add(group.name));
  };

  // ─── Toggle single column ─────────────────────────────────────────────────

  const handleColumnToggle = (column: VTableColumnProps, isChecked: boolean) => {
    // Закріплені колонки не можна знімати
    if (isPinned(column) && !isChecked) return;

    const idx = workingColumns.value.findIndex(c => c.prop === column.prop);
    if (idx === -1) return;

    if (isChecked) {
      // Вмикаємо: переміщуємо колонку в кінець активних
      const col = workingColumns.value[idx];
      const withoutCol = workingColumns.value.filter((_, i) => i !== idx);

      // Знаходимо позицію після останньої активної
      const lastActiveIdx = withoutCol.reduce((last, c, i) => (c._visible ? i : last), -1);

      const result = [...withoutCol];
      result.splice(lastActiveIdx + 1, 0, { ...col, _visible: true });
      workingColumns.value = result;
    } else {
      // Вимикаємо: переміщуємо колонку після всіх активних (в зону неактивних)
      const col = workingColumns.value[idx];
      const withoutCol = workingColumns.value.filter((_, i) => i !== idx);

      // Знаходимо позицію після останньої активної
      const lastActiveIdx = withoutCol.reduce((last, c, i) => (c._visible ? i : last), -1);

      const result = [...withoutCol];
      result.splice(lastActiveIdx + 1, 0, { ...col, _visible: false });
      workingColumns.value = result;
    }
  };

  // ─── Toggle group ─────────────────────────────────────────────────────────

  const handleGroupToggle = (group: VTableColumnGroup, isChecked: boolean) => {
    const groupProps = new Set(group.columns.map(c => c.prop));

    if (isChecked) {
      // Вмикаємо всі невидимі колонки групи
      const lastActiveIdx = workingColumns.value.reduce((last, c, i) => (c._visible ? i : last), -1);

      let insertOffset = 0;
      workingColumns.value.forEach((col, i) => {
        if (groupProps.has(col.prop) && !col._visible) {
          const currentIdx = workingColumns.value.findIndex(c => c.prop === col.prop);
          const withoutCol = workingColumns.value.filter(c => c.prop !== col.prop);
          const insertAt = Math.min(lastActiveIdx + insertOffset + 1, withoutCol.length);
          withoutCol.splice(insertAt, 0, { ...col, _visible: true });
          workingColumns.value = withoutCol;
          insertOffset++;
        }
      });
    } else {
      // Вимикаємо всі незакріплені активні колонки групи
      workingColumns.value = workingColumns.value.map(col => {
        if (groupProps.has(col.prop) && col._visible && !isPinned(col)) {
          return { ...col, _visible: false };
        }
        return col;
      });

      // Сортуємо: активні спочатку, неактивні після
      const active = workingColumns.value.filter(c => c._visible);
      const inactive = workingColumns.value.filter(c => !c._visible);
      workingColumns.value = [...active, ...inactive];
    }
  };

  // ─── Group collapse ───────────────────────────────────────────────────────

  const toggleGroup = (groupName: string) => {
    if (expandedGroups.value.has(groupName)) {
      expandedGroups.value.delete(groupName);
    } else {
      expandedGroups.value.add(groupName);
    }
  };

  // ─── Drag & drop (тільки для активних колонок) ────────────────────────────

  const getDragBounds = () => {
    const active = activeColumns.value;
    let lastPinnedLeftIndex = -1;
    let firstPinnedRightIndex = active.length;

    for (let i = 0; i < active.length; i++) {
      if (active[i].pinnedLeft) lastPinnedLeftIndex = i;
    }
    for (let i = 0; i < active.length; i++) {
      if (active[i].pinnedRight) {
        firstPinnedRightIndex = i;
        break;
      }
    }

    return { minIndex: lastPinnedLeftIndex + 1, maxIndex: firstPinnedRightIndex - 1 };
  };

  const canDropAtPosition = (insertIndex: number) => {
    const { minIndex, maxIndex } = getDragBounds();
    return insertIndex >= minIndex && insertIndex <= maxIndex + 1;
  };

  const handleDragStart = (event: DragEvent, activeIndex: number) => {
    const column = activeColumns.value[activeIndex];
    if (!canDragColumn(column)) {
      event.preventDefault();
      return;
    }
    draggedIndex.value = activeIndex;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', column.prop);
    }
    document.body.style.cursor = 'grabbing';
  };

  const handleDragOver = (event: DragEvent, activeIndex: number) => {
    if (draggedIndex.value === -1) return;
    event.preventDefault();

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseY = event.clientY;
    const elementMiddle = rect.top + rect.height / 2;

    let insertIndex = activeIndex;
    let position: 'before' | 'after' = 'before';

    if (mouseY < elementMiddle) {
      insertIndex = activeIndex;
      position = 'before';
    } else {
      insertIndex = activeIndex + 1;
      position = 'after';
    }

    if (draggedIndex.value < insertIndex) insertIndex--;

    if (canDropAtPosition(insertIndex)) {
      targetIndex.value = activeIndex;
      dropPosition.value = position;
      event.dataTransfer!.dropEffect = 'move';
    } else {
      targetIndex.value = -1;
      event.dataTransfer!.dropEffect = 'none';
    }
  };

  const handleDragLeave = () => {
    setTimeout(() => {
      if (draggedIndex.value === -1) targetIndex.value = -1;
    }, 50);
  };

  const handleDrop = (event: DragEvent, activeIndex: number) => {
    event.preventDefault();

    if (draggedIndex.value === -1 || targetIndex.value === -1) {
      resetDragState();
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseY = event.clientY;
    const elementMiddle = rect.top + rect.height / 2;

    let insertIndex = activeIndex;
    if (mouseY >= elementMiddle) insertIndex = activeIndex + 1;
    if (draggedIndex.value < insertIndex) insertIndex--;

    if (!canDropAtPosition(insertIndex) || insertIndex === draggedIndex.value) {
      resetDragState();
      return;
    }

    // Переміщуємо в межах activeColumns, потім складаємо назад з inactive
    const active = [...activeColumns.value];
    const [movedCol] = active.splice(draggedIndex.value, 1);
    active.splice(insertIndex, 0, movedCol);

    const inactive = workingColumns.value.filter(c => !c._visible);
    workingColumns.value = [...active, ...inactive];

    resetDragState();
  };

  const handleDragEnd = () => resetDragState();

  const resetDragState = () => {
    draggedIndex.value = -1;
    targetIndex.value = -1;
    dropPosition.value = 'before';
    document.body.style.cursor = '';
  };

  const getItemClasses = (index: number) => {
    const classes = ['vt-columns-selector__panel-item'];
    if (draggedIndex.value === index) classes.push('vt-columns-selector__panel-item--dragging');
    if (targetIndex.value === index && dropPosition.value === 'before')
      classes.push('vt-columns-selector__panel-item--drop-before');
    if (targetIndex.value === index && dropPosition.value === 'after')
      classes.push('vt-columns-selector__panel-item--drop-after');
    return classes;
  };

  // ─── isColumnSelected для груп ────────────────────────────────────────────

  const isColumnSelected = (column: VTableColumnProps) => {
    const wc = workingColumns.value.find(c => c.prop === column.prop);
    return wc?._visible ?? false;
  };

  const canToggleColumn = (column: VTableColumnProps) => {
    const wc = workingColumns.value.find(c => c.prop === column.prop);
    return !wc || !isPinned(wc);
  };

  // ─── Save / Cancel / Reset ────────────────────────────────────────────────

  const handleSave = () => {
    // Емітимо тільки видимі колонки (без службового флагу _visible)
    const result = activeColumns.value.map(({ _visible, ...col }) => col as VTableColumnProps);
    emit('update-columns', result);
    modalManager.close();
  };

  const resetColumnsToDefault = () => {
    const defaultPropSet = new Set(props.defaultColumns.map(c => c.prop));

    workingColumns.value = workingColumns.value.map(col => ({
      ...col,
      _visible: defaultPropSet.has(col.prop),
    }));

    // Відновлюємо порядок: за defaultColumns спочатку, решта після
    const defaultOrder = new Map(props.defaultColumns.map((c, i) => [c.prop, i]));
    const active = workingColumns.value
      .filter(c => c._visible)
      .sort((a, b) => (defaultOrder.get(a.prop) ?? 999) - (defaultOrder.get(b.prop) ?? 999));
    const inactive = workingColumns.value.filter(c => !c._visible);

    workingColumns.value = [...active, ...inactive];
  };

  const handleCancel = () => modalManager.close();

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  onMounted(() => initializeWorkingCopies());
</script>

<template>
  <div class="vt-columns-selector-body">
    <div class="vt-columns-selector">
      <!-- ── Ліва панель: активні колонки ──────────────────────────────── -->
      <div class="vt-columns-selector__panel">
        <div
          v-for="(col, index) in activeColumnsForDrag"
          :key="'active-' + col.prop"
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

      <!-- ── Права панель: згруповані або flat ─────────────────────────── -->

      <!-- Без груп — проста flat-панель -->
      <div v-if="!regularGroups.length" class="vt-columns-selector__panel">
        <div v-for="col in inactiveColumns" :key="'inactive-' + col.prop" class="vt-columns-selector__panel-item">
          <VCheckbox
            :checked="false"
            :disabled="isPinned(col)"
            :label="col.label"
            @change="checked => handleColumnToggle(col, checked)"
            @click.stop
          />
          <span v-if="isPinned(col)" class="vt-columns-selector__panel-item-pinned">pinned</span>
        </div>
      </div>

      <!-- З групами -->
      <div v-else class="vt-columns-selector__available">
        <div v-for="group in regularGroups" :key="group.name" class="vt-columns-selector__group">
          <div
            :class="{ 'vt-columns-selector__group-header--expanded': expandedGroups.has(group.name) }"
            class="vt-columns-selector__group-header"
            @click="toggleGroup(group.name)"
          >
            <VCheckbox
              :checked="groupStatuses[group.name]?.checked || false"
              :indeterminate="groupStatuses[group.name]?.indeterminate || false"
              :label="group.label"
              @change="checked => handleGroupToggle(group, checked)"
              @click.stop
            />
            <VIcon v-if="group.icon" :name="group.icon" class="vt-columns-selector__group-icon" />

            <VIcon class="vt-columns-selector__group-toggle" name="arrowDown" />
          </div>

          <div
            :class="{ 'vt-columns-selector__group-transition--expanded': expandedGroups.has(group.name) }"
            class="vt-columns-selector__group-transition"
          >
            <div class="vt-columns-selector__group-columns">
              <div v-for="col in group.columns" :key="col.prop" class="vt-columns-selector__group-column">
                <VCheckbox
                  :checked="isColumnSelected(col)"
                  :disabled="!canToggleColumn(col)"
                  :label="col.label"
                  @change="checked => handleColumnToggle(col, checked)"
                />
                <span v-if="!canToggleColumn(col)" class="vt-columns-selector__pinned-note">
                  {{ t(LOCALE_KEYS.TABLE_PINNED) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Кнопки ─────────────────────────────────────────────────────── -->
    <div class="vt-modal__content-button">
      <VButton @click="handleCancel">{{ t(LOCALE_KEYS.BUTTON_CANCEL) }}</VButton>
      <VButton icon="save" type="primary" @click="handleSave">{{ t(LOCALE_KEYS.BUTTON_SAVE) }}</VButton>
      <VButton icon="arrowReload" shape="circle" tooltip tooltipPlacement="right" @click="resetColumnsToDefault">
        {{ t(LOCALE_KEYS.BUTTON_RESET) }}
      </VButton>
    </div>
  </div>
</template>
