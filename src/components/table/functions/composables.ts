// composables.ts - ВИПРАВЛЕНА ВЕРСІЯ
import { computed, ref } from 'vue';
import type { ResizeState, StickyPosition, VTableColumnProps, VTableProps, VTableStyleConfig } from '../types';

/**
 * Композабл для роботи з колонками таблиці
 */
export function useTableColumns(columns: VTableColumnProps[]) {
  const sortedColumns = computed(() => {
    return [...columns].sort((a, b) => {
      if (a.pinnedLeft && !b.pinnedLeft) return -1;
      if (!a.pinnedLeft && b.pinnedLeft) return 1;
      if (a.pinnedRight && !b.pinnedRight) return 1;
      if (!a.pinnedRight && b.pinnedRight) return -1;
      return 0;
    });
  });

  // ВИПРАВЛЕНО: Більш консервативний підхід до обчислення ширини
  const getDefaultColumnWidth = (): number => {
    const totalColumns = sortedColumns.value.length;
    const columnsWithFixedWidth = sortedColumns.value.filter(col => col.width || col.minWidth);
    const flexibleColumns = totalColumns - columnsWithFixedWidth.length;

    // Якщо всі колонки мають фіксовану ширину
    if (flexibleColumns === 0) return 150;

    // Використовуємо мінімальну ширину для гнучких колонок
    return 150; // Стандартна ширина для колонок без явно заданої ширини
  };

  const getStickyOffset = (side: StickyPosition, index: number, hasSelectable: boolean = false): number => {
    const cols = sortedColumns.value;
    let offset = 0;

    if (side === 'left') {
      if (hasSelectable) {
        offset += 45;
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
 * Композабл для генерації стилів таблиці - ВИПРАВЛЕНО
 */
export function useTableStyles(props: VTableProps) {
  const getTableWrapperStyle = (): VTableStyleConfig => {
    const style: VTableStyleConfig = {};

    if (props.maxHeight) {
      style.maxHeight = `${props.maxHeight}px`;
    }

    // ДОДАНО: Забезпечуємо горизонтальний скрол
    style.overflowX = 'auto';

    return style;
  };

  const getColumnStyle = (
    col: VTableColumnProps,
    index: number,
    getStickyOffsetFn: (side: StickyPosition, index: number, hasSelectable?: boolean) => number,
    getDefaultColumnWidth: () => number
  ): VTableStyleConfig => {
    const style: VTableStyleConfig = {};

    // ВИПРАВЛЕНО: Точний контроль ширини колонок
    if (col.width) {
      // Фіксована ширина - точно як задано
      style.width = `${col.width}px`;
      style.minWidth = `${col.width}px`;
      style.maxWidth = `${col.width}px`;
      style.flexShrink = '0'; // Запобігаємо стисканню
    } else if (col.minWidth && col.maxWidth) {
      // Задано і мін, і макс - використовуємо мінімум як базу
      style.width = `${col.minWidth}px`;
      style.minWidth = `${col.minWidth}px`;
      style.maxWidth = `${col.maxWidth}px`;
      style.flexGrow = '1'; // Дозволяємо розтягуватись
    } else if (col.minWidth) {
      // Тільки мінімальна ширина
      style.width = `${col.minWidth}px`;
      style.minWidth = `${col.minWidth}px`;
      style.maxWidth = 'none';
      style.flexGrow = '1';
    } else if (col.maxWidth) {
      // Тільки максимальна ширина
      const defaultWidth = Math.min(getDefaultColumnWidth(), col.maxWidth);
      style.width = `${defaultWidth}px`;
      style.minWidth = '80px';
      style.maxWidth = `${col.maxWidth}px`;
      style.flexShrink = '1';
    } else {
      // Без обмежень - використовуємо дефолт
      const defaultWidth = getDefaultColumnWidth();
      style.width = `${defaultWidth}px`;
      style.minWidth = '120px';
      style.maxWidth = 'none';
      style.flexGrow = '1';
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

  // Решта функцій залишаються без змін...
  const getHeaderStyle = (
    col: VTableColumnProps,
    index: number,
    getStickyOffsetFn: (side: StickyPosition, index: number, hasSelectable?: boolean) => number,
    getDefaultColumnWidth: () => number
  ): VTableStyleConfig => {
    const style = getColumnStyle(col, index, getStickyOffsetFn, getDefaultColumnWidth);

    if (props.maxHeight) {
      style.position = 'sticky';
      style.top = '0';

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

    if (props.maxHeight) {
      style.position = 'sticky';
      style.bottom = '0';

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

// Композабл для ресайзу залишається без змін
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
    callback?: (newWidth: number) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();

    resizeState.value.resizingCol = col;
    resizeState.value.startX = e.clientX;
    resizeState.value.startWidth = col.width || col.minWidth || getDefaultColumnWidth(col.prop);

    const onMouseMove = (e: MouseEvent) => {
      const { resizingCol, startX, startWidth } = resizeState.value;

      if (!resizingCol) return;

      document.querySelectorAll(`[data-resizer="${resizingCol.prop}"]`).forEach(el => {
        el.classList.add('vt-table__resizer--active');
      });

      const delta = e.clientX - startX;
      const minWidth = resizingCol.minWidth || 50;
      const maxWidth = resizingCol.maxWidth || 1000;
      const newWidth = Math.max(Math.min(startWidth + delta, maxWidth), minWidth);

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

        if (callback && resizingCol.width) {
          callback(resizingCol.width);
        }
      }

      resizeState.value.resizingCol = null;
    };

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
