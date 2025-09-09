// helpers.ts
import type {
  CalendarDay,
  CalendarMonth,
  CalendarWeek,
  CalendarYear,
  DatePickerLocale,
  DatePickerType,
  DatePickerValue,
  FormatToken,
  PredefinedShortcuts,
} from './types';

// Українська локалізація за замовчуванням
export const DEFAULT_LOCALE: DatePickerLocale = {
  months: [
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
  ],
  monthsShort: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
  weekdays: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'],
  weekdaysShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  weekdaysMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  firstDayOfWeek: 1, // Понеділок
  weekHeader: 'Тиж',
  dateFormat: 'dd.MM.yyyy',
  timeFormat: 'HH:mm:ss',
  today: 'Сьогодні',
  clear: 'Очистити',
  confirm: 'Підтвердити',
  selectTime: 'Виберіть час',
  selectDate: 'Виберіть дату',
  year: 'Рік',
  month: 'Місяць',
  week: 'Тиждень',
  day: 'День',
  hour: 'Година',
  minute: 'Хвилина',
  second: 'Секунда',
  am: 'дп',
  pm: 'пп',
};

// Формати за замовчуванням для різних типів
export const DEFAULT_FORMATS: Record<DatePickerType, { display: string; value: string }> = {
  date: { display: 'dd.MM.yyyy', value: 'yyyy-MM-dd' },
  week: { display: 'yyyy-WW', value: 'yyyy-WW' },
  month: { display: 'MM.yyyy', value: 'yyyy-MM' },
  year: { display: 'yyyy', value: 'yyyy' },
  datetime: { display: 'dd.MM.yyyy HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss' },
};

/**
 * Перетворює значення в об'єкт Date
 */
export function toDate(value: DatePickerValue): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return isValidDate(value) ? value : null;
  }

  if (typeof value === 'number') {
    const date = new Date(value);
    return isValidDate(date) ? date : null;
  }

  if (typeof value === 'string') {
    const date = new Date(value);
    return isValidDate(date) ? date : null;
  }

  return null;
}

/**
 * Перевіряє чи є дата валідною
 */
export function isValidDate(date: Date | null | undefined): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Порівнює дві дати (без часу)
 */
