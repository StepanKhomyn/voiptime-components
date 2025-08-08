<!-- components/modal/VModal.vue -->
<script setup lang="ts">
  import { computed } from 'vue';
  import type { VModalEmits, VModalProps } from './types';
  import VIcon from '@/components/icon/VIcon.vue';

  // Props
  const props = withDefaults(defineProps<VModalProps>(), {
    size: 'medium',
    showCloseButton: true,
    closeOnBackdropClick: true,
    zIndex: 1000,
  });

  // Emits
  const emit = defineEmits<VModalEmits>();

  // Computed
  const containerClasses = computed(() => ['vt-modal__container', `vt-modal__container--${props.size}`]);

  const backdropStyles = computed(() => ({
    zIndex: props.zIndex,
  }));

  // Methods
  const closeModal = () => {
    emit('update:modelValue', false);
    emit('close');
  };

  const handleBackdropClick = () => {
    if (props.closeOnBackdropClick) {
      closeModal();
    }
  };
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="vt-modal__backdrop" :style="backdropStyles" @click="handleBackdropClick">
      <div :class="containerClasses" @click.stop>
        <!-- Header -->
        <div class="vt-modal__header" v-if="title || showCloseButton">
          <h2 v-if="title" class="vt-modal__title">
            {{ title }}
          </h2>
          <VIcon name="close" v-if="showCloseButton" class="vt-modal__close" @click="closeModal" />
        </div>

        <!-- Content -->
        <div class="vt-modal__content">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
