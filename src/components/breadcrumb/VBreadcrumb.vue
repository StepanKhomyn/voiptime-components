<script lang="ts" setup>
  import { provide } from 'vue';
  import type { VBreadcrumbProps } from './types';
  import VIcon from '@/components/icon/VIcon.vue';

  const props = withDefaults(defineProps<VBreadcrumbProps>(), {
    separator: '/',
    ariaLabel: 'breadcrumb',
    goBack: true,
  });

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    }
  };

  provide('vt-breadcrumb-separator', props.separator);
</script>

<template>
  <nav :aria-label="ariaLabel" class="vt-breadcrumb">
    <ol class="vt-breadcrumb__list">
      <li v-if="goBack" class="vt-breadcrumb__back" @click="handleBack">
        <VIcon name="arrowLeft" />
      </li>
      <slot />
    </ol>
  </nav>
</template>