export function isSameDate(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Порівнює два тижні
 */
export function isSameWeek(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  const week1 = getWeekNumber(date1);
  const week2 = getWeekNumber(date2);
  return week1.year === week2.year && week1.week === week2.week;
}

/**
 * Порівнює два місяці
 */
export function isSameMonth(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

/**
 * Порівнює два роки
 */
export function isSameYear(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear();
}

/**
 * Отримує номер тижня
 */
export function getWeekNumber(date: Date): { week: number; year: number } {
  const tempDate = new Date(date.getTime());
  const dayOfWeek = (tempDate.getDay() + 6) % 7; // Понеділок = 0
  tempDate.setDate(tempDate.getDate() - dayOfWeek + 3); // Четвер поточного тижня
  const firstThursday = tempDate.valueOf();
  tempDate.setMonth(0, 1); // 1 січня
  if (tempDate.getDay() !== 4) {
    tempDate.setMonth(0, 1 + ((4 - tempDate.getDay() + 7) % 7));
  }
  const week = 1 + Math.ceil((firstThursday - tempDate.valueOf()) / 604800000);
  return { week, year: tempDate.getFullYear() };
}

/**
 * Отримує дату початку тижня
 */
export function getWeekStart(date: Date, firstDayOfWeek: number = 1): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Отримує дату кінця тижня
 */
export function getWeekEnd(date: Date, firstDayOfWeek: number = 1): Date {
  const start = getWeekStart(date, firstDayOfWeek);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Отримує дату початку місяця
 */
export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Отримує дату кінця місяця
 */
export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Отримує дату початку року
 */
export function getYearStart(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

/**
 * Отримує дату кінця року
 */
export function getYearEnd(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

/**
 * Парсить формат дати на токени
 */
export function parseFormat(format: string): FormatToken[] {
  const tokens: FormatToken[] = [];
  let i = 0;

  while (i < format.length) {
    if (format[i] === '[') {
      // Escaped sequence
      const end = format.indexOf(']', i);
      if (end !== -1) {
        tokens.push({
          type: 'literal',
          value: format.slice(i + 1, end),
          length: end - i + 1,
          escape: true,
        });
        i = end + 1;
        continue;
      }
    }

    const char = format[i];
    let count = 1;

    while (i + count < format.length && format[i + count] === char) {
      count++;
    }

    const tokenValue = format.slice(i, i + count);

    switch (char) {
      case 'y':
        tokens.push({ type: 'year', value: tokenValue, length: count });
        break;
      case 'M':
        tokens.push({ type: 'month', value: tokenValue, length: count });
        break;
      case 'W':
        tokens.push({ type: 'week', value: tokenValue, length: count });
        break;
      case 'd':
        tokens.push({ type: 'day', value: tokenValue, length: count });
        break;
      case 'H':
      case 'h':
        tokens.push({ type: 'hour', value: tokenValue, length: count });
        break;
      case 'm':
        tokens.push({ type: 'minute', value: tokenValue, length: count });
        break;
      case 's':
        tokens.push({ type: 'second', value: tokenValue, length: count });
        break;
      case 'A':
      case 'a':
        tokens.push({ type: 'ampm', value: tokenValue, length: count });
        break;
      default:
        tokens.push({ type: 'literal', value: tokenValue, length: count });
    }

    i += count;
  }

  return tokens;
}

/**
 * Форматує дату відповідно до заданого формату
 */
export function formatDate(date: Date | null, format: string, locale: DatePickerLocale = DEFAULT_LOCALE): string {
  if (!date || !isValidDate(date)) return '';

  if (format === 'timestamp') {
    return date.getTime().toString();
  }

  const tokens = parseFormat(format);

  return tokens
    .map(token => {
      switch (token.type) {
        case 'year':
          return token.length === 2 ? String(date.getFullYear()).slice(-2) : String(date.getFullYear());

        case 'month':
          if (token.length === 1) return String(date.getMonth() + 1);
          if (token.length === 2) return String(date.getMonth() + 1).padStart(2, '0');
          if (token.length === 3) return locale.monthsShort[date.getMonth()];
          return locale.months[date.getMonth()];

        case 'week':
          const weekData = getWeekNumber(date);
          return token.length === 1 ? String(weekData.week) : String(weekData.week).padStart(2, '0');

        case 'day':
          return token.length === 1 ? String(date.getDate()) : String(date.getDate()).padStart(2, '0');

        case 'hour':
          let hours = date.getHours();
          if (token.value.includes('h')) {
            // 12-hour format
            hours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
          }
          return token.length === 1 ? String(hours) : String(hours).padStart(2, '0');

        case 'minute':
          return token.length === 1 ? String(date.getMinutes()) : String(date.getMinutes()).padStart(2, '0');

        case 'second':
          return token.length === 1 ? String(date.getSeconds()) : String(date.getSeconds()).padStart(2, '0');

        case 'ampm':
          const ampm = date.getHours() < 12 ? locale.am : locale.pm;
          return token.value === token.value.toUpperCase() ? ampm.toUpperCase() : ampm.toLowerCase();

        case 'literal':
        default:
          return token.value;
      }
    })
    .join('');
}

/**
 * Парсить рядок дати відповідно до формату
 */
export function parseDate(dateString: string, format: string, locale: DatePickerLocale = DEFAULT_LOCALE): Date | null {
  if (!dateString || !format) return null;

  if (format === 'timestamp') {
    const timestamp = parseInt(dateString, 10);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  // Спрощений парсинг для основних форматів
  const date = new Date(dateString);
  return isValidDate(date) ? date : null;
}

/**
 * Генерує дні календаря для місяця
 */
export function generateCalendarDays(
  year: number,
  month: number,
  firstDayOfWeek: number = 1,
  selectedDate?: Date | null,
  selectedRange?: [Date | null, Date | null],
  hoveredDate?: Date | null,
  disabledDate?: (date: Date) => boolean
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Визначаємо початкову дату для відображення
  let startDate = new Date(firstDayOfMonth);
  const dayOfWeek = (firstDayOfMonth.getDay() - firstDayOfWeek + 7) % 7;
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Генеруємо 42 дні (6 тижнів)
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    currentDate.setHours(0, 0, 0, 0);

    const isCurrentMonth = currentDate.getMonth() === month;
    const isPrevMonth = currentDate.getMonth() < month || (currentDate.getMonth() === 11 && month === 0);
    const isNextMonth = !isCurrentMonth && !isPrevMonth;

    const isSelected = selectedDate ? isSameDate(currentDate, selectedDate) : false;
    const isToday = isSameDate(currentDate, today);
    const isDisabled = disabledDate ? disabledDate(currentDate) : false;
    const isHovered = hoveredDate ? isSameDate(currentDate, hoveredDate) : false;

    let isInRange = false;
    let isRangeStart = false;
    let isRangeEnd = false;

    if (selectedRange && selectedRange[0] && selectedRange[1]) {
      const [start, end] = selectedRange;
      isRangeStart = isSameDate(currentDate, start);
      isRangeEnd = isSameDate(currentDate, end);
      isInRange = currentDate >= start && currentDate <= end;
    }

    days.push({
      date: currentDate,
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      isCurrentMonth,
      isPrevMonth,
      isNextMonth,
      isSelected,
      isInRange,
      isRangeStart,
      isRangeEnd,
      isToday,
      isDisabled,
      isHovered,
    });
  }

  return days;
}

/**
 * Генерує тижні для відображення
 */
export function generateCalendarWeeks(year: number, locale: DatePickerLocale = DEFAULT_LOCALE): CalendarWeek[] {
  const weeks: CalendarWeek[] = [];
  const startOfYear = new Date(year, 0, 1);

  // Знаходимо перший тиждень року
  let currentWeek = getWeekNumber(startOfYear);
  let currentDate = getWeekStart(startOfYear, locale.firstDayOfWeek);

  while (currentDate.getFullYear() <= year) {
    const weekData = getWeekNumber(currentDate);
    const startDate = getWeekStart(currentDate, locale.firstDayOfWeek);
    const endDate = getWeekEnd(currentDate, locale.firstDayOfWeek);

    weeks.push({
      weekNumber: weekData.week,
      year: weekData.year,
      startDate,
      endDate,
      isSelected: false,
      isDisabled: false,
      isHovered: false,
    });

    currentDate.setDate(currentDate.getDate() + 7);
    if (currentDate.getFullYear() > year) break;
  }

  return weeks;
}

/**
 * Генерує місяці для відображення
 */
export function generateCalendarMonths(year: number, locale: DatePickerLocale = DEFAULT_LOCALE): CalendarMonth[] {
  const months: CalendarMonth[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  for (let i = 0; i < 12; i++) {
    months.push({
      month: i,
      year,
      name: locale.months[i],
      shortName: locale.monthsShort[i],
      isSelected: false,
      isDisabled: false,
      isCurrent: year === currentYear && i === currentMonth,
      isHovered: false,
    });
  }

  return months;
}

/**
 * Генерує роки для відображення
 */
export function generateCalendarYears(startYear: number, endYear: number): CalendarYear[] {
  const years: CalendarYear[] = [];
  const currentYear = new Date().getFullYear();

  for (let year = startYear; year <= endYear; year++) {
    years.push({
      year,
      isSelected: false,
      isDisabled: false,
      isCurrent: year === currentYear,
      isHovered: false,
    });
  }

  return years;
}

/**
 * Переднастроєні шорткати
 */
export const PREDEFINED_SHORTCUTS: PredefinedShortcuts = {
  today: () => new Date(),
  yesterday: () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  },
  thisWeek: () => [getWeekStart(new Date()), getWeekEnd(new Date())],
  lastWeek: () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return [getWeekStart(lastWeek), getWeekEnd(lastWeek)];
  },
  thisMonth: () => [getMonthStart(new Date()), getMonthEnd(new Date())],
  lastMonth: () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return [getMonthStart(lastMonth), getMonthEnd(lastMonth)];
  },
  thisYear: () => [getYearStart(new Date()), getYearEnd(new Date())],
  lastYear: () => {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, 0, 1);
    return [getYearStart(lastYear), getYearEnd(lastYear)];
  },
  last7Days: () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return [start, end];
  },
  last30Days: () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);
    return [start, end];
  },
  last3Months: () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 3);
    return [start, end];
  },
};

/**
 * Клонує дату
 */
export function cloneDate(date: Date | null): Date | null {
  return date ? new Date(date.getTime()) : null;
}

/**
 * Додає до дати певну кількість днів/місяців/років
 */
export function addToDate(date: Date, amount: number, unit: 'day' | 'week' | 'month' | 'year'): Date {
  const result = new Date(date);

  switch (unit) {
    case 'day':
      result.setDate(result.getDate() + amount);
      break;
    case 'week':
      result.setDate(result.getDate() + amount * 7);
      break;
    case 'month':
      result.setMonth(result.getMonth() + amount);
      break;
    case 'year':
      result.setFullYear(result.getFullYear() + amount);
      break;
  }

  return result;
}

/**
 * Перевіряє чи дата знаходиться в діапазоні
 */
export function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  return date >= start && date <= end;
}
