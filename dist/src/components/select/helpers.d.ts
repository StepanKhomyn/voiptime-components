import type { VtSelectOption } from './types';
/**
 * Порівнює два значення, враховуючи можливість об'єктів
 */
export declare function compareValues(a: any, b: any, valueKey?: string): boolean;
/**
 * Знаходить опцію в масиві за значенням
 */
export declare function findOptionByValue(value: any, options: VtSelectOption[], valueKey?: string): VtSelectOption | undefined;
/**
 * Перевіряє, чи обрана опція
 */
export declare function isOptionSelected(value: any, modelValue: any, multiple: boolean, valueKey?: string): boolean;
/**
 * Отримує обрані опції
 */
export declare function getSelectedOptions(modelValue: any, options: VtSelectOption[], multiple: boolean, valueKey?: string): VtSelectOption[];
/**
 * Обробляє вибір опції
 */
export declare function handleOptionSelection(option: VtSelectOption, modelValue: any, multiple: boolean, valueKey?: string): any;
/**
 * Видаляє тег зі значення
 */
export declare function removeTagFromValue(value: any, modelValue: any, valueKey?: string): any;
/**
 * Отримує порожнє значення
 */
export declare function getEmptyValue(multiple: boolean): any;
/**
 * Валідація значення селекта
 */
export declare function validateSelectValue(value: any, multiple: boolean, required: boolean, requiredMessage?: string): {
    isValid: boolean;
    errors: string[];
};
/**
 * Розрахунок кількості видимих тегів
 */
export declare function calculateVisibleTagsCount(container: HTMLElement, tagElements: HTMLElement[], totalCount: number): number;
/**
 * Створює текст для collapsed tooltip
 */
export declare function createCollapsedTooltip(count: number, options: VtSelectOption[]): string;
//# sourceMappingURL=helpers.d.ts.map