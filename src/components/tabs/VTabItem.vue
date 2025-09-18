<!-- VTabItem.vue - Спрощена версія -->
<script lang="ts" setup>
  import { computed, inject, onBeforeUnmount, onMounted, useSlots } from 'vue';
  import type { VTabItemProps } from './types';

  const props = withDefaults(defineProps<VTabItemProps>(), {
    label: '',
    disabled: false,
    name: undefined,
    closable: false,
    icon: undefined,
  });

  const slots = useSlots();
  const context = inject<any>('VTabsContext');

  if (!context) {
    throw new Error('VTabItem must be used inside VTabs');
  }

  const isActive = computed(() => context.currentValue.value === props.name);

  onMounted(() => {
    if (!props.name) {
      console.warn('⚠️ VTabItem requires a unique `name` prop.');
    }

    context.addTab({
      label: props.label,
      name: props.name,
      disabled: props.disabled,
      closable: props.closable,
      icon: props.icon,
    });
  });

  onBeforeUnmount(() => {
    context.removeTab(props.name);
  });
</script>

<template>
  <div v-show="isActive" class="vt-tabs__pane">
    <slot />
  </div>
</template>
