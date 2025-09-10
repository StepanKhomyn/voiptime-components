<!--<script lang="ts" setup>-->
<!--  import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue';-->
<!--  import { useDropdown } from '../dropdown/useDropdown';-->
<!--  import type { VtSelectContext, VtSelectEmits, VtSelectMethods, VtSelectOption, VtSelectProps } from './types';-->
<!--  import { VtSelectContextKey } from './types';-->
<!--  import VIcon from '@/components/icon/VIcon.vue';-->
<!--  import VInput from '@/components/input/VInput.vue';-->
<!--  import VCheckbox from '@/components/checkbox/VCheckbox.vue';-->
<!--  import VLoader from '@/components/loader/VLoader.vue';-->

<!--  import {-->
<!--    calculateVisibleTagsCount,-->
<!--    createCollapsedTooltip,-->
<!--    defaultFilterMethod,-->
<!--    getEmptyValue,-->
<!--    getSelectedOptions,-->
<!--    handleOptionSelection,-->
<!--    isOptionSelected,-->
<!--    removeTagFromValue,-->
<!--    validateSelectValue,-->
<!--  } from './helpers';-->

<!--  // ===== PROPS & DEFAULTS =====-->
<!--  const props = withDefaults(defineProps<VtSelectProps>(), {-->
<!--    status: 'default',-->
<!--    disabled: false,-->
<!--    clearable: false,-->
<!--    filterable: false,-->
<!--    loading: false,-->
<!--    multiple: false,-->
<!--    collapsedTags: false,-->
<!--    placeholder: 'Оберіть опцію',-->
<!--    noDataText: 'Немає даних',-->
<!--    noMatchText: 'Співпадінь не знайдено',-->
<!--    loadingText: 'Завантаження...',-->
<!--    maxHeight: 220,-->
<!--    validateOnInput: true,-->
<!--    validateOnBlur: true,-->
<!--    placement: 'bottom-start', // Додано placement prop-->
<!--    trigger: 'click',-->
<!--    showTimeout: 0,-->
<!--    hideTimeout: 0,-->
<!--  });-->

<!--  // ===== EMITS & SLOTS =====-->
<!--  const emit = defineEmits<VtSelectEmits>();-->

<!--  // ===== TEMPLATE REFS =====-->
<!--  const selectRef = ref<HTMLElement>();-->
<!--  const triggerRef = ref<HTMLElement>();-->
<!--  const dropdownRef = ref<HTMLElement>();-->
<!--  const filterInputRef = ref<HTMLInputElement>();-->
<!--  const containerRef = ref<HTMLElement>();-->
<!--  const tagRefs = ref<HTMLElement[]>([]);-->
<!--  const scrollContainerRef = ref<HTMLElement>();-->

<!--  // ===== STATE =====-->
<!--  const state = {-->
<!--    isFocused: ref(false),-->
<!--    filterQuery: ref(''),-->
<!--    validationErrors: ref<string[]>([]),-->
<!--    isValid: ref(true),-->
<!--    visibleCount: ref(0),-->
<!--    isLoadingMore: ref(false),-->
<!--  };-->

<!--  // ===== OPTIONS REGISTRY =====-->
<!--  const optionsRegistry = {-->
<!--    registeredOptions: ref<Map<string | number, VtSelectOption>>(new Map()),-->
<!--    optionSlots: ref<Map<string | number, any>>(new Map()),-->

<!--    register(option: VtSelectOption, slotContent?: any) {-->
<!--      this.registeredOptions.value.set(option.value, option);-->
<!--      if (slotContent) {-->
<!--        this.optionSlots.value.set(option.value, slotContent);-->
<!--      }-->
<!--    },-->

<!--    unregister(value: string | number) {-->
<!--      this.registeredOptions.value.delete(value);-->
<!--      this.optionSlots.value.delete(value);-->
<!--    },-->

<!--    getSlot(value: string | number) {-->
<!--      return this.optionSlots.value.get(value);-->
<!--    },-->

<!--    getAll() {-->
<!--      return Array.from(this.registeredOptions.value.values());-->
<!--    },-->
<!--  };-->

