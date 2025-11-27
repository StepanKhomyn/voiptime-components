// types/VDatePicker.ts

export type DatePickerType =
  | 'date'
  | 'datetime'
  | 'daterange'
  | 'datetimerange'
  | 'month'
  | 'monthrange'
  | 'year'
  | 'yearrange';

export type DatePickerSize = 'small' | 'default' | 'large';

export type DateValue = string | number | Date;
export type DateRangeValue = [DateValue, DateValue];
export type DatePickerValue = DateValue | DateRangeValue | null | undefined;

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
  unlinkPanels?: boolean;
  defaultValue?: DatePickerValue;
  defaultTime?: string | string[];

  label?: string;
  outlined?: boolean;
  required?: boolean;
  id?: string;

  // Тексти
  errorMessage?: string;
  helperText?: string;

  // Time picker props (для datetime типів)
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  showSeconds?: boolean;
  use12Hours?: boolean;
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
  hideDisabledOptions?: boolean;

  maxDateRange?: number;
  previousDateDisabled?: boolean;
}

export interface VDatePickerEmits {
  (e: 'update:modelValue', value: DatePickerValue): void;

  (e: 'change', value: DatePickerValue): void;

  (e: 'blur', instance: any): void;

  (e: 'focus', instance: any): void;

  (e: 'calendar-change', value: [Date, Date | null]): void;

  (e: 'panel-change', value: Date, mode: string, view: string): void;

  (e: 'open-change', open: boolean): void;
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
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
];

export const MONTH_NAMES_SHORT = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
export const WEEKDAY_NAMES = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
export const WEEKDAY_NAMES_SHORT = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

// Default formats for different picker types
export const DEFAULT_FORMATS: Record<DatePickerType, string> = {
  date: 'yyyy-MM-dd',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  month: 'yyyy-MM',
  monthrange: 'yyyy-MM',
  year: 'yyyy',
  yearrange: 'yyyy',
};

// Validation utilities
export interface DateValidationResult {
  isValid: boolean;
  errors: string[];
}

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

const isEmptyRangeValue = (value: any): boolean => {
  if (!Array.isArray(value)) return false;
  return value.length === 0 || value.every(item => !item);
};

export const validateDateValue = (
  value: DatePickerValue | null | undefined,
  type: DatePickerType,
  required?: boolean
): DateValidationResult => {
  const errors: string[] = [];
  const isRange = ['daterange', 'datetimerange', 'monthrange', 'yearrange'].includes(type);

  if (required) {
    if (!value) {
      errors.push("Це поле є обов'язковим");
    } else if (isRange && isEmptyRangeValue(value)) {
      errors.push("Це поле є обов'язковим");
    }
  }

  if (value) {
    if (isRange && !Array.isArray(value)) {
      errors.push('Для діапазону очікується масив з двох дат');
    } else if (!isRange && Array.isArray(value)) {
      errors.push('Для одиночного вибору очікується одна дата');
    }

    if (Array.isArray(value)) {
      if (value.length !== 2) {
        errors.push('Діапазон повинен містити дві дати');
      } else {
        value.forEach((v, index) => {
          if (v && !isValidDate(v)) {
            errors.push(`Некоректний формат дати ${index + 1}`);
          }
        });

        if (value[0] && value[1]) {
          const startDate = new Date(value[0]);
          const endDate = new Date(value[1]);
          if (startDate > endDate) {
            errors.push('Початкова дата не може бути пізніше кінцевої');
          }
        }
      }
    } else if (!isValidDate(value)) {
      errors.push('Некоректний формат дати');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
