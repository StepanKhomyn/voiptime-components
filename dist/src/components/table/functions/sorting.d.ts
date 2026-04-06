import type { SortDirection, SortState, VTableColumnProps } from '../types';
/**
 * Спрощений базовий метод сортування з автоматичним визначенням типу
 */
export declare const defaultSortMethod: (a: any, b: any, direction?: SortDirection) => number;
/**
 * Прямий обробник сортування
 */
export declare const handleSortDirect: (column: VTableColumnProps, direction: SortDirection, onSortChange: (newSortState: SortState) => void) => void;
/**
 * Отримання CSS класів для іконок сортування
 */
export declare const getSortIconClasses: (column: VTableColumnProps, currentSortState: SortState | null) => {
    asc: string;
    desc: string;
};
/**
 * Сортування даних таблиці
 */
export declare const sortTableData: <T extends Record<string, any>>(data: T[], sortState: SortState | null, columns: VTableColumnProps[]) => T[];
//# sourceMappingURL=sorting.d.ts.map