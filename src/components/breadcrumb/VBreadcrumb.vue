<script lang="ts" setup>
  import { provide } from 'vue';
  import { useI18n } from '@/locales/useI18n';

  import type { VBreadcrumbProps, VBreadcrumbEmits } from './types';
  import VIcon from '@/components/icon/VIcon.vue';

  const props = withDefaults(defineProps<VBreadcrumbProps>(), {
    separator: '/',
    ariaLabel: 'breadcrumb',
    goBack: true,
  });

  const emit = defineEmits<VBreadcrumbEmits>();

  const { t } = useI18n();

  const handleBack = () => {
    emit('back');
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