<template>
  <span
    ref="rootRef"
    v-tooltip.always="tooltipText"
    :aria-disabled="disabled || undefined"
    :class="classes"
    :data-placement="tooltipPlacement"
    :role="clickable ? 'button' : undefined"
    :style="rootStyle"
    :tabindex="clickable && !disabled ? 0 : undefined"
    class="vt-tag"
    @click="onClick"
    @keydown.enter.space.prevent="onClick"
  >
    <span v-if="dot" class="vt-tag__dot" />

    <span v-if="hasPrefix" class="vt-tag__icon">
      <slot name="prefix">
        <VIcon v-if="prefixIcon" :height="iconSize" :name="prefixIcon" :width="iconSize" />
      </slot>
    </span>

    <span v-if="hasLabel && !isCollapsed" ref="labelRef" class="vt-tag__label">
      <slot>{{ label }}</slot>
    </span>

    <span v-if="showSuffix" class="vt-tag__icon">
      <slot name="suffix">
        <VIcon v-if="suffixIcon" :height="iconSize" :name="suffixIcon" :width="iconSize" />
      </slot>
    </span>

    <button
      v-if="closable && !isCollapsed"
      :disabled="disabled"
      class="vt-tag__close"
      type="button"
      @click.stop="onClose"
    >
      <VIcon :height="iconSize" :width="iconSize" name="input_close" />
    </button>
  </span>
</template>

<script lang="ts" setup>
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
  import type { StyleValue } from 'vue';
  import VIcon from '../icon/VIcon.vue';
  import { isElementOverflowing } from '@/composables/useTruncatedLabel';
  import { deriveTagPalette } from './color';
  import { TAG_PRESET_COLORS } from './types';
  import type { VTagEmits, VTagPresetColor, VTagProps } from './types';

  const props = withDefaults(defineProps<VTagProps>(), {
    label: undefined,
    size: 'md',
    color: 'primary',
    variant: 'soft',
    prefixIcon: undefined,
    suffixIcon: undefined,
    dot: false,
    closable: false,
    clickable: false,
    disabled: false,
    maxWidth: undefined,
    tooltip: undefined,
    tooltipOnOverflow: true,
    tooltipPlacement: 'top',
    collapsible: true,
    minLabelWidth: 32,
  });

  const emit = defineEmits<VTagEmits>();
  const slots = useSlots();

  const ICON_SIZES = { sm: 12, md: 14, lg: 16 } as const;

  const rootRef = ref<HTMLElement>();
  const labelRef = ref<HTMLElement>();

  const isPreset = computed(() => TAG_PRESET_COLORS.includes(props.color as VTagPresetColor));
  const iconSize = computed(() => ICON_SIZES[props.size]);

  const hasPrefix = computed(() => !!props.prefixIcon || !!slots.prefix);
  const hasSuffix = computed(() => !!props.suffixIcon || !!slots.suffix);
  const hasLabel = computed(() => (props.label !== undefined && props.label !== '') || !!slots.default);

  // Згортати є куди лише тоді, коли поруч з текстом є іконка або крапка
  const canCollapse = computed(
    () => props.collapsible && hasLabel.value && (props.dot || hasPrefix.value || hasSuffix.value)
  );

  // ─── Обрізання тексту / згортання до іконки ───
  const isTruncated = ref(false);
  const isCollapsed = ref(false);
  const labelText = ref('');

  // Ширина батька в момент згортання і скільки px тексту тоді бракувало до minLabelWidth.
  // Розгортаємо, лише коли батько виріс щонайменше на цей дефіцит — інакше тег блимав би при кожному ресайзі
  let collapsedParentWidth = 0;
  let collapseDeficit = 0;

  const getParentWidth = () => rootRef.value?.parentElement?.clientWidth ?? 0;

  const measure = () => {
    if (isCollapsed.value) {
      if (getParentWidth() >= collapsedParentWidth + collapseDeficit) expand();
      return;
    }

    const label = labelRef.value;
    if (!label) {
      isTruncated.value = false;
      return;
    }

    labelText.value = label.textContent?.trim() ?? '';
    isTruncated.value = isElementOverflowing(label);

    if (canCollapse.value && isTruncated.value && label.clientWidth < props.minLabelWidth) {
      collapsedParentWidth = getParentWidth();
      collapseDeficit = props.minLabelWidth - label.clientWidth;
      isCollapsed.value = true;
    }
  };

  const expand = () => {
    isCollapsed.value = false;
    nextTick(measure);
  };

  let observer: ResizeObserver | null = null;
  let rafId = 0;

  const scheduleMeasure = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(measure);
  };

  onMounted(() => {
    const root = rootRef.value;
    if (!root) return;

    observer = new ResizeObserver(scheduleMeasure);
    observer.observe(root);
    if (root.parentElement) observer.observe(root.parentElement);
    measure();
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    cancelAnimationFrame(rafId);
  });

  // Зміна вмісту чи розмірів — перераховуємо з розгорнутого стану
  watch(
    () => [props.label, props.size, props.maxWidth, props.minLabelWidth, props.collapsible, props.closable],
    () => (isCollapsed.value ? expand() : nextTick(measure))
  );

  const tooltipText = computed(() => {
    if (props.tooltip) return props.tooltip;
    if (isCollapsed.value || (props.tooltipOnOverflow && isTruncated.value)) return labelText.value;
    return '';
  });

  // ─── Вигляд ───
  // Для довільного кольору — текст і колір на solid, підібрані під контраст (див. color.ts)
  const customPalette = ref<Record<string, string>>({});

  watch(
    [() => props.color, rootRef],
    ([color, root]) => {
      customPalette.value = (!isPreset.value && root && deriveTagPalette(color, root)) || {};
    },
    { immediate: true, flush: 'post' }
  );

  const classes = computed(() => [
    `vt-tag--${props.size}`,
    `vt-tag--${props.variant}`,
    isPreset.value && `vt-tag--${props.color}`,
    {
      'vt-tag--clickable': props.clickable,
      'vt-tag--disabled': props.disabled,
      'vt-tag--collapsed': isCollapsed.value,
    },
  ]);

  const rootStyle = computed<StyleValue>(() => {
    const style: Record<string, string> = isPreset.value
      ? {}
      : { '--vt-tag-main': props.color, ...customPalette.value };
    if (props.maxWidth !== undefined) {
      style.maxWidth = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth;
    }
    return style;
  });

  const onClick = (event: MouseEvent | KeyboardEvent) => {
    if (props.disabled) return;
    emit('click', event);
  };

  const onClose = (event: MouseEvent) => {
    if (props.disabled) return;
    emit('close', event);
  };

  // Згорнутий тег без префікса показує суфіксну іконку як єдину
  const showSuffix = computed(() => hasSuffix.value && (!isCollapsed.value || (!hasPrefix.value && !props.dot)));
</script>