<!--  // ===== DROPDOWN INTEGRATION =====-->
<!--  const {-->
<!--    visible: isDropdownVisible,-->
<!--    parentVisible,-->
<!--    dropdownPosition,-->
<!--    show: showDropdown,-->
<!--    hide: hideDropdown,-->
<!--    toggle: toggleDropdown,-->
<!--    updatePosition,-->
<!--  } = useDropdown(triggerRef, dropdownRef, {-->
<!--    trigger: 'click',-->
<!--    placement: 'bottom',-->
<!--    showTimeout: 250,-->
<!--    hideTimeout: 150,-->
<!--    disabled: props.disabled,-->
<!--    hideOnClick: false,-->
<!--    onVisibleChange: visible => {-->
<!--      if (visible) {-->
<!--        nextTick(async () => {-->
<!--          await updatePosition();-->
<!--          scrollHandler.init();-->

<!--          if (props.filterable && filterInputRef.value) {-->
<!--            filterInputRef.value.focus();-->
<!--          }-->
<!--        });-->
<!--      } else {-->
<!--        state.filterQuery.value = '';-->
<!--        if (props.validateOnBlur) {-->
<!--          validation.validate();-->
<!--        }-->
<!--      }-->

<!--      emit('visible-change', visible);-->
<!--    },-->
<!--    onScroll: () => {-->
<!--      // Додаткова логіка при скролі, якщо потрібно-->
<!--    },-->
<!--  });-->

<!--  // ===== VALIDATION =====-->
<!--  const validation = {-->
<!--    validate() {-->
<!--      const result = validateSelectValue(-->
<!--        props.modelValue,-->
<!--        computedValues.isMultiple.value,-->
<!--        props.required || false,-->
<!--        props.requiredMessage-->
<!--      );-->

<!--      state.validationErrors.value = result.errors;-->
<!--      state.isValid.value = result.isValid;-->

<!--      emit('validation', { isValid: state.isValid.value, errors: result.errors });-->
<!--    },-->

<!--    clear() {-->
<!--      state.validationErrors.value = [];-->
<!--      state.isValid.value = true;-->
<!--      emit('validation', { isValid: true, errors: [] });-->
<!--    },-->
<!--  };-->

<!--  // ===== SCROLL HANDLER =====-->
<!--  const scrollHandler = {-->
<!--    init() {-->
<!--      if (scrollContainerRef.value) {-->
<!--        scrollContainerRef.value.addEventListener('scroll', this.handleOptionsScroll, { passive: true });-->
<!--      }-->
<!--    },-->

<!--    handleOptionsScroll(event: Event) {-->
<!--      if (props.loading || state.isLoadingMore.value) return;-->

<!--      const target = event.target as HTMLElement;-->
<!--      const { scrollTop, scrollHeight, clientHeight } = target;-->
<!--      const scrollThreshold = 50;-->
<!--      const isNearBottom = scrollHeight - scrollTop - clientHeight <= scrollThreshold;-->

<!--      if (isNearBottom && computedValues.filteredOptions.value.length > 0) {-->
<!--        state.isLoadingMore.value = true;-->
<!--        emit('scrolled');-->

<!--        setTimeout(() => {-->
<!--          state.isLoadingMore.value = false;-->
<!--        }, 300);-->
<!--      }-->
<!--    },-->
<!--  };-->

