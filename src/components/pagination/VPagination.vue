<script lang="ts" setup>
  import { computed, watch } from 'vue';
  import type { PaginationEmits, PaginationProps } from './types';
  import VButton from '@/components/button/VButton.vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';
  // Props
  const props = withDefaults(defineProps<PaginationProps>(), {
    pageSize: 10,
    currentPage: 1,
    pageSizeOptions: () => [5, 10, 20, 50],
    maxVisiblePages: 6,
  });

  const emit = defineEmits<PaginationEmits>();

  // Computed properties
  const currentPage = computed({
    get: () => props.currentPage,
    set: (value: number) => emit('update:currentPage', value),
  });

  const currentPageSize = computed({
    get: () => props.pageSize,
    set: (value: number) => emit('update:pageSize', value),
  });

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
    currentPage.value = 1;
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
  <div class="vt-pagination">
    <div class="vt-pagination__info">
      <!-- Селект для кількості рядків на сторінку -->
      <div class="vt-pagination__rows-per-page">
        <label class="vt-pagination__label" for="rowsSelect">Рядків на сторінку:</label>
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
        <VIcon name="arrowLeft" />
      </button>

      <!-- Номери сторінок -->
      <button
        v-for="page in visiblePages"
        :key="page"
        :class="{
          'vt-pagination__nav-button--active': page === currentPage,
        }"
        class="vt-pagination__nav-button"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <!-- Кнопка "Наступна" -->
      <button
        :class="{ 'vt-pagination__nav-button': true, 'has-items': !isNextDisabled }"
        :disabled="isNextDisabled"
        @click="goToNext"
      >
        <VIcon name="arrowRight" />
      </button>
    </div>

    <!-- Релоад -->
    <div>
      <VButton icon="arrowReload" shape="circle" tooltip tooltipPlacement="left" @click="reloadData"
        >Оновити дані
      </VButton>
    </div>
  </div>
</template>
