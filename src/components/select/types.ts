import type { InjectionKey } from 'vue';

// types.ts - оновлені типи для підтримки об'єктів та фільтрації
export type VtSelectStatus = 'default' | 'success' | 'error' | 'warning';

export interface VtSelectOption {
  label: any;
  value: any;
  disabled?: boolean;

  [key: string]: any; // Додаткові властивості
}

export interface VtSelectProps {
  modelValue?: any; // Змінено для підтримки будь-яких значень
  options?: VtSelectOption[];
  multiple?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  loading?: boolean;
  placeholder?: string;
  noDataText?: string;
  loadingText?: string;
  maxHeight?: number;
  collapsedTags?: boolean;
  validateOnInput?: boolean;
  validateOnBlur?: boolean;
  placement?: string;
  trigger?: string;
  showTimeout?: number;
  hideTimeout?: number;
  status?: 'default' | 'success' | 'warning' | 'error';
  label?: string;
  outlined?: boolean;
  id?: string;
  required?: boolean;
  requiredMessage?: string;
  // Опція для порівняння об'єктів
  valueKey?: string; // Ключ для порівняння об'єктів (наприклад, 'id')

  // Тексти
  errorMessage?: string;

  // Нові пропи для фільтрації
  filterPlaceholder?: string; // Плейсхолдер для поля фільтрації
  allowRemoteFilter?: boolean; // Чи дозволяти віддалену фільтрацію (не фільтрувати локально)
}

export interface VtSelectEmits {
  (e: 'update:modelValue', value: any): void;

  (e: 'change', value: any): void;

  (e: 'clear'): void;

  (e: 'focus'): void;

  (e: 'blur'): void;

  (e: 'visible-change', visible: boolean): void;

  (e: 'validation', result: { isValid: boolean; errors: string[] }): void;

  (e: 'scrolled'): void;

  (e: 'remove-tag', value: any): void;

  (e: 'filter', query: string): void; // Еміт при зміні фільтра
  (e: 'filter-clear'): void; // Еміт при очищенні фільтра
}

export interface VtOptionEmits {
  click: [option: VtSelectOption];
}

export interface VtSelectContext {
  selectValue: any;
  multiple: boolean;
  valueKey?: string;
  handleOptionClick: (option: VtSelectOption) => void;
  isOptionSelected: (value: any) => boolean;
  registerOption: (option: VtSelectOption, slotContent?: any) => void;
  unregisterOption: (value: any) => void;
}

export interface VtSelectMethods {
  registerOption: (option: VtSelectOption, slotContent?: any) => void;
  unregisterOption: (value: any) => void;

  focus(): void;

  blur(): void;

  clear(): void;

  validate(): boolean;

  clearValidation(): void;

  getSelectedOptions(): VtSelectOption[];

  getValidationState(): { isValid: boolean; errors: string[] };

  // Нові методи для фільтрації
  setFilter(query: string): void; // Встановити фільтр програмно
  clearFilter(): void; // Очистити фільтр програмно
  getFilterQuery(): string; // Отримати поточний запит фільтра
}

export const VtSelectContextKey = Symbol('VtSelectContext') as InjectionKey<VtSelectContext>;
