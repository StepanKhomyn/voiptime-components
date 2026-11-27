<script lang="ts" setup>
  import { computed, watch, ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
  import type { PaginationEmits, PaginationProps } from './types';
  import VButton from '@/components/button/VButton.vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';
  import { LOCALE_KEYS } from '@/locales/types';
  import { useI18n } from '@/locales/useI18n';
  // Props
  const props = withDefaults(defineProps<PaginationProps>(), {
    pageSize: 10,
    currentPage: 1,
    pageSizeOptions: () => [5, 10, 20, 50],
    maxVisiblePages: 6,
  });

  const emit = defineEmits<PaginationEmits>();

  // Computed properties
  const isHandlingPageSizeChange = ref(false);

  const currentPage = computed({
    get: () => props.currentPage,
    set: (value: number) => {
      if (!isHandlingPageSizeChange.value) {
        emit('update:currentPage', value);
      }
    },
  });

  const currentPageSize = computed({
    get: () => props.pageSize,
    set: (value: number) => emit('update:pageSize', value),
  });

  const { t } = useI18n();

  const totalPages = computed(() => Math.ceil(props.totalItems / currentPageSize.value));

  const fromItem = computed(() => (props.totalItems === 0 ? 0 : (currentPage.value - 1) * currentPageSize.value + 1));

  const toItem = computed(() => Math.min(currentPage.value * currentPageSize.value, props.totalItems));

  const isPreviousDisabled = computed(() => currentPage.value <= 1);
  const isNextDisabled = computed(() => currentPage.value >= totalPages.value);

  const visiblePages = computed(() => {
    const pages: (number | string)[] = [];
    const total = totalPages.value;
    const current = currentPage.value;
    const maxVisible = props.maxVisiblePages;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const startPage = Math.max(2, current - Math.floor(maxVisible / 2));
      const endPage = Math.min(total - 1, current + Math.floor(maxVisible / 2));

      if (startPage > 2) pages.push('...');

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < total - 1) pages.push('...');

      if (total > 1) pages.push(total);
    }

    return pages;
  });

  /** Від скількох цифр номери сусідніх сторінок скорочуються до спільного з поточною закінчення */
  const COMPACT_MIN_DIGITS = 4;

  // ─── Компактний режим: вмикається, лише коли повна навігація не влазить в один рядок ───
  const rootRef = ref<HTMLElement | null>(null);
  const infoRef = ref<HTMLElement | null>(null);
  const reloadRef = ref<HTMLElement | null>(null);
  /** Прихована копія навігації з повними номерами — для виміру її ширини */
  const navMeasureRef = ref<HTMLElement | null>(null);
  const isCompact = ref(false);

  const updateCompact = () => {
    const root = rootRef.value;
    if (!root || !infoRef.value || !navMeasureRef.value || !reloadRef.value) return;
    const style = getComputedStyle(root);
    const available = root.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    // Мінімальний відступ між блоками (у кореня justify-content: space-between без gap)
    const gap = parseFloat(style.columnGap) || 16;
    const needed =
      infoRef.value.offsetWidth + navMeasureRef.value.offsetWidth + reloadRef.value.offsetWidth + gap * 2;
    isCompact.value = needed > available;
  };

  let resizeObserver: ResizeObserver | null = null;

  onMounted(() => {
    updateCompact();
    if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
      resizeObserver = new ResizeObserver(() => updateCompact());
      resizeObserver.observe(rootRef.value);
    }
  });

  onBeforeUnmount(() => resizeObserver?.disconnect());

  watch(
    () => [visiblePages.value, props.totalItems, currentPageSize.value],
    () => nextTick(updateCompact)
  );

  /**
   * Підпис кнопки сторінки. Якщо навігація не влазить (isCompact), довгі номери біля поточної показуємо тільки закінченням,
   * яке відрізняється від поточної: 44825 біля 44827 → «…25». Повний номер — у тултіпі.
   * Першу, останню й поточну сторінки не скорочуємо.
   */
  const getPageLabel = (page: number | string): string => {
    const label = String(page);
    if (!isCompact.value || typeof page !== 'number' || page === currentPage.value || page === 1 || page === totalPages.value) {
      return label;
    }
    const current = String(currentPage.value);
    if (label.length < COMPACT_MIN_DIGITS || label.length !== current.length) return label;

    let common = 0;
    while (common < label.length && label[common] === current[common]) common++;
    const suffix = label.slice(Math.min(common, label.length - 2));
    return suffix.length < label.length ? `…${suffix}` : label;
  };

  const getPageTooltip = (page: number | string): string | null =>
    getPageLabel(page) === String(page) ? null : String(page);

  // Methods
  const emitPageChange = () => {
    emit('pageChange', {
      page: currentPage.value,
      pageSize: currentPageSize.value,
    });
  };

  const goToPage = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage.value) {
      currentPage.value = page;
      emitPageChange();
    }
  };

  const goToPrevious = () => {
    if (!isPreviousDisabled.value) {
      currentPage.value--;
      emitPageChange();
    }
  };

  const goToNext = () => {
    if (!isNextDisabled.value) {
      currentPage.value++;
      emitPageChange();
    }
  };

  const handlePageSizeChange = () => {
    isHandlingPageSizeChange.value = true;
    currentPage.value = 1;
    isHandlingPageSizeChange.value = false;
    emitPageChange();
  };

  const reloadData = () => {
    emit('reloadData', currentPage.value);
  };

  // Watcher
  watch(
    () => props.totalItems,
    () => {
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value;
        emitPageChange();
      }
    }
  );
