<script setup lang="ts">
  import { useI18n } from '@/locales/useI18n';
  import type { VEmptyProps } from '@/components/empty/types';
  import { computed } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import { LOCALE_KEYS } from '@/locales/types';

  const { t } = useI18n();

  const props = withDefaults(defineProps<VEmptyProps>(), {
    text: '',
    icon: 'noData',
  });

  const currentIcon = computed(() => {
    return props.icon;
  });

  const currentText = computed(() => {
    return props.text ? props.text : t(LOCALE_KEYS.TABLE_EMPTY);
  });
</script>

<template>
  <div class="vt-empty">
    <VIcon :name="currentIcon" />
    <span>{{ currentText }}</span>
  </div>
</template>
