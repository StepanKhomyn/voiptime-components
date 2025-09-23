// composables.ts
import { computed, ref } from 'vue';
import type { ResizeState, StickyPosition, VTableColumnProps, VTableProps, VTableStyleConfig } from '../types';

/**
 * Композабл для роботи з колонками таблиці
 */
export function useTableColumns(columns: VTableColumnProps[]) {
  const sortedColumns = computed(() => {
    const left = columns.filter(c => c.pinnedLeft);
    const right = columns.filter(c => c.pinnedRight);
    const center = columns.filter(c => !c.pinnedLeft && !c.pinnedRight);

    return [...left, ...center, ...right];
  });

  const getDefaultColumnWidth = (): number => {
    const totalColumns = sortedColumns.value.length;
    const columnsWithFixedWidth = sortedColumns.value.filter(col => col.width || col.minWidth);
    const fixedWidth = columnsWithFixedWidth.reduce((sum, col) => sum + (col.width || col.minWidth || 0), 0);
    const flexibleColumns = totalColumns - columnsWithFixedWidth.length;

    if (flexibleColumns === 0) return 150;

    const assumedTableWidth = 800;
    const availableWidth = Math.max(assumedTableWidth - fixedWidth, flexibleColumns * 80);

    return Math.max(Math.floor(availableWidth / flexibleColumns), 120);
  };

  const getStickyOffset = (side: StickyPosition, index: number, hasSelectable: boolean = false): number => {
    const cols = sortedColumns.value;
    let offset = 0;

    if (side === 'left') {
      // Додаємо ширину колонки з чекбоксами для лівих pinned колонок
      if (hasSelectable) {
        offset += 50; // Ширина селекційної колонки
      }

      for (let i = 0; i < index; i++) {
        const c = cols[i];
        if (c.pinnedLeft) {
          offset += c.width || c.minWidth || getDefaultColumnWidth();
        }
      }
    } else {
      for (let i = cols.length - 1; i > index; i--) {
        const c = cols[i];
        if (c.pinnedRight) {
          offset += c.width || c.minWidth || getDefaultColumnWidth();
        }
      }
    }
    return offset;
  };

  return {
    sortedColumns,
    getDefaultColumnWidth,
    getStickyOffset,
  };
}

/**
 * Композабл для генерації стилів таблиці
 */
export function useTableStyles(props: VTableProps) {
  const getTableWrapperStyle = (): VTableStyleConfig => {
    const style: VTableStyleConfig = {};

    if (props.maxHeight) {
      style.maxHeight = `${props.maxHeight}px`;
    }

    return style;
  };

  const getColumnStyle = (
    col: VTableColumnProps,
    index: number,
    getStickyOffsetFn: (side: StickyPosition, index: number, hasSelectable?: boolean) => number,
    getDefaultColumnWidth: () => number
  ): VTableStyleConfig => {
    const style: VTableStyleConfig = {};

    // Ширина колонки
    if (col.width) {
      style.width = `${col.width}px`;
      style.minWidth = `${col.width}px`;
      style.maxWidth = `${col.width}px`;
    } else if (col.minWidth) {
      style.minWidth = `${col.minWidth}px`;
      style.width = `${col.minWidth}px`;
      style.maxWidth = 'none';
    } else {
      const defaultWidth = getDefaultColumnWidth();
      style.width = `${defaultWidth}px`;
      style.minWidth = '80px';
      style.maxWidth = 'none';
    }

    // Sticky позиціонування
    if (col.pinnedLeft) {
      style.position = 'sticky';
      style.left = `${getStickyOffsetFn('left', index, props.selectable)}px`;
      style.zIndex = '10';
    } else if (col.pinnedRight) {
      style.position = 'sticky';
      style.right = `${getStickyOffsetFn('right', index, false)}px`;
      style.zIndex = '10';
    }

    return style;
  };

  const getHeaderStyle = (
    col: VTableColumnProps,
    index: number,
    getStickyOffsetFn: (side: StickyPosition, index: number, hasSelectable?: boolean) => number,
    getDefaultColumnWidth: () => number
  ): VTableStyleConfig => {
    const style = getColumnStyle(col, index, getStickyOffsetFn, getDefaultColumnWidth);

    // Sticky header при maxHeight
    if (props.maxHeight) {
      style.position = 'sticky';
      style.top = '0';

      // Підвищуємо z-index для pinned колонок в header
      if (col.pinnedLeft || col.pinnedRight) {
        style.zIndex = '12';
      } else {
        style.zIndex = '11';
      }
    }

    return style;
  };

  const getFooterStyle = (
    col: VTableColumnProps,
    index: number,
    getStickyOffsetFn: (side: StickyPosition, index: number, hasSelectable?: boolean) => number,
    getDefaultColumnWidth: () => number
  ): VTableStyleConfig => {
    const style = getColumnStyle(col, index, getStickyOffsetFn, getDefaultColumnWidth);

    // Sticky footer при maxHeight
    if (props.maxHeight) {
      style.position = 'sticky';
      style.bottom = '0';

      // Підвищуємо z-index для pinned колонок в footer
      if (col.pinnedLeft || col.pinnedRight) {
        style.zIndex = '12';
      } else {
        style.zIndex = '11';
      }
    }

    return style;
  };

  return {
    getTableWrapperStyle,
    getColumnStyle,
    getHeaderStyle,
    getFooterStyle,
  };
}