</script>

<template>
  <div ref="rootRef" class="vt-pagination">
    <div ref="infoRef" class="vt-pagination__info">
      <!-- Селект для кількості рядків на сторінку -->
      <div class="vt-pagination__rows-per-page">
        <VSelect id="rowsSelect" v-model="currentPageSize" class="vt-pagination__select" @change="handlePageSizeChange">
          <VOption v-for="option in pageSizeOptions" :key="option" :label="option" :value="option">
            {{ option }}
          </VOption>
        </VSelect>
      </div>

      <!-- Інформація про відображення -->
      <span>{{ fromItem }} - {{ toItem }} з {{ totalItems }} </span>
    </div>

    <!-- Навігація -->
    <div class="vt-pagination__navigation">
      <!-- Кнопка "Попередня" -->
      <button
        :class="{ 'vt-pagination__nav-button': true, 'has-items': !isPreviousDisabled }"
        :disabled="isPreviousDisabled"
        @click="goToPrevious"
      >
        <VIcon name="arrows_left" />
      </button>

      <!-- Номери сторінок -->
      <button
        v-for="page in visiblePages"
        :key="page"
        :class="{
          'vt-pagination__nav-button--active': page === currentPage,
        }"
        v-tooltip="getPageTooltip(page)"
        class="vt-pagination__nav-button"
        @click="goToPage(page)"
      >
        {{ getPageLabel(page) }}
      </button>

      <!-- Кнопка "Наступна" -->
      <button
        :class="{ 'vt-pagination__nav-button': true, 'has-items': !isNextDisabled }"
        :disabled="isNextDisabled"
        @click="goToNext"
      >
        <VIcon name="arrows_right" />
      </button>
    </div>

    <!-- Прихована навігація з повними номерами: за її шириною вирішуємо, чи скорочувати -->
    <div ref="navMeasureRef" class="vt-pagination__navigation vt-pagination__measure" aria-hidden="true">
      <button class="vt-pagination__nav-button" tabindex="-1"><VIcon name="arrows_left" /></button>
      <button
        v-for="(page, index) in visiblePages"
        :key="index"
        :class="{ 'vt-pagination__nav-button--active': page === currentPage }"
        class="vt-pagination__nav-button"
        tabindex="-1"
      >
        {{ page }}
      </button>
      <button class="vt-pagination__nav-button" tabindex="-1"><VIcon name="arrows_right" /></button>
    </div>

    <!-- Релоад -->
    <div ref="reloadRef">
      <VButton icon="arrows_reload" shape="circle" tooltip tooltipPlacement="left" @click="reloadData"
        >{{ t(LOCALE_KEYS.PAGINATION_RELOAD) }}
      </VButton>
    </div>
  </div>
</template>
