<script setup lang="ts">
  import type { VAppBarProps } from './types';

  withDefaults(defineProps<VAppBarProps>(), {
    sticky: false,
  });
</script>

<template>
  <div class="vt-app-bar" :class="{ 'vt-app-bar--sticky': sticky }">
    <div class="vt-app-bar__logo">
      <slot name="logo" />
    </div>

    <div v-if="$slots.center" class="vt-app-bar__center">
      <slot name="center" />
    </div>

    <div v-if="$slots.actions" class="vt-app-bar__actions">
      <slot name="actions" />
    </div>
  </div>
</template>