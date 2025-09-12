import { computed, type Ref } from 'vue';
import type { DatePickerType, DatePickerValue, DateValue } from './types';
import { DEFAULT_FORMATS, MONTH_NAMES, MONTH_NAMES_SHORT, validateDateValue } from './types';

export const useDateFormatter = () => {
  const formatDate = (date: Date, formatStr: string): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours24 = date.getHours();
    const hours12 = hours24 > 12 ? hours24 - 12 : hours24 === 0 ? 12 : hours24;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const timestamp = date.getTime();

    let result = formatStr;

    // Year
    result = result.replace(/yyyy/g, String(year));
    result = result.replace(/yy/g, String(year).slice(-2));

    // Month
    result = result.replace(/MMMM/g, MONTH_NAMES[month]);
    result = result.replace(/MMM/g, MONTH_NAMES_SHORT[month]);
    result = result.replace(/MM/g, String(month + 1).padStart(2, '0'));
    result = result.replace(/M/g, String(month + 1));

    // Week
    const weekOfYear = getWeekOfYear(date);
    result = result.replace(/WW/g, String(weekOfYear).padStart(2, '0'));
    result = result.replace(/W/g, String(weekOfYear));

    // Day
    result = result.replace(/dd/g, String(day).padStart(2, '0'));
    result = result.replace(/d/g, String(day));

    // Hours
    result = result.replace(/HH/g, String(hours24).padStart(2, '0'));
    result = result.replace(/H/g, String(hours24));
    result = result.replace(/hh/g, String(hours12).padStart(2, '0'));
    result = result.replace(/h/g, String(hours12));

    // Minutes
    result = result.replace(/mm/g, String(minutes).padStart(2, '0'));
    result = result.replace(/m/g, String(minutes));

    // Seconds
    result = result.replace(/ss/g, String(seconds).padStart(2, '0'));
    result = result.replace(/s/g, String(seconds));

    // AM/PM
    result = result.replace(/A/g, hours24 >= 12 ? 'PM' : 'AM');
    result = result.replace(/a/g, hours24 >= 12 ? 'pm' : 'am');

    // Timestamp
    result = result.replace(/timestamp/g, String(timestamp));

    // Escape characters - handle [MM] syntax
    result = result.replace(/\[([^\]]+)\]/g, '$1');

    return result;
  };

  const parseDate = (value: DateValue): Date | null => {
    if (!value) return null;

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  const getWeekOfYear = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getDefaultFormat = (type: DatePickerType): string => {
    return DEFAULT_FORMATS[type] || 'yyyy-MM-dd';
  };

  return {
    formatDate,
    parseDate,
    getWeekOfYear,
    getDefaultFormat,
  };
};

export const useDatePicker = (
  modelValue: Ref<DatePickerValue>,
  type: Ref<DatePickerType>,
  format: Ref<string | undefined>,
  valueFormat: Ref<string | undefined>,
  rangeSeparator: Ref<string>
) => {
  const { formatDate, parseDate, getDefaultFormat } = useDateFormatter();

  const isRange = computed(() => {
    return ['datetimerange', 'daterange', 'monthrange', 'yearrange'].includes(type.value);
  });

  const displayFormat = computed(() => {
    return format.value || getDefaultFormat(type.value);
  });

  const outputFormat = computed(() => {
    return valueFormat.value || getDefaultFormat(type.value);
  });

  const parsedValue = computed(() => {
    if (!modelValue.value) return isRange.value ? [null, null] : null;

    if (isRange.value) {
      if (Array.isArray(modelValue.value) && modelValue.value.length === 2) {
        return [parseDate(modelValue.value[0]), parseDate(modelValue.value[1])];
      }
      return [null, null];
    } else {
      return parseDate(modelValue.value as DateValue);
    }
  });

  const displayText = computed(() => {
    if (isRange.value) {
      const [start, end] = parsedValue.value as [Date | null, Date | null];
      if (start && end) {
        const startText = formatDate(start, displayFormat.value);
        const endText = formatDate(end, displayFormat.value);
        return [startText, endText];
      } else if (start) {
        return [formatDate(start, displayFormat.value), ''];
      }
      return ['', ''];
    } else {
      const date = parsedValue.value as Date | null;
      return date ? formatDate(date, displayFormat.value) : '';
    }
  });

  const hasDisplayValue = computed(() => {
    if (isRange.value) {
      const [start, end] = displayText.value as [string, string];
      return start || end; // Показуємо текст якщо є хоча б одна дата
    } else {
      return !!displayText.value; // Для одиночного значення просто перевіряємо truthiness
    }
  });

  const formatOutput = (date: Date | Date[]): DatePickerValue => {
    if (Array.isArray(date)) {
      // Переконуємося, що масив має принаймні 2 елементи, доповнюємо якщо потрібно
      const startDate = date[0];
      const endDate = date[1] || date[0] || new Date(); // Fallback до першої дати або поточної

      if (valueFormat.value === 'timestamp') {
        return [startDate.getTime(), endDate.getTime()] as [number, number];
      } else if (valueFormat.value) {
        return [formatDate(startDate, outputFormat.value), formatDate(endDate, outputFormat.value)] as [string, string];
      }
      return [startDate, endDate] as [Date, Date];
    } else {
      if (valueFormat.value === 'timestamp') {
        return date.getTime();
      } else if (valueFormat.value) {
        return formatDate(date, outputFormat.value);
      }
      return date;
    }
  };

  const validate = (required = false) => {
    return validateDateValue(modelValue.value, type.value, required);
  };

  return {
    isRange,
    displayFormat,
    outputFormat,
    parsedValue,
    displayText,
    hasDisplayValue,
    formatOutput,
    validate,
    formatDate,
    parseDate,
  };
};

export const useCalendar = (currentDate: Ref<Date>) => {
  const calendarDates = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);

    // Start from Sunday of the week containing the first day
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const dates = [];
    const current = new Date(startDate);

    // Generate 6 weeks (42 days) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  });

  const monthsInYear = computed(() => {
    return MONTH_NAMES_SHORT.map((name, index) => ({
      name,
      index,
      value: new Date(currentDate.value.getFullYear(), index, 1),
    }));
  });

  const yearsInDecade = computed(() => {
    const currentYear = currentDate.value.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    const years = [];

    for (let i = startYear; i < startYear + 10; i++) {
      years.push({
        year: i,
        value: new Date(i, 0, 1),
      });
    }

    return years;
  });

  const decadeRange = computed(() => {
    const currentYear = currentDate.value.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    return `${startYear} - ${startYear + 9}`;
  });

  const isDateInCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.value.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isSameMonth = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
  };

  const isSameYear = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate.value);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    currentDate.value = newDate;
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate.value);
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    currentDate.value = newDate;
  };

  const navigateDecade = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate.value);
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 10);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 10);
    }
    currentDate.value = newDate;
  };

  return {
    calendarDates,
    monthsInYear,
    yearsInDecade,
    decadeRange,
    isDateInCurrentMonth,
    isToday,
    isSameDate,
    isSameMonth,
    isSameYear,
    navigateMonth,
    navigateYear,
    navigateDecade,
  };
};
