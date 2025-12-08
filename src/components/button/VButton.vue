<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, ref, useSlots } from 'vue';
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
    color: '',
    adaptive: true,
  });

  const emit = defineEmits<VButtonEmits>();
  const slots = useSlots();

  const buttonRef = ref<HTMLElement | null>(null);
  const isCollapsed = ref(false);
  const resizeObserver = ref<ResizeObserver | null>(null);

  const isIconOnly = computed(() => {
    if (props.adaptive && isCollapsed.value && props.icon) {
      return true;
    }
    return Boolean(props.icon && props.shape);
  });

  const slotText = computed(() => {
    const slot = slots.default ? slots.default({}) : null;
    return slot?.[0]?.children?.toString() ?? '';
  });

  const classes = computed(() => [
    'vt-button',
    `vt-button--${props.type}`,
    {
      [`vt-button--${props.shape}`]: props.shape && !props.adaptive,
      'vt-button--square': props.adaptive && isCollapsed.value,
      'vt-button--icon-only': isIconOnly.value,
      'vt-button--disabled': props.disabled || props.loading,
      'vt-button--loading': props.loading,
    },
  ]);

  const buttonStyle = computed(() => {
    if (!props.color) return {};
    return {
      color: props.color,
      '--vt-button-icon-color': props.color,
    };
  });

  const tooltipDirectiveValue = computed(() => {
    if (isIconOnly.value && (props.tooltip || (props.adaptive && isCollapsed.value))) {
      return slotText.value;
    }
    return null;
  });

  const checkButtonWidth = () => {
    if (!props.adaptive || !buttonRef.value || !props.icon) return;

    const button = buttonRef.value;
    const parent = button.parentElement;

    if (!parent) return;

    // Тимчасово показуємо повний текст для вимірювання
    isCollapsed.value = false;

    requestAnimationFrame(() => {
      const buttonWidth = button.scrollWidth;
      const availableWidth = parent.clientWidth;

      // Якщо кнопка не вміщується, колапсуємо
      isCollapsed.value = buttonWidth > availableWidth;
    });
  };

  onMounted(() => {
    if (props.adaptive && props.icon) {
      checkButtonWidth();

      // Спостерігаємо за змінами розміру батьківського контейнера
      const parent = buttonRef.value?.parentElement;
      if (parent) {
        resizeObserver.value = new ResizeObserver(() => {
          checkButtonWidth();
        });
        resizeObserver.value.observe(parent);
      }

      // Також слухаємо зміни розміру вікна
      window.addEventListener('resize', checkButtonWidth);
    }
  });

  onUnmounted(() => {
    if (resizeObserver.value) {
      resizeObserver.value.disconnect();
    }
    window.removeEventListener('resize', checkButtonWidth);
  });

  const handleClick = (event: MouseEvent) => {
    if (!props.disabled && !props.loading) {
      emit('click', event);
    }
  };
</script>

<template>
  <button
    ref="buttonRef"
    v-tooltip="tooltipDirectiveValue"
    :class="classes"
    :data-placement="props.tooltipPlacement"
    :disabled="props.disabled || props.loading"
    :style="buttonStyle"
    :type="props.htmlType"
    @click="handleClick"
  >
    <VLoader v-if="props.loading" class="vt-button__icon" />
    <VIcon
      v-else-if="props.icon"
      :name="props.icon"
      :style="{ color: 'var(--vt-button-icon-color)' }"
      class="vt-button__icon"
    />
    <span v-if="!isIconOnly" class="vt-button__content">
      <slot />
    </span>
  </button>
</template>
