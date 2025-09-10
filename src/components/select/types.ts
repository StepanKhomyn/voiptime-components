export type VtSelectStatus = 'default' | 'success' | 'error' | 'warning';

export interface VtSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface VtSelectProps {
  // Основні властивості
  modelValue?: string | number | Array<string | number>;
  multiple?: boolean;
  collapsedTags?: boolean;
  status?: VtSelectStatus;

  // Стани
  disabled?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  loading?: boolean;

  // Текст і лейбли
  label?: string;
  placeholder?: string;
  noDataText?: string;
  noMatchText?: string;
  loadingText?: string;

  // HTML атрибути
  id?: string;
  name?: string;
  tabindex?: number;
  // Випадайка
  maxHeight?: number | string;

  // Фільтрація
  filterMethod?: (query: string, option: VtSelectOption) => boolean;

  // Валідація
  required?: boolean;
  validateOnInput?: boolean;
  validateOnBlur?: boolean;
  requiredMessage?: string;
}

export interface VtSelectEmits {
  'update:modelValue': [value: string | number | Array<string | number>];
  change: [value: string | number | Array<string | number>];
  focus: [];
  blur: [];
  clear: [];
  'visible-change': [visible: boolean];
  'remove-tag': [value: string | number];
  filter: [query: string];
  validation: [result: { isValid: boolean; errors: string[] }];
  scrolled: [];
}

export interface VtSelectMethods {
  focus(): void;

  blur(): void;

  clear(): void;

  validate(): boolean;

  clearValidation(): void;

  getSelectedOptions(): VtSelectOption[];

  getValidationState(): { isValid: boolean; errors: string[] };

  registerOption(option: VtSelectOption): void;

  unregisterOption(value: string | number): void;
}

export interface VtOptionEmits {
  click: [option: VtSelectOption];
}

// Context для передачі даних від Select до Option
export interface VtSelectContext {
  selectValue: string | number | Array<string | number>;
  multiple: boolean;
  handleOptionClick: (option: VtSelectOption) => void;
  isOptionSelected: (value: string | number) => boolean;
  registerOption: (option: VtSelectOption, slotContent?: any) => void;
  unregisterOption: (value: string | number) => void;
}

export const VtSelectContextKey = Symbol('VtSelectContext');
