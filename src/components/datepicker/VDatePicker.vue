<!--<script lang="ts" setup>-->
<!--  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';-->
<!--  import VIcon from '@/components/icon/VIcon.vue';-->
<!--  import type {-->
<!--    CalendarDay,-->
<!--    CalendarMonth,-->
<!--    CalendarWeek,-->
<!--    CalendarYear,-->
<!--    DatePickerRangeValue,-->
<!--    DatePickerState,-->
<!--    DatePickerValue,-->
<!--    DropdownPosition,-->
<!--    VtDatePickerEmits,-->
<!--    VtDatePickerProps,-->
<!--  } from './types';-->
<!--  import {-->
<!--    addToDate,-->
<!--    DEFAULT_FORMATS,-->
<!--    DEFAULT_LOCALE,-->
<!--    formatDate,-->
<!--    generateCalendarDays,-->
<!--    generateCalendarMonths,-->
<!--    generateCalendarWeeks,-->
<!--    generateCalendarYears,-->
<!--    getMonthStart,-->
<!--    getWeekEnd,-->
<!--    getWeekStart,-->
<!--    getYearStart,-->
<!--    toDate,-->
<!--  } from './helpers';-->

<!--  // Props with defaults-->
<!--  const props = withDefaults(defineProps<VtDatePickerProps>(), {-->
<!--    type: 'date',-->
<!--    size: 'medium',-->
<!--    status: 'default',-->
<!--    disabled: false,-->
<!--    clearable: false,-->
<!--    readonly: false,-->
<!--    editable: false,-->
<!--    placement: 'bottom-start',-->
<!--    maxHeight: 300,-->
<!--    validateOnInput: true,-->
<!--    validateOnBlur: true,-->
<!--    range: false,-->
<!--    firstDayOfWeek: 1,-->
<!--    unlinkPanels: false,-->
<!--    rangeSeparator: 'до',-->
<!--  });-->

<!--  // Emits-->
<!--  const emit = defineEmits<VtDatePickerEmits>();-->

<!--  // Template refs-->
<!--  const datePickerRef = ref<HTMLElement>();-->
<!--  const triggerRef = ref<HTMLElement>();-->
<!--  const dropdownRef = ref<HTMLElement>();-->

<!--  // State-->
<!--  const state = ref<DatePickerState>({-->
<!--    isFocused: false,-->
<!--    isDropdownVisible: false,-->
<!--    currentView: 'date',-->
<!--    currentDate: new Date(),-->
<!--    displayDate: new Date(),-->
<!--    selectedDate: null,-->
<!--    selectedRange: [null, null],-->
<!--    hoveredDate: null,-->
<!--    rangeState: null,-->
<!--    inputValue: '',-->
<!--    validationErrors: [],-->
<!--    isValid: true,-->
<!--  });-->

<!--  // Positioning-->
<!--  const dropdownPosition = ref<DropdownPosition>({-->
<!--    top: '0px',-->
<!--    left: '0px',-->
<!--    minWidth: '0px',-->
<!--    transformOrigin: 'center top',-->
<!--  });-->

<!--  // Scroll management-->
<!--  const scrollableParents = ref<Element[]>([]);-->
<!--  const parentVisible = ref(true);-->
<!--  const wasVisibleBeforeHiding = ref(false);-->

<!--  // Computed properties-->
<!--  const computedFormat = computed(() => {-->
<!--    if (props.format) return props.format;-->
<!--    return DEFAULT_FORMATS[props.type].display;-->
<!--  });-->

<!--  const computedValueFormat = computed(() => {-->
<!--    if (props.valueFormat) return props.valueFormat;-->
<!--    return DEFAULT_FORMATS[props.type].value;-->
<!--  });-->

<!--  const computedPlaceholder = computed(() => {-->
<!--    if (props.range) {-->
<!--      return {-->
<!--        start: props.startPlaceholder || 'Початкова дата',-->
<!--        end: props.endPlaceholder || 'Кінцева дата',-->
<!--        separator: props.rangeSeparator || 'до',-->
<!--      };-->
<!--    }-->

<!--    if (props.placeholder) return props.placeholder;-->

<!--    const placeholders = {-->
<!--      date: 'Виберіть дату',-->
<!--      week: 'Виберіть тиждень',-->
<!--      month: 'Виберіть місяць',-->
<!--      year: 'Виберіть рік',-->
<!--      datetime: 'Виберіть дату та час',-->
<!--    };-->

<!--    return placeholders[props.type];-->
<!--  });-->

<!--  const showClearButton = computed(() => {-->
<!--    return props.clearable && !props.disabled && !props.readonly && props.modelValue;-->
<!--  });-->

<!--  const currentStatus = computed(() => {-->
<!--    if (props.status !== 'default') return props.status;-->
<!--    if (!state.value.isValid) return 'error';-->
<!--    return 'default';-->
<!--  });-->

<!--  const datePickerClasses = computed(() => [-->
<!--    'vt-date-picker',-->
<!--    `vt-date-picker&#45;&#45;${props.size}`,-->
<!--    `vt-date-picker&#45;&#45;${currentStatus.value}`,-->
<!--    {-->
<!--      'vt-date-picker&#45;&#45;disabled': props.disabled,-->
<!--      'vt-date-picker&#45;&#45;readonly': props.readonly,-->
<!--      'vt-date-picker&#45;&#45;focused': state.value.isFocused,-->
<!--      'vt-date-picker&#45;&#45;range': props.range,-->
<!--    },-->
<!--  ]);-->

