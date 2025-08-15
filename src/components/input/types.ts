import type { IconName } from '../../icons';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'url' | 'textarea';
export type InputStatus = 'default' | 'error' | 'success' | 'warning';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface VtInputProps {
  // Основні пропси
  modelValue?: string | number;
  type?: InputType;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;

  // Розміри та вигляд
  status?: InputStatus;

  // Іконки
  prefixIcon?: IconName;
  suffixIcon?: IconName;

  // Валідація та обмеження
  maxlength?: number;
  minlength?: number;
  required?: boolean;
  pattern?: string;

  // Валідаційні повідомлення
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

  // Валідаційні налаштування
  validateOnInput?: boolean;
  validateOnBlur?: boolean;
  showAllErrors?: boolean;

  // Кастомний валідатор
  customValidator?: (value: string | number) => boolean;

  // Textarea специфічні
  rows?: number;
  cols?: number;
  autosize?: boolean | { minRows?: number; maxRows?: number };
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';

  // Password специфічні
  showPassword?: boolean;

  // Number специфічні
  min?: number;
  max?: number;
  step?: number;

  // Додаткові атрибути
  autocomplete?: string;
  name?: string;
  id?: string;
  tabindex?: number;

  // Стилізація
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

export interface VtInputEmits {
  'update:modelValue': [value: string | number];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  input: [event: Event];
  change: [event: Event];
  clear: [];
  validation: [result: ValidationResult];
  keydown: [event: KeyboardEvent];
  keyup: [event: KeyboardEvent];
  keypress: [event: KeyboardEvent];
  click: [event: MouseEvent];
}

export interface VtInputMethods {
  focus: () => void;
  blur: () => void;
  select: () => void;
  clear: () => void;
  validate: () => boolean;
  clearValidation: () => void;
  getInputElement: () => HTMLInputElement | HTMLTextAreaElement | null;
  getValidationState: () => ValidationResult;
}

// Утилітні типи для валідації
export interface ValidationRule {
  validator: (value: string | number) => boolean;
  message: string;
}

export interface ValidationConfig {
  rules?: ValidationRule[];
  validateOnInput?: boolean;
  validateOnBlur?: boolean;
  showAllErrors?: boolean;
}
