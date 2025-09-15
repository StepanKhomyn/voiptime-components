// types/VTimePicker.ts

export type TimePickerType = 'time' | 'timerange';
export type TimePickerSize = 'small' | 'default' | 'large';
export type TimeValue = string | Date;
export type TimeRangeValue = [TimeValue, TimeValue];
export type TimePickerValue = TimeValue | TimeRangeValue | null | undefined;

export interface VTimePickerProps {
  modelValue?: TimePickerValue;
  type?: TimePickerType;
  placeholder?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  rangeSeparator?: string;
  format?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: TimePickerSize;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  showSeconds?: boolean;
  use12Hours?: boolean;
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
  hideDisabledOptions?: boolean;
}

export interface VTimePickerEmits {
  (e: 'update:modelValue', value: TimePickerValue): void;

  (e: 'change', value: TimePickerValue): void;

  (e: 'blur', instance: any): void;

  (e: 'focus', instance: any): void;

  (e: 'open-change', open: boolean): void;
}

export interface VTimePickerMethods {
  focus(): void;

  blur(): void;

  open(): void;

  close(): void;
}

export interface TimeObject {
  hour: number;
  minute: number;
  second: number;
  period?: 'AM' | 'PM';
}

export interface TimeValidationResult {
  isValid: boolean;
  errors: string[];
}

// Default formats for different use cases
export const DEFAULT_TIME_FORMATS = {
  '24h': 'HH:mm:ss',
  '24h_no_seconds': 'HH:mm',
  '12h': 'hh:mm:ss A',
  '12h_no_seconds': 'hh:mm A',
} as const;

// Time validation utilities
export const isValidTimeString = (timeStr: string): boolean => {
  if (!timeStr) return false;

  const timeFormats = [
    /^([01]?\d|2[0-3]):([0-5]\d):([0-5]\d)$/, // HH:mm:ss (24h)
    /^([01]?\d|2[0-3]):([0-5]\d)$/, // HH:mm (24h)
    /^(0?[1-9]|1[0-2]):([0-5]\d):([0-5]\d)\s?(AM|PM)$/i, // hh:mm:ss AM/PM (12h)
    /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i, // hh:mm AM/PM (12h)
  ];

  return timeFormats.some(format => format.test(timeStr.trim()));
};

export const validateTimeValue = (
  value: TimePickerValue,
  type: TimePickerType,
  required?: boolean
): TimeValidationResult => {
  const errors: string[] = [];
  const isRange = type === 'timerange';

  // Check if required
  if (required) {
    if (!value) {
      errors.push("Це поле є обов'язковим");
    } else if (isRange && Array.isArray(value)) {
      if (value.length !== 2 || !value[0] || !value[1]) {
        errors.push('Необхідно вибрати початковий та кінцевий час');
      }
    }
  }

  // Validate format and structure
  if (value) {
    if (isRange && !Array.isArray(value)) {
      errors.push('Для діапазону очікується масив з двох значень часу');
    } else if (!isRange && Array.isArray(value)) {
      errors.push('Для одиночного вибору очікується одне значення часу');
    }

    // Validate time format
    if (Array.isArray(value)) {
      value.forEach((v, index) => {
        if (v) {
          if (typeof v === 'string' && !isValidTimeString(v)) {
            errors.push(`Некоректний формат часу ${index + 1}`);
          } else if (v instanceof Date && isNaN(v.getTime())) {
            errors.push(`Некоректне значення часу ${index + 1}`);
          }
        }
      });

      // Check time range logic
      if (value.length === 2 && value[0] && value[1]) {
        const startTime = parseTimeToMinutes(value[0]);
        const endTime = parseTimeToMinutes(value[1]);

        if (startTime !== null && endTime !== null && startTime >= endTime) {
          errors.push('Початковий час повинен бути раніше кінцевого');
        }
      }
    } else if (value) {
      if (typeof value === 'string' && !isValidTimeString(value)) {
        errors.push('Некоректний формат часу');
      } else if (value instanceof Date && isNaN(value.getTime())) {
        errors.push('Некоректне значення часу');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper to convert time to minutes for comparison
const parseTimeToMinutes = (time: TimeValue): number | null => {
  if (!time) return null;

  if (time instanceof Date) {
    return time.getHours() * 60 + time.getMinutes();
  }

  if (typeof time === 'string') {
    const timeFormats = [
      /^(\d{1,2}):(\d{2}):(\d{2})$/, // HH:mm:ss
      /^(\d{1,2}):(\d{2})$/, // HH:mm
      /^(\d{1,2}):(\d{2}):(\d{2})\s?(AM|PM)$/i, // HH:mm:ss AM/PM
      /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i, // HH:mm AM/PM
    ];

    for (const format of timeFormats) {
      const match = time.match(format);
      if (match) {
        let hour = parseInt(match[1]);
        const minute = parseInt(match[2]);
        const period = match[4]?.toUpperCase();

        if (period) {
          if (period === 'PM' && hour !== 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;
        }

        return hour * 60 + minute;
      }
    }
  }

  return null;
};

// Time formatting utilities
export const formatTime = (
  hour: number,
  minute: number,
  second: number = 0,
  format: string = 'HH:mm:ss',
  use12Hours: boolean = false
): string => {
  let formattedHour = hour;
  let period = '';

  if (use12Hours) {
    period = hour >= 12 ? ' PM' : ' AM';
    formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  }

  const hourStr = formattedHour.toString().padStart(2, '0');
  const minuteStr = minute.toString().padStart(2, '0');
  const secondStr = second.toString().padStart(2, '0');

  let result = format;
  result = result.replace(/HH/g, hour.toString().padStart(2, '0'));
  result = result.replace(/H/g, hour.toString());
  result = result.replace(/hh/g, hourStr);
  result = result.replace(/h/g, formattedHour.toString());
  result = result.replace(/mm/g, minuteStr);
  result = result.replace(/m/g, minute.toString());
  result = result.replace(/ss/g, secondStr);
  result = result.replace(/s/g, second.toString());
  result = result.replace(/A/g, hour >= 12 ? 'PM' : 'AM');
  result = result.replace(/a/g, hour >= 12 ? 'pm' : 'am');

  return result;
};

// Parse time string to time object
export const parseTimeString = (timeStr: string): TimeObject | null => {
  if (!timeStr) return null;

  const formats = [
    /^(\d{1,2}):(\d{2}):(\d{2})$/, // HH:mm:ss
    /^(\d{1,2}):(\d{2})$/, // HH:mm
    /^(\d{1,2}):(\d{2}):(\d{2})\s?(AM|PM)$/i, // HH:mm:ss AM/PM
    /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i, // HH:mm AM/PM
  ];

  for (const format of formats) {
    const match = timeStr.match(format);
    if (match) {
      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const second = match[3] ? parseInt(match[3]) : 0;
      const period = match[4] ? (match[4].toUpperCase() as 'AM' | 'PM') : undefined;

      if (period) {
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
      }

      return { hour, minute, second, period };
    }
  }

  return null;
};

// Generate time options for dropdowns
export const generateTimeOptions = (
  min: number = 0,
  max: number = 59,
  step: number = 1,
  disabled: number[] = []
): Array<{ value: number; label: string; disabled: boolean }> => {
  const options = [];

  for (let i = min; i <= max; i += step) {
    options.push({
      value: i,
      label: i.toString().padStart(2, '0'),
      disabled: disabled.includes(i),
    });
  }

  return options;
};
