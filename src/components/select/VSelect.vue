<script lang="ts" setup>
  import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';
  import VLoader from '@/components/loader/VLoader.vue';
  import { useDropdown } from '@/components/dropdown/useDropdown';
  import type {
    VtSelectContext,
    VtSelectEmits,
    VtSelectMethods,
    VtSelectOption,
    VtSelectProps,
  } from '@/components/select/types';
  import { VtSelectContextKey } from '@/components/select/types';

  import {
    calculateVisibleTagsCount,
    compareValues,
    createCollapsedTooltip,
    getEmptyValue,
    handleOptionSelection,
    isOptionSelected,
    removeTagFromValue,
    validateSelectValue,
  } from '@/components/select/helpers';
  import VInput from '@/components/input/VInput.vue';

  // ===== PROPS & DEFAULTS =====
  const props = withDefaults(defineProps<VtSelectProps>(), {
    status: 'default',
    disabled: false,
    clearable: false,
    loading: false,
    multiple: false,
    filterable: false,
    collapsedTags: false,
    outlined: false,
    placeholder: 'Оберіть опцію',
    noDataText: 'Немає даних',
    loadingText: 'Завантаження...',
    maxHeight: 220,
    validateOnInput: true,
    validateOnBlur: true,
    placement: 'bottom-start',
    trigger: 'click',
    showTimeout: 0,
    hideTimeout: 0,
    filterPlaceholder: 'Пошук...',
    allowRemoteFilter: false,
  });

  // ===== EMITS =====
  const emit = defineEmits<VtSelectEmits>();

  // ===== TEMPLATE REFS =====
  const selectRef = ref<HTMLElement>();
  const triggerRef = ref<HTMLElement>();
  const dropdownRef = ref<HTMLElement>();
  const containerRef = ref<HTMLElement>();
  const tagRefs = ref<HTMLElement[]>([]);
  const measureTagRefs = ref<HTMLElement[]>([]);
  const scrollContainerRef = ref<HTMLElement>();
  const filterInputRef = ref<InstanceType<typeof VInput>>();

  // ===== STATE =====
  const state = {
    isFocused: ref(false),
    validationErrors: ref<string[]>([]),
    isValid: ref(true),
    visibleCount: ref(0),
    filterQuery: ref(''),
  };

  // ===== OPTIONS REGISTRY =====
  const allRegisteredOptions = ref<Map<string, VtSelectOption>>(new Map());
  const activeOptionKeys = ref<Set<string>>(new Set());
  const optionSlots = ref<Map<any, any>>(new Map());

  const getOptionKey = (value: any): string => {
    if (value === null || value === undefined) return String(value);

    if (props.valueKey && typeof value === 'object') {
      return String(value[props.valueKey]);
    }
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  };

  const registerOption = (option: VtSelectOption, slotContent?: any) => {
    const key = getOptionKey(option.value);

    // Зберігаємо опцію в загальному реєстрі (зберігає порядок)
    allRegisteredOptions.value.set(key, option);

    // Позначаємо як активну
    activeOptionKeys.value.add(key);

    if (slotContent) {
      optionSlots.value.set(option.value, slotContent);
    }
  };

  const unregisterOption = (value: any) => {
    const key = getOptionKey(value);

    // НЕ видаляємо з allRegisteredOptions, щоб зберегти порядок
    // Просто видаляємо з активних
    activeOptionKeys.value.delete(key);

    // Slot можна видалити, він буде перереєстрований при потребі
    optionSlots.value.delete(value);
  };

  const getOptionSlot = (value: any) => {
    // Для об'єктів шукаємо по ключу порівняння або по JSON
    for (const [key, slot] of optionSlots.value.entries()) {
      if (compareValues(key, value, props.valueKey)) {
        return slot;
      }
    }
    return undefined;
  };

  // ===== FILTER HELPERS =====
  const normalizeString = (str: string): string => {
    return str.toLowerCase().trim();
  };

  const filterOption = (option: VtSelectOption, query: string): boolean => {
    if (!query) return true;

    const normalizedQuery = normalizeString(query);

    // Пошук по label
    if (option.label && typeof option.label === 'string') {
      if (normalizeString(option.label).includes(normalizedQuery)) {
        return true;
      }
    }

    // Пошук по value (якщо це строка)
    if (typeof option.value === 'string') {
      if (normalizeString(option.value).includes(normalizedQuery)) {
        return true;
      }
    }

    // Додатковий пошук по всім string властивостям об'єкта value
    if (typeof option.value === 'object' && option.value !== null) {
      const searchableFields = Object.values(option.value).filter(val => typeof val === 'string');
      for (const field of searchableFields) {
        if (normalizeString(field as string).includes(normalizedQuery)) {
          return true;
        }
      }
    }

    return false;
  };

  // Computed для отримання тільки активних опцій у правильному порядку
  const registeredOptions = computed(() => {
    const result: VtSelectOption[] = [];
    const addedKeys = new Set<string>();

    // Спочатку додаємо зареєстровані активні опції
    for (const [key, option] of allRegisteredOptions.value.entries()) {
      if (activeOptionKeys.value.has(key)) {
        result.push(option);
        addedKeys.add(key);
      }
    }

    // Тепер додаємо опції з modelValue, які ще не зареєстровані
    if (props.modelValue) {
      let modelArray: any[];

      if (isMultiple.value) {
        modelArray = Array.isArray(props.modelValue) ? props.modelValue : [];
      } else {
        modelArray = [props.modelValue];
      }

      // Для кожного значення з modelValue
      for (const modelVal of modelArray) {
        const key = getOptionKey(modelVal);

        // Якщо опція ще не додана
        if (!addedKeys.has(key)) {
          // Створюємо тимчасову опцію
          const tempOption: VtSelectOption = {
            value: modelVal,
            label: getLabelFromValue(modelVal),
            disabled: false,
          };
          result.push(tempOption);
          addedKeys.add(key);
        }
      }
    }

    return result;
  });

  // Фільтровані опції
  const filteredOptions = computed((): VtSelectOption[] => {
    if (!props.filterable || !state.filterQuery.value.trim()) {
      return registeredOptions.value;
    }

    // Якщо використовується remote фільтрація, просто повертаємо всі опції
    // оскільки фільтрація відбувається на сервері
    if (props.allowRemoteFilter) {
      return registeredOptions.value;
    }

    // Локальна фільтрація
    return registeredOptions.value.filter(option => filterOption(option, state.filterQuery.value));
  });

  // ===== ПРОСТИЙ SCROLL HANDLER =====
  const lastEmitTime = ref(0);
  const cooldown = 300; // мс

  const handleScroll = (event: Event) => {
    const container = event.target as HTMLElement;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Якщо до кінця залишилось менше 50px - тригеримо подію
    const scrollThreshold = 50;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - scrollThreshold;

    // Перевіряємо cooldown та умови
    const now = Date.now();
    const canEmit = !props.loading && filteredOptions.value.length > 0 && now - lastEmitTime.value > cooldown;

    if (nearBottom && canEmit) {
      lastEmitTime.value = now;
      emit('scrolled');
    }
  };

  // Функція для перевірки початкового завантаження (якщо контент не скролиться)
  const checkInitialScroll = () => {
    nextTick(() => {
      if (!scrollContainerRef.value) return;

      const container = scrollContainerRef.value;

      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      // Якщо контент поміщається в контейнер АБО вже доскролили до кінця
      const contentFits = scrollHeight <= clientHeight;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if ((contentFits || isAtBottom) && filteredOptions.value.length > 0 && !props.loading) {
        const now = Date.now();
        if (now - lastEmitTime.value > cooldown) {
          lastEmitTime.value = now;
          emit('scrolled');
        }
      }
    });
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
    showTimeout: 250,
    hideTimeout: 150,
    disabled: props.disabled,
    hideOnClick: false,
    onVisibleChange: visible => {
      if (visible) {
        nextTick(async () => {
          await updatePosition();

          // Фокус на input фільтра, якщо доступний
          if (props.filterable && filterInputRef.value) {
            filterInputRef.value.focus();
          }

          // Перевіряємо початковий скрол після невеликої затримки
          setTimeout(() => {
            checkInitialScroll();
          }, 100);
        });
      } else {
        // Очищаємо фільтр при закритті dropdown
        if (state.filterQuery.value) {
          handleFilterClear();
        }

        if (props.validateOnBlur) {
          validation.validate();
        }
      }

      emit('visible-change', visible);
    },
  });

  // ===== VALIDATION =====
  const validation = {
    validate() {
      const result = validateSelectValue(
        props.modelValue,
        isMultiple.value,
        props.required || false,
        props.requiredMessage
      );

      state.validationErrors.value = result.errors;
      state.isValid.value = result.isValid;

      emit('validation', { isValid: state.isValid.value, errors: result.errors });
    },

    clear() {
      state.validationErrors.value = [];
      state.isValid.value = true;
      emit('validation', { isValid: true, errors: [] });
    },
  };

  // ===== COMPUTED VALUES =====
  const isMultiple = computed(() => props.multiple);

  const selectedOptions = computed((): VtSelectOption[] => {
    if (props.modelValue === null || props.modelValue === undefined) return [];

    // Для мультиселекту modelValue має бути масивом
    // Для одиночного селекту - одне значення
    let modelArray: any[];

    if (isMultiple.value) {
      // Для мультиселекту modelValue повинен бути масивом
      if (!Array.isArray(props.modelValue)) {
        console.warn('VSelect: modelValue for multiple select should be an array');
        return [];
      }
      modelArray = props.modelValue;
    } else {
      // Для одиночного селекту загортаємо в масив для уніфікації обробки
      modelArray = [props.modelValue];
    }

    if (modelArray.length === 0) return [];

    const result: VtSelectOption[] = [];

    // Для кожного значення з modelValue шукаємо відповідну опцію
    for (const modelVal of modelArray) {
      const key = getOptionKey(modelVal);
      const foundOption = allRegisteredOptions.value.get(key);

      if (foundOption && activeOptionKeys.value.has(key)) {
        // Знайдена зареєстрована опція
        result.push(foundOption);
      } else {
        // Опція ще не зареєстрована, створюємо тимчасову
        const tempOption: VtSelectOption = {
          value: modelVal,
          label: getLabelFromValue(modelVal),
          disabled: false,
        };
        result.push(tempOption);
      }
    }
    return result;
  });

  // Допоміжна функція для отримання label з value
  const getLabelFromValue = (value: any): string => {
    if (value === null || value === undefined) return '';

    if (typeof value === 'object') {
      // Спробуємо знайти label, name або інше текстове поле
      if (value.label) return String(value.label);
      if (value.name) return String(value.name);
      if (props.valueKey && value[props.valueKey]) return String(value[props.valueKey]);

      // В крайньому випадку повертаємо JSON (але це не ідеально)
      return JSON.stringify(value);
    }

    return String(value);
  };

  const visibleTags = computed(() => {
    if (!props.multiple || selectedOptions.value.length === 0) return [];

    if (!props.collapsedTags) {
      return selectedOptions.value;
    }

    // Завжди показуємо мінімум 1 тег, максимум - скільки є
    const count = Math.max(1, Math.min(state.visibleCount.value || 1, selectedOptions.value.length));
    return selectedOptions.value.slice(0, count);
  });

  const displayText = computed(() => {
    if (isMultiple.value) return '';

    const selected = selectedOptions.value[0];
    if (selected) return selected.label;

    return '';
  });

  const showClearButton = computed(() => {
    if (!props.clearable || props.disabled) return false;

    // Для множинного вибору перевіряємо довжину масиву
    if (isMultiple.value) {
      return selectedOptions.value.length > 0;
    }

    // Для одиночного вибору перевіряємо наявність значення
    return (
      props.modelValue !== undefined &&
      props.modelValue !== null &&
      props.modelValue !== '' &&
      (!Array.isArray(props.modelValue) || props.modelValue.length > 0)
    );
  });

  const currentStatus = computed(() => {
    if (props.status !== 'default') return props.status;
    if (props.errorMessage) return 'error';
    if (!state.isValid.value) return 'error';
    return 'default';
  });

  // Для outlined стилю визначаємо чи label має бути вгорі
  const isLabelFloating = computed(() => {
    if (!props.outlined) return false;

    // Label плаває якщо є фокус, dropdown відкритий, або є значення
    return (
      state.isFocused.value ||
      isDropdownVisible.value ||
      (props.multiple && selectedOptions.value.length > 0) ||
      (!props.multiple && displayText.value !== '')
    );
  });

  const selectClasses = computed(() => [
    'vt-select',
    `vt-select--${currentStatus.value}`,
    {
      'vt-select--disabled': props.disabled,
      'vt-select--focused': state.isFocused.value,
      'vt-select--multiple': isMultiple.value,
      'vt-select--open': isDropdownVisible.value,
      'vt-select--outlined': props.outlined,
      'vt-select--label-floating': isLabelFloating.value,
    },
  ]);

  // Повернення помилки
  const displayErrorMessage = computed(() => {
    if (props.errorMessage) return props.errorMessage;
    if (state.validationErrors.value.length > 0) return state.validationErrors.value[0];
    return '';
  });

  const dropdownStyle = computed(() => ({
    ...dropdownPosition.value,
    position: 'absolute' as const,
    zIndex: 2000,
    maxHeight: `${props.maxHeight}px`,
  }));

  const collapsedCount = computed(() => {
    return selectedOptions.value.length - state.visibleCount.value;
  });

  const showCollapsedIndicator = computed(() => {
    return (
      props.collapsedTags &&
      props.multiple &&
      selectedOptions.value.length > 0 &&
      state.visibleCount.value < selectedOptions.value.length
    );
  });

  const collapsedTooltip = computed(() => {
    if (!showCollapsedIndicator.value) return '';

    const hiddenOptions = selectedOptions.value.slice(state.visibleCount.value);
    return createCollapsedTooltip(collapsedCount.value, hiddenOptions);
  });

  // ===== EVENT HANDLERS =====
  const handleClickOutside = (event: MouseEvent) => {
    if (!isDropdownVisible.value) return;

    const target = event.target as Node;
    if (selectRef.value?.contains(target) || dropdownRef.value?.contains(target)) {
      return;
    }

    hideDropdown();
  };

  const handleOptionClick = (option: VtSelectOption) => {
    if (!option || option.disabled) return;

    const newValue = handleOptionSelection(option, props.modelValue, isMultiple.value, props.valueKey);

    emit('update:modelValue', newValue);
    emit('change', newValue);

    if (!isMultiple.value) {
      hideDropdown();
    }

    if (props.validateOnInput) {
      validation.validate();
    }
  };

  const handleCheckboxChange = (option: VtSelectOption, isChecked: boolean) => {
    if (option.disabled) return;

    // Обробляємо вибір опції
    handleOptionClick(option);
  };

  const handleClear = () => {
    const emptyValue = getEmptyValue(isMultiple.value);
    emit('update:modelValue', emptyValue);
    emit('change', emptyValue);
    emit('clear');

    validation.clear();
  };

  const handleRemoveTag = (value: any) => {
    if (!isMultiple.value) return;

    const newValue = removeTagFromValue(value, props.modelValue, props.valueKey);

    emit('update:modelValue', newValue);
    emit('change', newValue);
    emit('remove-tag', value);

    if (props.validateOnInput) {
      validation.validate();
    }
  };

  const handleTriggerClick = () => {
    if (props.disabled) return;
    toggleDropdown();
  };

  const handleFocus = () => {
    state.isFocused.value = true;
    emit('focus');
  };

  const handleBlur = (event?: FocusEvent) => {
    state.isFocused.value = false;
    emit('blur');

    // Затримка для dropdown
    setTimeout(() => {
      if (!dropdownRef.value?.contains(document.activeElement)) {
        hideDropdown();
      }
    }, 100);
  };

  function debounce<F extends (...args: any[]) => any>(func: F, wait = 300) {
    let timeout: ReturnType<typeof setTimeout> | null;
    return function (this: any, ...args: Parameters<F>) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  const handleFilterInput = debounce((event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value;

    state.filterQuery.value = inputValue;
    emit('filter', inputValue);

    if (props.allowRemoteFilter) {
      console.log('Remote filter query:', inputValue);
    }
  }, 500);

  const handleFilterClear = () => {
    state.filterQuery.value = '';
    emit('filter', '');
    emit('filter-clear');
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTriggerClick();
    } else if (event.key === 'Escape' && isDropdownVisible.value) {
      event.preventDefault();
      hideDropdown();
    }
  };

  // ===== UTILITIES =====
  const isOptionSelectedUtil = (value: any): boolean => {
    return isOptionSelected(value, props.modelValue, isMultiple.value, props.valueKey);
  };

  const calcVisibleCount = () => {
    if (!props.collapsedTags) {
      state.visibleCount.value = selectedOptions.value.length;
      return;
    }

    nextTick(() => {
      if (!containerRef.value || measureTagRefs.value.length === 0) return;

      const count = calculateVisibleTagsCount(containerRef.value, measureTagRefs.value, selectedOptions.value.length);

      state.visibleCount.value = Math.max(1, count);
    });
  };

  // ===== CONTEXT PROVIDER =====
  const selectContext: VtSelectContext = {
    selectValue: computed(() => props.modelValue || (isMultiple.value ? [] : undefined)).value,
    multiple: isMultiple.value,
    valueKey: props.valueKey,
    handleOptionClick: handleOptionClick,
    isOptionSelected: isOptionSelectedUtil,
    registerOption: registerOption,
    unregisterOption: unregisterOption,
  };

  provide<VtSelectContext>(VtSelectContextKey, selectContext);

  // ===== PUBLIC METHODS =====
  const publicMethods = {
    focus() {
      if (!isDropdownVisible.value) {
        showDropdown();
      }
    },

    blur() {
      hideDropdown();
    },

    clear() {
      handleClear();
    },

    validate(): boolean {
      validation.validate();
      return state.isValid.value;
    },

    clearValidation() {
      validation.clear();
    },

    getSelectedOptions(): VtSelectOption[] {
      return selectedOptions.value;
    },

    getValidationState() {
      return {
        isValid: state.isValid.value,
        errors: [...state.validationErrors.value],
      };
    },

    setFilter(query: string) {
      state.filterQuery.value = query;
      emit('filter', query);
    },

    clearFilter() {
      handleFilterClear();
    },

    getFilterQuery(): string {
      return state.filterQuery.value;
    },

    // Методи для роботи зі скролом
    checkInitialScroll() {
      checkInitialScroll();
    },

    getScrollInfo() {
      if (!scrollContainerRef.value) return null;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.value;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      const nearBottom = distanceFromBottom <= 50;

      return {
        scrollTop,
        scrollHeight,
        clientHeight,
        distanceFromBottom,
        nearBottom,
        optionsCount: filteredOptions.value.length,
        isLoading: props.loading,
      };
    },
  };

  defineExpose<VtSelectMethods>({
    ...publicMethods,
    registerOption: registerOption,
    unregisterOption: unregisterOption,
  });

  // ===== WATCHERS =====
  watch(
    () => props.modelValue,
    () => {
      if (props.validateOnInput) {
        validation.validate();
      }
    }
  );

  watch(
    selectedOptions,
    () => {
      if (props.collapsedTags) {
        // Скидаємо refs перед новим рендером - це критично!
        tagRefs.value = [];
        nextTick(() => {
          calcVisibleCount();
        });
      }
    },
    { deep: true, immediate: true }
  );

  watch(
    () => containerRef.value,
    () => {
      if (containerRef.value && props.collapsedTags) {
        nextTick(() => {
          calcVisibleCount();
        });
      }
    }
  );

  watch(isDropdownVisible, async newVisible => {
    if (newVisible) {
      await nextTick();
      updatePosition();
    }
  });

  // Watcher для реініціалізації скролу після зміни опцій
  watch(
    () => filteredOptions.value.length,
    async (newLength, oldLength) => {
      if (isDropdownVisible.value) {
        // Якщо опції додалися і dropdown відкритий
        if (newLength > oldLength) {
          await nextTick();
          // Перевіряємо чи потрібно відразу тригернути scroll для початкового завантаження
          checkInitialScroll();
        }
      }
    }
  );

  // Watcher для перевірки коли завантаження завершується
  watch(
    () => props.loading,
    (newLoading, oldLoading) => {
      if (oldLoading && !newLoading && isDropdownVisible.value) {
        // Коли завантаження завершується, перевіряємо чи потрібно тригернути scroll
        checkInitialScroll();
      }
    }
  );

  // ===== LIFECYCLE HOOKS =====
  onMounted(() => {
    // Initial validation
    if (
      props.modelValue !== undefined &&
      props.modelValue !== '' &&
      (!Array.isArray(props.modelValue) || props.modelValue.length > 0)
    ) {
      validation.validate();
    }

    // Початковий розрахунок для collapsed tags
    if (props.collapsedTags) {
      nextTick(() => {
        calcVisibleCount();
      });
    }

    // Використовуємо ResizeObserver замість window.resize
    const resizeObserver = new ResizeObserver(() => {
      if (props.collapsedTags && containerRef.value) {
        calcVisibleCount();
      }
    });

    if (containerRef.value) {
      resizeObserver.observe(containerRef.value);
    }

    // Спостерігаємо за змінами containerRef
    watch(
      () => containerRef.value,
      (newContainer, oldContainer) => {
        if (oldContainer) {
          resizeObserver.unobserve(oldContainer);
        }
        if (newContainer) {
          resizeObserver.observe(newContainer);
        }
      }
    );

    document.addEventListener('click', handleClickOutside);

    // Cleanup в onUnmounted
    onUnmounted(() => {
      resizeObserver.disconnect();
    });
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', calcVisibleCount);
  });
