// helpers.ts - оновлені хелпери для підтримки об'єктів

import type { VtSelectOption } from './types';

/**
 * Порівнює два значення, враховуючи можливість об'єктів
 */
export function compareValues(a: any, b: any, valueKey?: string): boolean {
  if (valueKey && typeof a === 'object' && typeof b === 'object') {
    return a?.[valueKey] === b?.[valueKey];
  }

  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  return a === b;
}

/**
 * Знаходить опцію в масиві за значенням
 */
export function findOptionByValue(
  value: any,
  options: VtSelectOption[],
  valueKey?: string
): VtSelectOption | undefined {
  return options.find(option => compareValues(option.value, value, valueKey));
}

/**
 * Перевіряє, чи обрана опція
 */
export function isOptionSelected(value: any, modelValue: any, multiple: boolean, valueKey?: string): boolean {
  if (multiple) {
    if (!Array.isArray(modelValue)) return false;
    return modelValue.some(item => compareValues(item, value, valueKey));
  }

  return compareValues(modelValue, value, valueKey);
}

/**
 * Отримує обрані опції
 */
export function getSelectedOptions(
  modelValue: any,
  options: VtSelectOption[],
  multiple: boolean,
  valueKey?: string
): VtSelectOption[] {
  if (!options.length) return [];

  if (multiple) {
    if (!Array.isArray(modelValue)) return [];
    return modelValue.map(value => findOptionByValue(value, options, valueKey)).filter(Boolean) as VtSelectOption[];
  }

  const selected = findOptionByValue(modelValue, options, valueKey);
  return selected ? [selected] : [];
}

/**
 * Обробляє вибір опції
 */
export function handleOptionSelection(
  option: VtSelectOption,
  modelValue: any,
  multiple: boolean,
  valueKey?: string
): any {
  if (multiple) {
    const currentValues = Array.isArray(modelValue) ? modelValue : [];
    const isSelected = currentValues.some(item => compareValues(item, option.value, valueKey));

    if (isSelected) {
      return currentValues.filter(item => !compareValues(item, option.value, valueKey));
    } else {
      return [...currentValues, option.value];
    }
  }

  return option.value;
}

/**
 * Видаляє тег зі значення
 */
export function removeTagFromValue(value: any, modelValue: any, valueKey?: string): any {
  if (!Array.isArray(modelValue)) return modelValue;

  return modelValue.filter(item => !compareValues(item, value, valueKey));
}

/**
 * Отримує порожнє значення
 */
export function getEmptyValue(multiple: boolean): any {
  return multiple ? [] : undefined;
}

/**
 * Валідація значення селекта
 */
export function validateSelectValue(
  value: any,
  multiple: boolean,
  required: boolean,
  requiredMessage?: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (required) {
    const isEmpty = multiple
      ? !Array.isArray(value) || value.length === 0
      : value === undefined || value === null || value === '';

    if (isEmpty) {
      errors.push(requiredMessage || "Це поле є обов'язковим");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Розрахунок кількості видимих тегів
 */
export function calculateVisibleTagsCount(
  container: HTMLElement,
  tagElements: HTMLElement[],
  totalCount: number
): number {
  if (!container || !tagElements.length) return totalCount;

  const containerWidth = container.offsetWidth;
  const reservedSpace = 100; // Простір для кнопки "+N"
  let usedWidth = 0;
  let visibleCount = 0;

  for (let i = 0; i < tagElements.length && i < totalCount; i++) {
    const tagWidth = tagElements[i]?.offsetWidth || 0;

    if (usedWidth + tagWidth + reservedSpace <= containerWidth) {
      usedWidth += tagWidth;
      visibleCount++;
    } else {
      break;
    }
  }

  return Math.max(1, visibleCount);
}

/**
 * Створює текст для collapsed tooltip
 */
export function createCollapsedTooltip(count: number, options: VtSelectOption[]): string {
  const labels = options.map(opt => opt.label).join(', ');
  return `Ще ${count}: ${labels}`;
}
