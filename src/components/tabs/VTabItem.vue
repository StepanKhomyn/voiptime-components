<script setup lang="ts">
  import { computed, inject, onMounted, onBeforeUnmount, ref, watch } from 'vue';

  const props = defineProps({
    name: { type: String, required: true },
    label: String,
    disabled: Boolean,
    closable: Boolean,
    icon: String,
    forceRender: {
      type: Boolean,
      default: false,
    },
  });

  const context = inject<any>('VTabsContext');

  if (!context) {
    throw new Error('VTabItem must be used inside VTabs');
  }

  const renderKey = ref(0);

  const isActive = computed(() => context.currentValue.value === props.name);

  const isRendered = computed(() => {
    if (props.forceRender) {
      return isActive.value; // рендеримо тільки коли активна
    }
    return context.visitedTabs.value.has(props.name);
  });

  onMounted(() => {
    context.addTab({
      name: props.name,
      label: props.label,
      disabled: props.disabled,
      closable: props.closable,
      icon: props.icon,
    });
  });

  onBeforeUnmount(() => {
    context.removeTab(props.name);
  });

  watch(isActive, (val: boolean) => {
    if (val && props.forceRender) {
      renderKey.value++;
    }
  });
</script>

<template>
  <div v-if="isRendered" v-show="isActive" :key="renderKey" class="vt-tabs__pane">
    <slot />
  </div>
</template>