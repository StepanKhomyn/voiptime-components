<!--<script lang="ts" setup>-->
<!--import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';-->
<!--import VIcon from '@/components/icon/VIcon.vue';-->
<!--import { useDropdown } from '@/components/dropdown/useDropdown';-->
<!--import {-->
<!--  DEFAULT_TIME_FORMATS,-->
<!--  formatTime,-->
<!--  generateTimeOptions,-->
<!--  isValidTimeString,-->
<!--  parseTimeString,-->
<!--  type TimeObject,-->
<!--  type TimePickerValue,-->
<!--  type TimeRangeValue,-->
<!--  type TimeValue,-->
<!--  validateTimeValue,-->
<!--  type VTimePickerEmits,-->
<!--  type VTimePickerProps,-->
<!--} from '@/components/timepicker/types';-->

<!--// ===== PROPS & DEFAULTS =====-->
<!--const props = withDefaults(defineProps<VTimePickerProps>(), {-->
<!--  type: 'time',-->
<!--  placeholder: 'Оберіть час',-->
<!--  startPlaceholder: 'Початковий час',-->
<!--  endPlaceholder: 'Кінцевий час',-->
<!--  rangeSeparator: ' - ',-->
<!--  format: 'HH:mm:ss',-->
<!--  disabled: false,-->
<!--  clearable: true,-->
<!--  size: 'default',-->
<!--  hourStep: 1,-->
<!--  minuteStep: 1,-->
<!--  secondStep: 1,-->
<!--  showSeconds: true,-->
<!--  use12Hours: false,-->
<!--  hideDisabledOptions: false,-->
<!--});-->

<!--// ===== EMITS =====-->
<!--const emit = defineEmits<VTimePickerEmits>();-->

<!--// ===== TEMPLATE REFS =====-->
<!--const timePickerRef = ref<HTMLElement>();-->
<!--const triggerRef = ref<HTMLElement>();-->
<!--const dropdownRef = ref<HTMLElement>();-->

<!--// ===== STATE =====-->
<!--const state = {-->
<!--  isFocused: ref(false),-->
<!--  startTime: ref<TimeObject | null>(null),-->
<!--  endTime: ref<TimeObject | null>(null),-->
<!--  isSelectingEnd: ref(false),-->
<!--};-->

<!--// ===== COMPOSABLES =====-->
<!--const isRange = computed(() => props.type === 'timerange');-->

<!--// ===== TIME HELPERS =====-->
<!--const formatTimeObject = (timeObj: TimeObject): string => {-->
<!--  if (!timeObj) return '';-->

<!--  const { hour, minute, second } = timeObj;-->
<!--  const formatStr =-->
<!--    props.format ||-->
<!--    (props.showSeconds-->
<!--      ? props.use12Hours-->
<!--        ? DEFAULT_TIME_FORMATS['12h']-->
<!--        : DEFAULT_TIME_FORMATS['24h']-->
<!--      : props.use12Hours-->
<!--        ? DEFAULT_TIME_FORMATS['12h_no_seconds']-->
<!--        : DEFAULT_TIME_FORMATS['24h_no_seconds']);-->

<!--  return formatTime(hour, minute, second, formatStr, props.use12Hours);-->
<!--};-->

<!--const parseTimeValue = (value: TimeValue): TimeObject | null => {-->
<!--  if (!value) return null;-->

<!--  if (value instanceof Date) {-->
<!--    return {-->
<!--      hour: value.getHours(),-->
<!--      minute: value.getMinutes(),-->
<!--      second: value.getSeconds(),-->
<!--    };-->
<!--  }-->

<!--  if (typeof value === 'string' && isValidTimeString(value)) {-->
<!--    return parseTimeString(value);-->
<!--  }-->

<!--  return null;-->
<!--};-->

<!--const validateTime = (value: TimePickerValue, required = false) => {-->
<!--  return validateTimeValue(value, props.type, required);-->
<!--};-->

<!--// ===== COMPUTED VALUES =====-->
<!--const currentValue = computed(() => {-->
<!--  if (!props.modelValue) return isRange.value ? [null, null] : null;-->

<!--  if (isRange.value) {-->
<!--    if (Array.isArray(props.modelValue) && props.modelValue.length === 2) {-->
<!--      return [parseTimeValue(props.modelValue[0]), parseTimeValue(props.modelValue[1])];-->
<!--    }-->
<!--    return [null, null];-->
<!--  } else {-->
<!--    return parseTimeValue(props.modelValue as TimeValue);-->
<!--  }-->
<!--});-->

