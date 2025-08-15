// types.ts
export interface DateObject {
  year: number;
  month: number;
  day: number;
  date: Date;
  isPrevMonth?: boolean;
  isNextMonth?: boolean;
  isToday?: boolean;
}

export interface Shortcut {
  text: string;
  value: () => Date | [Date, Date];
}

export type DatePickerType = 'date' | 'daterange';
export type DatePickerSize = 'large' | 'default' | 'small';

export interface DatePickerProps {
  modelValue?: Date | [Date, Date] | null;
  type?: DatePickerType;
  format?: string;
  valueFormat?: string;
  placeholder?: string;
  rangeSeparator?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  editable?: boolean;
  size?: DatePickerSize;
  disabledDate?: (date: Date) => boolean;
  shortcuts?: Shortcut[];
  firstDayOfWeek?: number;
  unlinkPanels?: boolean;
  showFooter?: boolean;
  teleportTo?: string;
  minDate?: Date;
  maxDate?: Date;
  appendToBody?: boolean;
  popperClass?: string;
  defaultTime?: Date | [Date, Date];
  defaultValue?: Date | [Date, Date];
  validateEvent?: boolean;
  prefixIcon?: string;
  suffixIcon?: string;
  timeArrowControl?: boolean;
  name?: string;
  id?: string;
  autocomplete?: string;
  tabindex?: string | number;
  label?: string;
  ariaLabel?: string;
}

export interface DatePickerEmits {
  'update:modelValue': [value: Date | [Date, Date] | null];
  change: [value: Date | [Date, Date] | null];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  'calendar-change': [date: [Date, Date]];
  'panel-change': [date: Date, mode: string, view: string];
  'visible-change': [visible: boolean];
  clear: [];
}

export interface DatePickerExpose {
  focus: () => void;
  blur: () => void;
  handleOpen: () => void;
  handleClose: () => void;
  getPicker: () => HTMLElement | undefined;
}

export interface DropdownPosition {
  top: string;
  left: string;
  position: string;
  zIndex: number;
  minWidth?: string;
}

export interface CalendarDate extends DateObject {
  isSelected?: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isDisabled?: boolean;
  isHover?: boolean;
  isWeekend?: boolean;
}

export interface DatePickerState {
  isVisible: boolean;
  currentYear: number;
  currentMonth: number;
  selectedDates: Date[];
  hoveredDate: Date | null;
  tempSelection: Date[];
  inputValue: string;
  userInput: boolean;
  dropdownStyle: DropdownPosition | {};
  pickerVisible: boolean;
  rangeState: {
    endDate: Date | null;
    selecting: boolean;
    row: number | null;
    column: number | null;
  };
}

export interface MonthTableProps {
  date: Date;
  defaultValue?: Date | [Date, Date];
  minDate?: Date;
  maxDate?: Date;
  parsedValue?: Date | [Date, Date];
  rangeState?: DatePickerState['rangeState'];
  disabledDate?: (date: Date) => boolean;
}

export interface YearTableProps {
  date: Date;
  defaultValue?: Date | [Date, Date];
  minDate?: Date;
  maxDate?: Date;
  parsedValue?: Date | [Date, Date];
  disabledDate?: (date: Date) => boolean;
}

export const WEEK_DAYS = {
  0: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], // Sunday first
  1: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'], // Monday first
} as const;

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
] as const;

export const MONTH_NAMES_SHORT = [
  'Січ',
  'Лют',
  'Бер',
  'Кві',
  'Тра',
  'Чер',
  'Лип',
  'Сер',
  'Вер',
  'Жов',
  'Лис',
  'Гру',
] as const;

// Predefined shortcuts
export const DEFAULT_SHORTCUTS: Shortcut[] = [
  {
    text: 'Сьогодні',
    value: () => new Date(),
  },
  {
    text: 'Вчора',
    value: () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date;
    },
  },
  {
    text: 'Останні 7 днів',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return [start, end] as [Date, Date];
    },
  },
  {
    text: 'Останні 30 днів',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      return [start, end] as [Date, Date];
    },
  },
  {
    text: 'Цей місяць',
    value: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return [start, end] as [Date, Date];
    },
  },
  {
    text: 'Минулий місяць',
    value: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return [start, end] as [Date, Date];
    },
  },
];

// Date format patterns
export const DATE_FORMAT_PATTERNS = {
  'yyyy-MM-dd': /^\d{4}-\d{2}-\d{2}$/,
  'dd/MM/yyyy': /^\d{2}\/\d{2}\/\d{4}$/,
  'MM/dd/yyyy': /^\d{2}\/\d{2}\/\d{4}$/,
  'dd.MM.yyyy': /^\d{2}\.\d{2}\.\d{4}$/,
  'yyyy/MM/dd': /^\d{4}\/\d{2}\/\d{2}$/,
  'dd-MM-yyyy': /^\d{2}-\d{2}-\d{4}$/,
} as const;

export type DateFormatPattern = keyof typeof DATE_FORMAT_PATTERNS;

// Validation helpers
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  date?: Date;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DatePickerLocale {
  months: readonly string[];
  monthsShort: readonly string[];
  weekdays: readonly string[];
  weekdaysShort: readonly string[];
  weekdaysMin: readonly string[];
  today: string;
  clear: string;
  confirm: string;
  cancel: string;
  selectDate: string;
  selectTime: string;
  startDate: string;
  endDate: string;
  rangeSeparator: string;
  year: string;
  month: string;
  week: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
  now: string;
}

export const DEFAULT_LOCALE: DatePickerLocale = {
  months: MONTH_NAMES,
  monthsShort: MONTH_NAMES_SHORT,
  weekdays: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'],
  weekdaysShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  weekdaysMin: ['Н', 'П', 'В', 'С', 'Ч', 'П', 'С'],
  today: 'Сьогодні',
  clear: 'Очистити',
  confirm: 'Підтвердити',
  cancel: 'Скасувати',
  selectDate: 'Оберіть дату',
  selectTime: 'Оберіть час',
  startDate: 'Початкова дата',
  endDate: 'Кінцева дата',
  rangeSeparator: ' - ',
  year: 'рік',
  month: 'місяць',
  week: 'тиждень',
  day: 'день',
  hour: 'година',
  minute: 'хвилина',
  second: 'секунда',
  now: 'Зараз',
};
