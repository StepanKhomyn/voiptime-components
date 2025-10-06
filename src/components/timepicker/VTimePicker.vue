<script lang="ts" setup>
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import { useDropdown } from '@/components/dropdown/useDropdown';
  import {
    DEFAULT_TIME_FORMATS,
    formatTime,
    generateTimeOptions,
    isValidTimeString,
    parseTimeString,
    type TimeObject,
    type TimePickerValue,
    type TimeRangeValue,
    type TimeValue,
    validateTimeValue,
    type VTimePickerEmits,
    type VTimePickerProps,
  } from '@/components/timepicker/types';
  import VButton from '@/components/button/VButton.vue';

  // ===== PROPS & DEFAULTS =====
  const props = withDefaults(defineProps<VTimePickerProps>(), {
    type: 'time',
    placeholder: 'Оберіть час',
    startPlaceholder: 'Початковий час',
    endPlaceholder: 'Кінцевий час',
    rangeSeparator: ' - ',
    format: 'HH:mm:ss',
    disabled: false,
    clearable: true,
    size: 'default',
    hourStep: 1,
    minuteStep: 1,
    secondStep: 1,
    showSeconds: true,
    use12Hours: false,
    hideDisabledOptions: false,
  });

  // ===== EMITS =====
  const emit = defineEmits<VTimePickerEmits>();

  // ===== TEMPLATE REFS =====
  const timePickerRef = ref<HTMLElement>();
  const triggerRef = ref<HTMLElement>();
  const dropdownRef = ref<HTMLElement>();

  // ===== STATE =====
  const state = {
    isFocused: ref(false),
    startTime: ref<TimeObject | null>(null),
    endTime: ref<TimeObject | null>(null),
    isSelectingEnd: ref(false),
  };

  // ===== INTERSECTION OBSERVER STATE =====
  const observers = ref<Map<HTMLElement, IntersectionObserver>>(new Map());

  // ===== COMPOSABLES =====
  const isRange = computed(() => props.type === 'timerange');

  // ===== TIME HELPERS =====
  const formatTimeObject = (timeObj: TimeObject): string => {
    if (!timeObj) return '';

    const { hour, minute, second } = timeObj;
    const formatStr =
      props.format ||
      (props.showSeconds
        ? props.use12Hours
          ? DEFAULT_TIME_FORMATS['12h']
          : DEFAULT_TIME_FORMATS['24h']
        : props.use12Hours
          ? DEFAULT_TIME_FORMATS['12h_no_seconds']
          : DEFAULT_TIME_FORMATS['24h_no_seconds']);

    return formatTime(hour, minute, second, formatStr, props.use12Hours);
  };

  const parseTimeValue = (value: TimeValue): TimeObject | null => {
    if (!value) return null;

    if (value instanceof Date) {
      return {
        hour: value.getHours(),
        minute: value.getMinutes(),
        second: value.getSeconds(),
      };
    }

    if (typeof value === 'string' && isValidTimeString(value)) {
      return parseTimeString(value);
    }

    return null;
  };

  const validateTime = (value: TimePickerValue, required = false) => {
    return validateTimeValue(value, props.type, required);
  };

  // ===== COMPUTED VALUES =====
  const currentValue = computed(() => {
    if (!props.modelValue) return isRange.value ? [null, null] : null;

    if (isRange.value) {
      if (Array.isArray(props.modelValue) && props.modelValue.length === 2) {
        return [parseTimeValue(props.modelValue[0]), parseTimeValue(props.modelValue[1])];
      }
      return [null, null];
    } else {
      return parseTimeValue(props.modelValue as TimeValue);
    }
  });

  const displayText = computed(() => {
    if (isRange.value) {
      const [start, end] = currentValue.value as [TimeObject | null, TimeObject | null];
      if (start && end) {
        return [formatTimeObject(start), formatTimeObject(end)];
      } else if (start) {
        return [formatTimeObject(start), ''];
      }
      return ['', ''];
    } else {
      const time = currentValue.value as TimeObject | null;
      return time ? formatTimeObject(time) : '';
    }
  });

  const hasDisplayValue = computed(() => {
    if (isRange.value) {
      const [start, end] = displayText.value as [string, string];
      return start || end;
    } else {
      return !!displayText.value;
    }
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
    'vt-timepicker',
    `vt-timepicker--${props.size}`,
    `vt-timepicker--${props.type}`,
    {
      'vt-timepicker--disabled': props.disabled,
      'vt-timepicker--focused': state.isFocused.value,
      'vt-timepicker--range': isRange.value,
      'vt-timepicker--open': isDropdownVisible.value,
      'vt-timepicker--error': !!props.errorMessage,
    },
  ]);

  // Повернення помилки
  const displayErrorMessage = computed(() => {
    if (props.errorMessage) return props.errorMessage;
    return '';
  });

  // ===== CURRENT TIME STATE =====
  const currentHour = ref(0);
  const currentMinute = ref(0);
  const currentSecond = ref(0);
  const currentPeriod = ref<'AM' | 'PM'>('AM');

  const endHour = ref(0);
  const endMinute = ref(0);
  const endSecond = ref(0);
  const endPeriod = ref<'AM' | 'PM'>('AM');

  // ===== TIME LISTS =====
  const hourOptions = computed(() => {
    const maxHour = props.use12Hours ? 12 : 23;
    const startHour = props.use12Hours ? 1 : 0;
    const disabledHours = props.disabledHours ? props.disabledHours() : [];

    const options = generateTimeOptions(startHour, maxHour, props.hourStep, disabledHours);

    return props.hideDisabledOptions ? options.filter(option => !option.disabled) : options;
  });

  const minuteOptions = computed(() => {
    const selectedHour = props.use12Hours
      ? currentPeriod.value === 'PM' && currentHour.value !== 12
        ? currentHour.value + 12
        : currentPeriod.value === 'AM' && currentHour.value === 12
          ? 0
          : currentHour.value
      : currentHour.value;

    const disabledMinutes = props.disabledMinutes ? props.disabledMinutes(selectedHour) : [];

    const options = generateTimeOptions(0, 59, props.minuteStep, disabledMinutes);

    return props.hideDisabledOptions ? options.filter(option => !option.disabled) : options;
  });

  const secondOptions = computed(() => {
    const selectedHour = props.use12Hours
      ? currentPeriod.value === 'PM' && currentHour.value !== 12
        ? currentHour.value + 12
        : currentPeriod.value === 'AM' && currentHour.value === 12
          ? 0
          : currentHour.value
      : currentHour.value;

    const disabledSeconds = props.disabledSeconds ? props.disabledSeconds(selectedHour, currentMinute.value) : [];

    const options = generateTimeOptions(0, 59, props.secondStep, disabledSeconds);

    return props.hideDisabledOptions ? options.filter(option => !option.disabled) : options;
  });

  const periodOptions = computed(() => ['AM', 'PM']);

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
      emit('open-change', visible);
      if (visible) {
        nextTick(() => {
          updatePosition();
          setTimeout(() => {
            scrollToSelectedTime();
            setTimeout(() => {
              initializeObservers();
            }, 200);
          }, 150);
        });
      } else {
        cleanupObservers();
      }
    },
  });

  const dropdownStyle = computed(() => ({
    ...dropdownPosition.value,
    position: 'absolute' as const,
    zIndex: 2000,
  }));

  // ===== INTERSECTION OBSERVER FUNCTIONS =====
  const setupIntersectionObserver = (container: HTMLElement, type: 'hour' | 'minute' | 'second', isEndTime = false) => {
    // Очистити попередній observer якщо є
    const existingObserver = observers.value.get(container);
    if (existingObserver) {
      existingObserver.disconnect();
      observers.value.delete(container);
    }

    // Створити зону перетину в центрі контейнера (між лініями)
    const rootMargin = `${-container.clientHeight / 2 + 16}px 0px ${-container.clientHeight / 2 + 16}px 0px`;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        let mostVisibleEntry: IntersectionObserverEntry | null = null;
        let maxRatio = 0;

        // Знайти елемент з найбільшим відсотком перетину в центральній зоні
        for (const entry of entries) {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleEntry = entry;
          }
        }

        if (mostVisibleEntry && mostVisibleEntry.isIntersecting) {
          const button = mostVisibleEntry.target as HTMLButtonElement;
          const value = parseInt(button.textContent?.trim() || '0');

          // Перевірити чи кнопка не заблокована
          if (!button.disabled) {
            let options: typeof hourOptions.value;
            switch (type) {
              case 'hour':
                options = hourOptions.value;
                break;
              case 'minute':
                options = minuteOptions.value;
                break;
              case 'second':
                options = secondOptions.value;
                break;
            }

            const option = options.find(opt => opt.value === value);
            if (option && !option.disabled) {
              if (type === 'hour') {
                if (isEndTime) {
                  endHour.value = value;
                } else {
                  currentHour.value = value;
                }
              } else if (type === 'minute') {
                if (isEndTime) {
                  endMinute.value = value;
                } else {
                  currentMinute.value = value;
                }
              } else if (type === 'second') {
                if (isEndTime) {
                  endSecond.value = value;
                } else {
                  currentSecond.value = value;
                }
              }
            }
          }
        }
      },
      {
        root: container,
        rootMargin,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    // Спостерігати за всіма кнопками в контейнері
    const buttons = container.querySelectorAll('.vt-timepicker__option');
    buttons.forEach(button => observer.observe(button));

    observers.value.set(container, observer);
  };

  // Функція для ініціалізації всіх observers
  const initializeObservers = () => {
    if (!isDropdownVisible.value || !dropdownRef.value) return;

    nextTick(() => {
      const allOptionsElements = dropdownRef.value?.querySelectorAll('.vt-timepicker__options');
      if (!allOptionsElements) return;

      const elementsArray = Array.from(allOptionsElements) as HTMLElement[];

      if (isRange.value) {
        // Start time panel
        if (elementsArray[0]) setupIntersectionObserver(elementsArray[0], 'hour', false);
        if (elementsArray[1]) setupIntersectionObserver(elementsArray[1], 'minute', false);
        if (props.showSeconds && elementsArray[2]) {
          setupIntersectionObserver(elementsArray[2], 'second', false);
        }

        // End time panel
        const endStartIndex = props.showSeconds ? (props.use12Hours ? 4 : 3) : props.use12Hours ? 3 : 2;
        if (elementsArray[endStartIndex]) setupIntersectionObserver(elementsArray[endStartIndex], 'hour', true);
        if (elementsArray[endStartIndex + 1])
          setupIntersectionObserver(elementsArray[endStartIndex + 1], 'minute', true);
        if (props.showSeconds && elementsArray[endStartIndex + 2]) {
          setupIntersectionObserver(elementsArray[endStartIndex + 2], 'second', true);
        }
      } else {
        if (elementsArray[0]) setupIntersectionObserver(elementsArray[0], 'hour', false);
        if (elementsArray[1]) setupIntersectionObserver(elementsArray[1], 'minute', false);
        if (props.showSeconds && elementsArray[2]) {
          setupIntersectionObserver(elementsArray[2], 'second', false);
        }
      }
    });
  };

  // Функція для очистки всіх observers
  const cleanupObservers = () => {
    observers.value.forEach(observer => observer.disconnect());
    observers.value.clear();
  };

  // ===== SCROLL TO SELECTED TIME =====
  const scrollToSelectedTime = () => {
    if (!isDropdownVisible.value) return;

    nextTick(() => {
      const allOptionsElements = dropdownRef.value?.querySelectorAll('.vt-timepicker__options');
      if (!allOptionsElements) return;

      const scrollToValue = (element: HTMLElement, currentValue: number, options: any[]) => {
        const selectedIndex = options.findIndex(option => option.value === currentValue);
        if (selectedIndex >= 0) {
          const itemHeight = 32;
          const paddingTop = 80;

          // Розрахунок позиції елемента в списку
          const elementPosition = selectedIndex * itemHeight;

          // Розрахунок scroll позиції для центрування елемента
          const containerHeight = element.clientHeight;
          const scrollTop = elementPosition + paddingTop - containerHeight / 2 + itemHeight / 2;

          element.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: 'smooth',
          });
        }
      };

      if (isRange.value) {
        const elementsArray = Array.from(allOptionsElements) as HTMLElement[];

        // Start time panel
        if (elementsArray[0]) scrollToValue(elementsArray[0], currentHour.value, hourOptions.value);
        if (elementsArray[1]) scrollToValue(elementsArray[1], currentMinute.value, minuteOptions.value);
        if (props.showSeconds && elementsArray[2]) {
          scrollToValue(elementsArray[2], currentSecond.value, secondOptions.value);
        }

        // End time panel
        const endStartIndex = props.showSeconds ? (props.use12Hours ? 4 : 3) : props.use12Hours ? 3 : 2;
        if (elementsArray[endStartIndex]) scrollToValue(elementsArray[endStartIndex], endHour.value, hourOptions.value);
        if (elementsArray[endStartIndex + 1])
          scrollToValue(elementsArray[endStartIndex + 1], endMinute.value, minuteOptions.value);
        if (props.showSeconds && elementsArray[endStartIndex + 2]) {
          scrollToValue(elementsArray[endStartIndex + 2], endSecond.value, secondOptions.value);
        }
      } else {
        const elementsArray = Array.from(allOptionsElements) as HTMLElement[];
        if (elementsArray[0]) scrollToValue(elementsArray[0], currentHour.value, hourOptions.value);
        if (elementsArray[1]) scrollToValue(elementsArray[1], currentMinute.value, minuteOptions.value);
        if (props.showSeconds && elementsArray[2]) {
          scrollToValue(elementsArray[2], currentSecond.value, secondOptions.value);
        }
      }
    });
  };

  // ===== ENHANCED CLICK HANDLERS =====
  const handleOptionClick = (
    value: number | string,
    type: 'hour' | 'minute' | 'second' | 'period',
    isEndTime = false,
    disabled = false,
    event?: Event
  ) => {
    if (disabled) return;

    if (type === 'period') {
      if (isEndTime) {
        endPeriod.value = value as 'AM' | 'PM';
      } else {
        currentPeriod.value = value as 'AM' | 'PM';
      }
    } else {
      const numValue = value as number;
      if (type === 'hour') {
        if (isEndTime) {
          endHour.value = numValue;
        } else {
          currentHour.value = numValue;
        }
      } else if (type === 'minute') {
        if (isEndTime) {
          endMinute.value = numValue;
        } else {
          currentMinute.value = numValue;
        }
      } else if (type === 'second') {
        if (isEndTime) {
          endSecond.value = numValue;
        } else {
          currentSecond.value = numValue;
        }
      }
    }

    // Автоскролінг до центру при кліку
    if (event) {
      nextTick(() => {
        const container = (event.target as HTMLElement)?.closest('.vt-timepicker__options') as HTMLElement;
        if (container) {
          const selectedButton = event.target as HTMLElement;
          const containerRect = container.getBoundingClientRect();
          const buttonRect = selectedButton.getBoundingClientRect();

          const scrollTop =
            container.scrollTop +
            (buttonRect.top - containerRect.top) -
            container.clientHeight / 2 +
            buttonRect.height / 2;

          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          });
        }
      });
    }
  };

  // ===== EVENT HANDLERS =====
  const handleClickOutside = (event: MouseEvent) => {
    if (!isDropdownVisible.value) return;

    const target = event.target as Node;
    if (timePickerRef.value?.contains(target) || dropdownRef.value?.contains(target)) {
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
    emit('focus', timePickerRef.value);
  };

  const handleBlur = () => {
    state.isFocused.value = false;
    emit('blur', timePickerRef.value);
  };

  const handleClear = () => {
    const newValue = isRange.value ? null : null;
    emit('update:modelValue', newValue);
    emit('change', newValue);

    if (isRange.value) {
      state.startTime.value = null;
      state.endTime.value = null;
      state.isSelectingEnd.value = false;
    }

    // Скидаємо до початкових значень
    currentHour.value = initialTime.hour;
    currentMinute.value = initialTime.minute;
    currentSecond.value = initialTime.second;
    currentPeriod.value = initialTime.period;

    endHour.value = initialTime.hour;
    endMinute.value = initialTime.minute;
    endSecond.value = initialTime.second;
    endPeriod.value = initialTime.period;
  };

  const formatOutput = (timeObj: TimeObject): string => {
    return formatTimeObject(timeObj);
  };

  const handleTimeSelect = () => {
    if (props.disabled) return;

    if (isRange.value) {
      let startHour = currentHour.value;
      let endHourValue = endHour.value;

      if (props.use12Hours) {
        if (currentPeriod.value === 'PM' && startHour !== 12) startHour += 12;
        if (currentPeriod.value === 'AM' && startHour === 12) startHour = 0;

        if (endPeriod.value === 'PM' && endHourValue !== 12) endHourValue += 12;
        if (endPeriod.value === 'AM' && endHourValue === 12) endHourValue = 0;
      }

      const startTimeObj = { hour: startHour, minute: currentMinute.value, second: currentSecond.value };
      const endTimeObj = { hour: endHourValue, minute: endMinute.value, second: endSecond.value };

      const rangeValue: TimeRangeValue = [formatOutput(startTimeObj), formatOutput(endTimeObj)];

      const validation = validateTime(rangeValue);
      if (!validation.isValid) {
        console.warn('Time range validation failed:', validation.errors);
        return;
      }

      emit('update:modelValue', rangeValue);
      emit('change', rangeValue);
    } else {
      let hour = currentHour.value;

      if (props.use12Hours) {
        if (currentPeriod.value === 'PM' && hour !== 12) hour += 12;
        if (currentPeriod.value === 'AM' && hour === 12) hour = 0;
      }

      const timeObj: TimeObject = { hour, minute: currentMinute.value, second: currentSecond.value };
      const outputValue = formatOutput(timeObj);

      const validation = validateTime(outputValue);
      if (!validation.isValid) {
        console.warn('Time validation failed:', validation.errors);
        return;
      }

      emit('update:modelValue', outputValue);
      emit('change', outputValue);
    }

    hideDropdown();
  };

  const handleCancel = () => {
    hideDropdown();
  };

  // Keyboard navigation
  const handleKeydown = (event: KeyboardEvent) => {
    if (!isDropdownVisible.value) return;

    switch (event.key) {
      case 'Escape':
        handleCancel();
        break;
      case 'Enter':
        handleTimeSelect();
        break;
      case 'Tab':
        break;
    }
  };

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
    validate: validateTime,
  });

  // ===== WATCHERS =====
  watch(
    () => props.modelValue,
    newValue => {
      if (newValue) {
        if (isRange.value && Array.isArray(newValue)) {
          const startTime = parseTimeValue(newValue[0]);
          const endTime = parseTimeValue(newValue[1]);

          if (startTime) {
            let hour = startTime.hour;
            if (props.use12Hours) {
              currentPeriod.value = hour >= 12 ? 'PM' : 'AM';
              hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            }
            currentHour.value = hour;
            currentMinute.value = startTime.minute;
            currentSecond.value = startTime.second;
          }

          if (endTime) {
            let hour = endTime.hour;
            if (props.use12Hours) {
              endPeriod.value = hour >= 12 ? 'PM' : 'AM';
              hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            }
            endHour.value = hour;
            endMinute.value = endTime.minute;
            endSecond.value = endTime.second;
          }
        } else if (!isRange.value) {
          const time = parseTimeValue(newValue as TimeValue);
          if (time) {
            let hour = time.hour;
            if (props.use12Hours) {
              currentPeriod.value = hour >= 12 ? 'PM' : 'AM';
              hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            }
            currentHour.value = hour;
            currentMinute.value = time.minute;
            currentSecond.value = time.second;
          }
        }
      }
    },
    { immediate: true }
  );

  // ===== INITIALIZATION VALUES =====
  const initialTime = (() => {
    const now = new Date();
    let hour = now.getHours();

    if (props.use12Hours) {
      const period: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
      hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return {
        hour,
        minute: now.getMinutes(),
        second: now.getSeconds(),
        period,
      };
    }

    return {
      hour,
      minute: now.getMinutes(),
      second: now.getSeconds(),
      period: 'AM' as const,
    };
  })();

  // ===== LIFECYCLE HOOKS =====
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);

    // Ініціалізуємо тільки якщо немає modelValue
    if (!props.modelValue) {
      currentHour.value = initialTime.hour;
      currentMinute.value = initialTime.minute;
      currentSecond.value = initialTime.second;
      currentPeriod.value = initialTime.period;

      endHour.value = initialTime.hour;
      endMinute.value = initialTime.minute;
      endSecond.value = initialTime.second;
      endPeriod.value = initialTime.period;
    }
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleKeydown);
    cleanupObservers();
  });