<!--const displayText = computed(() => {-->
<!--  if (isRange.value) {-->
<!--    const [start, end] = currentValue.value as [TimeObject | null, TimeObject | null];-->
<!--    if (start && end) {-->
<!--      return [formatTimeObject(start), formatTimeObject(end)];-->
<!--    } else if (start) {-->
<!--      return [formatTimeObject(start), ''];-->
<!--    }-->
<!--    return ['', ''];-->
<!--  } else {-->
<!--    const time = currentValue.value as TimeObject | null;-->
<!--    return time ? formatTimeObject(time) : '';-->
<!--  }-->
<!--});-->

<!--const hasDisplayValue = computed(() => {-->
<!--  if (isRange.value) {-->
<!--    const [start, end] = displayText.value as [string, string];-->
<!--    return start || end;-->
<!--  } else {-->
<!--    return !!displayText.value;-->
<!--  }-->
<!--});-->

<!--const showClearButton = computed(() => {-->
<!--  return props.clearable && !props.disabled && hasDisplayValue.value;-->
<!--});-->

<!--const currentPlaceholder = computed(() => {-->
<!--  if (isRange.value) {-->
<!--    if (state.isSelectingEnd.value) {-->
<!--      return props.endPlaceholder;-->
<!--    }-->
<!--    return props.startPlaceholder;-->
<!--  }-->
<!--  return props.placeholder;-->
<!--});-->

<!--const pickerClasses = computed(() => [-->
<!--  'vt-timepicker',-->
<!--  `vt-timepicker&#45;&#45;${props.size}`,-->
<!--  `vt-timepicker&#45;&#45;${props.type}`,-->
<!--  {-->
<!--    'vt-timepicker&#45;&#45;disabled': props.disabled,-->
<!--    'vt-timepicker&#45;&#45;focused': state.isFocused.value,-->
<!--    'vt-timepicker&#45;&#45;range': isRange.value,-->
<!--    'vt-timepicker&#45;&#45;open': isDropdownVisible.value,-->
<!--  },-->
<!--]);-->

<!--// ===== CURRENT TIME STATE =====-->
<!--const currentHour = ref(new Date().getHours());-->
<!--const currentMinute = ref(new Date().getMinutes());-->
<!--const currentSecond = ref(new Date().getSeconds());-->
<!--const currentPeriod = ref<'AM' | 'PM'>('AM');-->

<!--const endHour = ref(new Date().getHours());-->
<!--const endMinute = ref(new Date().getMinutes());-->
<!--const endSecond = ref(new Date().getSeconds());-->
<!--const endPeriod = ref<'AM' | 'PM'>('AM');-->

<!--// ===== TIME LISTS =====-->
<!--const hourOptions = computed(() => {-->
<!--  const maxHour = props.use12Hours ? 12 : 23;-->
<!--  const startHour = props.use12Hours ? 1 : 0;-->
<!--  const disabledHours = props.disabledHours ? props.disabledHours() : [];-->

<!--  const options = generateTimeOptions(startHour, maxHour, props.hourStep, disabledHours);-->

<!--  return props.hideDisabledOptions ? options.filter(option => !option.disabled) : options;-->
<!--});-->

<!--const minuteOptions = computed(() => {-->
<!--  const selectedHour = props.use12Hours-->
<!--    ? currentPeriod.value === 'PM' && currentHour.value !== 12-->
<!--      ? currentHour.value + 12-->
<!--      : currentPeriod.value === 'AM' && currentHour.value === 12-->
<!--        ? 0-->
<!--        : currentHour.value-->
<!--    : currentHour.value;-->

<!--  const disabledMinutes = props.disabledMinutes ? props.disabledMinutes(selectedHour) : [];-->

<!--  const options = generateTimeOptions(0, 59, props.minuteStep, disabledMinutes);-->

<!--  return props.hideDisabledOptions ? options.filter(option => !option.disabled) : options;-->
<!--});-->

<!--const secondOptions = computed(() => {-->
<!--  const selectedHour = props.use12Hours-->
<!--    ? currentPeriod.value === 'PM' && currentHour.value !== 12-->
<!--      ? currentHour.value + 12-->
<!--      : currentPeriod.value === 'AM' && currentHour.value === 12-->
<!--        ? 0-->
<!--        : currentHour.value-->
<!--    : currentHour.value;-->

<!--  const disabledSeconds = props.disabledSeconds ? props.disabledSeconds(selectedHour, currentMinute.value) : [];-->

<!--  const options = generateTimeOptions(0, 59, props.secondStep, disabledSeconds);-->

<!--  return props.hideDisabledOptions ? options.filter(option => !option.disabled) : options;-->
<!--});-->

<!--const periodOptions = computed(() => ['AM', 'PM']);-->

