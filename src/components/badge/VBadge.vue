<template>
  <span class="vt-badge">
    <slot />

    <transition name="vt-badge__fade">
      <span
        v-if="isVisible"
        class="vt-badge__content"
        :class="[
          `vt-badge__content--${position}`,
          `vt-badge__content--${color}`,
          { 'vt-badge__content--dot': dot, 'vt-badge__content--bordered': bordered },
        ]"
        :style="offsetStyle"
      >
        <template v-if="!dot">{{ displayContent }}</template>
      </span>
    </transition>
  </span>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import type { StyleValue } from 'vue';
  import type { VBadgeProps } from './types';

  const props = withDefaults(defineProps<VBadgeProps>(), {
    content: undefined,
    max: 99,
    dot: false,
    color: 'danger',
    position: 'top-end',
    offsetX: 0,
    offsetY: 0,
    bordered: false,
    hidden: false,
  });

  const hasContent = computed(() => {
    if (props.dot) return true;
    if (props.content === undefined || props.content === null || props.content === '') return false;
    if (typeof props.content === 'number') return props.content > 0;
    return true;
  });

  const isVisible = computed(() => hasContent.value && !props.hidden);

  const displayContent = computed(() => {
    if (typeof props.content === 'number') {
      return props.content > props.max ? `${props.max}+` : String(props.content);
    }
    return props.content;
  });

  const offsetStyle = computed<StyleValue>(() => {
    if (!props.offsetX && !props.offsetY) return {};

    const isTop = props.position.startsWith('top');
    const isEnd = props.position.endsWith('end');

    const style: Record<string, string> = {};
    if (props.offsetX) style[isEnd ? 'right' : 'left'] = `${-props.offsetX}px`;
    if (props.offsetY) style[isTop ? 'top' : 'bottom'] = `${-props.offsetY}px`;

    return style;
  });
</script>