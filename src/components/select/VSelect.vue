// Виправлений VSelect компонент

<template>
  <div ref="selectRef" :class="selectClasses">
    <!-- Label -->
    <label v-if="label" class="vt-select__label">
      {{ label }}
    </label>

    <!-- Trigger -->
    <div
      ref="triggerRef"
      class="vt-select__container"
      tabindex="0"
      @blur="handleBlur"
      @click="toggle"
      @focus="handleFocus"
      @keydown="handleKeydown"
    >
      <!-- Display Field -->
      <div class="vt-select__field">
        <!-- Selected value display -->
        <span v-if="displayText" class="vt-select__display-text">
          {{ displayText }}
        </span>

        <!-- Placeholder -->
        <span v-else class="vt-select__placeholder">
          {{ placeholder }}
        </span>
      </div>

      <!-- Arrow icon -->
      <div class="vt-select__suffix">
        <VIcon
          :class="{ 'vt-select__arrow--open': visible }"
          class="vt-select__icon vt-select__arrow"
          name="arrowDown"
        />
      </div>
    </div>

    <!-- Helper text -->
    <div v-if="helperText" class="vt-select__help">
      {{ helperText }}
    </div>

    <!-- Hidden slot for option registration -->
    <div style="display: none">
      <slot />
    </div>

    <!-- Dropdown -->
    <Teleport v-if="visible && parentVisible" to="body">
      <transition name="dropdown">
        <div ref="dropdownRef" :style="dropdownStyle" class="vt-select-dropdown" @mousedown.prevent>
          <!-- Options -->
          <div class="vt-select-dropdown__options">
            <div
              v-for="option in registeredOptions"
              :key="option.value"
              :class="['vt-option', { 'vt-option--selected': option.value === modelValue }]"
              @click="selectOption(option)"
              @mousedown.prevent
            >
              <span class="vt-option__text">{{ option.label }}</span>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import { useDropdown } from '@/components/dropdown/useDropdown';

  interface VSelectOption {
    value: string | number;
    label: string;
  }

  interface Props {
    modelValue?: string | number;
    placeholder?: string;
    label?: string;
    helperText?: string;
    status?: 'default' | 'success' | 'error' | 'warning';
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Оберіть опцію',
    status: 'default',
  });

  const emit = defineEmits<{
    'update:modelValue': [value: string | number];
    change: [value: string | number];
    'visible-change': [visible: boolean];
  }>();

  // Refs
  const selectRef = ref<HTMLElement>();
  const triggerRef = ref<HTMLElement>();
  const dropdownRef = ref<HTMLElement>();
  const registeredOptions = ref<VSelectOption[]>([]);
  const isSelecting = ref(false); // Флаг для відстеження процесу вибору

  // Dropdown integration
  const {
    visible,
    parentVisible,
    dropdownPosition,
    show: showDropdown,
    hide: hideDropdown,
    toggle: toggleDropdown,
    updatePosition,
  } = useDropdown(triggerRef, dropdownRef, {
    trigger: 'click',
    placement: 'bottom-start',
    hideOnClick: false,
    onVisibleChange: isVisible => {
      emit('visible-change', isVisible);
    },
  });

  // Watcher для оновлення позиції коли dropdown стає видимим
  watch(visible, async newVisible => {
    if (newVisible) {
      await nextTick();
      updatePosition();
    }
  });

  // Methods for option registration
  const registerOption = (option: VSelectOption) => {
    if (!registeredOptions.value.find(o => o.value === option.value)) {
      registeredOptions.value.push(option);
    }
  };

  const unregisterOption = (value: string | number) => {
    const index = registeredOptions.value.findIndex(o => o.value === value);
    if (index > -1) {
      registeredOptions.value.splice(index, 1);
    }
  };

  // Provide context for VOption components
  provide('vt-select-context', {
    registerOption,
    unregisterOption,
    selectedValue: computed(() => props.modelValue),
  });

  // Computed
  const displayText = computed(() => {
    const selected = registeredOptions.value.find(option => option.value === props.modelValue);
    return selected?.label || props.modelValue || '';
  });

  const selectClasses = computed(() => [
    'vt-select',
    `vt-select--${props.status}`,
    {
      'vt-select--open': visible.value,
    },
  ]);

  const dropdownStyle = computed(() => ({
    ...dropdownPosition.value,
    position: 'absolute' as const,
    zIndex: 2000,
  }));

  // Methods
  const toggle = async () => {
    if (!isSelecting.value) {
      toggleDropdown();
    }
  };

  const selectOption = async (option: VSelectOption) => {
    console.log('Selecting option:', option.value);

    // Встановлюємо флаг що ми в процесі вибору
    isSelecting.value = true;

    try {
      // Оновлюємо значення
      emit('update:modelValue', option.value);
      emit('change', option.value);

      // Даємо час для оновлення
      await nextTick();

      // Закриваємо dropdown
      hideDropdown();
    } finally {
      // Скидаємо флаг після короткої затримки
      setTimeout(() => {
        isSelecting.value = false;
      }, 50);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!visible.value || isSelecting.value) return;

    const target = event.target as Node;
    if (selectRef.value?.contains(target) || dropdownRef.value?.contains(target)) {
      return;
    }

    hideDropdown();
  };

  const handleFocus = () => {
    // Focus styles handled by CSS
  };

  const handleBlur = (event: FocusEvent) => {
    // Якщо зараз відбувається вибір опції, не закриваємо dropdown
    if (isSelecting.value) {
      event.preventDefault();
      return;
    }

    // Перевіряємо, чи фокус не переходить на dropdown
    const relatedTarget = event.relatedTarget as Node;
    if (dropdownRef.value?.contains(relatedTarget)) {
      return;
    }

    // Скорочуємо timeout і додаємо перевірку флагу
    setTimeout(() => {
      if (!isSelecting.value && !dropdownRef.value?.contains(document.activeElement)) {
        hideDropdown();
      }
    }, 50);
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    } else if (event.key === 'Escape' && visible.value) {
      event.preventDefault();
      hideDropdown();
    }
  };

  // Lifecycle
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  // Expose methods for parent components
  defineExpose({
    show: showDropdown,
    hide: hideDropdown,
    toggle,
    visible,
    updatePosition,
  });
</script>