<!--// ===== DROPDOWN INTEGRATION =====-->
<!--const {-->
<!--  visible: isDropdownVisible,-->
<!--  parentVisible,-->
<!--  dropdownPosition,-->
<!--  show: showDropdown,-->
<!--  hide: hideDropdown,-->
<!--  toggle: toggleDropdown,-->
<!--  updatePosition,-->
<!--} = useDropdown(triggerRef, dropdownRef, {-->
<!--  trigger: 'click',-->
<!--  placement: 'bottom-start',-->
<!--  showTimeout: 0,-->
<!--  hideTimeout: 150,-->
<!--  disabled: props.disabled,-->
<!--  hideOnClick: false,-->
<!--  onVisibleChange: visible => {-->
<!--    emit('open-change', visible);-->
<!--    if (visible) {-->
<!--      nextTick(() => {-->
<!--        updatePosition();-->
<!--        scrollToSelectedTime();-->
<!--      });-->
<!--    }-->
<!--  },-->
<!--});-->

<!--const dropdownStyle = computed(() => ({-->
<!--  ...dropdownPosition.value,-->
<!--  position: 'absolute' as const,-->
<!--  zIndex: 2000,-->
<!--}));-->

<!--// ===== SCROLL TO SELECTED TIME =====-->
<!--const scrollToSelectedTime = () => {-->
<!--  if (!isDropdownVisible.value) return;-->

<!--  nextTick(() => {-->
<!--    const allOptionsElements = dropdownRef.value?.querySelectorAll('.vt-timepicker__options');-->
<!--    if (!allOptionsElements) return;-->

<!--    const scrollToValue = (element: HTMLElement, currentValue: number, options: any[]) => {-->
<!--      const selectedIndex = options.findIndex(option => option.value === currentValue);-->
<!--      if (selectedIndex >= 0) {-->
<!--        const itemHeight = 32;-->
<!--        const containerHeight = element.clientHeight;-->
<!--        const scrollTop = selectedIndex * itemHeight - containerHeight / 2 + itemHeight / 2;-->
<!--        element.scrollTop = Math.max(0, scrollTop);-->
<!--      }-->
<!--    };-->

<!--    if (isRange.value) {-->
<!--      const elementsArray = Array.from(allOptionsElements);-->

<!--      // Start time panel-->
<!--      if (elementsArray[0]) scrollToValue(elementsArray[0], currentHour.value, hourOptions.value);-->
<!--      if (elementsArray[1]) scrollToValue(elementsArray[1], currentMinute.value, minuteOptions.value);-->
<!--      if (props.showSeconds && elementsArray[2]) {-->
<!--        scrollToValue(elementsArray[2], currentSecond.value, secondOptions.value);-->
<!--      }-->

<!--      // End time panel-->
<!--      const endStartIndex = props.showSeconds ? (props.use12Hours ? 4 : 3) : props.use12Hours ? 3 : 2;-->
<!--      if (elementsArray[endStartIndex]) scrollToValue(elementsArray[endStartIndex], endHour.value, hourOptions.value);-->
<!--      if (elementsArray[endStartIndex + 1])-->
<!--        scrollToValue(elementsArray[endStartIndex + 1], endMinute.value, minuteOptions.value);-->
<!--      if (props.showSeconds && elementsArray[endStartIndex + 2]) {-->
<!--        scrollToValue(elementsArray[endStartIndex + 2], endSecond.value, secondOptions.value);-->
<!--      }-->
<!--    } else {-->
<!--      const elementsArray = Array.from(allOptionsElements);-->
<!--      if (elementsArray[0]) scrollToValue(elementsArray[0], currentHour.value, hourOptions.value);-->
<!--      if (elementsArray[1]) scrollToValue(elementsArray[1], currentMinute.value, minuteOptions.value);-->
<!--      if (props.showSeconds && elementsArray[2]) {-->
<!--        scrollToValue(elementsArray[2], currentSecond.value, secondOptions.value);-->
<!--      }-->
<!--    }-->
<!--  });-->
<!--};-->

<!--// ===== HANDLE SCROLL SELECTION =====-->
<!--let scrollTimeout: NodeJS.Timeout | null = null;-->

