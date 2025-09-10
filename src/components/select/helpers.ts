// helpers/selectHelpers.ts
import type { VtSelectOption } from './types';

/**
 * Стандартний метод фільтрації опцій
 */
export const defaultFilterMethod = (query: string, option: VtSelectOption): boolean => {
  const queryLower = query.toLowerCase().trim();
  const labelMatch = option.label.toLowerCase().includes(queryLower);
  const valueMatch = String(option.value).toLowerCase().includes(queryLower);
  return labelMatch || valueMatch;
};

/**
 * Створює тимчасову опцію для значення, яке не знайдено в зареєстрованих опціях
 */
export const createMissingOption = (value: string | number): VtSelectOption => ({
  value,
  label: String(value),
  disabled: false,
});

/**
 * Отримує вибрані опції для single або multiple режимів
 */
export const getSelectedOptions = (
  modelValue: any,
  allOptions: VtSelectOption[],
  isMultiple: boolean
): VtSelectOption[] => {
  if (isMultiple) {
    const values = Array.isArray(modelValue) ? modelValue : [];
    const foundOptions = allOptions.filter(option => values.includes(option.value));

    // Додаємо опції для значень, які не знайдені в зареєстрованих опціях
    const foundValues = foundOptions.map(option => option.value);
    const missingValues = values.filter(value => !foundValues.includes(value));
    const missingOptions = missingValues.map(createMissingOption);

    return [...foundOptions, ...missingOptions];
  } else {
    const foundOption = allOptions.find(option => option.value === modelValue);
    if (foundOption) {
      return [foundOption];
    }

    // Якщо опція не знайдена, але є modelValue - створюємо тимчасову опцію
    if (modelValue !== undefined && modelValue !== null && modelValue !== '' && !Array.isArray(modelValue)) {
      return [createMissingOption(modelValue as string | number)];
    }

    return [];
  }
};

/**
 * Обчислює кількість видимих тегів для collapsed режиму
 */
export const calculateVisibleTagsCount = (
  containerElement: HTMLElement | null,
  tagElements: HTMLElement[],
  totalOptionsCount: number
): number => {
  if (!containerElement || totalOptionsCount === 0) {
    return totalOptionsCount;
  }

  const containerRect = containerElement.getBoundingClientRect();
  const containerWidth = containerRect.width - 60; // Резерв для іконки і паддингів
  let totalWidth = 0;
  let count = 0;
  const tagGap = 4; // Gap між тегами

  // Тимчасово створюємо елемент для вимірювання "+N" тегу
  const measureElement = document.createElement('div');
  measureElement.className = 'vt-select__tag vt-select__tag--collapsed';
  measureElement.style.visibility = 'hidden';
  measureElement.style.position = 'absolute';
  measureElement.innerHTML = `<span class="vt-select__tag-text">+${totalOptionsCount}</span>`;
  document.body.appendChild(measureElement);
  const collapsedTagWidth = measureElement.offsetWidth;
  document.body.removeChild(measureElement);

  // Проходимо по всіх тегах і рахуємо скільки влізе
  for (let i = 0; i < totalOptionsCount; i++) {
    const tagElement = tagElements[i];
    let tagWidth = 0;

    if (!tagElement) {
      // Якщо елемент ще не відрендерився, припускаємо середню ширину
      tagWidth = 80; // Приблизний розрахунок
    } else {
      tagWidth = tagElement.offsetWidth;
    }

    // Якщо це не останній тег, перевіряємо чи влізе він + collapsed індикатор
    if (i < totalOptionsCount - 1) {
      if (totalWidth + tagWidth + tagGap + collapsedTagWidth > containerWidth) {
        break;
      }
    } else {
      // Якщо це останній тег, перевіряємо чи влізе він без collapsed індикатора
      if (totalWidth + tagWidth > containerWidth) {
        break;
      }
    }

    totalWidth += tagWidth + tagGap;
    count++;
  }

  // Якщо всі теги влазять, показуємо всі
  if (count >= totalOptionsCount) {
    return totalOptionsCount;
  } else {
    // Інакше показуємо стільки, скільки влазить + залишаємо місце для "+N"
    return Math.max(1, count);
  }
};

/**
 * Створює tooltip текст для collapsed тегів
 */
export const createCollapsedTooltip = (collapsedCount: number, hiddenOptions: VtSelectOption[]): string => {
  const pluralForm = collapsedCount === 1 ? 'опція' : collapsedCount < 5 ? 'опції' : 'опцій';
  const optionsText = hiddenOptions.map(o => o.label).join(', ');
  return `Вибрано ще ${collapsedCount} ${pluralForm}: ${optionsText}`;
};

/**
 * Валідація значення select компонента
 */
export const validateSelectValue = (
  value: any,
  isMultiple: boolean,
  required: boolean,
  requiredMessage?: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (required) {
    if (isMultiple) {
      const values = Array.isArray(value) ? value : [];
      if (values.length === 0) {
        errors.push(requiredMessage || "Це поле є обов'язковим");
      }
    } else {
      if (!value) {
        errors.push(requiredMessage || "Це поле є обов'язковим");
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Перевіряє чи опція вибрана
 */
export const isOptionSelected = (value: string | number, modelValue: any, isMultiple: boolean): boolean => {
  if (isMultiple) {
    const values = Array.isArray(modelValue) ? modelValue : [];
    return values.includes(value);
  }
  return modelValue === value;
};

/**
 * Обробляє клік по опції та повертає нове значення
 */
export const handleOptionSelection = (option: VtSelectOption, currentValue: any, isMultiple: boolean): any => {
  if (option.disabled) return currentValue;

  if (isMultiple) {
    const currentValues = Array.isArray(currentValue) ? [...currentValue] : [];
    const index = currentValues.indexOf(option.value);

    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(option.value);
    }

    return currentValues;
  } else {
    return option.value;
  }
};

/**
 * Видаляє тег з множинного вибору
 */
export const removeTagFromValue = (tagValue: string | number, currentValue: any): any => {
  if (!Array.isArray(currentValue)) return currentValue;

  const currentValues = [...currentValue];
  const index = currentValues.indexOf(tagValue);

  if (index > -1) {
    currentValues.splice(index, 1);
  }

  return currentValues;
};

/**
 * Повертає порожнє значення для clear операції
 */
export const getEmptyValue = (isMultiple: boolean): any => {
  return isMultiple ? [] : '';
};
