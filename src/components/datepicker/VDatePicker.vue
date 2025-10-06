<script lang="ts" setup>
  import { computed, nextTick, onMounted, onUnmounted, ref, toRef, watch } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import VButton from '@/components/button/VButton.vue';
  import { useDropdown } from '@/components/dropdown/useDropdown';
  import { useCalendar, useDatePicker } from '@/components/datepicker/helpers';
  import { type VDatePickerEmits, type VDatePickerProps, WEEKDAY_NAMES_SHORT } from '@/components/datepicker/types';
  import VTimePicker from '@/components/timepicker/VTimePicker.vue';
  import type { TimePickerValue } from '@/components/timepicker/types';

  // ===== PROPS & DEFAULTS =====
  const props = withDefaults(defineProps<VDatePickerProps>(), {
    type: 'date',
    placeholder: 'Оберіть дату',
    startPlaceholder: 'Початкова дата',
    endPlaceholder: 'Кінцева дата',
    rangeSeparator: ' - ',
    format: '',
    valueFormat: '',
    disabled: false,
    clearable: true,
    size: 'default',
    // Time props
    hourStep: 1,
    minuteStep: 1,
    secondStep: 1,
    showSeconds: true,
    use12Hours: false,
    hideDisabledOptions: false,
    maxDateRange: Infinity,
    previousDateDisabled: false
  });

  // ===== EMITS =====
  const emit = defineEmits<VDatePickerEmits>();

  // ===== TEMPLATE REFS =====
  const datePickerRef = ref<HTMLElement>();
  const triggerRef = ref<HTMLElement>();
  const dropdownRef = ref<HTMLElement>();
  const startTimePickerRef = ref<InstanceType<typeof VTimePicker>>();
  const endTimePickerRef = ref<InstanceType<typeof VTimePicker>>();

  // ===== INITIAL TIME VALUES =====
  const formatDefaultTime = (hours: number, minutes: number, seconds: number): string => {
    if (props.use12Hours) {
      const period = hours >= 12 ? 'PM' : 'AM';
      const adjustedHours = hours % 12 || 12;
      return props.showSeconds
        ? `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`
        : `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    } else {
      return props.showSeconds
        ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
  };

  const resolveDate = (val: unknown): Date | null => {
    if (val instanceof Date) return val;
    if (typeof val === 'number') return new Date(val);
    return null;
  };

  const getInitialStartTime = () => {
    if (props.modelValue) {
      if (props.type === 'datetimerange' && Array.isArray(props.modelValue)) {
        const start = resolveDate(props.modelValue[0]);
        if (start) {
          return formatDefaultTime(start.getHours(), start.getMinutes(), start.getSeconds());
        }
      }
      if (props.type === 'datetime') {
        const date = resolveDate(props.modelValue);
        if (date) {
          return formatDefaultTime(date.getHours(), date.getMinutes(), date.getSeconds());
        }
      }
    }

    // дефолти
    if (props.type === 'datetimerange') {
      return formatDefaultTime(0, 0, 0);
    }
    if (props.type === 'datetime') {
      const now = new Date();
      return formatDefaultTime(now.getHours(), now.getMinutes(), now.getSeconds());
    }
    return formatDefaultTime(0, 0, 0);
  };

  const getInitialEndTime = () => {
    if (props.modelValue) {
      if (props.type === 'datetimerange' && Array.isArray(props.modelValue)) {
        const end = resolveDate(props.modelValue[1]);
        if (end) {
          return formatDefaultTime(end.getHours(), end.getMinutes(), end.getSeconds());
        }
      }
      if (props.type === 'datetime') {
        const date = resolveDate(props.modelValue);
        if (date) {
          return formatDefaultTime(date.getHours(), date.getMinutes(), date.getSeconds());
        }
      }
    }

    // дефолти
    if (props.type === 'datetimerange') {
      return formatDefaultTime(23, 59, 59);
    }
    if (props.type === 'datetime') {
      const now = new Date();
      return formatDefaultTime(now.getHours(), now.getMinutes(), now.getSeconds());
    }
    return formatDefaultTime(23, 59, 59);
  };

  // ===== STATE =====
  const state = {
    isFocused: ref(false),
    currentDate: ref(new Date()),
    rightCurrentDate: ref(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)),
    viewMode: ref<'date' | 'month' | 'year'>('date'),
    startDate: ref<Date | null>(null),
    endDate: ref<Date | null>(null),
    isSelectingEnd: ref(false),
    hoverDate: ref<Date | null>(null),
    // Time state for datetime types
    startTime: ref<TimePickerValue>(getInitialStartTime()),
    endTime: ref<TimePickerValue>(getInitialEndTime()),
  };

  // ===== COMPOSABLES =====
  const modelValueRef = toRef(props, 'modelValue');
  const typeRef = toRef(props, 'type');
  const formatRef = toRef(props, 'format');
  const valueFormatRef = toRef(props, 'valueFormat');
  const rangeSeparatorRef = toRef(props, 'rangeSeparator');

  const {
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
  } = useDatePicker(modelValueRef, typeRef, formatRef, valueFormatRef, rangeSeparatorRef);

  // Календар для лівої частини
  const {
    calendarDates: leftCalendarDates,
    monthsInYear: leftMonthsInYear,
    yearsInDecade: leftYearsInDecade,
    decadeRange: leftDecadeRange,
    isDateInCurrentMonth: leftIsDateInCurrentMonth,
    isToday,
    isSameDate,
    isSameMonth,
    isSameYear,
    navigateMonth: leftNavigateMonth,
    navigateYear: leftNavigateYear,
    navigateDecade: leftNavigateDecade,
  } = useCalendar(state.currentDate);

  // Календар для правої частини
  const {
    calendarDates: rightCalendarDates,
    monthsInYear: rightMonthsInYear,
    yearsInDecade: rightYearsInDecade,
    decadeRange: rightDecadeRange,
    isDateInCurrentMonth: rightIsDateInCurrentMonth,
    navigateMonth: rightNavigateMonth,
    navigateYear: rightNavigateYear,
    navigateDecade: rightNavigateDecade,
  } = useCalendar(state.rightCurrentDate);

  // ===== COMPUTED VALUES =====
  const getInitialViewMode = (type: string): 'date' | 'month' | 'year' => {
    switch (type) {
      case 'year':
      case 'yearrange':
        return 'year';
      case 'month':
      case 'monthrange':
        return 'month';
      default:
        return 'date';
    }
  };

  const isDateTimeType = computed(() => {
    return props.type === 'datetime' || props.type === 'datetimerange';
  });

  const showTimePicker = computed(() => {
    return isDateTimeType.value;
  });

  const disabledHoursValue = computed<() => number[]>(() => {
    // Return a function, not call it
    return () => {
      const now = new Date();
      let hours: number[] = [];

      if (props.disabledHours) {
        hours = [...props.disabledHours()]; // Call the function from props
      }

      if (props.previousDateDisabled) {
        const currentHour = now.getHours();
        for (let h = 0; h < currentHour; h++) {
          if (!hours.includes(h)) {
            hours.push(h);
          }
        }
      }

      return hours;
    };
  });

  const disabledMinutesValue = computed<(selectedHour: number) => number[]>(() => {
    return (selectedHour: number) => {
      const now = new Date();
      let minutes: number[] = [];

      if (props.disabledMinutes) {
        minutes = [...props.disabledMinutes(selectedHour)]; // Call with selectedHour
      }

      if (props.previousDateDisabled) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        if (selectedHour === currentHour) {
          for (let m = 0; m < currentMinute; m++) {
            if (!minutes.includes(m)) {
              minutes.push(m);
            }
          }
        }
      }

      return minutes;
    };
  });

  const disabledSecondsValue = computed<(selectedHour: number, selectedMinute: number) => number[]>(() => {
    return (selectedHour: number, selectedMinute: number) => {
      const now = new Date();
      let seconds: number[] = [];

      if (props.disabledSeconds) {
        seconds = [...props.disabledSeconds(selectedHour, selectedMinute)]; // Call with both params
      }

      if (props.previousDateDisabled) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();

        if (selectedHour === currentHour && selectedMinute === currentMinute) {
          for (let s = 0; s < currentSecond; s++) {
            if (!seconds.includes(s)) {
              seconds.push(s);
            }
          }
        }
      }

      return seconds;
    };
  });

  // ===== DROPDOWN INTEGRATION =====
  const {
    visible: isDropdownVisible,
    parentVisible,
    dropdownPosition,
    show: showDropdown,
    hide: hideDropdown,
    toggle: toggleDropdown,
    updatePosition,
  } = useDropdown(triggerRef, dropdownRef, {
    trigger: 'click',
    placement: 'bottom-start',
    showTimeout: 0,
    hideTimeout: 150,
    disabled: props.disabled,
    hideOnClick: false,
    onVisibleChange: visible => {
      if (visible) {
        nextTick(() => updatePosition());
      }
    },
  });

  const showClearButton = computed(() => {
    return props.clearable && !props.disabled && hasDisplayValue.value;
  });

  const currentPlaceholder = computed(() => {
    if (isRange.value) {
      if (state.isSelectingEnd.value) {
        return props.endPlaceholder;
      }
      return props.startPlaceholder;
    }
    return props.placeholder;
  });

  const pickerClasses = computed(() => [
    'vt-datepicker',
    `vt-datepicker--${props.size}`,
    `vt-datepicker--${props.type}`,
    {
      'vt-datepicker--disabled': props.disabled,
      'vt-datepicker--focused': state.isFocused.value,
      'vt-datepicker--range': isRange.value,
      'vt-datepicker--open': isDropdownVisible.value,
      'vt-datepicker--with-time': showTimePicker.value,
      'vt-datepicker--error': !!props.errorMessage,
    },
  ]);

  // Повернення помилки
  const displayErrorMessage = computed(() => {
    if (props.errorMessage) return props.errorMessage;
    return '';
  });

  const dropdownStyle = computed(() => ({
    ...dropdownPosition.value,
    position: 'absolute' as const,
    zIndex: 2000,
  }));

  const showDualCalendar = computed(() => {
    return (props.type === 'daterange' || props.type === 'datetimerange') && state.viewMode.value === 'date';
  });

  // ===== SELECTION LOGIC =====
  const isDateClickable = (date: Date, isLeftCalendar = false, isRightCalendar = false): boolean => {
    if (props.type === 'daterange' || props.type === 'datetimerange') {
      if (isLeftCalendar && !leftIsDateInCurrentMonth(date)) {
        return false;
      }
      if (isRightCalendar && !rightIsDateInCurrentMonth(date)) {
        return false;
      }
    }

    // previousDate: забороняє вибір дат у минулому
    if (props.previousDateDisabled) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      if (checkDate < today) {
        return false;
      }
    }

    // maxDateRange: перевірка максимального діапазону
    if (props.maxDateRange && (props.type === 'daterange' || props.type === 'datetimerange')) {
      if (state.startDate.value && state.isSelectingEnd.value) {
        const start = new Date(state.startDate.value);
        start.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(checkDate.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > props.maxDateRange) {
          return false;
        }
      }
    }

    return true;
  };

  const isDateSelected = (date: Date, isLeftCalendar = false, isRightCalendar = false): boolean => {
    if (props.type === 'daterange' || props.type === 'datetimerange') {
      if (isLeftCalendar && !leftIsDateInCurrentMonth(date)) {
        return false;
      }
      if (isRightCalendar && !rightIsDateInCurrentMonth(date)) {
        return false;
      }
    }

    if (isRange.value) {
      if (state.startDate.value && state.endDate.value) {
        const start = new Date(state.startDate.value);
        const end = new Date(state.endDate.value);
        const currentDate = new Date(date);

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        return currentDate.getTime() === start.getTime() || currentDate.getTime() === end.getTime();
      } else if (state.startDate.value) {
        const start = new Date(state.startDate.value);
        const currentDate = new Date(date);

        start.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        return currentDate.getTime() === start.getTime();
      }
      return false;
    } else {
      const selected = state.startDate.value || (parsedValue.value as Date | null);
      if (!selected) return false;

      const selectedDate = new Date(selected);
      const currentDate = new Date(date);

      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      return currentDate.getTime() === selectedDate.getTime();
    }
  };

  const isDateInRange = (date: Date, isLeftCalendar = false, isRightCalendar = false): boolean => {
    if (!isRange.value) return false;

    if (props.type === 'daterange' || props.type === 'datetimerange') {
      if (isLeftCalendar && !leftIsDateInCurrentMonth(date)) {
        return false;
      }
      if (isRightCalendar && !rightIsDateInCurrentMonth(date)) {
        return false;
      }
    }

    if (state.startDate.value && state.endDate.value) {
      const start = new Date(state.startDate.value);
      const end = new Date(state.endDate.value);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);

      return currentDate >= start && currentDate <= end;
    }

    if (state.startDate.value && state.isSelectingEnd.value && state.hoverDate.value) {
      const start = new Date(state.startDate.value);
      const hover = new Date(state.hoverDate.value);
      const currentDate = new Date(date);

      start.setHours(0, 0, 0, 0);
      hover.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      const minDate = start <= hover ? start : hover;
      const maxDate = start <= hover ? hover : start;

      return currentDate >= minDate && currentDate <= maxDate;
    }

    return false;
  };

  const isMonthSelected = (monthIndex: number, currentDateRef: Date): boolean => {
    if (isRange.value) {
      if (state.startDate.value && state.endDate.value) {
        const currentYear = currentDateRef.getFullYear();
        const startMonth = state.startDate.value.getMonth();
        const startYear = state.startDate.value.getFullYear();
        const endMonth = state.endDate.value.getMonth();
        const endYear = state.endDate.value.getFullYear();

        return (
          (currentYear === startYear && monthIndex === startMonth) ||
          (currentYear === endYear && monthIndex === endMonth)
        );
      } else if (state.startDate.value) {
        const startMonth = state.startDate.value.getMonth();
        const startYear = state.startDate.value.getFullYear();
        return currentDateRef.getFullYear() === startYear && monthIndex === startMonth;
      }
      return false;
    } else {
      const selected = parsedValue.value as Date | null;
      return selected
        ? selected.getFullYear() === currentDateRef.getFullYear() && selected.getMonth() === monthIndex
        : false;
    }
  };

  const isMonthInRange = (monthIndex: number, currentDateRef: Date): boolean => {
    if (!isRange.value) return false;

    const currentYear = currentDateRef.getFullYear();
    const currentMonth = new Date(currentYear, monthIndex, 1);

    if (state.startDate.value && state.endDate.value) {
      const start = new Date(state.startDate.value.getFullYear(), state.startDate.value.getMonth(), 1);
      const end = new Date(state.endDate.value.getFullYear(), state.endDate.value.getMonth(), 1);

      return currentMonth >= start && currentMonth <= end && !isMonthSelected(monthIndex, currentDateRef);
    }

    if (state.startDate.value && state.isSelectingEnd.value && state.hoverDate.value) {
      const start = new Date(state.startDate.value.getFullYear(), state.startDate.value.getMonth(), 1);
      const hover = new Date(state.hoverDate.value.getFullYear(), state.hoverDate.value.getMonth(), 1);

      const minDate = start <= hover ? start : hover;
      const maxDate = start <= hover ? hover : start;

      return currentMonth >= minDate && currentMonth <= maxDate && !isMonthSelected(monthIndex, currentDateRef);
    }

    return false;
  };

  const isYearSelected = (year: number): boolean => {
    if (isRange.value) {
      if (state.startDate.value && state.endDate.value) {
        return year === state.startDate.value.getFullYear() || year === state.endDate.value.getFullYear();
      } else if (state.startDate.value) {
        return state.startDate.value.getFullYear() === year;
      }
      return false;
    } else {
      const selected = parsedValue.value as Date | null;
      return selected ? selected.getFullYear() === year : false;
    }
  };

  const isYearInRange = (year: number): boolean => {
    if (!isRange.value) return false;

    if (state.startDate.value && state.endDate.value) {
      const startYear = state.startDate.value.getFullYear();
      const endYear = state.endDate.value.getFullYear();

      return year >= startYear && year <= endYear && !isYearSelected(year);
    }

    if (state.startDate.value && state.isSelectingEnd.value && state.hoverDate.value) {
      const startYear = state.startDate.value.getFullYear();
      const hoverYear = state.hoverDate.value.getFullYear();

      const minYear = Math.min(startYear, hoverYear);
      const maxYear = Math.max(startYear, hoverYear);

      return year >= minYear && year <= maxYear && !isYearSelected(year);
    }

    return false;
  };

  // ===== TIME HELPERS =====
  const combineDateTime = (date: Date, time: TimePickerValue): Date => {
    const result = new Date(date);

    if (time && typeof time === 'string') {
      // Parse time string like "14:30:00" or "2:30:00 PM"
      const timeMatch = time.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s?(AM|PM)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const seconds = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
        const period = timeMatch[4]?.toUpperCase();

        if (period) {
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
        }

        result.setHours(hours, minutes, seconds, 0);
      }
    }

    return result;
  };

  const extractTime = (date: Date): string => {
    if (!date) return '';

    if (props.use12Hours) {
      return date.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        ...(props.showSeconds && { second: '2-digit' }),
      });
    } else {
      return date.toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        ...(props.showSeconds && { second: '2-digit' }),
      });
    }
  };

  // ===== EVENT HANDLERS =====
  const handleClickOutside = (event: MouseEvent) => {
    if (!isDropdownVisible.value) return;

    const target = event.target as Node;
    if (datePickerRef.value?.contains(target) || dropdownRef.value?.contains(target)) {
      return;
    }

    hideDropdown();
  };

  const handleTriggerClick = () => {
    if (props.disabled) return;
    toggleDropdown();
  };

  const handleFocus = () => {
    state.isFocused.value = true;
    emit('focus', datePickerRef.value);
  };

  const handleBlur = () => {
    state.isFocused.value = false;
    emit('blur', datePickerRef.value);
  };

  const handleClear = () => {
    const newValue = null;
    emit('update:modelValue', newValue);
    emit('change', newValue);

    // Reset state
    state.startDate.value = null;
    state.endDate.value = null;
    state.isSelectingEnd.value = false;
    state.hoverDate.value = null;

    // Reset time values to defaults
    state.startTime.value = getInitialStartTime();
    state.endTime.value = getInitialEndTime();
  };

  const handleDateClick = (date: Date, isLeftCalendar = false, isRightCalendar = false) => {
    if (props.disabled || !date) return;

    if (!isDateClickable(date, isLeftCalendar, isRightCalendar)) return;

    if (isRange.value) {
      if (!state.startDate.value || (state.startDate.value && state.endDate.value)) {
        state.startDate.value = new Date(date);
        state.endDate.value = null;
        state.isSelectingEnd.value = true;
        state.hoverDate.value = null;

        // For datetime types, reset to default times
        if (isDateTimeType.value) {
          state.startTime.value = '00:00:00';
          state.endTime.value = null;
        }
      } else if (state.startDate.value && !state.endDate.value) {
        const startDate = new Date(state.startDate.value);
        const endDate = new Date(date);

        if (endDate >= startDate) {
          state.endDate.value = endDate;
        } else {
          state.endDate.value = startDate;
          state.startDate.value = endDate;
        }

        // For datetime types, set end time to 23:59:59
        if (isDateTimeType.value) {
          state.endTime.value = '23:59:59';
        }

        state.isSelectingEnd.value = false;
        state.hoverDate.value = null;

        // For pure date range, emit immediately
        if (!isDateTimeType.value) {
          const rangeValue = [state.startDate.value, state.endDate.value];
          try {
            const outputValue = formatOutput(rangeValue);
            emit('update:modelValue', outputValue);
            emit('change', outputValue);
          } catch (error) {
            console.warn('Error formatting output:', error);
          }
          hideDropdown();
        }
      }
    } else {
      if (isDateTimeType.value) {
        // For datetime, set the date and default time
        state.startDate.value = new Date(date);
        state.startTime.value = '00:00:00';
      } else {
        // For pure date, emit immediately
        try {
          const outputValue = formatOutput(new Date(date));
          emit('update:modelValue', outputValue);
          emit('change', outputValue);
          hideDropdown();
        } catch (error) {
          console.warn('Error formatting single date output:', error);
        }
      }
    }
  };

  const handleDateHover = (date: Date, isLeftCalendar = false, isRightCalendar = false) => {
    if (props.type === 'daterange' || props.type === 'datetimerange') {
      if (isLeftCalendar && !leftIsDateInCurrentMonth(date)) {
        return;
      }
      if (isRightCalendar && !rightIsDateInCurrentMonth(date)) {
        return;
      }
    }

    if (isRange.value && state.isSelectingEnd.value && state.startDate.value) {
      state.hoverDate.value = new Date(date);
    }
  };

  const handleDateLeave = () => {
    if (isRange.value && state.isSelectingEnd.value) {
      state.hoverDate.value = null;
    }
  };

  const handleTimeChange = (timeValue: TimePickerValue, isEndTime = false) => {
    if (isEndTime) {
      state.endTime.value = timeValue;
    } else {
      state.startTime.value = timeValue;
    }

    // Auto-emit for single datetime when both date and time are set
    if (!isRange.value && state.startDate.value && state.startTime.value) {
      const dateTime = combineDateTime(state.startDate.value, state.startTime.value);
      try {
        const outputValue = formatOutput(dateTime);
        emit('update:modelValue', outputValue);
        emit('change', outputValue);
      } catch (error) {
        console.warn('Error formatting datetime output:', error);
      }
    }
  };

  const handleConfirm = () => {
    if (isDateTimeType.value) {
      if (isRange.value && state.startDate.value && state.endDate.value) {
        const startDateTime = combineDateTime(state.startDate.value, state.startTime.value || '00:00:00');
        const endDateTime = combineDateTime(state.endDate.value, state.endTime.value || '23:59:59');

        const rangeValue = [startDateTime, endDateTime];
        try {
          const outputValue = formatOutput(rangeValue);
          emit('update:modelValue', outputValue);
          emit('change', outputValue);
        } catch (error) {
          console.warn('Error formatting datetime range output:', error);
        }
      } else if (!isRange.value && state.startDate.value) {
        const dateTime = combineDateTime(state.startDate.value, state.startTime.value || '00:00:00');
        try {
          const outputValue = formatOutput(dateTime);
          emit('update:modelValue', outputValue);
          emit('change', outputValue);
        } catch (error) {
          console.warn('Error formatting datetime output:', error);
        }
      }
    }

    hideDropdown();
  };

  const handleCancel = () => {
    hideDropdown();
  };

  const handleMonthClick = (monthIndex: number, isRight = false) => {
    const currentDateRef = isRight ? state.rightCurrentDate.value : state.currentDate.value;

    if (props.type === 'month' || props.type === 'monthrange') {
      const newDate = new Date(currentDateRef.getFullYear(), monthIndex, 1);
      handleDateClick(newDate);
    } else {
      const newDate = new Date(currentDateRef.getFullYear(), monthIndex, 1);
      if (isRight) {
        state.rightCurrentDate.value = newDate;
      } else {
        state.currentDate.value = newDate;
      }
      state.viewMode.value = 'date';
    }
  };

  const handleMonthHover = (monthIndex: number, currentDateRef: Date) => {
    if (isRange.value && state.isSelectingEnd.value && state.startDate.value) {
      const currentYear = currentDateRef.getFullYear();
      state.hoverDate.value = new Date(currentYear, monthIndex, 1);
    }
  };

  const handleMonthLeave = () => {
    if (isRange.value && state.isSelectingEnd.value) {
      state.hoverDate.value = null;
    }
  };

  const handleYearClick = (year: number) => {
    if (props.type === 'year' || props.type === 'yearrange') {
      const newDate = new Date(year, 0, 1);
      handleDateClick(newDate);
    } else {
      const leftNewDate = new Date(year, state.currentDate.value.getMonth(), 1);
      const rightNewDate = new Date(year, state.rightCurrentDate.value.getMonth(), 1);
      state.currentDate.value = leftNewDate;
      state.rightCurrentDate.value = rightNewDate;
      state.viewMode.value = props.type === 'month' || props.type === 'monthrange' ? 'month' : 'date';
    }
  };

  const handleYearHover = (year: number) => {
    if (isRange.value && state.isSelectingEnd.value && state.startDate.value) {
      state.hoverDate.value = new Date(year, 0, 1);
    }
  };

  const handleYearLeave = () => {
    if (isRange.value && state.isSelectingEnd.value) {
      state.hoverDate.value = null;
    }
  };

  const navigatePrev = () => {
    if (state.viewMode.value === 'year') {
      leftNavigateDecade('prev');
      rightNavigateDecade('prev');
    } else if (state.viewMode.value === 'month') {
      leftNavigateYear('prev');
      rightNavigateYear('prev');
    } else {
      leftNavigateMonth('prev');
      state.rightCurrentDate.value = new Date(
        state.currentDate.value.getFullYear(),
        state.currentDate.value.getMonth() + 1,
        1
      );
    }
  };

  const navigateNext = () => {
    if (state.viewMode.value === 'year') {
      leftNavigateDecade('next');
      rightNavigateDecade('next');
    } else if (state.viewMode.value === 'month') {
      leftNavigateYear('next');
      rightNavigateYear('next');
    } else {
      leftNavigateMonth('next');
      state.rightCurrentDate.value = new Date(
        state.currentDate.value.getFullYear(),
        state.currentDate.value.getMonth() + 1,
        1
      );
    }
  };

  // ===== WATCHERS =====
  watch(
    () => props.modelValue,
    newValue => {
      if (newValue) {
        if (isRange.value && Array.isArray(newValue) && newValue.length === 2) {
          try {
            state.startDate.value = newValue[0] instanceof Date ? new Date(newValue[0]) : new Date(newValue[0]);
            state.endDate.value = newValue[1] instanceof Date ? new Date(newValue[1]) : new Date(newValue[1]);

            // Extract time for datetime types
            if (isDateTimeType.value) {
              state.startTime.value = extractTime(state.startDate.value);
              state.endTime.value = extractTime(state.endDate.value);
            }
          } catch (error) {
            console.warn('Invalid date format in modelValue:', newValue);
            state.startDate.value = null;
            state.endDate.value = null;
          }
        } else if (!isRange.value && newValue !== null) {
          try {
            let date: Date | null = null;

            if (newValue instanceof Date) {
              date = newValue;
            } else if (typeof newValue === 'string' || typeof newValue === 'number') {
              date = new Date(newValue);
            }

            if (date && !isNaN(date.getTime())) {
              state.startDate.value = date;

              // Extract time for datetime types
              if (isDateTimeType.value) {
                state.startTime.value = extractTime(date);
              }
            } else {
              state.startDate.value = null;
            }
          } catch (error) {
            console.warn('Invalid date format in modelValue:', newValue);
            state.startDate.value = null;
          }
        }
      } else {
        state.startDate.value = null;
        state.endDate.value = null;
        state.isSelectingEnd.value = false;
        state.hoverDate.value = null;
        state.startTime.value = getInitialStartTime();
        state.endTime.value = getInitialEndTime();
      }
    },
    { immediate: true }
  );

  watch(
    () => props.type,
    newType => {
      state.viewMode.value = getInitialViewMode(newType);
      // Reset time values when type changes
      state.startTime.value = getInitialStartTime();
      state.endTime.value = getInitialEndTime();
    },
    { immediate: true }
  );

  // Синхронізація календарів при зміні лівого календаря
  watch(
    () => state.currentDate.value,
    newDate => {
      if (showDualCalendar.value) {
        state.rightCurrentDate.value = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 1);
      }
    }
  );

  // ===== LIFECYCLE HOOKS =====
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    state.viewMode.value = getInitialViewMode(props.type);

    // Ініціалізація правого календаря
    if (props.type === 'daterange' || props.type === 'datetimerange') {
      state.rightCurrentDate.value = new Date(
        state.currentDate.value.getFullYear(),
        state.currentDate.value.getMonth() + 1,
        1
      );
    }
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  // ===== COMPONENT METHODS =====
  const focus = () => {
    triggerRef.value?.focus();
  };

  const blur = () => {
    triggerRef.value?.blur();
  };

  const open = () => {
    if (!props.disabled) {
      showDropdown();
    }
  };

  const close = () => {
    hideDropdown();
  };

  defineExpose({
    focus,
    blur,
    open,
    close,
    validate,
  });
</script>

<template>
  <div ref="datePickerRef" :class="pickerClasses">
    <!-- Trigger -->
    <div
      ref="triggerRef"
      class="vt-datepicker__trigger"
      tabindex="0"
      @blur="handleBlur"
      @click="handleTriggerClick"
      @focus="handleFocus"
    >
      <div class="vt-datepicker__input">
        <div class="vt-datepicker__icon">
          <VIcon :name="isDateTimeType ? 'clock' : 'calendar'" />
        </div>

        <div v-if="hasDisplayValue" class="vt-datepicker__text">
          <template v-if="isRange">
            <span>{{ displayText[0] }}</span>
            <span class="vt-datepicker__separator">{{ props.rangeSeparator }}</span>
            <span>{{ displayText[1] }}</span>
          </template>
          <template v-else>
            {{ displayText }}
          </template>
        </div>
        <div v-else class="vt-datepicker__placeholder">
          <template v-if="isRange">
            <span>{{ props.startPlaceholder }}</span>
            <span class="vt-datepicker__separator">{{ props.rangeSeparator }}</span>
            <span>{{ props.endPlaceholder }}</span>
          </template>
          <template v-else>
            {{ currentPlaceholder }}
          </template>
        </div>

        <div class="vt-datepicker__suffix">
          <button
            v-if="showClearButton"
            :disabled="props.disabled"
            class="vt-datepicker__clear"
            type="button"
            @click.stop="handleClear"
          >
            <VIcon name="close" />
          </button>
        </div>
      </div>
    </div>

    <!-- Dropdown -->
    <Teleport v-if="isDropdownVisible && parentVisible" to="body">
      <transition name="dropdown">
        <div ref="dropdownRef" :style="dropdownStyle" class="vt-datepicker__dropdown" @click.stop @mousedown.prevent>
          <!-- Date Section -->
          <div
            :class="{ 'vt-datepicker__date-section--with-time': showTimePicker }"
            class="vt-datepicker__date-section"
          >
            <!-- Dual Calendar for daterange/datetimerange -->
            <div v-if="showDualCalendar" class="vt-datepicker__dual-calendar">
              <!-- Left Calendar -->
              <div class="vt-datepicker__calendar-panel">
                <div v-if="showTimePicker" class="vt-datepicker__time">
                  <VTimePicker
                    ref="startTimePickerRef"
                    v-model="state.startTime.value"
                    :clearable="false"
                    :disabled-hours="disabledHoursValue"
                    :disabled-minutes="disabledMinutesValue"
                    :disabled-seconds="disabledSecondsValue"
                    :hide-disabled-options="props.hideDisabledOptions"
                    :hour-step="props.hourStep"
                    :minute-step="props.minuteStep"
                    :second-step="props.secondStep"
                    :show-seconds="props.showSeconds"
                    :use12-hours="props.use12Hours"
                    placeholder="Початковий час"
                    type="time"
                    @change="value => handleTimeChange(value, false)"
                  />
                </div>
                <div class="vt-datepicker__header">
                  <button class="vt-datepicker__nav-btn" @click="navigatePrev">
                    <VIcon name="arrowLeft" />
                  </button>

                  <div class="vt-datepicker__header-content">
                    <button class="vt-datepicker__header-btn" @click="state.viewMode.value = 'month'">
                      {{ state.currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' }) }}
                    </button>
                  </div>

                  <div class="vt-datepicker__nav-spacer"></div>
                </div>

                <div class="vt-datepicker__content">
                  <div class="vt-datepicker__calendar">
                    <div class="vt-datepicker__weekdays">
                      <span
                        v-for="(day, index) in WEEKDAY_NAMES_SHORT"
                        :key="`${index}_${day}`"
                        class="vt-datepicker__weekday"
                        >{{ day }}</span
                      >
                    </div>

                    <div class="vt-datepicker__dates">
                      <button
                        v-for="date in leftCalendarDates"
                        :key="date.getTime()"
                        :class="[
                          'vt-datepicker__date',
                          {
                            'vt-datepicker__date--selected': isDateSelected(date, true, false),
                            'vt-datepicker__date--other-month': !leftIsDateInCurrentMonth(date),
                            'vt-datepicker__date--today': isToday(date),
                            'vt-datepicker__date--in-range':
                              isDateInRange(date, true, false) && !isDateSelected(date, true, false),
                            'vt-datepicker__date--range-start':
                              isRange &&
                              state.startDate.value &&
                              isSameDate(date, state.startDate.value) &&
                              leftIsDateInCurrentMonth(date),
                            'vt-datepicker__date--range-end':
                              isRange &&
                              state.endDate.value &&
                              isSameDate(date, state.endDate.value) &&
                              leftIsDateInCurrentMonth(date),
                            'vt-datepicker__date--disabled': !isDateClickable(date, true, false),
                          },
                        ]"
                        :disabled="!isDateClickable(date, true, false)"
                        @click="handleDateClick(date, true, false)"
                        @mouseenter="handleDateHover(date, true, false)"
                        @mouseleave="handleDateLeave"
                      >
                        {{ date.getDate() }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Calendar -->
              <div class="vt-datepicker__calendar-panel">
                <div v-if="showTimePicker" class="vt-datepicker__time">
                  <VTimePicker
                    ref="endTimePickerRef"
                    v-model="state.endTime.value"
                    :clearable="false"
                    :disabled-hours="props.disabledHours"
                    :disabled-minutes="props.disabledMinutes"
                    :disabled-seconds="props.disabledSeconds"
                    :hide-disabled-options="props.hideDisabledOptions"
                    :hour-step="props.hourStep"
                    :minute-step="props.minuteStep"
                    :second-step="props.secondStep"
                    :show-seconds="props.showSeconds"
                    :use12-hours="props.use12Hours"
                    placeholder="Кінцевий час"
                    type="time"
                    @change="value => handleTimeChange(value, true)"
                  />
                </div>
                <div class="vt-datepicker__header">
                  <div class="vt-datepicker__nav-spacer"></div>

                  <div class="vt-datepicker__header-content">
                    <button class="vt-datepicker__header-btn" @click="state.viewMode.value = 'month'">
                      {{ state.rightCurrentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' }) }}
                    </button>
                  </div>

                  <button class="vt-datepicker__nav-btn" @click="navigateNext">
                    <VIcon name="arrowRight" />
                  </button>
                </div>

                <div class="vt-datepicker__content">
                  <div class="vt-datepicker__calendar">
                    <div class="vt-datepicker__weekdays">
                      <span
                        v-for="(day, index) in WEEKDAY_NAMES_SHORT"
                        :key="`${index}_${day}`"
                        class="vt-datepicker__weekday"
                        >{{ day }}</span
                      >
                    </div>

                    <div class="vt-datepicker__dates">
                      <button
                        v-for="date in rightCalendarDates"
                        :key="date.getTime()"
                        :class="[
                          'vt-datepicker__date',
                          {
                            'vt-datepicker__date--selected': isDateSelected(date, false, true),
                            'vt-datepicker__date--other-month': !rightIsDateInCurrentMonth(date),
                            'vt-datepicker__date--today': isToday(date),
                            'vt-datepicker__date--in-range':
                              isDateInRange(date, false, true) && !isDateSelected(date, false, true),
                            'vt-datepicker__date--range-start':
                              isRange &&
                              state.startDate.value &&
                              isSameDate(date, state.startDate.value) &&
                              rightIsDateInCurrentMonth(date),
                            'vt-datepicker__date--range-end':
                              isRange &&
                              state.endDate.value &&
                              isSameDate(date, state.endDate.value) &&
                              rightIsDateInCurrentMonth(date),
                            'vt-datepicker__date--disabled': !isDateClickable(date, false, true),
                          },
                        ]"
                        :disabled="!isDateClickable(date, false, true)"
                        @click="handleDateClick(date, false, true)"
                        @mouseenter="handleDateHover(date, false, true)"
                        @mouseleave="handleDateLeave"
                      >
                        {{ date.getDate() }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Single Calendar for other types -->
            <div v-else>
              <!-- TimePicker for single datetime -->
              <div v-if="showTimePicker" class="vt-datepicker__time">
                <VTimePicker
                  ref="startTimePickerRef"
                  v-model="state.startTime.value"
                  :clearable="false"
                  :disabled-hours="disabledHoursValue"
                  :disabled-minutes="disabledMinutesValue"
                  :disabled-seconds="disabledSecondsValue"
                  :hide-disabled-options="props.hideDisabledOptions"
                  :hour-step="props.hourStep"
                  :minute-step="props.minuteStep"
                  :second-step="props.secondStep"
                  :show-seconds="props.showSeconds"
                  :use12-hours="props.use12Hours"
                  placeholder="Час"
                  type="time"
                  @change="value => handleTimeChange(value, false)"
                />
              </div>

              <!-- Calendar Header -->
              <div class="vt-datepicker__header">
                <button class="vt-datepicker__nav-btn" @click="navigatePrev">
                  <VIcon name="arrowLeft" />
                </button>

                <div class="vt-datepicker__header-content">
                  <button
                    v-if="state.viewMode.value === 'date'"
                    class="vt-datepicker__header-btn"
                    @click="state.viewMode.value = 'month'"
                  >
                    {{ state.currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' }) }}
                  </button>

                  <button
                    v-else-if="state.viewMode.value === 'month'"
                    class="vt-datepicker__header-btn"
                    @click="state.viewMode.value = 'year'"
                  >
                    {{ state.currentDate.value.getFullYear() }}
                  </button>

                  <span v-else class="vt-datepicker__header-text">
                    {{ leftDecadeRange }}
                  </span>
                </div>

                <button class="vt-datepicker__nav-btn" @click="navigateNext">
                  <VIcon name="arrowRight" />
                </button>
              </div>

              <!-- Calendar Content -->
              <div class="vt-datepicker__content">
                <!-- Date View -->
                <div v-if="state.viewMode.value === 'date'" class="vt-datepicker__calendar">
                  <div class="vt-datepicker__weekdays">
                    <span
                      v-for="(day, index) in WEEKDAY_NAMES_SHORT"
                      :key="`${index}_${day}`"
                      class="vt-datepicker__weekday"
                      >{{ day }}</span
                    >
                  </div>

                  <div class="vt-datepicker__dates">
                    <button
                      v-for="date in leftCalendarDates"
                      :key="date.getTime()"
                      :class="[
                        'vt-datepicker__date',
                        {
                          'vt-datepicker__date--selected': isDateSelected(date),
                          'vt-datepicker__date--other-month': !leftIsDateInCurrentMonth(date),
                          'vt-datepicker__date--today': isToday(date),
                          'vt-datepicker__date--in-range': isDateInRange(date) && !isDateSelected(date),
                          'vt-datepicker__date--range-start':
                            isRange && state.startDate.value && isSameDate(date, state.startDate.value),
                          'vt-datepicker__date--range-end':
                            isRange && state.endDate.value && isSameDate(date, state.endDate.value),
                            'vt-datepicker__date--disabled': !isDateClickable(date, false, true)
                        },
                      ]"
                      @click="handleDateClick(date)"
                      @mouseenter="handleDateHover(date)"
                      @mouseleave="handleDateLeave"
                    >
                      {{ date.getDate() }}
                    </button>
                  </div>
                </div>

                <!-- Month View -->
                <div v-else-if="state.viewMode.value === 'month'" class="vt-datepicker__months">
                  <button
                    v-for="(monthData, index) in leftMonthsInYear"
                    :key="monthData.name"
                    :class="[
                      'vt-datepicker__month',
                      {
                        'vt-datepicker__month--selected': isMonthSelected(index, state.currentDate.value),
                        'vt-datepicker__month--current': index === state.currentDate.value.getMonth(),
                        'vt-datepicker__month--in-range': isMonthInRange(index, state.currentDate.value),
                      },
                    ]"
                    @click="handleMonthClick(index, false)"
                    @mouseenter="handleMonthHover(index, state.currentDate.value)"
                    @mouseleave="handleMonthLeave"
                  >
                    {{ monthData.name }}
                  </button>
                </div>

                <!-- Year View -->
                <div v-else class="vt-datepicker__years">
                  <button
                    v-for="yearData in leftYearsInDecade"
                    :key="yearData.year"
                    :class="[
                      'vt-datepicker__year',
                      {
                        'vt-datepicker__year--selected': isYearSelected(yearData.year),
                        'vt-datepicker__year--current': yearData.year === state.currentDate.value.getFullYear(),
                        'vt-datepicker__year--in-range': isYearInRange(yearData.year),
                      },
                    ]"
                    @click="handleYearClick(yearData.year)"
                    @mouseenter="handleYearHover(yearData.year)"
                    @mouseleave="handleYearLeave"
                  >
                    {{ yearData.year }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions (only for DateTime types) -->
          <div v-if="showTimePicker" class="vt-datepicker__actions">
            <VButton @click="handleCancel">Скасувати</VButton>
            <VButton
              :disabled="!state.startDate.value || (isRange && !state.endDate.value)"
              type="primary"
              @click="handleConfirm"
            >
              OK
            </VButton>
          </div>
        </div>
      </transition>
    </Teleport>
    <!-- Helper Text / Error Message -->
    <div v-if="displayErrorMessage" class="vt-datepicker__help">
      <span v-if="displayErrorMessage" class="vt-datepicker__error">
        {{ displayErrorMessage }}
      </span>
    </div>
  </div>
</template>
