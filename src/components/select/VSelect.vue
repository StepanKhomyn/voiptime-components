<script lang="ts" setup>
  import { computed, nextTick, onMounted, onUnmounted, provide, ref, useSlots, watch } from 'vue';
  import type { VtSelectContext, VtSelectEmits, VtSelectMethods, VtSelectOption, VtSelectProps } from './types';
  import { VtSelectContextKey } from './types';
  import VIcon from '@/components/icon/VIcon.vue';
  import VInput from '@/components/input/VInput.vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';
  import VLoader from '@/components/loader/VLoader.vue';

  // Імпортуємо хелпери
  import {
    calculateDropdownPosition,
    calculateVisibleTagsCount,
    createCollapsedTooltip,
    defaultFilterMethod,
    getEmptyValue,
    getScrollableParents,
    getSelectedOptions,
    handleOptionSelection,
    isElementVisible,
    isOptionSelected,
    removeTagFromValue,
    validateSelectValue,
  } from './helpers';

  // Пропси з дефолтними значеннями
  const props = withDefaults(defineProps<VtSelectProps>(), {
    size: 'medium',
    status: 'default',
    disabled: false,
    clearable: false,
    filterable: false,
    loading: false,
    multiple: false,
    collapsedTags: false,
    placeholder: 'Оберіть опцію',
    noDataText: 'Немає даних',
    noMatchText: 'Співпадінь не знайдено',
    loadingText: 'Завантаження...',
    maxHeight: 220,
    placement: 'bottom-start',
    validateOnInput: true,
    validateOnBlur: true,
    infiniteScroll: false,
  });

  // Емітери
  const emit = defineEmits<VtSelectEmits>();

  // Слоти
  const slots = useSlots();

  // Refs
  const selectRef = ref<HTMLElement>();
  const triggerRef = ref<HTMLElement>();
  const dropdownRef = ref<HTMLElement>();
  const filterInputRef = ref<HTMLInputElement>();
  const containerRef = ref<HTMLElement>();
  const tagRefs = ref<HTMLElement[]>([]);
  const sentinelRef = ref<HTMLElement>();
  let observer: IntersectionObserver | null = null;

  // Реактивні змінні стану
  const isFocused = ref(false);
  const isDropdownVisible = ref(false);
  const filterQuery = ref('');
  const validationErrors = ref<string[]>([]);
  const isValid = ref(true);
  const visibleCount = ref(0);

  // Реєстр опцій
  const registeredOptions = ref<Map<string | number, VtSelectOption>>(new Map());
  const optionSlots = ref<Map<string | number, any>>(new Map());

  // Позиціонування
  const dropdownPosition = ref({
    top: '0px',
    left: '0px',
    minWidth: '0px',
    transformOrigin: 'center top',
  });

  // Scroll управління
  const scrollableParents = ref<Element[]>([]);
  const parentVisible = ref(true);
  const wasVisibleBeforeHiding = ref(false);

  // Обчислювані властивості
  const isMultiple = computed(() => props.multiple);

  const allOptions = computed(() => Array.from(registeredOptions.value.values()));

  const filteredOptions = computed(() => {
    if (!filterQuery.value || !props.filterable) {
      return allOptions.value;
    }

    const filterMethod = props.filterMethod || defaultFilterMethod;
    return allOptions.value.filter(option => filterMethod(filterQuery.value, option));
  });

  const selectedOptions = computed((): VtSelectOption[] => {
    return getSelectedOptions(props.modelValue, allOptions.value, isMultiple.value);
  });

  const visibleTags = computed(() => {
    if (!props.multiple || selectedOptions.value.length === 0) return [];

    if (!props.collapsedTags) {
      return selectedOptions.value;
    }

    return selectedOptions.value.slice(0, visibleCount.value);
  });

  const displayText = computed(() => {
    if (isMultiple.value) return '';

    const selected = selectedOptions.value[0];
    if (selected) {
      return selected.label;
    }

    // Якщо опція не знайдена, але є modelValue - показуємо його
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
    return props.clearable && !props.disabled && selectedOptions.value.length > 0;
  });

  const currentStatus = computed(() => {
    if (props.status !== 'default') return props.status;
    if (!isValid.value) return 'error';
    return 'default';
  });

  const selectClasses = computed(() => [
    'vt-select',
    `vt-select--${props.size}`,
    `vt-select--${currentStatus.value}`,
    {
      'vt-select--disabled': props.disabled,
      'vt-select--focused': isFocused.value,
      'vt-select--multiple': isMultiple.value,
    },
  ]);

  const dropdownStyle = computed(() => ({
    ...dropdownPosition.value,
    position: 'absolute' as const,
    zIndex: 2000,
    maxHeight: `${props.maxHeight}px`,
  }));

  const shouldShowSentinel = computed(() => {
    return props.infiniteScroll && !props.loading && filteredOptions.value.length > 0;
  });

  const collapsedCount = computed(() => {
    return selectedOptions.value.length - visibleCount.value;
  });

  const showCollapsedIndicator = computed(() => {
    return (
      props.collapsedTags &&
      props.multiple &&
      selectedOptions.value.length > 0 &&
      visibleCount.value < selectedOptions.value.length
    );
  });

  const collapsedTooltip = computed(() => {
    if (!showCollapsedIndicator.value) return '';

    const hiddenOptions = selectedOptions.value.slice(visibleCount.value);
    return createCollapsedTooltip(collapsedCount.value, hiddenOptions);
  });

  // Валідація з використанням хелпера
  const validateValue = (): void => {
    const validation = validateSelectValue(
      props.modelValue,
      isMultiple.value,
      props.required || false,
      props.requiredMessage
    );

    validationErrors.value = validation.errors;
    isValid.value = validation.isValid;

    emit('validation', { isValid: isValid.value, errors: validation.errors });
  };

  // Реєстрація опцій
  const registerOption = (option: VtSelectOption, slotContent?: any): void => {
    registeredOptions.value.set(option.value, option);

    if (slotContent) {
      optionSlots.value.set(option.value, slotContent);
    }
  };

  const unregisterOption = (value: string | number): void => {
    registeredOptions.value.delete(value);
    optionSlots.value.delete(value);
  };

  const getOptionSlot = (value: string | number) => {
    return optionSlots.value.get(value);
  };

  // Утиліти видимості
  const checkParentVisibility = (): void => {
    if (!triggerRef.value) return;

    const isVisible = isElementVisible(triggerRef.value);

    if (parentVisible.value !== isVisible) {
      parentVisible.value = isVisible;

      if (!isVisible && isDropdownVisible.value) {
        wasVisibleBeforeHiding.value = true;
        isDropdownVisible.value = false;
        emit('visible-change', false);
      } else if (isVisible && wasVisibleBeforeHiding.value && !isDropdownVisible.value) {
        wasVisibleBeforeHiding.value = false;
        isDropdownVisible.value = true;
        updateDropdownPosition();
        emit('visible-change', true);
      }
    }
  };

  // Позиціонування випадайки з використанням хелпера
  const updateDropdownPosition = async (): Promise<void> => {
    await nextTick();
    if (!triggerRef.value || !dropdownRef.value) return;

    const triggerRect = triggerRef.value.getBoundingClientRect();
    const dropdownRect = dropdownRef.value.getBoundingClientRect();

    const position = calculateDropdownPosition(triggerRect, dropdownRect, props.placement);

    dropdownPosition.value = {
      ...position,
      minWidth: `${triggerRect.width}px`,
    };
  };

  // Scroll listeners з використанням хелпера
  const addScrollListeners = (): void => {
    if (!triggerRef.value) return;

    scrollableParents.value = getScrollableParents(triggerRef.value);
    scrollableParents.value.forEach(parent => {
      parent.addEventListener('scroll', handleScroll, { passive: true });
    });
    window.addEventListener('resize', handleScroll);
  };

  const removeScrollListeners = (): void => {
    scrollableParents.value.forEach(parent => {
      parent.removeEventListener('scroll', handleScroll);
    });
    window.removeEventListener('resize', handleScroll);
    scrollableParents.value = [];
  };

  const handleScroll = (): void => {
    if (isDropdownVisible.value || wasVisibleBeforeHiding.value) {
      checkParentVisibility();
      if (isDropdownVisible.value) {
        updateDropdownPosition();
      }
    }
  };

  // Керування випадайкою
  const showDropdown = (): void => {
    if (props.disabled || isDropdownVisible.value) return;

    if (!triggerRef.value || !isElementVisible(triggerRef.value)) {
      return;
    }

    isDropdownVisible.value = true;
    parentVisible.value = true;
    wasVisibleBeforeHiding.value = false;

    nextTick(async () => {
      // Розраховуємо позицію після того, як елемент вже видимий
      await updateDropdownPosition();
      addScrollListeners();
      initScrollBottom();

      if (props.filterable && filterInputRef.value) {
        filterInputRef.value.focus();
      }
    });

    emit('visible-change', true);
  };

  const hideDropdown = (): void => {
    if (!isDropdownVisible.value) return;

    isDropdownVisible.value = false;
    filterQuery.value = '';
    wasVisibleBeforeHiding.value = false;
    removeScrollListeners();

    if (observer && sentinelRef.value) {
      observer.unobserve(sentinelRef.value);
      observer.disconnect();
      observer = null;
    }

    if (props.validateOnBlur) {
      validateValue();
    }

    emit('visible-change', false);
  };

  // Event handlers з використанням хелперів
  const handleClickOutside = (event: MouseEvent): void => {
    if (!isDropdownVisible.value) return;

    const target = event.target as Node;

    if (selectRef.value?.contains(target) || dropdownRef.value?.contains(target)) {
      return;
    }

    hideDropdown();
  };

  const handleFilterInput = (): void => {
    emit('filter', filterQuery.value);
  };

  const handleOptionClick = (option: VtSelectOption): void => {
    if (option.disabled) return;

    const newValue = handleOptionSelection(option, props.modelValue, isMultiple.value);

    emit('update:modelValue', newValue);
    emit('change', newValue);

    if (!isMultiple.value) {
      hideDropdown();
    }

    if (props.validateOnInput) {
      validateValue();
    }
  };

  const handleDropdownClick = (): void => {
    if (props.disabled) return;

    if (isDropdownVisible.value) {
      hideDropdown();
    } else {
      showDropdown();
    }
  };

  const handleClear = (): void => {
    const emptyValue = getEmptyValue(isMultiple.value);
    emit('update:modelValue', emptyValue);
    emit('change', emptyValue);
    emit('clear');

    filterQuery.value = '';
    validationErrors.value = [];
    isValid.value = true;
    emit('validation', { isValid: true, errors: [] });
  };

  const handleRemoveTag = (value: string | number): void => {
    if (!isMultiple.value) return;

    const newValue = removeTagFromValue(value, props.modelValue);

    emit('update:modelValue', newValue);
    emit('change', newValue);
    emit('remove-tag', value);

    if (props.validateOnInput) {
      validateValue();
    }
  };

  // Utilities з використанням хелперів
  const isOptionSelectedHelper = (value: string | number): boolean => {
    return isOptionSelected(value, props.modelValue, isMultiple.value);
  };

  const isOptionVisible = (option: VtSelectOption): boolean => {
    return filteredOptions.value.includes(option);
  };

  const calcVisibleCount = (): void => {
    if (!props.collapsedTags || !containerRef.value || selectedOptions.value.length === 0) {
      visibleCount.value = selectedOptions.value.length;
      return;
    }

    // Чекаємо наступний тік щоб теги відрендерились
    nextTick(() => {
      if (!containerRef.value) return;

      const count = calculateVisibleTagsCount(containerRef.value, tagRefs.value, selectedOptions.value.length);

      visibleCount.value = count;
    });
  };

  // Створюємо контекст для дочірніх компонентів
  const selectContext: VtSelectContext = {
    selectValue: props.modelValue || (isMultiple.value ? [] : ''),
    multiple: isMultiple.value,
    filterable: props.filterable,
    filterQuery: filterQuery.value,
    handleOptionClick,
    isOptionSelected: isOptionSelectedHelper,
    isOptionVisible,
    registerOption,
    unregisterOption,
  };

  const initScrollBottom = () => {
    if (props.infiniteScroll && sentinelRef.value) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !props.loading) {
              emit('scrolled');
            }
          });
        },
        {
          root: null,
          rootMargin: '20px',
          threshold: 0.1,
        }
      );
      observer.observe(sentinelRef.value);
    }
  };

  provide<VtSelectContext>(VtSelectContextKey, selectContext);

  // Публічні методи
  const focus = (): void => {
    if (props.filterable && isDropdownVisible.value && filterInputRef.value) {
      filterInputRef.value.focus();
    } else if (!isDropdownVisible.value) {
      showDropdown();
    }
  };

  const blur = (): void => {
    if (props.filterable && filterInputRef.value) {
      filterInputRef.value.blur();
    }
    hideDropdown();
  };

  const clear = (): void => {
    handleClear();
  };

  const validate = (): boolean => {
    validateValue();
    return isValid.value;
  };

  const clearValidation = (): void => {
    validationErrors.value = [];
    isValid.value = true;
    emit('validation', { isValid: true, errors: [] });
  };

  const getSelectedOptionsMethod = (): VtSelectOption[] => {
    return selectedOptions.value;
  };

  const getValidationState = () => {
    return {
      isValid: isValid.value,
      errors: [...validationErrors.value],
    };
  };

  // Перерахуємо при зміні розміру вікна
  const resizeHandler = () => {
    calcVisibleCount();
  };

  // Експортуємо методи
  defineExpose<VtSelectMethods>({
    focus,
    blur,
    clear,
    validate,
    clearValidation,
    getSelectedOptions: getSelectedOptionsMethod,
    getValidationState,
    registerOption,
    unregisterOption,
  });

  // Watchers
  watch(
    () => props.modelValue,
    () => {
      if (props.validateOnInput) {
        validateValue();
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

  // Lifecycle hooks
  onMounted(() => {
    // Ініціальна валідація
    if (
      props.modelValue !== undefined &&
      props.modelValue !== '' &&
      (!Array.isArray(props.modelValue) || props.modelValue.length > 0)
    ) {
      validateValue();
    }

    nextTick(() => {
      calcVisibleCount();
      initScrollBottom();
    });

    window.addEventListener('resize', resizeHandler);
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', resizeHandler);
    removeScrollListeners();
    if (observer && sentinelRef.value) {
      observer.unobserve(sentinelRef.value);
    }
    observer = null;
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
    <div ref="triggerRef" class="vt-select__container" @click="handleDropdownClick">
      <!-- Display Field -->
      <div class="vt-select__field">
        <!-- Multiple selected tags -->
        <div v-if="multiple && selectedOptions.length > 0" ref="containerRef" class="vt-select__tags">
          <!-- Відображаємо видимі теги -->
          <div
            v-for="(option, index) in visibleTags"
            :key="`tag-${option.value}-${index}`"
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
      <div v-if="validationErrors.length > 0" class="vt-select__help">
        <div v-for="error in validationErrors" :key="error" class="vt-select__error">
          {{ error }}
        </div>
      </div>
    </transition>

    <!-- Прихований слот для завжди рендеринга опцій (реєстрація) -->
    <div aria-hidden="true" style="display: none">
      <slot />
    </div>

    <!-- Dropdown через Teleport -->
    <Teleport to="body">
      <transition name="dropdown">
        <div
          v-if="isDropdownVisible && parentVisible"
          ref="dropdownRef"
          :aria-multiselectable="multiple"
          :style="dropdownStyle"
          class="vt-select-dropdown"
          role="listbox"
          @click.stop
        >
          <!-- Search Input в випадайці -->
          <div v-if="filterable" class="vt-select-dropdown__search">
            <VInput
              ref="filterInputRef"
              v-model="filterQuery"
              :placeholder="`Пошук...`"
              suffix-icon="search"
              type="text"
              @input="handleFilterInput"
            />
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="vt-select-dropdown__loading">
            <VLoader class="vt-select-dropdown__loading-icon" />
            {{ loadingText }}
          </div>

          <!-- No Data -->
          <div v-else-if="allOptions.length === 0" class="vt-select-dropdown__empty">
            {{ noDataText }}
          </div>

          <!-- No Match -->
          <div v-else-if="filteredOptions.length === 0" class="vt-select-dropdown__empty">
            {{ noMatchText }}
          </div>

          <!-- Options -->
          <div v-else ref="scrollContainer" class="vt-select-dropdown__options">
            <div
              v-for="option in filteredOptions"
              :key="`option-${option.value}`"
              :aria-disabled="option.disabled"
              :aria-selected="isOptionSelectedHelper(option.value)"
              :class="[
                'vt-option',
                {
                  'vt-option--selected': isOptionSelectedHelper(option.value),
                  'vt-option--disabled': option.disabled,
                },
              ]"
              role="option"
              @click="handleOptionClick(option)"
            >
              <!-- Checkbox для мульти-селекту -->
              <VCheckbox
                v-if="isMultiple"
                :checked="isOptionSelectedHelper(option.value)"
                :disabled="option.disabled"
                class="vt-option__checkbox"
                tabindex="-1"
              />

              <!-- Контент опції -->
              <span class="vt-option__text">
                <component :is="getOptionSlot(option.value)" v-if="getOptionSlot(option.value)" />
                <span v-else>{{ option.label }}</span>
              </span>
            </div>
            <!-- Sentinel елемент для IntersectionObserver -->
            <div v-if="shouldShowSentinel" ref="sentinelRef" aria-hidden="true" class="vt-select__sentinel">
              <!-- Цей елемент невидимий і служить тільки як тригер -->
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
