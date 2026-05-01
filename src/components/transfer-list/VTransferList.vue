<script setup lang="ts" generic="T extends Record<string, any>">
  import { computed, shallowRef } from 'vue';
  import VButton from '@/components/button/VButton.vue';
  import type { VTransferListProps, VTransferListEmits } from './types';

  const props = withDefaults(defineProps<VTransferListProps<T>>(), {
    optionLabel: 'name' as any,
    optionValue: 'id' as any,
    isValidRightContainer: true,
    heightStyle: '',
    leftPlaceholder: '',
    rightPlaceholder: '',
    leftLabel: '',
    rightLabel: '',
  });

  const emit = defineEmits<VTransferListEmits<T>>();

  // ─── Models ───────────────────────────────────────────────────────────────────

  const listOne = defineModel<T[]>('listOne', { required: true, default: () => [] });
  const listTwo = defineModel<T[]>('listTwo', { required: true, default: () => [] });

  // ─── State ────────────────────────────────────────────────────────────────────

  const activeLeft = shallowRef<T | null>(null);
  const activeRight = shallowRef<T | null>(null);

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const getId = (item: T): unknown => item[props.optionValue as keyof T];
  const hasItem = (item: T, list: T[]): boolean => list.some(i => getId(i) === getId(item));
  const withoutItem = (item: T, list: T[]): T[] => list.filter(i => getId(i) !== getId(item));

  // ─── Label accessor ───────────────────────────────────────────────────────────

  const getLabel = (item: T): string =>
    String(item[props.optionLabel as keyof T] ?? '');

  // ─── Move ─────────────────────────────────────────────────────────────────────

  const moveToRight = (item: T): void => {
    if (hasItem(item, listTwo.value)) return;
    listTwo.value = [...listTwo.value, item];
    listOne.value = withoutItem(item, listOne.value);
    if (activeLeft.value && getId(activeLeft.value) === getId(item)) activeLeft.value = null;
    emit('transfer', item, 'right');
  };

  const moveToLeft = (item: T): void => {
    if (hasItem(item, listOne.value)) return;
    listOne.value = [...listOne.value, item];
    listTwo.value = withoutItem(item, listTwo.value);
    if (activeRight.value && getId(activeRight.value) === getId(item)) activeRight.value = null;
    emit('transfer', item, 'left');
  };

  const moveAllToRight = (): void => {
    if (!listOne.value.length) return;
    listTwo.value = [...listTwo.value, ...listOne.value];
    listOne.value = [];
    activeLeft.value = null;
  };

  const moveAllToLeft = (): void => {
    if (!listTwo.value.length) return;
    listOne.value = [...listOne.value, ...listTwo.value];
    listTwo.value = [];
    activeRight.value = null;
  };

  const moveSingleToRight = (): void => { if (activeLeft.value) moveToRight(activeLeft.value); };
  const moveSingleToLeft = (): void => { if (activeRight.value) moveToLeft(activeRight.value); };

  // ─── Selection ───────────────────────────────────────────────────────────────

  const selectLeft = (item: T): void => {
    activeLeft.value = item;
    emit('selectLeft', item);
  };

  const selectRight = (item: T): void => {
    activeRight.value = item;
    emit('selectRight', item);
  };

  const isActive = (item: T, active: T | null): boolean =>
    !!active && getId(item) === getId(active);

  // ─── Drag & Drop ─────────────────────────────────────────────────────────────

  const onDragStart = (event: DragEvent, item: T): void => {
    event.dataTransfer?.setData('application/json', JSON.stringify(item));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (event: DragEvent, target: 'left' | 'right'): void => {
    event.preventDefault();
    try {
      const item = JSON.parse(event.dataTransfer!.getData('application/json')) as T;
      target === 'right' ? moveToRight(item) : moveToLeft(item);
    } catch (e) {
      console.error('[VTransferList] drop parse error:', e);
    }
  };

  // ─── Styles ──────────────────────────────────────────────────────────────────

  const listStyle = computed(() => props.heightStyle ? { height: props.heightStyle } : {});
</script>

<template>
  <div class="vt-transfer-list" :style="listStyle">

    <!-- ── Left column ────────────────────────────────────────────────────── -->
    <div class="vt-transfer-list__column">
      <span v-if="leftLabel" class="vt-transfer-list__label">{{ leftLabel }}</span>

      <div
        class="vt-transfer-list__box"
        @dragover.prevent
        @drop="onDrop($event, 'left')"
      >
        <slot v-if="!listOne.length" name="left-empty">
          <span v-if="leftPlaceholder" class="vt-transfer-list__placeholder">
            {{ leftPlaceholder }}
          </span>
        </slot>

        <div
          v-for="item in listOne"
          :key="String(getId(item))"
          class="vt-transfer-list__item"
          :class="{ 'vt-transfer-list__item--active': isActive(item, activeLeft) }"
          draggable="true"
          @dragstart="onDragStart($event, item)"
          @click="selectLeft(item)"
        >
          <slot name="item" :item="item">{{ getLabel(item) }}</slot>
        </div>
      </div>
    </div>

    <!-- ── Controls ───────────────────────────────────────────────────────── -->
    <div class="vt-transfer-list__controls">
      <VButton
        shape="square"
        type="default"
        icon="arrowDoubleRight"
        tooltip
        :disabled="!listOne.length"
        @click="moveAllToRight"
      >
        Move all right
      </VButton>

      <VButton
        shape="square"
        type="default"
        icon="arrowRight"
        tooltip
        :disabled="!activeLeft"
        @click="moveSingleToRight"
      >
        Move right
      </VButton>

      <VButton
        shape="square"
        type="default"
        icon="arrowLeft"
        tooltip
        :disabled="!activeRight"
        @click="moveSingleToLeft"
      >
        Move left
      </VButton>

      <VButton
        shape="square"
        type="default"
        icon="arrowDoubleLeft"
        tooltip
        :disabled="!listTwo.length"
        @click="moveAllToLeft"
      >
        Move all left
      </VButton>
    </div>

    <!-- ── Right column ───────────────────────────────────────────────────── -->
    <div class="vt-transfer-list__column">
      <span v-if="rightLabel" class="vt-transfer-list__label">{{ rightLabel }}</span>

      <div
        class="vt-transfer-list__box"
        :class="{ 'vt-transfer-list__box--invalid': !isValidRightContainer }"
        :style="listStyle"
        @dragover.prevent
        @drop="onDrop($event, 'right')"
      >
        <slot v-if="!listTwo.length" name="right-empty">
          <span v-if="rightPlaceholder" class="vt-transfer-list__placeholder">
            {{ rightPlaceholder }}
          </span>
        </slot>

        <div
          v-for="item in listTwo"
          :key="String(getId(item))"
          class="vt-transfer-list__item"
          :class="{ 'vt-transfer-list__item--active': isActive(item, activeRight) }"
          draggable="true"
          @dragstart="onDragStart($event, item)"
          @click="selectRight(item)"
        >
          <slot name="item" :item="item">{{ getLabel(item) }}</slot>
        </div>
      </div>
    </div>

  </div>
</template>