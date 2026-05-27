<script lang="ts" setup>
  import { computed, provide } from 'vue';
  import { useI18n } from '@/locales/useI18n';

  import type { VBreadcrumbProps } from './types';

  import VIcon from '@/components/icon/VIcon.vue';
  import VBreadcrumbItem from './VBreadcrumbItem.vue';

  const props = withDefaults(defineProps<VBreadcrumbProps>(), {
    separator: '/',
    ariaLabel: 'breadcrumb',
    goBack: true,
    routes: () => [],
  });

  const { t } = useI18n();

  const normalizedRoutes = computed(() => {
    return props.routes.map((item, index) => ({
      label: item.i18n ? t(item.i18n) : item.label,
      to: item.route ?? undefined,
      active: index === props.routes.length - 1,
    }));
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
      <li
        v-if="goBack"
        class="vt-breadcrumb__back"
        @click="handleBack"
      >
        <VIcon name="arrowLeft" />
      </li>

      <template v-if="routes?.length">
        <VBreadcrumbItem
          v-for="(item, index) in normalizedRoutes"
          :key="index"
          :to="item.to"
          :active="item.active"
        >
          {{ item.label }}
        </VBreadcrumbItem>
      </template>

      <slot v-else />
    </ol>
  </nav>
</template>