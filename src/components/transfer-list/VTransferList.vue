<script setup lang="ts" generic="T extends Record<string, any>">
  import { computed, nextTick, ref, shallowRef, onMounted, type Ref } from 'vue';
  import VButton from '@/components/button/VButton.vue';
  import type { VTransferListProps, VTransferListEmits, VTransferListFetchParams } from './types';

  // ─── Constants ────────────────────────────────────────────────────────────────

  const SCROLL_THRESHOLD = 50;

  // ─── Props & Emits ────────────────────────────────────────────────────────────

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
    added: () => [],
    removed: () => [],
  });

  const emit = defineEmits<VTransferListEmits<T>>();

  // ─── Models ───────────────────────────────────────────────────────────────────

  const listOne = defineModel<T[]>('listOne', { required: true, default: () => [] });
  const listTwo = defineModel<T[]>('listTwo', { required: true, default: () => [] });

  // ─── Item Helpers ─────────────────────────────────────────────────────────────
  // ⚠️ Мають бути ПЕРШИМИ — використовуються скрізь нижче

  const getId    = (item: T): unknown => item[props.optionValue as keyof T];
  const getLabel = (item: T): string  => String(item[props.optionLabel as keyof T] ?? '');
  const isSameId = (a: T, b: T): boolean => getId(a) === getId(b);
  const hasItem  = (item: T, list: T[]): boolean => list.some(i => isSameId(i, item));
  const without  = (item: T, list: T[]): T[] => list.filter(i => !isSameId(i, item));

  // ─── State ────────────────────────────────────────────────────────────────────

  const activeLeft    = shallowRef<T | null>(null);
  const activeRight   = shallowRef<T | null>(null);
  const leftFetching  = ref(false);
  const rightFetching = ref(false);

  const leftLoaded  = ref(0);
  const rightLoaded = ref(0);

  const initialRightIds = new Set<unknown>();

  // ─── Computed ─────────────────────────────────────────────────────────────────

  const limit = computed(() => props.fetchLimit ?? 20);

  const hasMoreLeft = computed(() =>
    !!props.fetchLeft && leftLoaded.value < props.leftTotal,
  );

  const hasMoreRight = computed(() =>
    !!props.fetchRight && rightLoaded.value < props.rightTotal,
  );

  const listStyle = computed(() =>
    props.heightStyle ? { height: props.heightStyle } : {},
  );

  // ─── Pagination ───────────────────────────────────────────────────────────────

  const isNearBottom = (el: HTMLElement): boolean =>
    el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_THRESHOLD;

  const hasScroll = (el: HTMLElement): boolean =>
    el.scrollHeight > el.clientHeight;

  const fetchNextPage = async (
    fetchFn: ((params: VTransferListFetchParams) => Promise<void>) | undefined,
    isFetching: Ref<boolean>,
    hasMore: boolean,
    loaded: Ref<number>,
    onAfterFetch?: () => void,
  ): Promise<void> => {
    if (!fetchFn || isFetching.value || !hasMore) return;

    isFetching.value = true;
    const offset = loaded.value;

    try {
      await fetchFn({ limit: limit.value, offset });
      await nextTick();
      onAfterFetch?.();
      loaded.value += limit.value;
    } finally {
      isFetching.value = false;
    }
  };

  // Підвантажує сторінки доки контейнер не заповниться (немає скрола) або більше нема даних
  const fillIfNoScroll = async (
    boxEl: HTMLElement | null,
    fetchFn: ((params: VTransferListFetchParams) => Promise<void>) | undefined,
    isFetching: Ref<boolean>,
    hasMoreRef: Ref<boolean>,
    loaded: Ref<number>,
    onAfterFetch?: () => void,
  ): Promise<void> => {
    if (!boxEl || !fetchFn) return;

    while (!hasScroll(boxEl) && hasMoreRef.value) {
      await fetchNextPage(fetchFn, isFetching, hasMoreRef.value, loaded, onAfterFetch);
    }
  };

  // ─── Template Refs ────────────────────────────────────────────────────────────

  const leftBoxRef  = ref<HTMLElement | null>(null);
  const rightBoxRef = ref<HTMLElement | null>(null);

  const onLeftScroll = async (e: Event): Promise<void> => {
    if (!isNearBottom(e.target as HTMLElement)) return;
    await fetchNextPage(props.fetchLeft, leftFetching, hasMoreLeft.value, leftLoaded);
  };

  const onRightScroll = async (e: Event): Promise<void> => {
    if (!isNearBottom(e.target as HTMLElement)) return;
    await fetchNextPage(props.fetchRight, rightFetching, hasMoreRight.value, rightLoaded, snapshotInitialRight);
  };

  // ─── Initial Load ─────────────────────────────────────────────────────────────

  const snapshotInitialRight = (): void => {
    listTwo.value.forEach(item => initialRightIds.add(getId(item)));
  };

  onMounted(async () => {
    const fetches = [
      props.fetchLeft?.({ limit: limit.value, offset: 0 }),
      props.fetchRight?.({ limit: limit.value, offset: 0 }),
    ].filter(Boolean);

    await Promise.all(fetches);
    await nextTick();

    snapshotInitialRight();

    leftLoaded.value  = limit.value;
    rightLoaded.value = limit.value;

    // Після першого завантаження — заповнюємо контейнери якщо скрола немає
    await Promise.all([
      fillIfNoScroll(leftBoxRef.value, props.fetchLeft, leftFetching, hasMoreLeft, leftLoaded),
      fillIfNoScroll(rightBoxRef.value, props.fetchRight, rightFetching, hasMoreRight, rightLoaded, snapshotInitialRight),
    ]);
  });

  // ─── Transfer Tracking ────────────────────────────────────────────────────────

  const trackTransfer = (item: T, direction: 'left' | 'right'): void => {
    const id = getId(item);
    const wasInitiallyRight = initialRightIds.has(id);

    if (direction === 'right') {
      if (wasInitiallyRight) {
        emit('update:removed', props.removed.filter(i => getId(i) !== id));
      } else {
        const alreadyAdded = props.added.some(i => getId(i) === id);
        if (!alreadyAdded) emit('update:added', [...props.added, item]);
      }
    } else {
      if (wasInitiallyRight) {
        const alreadyRemoved = props.removed.some(i => getId(i) === id);
        if (!alreadyRemoved) emit('update:removed', [...props.removed, item]);
      } else {
        emit('update:added', props.added.filter(i => getId(i) !== id));
      }
    }
  };

  // ─── Transfer Actions ─────────────────────────────────────────────────────────

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
    const items = [...listOne.value];
    items.forEach(item => trackTransfer(item, 'right'));
    listTwo.value    = [...listTwo.value, ...items];
    listOne.value    = [];
    activeLeft.value = null;
  };

  const moveAllToLeft = (): void => {
    if (!listTwo.value.length) return;
    const items = [...listTwo.value];
    items.forEach(item => trackTransfer(item, 'left'));
    listOne.value     = [...listOne.value, ...items];
    listTwo.value     = [];
    activeRight.value = null;
  };

  const moveSingleToRight = (): void => { if (activeLeft.value)  moveToRight(activeLeft.value); };
  const moveSingleToLeft  = (): void => { if (activeRight.value) moveToLeft(activeRight.value); };

  // ─── Selection ────────────────────────────────────────────────────────────────

  const isActive    = (item: T, active: T | null): boolean => !!active && isSameId(item, active);
  const selectLeft  = (item: T): void => { activeLeft.value  = item; emit('selectLeft',  item); };
  const selectRight = (item: T): void => { activeRight.value = item; emit('selectRight', item); };

  // ─── Drag & Drop ──────────────────────────────────────────────────────────────

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
</script>

<<template>
  <div class="vt-transfer-list" :style="listStyle">

    <div class="vt-transfer-list__column">
      <span v-if="leftLabel" class="vt-transfer-list__label">{{ leftLabel }}</span>
      <div
        ref="leftBoxRef"
        class="vt-transfer-list__box"
        @dragover.prevent
        @drop="onDrop($event, 'left')"
        @scroll="onLeftScroll($event)"
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
        ref="rightBoxRef"
        class="vt-transfer-list__box"
        :class="{ 'vt-transfer-list__box--invalid': !isValidRightContainer }"
        :style="listStyle"
        @dragover.prevent
        @drop="onDrop($event, 'right')"
        @scroll="onRightScroll($event)"
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