<!--const handleScroll = (event: Event, type: 'hour' | 'minute' | 'second', isEndTime = false) => {-->
<!--  if (scrollTimeout) {-->
<!--    clearTimeout(scrollTimeout);-->
<!--  }-->

<!--  scrollTimeout = setTimeout(() => {-->
<!--    const container = event.target as HTMLElement;-->
<!--    const itemHeight = 32;-->
<!--    const containerHeight = container.clientHeight;-->
<!--    const scrollTop = container.scrollTop;-->

<!--    const centerIndex = Math.round((scrollTop + containerHeight / 2 - itemHeight / 2) / itemHeight);-->

<!--    let options: typeof hourOptions.value;-->
<!--    switch (type) {-->
<!--      case 'hour':-->
<!--        options = hourOptions.value;-->
<!--        break;-->
<!--      case 'minute':-->
<!--        options = minuteOptions.value;-->
<!--        break;-->
<!--      case 'second':-->
<!--        options = secondOptions.value;-->
<!--        break;-->
<!--    }-->

<!--    if (centerIndex >= 0 && centerIndex < options.length) {-->
<!--      const selectedOption = options[centerIndex];-->
<!--      if (!selectedOption.disabled) {-->
<!--        if (type === 'hour') {-->
<!--          if (isEndTime) {-->
<!--            endHour.value = selectedOption.value;-->
<!--          } else {-->
<!--            currentHour.value = selectedOption.value;-->
<!--          }-->
<!--        } else if (type === 'minute') {-->
<!--          if (isEndTime) {-->
<!--            endMinute.value = selectedOption.value;-->
<!--          } else {-->
<!--            currentMinute.value = selectedOption.value;-->
<!--          }-->
<!--        } else if (type === 'second') {-->
<!--          if (isEndTime) {-->
<!--            endSecond.value = selectedOption.value;-->
<!--          } else {-->
<!--            currentSecond.value = selectedOption.value;-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }, 100);-->
<!--};-->

<!--// ===== EVENT HANDLERS =====-->
<!--const handleClickOutside = (event: MouseEvent) => {-->
<!--  if (!isDropdownVisible.value) return;-->

<!--  const target = event.target as Node;-->
<!--  if (timePickerRef.value?.contains(target) || dropdownRef.value?.contains(target)) {-->
<!--    return;-->
<!--  }-->

<!--  hideDropdown();-->
<!--};-->

<!--const handleTriggerClick = () => {-->
<!--  if (props.disabled) return;-->
<!--  toggleDropdown();-->
<!--};-->

<!--const handleFocus = () => {-->
<!--  state.isFocused.value = true;-->
<!--  emit('focus', timePickerRef.value);-->
<!--};-->

<!--const handleBlur = () => {-->
<!--  state.isFocused.value = false;-->
<!--  emit('blur', timePickerRef.value);-->
<!--};-->

<!--const handleClear = () => {-->
<!--  const newValue = isRange.value ? null : null;-->
<!--  emit('update:modelValue', newValue);-->
<!--  emit('change', newValue);-->

<!--  if (isRange.value) {-->
<!--    state.startTime.value = null;-->
<!--    state.endTime.value = null;-->
<!--    state.isSelectingEnd.value = false;-->
<!--  }-->
<!--};-->

<!--const formatOutput = (timeObj: TimeObject): string => {-->
<!--  return formatTimeObject(timeObj);-->
<!--};-->

<!--const handleTimeSelect = () => {-->
<!--  if (props.disabled) return;-->

<!--  if (isRange.value) {-->
<!--    let startHour = currentHour.value;-->
<!--    let endHourValue = endHour.value;-->

<!--    if (props.use12Hours) {-->
<!--      if (currentPeriod.value === 'PM' && startHour !== 12) startHour += 12;-->
<!--      if (currentPeriod.value === 'AM' && startHour === 12) startHour = 0;-->

<!--      if (endPeriod.value === 'PM' && endHourValue !== 12) endHourValue += 12;-->
<!--      if (endPeriod.value === 'AM' && endHourValue === 12) endHourValue = 0;-->
<!--    }-->

<!--    const startTimeObj = { hour: startHour, minute: currentMinute.value, second: currentSecond.value };-->
<!--    const endTimeObj = { hour: endHourValue, minute: endMinute.value, second: endSecond.value };-->

<!--    const rangeValue: TimeRangeValue = [formatOutput(startTimeObj), formatOutput(endTimeObj)];-->

<!--    const validation = validateTime(rangeValue);-->
<!--    if (!validation.isValid) {-->
<!--      console.warn('Time range validation failed:', validation.errors);-->
<!--      return;-->
<!--    }-->

<!--    emit('update:modelValue', rangeValue);-->
<!--    emit('change', rangeValue);-->
<!--  } else {-->
<!--    let hour = currentHour.value;-->

<!--    if (props.use12Hours) {-->
<!--      if (currentPeriod.value === 'PM' && hour !== 12) hour += 12;-->
<!--      if (currentPeriod.value === 'AM' && hour === 12) hour = 0;-->
<!--    }-->

<!--    const timeObj: TimeObject = { hour, minute: currentMinute.value, second: currentSecond.value };-->
<!--    const outputValue = formatOutput(timeObj);-->

<!--    const validation = validateTime(outputValue);-->
<!--    if (!validation.isValid) {-->
<!--      console.warn('Time validation failed:', validation.errors);-->
<!--      return;-->
<!--    }-->

<!--    emit('update:modelValue', outputValue);-->
<!--    emit('change', outputValue);-->
<!--  }-->

<!--  hideDropdown();-->
<!--};-->

<!--const handleCancel = () => {-->
<!--  hideDropdown();-->
<!--};-->

<!--// ===== COMPONENT METHODS =====-->
<!--const focus = () => {-->
<!--  triggerRef.value?.focus();-->
<!--};-->

<!--const blur = () => {-->
<!--  triggerRef.value?.blur();-->
<!--};-->

<!--const open = () => {-->
<!--  if (!props.disabled) {-->
<!--    showDropdown();-->
<!--  }-->
<!--};-->

<!--const close = () => {-->
<!--  hideDropdown();-->
<!--};-->

<!--defineExpose({-->
<!--  focus,-->
<!--  blur,-->
<!--  open,-->
<!--  close,-->
<!--  validate: validateTime,-->
<!--});-->

<!--// ===== WATCHERS =====-->
<!--watch(-->
<!--  () => props.modelValue,-->
<!--  newValue => {-->
<!--    if (newValue) {-->
<!--      if (isRange.value && Array.isArray(newValue)) {-->
<!--        const startTime = parseTimeValue(newValue[0]);-->
<!--        const endTime = parseTimeValue(newValue[1]);-->

<!--        if (startTime) {-->
<!--          let hour = startTime.hour;-->
<!--          if (props.use12Hours) {-->
<!--            currentPeriod.value = hour >= 12 ? 'PM' : 'AM';-->
<!--            hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;-->
<!--          }-->
<!--          currentHour.value = hour;-->
<!--          currentMinute.value = startTime.minute;-->
<!--          currentSecond.value = startTime.second;-->
<!--        }-->

<!--        if (endTime) {-->
<!--          let hour = endTime.hour;-->
<!--          if (props.use12Hours) {-->
<!--            endPeriod.value = hour >= 12 ? 'PM' : 'AM';-->
<!--            hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;-->
<!--          }-->
<!--          endHour.value = hour;-->
<!--          endMinute.value = endTime.minute;-->
<!--          endSecond.value = endTime.second;-->
<!--        }-->
<!--      } else if (!isRange.value) {-->
<!--        const time = parseTimeValue(newValue as TimeValue);-->
<!--        if (time) {-->
<!--          let hour = time.hour;-->
<!--          if (props.use12Hours) {-->
<!--            currentPeriod.value = hour >= 12 ? 'PM' : 'AM';-->
<!--            hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;-->
<!--          }-->
<!--          currentHour.value = hour;-->
<!--          currentMinute.value = time.minute;-->
<!--          currentSecond.value = time.second;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  { immediate: true },-->
<!--);-->

<!--// ===== LIFECYCLE HOOKS =====-->
<!--onMounted(() => {-->
<!--  document.addEventListener('click', handleClickOutside);-->

<!--  if (!props.modelValue) {-->
<!--    const now = new Date();-->
<!--    let hour = now.getHours();-->

<!--    if (props.use12Hours) {-->
<!--      currentPeriod.value = hour >= 12 ? 'PM' : 'AM';-->
<!--      endPeriod.value = hour >= 12 ? 'PM' : 'AM';-->
<!--      hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;-->
<!--    }-->

<!--    currentHour.value = hour;-->
<!--    currentMinute.value = now.getMinutes();-->
<!--    currentSecond.value = now.getSeconds();-->

<!--    endHour.value = hour;-->
<!--    endMinute.value = now.getMinutes();-->
<!--    endSecond.value = now.getSeconds();-->
<!--  }-->
<!--});-->

<!--onUnmounted(() => {-->
<!--  document.removeEventListener('click', handleClickOutside);-->
<!--  if (scrollTimeout) {-->
<!--    clearTimeout(scrollTimeout);-->
<!--  }-->
<!--});-->
<!--</script>-->

<!--<template>-->
<!--  <div ref="timePickerRef" :class="pickerClasses">-->
<!--    &lt;!&ndash; Trigger &ndash;&gt;-->
<!--    <div-->
<!--      ref="triggerRef"-->
<!--      class="vt-timepicker__trigger"-->
<!--      tabindex="0"-->
<!--      @blur="handleBlur"-->
<!--      @click="handleTriggerClick"-->
<!--      @focus="handleFocus"-->
<!--    >-->
<!--      <div class="vt-timepicker__input">-->
<!--        <div class="vt-timepicker__icon">-->
<!--          <VIcon name="clock" />-->
<!--        </div>-->

<!--        <div v-if="hasDisplayValue" class="vt-timepicker__text">-->
<!--          <template v-if="isRange">-->
<!--            <span>{{ displayText[0] }}</span>-->
<!--            <span>{{ props.rangeSeparator }}</span>-->
<!--            <span>{{ displayText[1] }}</span>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            {{ displayText }}-->
<!--          </template>-->
<!--        </div>-->
<!--        <div v-else class="vt-timepicker__placeholder">-->
<!--          <template v-if="isRange">-->
<!--            <span>{{ props.startPlaceholder }}</span>-->
<!--            <span>{{ props.rangeSeparator }}</span>-->
<!--            <span>{{ props.endPlaceholder }}</span>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            {{ currentPlaceholder }}-->
<!--          </template>-->
<!--        </div>-->

<!--        <div class="vt-timepicker__suffix">-->
<!--          <button-->
<!--            v-if="showClearButton"-->
<!--            :disabled="props.disabled"-->
<!--            class="vt-timepicker__clear"-->
<!--            type="button"-->
<!--            @click.stop="handleClear"-->
<!--          >-->
<!--            <VIcon name="close" />-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    &lt;!&ndash; Dropdown &ndash;&gt;-->
<!--    <Teleport v-if="isDropdownVisible && parentVisible" to="body">-->
<!--      <transition name="dropdown">-->
<!--        <div ref="dropdownRef" :style="dropdownStyle" class="vt-timepicker__dropdown" @click.stop @mousedown.prevent>-->
<!--          <div v-if="isRange" class="vt-timepicker__dual-panel">-->
<!--            &lt;!&ndash; Start Time Panel &ndash;&gt;-->
<!--            <div class="vt-timepicker__panel">-->
<!--              <div class="vt-timepicker__panel-header">Початковий час</div>-->
<!--              <div class="vt-timepicker__time-columns">-->
<!--                &lt;!&ndash; Hours &ndash;&gt;-->
<!--                <div class="vt-timepicker__column">-->
<!--                  <div class="vt-timepicker__options" @scroll="e => handleScroll(e, 'hour', false)">-->
<!--                    <button-->
<!--                      v-for="hourOption in hourOptions"-->
<!--                      :key="`start-hour-${hourOption.value}`"-->
<!--                      :class="[-->
<!--                        'vt-timepicker__option',-->
<!--                        {-->
<!--                          'vt-timepicker__option&#45;&#45;selected': currentHour === hourOption.value,-->
<!--                          'vt-timepicker__option&#45;&#45;disabled': hourOption.disabled,-->
<!--                        },-->
<!--                      ]"-->
<!--                      :disabled="hourOption.disabled"-->
<!--                      @click="!hourOption.disabled && (currentHour = hourOption.value)"-->
<!--                    >-->
<!--                      {{ hourOption.label }}-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash; Minutes &ndash;&gt;-->
<!--                <div class="vt-timepicker__column">-->
<!--                  <div class="vt-timepicker__options" @scroll="e => handleScroll(e, 'minute', false)">-->
<!--                    <button-->
<!--                      v-for="minuteOption in minuteOptions"-->
<!--                      :key="`start-minute-${minuteOption.value}`"-->
<!--                      :class="[-->
<!--                        'vt-timepicker__option',-->
<!--                        {-->
<!--                          'vt-timepicker__option&#45;&#45;selected': currentMinute === minuteOption.value,-->
<!--                          'vt-timepicker__option&#45;&#45;disabled': minuteOption.disabled,-->
<!--                        },-->
<!--                      ]"-->
<!--                      :disabled="minuteOption.disabled"-->
<!--                      @click="!minuteOption.disabled && (currentMinute = minuteOption.value)"-->
<!--                    >-->
<!--                      {{ minuteOption.label }}-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash; Seconds &ndash;&gt;-->
<!--                <div v-if="showSeconds" class="vt-timepicker__column">-->
<!--                  <div class="vt-timepicker__options" @scroll="e => handleScroll(e, 'second', false)">-->
<!--                    <button-->
<!--                      v-for="secondOption in secondOptions"-->
<!--                      :key="`start-second-${secondOption.value}`"-->
<!--                      :class="[-->
<!--                        'vt-timepicker__option',-->
<!--                        {-->
<!--                          'vt-timepicker__option&#45;&#45;selected': currentSecond === secondOption.value,-->
<!--                          'vt-timepicker__option&#45;&#45;disabled': secondOption.disabled,-->
<!--                        },-->
<!--                      ]"-->
<!--                      :disabled="secondOption.disabled"-->
<!--                      @click="!secondOption.disabled && (currentSecond = secondOption.value)"-->
<!--                    >-->
<!--                      {{ secondOption.label }}-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash; AM/PM &ndash;&gt;-->
<!--                <div v-if="use12Hours" class="vt-timepicker__column">-->
<!--                  <div class="vt-timepicker__options">-->
<!--                    <button-->
<!--                      v-for="period in periodOptions"-->
<!--                      :key="`start-period-${period}`"-->
<!--                      :class="[-->
<!--                        'vt-timepicker__option',-->
<!--                        { 'vt-timepicker__option&#45;&#45;selected': currentPeriod === period },-->
<!--                      ]"-->
<!--                      @click="currentPeriod = period"-->
<!--                    >-->
<!--                      {{ period }}-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->

<!--            &lt;!&ndash; End Time Panel &ndash;&gt;-->
<!--            <div class="vt-timepicker__panel">-->
<!--              <div class="vt-timepicker__panel-header">Кінцевий час</div>-->
<!--              <div class="vt-timepicker__time-columns">-->
<!--                &lt;!&ndash; Hours &ndash;&gt;-->
<!--                <div class="vt-timepicker__column">-->
<!--                  <div class="vt-timepicker__options" @scroll="e => handleScroll(e, 'hour', true)">-->
<!--                    <button-->
<!--                      v-for="hourOption in hourOptions"-->
<!--                      :key="`end-hour-${hourOption.value}`"-->
<!--                      :class="[-->
<!--                        'vt-timepicker__option',-->
<!--                        {-->
<!--                          'vt-timepicker__option&#45;&#45;selected': endHour === hourOption.value,-->
<!--                          'vt-timepicker__option&#45;&#45;disabled': hourOption.disabled,-->
<!--                        },-->
<!--                      ]"-->
<!--                      :disabled="hourOption.disabled"-->
<!--                      @click="!hourOption.disabled && (endHour = hourOption.value)"-->
<!--                    >-->
<!--                      {{ hourOption.label }}-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash; Minutes &ndash;&gt;-->
<!--                <div class="vt-timepicker__column">-->
<!--                  <div class="vt-timepicker__options" @scroll="e => handleScroll(e, 'minute', true)">-->
<!--                    <button-->
<!--                      v-for="minuteOption in minuteOptions"-->
<!--                      :key="`end-minute-${minuteOption.value}`"-->
<!--                      :class="[-->
<!--                        'vt-timepicker__option',-->
<!--                        {-->
<!--                          'vt-timepicker__option&#45;&#45;selected': endMinute === minuteOption.value,-->
<!--                          'vt-timepicker__option&#45;&#45;disabled': minuteOption.disabled,-->
<!--                        },-->
<!--                      ]"-->
<!--                      :disabled="minuteOption.disabled"-->
<!--                      @click="!minuteOption.disabled && (endMinute = minuteOption.value)"-->
<!--                    >-->
<!--                      {{ minuteOption.label }}-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash; Seconds &ndash;&gt;-->
<!--                <div v-if="showSeconds" class="vt-timepicker__column">-->
<!--                  <div class="vt-timepicker__options" @scroll="e => handleScroll(e, 'second', true)">-->
<!--                    <button-->
<!--                      v-for="secondOption in secondOptions"-->
<!--                      :key="`end-second-${secondOption.value}`"-->
<!--                      :class="[-->
<!--                        'vt-timepicker__option',-->
<!--                        {-->
<!--                          'vt-timepicker__option&#45;&#45;selected': endSecond === secondOption.value,-->
<!--                          'vt-timepicker__option&#45;&#45;disabled': secondOption.disabled,-->
<!--                        },-->
<!--                      ]"-->
<!--                      :disabled="secondOption.disabled"-->
<!--                      @click="!secondOption.disabled && (endSecond = secondOption.value)"-->
<!--                    >-->
<!--                      {{ secondOption.label }}-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->

<!--                &lt;!&ndash; AM/PM &ndash;&gt;-->
<!--                <div v-if="use12Hours" class="vt-timepicker__column">-->
<!--                  <div class="vt-timepicker__options">-->
<!--                    <button-->
<!--                      v-for="period in periodOptions"-->
<!--                      :key="`end-period-${period}`"-->
<!--                      :class="['vt-timepicker__option', { 'vt-timepicker__option&#45;&#45;selected': endPeriod === period }]"-->
<!--                      @click="endPeriod = period"-->
<!--                    >-->
<!--                      {{ period }}-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash; Single Time Panel &ndash;&gt;-->
<!--          <div v-else class="vt-timepicker__single-panel">-->
<!--            <div class="vt-timepicker__time-columns">-->
<!--              &lt;!&ndash; Hours &ndash;&gt;-->
<!--              <div class="vt-timepicker__column">-->
<!--                <div class="vt-timepicker__options" @scroll="e => handleScroll(e, 'hour', false)">-->
<!--                  <button-->
<!--                    v-for="hourOption in hourOptions"-->
<!--                    :key="`hour-${hourOption.value}`"-->
<!--                    :class="[-->
<!--                      'vt-timepicker__option',-->
<!--                      {-->
<!--                        'vt-timepicker__option&#45;&#45;selected': currentHour === hourOption.value,-->
<!--                        'vt-timepicker__option&#45;&#45;disabled': hourOption.disabled,-->
<!--                      },-->
<!--                    ]"-->
<!--                    :disabled="hourOption.disabled"-->
<!--                    @click="!hourOption.disabled && (currentHour = hourOption.value)"-->
<!--                  >-->
<!--                    {{ hourOption.label }}-->
<!--                  </button>-->
<!--                </div>-->
<!--              </div>-->

