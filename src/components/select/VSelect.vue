<script lang="ts" setup>
  import { computed, nextTick, onMounted, onUnmounted, provide, reactive, ref, useSlots, watch } from 'vue';
  import type { VtSelectContext, VtSelectEmits, VtSelectMethods, VtSelectOption, VtSelectProps } from './types';
  import { VtSelectContextKey } from './types';
  import VIcon from '@/components/icon/VIcon.vue';
  import VInput from '@/components/input/VInput.vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';
  import VLoader from '@/components/loader/VLoader.vue';

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
    maxHeight: 200,
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

  // ВИПРАВЛЕННЯ 1: Використовуємо reactive для Map і додаємо triggerRef для форсування реактивності
  const registeredOptions = reactive(new Map<string | number, VtSelectOption>());
  const optionSlots = reactive(new Map<string | number, any>());
  const optionsVersion = ref(0); // Лічильник для форсування оновлень

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

  // ВИПРАВЛЕННЯ 2: Додаємо залежність від optionsVersion для форсування реактивності
  const allOptions = computed(() => {
    // Читаємо optionsVersion щоб створити залежність
    optionsVersion.value;
    return Array.from(registeredOptions.values());
  });

  const filteredOptions = computed(() => {
    if (!filterQuery.value || !props.filterable) {
      return allOptions.value;
    }

    if (props.filterMethod) {
      return allOptions.value.filter(option => props.filterMethod!(filterQuery.value, option));
    }

    const query = filterQuery.value.toLowerCase().trim();
    return allOptions.value.filter(option => {
      const labelMatch = option.label.toLowerCase().includes(query);
      const valueMatch = String(option.value).toLowerCase().includes(query);
      return labelMatch || valueMatch;
    });
  });

  const selectedOptions = computed(() => {
    if (isMultiple.value) {
      const values = Array.isArray(props.modelValue) ? props.modelValue : [];
      return allOptions.value.filter(option => values.includes(option.value));
    } else {
      return allOptions.value.filter(option => option.value === props.modelValue);
    }
  });

  const visibleTags = computed(() => {
    if (!props.multiple || selectedOptions.value.length === 0) return [];

    if (!props.collapsedTags) {
      return selectedOptions.value;
    }

    // Для collapsed tags показуємо тільки видимі теги
    const visible = selectedOptions.value.slice(0, visibleCount.value);

    return visible;
  });

  const displayText = computed(() => {
    if (isMultiple.value) return '';
    const selected = selectedOptions.value[0];
    return selected ? selected.label : '';
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

  // Валідація
  const validateValue = (): void => {
    const errors: string[] = [];

    if (props.required) {
      if (isMultiple.value) {
        const values = Array.isArray(props.modelValue) ? props.modelValue : [];
        if (values.length === 0) {
          errors.push(props.requiredMessage || "Це поле є обов'язковим");
        }
      } else {
        if (!props.modelValue) {
          errors.push(props.requiredMessage || "Це поле є обов'язковим");
        }
      }
    }

    validationErrors.value = errors;
    isValid.value = errors.length === 0;

    emit('validation', { isValid: isValid.value, errors });
  };

  // ВИПРАВЛЕННЯ 3: Оновлена реєстрація опцій з форсуванням реактивності
  const registerOption = (option: VtSelectOption, slotContent?: any): void => {
    console.log('Registering option:', option); // Для дебагу

    registeredOptions.set(option.value, option);

    if (slotContent) {
      optionSlots.set(option.value, slotContent);
    }

    // Інкрементуємо версію щоб форсувати оновлення computed
    optionsVersion.value++;

    // Також можемо викликати nextTick для гарантії оновлення
    nextTick(() => {
      // Якщо потрібно, додаткові дії після реєстрації
    });
  };

  const unregisterOption = (value: string | number): void => {
    console.log('Unregistering option:', value); // Для дебагу

    const wasDeleted = registeredOptions.delete(value);
    optionSlots.delete(value);

    if (wasDeleted) {
      // Інкрементуємо версію щоб форсувати оновлення computed
      optionsVersion.value++;
    }

    nextTick(() => {
      // Якщо потрібно, додаткові дії після видалення
    });
  };

  const getOptionSlot = (value: string | number) => {
    return optionSlots.get(value);
  };

  // Утиліти видимості
  const isElementVisible = (element: Element): boolean => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) return false;

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const isInViewport = rect.top < windowHeight && rect.bottom > 0 && rect.left < windowWidth && rect.right > 0;

    if (!isInViewport) return false;

    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      const parentRect = parent.getBoundingClientRect();
      const parentStyle = window.getComputedStyle(parent);

      if (
        parentStyle.overflow === 'hidden' ||
        parentStyle.overflowY === 'hidden' ||
        parentStyle.overflowX === 'hidden'
      ) {
        if (
          rect.top >= parentRect.bottom ||
          rect.bottom <= parentRect.top ||
          rect.left >= parentRect.right ||
          rect.right <= parentRect.left
        ) {
          return false;
        }
      }

      parent = parent.parentElement;
    }

    return true;
  };

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

  const getScrollableParents = (element: Element): Element[] => {
    const parents: Element[] = [];
    let parent = element.parentElement;

    while (parent && parent !== document.body) {
      const computedStyle = window.getComputedStyle(parent);
      const overflowY = computedStyle.overflowY;
      const overflowX = computedStyle.overflowX;

      if (
        ['scroll', 'auto'].includes(overflowY) ||
        ['scroll', 'auto'].includes(overflowX) ||
        parent.scrollHeight > parent.clientHeight ||
        parent.scrollWidth > parent.clientWidth
      ) {
        parents.push(parent);
      }

      parent = parent.parentElement;
    }

    parents.push(window as any);
    return parents;
  };

  // Позиціонування випадайки
  const updateDropdownPosition = async (): Promise<void> => {
    await nextTick();
    if (!triggerRef.value || !dropdownRef.value) return;

    const triggerRect = triggerRef.value.getBoundingClientRect();
    const dropdownRect = dropdownRef.value.getBoundingClientRect();

    let top = 0;
    let left = 0;
    let transformOrigin = 'center top';

    // Базова логіка розміщення за placement
    switch (props.placement) {
      case 'bottom':
        top = triggerRect.bottom + window.scrollY + 5;
        left = triggerRect.left + window.scrollX + (triggerRect.width - dropdownRect.width) / 2;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + window.scrollY + 5;
        left = triggerRect.left + window.scrollX;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + window.scrollY + 5;
        left = triggerRect.right + window.scrollX - dropdownRect.width;
        break;
      case 'top':
        top = triggerRect.top + window.scrollY - dropdownRect.height - 5;
        left = triggerRect.left + window.scrollX + (triggerRect.width - dropdownRect.width) / 2;
        transformOrigin = 'center bottom';
        break;
      case 'top-start':
        top = triggerRect.top + window.scrollY - dropdownRect.height - 5;
        left = triggerRect.left + window.scrollX;
        transformOrigin = 'center bottom';
        break;
      case 'top-end':
        top = triggerRect.top + window.scrollY - dropdownRect.height - 5;
        left = triggerRect.right + window.scrollX - dropdownRect.width;
        transformOrigin = 'center bottom';
        break;
    }

    // Корекція меж екрана (горизонтально)
    const maxLeft = window.innerWidth - dropdownRect.width - 10;
    left = Math.max(10, Math.min(left, maxLeft));

    // Корекція меж екрана (вертикально)
    if (top + dropdownRect.height > window.innerHeight + window.scrollY) {
      top = triggerRect.top + window.scrollY - dropdownRect.height - 5;
      transformOrigin = 'center bottom';
    }
    if (top < window.scrollY + 10) {
      top = triggerRect.bottom + window.scrollY + 5;
      transformOrigin = 'center top';
    }

    dropdownPosition.value = {
      top: `${top}px`,
      left: `${left}px`,
      minWidth: `${triggerRect.width}px`,
      transformOrigin,
    };
  };

  // Scroll listeners
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

    nextTick(() => {
      updateDropdownPosition();
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

  // Event handlers
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

    if (isMultiple.value) {
      const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
      const index = currentValues.indexOf(option.value);

      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(option.value);
      }

      emit('update:modelValue', currentValues);
      emit('change', currentValues);
    } else {
      emit('update:modelValue', option.value);
      emit('change', option.value);
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
    const emptyValue = isMultiple.value ? [] : '';
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

    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = currentValues.indexOf(value);

    if (index > -1) {
      currentValues.splice(index, 1);
      emit('update:modelValue', currentValues);
      emit('change', currentValues);
      emit('remove-tag', value);

      if (props.validateOnInput) {
        validateValue();
      }
    }
  };

  // Utilities
  const isOptionSelected = (value: string | number): boolean => {
    if (isMultiple.value) {
      const values = Array.isArray(props.modelValue) ? props.modelValue : [];
      return values.includes(value);
    }
    return props.modelValue === value;
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

      const containerRect = containerRef.value.getBoundingClientRect();
      const containerWidth = containerRect.width - 60; // Резерв для іконки і паддингів
      let totalWidth = 0;
      let count = 0;
      const tagGap = 4; // Gap між тегами
      const collapsedTagMinWidth = 40; // Мінімальна ширина "+N" тегу

      // Тимчасово створюємо елемент для вимірювання "+N" тегу
      const measureElement = document.createElement('div');
      measureElement.className = 'vt-select__tag vt-select__tag--collapsed';
      measureElement.style.visibility = 'hidden';
      measureElement.style.position = 'absolute';
      measureElement.innerHTML = `<span class="vt-select__tag-text">+${selectedOptions.value.length}</span>`;
      document.body.appendChild(measureElement);
      const collapsedTagWidth = measureElement.offsetWidth;
      document.body.removeChild(measureElement);

      // Проходимо по всіх тегах і рахуємо скільки влізе
      for (let i = 0; i < selectedOptions.value.length; i++) {
        const tagElement = tagRefs.value[i];
        if (!tagElement) {
          // Якщо елемент ще не відрендерився, припускаємо середню ширину
          const estimatedWidth = selectedOptions.value[i].label.length * 8 + 30; // Приблизний розрахунок

          // Перевіряємо чи влізе цей тег + потенційний collapsed тег
          if (i < selectedOptions.value.length - 1) {
            if (totalWidth + estimatedWidth + tagGap + collapsedTagWidth > containerWidth) {
              break;
            }
          } else {
            // Останній тег - перевіряємо без collapsed
            if (totalWidth + estimatedWidth > containerWidth) {
              break;
            }
          }

          totalWidth += estimatedWidth + tagGap;
          count++;
          continue;
        }

        const tagWidth = tagElement.offsetWidth;

        // Якщо це не останній тег, перевіряємо чи влізе він + collapsed індикатор
        if (i < selectedOptions.value.length - 1) {
          if (totalWidth + tagWidth + tagGap + collapsedTagWidth > containerWidth) {
            break;
          }
        } else {
          // Якщо це останній тег, перевіряємо чи влізе він без collapsed індикатора
          if (totalWidth + tagWidth > containerWidth) {
            break;
          }
        }

        totalWidth += tagWidth + tagGap;
        count++;
      }

      // Якщо всі теги влазять, показуємо всі
      if (count >= selectedOptions.value.length) {
        visibleCount.value = selectedOptions.value.length;
      } else {
        // Інакше показуємо стільки, скільки влізає + залишаємо місце для "+N"
        visibleCount.value = Math.max(1, count);
      }
    });
  };

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

  // ВИПРАВЛЕННЯ 4: Оновлений контекст з реактивними методами
  const selectContext: VtSelectContext = {
    selectValue: computed(() => props.modelValue || (isMultiple.value ? [] : '')),
    multiple: isMultiple.value,
    filterable: props.filterable,
    filterQuery: computed(() => filterQuery.value),
    handleOptionClick,
    isOptionSelected,
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
          root: null, // Використовуємо viewport замість dropdownRef
          rootMargin: '20px', // Збільшуємо margin для кращого спрацювання
          threshold: 0.1, // Зменшуємо threshold
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

  const getSelectedOptions = (): VtSelectOption[] => {
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
    getSelectedOptions,
    getValidationState,
    registerOption,
    unregisterOption,
  });

  // ВИПРАВЛЕННЯ 5: Додаємо watcher для відслідковування змін в Map
  watch(
    () => optionsVersion.value,
    () => {
      console.log('Options changed, total count:', registeredOptions.size); // Для дебагу
    }
  );

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
      // Викликаємо пересчет видимих тегів при зміні вибраних опцій
      calcVisibleCount();
    },
    { deep: true }
  );

  // Слідкуємо за змінами розміру контейнера
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

    // Ініціалізація з затримкою для правильного відрендерування
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
            v-tooltip="
              `Вибрано ще ${collapsedCount} ${collapsedCount === 1 ? 'опція' : collapsedCount < 5 ? 'опції' : 'опцій'}: ${selectedOptions
                .slice(visibleCount)
                .map(o => o.label)
                .join(', ')}`
            "
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
              :aria-selected="isOptionSelected(option.value)"
              :class="[
                'vt-option',
                {
                  'vt-option--selected': isOptionSelected(option.value),
                  'vt-option--disabled': option.disabled,
                },
              ]"
              role="option"
              @click="handleOptionClick(option)"
            >
              <!-- Checkbox для мульти-селекту -->
              <VCheckbox
                v-if="isMultiple"
                :checked="isOptionSelected(option.value)"
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
