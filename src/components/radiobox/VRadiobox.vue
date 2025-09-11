<script lang="ts" setup>
  import { computed } from 'vue';
  import type { VRadioboxEmits, VRadioboxProps } from './types';

  const props = withDefaults(defineProps<VRadioboxProps>(), {
    modelValue: undefined,
    checked: false,
    disabled: false,
    size: 'medium',
    variant: 'primary',
    required: false,
  });

  const emit = defineEmits<VRadioboxEmits>();

  // Generate unique ID if not provided
  const generateId = () => `vt-radiobox-${Math.random().toString(36).substr(2, 9)}`;
  const computedId = computed(() => props.id || generateId());

  // Compute actual checked state - modelValue has priority over checked prop
  const isChecked = computed(() => {
    if (props.modelValue !== undefined) {
      return props.modelValue === props.value;
    }
    return props.checked;
  });

  const handleChange = (event: Event) => {
    if (props.disabled) return;

    const target = event.target as HTMLInputElement;
    if (target.checked) {
      emit('update:modelValue', props.value);
      emit('change', props.value, event);
    }
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
      'vt-radiobox',
      `vt-radiobox--${size}`,
      `vt-radiobox--${variant}`,
      {
        'vt-radiobox--disabled': disabled,
      },
    ]"
    :for="computedId"
  >
    <input
      :id="computedId"
      :checked="isChecked"
      :disabled="disabled"
      :name="name"
      :required="required"
      :value="value"
      class="vt-radiobox__input"
      type="radio"
      @blur="handleBlur"
      @change="handleChange"
      @focus="handleFocus"
    />

    <div
      :class="[
        'vt-radiobox__circle',
        {
          'vt-radiobox__circle--checked': isChecked,
          'vt-radiobox__circle--disabled': disabled,
        },
      ]"
    >
      <!-- Внутрішня точка для checked стану -->
      <div
        :class="[
          'vt-radiobox__dot',
          {
            'vt-radiobox__dot--checked': isChecked,
          },
        ]"
      />
    </div>

    <span
      v-if="label || $slots.label || $slots.default"
      :class="[
        'vt-radiobox__label',
        {
          'vt-radiobox__label--disabled': disabled,
        },
      ]"
    >
      <slot name="label">
        <slot>{{ label }}</slot>
      </slot>
    </span>
  </label>
</template>