<!--  const dropdownStyle = computed(() => ({-->
<!--    ...dropdownPosition.value,-->
<!--    position: 'absolute' as const,-->
<!--    zIndex: 2000,-->
<!--    maxHeight: `${props.maxHeight}px`,-->
<!--  }));-->

<!--  const dropdownClasses = computed(() => [-->
<!--    'vt-date-picker-dropdown',-->
<!--    {-->
<!--      'vt-date-picker-dropdown&#45;&#45;range': props.range,-->
<!--    },-->
<!--  ]);-->

<!--  const displayValue = computed(() => {-->
<!--    if (!props.modelValue) return '';-->

<!--    if (props.range && Array.isArray(props.modelValue)) {-->
<!--      const [start, end] = props.modelValue;-->
<!--      const startDate = toDate(start);-->
<!--      const endDate = toDate(end);-->

<!--      if (!startDate && !endDate) return '';-->

<!--      const startStr = startDate ? formatDate(startDate, computedFormat.value, DEFAULT_LOCALE) : '';-->
<!--      const endStr = endDate ? formatDate(endDate, computedFormat.value, DEFAULT_LOCALE) : '';-->

<!--      if (startStr && endStr) {-->
<!--        return `${startStr} ${computedPlaceholder.value.separator} ${endStr}`;-->
<!--      }-->

<!--      return startStr || endStr;-->
<!--    }-->

<!--    const date = toDate(props.modelValue as DatePickerValue);-->
<!--    if (!date) return '';-->

<!--    return formatDate(date, computedFormat.value, DEFAULT_LOCALE);-->
<!--  });-->

<!--  // Calendar computed properties-->
<!--  const calendarDays = computed(() => {-->
<!--    const year = state.value.displayDate.getFullYear();-->
<!--    const month = state.value.displayDate.getMonth();-->

<!--    const selectedDate = props.range ? null : toDate(props.modelValue as DatePickerValue);-->
<!--    const selectedRange =-->
<!--      props.range && Array.isArray(props.modelValue)-->
<!--        ? ([toDate(props.modelValue[0]), toDate(props.modelValue[1])] as [Date | null, Date | null])-->
<!--        : ([null, null] as [Date | null, Date | null]);-->

<!--    return generateCalendarDays(-->
<!--      year,-->
<!--      month,-->
<!--      props.firstDayOfWeek,-->
<!--      selectedDate,-->
<!--      selectedRange,-->
<!--      state.value.hoveredDate,-->
<!--      props.disabledDate-->
<!--    );-->
<!--  });-->

<!--  const calendarWeeks = computed(() => {-->
<!--    const year = state.value.displayDate.getFullYear();-->
<!--    return generateCalendarWeeks(year, DEFAULT_LOCALE);-->
<!--  });-->

<!--  const calendarMonths = computed(() => {-->
<!--    const year = state.value.displayDate.getFullYear();-->
<!--    return generateCalendarMonths(year, DEFAULT_LOCALE);-->
<!--  });-->

<!--  const calendarYears = computed(() => {-->
<!--    const currentYear = state.value.displayDate.getFullYear();-->
<!--    const startYear = Math.floor(currentYear / 10) * 10;-->
<!--    const endYear = startYear + 9;-->
<!--    return generateCalendarYears(startYear, endYear);-->
<!--  });-->

<!--  const navigationLabel = computed(() => {-->
<!--    const date = state.value.displayDate;-->
<!--    const year = date.getFullYear();-->
<!--    const month = date.getMonth();-->

<!--    switch (state.value.currentView) {-->
<!--      case 'date':-->
<!--        return `${DEFAULT_LOCALE.months[month]} ${year}`;-->
<!--      case 'month':-->
<!--        return year.toString();-->
<!--      case 'year':-->
<!--        const startYear = Math.floor(year / 10) * 10;-->
<!--        const endYear = startYear + 9;-->
<!--        return `${startYear}-${endYear}`;-->
<!--      default:-->
<!--        return '';-->
<!--    }-->
<!--  });-->

