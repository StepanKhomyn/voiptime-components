<script setup lang="ts" generic="T extends Record<string, any>">
  import { computed, ref, shallowRef, onMounted, type Ref } from 'vue';
  import VButton from '@/components/button/VButton.vue';
  import type { VTransferListProps, VTransferListEmits } from './types';

  const asyncLimit = computed(() => props.fetchLimit ?? 20);
  const SCROLL_THRESHOLD = 50;

  const props = withDefaults(defineProps<VTransferListProps<T>>(), {
    optionLabel: 'name' as any,
    optionValue: 'id' as any,
    isValidRightContainer: true,
    heightStyle: '',
    leftPlaceholder: '',
    rightPlaceholder: '',
    leftLabel: '',
    rightLabel: '',
    leftTotal: 0,
    rightTotal: 0,
    leftLoading: false,
    rightLoading: false,
    fetchLimit: 20,
  });

  const emit = defineEmits<VTransferListEmits<T>>();

  const listOne = defineModel<T[]>('listOne', { required: true, default: () => [] });
  const listTwo = defineModel<T[]>('listTwo', { required: true, default: () => [] });
  const added   = defineModel<T[]>('added',   { default: () => [] });
  const removed = defineModel<T[]>('removed', { default: () => [] });

  const activeLeft  = shallowRef<T | null>(null);
  const activeRight = shallowRef<T | null>(null);
  const leftOffset  = ref(0);
  const rightOffset = ref(0);

  // Snapshot правої колонки після першого завантаження
  // Потрібен щоб відрізнити "вже були" від "щойно додали"
  const initialRightIds = new Set<unknown>();

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const getId    = (item: T): unknown => item[props.optionValue as keyof T];
  const getLabel = (item: T): string  => String(item[props.optionLabel as keyof T] ?? '');
  const isSameId = (a: T, b: T): boolean => getId(a) === getId(b);
  const hasItem  = (item: T, list: T[]): boolean => list.some(i => isSameId(i, item));
  const without  = (item: T, list: T[]): T[] => list.filter(i => !isSameId(i, item));

  // ─── Async / infinite scroll ──────────────────────────────────────────────

  const hasMoreLeft  = computed(() => listOne.value.length < props.leftTotal);
  const hasMoreRight = computed(() => listTwo.value.length < props.rightTotal);

  const isNearBottom = (el: HTMLElement): boolean =>
    el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_THRESHOLD;

  const fetchNextPage = async (
    fetch: ((p: { limit: number; offset: number }) => Promise<void>) | undefined,
    loading: boolean,
    hasMore: boolean,
    offset: Ref<number>,
  ): Promise<void> => {
    if (!fetch || loading || !hasMore) return;
    offset.value += asyncLimit.value;
    await fetch({ limit: asyncLimit.value, offset: offset.value });
  };

  onMounted(async () => {
    await Promise.all([
      props.fetchLeft?.({ limit: asyncLimit.value, offset: 0 }),
      props.fetchRight?.({ limit: asyncLimit.value, offset: 0 }),
    ]);
    // Знімаємо snapshot після завантаження правої колонки
    listTwo.value.forEach(item => initialRightIds.add(getId(item)));
  });

  const onLeftScroll = async (e: Event): Promise<void> => {
    if (!isNearBottom(e.target as HTMLElement)) return;
    await fetchNextPage(props.fetchLeft, props.leftLoading, hasMoreLeft.value, leftOffset);
  };

  const onRightScroll = async (e: Event): Promise<void> => {
    if (!isNearBottom(e.target as HTMLElement)) return;
    await fetchNextPage(props.fetchRight, props.rightLoading, hasMoreRight.value, rightOffset);
  };

  // ─── Track added/removed ──────────────────────────────────────────────────

  const trackTransfer = (item: T, direction: 'left' | 'right'): void => {
    const id = getId(item);
    const wasInitiallyRight = initialRightIds.has(id);

    if (direction === 'right') {
      if (wasInitiallyRight) {
        // Повернули назад — прибираємо з removed
        removed.value = removed.value.filter(i => getId(i) !== id);
      } else {
        // Новий — додаємо в added (якщо ще немає)
        if (!added.value.some(i => getId(i) === id)) {
          added.value = [...added.value, item];
        }
      }
    } else {
      // direction === 'left'
      if (wasInitiallyRight) {
        // Прибрали початковий — додаємо в removed
        if (!removed.value.some(i => getId(i) === id)) {
          removed.value = [...removed.value, item];
        }
      } else {
        // Передумали додавати — прибираємо з added
        added.value = added.value.filter(i => getId(i) !== id);
      }
    }
  };

  // ─── Transfer ─────────────────────────────────────────────────────────────

  const transfer = (item: T, from: Ref<T[]>, to: Ref<T[]>, direction: 'left' | 'right'): void => {
    if (hasItem(item, to.value)) return;
    to.value   = [...to.value, item];
    from.value = without(item, from.value);
    trackTransfer(item, direction);
    emit('transfer', item, direction);
  };

  const moveToRight = (item: T): void => {
    transfer(item, listOne, listTwo, 'right');
    if (activeLeft.value && isSameId(activeLeft.value, item)) activeLeft.value = null;
  };

  const moveToLeft = (item: T): void => {
    transfer(item, listTwo, listOne, 'left');
    if (activeRight.value && isSameId(activeRight.value, item)) activeRight.value = null;
  };

  const moveAllToRight = (): void => {
    if (!listOne.value.length) return;
    listOne.value.forEach(item => trackTransfer(item, 'right'));
    listTwo.value  = [...listTwo.value, ...listOne.value];
    listOne.value  = [];
    activeLeft.value = null;
  };

  const moveAllToLeft = (): void => {
    if (!listTwo.value.length) return;
    listTwo.value.forEach(item => trackTransfer(item, 'left'));
    listOne.value  = [...listOne.value, ...listTwo.value];
    listTwo.value  = [];
    activeRight.value = null;
  };

  const moveSingleToRight = (): void => { if (activeLeft.value)  moveToRight(activeLeft.value); };
  const moveSingleToLeft  = (): void => { if (activeRight.value) moveToLeft(activeRight.value); };

  // ─── Selection ────────────────────────────────────────────────────────────

  const isActive   = (item: T, active: T | null): boolean => !!active && isSameId(item, active);
  const selectLeft  = (item: T): void => { activeLeft.value  = item; emit('selectLeft',  item); };
  const selectRight = (item: T): void => { activeRight.value = item; emit('selectRight', item); };

  // ─── Drag & Drop ──────────────────────────────────────────────────────────

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

  // ─── Styles ───────────────────────────────────────────────────────────────

  const listStyle = computed(() => props.heightStyle ? { height: props.heightStyle } : {});