</script>

<template>
  <div ref="timePickerRef" :class="pickerClasses">
    <!-- Trigger -->
    <div
      ref="triggerRef"
      class="vt-timepicker__trigger"
      tabindex="0"
      @blur="handleBlur"
      @click="handleTriggerClick"
      @focus="handleFocus"
    >
      <div class="vt-timepicker__input">
        <div class="vt-timepicker__icon">
          <VIcon name="clock" />
        </div>

        <div v-if="hasDisplayValue" class="vt-timepicker__text">
          <template v-if="isRange">
            <span>{{ displayText[0] }}</span>
            <span>{{ props.rangeSeparator }}</span>
            <span>{{ displayText[1] }}</span>
          </template>
          <template v-else>
            {{ displayText }}
          </template>
        </div>
        <div v-else class="vt-timepicker__placeholder">
          <template v-if="isRange">
            <span>{{ props.startPlaceholder }}</span>
            <span>{{ props.rangeSeparator }}</span>
            <span>{{ props.endPlaceholder }}</span>
          </template>
          <template v-else>
            {{ currentPlaceholder }}
          </template>
        </div>

        <div class="vt-timepicker__suffix">
          <button
            v-if="showClearButton"
            :disabled="props.disabled"
            class="vt-input__clear-btn"
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
        <div ref="dropdownRef" :style="dropdownStyle" class="vt-timepicker__dropdown" @click.stop @mousedown.prevent>
          <div v-if="isRange" class="vt-timepicker__dual-panel">
            <!-- Start Time Panel -->
            <div class="vt-timepicker__panel">
              <div class="vt-timepicker__panel-header">Початковий час</div>
              <div class="vt-timepicker__time-columns">
                <!-- Hours -->
                <div class="vt-timepicker__column">
                  <div class="vt-timepicker__options">
                    <button
                      v-for="hourOption in hourOptions"
                      :key="`start-hour-${hourOption.value}`"
                      :class="[
                        'vt-timepicker__option',
                        {
                          'vt-timepicker__option--selected': currentHour === hourOption.value,
                          'vt-timepicker__option--disabled': hourOption.disabled,
                        },
                      ]"
                      :disabled="hourOption.disabled"
                      @click="handleOptionClick(hourOption.value, 'hour', false, hourOption.disabled, $event)"
                    >
                      {{ hourOption.label }}
                    </button>
                  </div>
                </div>

                <!-- Minutes -->
                <div class="vt-timepicker__column">
                  <div class="vt-timepicker__options">
                    <button
                      v-for="minuteOption in minuteOptions"
                      :key="`start-minute-${minuteOption.value}`"
                      :class="[
                        'vt-timepicker__option',
                        {
                          'vt-timepicker__option--selected': currentMinute === minuteOption.value,
                          'vt-timepicker__option--disabled': minuteOption.disabled,
                        },
                      ]"
                      :disabled="minuteOption.disabled"
                      @click="handleOptionClick(minuteOption.value, 'minute', false, minuteOption.disabled, $event)"
                    >
                      {{ minuteOption.label }}
                    </button>
                  </div>
                </div>

                <!-- Seconds -->
                <div v-if="showSeconds" class="vt-timepicker__column">
                  <div class="vt-timepicker__options">
                    <button
                      v-for="secondOption in secondOptions"
                      :key="`start-second-${secondOption.value}`"
                      :class="[
                        'vt-timepicker__option',
                        {
                          'vt-timepicker__option--selected': currentSecond === secondOption.value,
                          'vt-timepicker__option--disabled': secondOption.disabled,
                        },
                      ]"
                      :disabled="secondOption.disabled"
                      @click="handleOptionClick(secondOption.value, 'second', false, secondOption.disabled, $event)"
                    >
                      {{ secondOption.label }}
                    </button>
                  </div>
                </div>

                <!-- AM/PM -->
                <div v-if="use12Hours" class="vt-timepicker__column">
                  <div class="vt-timepicker__options">
                    <button
                      v-for="period in periodOptions"
                      :key="`start-period-${period}`"
                      :class="[
                        'vt-timepicker__option',
                        { 'vt-timepicker__option--selected': currentPeriod === period },
                      ]"
                      @click="handleOptionClick(period, 'period', false, false, $event)"
                    >
                      {{ period }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- End Time Panel -->
            <div class="vt-timepicker__panel">
              <div class="vt-timepicker__panel-header">Кінцевий час</div>
              <div class="vt-timepicker__time-columns">
                <!-- Hours -->
                <div class="vt-timepicker__column">
                  <div class="vt-timepicker__options">
                    <button
                      v-for="hourOption in hourOptions"
                      :key="`end-hour-${hourOption.value}`"
                      :class="[
                        'vt-timepicker__option',
                        {
                          'vt-timepicker__option--selected': endHour === hourOption.value,
                          'vt-timepicker__option--disabled': hourOption.disabled,
                        },
                      ]"
                      :disabled="hourOption.disabled"
                      @click="handleOptionClick(hourOption.value, 'hour', true, hourOption.disabled, $event)"
                    >
                      {{ hourOption.label }}
                    </button>
                  </div>
                </div>

                <!-- Minutes -->
                <div class="vt-timepicker__column">
                  <div class="vt-timepicker__options">
                    <button
                      v-for="minuteOption in minuteOptions"
                      :key="`end-minute-${minuteOption.value}`"
                      :class="[
                        'vt-timepicker__option',
                        {
                          'vt-timepicker__option--selected': endMinute === minuteOption.value,
                          'vt-timepicker__option--disabled': minuteOption.disabled,
                        },
                      ]"
                      :disabled="minuteOption.disabled"
                      @click="handleOptionClick(minuteOption.value, 'minute', true, minuteOption.disabled, $event)"
                    >
                      {{ minuteOption.label }}
                    </button>
                  </div>
                </div>

                <!-- Seconds -->
                <div v-if="showSeconds" class="vt-timepicker__column">
                  <div class="vt-timepicker__options">
                    <button
                      v-for="secondOption in secondOptions"
                      :key="`end-second-${secondOption.value}`"
                      :class="[
                        'vt-timepicker__option',
                        {
                          'vt-timepicker__option--selected': endSecond === secondOption.value,
                          'vt-timepicker__option--disabled': secondOption.disabled,
                        },
                      ]"
                      :disabled="secondOption.disabled"
                      @click="handleOptionClick(secondOption.value, 'second', true, secondOption.disabled, $event)"
                    >
                      {{ secondOption.label }}
                    </button>
                  </div>
                </div>

                <!-- AM/PM -->
                <div v-if="use12Hours" class="vt-timepicker__column">
                  <div class="vt-timepicker__options">
                    <button
                      v-for="period in periodOptions"
                      :key="`end-period-${period}`"
                      :class="['vt-timepicker__option', { 'vt-timepicker__option--selected': endPeriod === period }]"
                      @click="handleOptionClick(period, 'period', true, false, $event)"
                    >
                      {{ period }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Single Time Panel -->
          <div v-else class="vt-timepicker__single-panel">
            <div class="vt-timepicker__time-columns">
              <!-- Hours -->
              <div class="vt-timepicker__column">
                <div class="vt-timepicker__options">
                  <button
                    v-for="hourOption in hourOptions"
                    :key="`hour-${hourOption.value}`"
                    :class="[
                      'vt-timepicker__option',
                      {
                        'vt-timepicker__option--selected': currentHour === hourOption.value,
                        'vt-timepicker__option--disabled': hourOption.disabled,
                      },
                    ]"
                    :disabled="hourOption.disabled"
                    @click="handleOptionClick(hourOption.value, 'hour', false, hourOption.disabled, $event)"
                  >
                    {{ hourOption.label }}
                  </button>
                </div>
              </div>

              <!-- Minutes -->
              <div class="vt-timepicker__column">
                <div class="vt-timepicker__options">
                  <button
                    v-for="minuteOption in minuteOptions"
                    :key="`minute-${minuteOption.value}`"
                    :class="[
                      'vt-timepicker__option',
                      {
                        'vt-timepicker__option--selected': currentMinute === minuteOption.value,
                        'vt-timepicker__option--disabled': minuteOption.disabled,
                      },
                    ]"
                    :disabled="minuteOption.disabled"
                    @click="handleOptionClick(minuteOption.value, 'minute', false, minuteOption.disabled, $event)"
                  >
                    {{ minuteOption.label }}
                  </button>
                </div>
              </div>

              <!-- Seconds -->
              <div v-if="showSeconds" class="vt-timepicker__column">
                <div class="vt-timepicker__options">
                  <button
                    v-for="secondOption in secondOptions"
                    :key="`second-${secondOption.value}`"
                    :class="[
                      'vt-timepicker__option',
                      {
                        'vt-timepicker__option--selected': currentSecond === secondOption.value,
                        'vt-timepicker__option--disabled': secondOption.disabled,
                      },
                    ]"
                    :disabled="secondOption.disabled"
                    @click="handleOptionClick(secondOption.value, 'second', false, secondOption.disabled, $event)"
                  >
                    {{ secondOption.label }}
                  </button>
                </div>
              </div>

              <!-- AM/PM -->
              <div v-if="use12Hours" class="vt-timepicker__column">
                <div class="vt-timepicker__options">
                  <button
                    v-for="period in periodOptions"
                    :key="`period-${period}`"
                    :class="['vt-timepicker__option', { 'vt-timepicker__option--selected': currentPeriod === period }]"
                    @click="handleOptionClick(period, 'period', false, false, $event)"
                  >
                    {{ period }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="vt-timepicker__actions">
            <VButton @click="handleCancel">Скасувати</VButton>
            <VButton type="primary" @click="handleTimeSelect">OK</VButton>
          </div>
        </div>
      </transition>
    </Teleport>
    <!-- Helper Text / Error Message -->
    <div v-if="displayErrorMessage" class="vt-timepicker__help">
      <span v-if="displayErrorMessage" class="vt-timepicker__error">
        {{ displayErrorMessage }}
      </span>
    </div>
  </div>
</template>
