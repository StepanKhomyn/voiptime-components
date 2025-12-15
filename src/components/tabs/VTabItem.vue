<script setup lang="ts">
  import { computed, inject, onMounted, onBeforeUnmount } from 'vue';

  const props = defineProps({
    name: { type: String, required: true },
    label: String,
    disabled: Boolean,
    closable: Boolean,
    icon: String,
  });

  const context = inject<any>('VTabsContext');

  if (!context) {
    throw new Error('VTabItem must be used inside VTabs');
  }

  const isActive = computed(() => context.currentValue.value === props.name);

  const isRendered = computed(() =>
    context.visitedTabs.value.has(props.name)
  );

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
</script>

<template>
  <KeepAlive>
    <div v-if="isRendered" v-show="isActive" class="vt-tabs__pane">
      <slot />
    </div>
  </KeepAlive>
</template>