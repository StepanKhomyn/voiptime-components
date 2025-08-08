<script setup lang="ts">
  import { computed, useSlots } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import type { VButtonEmits, VButtonProps } from './types';
  import VLoader from '@/components/loader/VLoader.vue';

  const props = withDefaults(defineProps<VButtonProps>(), {
    type: 'default',
    htmlType: 'button',
    disabled: false,
    loading: false,
    tooltip: false,
    tooltipPlacement: 'top',
  });

  const emit = defineEmits<VButtonEmits>();
  const slots = useSlots();

  const isIconOnly = computed(() => Boolean(props.icon && props.shape));

  const slotText = computed(() => {
    const slot = slots.default?.();
    return slot?.[0]?.children?.toString() ?? '';
  });

  const classes = computed(() => [
    'vt-button',
    `vt-button--${props.type}`,
    {
      [`vt-button--${props.shape}`]: props.shape,
      'vt-button--icon-only': isIconOnly.value,
      'vt-button--disabled': props.disabled || props.loading,
      'vt-button--loading': props.loading,
    },
  ]);

  // Динамічні аргументи для директиви
  const tooltipDirectiveValue = computed(() => (isIconOnly.value && props.tooltip ? slotText.value : null));

  const handleClick = (event: MouseEvent) => {
    if (!props.disabled && !props.loading) {
      emit('click', event);
    }
  };
</script>

<template>
  <button
    :class="classes"
    :disabled="props.disabled || props.loading"
    :type="props.htmlType"
    v-tooltip="tooltipDirectiveValue"
    :data-placement="props.tooltipPlacement"
    @click="handleClick"
  >
    <VLoader v-if="props.loading" class="vt-button__icon" />
    <VIcon v-else-if="props.icon" :name="props.icon" class="vt-button__icon" />
    <span v-if="!isIconOnly" class="vt-button__content">
      <slot />
    </span>
  </button>
</template>