<!--  // Validation-->
<!--  const validateValue = (): void => {-->
<!--    const errors: string[] = [];-->

<!--    if (props.required && !props.modelValue) {-->
<!--      errors.push(props.requiredMessage || "Це поле є обов'язковим");-->
<!--    }-->

<!--    if (props.modelValue) {-->
<!--      if (props.range && Array.isArray(props.modelValue)) {-->
<!--        const [start, end] = props.modelValue;-->
<!--        const startDate = toDate(start);-->
<!--        const endDate = toDate(end);-->

<!--        if (start && !startDate) {-->
<!--          errors.push('Некоректна початкова дата');-->
<!--        }-->
<!--        if (end && !endDate) {-->
<!--          errors.push('Некоректна кінцева дата');-->
<!--        }-->
<!--        if (startDate && endDate && startDate > endDate) {-->
<!--          errors.push('Початкова дата не може бути пізніше кінцевої');-->
<!--        }-->
<!--      } else {-->
<!--        const date = toDate(props.modelValue as DatePickerValue);-->
<!--        if (!date) {-->
<!--          errors.push('Некоректна дата');-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    state.value.validationErrors = errors;-->
<!--    state.value.isValid = errors.length === 0;-->

<!--    emit('validation', { isValid: state.value.isValid, errors });-->
<!--  };-->

<!--  // Visibility utilities-->
<!--  const isElementVisible = (element: Element): boolean => {-->
<!--    if (!element) return false;-->

<!--    const rect = element.getBoundingClientRect();-->

<!--    if (rect.width === 0 && rect.height === 0) return false;-->

<!--    const windowHeight = window.innerHeight || document.documentElement.clientHeight;-->
<!--    const windowWidth = window.innerWidth || document.documentElement.clientWidth;-->

<!--    const isInViewport = rect.top < windowHeight && rect.bottom > 0 && rect.left < windowWidth && rect.right > 0;-->

<!--    if (!isInViewport) return false;-->

<!--    let parent = element.parentElement;-->
<!--    while (parent && parent !== document.body) {-->
<!--      const parentRect = parent.getBoundingClientRect();-->
<!--      const parentStyle = window.getComputedStyle(parent);-->

<!--      if (-->
<!--        parentStyle.overflow === 'hidden' ||-->
<!--        parentStyle.overflowY === 'hidden' ||-->
<!--        parentStyle.overflowX === 'hidden'-->
<!--      ) {-->
<!--        if (-->
<!--          rect.top >= parentRect.bottom ||-->
<!--          rect.bottom <= parentRect.top ||-->
<!--          rect.left >= parentRect.right ||-->
<!--          rect.right <= parentRect.left-->
<!--        ) {-->
<!--          return false;-->
<!--        }-->
<!--      }-->

<!--      parent = parent.parentElement;-->
<!--    }-->

<!--    return true;-->
<!--  };-->

<!--  const checkParentVisibility = (): void => {-->
<!--    if (!triggerRef.value) return;-->

<!--    const isVisible = isElementVisible(triggerRef.value);-->

<!--    if (parentVisible.value !== isVisible) {-->
<!--      parentVisible.value = isVisible;-->

<!--      if (!isVisible && state.value.isDropdownVisible) {-->
<!--        wasVisibleBeforeHiding.value = true;-->
<!--        state.value.isDropdownVisible = false;-->
<!--        emit('visible-change', false);-->
<!--      } else if (isVisible && wasVisibleBeforeHiding.value && !state.value.isDropdownVisible) {-->
<!--        wasVisibleBeforeHiding.value = false;-->
<!--        state.value.isDropdownVisible = true;-->
<!--        updateDropdownPosition();-->
<!--        emit('visible-change', true);-->
<!--      }-->
<!--    }-->
<!--  };-->

<!--  const getScrollableParents = (element: Element): Element[] => {-->
<!--    const parents: Element[] = [];-->
<!--    let parent = element.parentElement;-->

<!--    while (parent && parent !== document.body) {-->
<!--      const computedStyle = window.getComputedStyle(parent);-->
<!--      const overflowY = computedStyle.overflowY;-->
<!--      const overflowX = computedStyle.overflowX;-->

<!--      if (-->
<!--        ['scroll', 'auto'].includes(overflowY) ||-->
<!--        ['scroll', 'auto'].includes(overflowX) ||-->
<!--        parent.scrollHeight > parent.clientHeight ||-->
<!--        parent.scrollWidth > parent.clientWidth-->
<!--      ) {-->
<!--        parents.push(parent);-->
<!--      }-->

<!--      parent = parent.parentElement;-->
<!--    }-->

<!--    parents.push(window as any);-->
<!--    return parents;-->
<!--  };-->

<!--  // Dropdown positioning-->
<!--  const updateDropdownPosition = async (): Promise<void> => {-->
<!--    await nextTick();-->
<!--    if (!triggerRef.value || !dropdownRef.value) return;-->

<!--    const triggerRect = triggerRef.value.getBoundingClientRect();-->
<!--    const dropdownRect = dropdownRef.value.getBoundingClientRect();-->

<!--    let top = 0;-->
<!--    let left = 0;-->
<!--    let transformOrigin = 'center top';-->

<!--    switch (props.placement) {-->
<!--      case 'bottom':-->
<!--        top = triggerRect.bottom + window.scrollY + 5;-->
<!--        left = triggerRect.left + window.scrollX + (triggerRect.width - dropdownRect.width) / 2;-->
<!--        break;-->
<!--      case 'bottom-start':-->
<!--        top = triggerRect.bottom + window.scrollY + 5;-->
<!--        left = triggerRect.left + window.scrollX;-->
<!--        break;-->
<!--      case 'bottom-end':-->
<!--        top = triggerRect.bottom + window.scrollY + 5;-->
<!--        left = triggerRect.right + window.scrollX - dropdownRect.width;-->
<!--        break;-->
<!--      case 'top':-->
<!--        top = triggerRect.top + window.scrollY - dropdownRect.height - 5;-->
<!--        left = triggerRect.left + window.scrollX + (triggerRect.width - dropdownRect.width) / 2;-->
<!--        transformOrigin = 'center bottom';-->
<!--        break;-->
<!--      case 'top-start':-->
<!--        top = triggerRect.top + window.scrollY - dropdownRect.height - 5;-->
<!--        left = triggerRect.left + window.scrollX;-->
<!--        transformOrigin = 'center bottom';-->
<!--        break;-->
<!--      case 'top-end':-->
<!--        top = triggerRect.top + window.scrollY - dropdownRect.height - 5;-->
<!--        left = triggerRect.right + window.scrollX - dropdownRect.width;-->
<!--        transformOrigin = 'center bottom';-->
<!--        break;-->
<!--    }-->

<!--    // Screen boundaries correction-->
<!--    const maxLeft = window.innerWidth - dropdownRect.width - 10;-->
<!--    left = Math.max(10, Math.min(left, maxLeft));-->

<!--    if (top + dropdownRect.height > window.innerHeight + window.scrollY) {-->
<!--      top = triggerRect.top + window.scrollY - dropdownRect.height - 5;-->
<!--      transformOrigin = 'center bottom';-->
<!--    }-->
<!--    if (top < window.scrollY + 10) {-->
<!--      top = triggerRect.bottom + window.scrollY + 5;-->
<!--      transformOrigin = 'center top';-->
<!--    }-->

<!--    dropdownPosition.value = {-->
<!--      top: `${top}px`,-->
<!--      left: `${left}px`,-->
<!--      minWidth: `${triggerRect.width}px`,-->
<!--      transformOrigin,-->
<!--    };-->
<!--  };-->

<!--  // Scroll listeners-->
<!--  const addScrollListeners = (): void => {-->
<!--    if (!triggerRef.value) return;-->

<!--    scrollableParents.value = getScrollableParents(triggerRef.value);-->
<!--    scrollableParents.value.forEach(parent => {-->
<!--      parent.addEventListener('scroll', handleScroll, { passive: true });-->
<!--    });-->
<!--    window.addEventListener('resize', handleScroll);-->
<!--  };-->

<!--  const removeScrollListeners = (): void => {-->
<!--    scrollableParents.value.forEach(parent => {-->
<!--      parent.removeEventListener('scroll', handleScroll);-->
<!--    });-->
<!--    window.removeEventListener('resize', handleScroll);-->
<!--    scrollableParents.value = [];-->
<!--  };-->

<!--  const handleScroll = (): void => {-->
<!--    if (state.value.isDropdownVisible || wasVisibleBeforeHiding.value) {-->
<!--      checkParentVisibility();-->
<!--      if (state.value.isDropdownVisible) {-->
<!--        updateDropdownPosition();-->
<!--      }-->
<!--    }-->
<!--  };-->

<!--  // Dropdown management-->
<!--  const showDropdown = (): void => {-->
<!--    if (props.disabled || props.readonly || state.value.isDropdownVisible) return;-->

<!--    if (!triggerRef.value || !isElementVisible(triggerRef.value)) {-->
<!--      return;-->
<!--    }-->

<!--    state.value.isDropdownVisible = true;-->
<!--    state.value.isFocused = true;-->
<!--    parentVisible.value = true;-->
<!--    wasVisibleBeforeHiding.value = false;-->

<!--    // Set initial view based on type-->
<!--    switch (props.type) {-->
<!--      case 'month':-->
<!--        state.value.currentView = 'month';-->
<!--        break;-->
<!--      case 'year':-->
<!--        state.value.currentView = 'year';-->
<!--        break;-->
<!--      default:-->
<!--        state.value.currentView = 'date';-->
<!--    }-->

<!--    nextTick(() => {-->
<!--      updateDropdownPosition();-->
<!--      addScrollListeners();-->
<!--    });-->

<!--    emit('visible-change', true);-->
<!--    emit('focus', new FocusEvent('focus'));-->
<!--  };-->

<!--  const hideDropdown = (): void => {-->
<!--    if (!state.value.isDropdownVisible) return;-->

<!--    state.value.isDropdownVisible = false;-->
<!--    state.value.isFocused = false;-->
<!--    state.value.rangeState = null;-->
<!--    state.value.hoveredDate = null;-->
<!--    wasVisibleBeforeHiding.value = false;-->
<!--    removeScrollListeners();-->

<!--    if (props.validateOnBlur) {-->
<!--      validateValue();-->
<!--    }-->

<!--    emit('visible-change', false);-->
<!--    emit('blur', new FocusEvent('blur'));-->
<!--  };-->

<!--  // Event handlers-->
<!--  const handleClickOutside = (event: MouseEvent): void => {-->
<!--    if (!state.value.isDropdownVisible) return;-->

<!--    const target = event.target as Node;-->

<!--    if (datePickerRef.value?.contains(target) || dropdownRef.value?.contains(target)) {-->
<!--      return;-->
<!--    }-->

<!--    hideDropdown();-->
<!--  };-->

<!--  const handleTriggerClick = (): void => {-->
<!--    if (props.disabled || props.readonly) return;-->

<!--    if (state.value.isDropdownVisible) {-->
<!--      hideDropdown();-->
<!--    } else {-->
<!--      showDropdown();-->
<!--    }-->
<!--  };-->

<!--  const handleClear = (): void => {-->
<!--    const newValue = props.range ? null : null;-->
<!--    emit('update:modelValue', newValue);-->
<!--    emit('change', newValue);-->
<!--    emit('clear');-->

<!--    state.value.selectedDate = null;-->
<!--    state.value.selectedRange = [null, null];-->
<!--    state.value.validationErrors = [];-->
<!--    state.value.isValid = true;-->
<!--    emit('validation', { isValid: true, errors: [] });-->
<!--  };-->

<!--  // Calendar handlers-->
<!--  const handleDateSelect = (day: CalendarDay): void => {-->
<!--    if (day.isDisabled) return;-->

<!--    const selectedDate = new Date(day.date);-->

<!--    if (props.range) {-->
<!--      if (!state.value.rangeState) {-->
<!--        // Start selecting range-->
<!--        state.value.rangeState = 'start';-->
<!--        state.value.selectedRange = [selectedDate, null];-->
<!--      } else if (state.value.rangeState === 'start') {-->
<!--        // Complete range selection-->
<!--        const [start] = state.value.selectedRange;-->
<!--        if (start && selectedDate < start) {-->
<!--          state.value.selectedRange = [selectedDate, start];-->
<!--        } else {-->
<!--          state.value.selectedRange = [start, selectedDate];-->
<!--        }-->

<!--        const rangeValue: DatePickerRangeValue = [state.value.selectedRange[0], state.value.selectedRange[1]];-->

<!--        emit('update:modelValue', rangeValue);-->
<!--        emit('change', rangeValue);-->

<!--        state.value.rangeState = null;-->
<!--        hideDropdown();-->
<!--      }-->
<!--    } else {-->
<!--      // Single date selection-->
<!--      let value: DatePickerValue;-->

<!--      switch (props.type) {-->
<!--        case 'week':-->
<!--          const weekStart = getWeekStart(selectedDate, props.firstDayOfWeek);-->
<!--          const weekEnd = getWeekEnd(selectedDate, props.firstDayOfWeek);-->
<!--          value = props.range ? [weekStart, weekEnd] : weekStart;-->
<!--          break;-->
<!--        case 'month':-->
<!--          value = getMonthStart(selectedDate);-->
<!--          break;-->
<!--        case 'year':-->
<!--          value = getYearStart(selectedDate);-->
<!--          break;-->
<!--        default:-->
<!--          value = selectedDate;-->
<!--      }-->

<!--      state.value.selectedDate = selectedDate;-->
<!--      emit('update:modelValue', value);-->
<!--      emit('change', value);-->

<!--      if (props.validateOnInput) {-->
<!--        validateValue();-->
<!--      }-->

<!--      hideDropdown();-->
<!--    }-->
<!--  };-->

<!--  const handleWeekSelect = (week: CalendarWeek): void => {-->
<!--    if (week.isDisabled) return;-->

<!--    if (props.range) {-->
<!--      // Handle week range selection-->
<!--      if (!state.value.rangeState) {-->
<!--        state.value.rangeState = 'start';-->
<!--        state.value.selectedRange = [week.startDate, week.endDate];-->
<!--      } else {-->
<!--        // Complete range - select from first week start to current week end-->
<!--        const [firstStart] = state.value.selectedRange;-->
<!--        if (firstStart && week.startDate < firstStart) {-->
<!--          state.value.selectedRange = [week.startDate, firstStart];-->
<!--        } else {-->
<!--          state.value.selectedRange = [firstStart, week.endDate];-->
<!--        }-->

<!--        emit('update:modelValue', state.value.selectedRange);-->
<!--        emit('change', state.value.selectedRange);-->
<!--        state.value.rangeState = null;-->
<!--        hideDropdown();-->
<!--      }-->
<!--    } else {-->
<!--      emit('update:modelValue', week.startDate);-->
<!--      emit('change', week.startDate);-->
<!--      hideDropdown();-->
<!--    }-->
<!--  };-->

<!--  const handleMonthSelect = (month: CalendarMonth): void => {-->
<!--    if (month.isDisabled) return;-->

<!--    const selectedDate = new Date(month.year, month.month, 1);-->

<!--    if (props.type === 'month') {-->
<!--      emit('update:modelValue', selectedDate);-->
<!--      emit('change', selectedDate);-->
<!--      hideDropdown();-->
<!--    } else {-->
<!--      // Navigate to month view for date picker-->
<!--      state.value.displayDate = selectedDate;-->
<!--      state.value.currentView = 'date';-->
<!--    }-->
<!--  };-->

<!--  const handleYearSelect = (year: CalendarYear): void => {-->
<!--    if (year.isDisabled) return;-->

<!--    const selectedDate = new Date(year.year, 0, 1);-->

<!--    if (props.type === 'year') {-->
<!--      emit('update:modelValue', selectedDate);-->
<!--      emit('change', selectedDate);-->
<!--      hideDropdown();-->
<!--    } else {-->
<!--      // Navigate to year view-->
<!--      state.value.displayDate = selectedDate;-->
<!--      state.value.currentView = props.type === 'month' ? 'month' : 'date';-->
<!--    }-->
<!--  };-->

<!--  const handleDateHover = (day: CalendarDay): void => {-->
<!--    if (props.range && state.value.rangeState === 'start') {-->
<!--      state.value.hoveredDate = day.date;-->
<!--    }-->
<!--  };-->

<!--  // Navigation handlers-->
<!--  const goToPreviousMonth = (): void => {-->
<!--    state.value.displayDate = addToDate(state.value.displayDate, -1, 'month');-->
<!--  };-->

<!--  const goToNextMonth = (): void => {-->
<!--    state.value.displayDate = addToDate(state.value.displayDate, 1, 'month');-->
<!--  };-->

<!--  const goToPreviousYear = (): void => {-->
<!--    state.value.displayDate = addToDate(state.value.displayDate, -1, 'year');-->
<!--  };-->

<!--  const goToNextYear = (): void => {-->
<!--    state.value.displayDate = addToDate(state.value.displayDate, 1, 'year');-->
<!--  };-->

<!--  const goToPreviousDecade = (): void => {-->
<!--    state.value.displayDate = addToDate(state.value.displayDate, -10, 'year');-->
<!--  };-->

<!--  const goToNextDecade = (): void => {-->
<!--    state.value.displayDate = addToDate(state.value.displayDate, 10, 'year');-->
<!--  };-->

<!--  const handleNavigation = (direction: 'prev' | 'next'): void => {-->
<!--    switch (state.value.currentView) {-->
<!--      case 'date':-->
<!--        direction === 'prev' ? goToPreviousMonth() : goToNextMonth();-->
<!--        break;-->
<!--      case 'month':-->
<!--        direction === 'prev' ? goToPreviousYear() : goToNextYear();-->
<!--        break;-->
<!--      case 'year':-->
<!--        direction === 'prev' ? goToPreviousDecade() : goToNextDecade();-->
<!--        break;-->
<!--    }-->

<!--    emit('calendar-change', state.value.displayDate);-->
<!--  };-->

<!--  const handleHeaderClick = (): void => {-->
<!--    switch (state.value.currentView) {-->
<!--      case 'date':-->
<!--        if (props.type !== 'date') return;-->
<!--        state.value.currentView = 'month';-->
<!--        break;-->
<!--      case 'month':-->
<!--        state.value.currentView = 'year';-->
<!--        break;-->
<!--    }-->

<!--    emit('panel-change', state.value.displayDate, state.value.currentView, props.type);-->
<!--  };-->

<!--  const goToToday = (): void => {-->
<!--    const today = new Date();-->
<!--    state.value.displayDate = today;-->
<!--    state.value.currentView = 'date';-->

<!--    if (!props.range) {-->
<!--      handleDateSelect({-->
<!--        date: today,-->
<!--        day: today.getDate(),-->
<!--        month: today.getMonth(),-->
<!--        year: today.getFullYear(),-->
<!--        isCurrentMonth: true,-->
<!--        isPrevMonth: false,-->
<!--        isNextMonth: false,-->
<!--        isSelected: false,-->
<!--        isInRange: false,-->
<!--        isRangeStart: false,-->
<!--        isRangeEnd: false,-->
<!--        isToday: true,-->
<!--        isDisabled: false,-->
<!--        isHovered: false,-->
<!--      });-->
<!--    }-->
<!--  };-->

<!--  // Public methods-->
<!--  const focus = (): void => {-->
<!--    if (!state.value.isDropdownVisible) {-->
<!--      showDropdown();-->
<!--    }-->
<!--  };-->

<!--  const blur = (): void => {-->
<!--    hideDropdown();-->
<!--  };-->

<!--  const clear = (): void => {-->
<!--    handleClear();-->
<!--  };-->

<!--  const validate = (): boolean => {-->
<!--    validateValue();-->
<!--    return state.value.isValid;-->
<!--  };-->

<!--  const clearValidation = (): void => {-->
<!--    state.value.validationErrors = [];-->
<!--    state.value.isValid = true;-->
<!--    emit('validation', { isValid: true, errors: [] });-->
<!--  };-->

<!--  // Watchers-->
<!--  watch(-->
<!--    () => props.modelValue,-->
<!--    newValue => {-->
<!--      if (props.range && Array.isArray(newValue)) {-->
<!--        const [start, end] = newValue;-->
<!--        state.value.selectedRange = [toDate(start), toDate(end)];-->
<!--        if (start) {-->
<!--          const startDate = toDate(start);-->
<!--          if (startDate) {-->
<!--            state.value.displayDate = startDate;-->
<!--          }-->
<!--        }-->
<!--      } else {-->
<!--        const date = toDate(newValue as DatePickerValue);-->
<!--        state.value.selectedDate = date;-->
<!--        if (date) {-->
<!--          state.value.displayDate = date;-->
<!--        }-->
<!--      }-->

<!--      if (props.validateOnInput) {-->
<!--        validateValue();-->
<!--      }-->
<!--    },-->
<!--    { immediate: true }-->
<!--  );-->

<!--  // Lifecycle hooks-->
<!--  onMounted(() => {-->
<!--    if (props.modelValue) {-->
<!--      validateValue();-->
<!--    }-->

<!--    document.addEventListener('click', handleClickOutside);-->
<!--  });-->

<!--  onUnmounted(() => {-->
<!--    document.removeEventListener('click', handleClickOutside);-->
<!--    removeScrollListeners();-->
<!--  });-->

<!--  // Expose methods-->
<!--  defineExpose({-->
<!--    focus,-->
<!--    blur,-->
<!--    clear,-->
<!--    validate,-->
<!--    clearValidation,-->
<!--  });-->
<!--</script>-->

<!--<template>-->
<!--  <div ref="datePickerRef" :class="datePickerClasses">-->
<!--    &lt;!&ndash; Label &ndash;&gt;-->
<!--    <label v-if="label" class="vt-date-picker__label">-->
<!--      {{ label }}-->
<!--      <span v-if="required" class="vt-date-picker__required">*</span>-->
<!--    </label>-->

<!--    &lt;!&ndash; Trigger &ndash;&gt;-->
<!--    <div ref="triggerRef" class="vt-date-picker__container" @click="handleTriggerClick">-->
<!--      <div class="vt-date-picker__prefix">-->
<!--        <VIcon class="vt-date-picker__icon vt-date-picker__icon&#45;&#45;calendar vt-date-picker__arrow" name="calendar" />-->
<!--      </div>-->

<!--      &lt;!&ndash; Range inputs &ndash;&gt;-->
<!--      <div v-if="range" class="vt-date-picker__range-container">-->
<!--        <div class="vt-date-picker__range-input">-->
<!--          <div class="vt-date-picker__field">-->
<!--            <span v-if="state.selectedRange[0]" class="vt-date-picker__display-text">-->
<!--              {{ formatDate(state.selectedRange[0], computedFormat, DEFAULT_LOCALE) }}-->
<!--            </span>-->
<!--            <span v-else class="vt-date-picker__placeholder">-->
<!--              {{ computedPlaceholder.start }}-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->

<!--        <span class="vt-date-picker__range-separator">-->
<!--          {{ computedPlaceholder.separator }}-->
<!--        </span>-->

<!--        <div class="vt-date-picker__range-input">-->
<!--          <div class="vt-date-picker__field">-->
<!--            <span v-if="state.selectedRange[1]" class="vt-date-picker__display-text">-->
<!--              {{ formatDate(state.selectedRange[1], computedFormat, DEFAULT_LOCALE) }}-->
<!--            </span>-->
<!--            <span v-else class="vt-date-picker__placeholder">-->
<!--              {{ computedPlaceholder.end }}-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; Single input &ndash;&gt;-->
<!--      <div v-else :class="{ 'vt-date-picker__field&#45;&#45;editable': editable }" class="vt-date-picker__field">-->
<!--        <span v-if="displayValue" class="vt-date-picker__display-text">-->
<!--          {{ displayValue }}-->
<!--        </span>-->
<!--        <span v-else class="vt-date-picker__placeholder">-->
<!--          {{ computedPlaceholder }}-->
<!--        </span>-->
<!--      </div>-->

<!--      <button-->
<!--        v-if="showClearButton"-->
<!--        :disabled="disabled"-->
<!--        class="vt-date-picker__clear-btn"-->
<!--        type="button"-->
<!--        @click.stop="handleClear"-->
<!--      >-->
<!--        <VIcon name="close" />-->
<!--      </button>-->
<!--    </div>-->

<!--    &lt;!&ndash; Validation messages &ndash;&gt;-->
<!--    <transition name="fade">-->
<!--      <div v-if="state.validationErrors.length > 0" class="vt-date-picker__help">-->
<!--        <div v-for="error in state.validationErrors" :key="error" class="vt-date-picker__error">-->
<!--          {{ error }}-->
<!--        </div>-->
<!--      </div>-->
<!--    </transition>-->

<!--    &lt;!&ndash; Dropdown &ndash;&gt;-->
<!--    <Teleport to="body">-->
<!--      <transition name="dropdown">-->
<!--        <div-->
<!--          v-if="state.isDropdownVisible && parentVisible"-->
<!--          ref="dropdownRef"-->
<!--          :class="dropdownClasses"-->
<!--          :style="dropdownStyle"-->
<!--          @click.stop-->
<!--        >-->
<!--          &lt;!&ndash; Shortcuts panel (for range picker) &ndash;&gt;-->
<!--          <div v-if="range && shortcuts && shortcuts.length" class="vt-shortcuts">-->
<!--            <div class="vt-shortcuts__list">-->
<!--              <button-->
<!--                v-for="shortcut in shortcuts"-->
<!--                :key="shortcut.text"-->
<!--                class="vt-shortcuts__item"-->
<!--                type="button"-->
<!--                @click="handleShortcutClick(shortcut)"-->
<!--              >-->
<!--                {{ shortcut.text }}-->
<!--              </button>-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash; Calendar &ndash;&gt;-->
<!--          <div :class="{ 'vt-calendar&#45;&#45;range': range }" class="vt-calendar">-->
<!--            &lt;!&ndash; Calendar Header &ndash;&gt;-->
<!--            <div class="vt-calendar__header">-->
<!--              <button class="vt-calendar__nav-btn" type="button" @click="handleNavigation('prev')">-->
<!--                <VIcon name="arrowLeft" />-->
<!--              </button>-->

<!--              <div class="vt-calendar__month-year" @click="handleHeaderClick">-->
<!--                {{ navigationLabel }}-->
<!--              </div>-->

<!--              <button class="vt-calendar__nav-btn" type="button" @click="handleNavigation('next')">-->
<!--                <VIcon name="arrowRight" />-->
<!--              </button>-->
<!--            </div>-->

<!--            &lt;!&ndash; Calendar Body &ndash;&gt;-->
<!--            <div class="vt-calendar__body">-->
<!--              &lt;!&ndash; Date view &ndash;&gt;-->
<!--              <template v-if="state.currentView === 'date' && type === 'date'">-->
<!--                <div class="vt-calendar__weekdays">-->
<!--                  <div v-for="day in DEFAULT_LOCALE.weekdaysMin" :key="day" class="vt-calendar__weekday">-->
<!--                    {{ day }}-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="vt-calendar__days">-->
<!--                  <button-->
<!--                    v-for="day in calendarDays"-->
<!--                    :key="day.date.getTime()"-->
<!--                    :class="[-->
<!--                      'vt-calendar__day',-->
<!--                      {-->
<!--                        'vt-calendar__day&#45;&#45;other-month': !day.isCurrentMonth,-->
<!--                        'vt-calendar__day&#45;&#45;selected': day.isSelected,-->
<!--                        'vt-calendar__day&#45;&#45;today': day.isToday,-->
<!--                        'vt-calendar__day&#45;&#45;disabled': day.isDisabled,-->
<!--                        'vt-calendar__day&#45;&#45;in-range': day.isInRange,-->
<!--                        'vt-calendar__day&#45;&#45;range-start': day.isRangeStart,-->
<!--                        'vt-calendar__day&#45;&#45;range-end': day.isRangeEnd,-->
<!--                      },-->
<!--                    ]"-->
<!--                    :disabled="day.isDisabled"-->
<!--                    type="button"-->
<!--                    @click="handleDateSelect(day)"-->
<!--                    @mouseenter="handleDateHover(day)"-->
<!--                  >-->
<!--                    {{ day.date.getDate() }}-->
<!--                  </button>-->
<!--                </div>-->
<!--              </template>-->

<!--              &lt;!&ndash; Week view &ndash;&gt;-->
<!--              <template v-if="type === 'week'">-->
<!--                <div class="vt-calendar__weeks">-->
<!--                  <button-->
<!--                    v-for="week in calendarWeeks"-->
<!--                    :key="`${week.year}-${week.weekNumber}`"-->
<!--                    :class="[-->
<!--                      'vt-calendar__week',-->
<!--                      {-->
<!--                        'vt-calendar__week&#45;&#45;selected': week.isSelected,-->
<!--                        'vt-calendar__week&#45;&#45;disabled': week.isDisabled,-->
<!--                      },-->
<!--                    ]"-->
<!--                    :disabled="week.isDisabled"-->
<!--                    type="button"-->
<!--                    @click="handleWeekSelect(week)"-->
<!--                  >-->
<!--                    <span class="vt-calendar__week-number">{{ week.weekNumber }}</span>-->
<!--                    <span class="vt-calendar__week-range">-->
<!--                      {{ formatDate(week.startDate, 'dd.MM', DEFAULT_LOCALE) }} - -->
<!--                      {{ formatDate(week.endDate, 'dd.MM', DEFAULT_LOCALE) }}-->
<!--                    </span>-->
<!--                  </button>-->
<!--                </div>-->
<!--              </template>-->

<!--              &lt;!&ndash; Month view &ndash;&gt;-->
<!--              <template v-if="state.currentView === 'month' || type === 'month'">-->
<!--                <div class="vt-calendar__months">-->
<!--                  <button-->
<!--                    v-for="month in calendarMonths"-->
<!--                    :key="month.month"-->
<!--                    :class="[-->
<!--                      'vt-calendar__month',-->
<!--                      {-->
<!--                        'vt-calendar__month&#45;&#45;current': month.isCurrent,-->
<!--                        'vt-calendar__month&#45;&#45;selected': month.isSelected,-->
<!--                        'vt-calendar__month&#45;&#45;disabled': month.isDisabled,-->
<!--                      },-->
<!--                    ]"-->
<!--                    :disabled="month.isDisabled"-->
<!--                    type="button"-->
<!--                    @click="handleMonthSelect(month)"-->
<!--                  >-->
<!--                    {{ month.shortName }}-->
<!--                  </button>-->
<!--                </div>-->
<!--              </template>-->

