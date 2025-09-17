<template>
  <div :class="{ 'is-active': isActive, 'is-disabled': disabled }" class="v-collapse-item">
    <div :class="{ 'is-active': isActive }" class="v-collapse-item__header" @click="handleHeaderClick">
      <div class="v-collapse-item__title">
        <slot :is-active="isActive" :title="title" name="title">
          {{ title }}
        </slot>
      </div>
      <div :class="{ 'is-active': isActive }" class="v-collapse-item__arrow">
        <VIcon name="arrowRight" />
      </div>
    </div>
    <transition
      name="collapse"
      @enter="onEnter"
      @leave="onLeave"
      @after-enter="onAfterEnter"
      @after-leave="onAfterLeave"
    >
      <div v-show="isActive" class="v-collapse-item__wrap">
        <div class="v-collapse-item__content">
          <slot />
        </div>
      </div>
    </transition>
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

  // Анімація для розкривання/згортання
  const onEnter = (el: Element) => {
    const element = el as HTMLElement;
    element.style.height = '0';
    element.style.overflow = 'hidden';
    // Примусово викликаємо reflow
    void element.offsetHeight;
    element.style.height = element.scrollHeight + 'px';
  };

  const onLeave = (el: Element) => {
    const element = el as HTMLElement;
    element.style.height = element.scrollHeight + 'px';
    element.style.overflow = 'hidden';
    // Примусово викликаємо reflow
    void element.offsetHeight;
    element.style.height = '0';
  };

  const onAfterEnter = (el: Element) => {
    const element = el as HTMLElement;
    element.style.height = 'auto';
    element.style.overflow = 'visible';
  };

  const onAfterLeave = (el: Element) => {
    const element = el as HTMLElement;
    element.style.height = '0';
    element.style.overflow = 'hidden';
  };
</script>
