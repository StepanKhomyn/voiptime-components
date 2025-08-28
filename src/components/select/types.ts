export type VtSelectSize = 'small' | 'medium' | 'large';
export type VtSelectStatus = 'default' | 'success' | 'error' | 'warning';

export interface VtSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
  group?: string;
}

export interface VtSelectProps {
  // Основні властивості
  modelValue?: string | number | Array<string | number>;
  multiple?: boolean;
  collapsedTags?: boolean;
  size?: VtSelectSize;
  status?: VtSelectStatus;

  // Стани
  disabled?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  remote?: boolean;
  loading?: boolean;

  // Текст і лейбли
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  noDataText?: string;
  noMatchText?: string;
  loadingText?: string;

  // HTML атрибути
  id?: string;
  name?: string;
  tabindex?: number;
  // Випадайка
  maxHeight?: number | string;
  placement?: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end';

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
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [];
  'visible-change': [visible: boolean];
  'remove-tag': [value: string | number];
  filter: [query: string];
  validation: [result: { isValid: boolean; errors: string[] }];
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

export interface VtOptionProps {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
  group?: string;
}

export interface VtOptionEmits {
  click: [option: VtSelectOption];
}

// Context для передачі даних від Select до Option
export interface VtSelectContext {
  selectValue: string | number | Array<string | number>;
  multiple: boolean;
  filterable: boolean;
  filterQuery: string;
  handleOptionClick: (option: VtSelectOption) => void;
  isOptionSelected: (value: string | number) => boolean;
  isOptionVisible: (option: VtSelectOption) => boolean;
  registerOption: (option: VtSelectOption) => void;
  unregisterOption: (value: string | number) => void;
}

export const VtSelectContextKey = Symbol('VtSelectContext');