/**
 * Композабл для ресайзу колонок
 */
export function useColumnResize() {
  const resizeState = ref<ResizeState>({
    resizingCol: null,
    startX: 0,
    startWidth: 0,
  });

  const RESIZE_CURSOR =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><path d='M5 13L2 10L5 7' stroke='%23828282' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><path d='M15 7L18 10L15 13' stroke='%23828282' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><path d='M10 3L10 17' stroke='%23828282' stroke-width='3' stroke-linecap='round'/></svg>\") 10 10, col-resize";

  const onMouseDown = (
    e: MouseEvent,
    col: VTableColumnProps,
    getDefaultColumnWidth: (prop: string) => number,
    callback?: (newWidth: number) => void // Додаємо callback параметр
  ) => {
    e.preventDefault();
    e.stopPropagation();

    resizeState.value.resizingCol = col;
    resizeState.value.startX = e.clientX;
    resizeState.value.startWidth = col.width || col.minWidth || getDefaultColumnWidth(col.prop);

    // Створюємо локальні обробники, щоб захопити callback
    const onMouseMove = (e: MouseEvent) => {
      const { resizingCol, startX, startWidth } = resizeState.value;

      if (!resizingCol) return;

      // Додаємо активний клас до всіх ресайзерів цієї колонки
      document.querySelectorAll(`[data-resizer="${resizingCol.prop}"]`).forEach(el => {
        el.classList.add('vt-table__resizer--active');
      });

      const delta = e.clientX - startX;
      const minWidth = resizingCol.minWidth || 50;
      const maxWidth = resizingCol.maxWidth || 1000;
      const newWidth = Math.max(Math.min(startWidth + delta, maxWidth), minWidth);

      // Оновлюємо ширину в об'єкті колонки для візуального ефекту
      resizingCol.width = newWidth;
    };

    const onMouseUp = () => {
      const { resizingCol } = resizeState.value;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.body.classList.remove('vt-table-resizing');

      if (resizingCol) {
        document.querySelectorAll(`[data-resizer="${resizingCol.prop}"]`).forEach(el => {
          el.classList.remove('vt-table__resizer--active');
        });

        // ВАЖЛИВО: Викликаємо callback з новою шириною
        if (callback && resizingCol.width) {
          callback(resizingCol.width);
        }
      }

      resizeState.value.resizingCol = null;
    };

    // Додаємо обробники
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = RESIZE_CURSOR;
    document.body.style.userSelect = 'none';
    document.body.classList.add('vt-table-resizing');
  };

  return {
    onMouseDown,
    resizeState,
  };
}
