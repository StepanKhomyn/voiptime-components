import type { SortDirection, SortState, VTableColumnProps } from '../types';

/**
 * Спрощений базовий метод сортування з автоматичним визначенням типу
 */
export const defaultSortMethod = (a: any, b: any, direction: SortDirection = 'asc'): number => {
  if (a == null && b == null) return 0;
  if (a == null) return direction === 'asc' ? 1 : -1;
  if (b == null) return direction === 'asc' ? -1 : 1;
  if (a === b) return 0;

  let result = 0;

  const numA = Number(a);
  const numB = Number(b);
  if (!isNaN(numA) && !isNaN(numB)) {
    result = numA - numB;
  } else if (isValidDate(a) && isValidDate(b)) {
    result = new Date(a).getTime() - new Date(b).getTime();
  } else if (typeof a === 'boolean' && typeof b === 'boolean') {
    result = a === b ? 0 : a ? -1 : 1;
  } else {
    result = String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }

  return direction === 'desc' ? -result : result;
};

const isValidDate = (value: any): boolean => {
  if (value instanceof Date) return !isNaN(value.getTime());
  if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}|\//.test(value)) {
    return !isNaN(new Date(value).getTime());
  }
  return false;
};

/**
 * Прямий обробник сортування
 */
export const handleSortDirect = (
  column: VTableColumnProps,
  direction: SortDirection,
  onSortChange: (newSortState: SortState) => void
): void => {
  if (!column.sortable) return;

  onSortChange({
    prop: column.prop,
    direction,
  });
};

/**
 * Отримання CSS класів для іконок сортування
 */
export const getSortIconClasses = (
  column: VTableColumnProps,
  currentSortState: SortState | null
): { asc: string; desc: string } => {
  const isCurrentColumn = currentSortState?.prop === column.prop;
  const direction = currentSortState?.direction;

  return {
    asc: ['vt-th__sort-icon', isCurrentColumn && direction === 'asc' && 'vt-th__sortable-active']
      .filter(Boolean)
      .join(' '),
    desc: ['vt-th__sort-icon', isCurrentColumn && direction === 'desc' && 'vt-th__sortable-active']
      .filter(Boolean)
      .join(' '),
  };
};

/**
 * Сортування даних таблиці
 */
export const sortTableData = <T extends Record<string, any>>(
  data: T[],
  sortState: SortState | null,
  columns: VTableColumnProps[]
): T[] => {
  if (!sortState) return [...data];

  const column = columns.find(col => col.prop === sortState.prop);
  if (!column?.sortable) return [...data];

  const sortMethod = column.sortMethod || defaultSortMethod;

  return [...data].sort((a, b) => {
    const valueA = a[column.prop];
    const valueB = b[column.prop];
    return sortMethod(valueA, valueB, sortState.direction);
  });
};
