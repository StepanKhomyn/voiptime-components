import type { InjectionKey } from 'vue';

// types.ts - оновлені типи для підтримки об'єктів
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
  id?: string;
  required?: boolean;
  requiredMessage?: string;
  // Нова опція для порівняння об'єктів
  valueKey?: string; // Ключ для порівняння об'єктів (наприклад, 'id')
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
}

export const VtSelectContextKey = Symbol('VtSelectContext') as InjectionKey<VtSelectContext>;