</script>

<<template>
  <div class="vt-transfer-list" :style="listStyle">

    <div class="vt-transfer-list__column">
      <span v-if="leftLabel" class="vt-transfer-list__label">{{ leftLabel }}</span>
      <div
        class="vt-transfer-list__box"
        @dragover.prevent
        @drop="onDrop($event, 'left')"
        @scroll="fetchLeft && onLeftScroll($event)"
      >
        <slot v-if="!listOne.length && !leftLoading" name="left-empty">
          <span v-if="leftPlaceholder" class="vt-transfer-list__placeholder">{{ leftPlaceholder }}</span>
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
        <div v-if="leftLoading" class="vt-transfer-list__loader">
          <slot name="left-loader"><span class="vt-transfer-list__loader-text">Loading…</span></slot>
        </div>
      </div>
    </div>

    <div class="vt-transfer-list__controls">
      <VButton
        v-if="!fetchLeft"
        shape="square" type="default" icon="arrowDoubleRight" tooltip
        :disabled="!listOne.length"
        @click="moveAllToRight"
      >Move all right</VButton>

      <VButton
        shape="square" type="default" icon="arrowRight" tooltip
        :disabled="!activeLeft"
        @click="moveSingleToRight"
      >Move right</VButton>

      <VButton
        shape="square" type="default" icon="arrowLeft" tooltip
        :disabled="!activeRight"
        @click="moveSingleToLeft"
      >Move left</VButton>

      <VButton
        v-if="!fetchRight"
        shape="square" type="default" icon="arrowDoubleLeft" tooltip
        :disabled="!listTwo.length"
        @click="moveAllToLeft"
      >Move all left</VButton>
    </div>

    <div class="vt-transfer-list__column">
      <span v-if="rightLabel" class="vt-transfer-list__label">{{ rightLabel }}</span>
      <div
        class="vt-transfer-list__box"
        :class="{ 'vt-transfer-list__box--invalid': !isValidRightContainer }"
        :style="listStyle"
        @dragover.prevent
        @drop="onDrop($event, 'right')"
        @scroll="fetchRight && onRightScroll($event)"
      >
        <slot v-if="!listTwo.length && !rightLoading" name="right-empty">
          <span v-if="rightPlaceholder" class="vt-transfer-list__placeholder">{{ rightPlaceholder }}</span>
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
        <div v-if="rightLoading" class="vt-transfer-list__loader">
          <slot name="right-loader"><span class="vt-transfer-list__loader-text">Loading…</span></slot>
        </div>
      </div>
    </div>

  </div>
</template>