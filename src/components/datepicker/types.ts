import { computed } from 'vue';
import { LOCALE_KEYS } from '@/locales/types';
import { useI18n } from '@/locales/useI18n';

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

// Тип функції перекладу (такий самий як у TimePicker)
export type TranslateFunction = (key: LOCALE_KEYS, params?: Record<string, string | number>) => string;

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
  errorMessage?: string;
  helperText?: string;
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

export const useDateLocale = () => {
  const { t } = useI18n();

  const months = computed(() => [
    t(LOCALE_KEYS.MONTH_JANUARY),
    t(LOCALE_KEYS.MONTH_FEBRUARY),
    t(LOCALE_KEYS.MONTH_MARCH),
    t(LOCALE_KEYS.MONTH_APRIL),
    t(LOCALE_KEYS.MONTH_MAY),
    t(LOCALE_KEYS.MONTH_JUNE),
    t(LOCALE_KEYS.MONTH_JULY),
    t(LOCALE_KEYS.MONTH_AUGUST),
    t(LOCALE_KEYS.MONTH_SEPTEMBER),
    t(LOCALE_KEYS.MONTH_OCTOBER),
    t(LOCALE_KEYS.MONTH_NOVEMBER),
    t(LOCALE_KEYS.MONTH_DECEMBER),
  ]);

  const monthsShort = computed(() => [
    t(LOCALE_KEYS.MONTH_SHORT_JANUARY),
    t(LOCALE_KEYS.MONTH_SHORT_FEBRUARY),
    t(LOCALE_KEYS.MONTH_SHORT_MARCH),
    t(LOCALE_KEYS.MONTH_SHORT_APRIL),
    t(LOCALE_KEYS.MONTH_SHORT_MAY),
    t(LOCALE_KEYS.MONTH_SHORT_JUNE),
    t(LOCALE_KEYS.MONTH_SHORT_JULY),
    t(LOCALE_KEYS.MONTH_SHORT_AUGUST),
    t(LOCALE_KEYS.MONTH_SHORT_SEPTEMBER),
    t(LOCALE_KEYS.MONTH_SHORT_OCTOBER),
    t(LOCALE_KEYS.MONTH_SHORT_NOVEMBER),
    t(LOCALE_KEYS.MONTH_SHORT_DECEMBER),
  ]);

  const weekdays = computed(() => [
    t(LOCALE_KEYS.WEEKDAY_SUNDAY),
    t(LOCALE_KEYS.WEEKDAY_MONDAY),
    t(LOCALE_KEYS.WEEKDAY_TUESDAY),
    t(LOCALE_KEYS.WEEKDAY_WEDNESDAY),
    t(LOCALE_KEYS.WEEKDAY_THURSDAY),
    t(LOCALE_KEYS.WEEKDAY_FRIDAY),
    t(LOCALE_KEYS.WEEKDAY_SATURDAY),
  ]);

  const weekdaysShort = computed(() => [
    t(LOCALE_KEYS.WEEKDAY_SHORT_SUN),
    t(LOCALE_KEYS.WEEKDAY_SHORT_MON),
    t(LOCALE_KEYS.WEEKDAY_SHORT_TUE),
    t(LOCALE_KEYS.WEEKDAY_SHORT_WED),
    t(LOCALE_KEYS.WEEKDAY_SHORT_THU),
    t(LOCALE_KEYS.WEEKDAY_SHORT_FRI),
    t(LOCALE_KEYS.WEEKDAY_SHORT_SAT),
  ]);

  return {
    months,
    monthsShort,
    weekdays,
    weekdaysShort,
  };
};

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
  const { t } = useI18n();

  const errors: string[] = [];
  const isRange = ['daterange', 'datetimerange', 'monthrange', 'yearrange'].includes(type);

  if (required) {
    if (!value) {
      errors.push(t(LOCALE_KEYS.VALIDATION_REQUIRED));
    } else if (isRange && isEmptyRangeValue(value)) {
      errors.push(t(LOCALE_KEYS.VALIDATION_REQUIRED));
    }
  }

  if (value) {
    if (isRange && !Array.isArray(value)) {
      errors.push(t(LOCALE_KEYS.VALIDATION_RANGE_EXPECTED));
    } else if (!isRange && Array.isArray(value)) {
      errors.push(t(LOCALE_KEYS.VALIDATION_SINGLE_EXPECTED));
    }

    if (Array.isArray(value)) {
      if (value.length !== 2) {
        errors.push(t(LOCALE_KEYS.VALIDATION_RANGE_EXPECTED));
      } else {
        value.forEach((v, index) => {
          if (v && !isValidDate(v)) {
            errors.push(`${t(LOCALE_KEYS.VALIDATION_INVALID_DATE)} ${index + 1}`);
          }
        });

        if (value[0] && value[1]) {
          const startDate = new Date(value[0]);
          const endDate = new Date(value[1]);
          if (startDate > endDate) {
            errors.push(t(LOCALE_KEYS.VALIDATION_START_AFTER_END));
          }
        }
      }
    } else if (!isValidDate(value)) {
      errors.push(t(LOCALE_KEYS.VALIDATION_INVALID_DATE));
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
