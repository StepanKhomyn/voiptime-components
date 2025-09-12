// types/VDatePicker.ts

export type DatePickerType = 'year' | 'month' | 'date' | 'daterange' | 'monthrange' | 'yearrange';

export type DatePickerSize = 'small' | 'default' | 'large';

export type DateValue = Date | string | number;
export type DateRangeValue = [DateValue, DateValue];
export type DatePickerValue = DateValue | DateRangeValue | null;

export interface VDatePickerProps {
  modelValue?: DatePickerValue;
  type?: DatePickerType;
  placeholder?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  rangeSeparator?: string;
  format?: string;
  valueFormat?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: DatePickerSize;
  disabledDate?: (date: Date) => boolean;
  shortcuts?: DatePickerShortcut[];
  unlinkPanels?: boolean; // For range pickers
  defaultValue?: DatePickerValue;
  defaultTime?: string | string[];
}

export interface VDatePickerEmits {
  (e: 'update:modelValue', value: DatePickerValue): void;

  (e: 'change', value: DatePickerValue): void;

  (e: 'blur', instance: any): void;

  (e: 'focus', instance: any): void;

  (e: 'calendar-change', value: [Date, Date | null]): void;

  (e: 'panel-change', value: Date, mode: string, view: string): void;
}

export interface DatePickerShortcut {
  text: string;
  value: () => DatePickerValue;
}

export interface VDatePickerMethods {
  focus(): void;

  blur(): void;

  handleOpen(): void;

  handleClose(): void;
}

// Format tokens mapping
export interface FormatToken {
  pattern: RegExp;
  replacement: (date: Date) => string;
}

export const FORMAT_TOKENS: Record<string, FormatToken> = {
  yyyy: {
    pattern: /yyyy/g,
    replacement: (date: Date) => String(date.getFullYear()),
  },
  MM: {
    pattern: /MM/g,
    replacement: (date: Date) => String(date.getMonth() + 1).padStart(2, '0'),
  },
  M: {
    pattern: /(?<!M)M(?!M)/g,
    replacement: (date: Date) => String(date.getMonth() + 1),
  },
  dd: {
    pattern: /dd/g,
    replacement: (date: Date) => String(date.getDate()).padStart(2, '0'),
  },
  d: {
    pattern: /(?<!d)d(?!d)/g,
    replacement: (date: Date) => String(date.getDate()),
  },
  HH: {
    pattern: /HH/g,
    replacement: (date: Date) => String(date.getHours()).padStart(2, '0'),
  },
  H: {
    pattern: /(?<!H)H(?!H)/g,
    replacement: (date: Date) => String(date.getHours()),
  },
  mm: {
    pattern: /mm/g,
    replacement: (date: Date) => String(date.getMinutes()).padStart(2, '0'),
  },
  m: {
    pattern: /(?<!m)m(?!m)/g,
    replacement: (date: Date) => String(date.getMinutes()),
  },
  ss: {
    pattern: /ss/g,
    replacement: (date: Date) => String(date.getSeconds()).padStart(2, '0'),
  },
  s: {
    pattern: /(?<!s)s(?!s)/g,
    replacement: (date: Date) => String(date.getSeconds()),
  },
};

// Month names for formatting
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WEEKDAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Default formats for different picker types
export const DEFAULT_FORMATS: Record<DatePickerType, string> = {
  year: 'yyyy',
  month: 'yyyy-MM',
  date: 'yyyy-MM-dd',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  yearrange: 'yyyy',
};

// Validation utilities
export interface DateValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateDateValue = (
  value: DatePickerValue,
  type: DatePickerType,
  required?: boolean
): DateValidationResult => {
  const errors: string[] = [];

  if (required && (!value || (Array.isArray(value) && value.length === 0))) {
    errors.push("Це поле є обов'язковим");
  }

  if (value) {
    const isRange = ['datetimerange', 'daterange', 'monthrange', 'yearrange'].includes(type);

    if (isRange && !Array.isArray(value)) {
      errors.push('Для діапазону очікується масив з двох дат');
    } else if (!isRange && Array.isArray(value)) {
      errors.push('Для одиночного вибору очікується одна дата');
    }

    // Validate date format
    if (Array.isArray(value)) {
      value.forEach((v, index) => {
        if (v && !isValidDate(v)) {
          errors.push(`Некоректний формат дати ${index + 1}`);
        }
      });
    } else if (!isValidDate(value)) {
      errors.push('Некоректний формат дати');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isValidDate = (value: any): boolean => {
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  return false;
};
