import type { IconName } from '@/icons';

export type VtInputSize = 'small' | 'medium' | 'large';
export type VtInputStatus = 'default' | 'success' | 'error' | 'warning';
export type VtInputType = 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'search' | 'textarea';
export type VtInputResize = 'none' | 'both' | 'horizontal' | 'vertical';

export interface VtInputAutosizeConfig {
  minRows?: number;
  maxRows?: number;
}

export interface VtInputValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface VtInputProps {
  // Основні властивості
  modelValue?: string | number;
  type?: VtInputType;
  size?: VtInputSize;
  status?: VtInputStatus;

  // Стани
  disabled?: boolean;
  clearable?: boolean;
  showPassword?: boolean;

  // Текст і лейбли
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  outlined?: boolean;

  // HTML атрибути
  id?: string;
  name?: string;
  tabindex?: number;
  autocomplete?: string;

  // Іконки
  prefixIcon?: IconName;
  suffixIcon?: IconName;

  // Textarea специфічні
  rows?: number;
  cols?: number;
  resize?: VtInputResize;
  autosize?: boolean | VtInputAutosizeConfig;

  // Валідація
  required?: boolean;
  validateOnInput?: boolean;
  validateOnBlur?: boolean;
  showAllErrors?: boolean;

  // Повідомлення валідації
  requiredMessage?: string;
  emailMessage?: string;
  urlMessage?: string;
  numberMessage?: string;
  minlengthMessage?: string;
  maxlengthMessage?: string;
  minMessage?: string;
  maxMessage?: string;
  patternMessage?: string;
  customValidatorMessage?: string;

  // Валідаційні правила
  minlength?: number;
  maxlength?: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  customValidator?: (value: string | number) => boolean;
}

export interface VtInputEmits {
  'update:modelValue': [value: string | number];
  input: [event: Event];
  change: [event: Event];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [];
  validation: [result: VtInputValidationResult];
  keydown: [event: KeyboardEvent];
  keyup: [event: KeyboardEvent];
  keypress: [event: KeyboardEvent];
  click: [event: MouseEvent];
}

export interface VtInputMethods {
  focus(): void;

  blur(): void;

  select(): void;

  clear(): void;

  validate(): boolean;

  clearValidation(): void;

  getInputElement(): HTMLInputElement | HTMLTextAreaElement | null;

  getValidationState(): VtInputValidationResult;
}
