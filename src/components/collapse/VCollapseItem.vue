<template>
  <div
    :class="{
      'is-active': isActive,
      'is-disabled': disabled,
      'vt-collapse-item--flex': flex,
    }"
    class="vt-collapse-item"
  >
    <div :class="{ 'is-active': isActive }" class="vt-collapse-item__header" @click="handleHeaderClick">
      <div class="vt-collapse-item__title">
        <slot :is-active="isActive" :title="title" name="title">
          {{ title }}
        </slot>
      </div>
      <div :class="{ 'is-active': isActive }" class="vt-collapse-item__arrow">
        <VIcon name="arrowRight" />
      </div>
    </div>

    <div v-show="isActive" :class="{ 'vt-collapse-item__wrap--flex': flex }" class="vt-collapse-item__wrap">
      <div class="vt-collapse-item__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, inject } from 'vue';
  import type { CollapseContext, CollapseItemEmits, CollapseItemProps } from './types';
  import VIcon from '@/components/icon/VIcon.vue';

  const props = withDefaults(defineProps<CollapseItemProps>(), {
    disabled: false,
  });

  const emit = defineEmits<CollapseItemEmits>();

  const collapseContext = inject<CollapseContext>('collapseContext');

  if (!collapseContext) {
    throw new Error('VCollapseItem must be used within VCollapse');
  }

  const isActive = computed(() => collapseContext.activeNames.includes(props.name));

  const handleHeaderClick = () => {
    if (props.disabled) return;
    collapseContext.toggle(props.name);
    emit('toggle', props.name);
  };
</script>
