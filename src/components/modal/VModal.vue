<!-- components/modal/VModal.vue -->
<script lang="ts" setup>
  import { computed, nextTick, onMounted, ref } from 'vue';
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

  const footerHtml = ref<string>('');

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

  onMounted(() => {
    nextTick(() => {
      const content = document.querySelector('.vt-modal__content');
      const footerBlock = content?.querySelector('[ref="modalFooter"]');
      if (footerBlock) {
        footerHtml.value = footerBlock.outerHTML;
        footerBlock.remove();
      }
    });
  });
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" :style="backdropStyles" class="vt-modal__backdrop" @click="handleBackdropClick">
      <div :class="containerClasses" @click.stop>
        <!-- Header -->
        <div v-if="title || showCloseButton" class="vt-modal__header">
          <h2 v-if="title" class="vt-modal__title">
            {{ title }}
          </h2>
          <VIcon v-if="showCloseButton" class="vt-modal__close" name="close" @click="closeModal" />
        </div>

        <!-- Scrollable content -->
        <div class="vt-modal__content">
          <slot />
        </div>

        <!-- Fixed footer (buttons) -->
        <div v-if="footerHtml" class="vt-modal__footer" v-html="footerHtml"></div>
      </div>
    </div>
  </Teleport>
</template>