<!--  // ===== COMPUTED VALUES =====-->
<!--  const computedValues = {-->
<!--    isMultiple: computed(() => props.multiple),-->

<!--    allOptions: computed(() => optionsRegistry.getAll()),-->

<!--    filteredOptions: computed(() => {-->
<!--      if (!state.filterQuery.value || !props.filterable) {-->
<!--        return computedValues.allOptions.value;-->
<!--      }-->

<!--      const filterMethod = props.filterMethod || defaultFilterMethod;-->
<!--      return computedValues.allOptions.value.filter(option => filterMethod(state.filterQuery.value, option));-->
<!--    }),-->

<!--    selectedOptions: computed((): VtSelectOption[] => {-->
<!--      return getSelectedOptions(props.modelValue, computedValues.allOptions.value, computedValues.isMultiple.value);-->
<!--    }),-->

<!--    visibleTags: computed(() => {-->
<!--      if (!props.multiple || computedValues.selectedOptions.value.length === 0) return [];-->

<!--      if (!props.collapsedTags) {-->
<!--        return computedValues.selectedOptions.value;-->
<!--      }-->

<!--      return computedValues.selectedOptions.value.slice(0, state.visibleCount.value);-->
<!--    }),-->

<!--    displayText: computed(() => {-->
<!--      if (computedValues.isMultiple.value) return '';-->

<!--      const selected = computedValues.selectedOptions.value[0];-->
<!--      if (selected) return selected.label;-->

<!--      if (-->
<!--        props.modelValue !== undefined &&-->
<!--        props.modelValue !== null &&-->
<!--        props.modelValue !== '' &&-->
<!--        !Array.isArray(props.modelValue)-->
<!--      ) {-->
<!--        return String(props.modelValue);-->
<!--      }-->

<!--      return '';-->
<!--    }),-->

<!--    showClearButton: computed(() => {-->
<!--      return props.clearable && !props.disabled && computedValues.selectedOptions.value.length > 0;-->
<!--    }),-->

<!--    currentStatus: computed(() => {-->
<!--      if (props.status !== 'default') return props.status;-->
<!--      if (!state.isValid.value) return 'error';-->
<!--      return 'default';-->
<!--    }),-->

<!--    selectClasses: computed(() => [-->
<!--      'vt-select',-->
<!--      `vt-select&#45;&#45;${computedValues.currentStatus.value}`,-->
<!--      {-->
<!--        'vt-select&#45;&#45;disabled': props.disabled,-->
<!--        'vt-select&#45;&#45;focused': state.isFocused.value,-->
<!--        'vt-select&#45;&#45;multiple': computedValues.isMultiple.value,-->
<!--        'vt-select&#45;&#45;open': isDropdownVisible.value,-->
<!--      },-->
<!--    ]),-->

<!--    dropdownStyle: computed(() => ({-->
<!--      ...dropdownPosition.value,-->
<!--      position: 'absolute' as const,-->
<!--      zIndex: 2000,-->
<!--      maxHeight: `${props.maxHeight}px`,-->
<!--    })),-->

<!--    collapsedCount: computed(() => {-->
<!--      return computedValues.selectedOptions.value.length - state.visibleCount.value;-->
<!--    }),-->

<!--    showCollapsedIndicator: computed(() => {-->
<!--      return (-->
<!--        props.collapsedTags &&-->
<!--        props.multiple &&-->
<!--        computedValues.selectedOptions.value.length > 0 &&-->
<!--        state.visibleCount.value < computedValues.selectedOptions.value.length-->
<!--      );-->
<!--    }),-->

<!--    collapsedTooltip: computed(() => {-->
<!--      if (!computedValues.showCollapsedIndicator.value) return '';-->

<!--      const hiddenOptions = computedValues.selectedOptions.value.slice(state.visibleCount.value);-->
<!--      return createCollapsedTooltip(computedValues.collapsedCount.value, hiddenOptions);-->
<!--    }),-->
<!--  };-->