</script>

<template>
  <div ref="selectRef" :class="selectClasses">
    <!-- Label для не-outlined стилю -->
    <label v-if="label && !outlined" :for="id" class="vt-select__label">
      {{ label }}
      <span v-if="required" class="vt-select__required">*</span>
    </label>

    <!-- Trigger -->
    <div
      ref="triggerRef"
      class="vt-select__container"
      tabindex="0"
      @blur="handleBlur"
      @click="handleTriggerClick"
      @focus="handleFocus"
      @keydown="handleKeydown"
    >
      <!-- Floating Label для outlined стилю -->
      <label v-if="label && outlined" :for="id" class="vt-select__floating-label">
        {{ label }}
        <span v-if="required" class="vt-select__required">*</span>
      </label>

      <!-- Display Field -->
      <div class="vt-select__field">
        <!-- Multiple selected tags -->
        <div v-if="multiple && selectedOptions.length > 0" ref="containerRef" class="vt-select__tags">
          <!-- Visible tags -->
          <div
            v-for="(option, index) in visibleTags"
            :key="`tag-${getOptionKey(option.value)}-${index}`"
            :ref="
              el => {
                if (el) tagRefs[index] = el as HTMLElement;
              }
            "
            class="vt-select__tag"
          >
            <span class="vt-select__tag-text">{{ option.label }}</span>
            <VIcon
              v-if="!props.disabled"
              class="vt-select__tag-close"
              name="close"
              @click.stop="handleRemoveTag(option.value)"
            />
          </div>

          <!-- Collapsed tags indicator -->
          <div
            v-if="showCollapsedIndicator"
            v-tooltip="collapsedTooltip"
            class="vt-select__tag vt-select__tag--collapsed"
          >
            <span class="vt-select__tag-text">+{{ collapsedCount }}</span>
          </div>

          <div ref="measureContainer" class="vt-select__tags vt-select__tags--hidden">
            <div
              v-for="(option, index) in selectedOptions"
              :key="'measure-' + getOptionKey(option.value)"
              :ref="
                el => {
                  if (el) measureTagRefs[index] = el as HTMLElement;
                }
              "
              class="vt-select__tag"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
        <!-- Single select display -->
        <span v-else-if="!multiple && displayText" class="vt-select__display-text">
          <slot v-if="$slots.selected && selectedOptions[0]" :option="selectedOptions[0]" name="selected" />
          <span v-else>{{ displayText }}</span>
        </span>

        <!-- Placeholder (тільки для не-outlined) -->
        <span v-else-if="!outlined" class="vt-select__placeholder">
          {{ placeholder }}
        </span>
      </div>

      <!-- Suffix icons -->
      <div class="vt-select__suffix">
        <!-- Loading spinner -->
        <VLoader v-if="loading" class="vt-select__loading" />

        <!-- Clear button -->
        <button
          v-else-if="showClearButton"
          :disabled="props.disabled"
          class="vt-select__clear-btn"
          type="button"
          @click.stop="handleClear"
        >
          <VIcon name="close" />
        </button>

        <!-- Arrow icon -->
        <VIcon
          v-else
          :class="{ 'vt-select__arrow--open': isDropdownVisible }"
          class="vt-select__icon vt-select__arrow"
          name="arrowDown"
        />
      </div>

      <!-- Error Message на бордері для outlined -->
      <div v-if="outlined && displayErrorMessage" class="vt-select__border-error">
        {{ displayErrorMessage }}
      </div>
    </div>

    <!-- Validation messages для не-outlined -->
    <transition name="fade">
      <div v-if="!outlined && state.validationErrors && state.validationErrors.value.length" class="vt-select__help">
        <div v-for="(error, index) in state.validationErrors.value" :key="`error-${index}`" class="vt-select__error">
          {{ error }}
        </div>
      </div>
    </transition>

    <!-- Hidden slot for option registration -->
    <div aria-hidden="true" style="display: none">
      <slot />
    </div>

    <!-- Dropdown via Teleport -->
    <Teleport v-if="isDropdownVisible && parentVisible" to="body">
      <transition name="dropdown">
        <div
          ref="dropdownRef"
          :aria-multiselectable="multiple"
          :style="dropdownStyle"
          class="vt-select-dropdown"
          role="listbox"
          @click.stop
          @mousedown.prevent
        >
          <!-- Search Input -->
          <div v-if="filterable" class="vt-select-dropdown__search">
            <VInput
              ref="filterInputRef"
              v-model="state.filterQuery.value"
              :placeholder="filterPlaceholder"
              clearable
              suffix-icon="search"
              type="text"
              @input="handleFilterInput"
            />
          </div>

          <!-- No Data -->
          <div v-if="filteredOptions.length === 0" class="vt-select-dropdown__empty">
            <span v-if="state.filterQuery.value">Немає результатів для "{{ state.filterQuery.value }}"</span>
            <span v-else>{{ noDataText }}</span>
          </div>

          <!-- Options with scroll handler -->
          <div v-else ref="scrollContainerRef" class="vt-select-dropdown__options" @scroll="handleScroll">
            <div
              v-for="option in filteredOptions"
              :key="`option-${typeof option.value === 'object' ? JSON.stringify(option.value) : option.value}`"
              :aria-disabled="option.disabled || false"
              :aria-selected="isOptionSelectedUtil(option.value)"
              :class="[
                'vt-option',
                {
                  'vt-option--selected': isOptionSelectedUtil(option.value),
                  'vt-option--disabled': option.disabled || false,
                },
              ]"
              role="option"
              @click="handleOptionClick(option)"
              @mousedown.prevent
            >
              <!-- Checkbox for multi-select -->
              <VCheckbox
                v-if="isMultiple"
                :checked="isOptionSelectedUtil(option.value)"
                :disabled="option.disabled || false"
                class="vt-option__checkbox"
                tabindex="-1"
                @change="isChecked => handleCheckboxChange(option, isChecked)"
              />

              <!-- Option content -->
              <span class="vt-option__text">
                <component :is="getOptionSlot(option.value)" v-if="getOptionSlot(option.value)" />
                <span v-else>{{ option.label || option.value }}</span>
              </span>
            </div>

            <!-- Loading more indicator -->
            <div v-if="loading" class="vt-select-dropdown__loading">
              <VLoader class="vt-select-dropdown__loading-icon" />
              {{ props.loadingText }}
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Helper Text / Error Message для не-outlined -->
    <div v-if="!outlined && displayErrorMessage" class="vt-select__help">
      <span v-if="displayErrorMessage" class="vt-select__error">
        {{ displayErrorMessage }}
      </span>
    </div>
  </div>
</template>
