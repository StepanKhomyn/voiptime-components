<template>
  <div class="vt-divider" :style="cssVars">
    <span v-if="hasLabel" class="vt-divider__label" :title="typeof text !== 'undefined' ? String(text) : undefined">
      <slot>{{ text }}</slot>
    </span>
    <span class="vt-divider__line" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, useSlots } from 'vue';
  import type { StyleValue } from 'vue';
  import type { VDividerProps } from './types';

  const props = withDefaults(defineProps<VDividerProps>(), {
    text: undefined,
    background: undefined,
    fontSize: undefined,
    color: undefined,
    lineColor: undefined,
  });

  const slots = useSlots();

  const hasLabel = computed(() => !!slots.default || (props.text !== undefined && props.text !== ''));

  // Задаємо лише передані значення — решта береться з дефолтів у divider.scss
  const cssVars = computed<StyleValue>(() => {
    const style: Record<string, string> = {};
    if (props.background) style['--vt-divider-bg'] = props.background;
    if (props.color) style['--vt-divider-color'] = props.color;
    if (props.lineColor) style['--vt-divider-line-color'] = props.lineColor;
    if (props.fontSize !== undefined && props.fontSize !== '') {
      style['--vt-divider-font-size'] = typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize;
    }
    return style;
  });
</script>