<!--  // ===== EVENT HANDLERS =====-->
<!--  const eventHandlers = {-->
<!--    handleClickOutside(event: MouseEvent) {-->
<!--      if (!isDropdownVisible.value) return;-->

<!--      const target = event.target as Node;-->
<!--      if (selectRef.value?.contains(target) || dropdownRef.value?.contains(target)) {-->
<!--        return;-->
<!--      }-->

<!--      hideDropdown();-->
<!--    },-->

<!--    handleFilterInput() {-->
<!--      emit('filter', state.filterQuery.value);-->
<!--    },-->

<!--    handleOptionClick(option: VtSelectOption) {-->
<!--      if (!option || option.disabled) return;-->

<!--      const newValue = handleOptionSelection(option, props.modelValue, computedValues.isMultiple.value);-->

<!--      emit('update:modelValue', newValue);-->
<!--      emit('change', newValue);-->

<!--      if (!computedValues.isMultiple.value) {-->
<!--        hideDropdown();-->
<!--      }-->

<!--      if (props.validateOnInput) {-->
<!--        validation.validate();-->
<!--      }-->
<!--    },-->

<!--    handleClear() {-->
<!--      const emptyValue = getEmptyValue(computedValues.isMultiple.value);-->
<!--      emit('update:modelValue', emptyValue);-->
<!--      emit('change', emptyValue);-->
<!--      emit('clear');-->

<!--      state.filterQuery.value = '';-->
<!--      validation.clear();-->
<!--    },-->

<!--    handleRemoveTag(value: string | number) {-->
<!--      if (!computedValues.isMultiple.value) return;-->

<!--      const newValue = removeTagFromValue(value, props.modelValue);-->

<!--      emit('update:modelValue', newValue);-->
<!--      emit('change', newValue);-->
<!--      emit('remove-tag', value);-->

<!--      if (props.validateOnInput) {-->
<!--        validation.validate();-->
<!--      }-->
<!--    },-->

<!--    handleTriggerClick() {-->
<!--      if (props.disabled) return;-->
<!--      toggleDropdown();-->
<!--    },-->

<!--    handleFocus() {-->
<!--      state.isFocused.value = true;-->
<!--    },-->

<!--    handleBlur() {-->
<!--      state.isFocused.value = false;-->
<!--    },-->
<!--  };-->

<!--  // ===== UTILITIES =====-->
<!--  const utils = {-->
<!--    isOptionSelected(value: string | number): boolean {-->
<!--      return isOptionSelected(value, props.modelValue, computedValues.isMultiple.value);-->
<!--    },-->

<!--    isOptionVisible(option: VtSelectOption): boolean {-->
<!--      return computedValues.filteredOptions.value.includes(option);-->
<!--    },-->

<!--    calcVisibleCount() {-->
<!--      if (!props.collapsedTags || !containerRef.value || computedValues.selectedOptions.value.length === 0) {-->
<!--        state.visibleCount.value = computedValues.selectedOptions.value.length;-->
<!--        return;-->
<!--      }-->

<!--      nextTick(() => {-->
<!--        if (!containerRef.value) return;-->

<!--        const count = calculateVisibleTagsCount(-->
<!--          containerRef.value,-->
<!--          tagRefs.value,-->
<!--          computedValues.selectedOptions.value.length-->
<!--        );-->

<!--        state.visibleCount.value = count;-->
<!--      });-->
<!--    },-->
<!--  };-->

<!--  // ===== CONTEXT PROVIDER =====-->
<!--  const selectContext: VtSelectContext = {-->
<!--    selectValue: computed(() => props.modelValue || (computedValues.isMultiple.value ? [] : '')).value,-->
<!--    multiple: computedValues.isMultiple.value,-->
<!--    filterable: props.filterable,-->
<!--    filterQuery: computed(() => state.filterQuery.value).value,-->
<!--    handleOptionClick: eventHandlers.handleOptionClick,-->
<!--    isOptionSelected: utils.isOptionSelected,-->
<!--    isOptionVisible: utils.isOptionVisible,-->
<!--    registerOption: optionsRegistry.register.bind(optionsRegistry),-->
<!--    unregisterOption: optionsRegistry.unregister.bind(optionsRegistry),-->
<!--  };-->

<!--  provide<VtSelectContext>(VtSelectContextKey, selectContext);-->

