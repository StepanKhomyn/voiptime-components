<script lang="ts" setup>
  import { computed } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import type { VInfoBoxProps } from './types';
  import type { IconName } from '@/icons';

  const props = withDefaults(defineProps<VInfoBoxProps>(), {
    type: 'primary',
    message: '',
    title: '',
    showIcon: true,
  });

  const classes = computed(() => ({
    [`vt-info-box`]: true,
    [`vt-info-box--${props.type}`]: true,
  }));

  const computedIcon = computed(() => {
    if (props.icon) {
      return props.icon;
    }

    const iconMap = {
      success: 'checkCircle',
      danger: 'alertCircle',
      warning: 'alertTriangle',
      primary: 'infoCircle',
    };

    return iconMap[props.type] as IconName;
  });
</script>

<template>
  <div :class="classes">
    <div v-if="props.showIcon" class="vt-info-box__icon">
      <VIcon :name="computedIcon" />
    </div>
    <div class="vt-info-box__content">
      <div v-if="title" class="vt-info-box__title">{{ title }}</div>
      <div class="vt-info-box__message">
        <slot>{{ message }}</slot>
      </div>
    </div>
  </div>
</template>
