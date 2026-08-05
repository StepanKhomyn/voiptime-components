<template>
  <div class="vt-avatar" :style="rootSizeStyle">
    <img v-if="imageUrl" :src="imageUrl" alt="Avatar" class="vt-avatar__image" loading="lazy" />

    <div v-else-if="$slots.svg" class="vt-avatar__image">
      <slot name="svg" />
    </div>

    <div v-else class="vt-avatar__initials" :style="initialsStyle">
      {{ initials }}
    </div>

    <div v-if="$slots.icon" class="vt-avatar__social-icon">
      <slot name="icon" />
    </div>

    <div v-if="$slots.count" class="vt-avatar__count">
      <slot name="count" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import type { StyleValue } from 'vue';
  import type { VAvatarProps } from './types';

  const props = withDefaults(defineProps<VAvatarProps>(), {
    firstName: '',
    lastName: '',
    imageUrl: '',
    size: 40,
  });

  const initials = computed(() => {
    const firstInitial = props.firstName.charAt(0).toUpperCase() || '';
    const lastInitial = props.lastName.charAt(0).toUpperCase() || '';
    return firstInitial + lastInitial || 'A';
  });

  const rootSizeStyle = computed<StyleValue>(() => ({
    '--vt-avatar-size': `${props.size}px`,
  }));

  const initialsStyle: StyleValue = {
    backgroundColor: '#bdbdbd',
    color: 'rgba(0, 71, 90, 1)',
  };
</script>