<!--  // ===== PUBLIC METHODS =====-->
<!--  const publicMethods = {-->
<!--    focus() {-->
<!--      if (props.filterable && isDropdownVisible.value && filterInputRef.value) {-->
<!--        filterInputRef.value.focus();-->
<!--      } else if (!isDropdownVisible.value) {-->
<!--        showDropdown();-->
<!--      }-->
<!--    },-->

<!--    blur() {-->
<!--      if (props.filterable && filterInputRef.value) {-->
<!--        filterInputRef.value.blur();-->
<!--      }-->
<!--      hideDropdown();-->
<!--    },-->

<!--    clear() {-->
<!--      eventHandlers.handleClear();-->
<!--    },-->

<!--    validate(): boolean {-->
<!--      validation.validate();-->
<!--      return state.isValid.value;-->
<!--    },-->

<!--    clearValidation() {-->
<!--      validation.clear();-->
<!--    },-->

<!--    getSelectedOptions(): VtSelectOption[] {-->
<!--      return computedValues.selectedOptions.value;-->
<!--    },-->

<!--    getValidationState() {-->
<!--      return {-->
<!--        isValid: state.isValid.value,-->
<!--        errors: [...state.validationErrors.value],-->
<!--      };-->
<!--    },-->
<!--  };-->

<!--  defineExpose<VtSelectMethods>({-->
<!--    ...publicMethods,-->
<!--    registerOption: optionsRegistry.register.bind(optionsRegistry),-->
<!--    unregisterOption: optionsRegistry.unregister.bind(optionsRegistry),-->
<!--  });-->

<!--  // ===== WATCHERS =====-->
<!--  watch(-->
<!--    () => props.modelValue,-->
<!--    () => {-->
<!--      if (props.validateOnInput) {-->
<!--        validation.validate();-->
<!--      }-->
<!--    }-->
<!--  );-->

<!--  watch(-->
<!--    computedValues.selectedOptions,-->
<!--    () => {-->
<!--      utils.calcVisibleCount();-->
<!--    },-->
<!--    { deep: true }-->
<!--  );-->

<!--  watch(-->
<!--    () => containerRef.value,-->
<!--    () => {-->
<!--      if (containerRef.value) {-->
<!--        utils.calcVisibleCount();-->
<!--      }-->
<!--    }-->
<!--  );-->

<!--  watch(-->
<!--    () => props.loading,-->
<!--    newLoading => {-->
<!--      if (!newLoading) {-->
<!--        state.isLoadingMore.value = false;-->
<!--      }-->
<!--    }-->
<!--  );-->

<!--  // ===== LIFECYCLE HOOKS =====-->
<!--  onMounted(() => {-->
<!--    // Initial validation-->
<!--    if (-->
<!--      props.modelValue !== undefined &&-->
<!--      props.modelValue !== '' &&-->
<!--      (!Array.isArray(props.modelValue) || props.modelValue.length > 0)-->
<!--    ) {-->
<!--      validation.validate();-->
<!--    }-->

<!--    nextTick(() => {-->
<!--      utils.calcVisibleCount();-->
<!--    });-->

<!--    window.addEventListener('resize', utils.calcVisibleCount);-->
<!--    document.addEventListener('click', eventHandlers.handleClickOutside);-->
<!--  });-->

<!--  onUnmounted(() => {-->
<!--    document.removeEventListener('click', eventHandlers.handleClickOutside);-->
<!--    window.removeEventListener('resize', utils.calcVisibleCount);-->
<!--  });-->
<!--</script>-->

<!--<template>-->
<!--  <div ref="selectRef" :class="computedValues.selectClasses">-->
<!--    &lt;!&ndash; Label &ndash;&gt;-->
<!--    <label v-if="label" :for="id" class="vt-select__label">-->
<!--      {{ label }}-->
<!--      <span v-if="required" class="vt-select__required">*</span>-->
<!--    </label>-->

