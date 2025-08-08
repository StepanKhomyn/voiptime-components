<script setup lang="ts">
  import { computed } from 'vue';
  import type { VCheckboxEmits, VCheckboxProps } from './types';

  const props = withDefaults(defineProps<VCheckboxProps>(), {
    modelValue: undefined,
    checked: false,
    disabled: false,
    indeterminate: false,
    isDouble: false, // новий проп для подвійної галочки
    size: 'medium',
    variant: 'primary',
    required: false,
  });

  const emit = defineEmits<VCheckboxEmits>();

  // Generate unique ID if not provided
  const generateId = () => `vt-checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const computedId = computed(() => props.id || generateId());

  // Compute actual checked state - modelValue has priority over checked prop
  const isChecked = computed(() => props.modelValue ?? props.checked);

  const handleChange = (event: Event) => {
    if (props.disabled) return;

    const target = event.target as HTMLInputElement;
    const newValue = target.checked;

    emit('update:modelValue', newValue);
    emit('change', newValue, event);
  };

  const handleFocus = (event: FocusEvent) => {
    emit('focus', event);
  };

  const handleBlur = (event: FocusEvent) => {
    emit('blur', event);
  };
</script>

<template>
  <label
    :class="[
      'vt-checkbox',
      `vt-checkbox--${size}`,
      `vt-checkbox--${variant}`,
      {
        'vt-checkbox--disabled': disabled,
        'vt-checkbox--double': isDouble,
      },
    ]"
    :for="computedId"
  >
    <input
      :id="computedId"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      :required="required"
      :indeterminate.prop="indeterminate"
      type="checkbox"
      class="vt-checkbox__input"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <div
      :class="[
        'vt-checkbox__box',
        {
          'vt-checkbox__box--checked': isChecked && !indeterminate && !isDouble,
          'vt-checkbox__box--indeterminate': indeterminate,
          'vt-checkbox__box--double': isDouble && isChecked,
          'vt-checkbox__box--disabled': disabled,
        },
      ]"
    >
      <!-- Звичайна галочка -->
      <svg
        v-if="!indeterminate && !isDouble"
        :class="[
          'vt-checkbox__checkmark',
          {
            'vt-checkbox__checkmark--checked': isChecked,
          },
        ]"
        width="10"
        height="9"
        viewBox="0 0 10 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 5L3.58264 7.58264C3.80112 7.80112 4.16348 7.77113 4.34306 7.51971L9 1"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>

      <!-- Подвійна галочка -->
      <svg
        v-if="isDouble && isChecked"
        :class="[
          'vt-checkbox__checkmark',
          {
            'vt-checkbox__checkmark--checked': isChecked,
          },
        ]"
        width="13"
        height="6"
        viewBox="0 0 13 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 3L8.25 5L12 1"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M1 3L3.25 5L7 1"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>

      <!-- Indeterminate mark -->
      <div
        v-if="indeterminate"
        :class="[
          'vt-checkbox__indeterminate-mark',
          {
            'vt-checkbox__indeterminate-mark--visible': indeterminate,
          },
        ]"
      />
    </div>

    <span
      v-if="label || $slots.label || $slots.default"
      :class="[
        'vt-checkbox__label',
        {
          'vt-checkbox__label--disabled': disabled,
        },
      ]"
    >
      <slot name="label">
        <slot>{{ label }}</slot>
      </slot>
    </span>
  </label>
</template>
