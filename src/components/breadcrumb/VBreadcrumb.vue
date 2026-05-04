<script setup lang="ts">
  import { provide } from 'vue';
  import type { VBreadcrumbProps } from './types';

  const props = withDefaults(defineProps<VBreadcrumbProps>(), {
    separator: '/',
    ariaLabel: 'breadcrumb',
  });

  provide('vt-breadcrumb-separator', props.separator);
</script>

<template>
  <nav :aria-label="ariaLabel" class="vt-breadcrumb">
    <ol class="vt-breadcrumb__list">
      <slot />
    </ol>
  </nav>
</template>