<!--    &lt;!&ndash; Trigger &ndash;&gt;-->
<!--    <div-->
<!--      ref="triggerRef"-->
<!--      class="vt-select__container"-->
<!--      @blur="eventHandlers.handleBlur"-->
<!--      @click="eventHandlers.handleTriggerClick"-->
<!--      @focus="eventHandlers.handleFocus"-->
<!--    >-->
<!--      &lt;!&ndash; Display Field &ndash;&gt;-->
<!--      <div class="vt-select__field">-->
<!--        &lt;!&ndash; Multiple selected tags &ndash;&gt;-->
<!--        <div v-if="multiple && computedValues.selectedOptions.length > 0" ref="containerRef" class="vt-select__tags">-->
<!--          &lt;!&ndash; Visible tags &ndash;&gt;-->
<!--          <div-->
<!--            v-for="(option, index) in computedValues.visibleTags"-->
<!--            :key="`tag-${option.value}-${index}`"-->
<!--            :ref="el => el && (tagRefs[index] = el as HTMLElement)"-->
<!--            class="vt-select__tag"-->
<!--          >-->
<!--            <span class="vt-select__tag-text">{{ option.label }}</span>-->
<!--            <VIcon-->
<!--              v-if="!props.disabled"-->
<!--              class="vt-select__tag-close"-->
<!--              name="close"-->
<!--              @click.stop="eventHandlers.handleRemoveTag(option.value)"-->
<!--            />-->
<!--          </div>-->

<!--          &lt;!&ndash; Collapsed tags indicator &ndash;&gt;-->
<!--          <div-->
<!--            v-if="computedValues.showCollapsedIndicator"-->
<!--            v-tooltip="computedValues.collapsedTooltip"-->
<!--            class="vt-select__tag vt-select__tag&#45;&#45;collapsed"-->
<!--          >-->
<!--            <span class="vt-select__tag-text">+{{ computedValues.collapsedCount }}</span>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; Single select display &ndash;&gt;-->
<!--        <span v-else-if="!multiple && computedValues.displayText" class="vt-select__display-text">-->
<!--          {{ computedValues.displayText }}-->
<!--        </span>-->

<!--        &lt;!&ndash; Placeholder &ndash;&gt;-->
<!--        <span v-else class="vt-select__placeholder">-->
<!--          {{ placeholder }}-->
<!--        </span>-->
<!--      </div>-->

<!--      &lt;!&ndash; Suffix icons &ndash;&gt;-->
<!--      <div class="vt-select__suffix">-->
<!--        &lt;!&ndash; Loading spinner &ndash;&gt;-->
<!--        <VLoader v-if="loading" class="vt-select__loading" />-->

<!--        &lt;!&ndash; Clear button &ndash;&gt;-->
<!--        <button-->
<!--          v-else-if="computedValues.showClearButton"-->
<!--          :disabled="props.disabled"-->
<!--          class="vt-select__clear-btn"-->
<!--          type="button"-->
<!--          @click.stop="eventHandlers.handleClear"-->
<!--        >-->
<!--          <VIcon name="close" />-->
<!--        </button>-->

<!--        &lt;!&ndash; Arrow icon &ndash;&gt;-->
<!--        <VIcon-->
<!--          v-else-->
<!--          :class="{ 'vt-select__arrow&#45;&#45;open': isDropdownVisible }"-->
<!--          class="vt-select__icon vt-select__arrow"-->
<!--          name="arrowDown"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->

<!--    &lt;!&ndash; Validation messages &ndash;&gt;-->
<!--    <transition name="fade">-->
<!--      <div v-if="state.validationErrors.length > 0" class="vt-select__help">-->
<!--        <div v-for="error in state.validationErrors" :key="error" class="vt-select__error">-->
<!--          {{ error }}-->
<!--        </div>-->
<!--      </div>-->
<!--    </transition>-->

