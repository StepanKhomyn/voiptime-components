<script setup lang="ts">
  import { ref } from 'vue';

  const isFullscreen = ref(false);

  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
  };
</script>

<template>
  <div class="vt-image-fullscreen">
    <div class="vt-image-fullscreen__preview" @click="toggleFullscreen">
      <slot name="image"></slot>
    </div>

    <div v-if="isFullscreen" class="vt-image-fullscreen__overlay" @click="toggleFullscreen">
      <div class="vt-image-fullscreen__content">
        <slot name="image"></slot>
      </div>
    </div>
  </div>
</template>