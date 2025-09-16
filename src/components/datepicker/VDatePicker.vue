<script lang="ts" setup>
  import { computed, nextTick, onMounted, onUnmounted, ref, toRef, watch } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import { useDropdown } from '@/components/dropdown/useDropdown';
  import { useCalendar, useDatePicker } from '@/components/datepicker/helpers';
  import { VDatePickerEmits, VDatePickerProps, WEEKDAY_NAMES_SHORT } from '@/components/datepicker/types';

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
  });

  // ===== EMITS =====
  const emit = defineEmits<VDatePickerEmits>();

  // ===== TEMPLATE REFS =====
  const datePickerRef = ref<HTMLElement>();
  const triggerRef = ref<HTMLElement>();
  const dropdownRef = ref<HTMLElement>();

  // ===== STATE =====
  const state = {
    isFocused: ref(false),
    currentDate: ref(new Date()),
    rightCurrentDate: ref(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)), // Наступний місяць для правої частини
    viewMode: ref<'date' | 'month' | 'year'>('date'),
    startDate: ref<Date | null>(null),
    endDate: ref<Date | null>(null),
    isSelectingEnd: ref(false),
    hoverDate: ref<Date | null>(null),
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
    },
  ]);

  const dropdownStyle = computed(() => ({
    ...dropdownPosition.value,
    position: 'absolute' as const,
    zIndex: 2000,
  }));

  const showDualCalendar = computed(() => {
    return props.type === 'daterange' && state.viewMode.value === 'date';
  });

  // ===== SELECTION LOGIC =====
  const isDateClickable = (date: Date, isLeftCalendar = false, isRightCalendar = false): boolean => {
    // Для daterange режиму обмежуємо клік по датам з інших місяців
    if (props.type === 'daterange') {
      if (isLeftCalendar && !leftIsDateInCurrentMonth(date)) {
        return false;
      }
      if (isRightCalendar && !rightIsDateInCurrentMonth(date)) {
        return false;
      }
    }
    return true;
  };

  const isDateSelected = (date: Date, isLeftCalendar = false, isRightCalendar = false): boolean => {
    // Для daterange режиму не підсвічуємо вибрані дати з інших місяців
    if (props.type === 'daterange') {
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
      const selected = parsedValue.value as Date | null;
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

    // Для daterange режиму не підсвічуємо дати з інших місяців
    if (props.type === 'daterange') {
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
    const newValue = isRange.value ? null : null;
    emit('update:modelValue', newValue);
    emit('change', newValue);

    if (isRange.value) {
      state.startDate.value = null;
      state.endDate.value = null;
      state.isSelectingEnd.value = false;
      state.hoverDate.value = null;
    }
  };

  const handleDateClick = (date: Date, isLeftCalendar = false, isRightCalendar = false) => {
    if (props.disabled || !date) return;

    // Перевіряємо чи можна клікнути по цій даті
    if (!isDateClickable(date, isLeftCalendar, isRightCalendar)) return;

    if (isRange.value) {
      if (!state.startDate.value || (state.startDate.value && state.endDate.value)) {
        state.startDate.value = new Date(date);
        state.endDate.value = null;
        state.isSelectingEnd.value = true;
        state.hoverDate.value = null;
      } else if (state.startDate.value && !state.endDate.value) {
        const startDate = new Date(state.startDate.value);
        const endDate = new Date(date);

        if (endDate >= startDate) {
          state.endDate.value = endDate;
        } else {
          state.endDate.value = startDate;
          state.startDate.value = endDate;
        }

        const rangeValue = [state.startDate.value, state.endDate.value];

        try {
          const outputValue = formatOutput(rangeValue);
          emit('update:modelValue', outputValue);
          emit('change', outputValue);
        } catch (error) {
          console.warn('Error formatting output:', error);
        }

        state.isSelectingEnd.value = false;
        state.hoverDate.value = null;
        hideDropdown();
      }
    } else {
      try {
        const outputValue = formatOutput(new Date(date));
        emit('update:modelValue', outputValue);
        emit('change', outputValue);
        hideDropdown();
      } catch (error) {
        console.warn('Error formatting single date output:', error);
      }
    }
  };

  const handleDateHover = (date: Date, isLeftCalendar = false, isRightCalendar = false) => {
    // Для daterange режиму не дозволяємо hover на датах з інших місяців
    if (props.type === 'daterange') {
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
      // Синхронізуємо правий календар
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
      // Синхронізуємо правий календар
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
      if (isRange.value && Array.isArray(newValue) && newValue.length === 2) {
        try {
          state.startDate.value = newValue[0] instanceof Date ? new Date(newValue[0]) : new Date(newValue[0]);
          state.endDate.value = newValue[1] instanceof Date ? new Date(newValue[1]) : new Date(newValue[1]);
        } catch (error) {
          console.warn('Invalid date format in modelValue:', newValue);
          state.startDate.value = null;
          state.endDate.value = null;
        }
      } else if (!isRange.value && newValue === null) {
        state.startDate.value = null;
        state.endDate.value = null;
        state.isSelectingEnd.value = false;
        state.hoverDate.value = null;
      }
    },
    { immediate: true }
  );

  watch(
    () => props.type,
    newType => {
      state.viewMode.value = getInitialViewMode(newType);
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
    if (props.type === 'daterange') {
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
          <VIcon name="calendar" />
        </div>

        <div v-if="hasDisplayValue" class="vt-datepicker__text">
          <template v-if="isRange">
            <span>
              {{ displayText[0] }}
            </span>
            <span>
              {{ props.rangeSeparator }}
            </span>
            <span>
              {{ displayText[1] }}
            </span>
          </template>
          <template v-else>
            {{ displayText }}
          </template>
        </div>
        <div v-else class="vt-datepicker__placeholder">
          <template v-if="isRange">
            <span>
              {{ props.startPlaceholder }}
            </span>
            <span>
              {{ props.rangeSeparator }}
            </span>
            <span>
              {{ props.endPlaceholder }}
            </span>
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
          <!-- Dual Calendar for daterange -->
          <div v-if="showDualCalendar" class="vt-datepicker__dual-calendar">
            <!-- Left Calendar -->
            <div class="vt-datepicker__calendar-panel">
              <!-- Left Header -->
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

              <!-- Left Calendar Content -->
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
              <!-- Right Header -->
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

              <!-- Right Calendar Content -->
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
            <!-- Header -->
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
      </transition>
    </Teleport>
  </div>
</template>
