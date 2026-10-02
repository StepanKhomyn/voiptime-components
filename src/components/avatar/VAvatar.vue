<template>
  <div class="vt-avatar" :style="rootSizeStyle">
    <img
      v-if="showImage"
      :src="imageUrl"
      alt="Avatar"
      class="vt-avatar__image"
      loading="lazy"
      @error="hasError = true"
    />

    <div v-else-if="hasSlotContent('svg')" class="vt-avatar__image">
      <slot name="svg" />
    </div>

    <div v-else class="vt-avatar__initials" :style="initialsStyle">
      {{ initials }}
    </div>

    <div v-if="hasSlotContent('icon')" class="vt-avatar__social-icon">
      <slot name="icon" />
    </div>

    <div v-if="hasSlotContent('count')" class="vt-avatar__count">
      <slot name="count" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch, useSlots, Comment, Fragment } from 'vue';
  import type { StyleValue, VNode } from 'vue';
  import type { VAvatarProps } from './types';

  const props = withDefaults(defineProps<VAvatarProps>(), {
    firstName: '',
    lastName: '',
    imageUrl: '',
    size: 40,
  });

  const slots = useSlots();

  /** true, якщо слот переданий І реально має вміст (не порожній v-if / <!----> ) */
  const isVNodeNotEmpty = (node: VNode): boolean => {
    if (node.type === Comment) return false;
    if (node.type === Fragment) {
      return Array.isArray(node.children) && (node.children as VNode[]).some(isVNodeNotEmpty);
    }
    return true;
  };

  const hasSlotContent = (name: string): boolean => {
    const slot = slots[name];
    if (!slot) return false;
    return slot().some(isVNodeNotEmpty);
  };

  /** помилка завантаження картинки */
  const hasError = ref(false);

  watch(
    () => props.imageUrl,
    () => {
      hasError.value = false;
    },
  );

  const showImage = computed(() => {
    const url = props.imageUrl;
    if (!url || hasError.value) return false;
    // відсікаємо data:text/html та інші не-зображення
    if (url.startsWith('data:') && !url.startsWith('data:image/')) return false;
    return true;
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