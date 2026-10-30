<script lang="ts" setup>
  import type { StyleValue } from 'vue';
  import type { VTableColumnProps } from './types';
  import type { useRowDrag } from './functions/useRowDrag';
  import VIcon from '@/components/icon/VIcon.vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';

  /**
   * Рядок таблиці — окремий компонент, щоб при зміні даних перемальовувався лише рядок,
   * що змінився, а не вся таблиця.
   *
   * Важливо: усі пропи мають бути примітивами або стабільними посиланнями (функції з setup VTable,
   * computed-масиви). Новий об'єкт/функція на кожен рендер VTable змусить перемальовуватись усі рядки.
   */
  interface Props {
    row: Record<string, any>;
    rowIndex: number;
    columns: VTableColumnProps[];
    /** Стилі клітинок по індексу колонки (не залежать від рядка) */
    cellStyles: StyleValue[];
    selectable: boolean;
    rowDraggable: boolean;
    showDragHandle: boolean;
    selected: boolean;
    current: boolean;
    clickable: boolean;
    insertBefore: boolean;
    insertAfter: boolean;
    selectionColumnStyle: StyleValue;
    dragHandleColumnStyle: StyleValue;
    dragComposable: ReturnType<typeof useRowDrag> | null;
    getRowHighlightClasses: (row: any, rowIndex: number) => string[];
    getTooltipText: (row: any, col: VTableColumnProps) => string;
    onRowClick: (row: Record<string, any>, column: VTableColumnProps, event: Event) => void;
    onRowDblClick: (row: Record<string, any>, column: VTableColumnProps, event: Event) => void;
    onCheckboxChange: (isChecked: boolean, row: Record<string, any>, event: Event) => void;
    onResizerMouseDown: (event: MouseEvent, col: VTableColumnProps) => void;
  }

  defineProps<Props>();
</script>

<template>
  <tr
    :class="{
      'vt-table__row--insert-before': insertBefore,
    }"
  ></tr>
  <tr
    :class="[
      'vt-table__row',
      {
        'vt-table__row--selected': selected,
        'vt-table__row--current': current,
        'vt-table__row--clickable': clickable,
        'vt-table__row--draggable': rowDraggable,
      },
      ...getRowHighlightClasses(row, rowIndex),
    ]"
    :draggable="rowDraggable"
    @click="onRowClick(row, columns[0], $event)"
    @dblclick="onRowDblClick(row, columns[0], $event)"
    @dragend="dragComposable ? dragComposable.handleDragEnd($event) : null"
    @dragenter="dragComposable ? dragComposable.handleDragEnter($event, rowIndex) : null"
    @dragleave="dragComposable ? dragComposable.handleDragLeave($event) : null"
    @dragover="dragComposable ? dragComposable.handleDragOver($event, rowIndex) : null"
    @dragstart="dragComposable ? dragComposable.handleDragStart($event, row, rowIndex) : null"
    @drop="dragComposable ? dragComposable.handleDrop($event, rowIndex) : null"
  >
    <td
      v-if="selectable"
      :class="{
        'vt-table__td--pinned-left': true,
      }"
      :style="selectionColumnStyle"
      class="vt-table__td vt-table__td--selection"
    >
      <div class="vt-table__cell-content vt-table__cell-content--selection">
        <VCheckbox
          :checked="selected"
          @change="(isChecked: boolean, event: Event) => onCheckboxChange(isChecked, row, event)"
        />
      </div>
    </td>

    <td
      v-if="rowDraggable && showDragHandle"
      :class="{
        'vt-table__td--pinned-left': true,
      }"
      :style="dragHandleColumnStyle"
      class="vt-table__td vt-table__td--drag-handle"
    >
      <div class="vt-table__cell-content vt-table__drag-handle">
        <VIcon name="table_columns_move" />
      </div>
    </td>

    <td
      v-for="(col, colIndex) in columns"
      :key="col.prop"
      :class="[
        'vt-table__td',
        {
          'vt-table__td--pinned-left': col.pinnedLeft,
          'vt-table__td--pinned-right': col.pinnedRight,
          'vt-table__td--manage': col.manage,
        },
      ]"
      :style="cellStyles[colIndex]"
    >
      <div
        v-tooltip="col.showOverflowTooltip ? getTooltipText(row, col) : null"
        class="vt-table__cell-content vt-table__cell-content--ellipsis"
      >
        <component
          :is="col.renderSlot"
          v-if="col.renderSlot"
          :column="col"
          :index="rowIndex"
          :row="row"
          :value="row[col.prop]"
        />
        <span v-else>{{ row[col.prop] }}</span>
      </div>
      <div
        v-if="!col.manage"
        :data-resizer="col.prop"
        class="vt-table__resizer"
        @mousedown="e => onResizerMouseDown(e, col)"
      />
    </td>
  </tr>
  <tr
    :class="{
      'vt-table__row--insert-after': insertAfter,
    }"
  ></tr>
</template>