<!--              &lt;!&ndash; Year view &ndash;&gt;-->
<!--              <template v-if="state.currentView === 'year' || type === 'year'">-->
<!--                <div class="vt-calendar__years">-->
<!--                  <button-->
<!--                    v-for="year in calendarYears"-->
<!--                    :key="year.year"-->
<!--                    :class="[-->
<!--                      'vt-calendar__year',-->
<!--                      {-->
<!--                        'vt-calendar__year&#45;&#45;current': year.isCurrent,-->
<!--                        'vt-calendar__year&#45;&#45;selected': year.isSelected,-->
<!--                        'vt-calendar__year&#45;&#45;disabled': year.isDisabled,-->
<!--                      },-->
<!--                    ]"-->
<!--                    :disabled="year.isDisabled"-->
<!--                    type="button"-->
<!--                    @click="handleYearSelect(year)"-->
<!--                  >-->
<!--                    {{ year.year }}-->
<!--                  </button>-->
<!--                </div>-->
<!--              </template>-->
<!--            </div>-->

<!--            &lt;!&ndash; Calendar Footer &ndash;&gt;-->
<!--            <div class="vt-calendar__footer">-->
<!--              <button class="vt-calendar__today-btn" type="button" @click="goToToday">-->
<!--                {{ DEFAULT_LOCALE.today }}-->
<!--              </button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </transition>-->
<!--    </Teleport>-->
<!--  </div>-->
<!--</template>-->
<template>
  <div></div>
</template>
<script></script>
