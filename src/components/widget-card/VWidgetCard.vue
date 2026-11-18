<template>
  <section class="vt-widget-card">
    <header class="vt-widget-card__header">
      <!-- Заголовок і чіпи фільтрів в одному потоці: на вузькому блоці чіпи переносяться -->
      <div class="vt-widget-card__heading">
        <span class="vt-widget-card__title">
          <slot name="title">{{ title }}</slot>
        </span>
        <slot name="filters" />
      </div>

      <div v-if="$slots.actions || downloadable" class="vt-widget-card__actions">
        <slot name="actions" />
        <button
          v-if="downloadable"
          :aria-label="t(LOCALE_KEYS.WIDGET_CARD_DOWNLOAD)"
          :title="t(LOCALE_KEYS.WIDGET_CARD_DOWNLOAD)"
          class="vt-widget-card__action"
          type="button"
          @click="emit('download')"
        >
          <VIcon name="files_download" />
        </button>
      </div>
    </header>

    <div :class="{ 'is-flush': flush }" class="vt-widget-card__body">
      <slot />
    </div>
  </section>
</template>

<script lang="ts" setup>
  import VIcon from '@/components/icon/VIcon.vue';
  import { useI18n } from '@/locales/useI18n';
  import { LOCALE_KEYS } from '@/locales/types';
  import type { VWidgetCardEmits, VWidgetCardProps } from './types';

  /**
   * Картка віджета дашборду: шапка (назва, фільтри, дії) і тіло на всю висоту.
   * У клітинці VWidgetGrid заповнює її повністю, тіло прокручується.
   */
  withDefaults(defineProps<VWidgetCardProps>(), {
    title: '',
    downloadable: false,
    flush: false,
  });

  const emit = defineEmits<VWidgetCardEmits>();

  defineSlots<{
    default?: () => any;
    title?: () => any;
    filters?: () => any;
    actions?: () => any;
  }>();

  const { t } = useI18n();
</script>
