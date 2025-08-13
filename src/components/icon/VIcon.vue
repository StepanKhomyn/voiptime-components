<script setup lang="ts">
  import { computed } from 'vue';
  import type { IconName } from '../../icons';
  import { icons } from '../../icons';

  interface Props {
    name: IconName;
    width?: string | number;
    height?: string | number;
    color?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    color: 'currentColor',
  });

  const Icon = computed(() => icons[props.name]);

  const iconStyle = computed(() => ({
    ...(props.width && { width: typeof props.width === 'number' ? `${props.width}px` : props.width }),
    ...(props.height && { height: typeof props.height === 'number' ? `${props.height}px` : props.height }),
    color: props.color,
  }));
</script>

<template>
  <component :is="Icon" v-if="Icon" :style="iconStyle" />
</template>
