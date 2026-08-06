<script setup lang="ts" generic="T extends string = string">
  import type { VNavRailItem, VNavRailPlacement } from './types';
  import VBadge from '@/components/badge/VBadge.vue';
  import VIcon from '@/components/icon/VIcon.vue';

  withDefaults(
    defineProps<{
      items: VNavRailItem<T>[];
      modelValue?: T | null;
      placement?: VNavRailPlacement;
    }>(),
    {
      modelValue: null,
      placement: 'left',
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: T];
    select: [item: VNavRailItem<T>];
  }>();

  const onSelect = (item: VNavRailItem<T>) => {
    if (item.disabled) return;
    emit('update:modelValue', item.key);
    emit('select', item);
  };
</script>

<template>
  <aside class="vt-nav-rail">
    <div class="vt-nav-rail__list">
      <template v-for="(item, index) in items" :key="item.key">
        <div
          v-tooltip="item.label"
          class="vt-nav-rail__item"
          :class="{
            'vt-nav-rail__item--selected': modelValue === item.key,
            'vt-nav-rail__item--disabled': item.disabled,
          }"
          :data-placement="placement"
          @click="onSelect(item)"
        >
          <VBadge v-if="item.badge" :content="item.badge.content" :position="item.badge.position">
            <VIcon :name="item.icon" :width="24" :height="24" />
          </VBadge>
          <VIcon v-else :name="item.icon" :width="24" :height="24" />
        </div>
        <span v-if="index < items.length - 1" class="vt-nav-rail__divider" />
      </template>
    </div>

    <div v-if="$slots.footer" class="vt-nav-rail__footer">
      <slot name="footer" />
    </div>
  </aside>
</template>