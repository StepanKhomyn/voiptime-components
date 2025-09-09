// types.ts - Оновлені типи
import type { ComputedRef, InjectionKey } from 'vue';

export interface VtSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

export type VtSelectStatus = 'default' | 'success' | 'warning' | 'error';

export interface VtSelectProps {
  modelValue?: string | number | (string | number)[];
  options?: VtSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  multiple?: boolean;
  collapsedTags?: boolean;
  size?: 'small' | 'medium' | 'large';
  status?: VtSelectStatus;
  loading?: boolean;
  loadingText?: string;
  noDataText?: string;
  noMatchText?: string;
  maxHeight?: number;
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
  filterMethod?: (query: string, option: VtSelectOption) => boolean;
  validateOnInput?: boolean;
  validateOnBlur?: boolean;
  required?: boolean;
  requiredMessage?: string;
  infiniteScroll?: boolean;
  label?: string;
  id?: string;
}

export interface VtSelectEmits {
  (e: 'update:modelValue', value: string | number | (string | number)[]): void;

  (e: 'change', value: string | number | (string | number)[]): void;

  (e: 'clear'): void;

  (e: 'visible-change', visible: boolean): void;

  (e: 'remove-tag', value: string | number): void;

  (e: 'filter', query: string): void;

  (e: 'scrolled'): void;

  (e: 'validation', result: { isValid: boolean; errors: string[] }): void;
}

export interface VtSelectMethods {
  focus(): void;

  blur(): void;

  clear(): void;

  validate(): boolean;

  clearValidation(): void;

  getSelectedOptions(): VtSelectOption[];

  getValidationState(): { isValid: boolean; errors: string[] };

  registerOption(option: VtSelectOption, slotContent?: any): void;

  unregisterOption(value: string | number): void;
}

// ВИПРАВЛЕННЯ: Оновлений контекст з computed властивостями
export interface VtSelectContext {
  selectValue: ComputedRef<string | number | (string | number)[]>;
  multiple: boolean;
  filterable: boolean;
  filterQuery: ComputedRef<string>;
  handleOptionClick: (option: VtSelectOption) => void;
  isOptionSelected: (value: string | number) => boolean;
  isOptionVisible: (option: VtSelectOption) => boolean;
  registerOption: (option: VtSelectOption, slotContent?: any) => void;
  unregisterOption: (value: string | number) => void;
}

export interface VtOptionProps {
  label: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
}

export interface VtOptionEmits {
  (e: 'click', option: VtSelectOption): void;
}

export const VtSelectContextKey: InjectionKey<VtSelectContext> = Symbol('VtSelectContext');