<!--    &lt;!&ndash; Hidden slot for option registration &ndash;&gt;-->
<!--    <div aria-hidden="true" style="display: none">-->
<!--      <slot />-->
<!--    </div>-->

<!--    &lt;!&ndash; Dropdown via Teleport &ndash;&gt;-->
<!--    <Teleport to="body">-->
<!--      <transition name="dropdown">-->
<!--        <div-->
<!--          v-if="isDropdownVisible && parentVisible"-->
<!--          ref="dropdownRef"-->
<!--          :aria-multiselectable="multiple"-->
<!--          :style="computedValues.dropdownStyle"-->
<!--          class="vt-select-dropdown"-->
<!--          role="listbox"-->
<!--          @click.stop-->
<!--        >-->
<!--          &lt;!&ndash; Search Input &ndash;&gt;-->
<!--          <div v-if="filterable" class="vt-select-dropdown__search">-->
<!--            <VInput-->
<!--              ref="filterInputRef"-->
<!--              v-model="state.filterQuery"-->
<!--              :placeholder="`Пошук...`"-->
<!--              suffix-icon="search"-->
<!--              type="text"-->
<!--              @input="eventHandlers.handleFilterInput"-->
<!--            />-->
<!--          </div>-->

<!--          &lt;!&ndash; Loading state &ndash;&gt;-->
<!--          <div v-if="loading" class="vt-select-dropdown__loading">-->
<!--            <VLoader class="vt-select-dropdown__loading-icon" />-->
<!--            {{ loadingText }}-->
<!--          </div>-->

<!--          &lt;!&ndash; No Data &ndash;&gt;-->
<!--          <div v-else-if="computedValues.allOptions.length === 0" class="vt-select-dropdown__empty">-->
<!--            {{ noDataText }}-->
<!--          </div>-->

<!--          &lt;!&ndash; No Match &ndash;&gt;-->
<!--          <div v-else-if="computedValues.filteredOptions.length === 0" class="vt-select-dropdown__empty">-->
<!--            {{ noMatchText }}-->
<!--          </div>-->

<!--          &lt;!&ndash; Options &ndash;&gt;-->
<!--          <div v-else ref="scrollContainerRef" class="vt-select-dropdown__options">-->
<!--            <div-->
<!--              v-for="option in computedValues.filteredOptions"-->
<!--              :key="`option-${option.value}`"-->
<!--              :aria-disabled="option.disabled"-->
<!--              :aria-selected="utils.isOptionSelected(option.value)"-->
<!--              :class="[-->
<!--                'vt-option',-->
<!--                {-->
<!--                  'vt-option&#45;&#45;selected': utils.isOptionSelected(option.value),-->
<!--                  'vt-option&#45;&#45;disabled': option.disabled,-->
<!--                },-->
<!--              ]"-->
<!--              role="option"-->
<!--              @click="eventHandlers.handleOptionClick(option)"-->
<!--            >-->
<!--              &lt;!&ndash; Checkbox for multi-select &ndash;&gt;-->
<!--              <VCheckbox-->
<!--                v-if="computedValues.isMultiple"-->
<!--                :checked="utils.isOptionSelected(option.value)"-->
<!--                :disabled="option.disabled"-->
<!--                class="vt-option__checkbox"-->
<!--                tabindex="-1"-->
<!--              />-->

<!--              &lt;!&ndash; Option content &ndash;&gt;-->
<!--              <span class="vt-option__text">-->
<!--                <component :is="optionsRegistry.getSlot(option.value)" v-if="optionsRegistry.getSlot(option.value)" />-->
<!--                <span v-else>{{ option.label }}</span>-->
<!--              </span>-->
<!--            </div>-->

<!--            &lt;!&ndash; Loading more indicator &ndash;&gt;-->
<!--            <div v-if="state.isLoadingMore" class="vt-select-dropdown__loading-more">-->
<!--              <VLoader class="vt-select-dropdown__loading-icon" />-->
<!--              {{ props.loadingText }}-->
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
