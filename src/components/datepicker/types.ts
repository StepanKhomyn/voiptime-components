// types.ts
export type DatePickerStatus = 'default' | 'success' | 'warning' | 'error';
export type DatePickerType = 'date' | 'week' | 'month' | 'year' | 'datetime';
export type DatePickerPlacement = 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end';

export type DatePickerValue = string | Date | number | null;
export type DatePickerRangeValue = [DatePickerValue, DatePickerValue] | null;
export type DatePickerModelValue = DatePickerValue | DatePickerRangeValue;

export interface VtDatePickerProps {
  modelValue?: DatePickerModelValue;
  type?: DatePickerType;
  placeholder?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  rangeSeparator?: string;
  status?: DatePickerStatus;
  disabled?: boolean;
  clearable?: boolean;
  format?: string;
  valueFormat?: string;
  placement?: DatePickerPlacement;
  label?: string;
  required?: boolean;
  requiredMessage?: string;
  validateOnInput?: boolean;
  validateOnBlur?: boolean;
  minDate?: DatePickerValue;
  maxDate?: DatePickerValue;
  range?: boolean;
  shortcuts?: DateShortcut[];
  firstDayOfWeek?: number;
  unlinkPanels?: boolean;
  defaultValue?: DatePickerModelValue;
  defaultTime?: string | [string, string];
  disabledDate?: (date: Date) => boolean;
  cellClassName?: (date: Date) => string;
}

export interface VtDatePickerEmits {
  'update:modelValue': [value: DatePickerModelValue];
  change: [value: DatePickerModelValue];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  'visible-change': [visible: boolean];
  clear: [];
  'calendar-change': [date: Date];
  'panel-change': [date: Date, mode: string, view: string];
  validation: [result: ValidationResult];
}

export interface DateShortcut {
  text: string;
  value: DatePickerModelValue | (() => DatePickerModelValue);
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CalendarDay {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
  isNextMonth: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isHovered: boolean;
  className?: string;
}

export interface CalendarWeek {
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  isSelected: boolean;
  isDisabled: boolean;
  isHovered: boolean;
}

export interface CalendarMonth {
  month: number;
  year: number;
  name: string;
  shortName: string;
  isSelected: boolean;
  isDisabled: boolean;
  isCurrent: boolean;
  isHovered: boolean;
}

export interface CalendarYear {
  year: number;
  isSelected: boolean;
  isDisabled: boolean;
  isCurrent: boolean;
  isHovered: boolean;
}

export interface DropdownPosition {
  top: string;
  left: string;
  minWidth: string;
  transformOrigin: string;
}

export interface DatePickerLocale {
  months: string[];
  monthsShort: string[];
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysMin: string[];
  firstDayOfWeek: number;
  weekHeader: string;
  dateFormat: string;
  timeFormat: string;
  today: string;
  clear: string;
  confirm: string;
  selectTime: string;
  selectDate: string;
  year: string;
  month: string;
  week: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
  am: string;
  pm: string;
}

export interface DatePickerConfig {
  locale: DatePickerLocale;
  zIndex: number;
  appendToBody: boolean;
  popperOptions: any;
}

// Enum для типів форматування
export enum FormatType {
  DISPLAY = 'display',
  VALUE = 'value',
  INPUT = 'input',
}

// Інтерфейс для парсингу формату
export interface FormatToken {
  type: 'literal' | 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'ampm';
  value: string;
  length: number;
  escape?: boolean;
}

// Типи для внутрішнього стану компонента
export interface DatePickerState {
  isFocused: boolean;
  isDropdownVisible: boolean;
  currentView: 'date' | 'month' | 'year' | 'time';
  currentDate: Date;
  displayDate: Date;
  selectedDate: Date | null;
  selectedRange: [Date | null, Date | null];
  hoveredDate: Date | null;
  rangeState: 'start' | 'end' | null;
  inputValue: string;
  validationErrors: string[];
  isValid: boolean;
}

export interface TimePickerState {
  hours: number;
  minutes: number;
  seconds: number;
  ampm: 'AM' | 'PM';
}

// Допоміжні типи для календаря
export type CalendarViewType = 'date' | 'week' | 'month' | 'year';
export type NavigationDirection = 'prev' | 'next';

export interface CalendarNavigation {
  canGoPrev: boolean;
  canGoNext: boolean;
  prevLabel: string;
  nextLabel: string;
  currentLabel: string;
}

// Типи для шорткатів
export type ShortcutHandler = () => DatePickerModelValue;

export interface PredefinedShortcuts {
  today: ShortcutHandler;
  yesterday: ShortcutHandler;
  thisWeek: ShortcutHandler;
  lastWeek: ShortcutHandler;
  thisMonth: ShortcutHandler;
  lastMonth: ShortcutHandler;
  thisYear: ShortcutHandler;
  lastYear: ShortcutHandler;
  last7Days: ShortcutHandler;
  last30Days: ShortcutHandler;
  last3Months: ShortcutHandler;
}
