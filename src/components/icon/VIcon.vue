<script setup lang="ts">
  import { computed } from 'vue';
  import type { IconName } from './icons';
  import { groupIcons } from '@/icon-groups';
  import { legacyIconMap } from './legacyIconMap';

  interface Props {
    name: IconName;
    width?: string | number;
    height?: string | number;
    color?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    color: 'currentColor',
  });

  // Стара назва (deprecated) -> нова через legacyIconMap
  const Icon = computed(
    () =>
      groupIcons[props.name as keyof typeof groupIcons] ??
      groupIcons[legacyIconMap[props.name as keyof typeof legacyIconMap]]
  );

  const iconStyle = computed(() => ({
    ...(props.width && { width: typeof props.width === 'number' ? `${props.width}px` : props.width }),
    ...(props.height && { height: typeof props.height === 'number' ? `${props.height}px` : props.height }),
    color: props.color,
  }));
</script>

<template>
  <component :is="Icon" v-if="Icon" :style="iconStyle" />
</template>
