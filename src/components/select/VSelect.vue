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
    getSelectedOptions,
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
    if (props.valueKey && typeof value === 'object' && value !== null) {
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

    for (const [key, option] of allRegisteredOptions.value.entries()) {
      if (activeOptionKeys.value.has(key)) {
        result.push(option);
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

          // Ініціалізуємо scroll handler
          scrollHandler.init();

          // Фокус на input фільтра, якщо доступний
          if (props.filterable && filterInputRef.value) {
            filterInputRef.value.focus();
          }

          // Додаткова затримка для перевірки потреби завантаження даних
          setTimeout(() => {
            scrollHandler.checkIfNeedMoreData();
          }, 300);
        });
      } else {
        // Очищаємо scroll handler при закритті
        scrollHandler.cleanup();

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

  // ===== SCROLL HANDLER =====
  const scrollHandler = {
    observer: null as IntersectionObserver | null,
    sentinelElement: null as HTMLElement | null,
    scrollTimeoutId: null as number | null,
    lastEmitTime: 0,
    emitCooldown: 500, // мінімальний інтервал між емітами
    isInitialized: false,

    init() {
      this.cleanup();
      this.initIntersectionObserver();
      this.initScrollFallback();
      this.isInitialized = true;

      // Початкова перевірка, чи потрібно завантажити дані одразу
      nextTick(() => {
        this.checkIfNeedMoreData();
      });
    },

    initIntersectionObserver() {
      if (!scrollContainerRef.value) return;

      // Створюємо sentinel елемент
      this.sentinelElement = document.createElement('div');
      this.sentinelElement.style.cssText = `
      height: 1px;
      background: transparent;
      pointer-events: none;
      position: absolute;
      bottom: 0;
      width: 100%;
    `;
      this.sentinelElement.setAttribute('data-scroll-sentinel', 'true');

      // Додаємо sentinel в кінець контейнера
      scrollContainerRef.value.appendChild(this.sentinelElement);

      // Створюємо Intersection Observer
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && this.canEmit()) {
              this.emitScrolled('intersection-observer');
            }
          });
        },
        {
          root: scrollContainerRef.value,
          rootMargin: '100px', // Тригерить за 100px до кінця
          threshold: 0,
        }
      );

      this.observer.observe(this.sentinelElement);
    },

    initScrollFallback() {
      if (!scrollContainerRef.value) return;

      scrollContainerRef.value.addEventListener('scroll', this.handleScrollFallback, {
        passive: true,
      });
    },

    handleScrollFallback: (event: Event) => {
      if (scrollHandler.scrollTimeoutId) {
        clearTimeout(scrollHandler.scrollTimeoutId);
      }

      scrollHandler.scrollTimeoutId = setTimeout(() => {
        const target = event.target as HTMLElement;
        if (!target || !scrollHandler.canEmit()) return;

        const { scrollTop, scrollHeight, clientHeight } = target;
        const threshold = 80;

        if (scrollHeight - scrollTop - clientHeight <= threshold && filteredOptions.value.length > 0) {
          scrollHandler.emitScrolled('scroll-fallback');
        }
      }, 200);
    },

    canEmit(): boolean {
      const now = Date.now();
      return !props.loading && filteredOptions.value.length > 0 && now - this.lastEmitTime > this.emitCooldown;
    },

    emitScrolled(source: string) {
      console.log(`Scroll triggered by: ${source}, options count: ${filteredOptions.value.length}`);
      this.lastEmitTime = Date.now();
      emit('scrolled');
    },

    updateSentinel() {
      // Переміщуємо sentinel в кінець після додавання нових опцій
      if (this.sentinelElement && scrollContainerRef.value) {
        scrollContainerRef.value.appendChild(this.sentinelElement);
      }
    },

    checkIfNeedMoreData() {
      if (!scrollContainerRef.value || !this.canEmit()) return;

      const { scrollHeight, clientHeight } = scrollContainerRef.value;

      // Якщо контент менше за висоту контейнера, одразу завантажуємо більше
      if (scrollHeight <= clientHeight && filteredOptions.value.length > 0) {
        console.log('Container height exceeds content, triggering initial load');
        this.emitScrolled('initial-check');
      }
    },

    // Метод для ручного тригеру (корисно для дебагу)
    triggerManually() {
      if (this.canEmit()) {
        this.emitScrolled('manual-trigger');
      }
    },

    cleanup() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      if (this.sentinelElement) {
        this.sentinelElement.remove();
        this.sentinelElement = null;
      }

      if (scrollContainerRef.value && this.isInitialized) {
        scrollContainerRef.value.removeEventListener('scroll', this.handleScrollFallback);
      }

      if (this.scrollTimeoutId) {
        clearTimeout(this.scrollTimeoutId);
        this.scrollTimeoutId = null;
      }

      this.isInitialized = false;
    },
  };

  // ===== COMPUTED VALUES =====
  const isMultiple = computed(() => props.multiple);

  const selectedOptions = computed((): VtSelectOption[] => {
    if (!registeredOptions.value.length) return [];

    return getSelectedOptions(props.modelValue, registeredOptions.value, isMultiple.value, props.valueKey);
  });

  const visibleTags = computed(() => {
    if (!props.multiple || selectedOptions.value.length === 0) return [];

    if (!props.collapsedTags) {
      return selectedOptions.value;
    }

    return selectedOptions.value.slice(0, state.visibleCount.value);
  });

  const displayText = computed(() => {
    if (isMultiple.value) return '';

    const selected = selectedOptions.value[0];
    if (selected) return selected.label;

    // Для об'єктів спробуємо показати label, якщо є
    if (props.modelValue && typeof props.modelValue === 'object') {
      if (props.modelValue.label) return props.modelValue.label;
      if (props.modelValue.name) return props.modelValue.name;
      return JSON.stringify(props.modelValue);
    }

    if (
      props.modelValue !== undefined &&
      props.modelValue !== null &&
      props.modelValue !== '' &&
      !Array.isArray(props.modelValue)
    ) {
      return String(props.modelValue);
    }

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
    if (!state.isValid.value) return 'error';
    return 'default';
  });

  const selectClasses = computed(() => [
    'vt-select',
    `vt-select--${currentStatus.value}`,
    {
      'vt-select--disabled': props.disabled,
      'vt-select--focused': state.isFocused.value,
      'vt-select--multiple': isMultiple.value,
      'vt-select--open': isDropdownVisible.value,
    },
  ]);

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
    // Перевіряємо, чи фокус не переходить на dropdown
    if (event?.relatedTarget && dropdownRef.value?.contains(event.relatedTarget as Node)) {
      return;
    }

    state.isFocused.value = false;
    emit('blur');

    // Затримка для dropdown
    setTimeout(() => {
      if (!dropdownRef.value?.contains(document.activeElement)) {
        hideDropdown();
      }
    }, 100);
  };

  const handleFilterInput = (value: string) => {
    state.filterQuery.value = value;
    emit('filter', value);

    // Для remote фільтрації можна додати debounce
    if (props.allowRemoteFilter) {
      // Тут можна додати debounce логіку
      console.log('Remote filter query:', value);
    }
  };

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
    if (!props.collapsedTags || !containerRef.value || selectedOptions.value.length === 0) {
      state.visibleCount.value = selectedOptions.value.length;
      return;
    }

    nextTick(() => {
      if (!containerRef.value) return;

      const count = calculateVisibleTagsCount(containerRef.value, tagRefs.value, selectedOptions.value.length);

      state.visibleCount.value = count;
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

    // Нові методи для роботи зі скролом
    checkScroll() {
      scrollHandler.checkIfNeedMoreData();
    },

    triggerScroll() {
      scrollHandler.triggerManually();
    },

    getScrollInfo() {
      if (!scrollContainerRef.value) return null;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.value;
      return {
        scrollTop,
        scrollHeight,
        clientHeight,
        isNearBottom: scrollHeight - scrollTop - clientHeight <= 100,
        canScroll: scrollHeight > clientHeight,
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
      calcVisibleCount();
    },
    { deep: true }
  );

  watch(
    () => containerRef.value,
    () => {
      if (containerRef.value) {
        calcVisibleCount();
      }
    }
  );

  watch(isDropdownVisible, async newVisible => {
    if (newVisible) {
      await nextTick();
      updatePosition();
    }
  });

  watch(
    filteredOptions,
    (newOptions, oldOptions) => {
      // Оновлюємо sentinel після зміни опцій
      if (isDropdownVisible.value && scrollHandler.isInitialized) {
        nextTick(() => {
          scrollHandler.updateSentinel();

          // Перевіряємо чи потрібно завантажити більше даних
          if (newOptions.length > 0) {
            setTimeout(() => {
              scrollHandler.checkIfNeedMoreData();
            }, 100);
          }
        });
      }
    },
    { flush: 'post' }
  );

  watch(
    () => props.loading,
    (newLoading, oldLoading) => {
      // Коли завантаження закінчується, перевіряємо чи потрібно більше даних
      if (oldLoading && !newLoading && isDropdownVisible.value && scrollHandler.isInitialized) {
        nextTick(() => {
          scrollHandler.updateSentinel();
          setTimeout(() => {
            scrollHandler.checkIfNeedMoreData();
          }, 200);
        });
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

    nextTick(() => {
      calcVisibleCount();
    });

    window.addEventListener('resize', calcVisibleCount);
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    // Очищаємо scroll handler
    scrollHandler.cleanup();

    // Інший cleanup
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', calcVisibleCount);
  });
</script>

<template>
  <div ref="selectRef" :class="selectClasses">
    <!-- Label -->
    <label v-if="label" :for="id" class="vt-select__label">
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
      <!-- Display Field -->
      <div class="vt-select__field">
        <!-- Multiple selected tags -->
        <div v-if="multiple && selectedOptions.length > 0" ref="containerRef" class="vt-select__tags">
          <!-- Visible tags -->
          <div
            v-for="(option, index) in visibleTags"
            :key="`tag-${typeof option.value === 'object' ? JSON.stringify(option.value) : option.value}-${index}`"
            :ref="el => el && (tagRefs[index] = el as HTMLElement)"
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
        </div>

        <!-- Single select display -->
        <span v-else-if="!multiple && displayText" class="vt-select__display-text">
          {{ displayText }}
        </span>

        <!-- Placeholder -->
        <span v-else class="vt-select__placeholder">
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
    </div>

    <!-- Validation messages -->
    <transition name="fade">
      <div v-if="state.validationErrors && state.validationErrors.value.length" class="vt-select__help">
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
            />
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="vt-select-dropdown__loading">
            <VLoader class="vt-select-dropdown__loading-icon" />
            {{ loadingText }}
          </div>

          <!-- No Data -->
          <div v-else-if="filteredOptions.length === 0" class="vt-select-dropdown__empty">
            <span v-if="state.filterQuery.value">Немає результатів для "{{ state.filterQuery.value }}"</span>
            <span v-else>{{ noDataText }}</span>
          </div>

          <!-- Options -->
          <div v-else ref="scrollContainerRef" class="vt-select-dropdown__options">
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
            <div v-if="loading" class="vt-select-dropdown__loading-more">
              <VLoader class="vt-select-dropdown__loading-icon" />
              {{ props.loadingText }}
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
