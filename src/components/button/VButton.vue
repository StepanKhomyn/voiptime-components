<script lang="ts" setup>
  import { computed, nextTick, onMounted, onUnmounted, ref, useSlots, watch } from 'vue';
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
    adaptive: false,
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
    if (!props.adaptive || !buttonRef.value || !props.icon || !slotText.value) {
      return;
    }

    const button = buttonRef.value;
    const parent = button.parentElement;

    if (!parent) return;

    // Створюємо invisible wrapper для виміру повної ширини кнопки
    const measureWrapper = document.createElement('div');
    measureWrapper.style.position = 'absolute';
    measureWrapper.style.visibility = 'hidden';
    measureWrapper.style.pointerEvents = 'none';
    measureWrapper.style.left = '-9999px';
    measureWrapper.style.top = '-9999px';
    measureWrapper.style.width = 'max-content';

    // Клонуємо кнопку з повним текстом
    const clone = button.cloneNode(true) as HTMLElement;

    // Видаляємо класи що змінюють відображення
    clone.classList.remove('vt-button--square', 'vt-button--icon-only');

    // Копіюємо важливі стилі
    const computedStyles = window.getComputedStyle(button);
    clone.style.padding = computedStyles.padding;
    clone.style.fontSize = computedStyles.fontSize;
    clone.style.fontFamily = computedStyles.fontFamily;
    clone.style.fontWeight = computedStyles.fontWeight;
    clone.style.borderRadius = computedStyles.borderRadius;
    clone.style.display = 'inline-flex';
    clone.style.width = 'auto';

    // Переконуємось що іконка і текст присутні
    const cloneIcon = clone.querySelector('.vt-button__icon');
    let cloneContent = clone.querySelector('.vt-button__content');

    if (!cloneContent) {
      cloneContent = document.createElement('span');
      cloneContent.className = 'vt-button__content';
      cloneContent.textContent = slotText.value;
      clone.appendChild(cloneContent);
    } else {
      cloneContent.textContent = slotText.value;
    }

    // Показуємо іконку якщо вона є
    if (cloneIcon && cloneIcon instanceof HTMLElement) {
      cloneIcon.style.display = 'flex';
    }

    measureWrapper.appendChild(clone);
    document.body.appendChild(measureWrapper);

    // Вимірюємо повну ширину кнопки з текстом
    const fullButtonWidth = clone.getBoundingClientRect().width;

    document.body.removeChild(measureWrapper);

    // Вимірюємо доступну ширину в батьківському контейнері
    const parentWidth = parent.getBoundingClientRect().width;

    // Отримуємо padding батька
    const parentStyles = window.getComputedStyle(parent);
    const parentPaddingLeft = parseFloat(parentStyles.paddingLeft);
    const parentPaddingRight = parseFloat(parentStyles.paddingRight);

    const availableWidth = parentWidth - parentPaddingLeft - parentPaddingRight;

    // Якщо кнопка з текстом не вміщається - колапсуємо
    // Додаємо запас 4px для безпеки
    const shouldCollapse = fullButtonWidth > availableWidth - 4;

    if (isCollapsed.value !== shouldCollapse) {
      isCollapsed.value = shouldCollapse;
    }
  };

  // Спостерігач за зміною тексту в слоті
  watch(
    () => slotText.value,
    () => {
      if (props.adaptive && props.icon) {
        nextTick(() => {
          checkButtonWidth();
        });
      }
    }
  );

  onMounted(() => {
    if (props.adaptive && props.icon && slotText.value) {
      // Початкова перевірка
      nextTick(() => {
        setTimeout(() => {
          checkButtonWidth();
        }, 100);
      });

      // Спостерігаємо за змінами розміру БАТЬКІВСЬКОГО контейнера
      const parent = buttonRef.value?.parentElement;
      if (parent) {
        resizeObserver.value = new ResizeObserver(() => {
          // Додаємо невелику затримку щоб дати час на рендер
          setTimeout(() => {
            checkButtonWidth();
          }, 10);
        });
        resizeObserver.value.observe(parent);
      }

      // Слухаємо зміни розміру вікна
      window.addEventListener('resize', () => {
        setTimeout(() => {
          checkButtonWidth();
        }, 10);
      });
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