<!--              &lt;!&ndash; Minutes &ndash;&gt;-->
<!--              <div class="vt-timepicker__column">-->
<!--                <div class="vt-timepicker__options" @scroll="e => handleScroll(e, 'minute', false)">-->
<!--                  <button-->
<!--                    v-for="minuteOption in minuteOptions"-->
<!--                    :key="`minute-${minuteOption.value}`"-->
<!--                    :class="[-->
<!--                      'vt-timepicker__option',-->
<!--                      {-->
<!--                        'vt-timepicker__option&#45;&#45;selected': currentMinute === minuteOption.value,-->
<!--                        'vt-timepicker__option&#45;&#45;disabled': minuteOption.disabled,-->
<!--                      },-->
<!--                    ]"-->
<!--                    :disabled="minuteOption.disabled"-->
<!--                    @click="!minuteOption.disabled && (currentMinute = minuteOption.value)"-->
<!--                  >-->
<!--                    {{ minuteOption.label }}-->
<!--                  </button>-->
<!--                </div>-->
<!--              </div>-->

<!--              &lt;!&ndash; Seconds &ndash;&gt;-->
<!--              <div v-if="showSeconds" class="vt-timepicker__column">-->
<!--                <div class="vt-timepicker__options" @scroll="e => handleScroll(e, 'second', false)">-->
<!--                  <button-->
<!--                    v-for="secondOption in secondOptions"-->
<!--                    :key="`second-${secondOption.value}`"-->
<!--                    :class="[-->
<!--                      'vt-timepicker__option',-->
<!--                      {-->
<!--                        'vt-timepicker__option&#45;&#45;selected': currentSecond === secondOption.value,-->
<!--                        'vt-timepicker__option&#45;&#45;disabled': secondOption.disabled,-->
<!--                      },-->
<!--                    ]"-->
<!--                    :disabled="secondOption.disabled"-->
<!--                    @click="!secondOption.disabled && (currentSecond = secondOption.value)"-->
<!--                  >-->
<!--                    {{ secondOption.label }}-->
<!--                  </button>-->
<!--                </div>-->
<!--              </div>-->

<!--              &lt;!&ndash; AM/PM &ndash;&gt;-->
<!--              <div v-if="use12Hours" class="vt-timepicker__column">-->
<!--                <div class="vt-timepicker__options">-->
<!--                  <button-->
<!--                    v-for="period in periodOptions"-->
<!--                    :key="`period-${period}`"-->
<!--                    :class="['vt-timepicker__option', { 'vt-timepicker__option&#45;&#45;selected': currentPeriod === period }]"-->
<!--                    @click="currentPeriod = period"-->
<!--                  >-->
<!--                    {{ period }}-->
<!--                  </button>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash; Actions &ndash;&gt;-->
<!--          <div class="vt-timepicker__actions">-->
<!--            <button class="vt-timepicker__action vt-timepicker__action&#45;&#45;cancel" @click="handleCancel">-->
<!--              Скасувати-->
<!--            </button>-->
<!--            <button class="vt-timepicker__action vt-timepicker__action&#45;&#45;confirm" @click="handleTimeSelect"> OK</button>-->
<!--          </div>-->
<!--        </div>-->
<!--      </transition>-->
<!--    </Teleport>-->
<!--  </div>-->
<!--</template>-->

<template>
  <div></div>
</template>
<script lang="ts"></script>
