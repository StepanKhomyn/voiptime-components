<template>
  <div>
    <!-- Кнопки управління виділенням -->
    <div class="table-controls" style="margin-bottom: 20px">
      <button @click="selectAll" class="btn btn--primary">Виділити всі на сторінці</button>
      <button @click="selectAbsolutelyAll" class="btn btn--primary" :disabled="!canSelectAll">
        Виділити абсолютно всі ({{ totalItems }})
      </button>
      <button @click="clearAll" class="btn btn--secondary">Зняти виділення</button>
      <button @click="selectFirst3" class="btn btn--secondary">Виділити перші 3</button>
      <button @click="getSelected" class="btn btn--info">Показати виділені ({{ selectedCount }})</button>
      <button @click="refreshData" class="btn btn--warning" :disabled="loading">
        {{ loading ? 'Завантаження...' : 'Оновити дані' }}
      </button>
    </div>

    <!-- Інформація про стан виділення -->
    <div
      class="selection-status"
      style="margin-bottom: 15px; padding: 10px; background-color: #f0f9ff; border-radius: 4px"
    >
      <div><strong>Стан виділення:</strong> {{ selectionStatus }}</div>
      <div><strong>Виділено на сторінці:</strong> {{ visibleSelectedCount }} з {{ currentPageData.length }}</div>
      <div><strong>Всього виділено:</strong> {{ selectedCount }} з {{ totalItems }}</div>
      <div v-if="isFullSelection"><strong>🎯 Виділені абсолютно всі записи!</strong></div>
      <div v-if="loading" style="color: #f59e0b"><strong>⏳ Завантажуємо дані...</strong></div>
    </div>

    <!-- Інформація про виділення -->
    <div
      v-if="selectedRows.length > 0"
      class="selection-info"
      style="margin-bottom: 15px; padding: 10px; background-color: #f0f9ff; border-radius: 4px"
    >
      <strong>Виділено рядків: {{ selectedRows.length }}</strong>
      <div style="margin-top: 5px">
        Імена:
        {{
          selectedRows
            .map(r => r.name)
            .slice(0, 5)
            .join(', ')
        }}
        <span v-if="selectedRows.length > 5">... і ще {{ selectedRows.length - 5 }}</span>
      </div>
    </div>

    <!-- Таблиця БЕЗ передачі колонок через пропси -->
    <VTable
      ref="tableRef"
      :data="currentPageData"
      :all-data="[]"
      :max-height="400"
      @sort-change="handleTableSort"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @infinity-scroll="handleScroll"
      @columns-change="handleColumnsChange"
      show-summary
      :summary-method="getSummaries"
      selectable
      selection-key="id"
      :default-selection="defaultSelected"
      :select-on-click-row="false"
      highlight-current-row
    >
      <!-- Колонка з кастомним сортуванням -->
      <VTableColumn prop="status" label="Статус" :width="200" show-overflow-tooltip>
        <template #status="{ row }">
          <span :class="'status-badge status-badge--' + row.status">
            {{ getStatusLabel(row.status) }}
          </span>
        </template>
      </VTableColumn>

      <!-- Звичайні колонки зі стандартним сортуванням -->
      <VTableColumn prop="name" label="Ім'я" :width="150" :pinned-left="true" />
      <VTableColumn prop="date" label="Дата" :width="120" />
      <!-- Колонка з кнопкою для виділення -->
      <VTableColumn prop="custom" label="Кастомний" :width="150" :selectable="false">
        <template #custom="{ row, column, value }">
          <div style="font-weight: bold; color: #007bff">{{ row.score }}%</div>
        </template>
      </VTableColumn>
    </VTable>

    <!-- Пагінація -->
    <div style="margin-top: 20px">
      <VPagination
        :total-items="totalItems"
        :page-size="pageSize"
        :current-page="currentPage"
        :page-size-options="[5, 10, 15, 20]"
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        @reloadData="page => console.log(page)"
        @page-change="handlePaginationChange"
      />
    </div>

    <!-- Debug інформація -->
    <div style="margin-top: 20px; padding: 10px; background: #f3f4f6; border-radius: 4px; font-size: 12px">
      <strong>Debug:</strong><br />
      Поточна сторінка: {{ currentPage }}<br />
      Розмір сторінки: {{ pageSize }}<br />
      Всього записів: {{ totalItems }}<br />
      Завантажених сторінок: {{ Object.keys(pageCache).length }}<br />
      Кеш сторінок: {{ Object.keys(pageCache).join(', ') }}<br />
      <strong>Колонки змінено:</strong> {{ columnsChangeCount }} разів<br />
      <strong>Останній стан колонок:</strong>
      <pre v-if="lastColumnsState">{{ JSON.stringify(lastColumnsState, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import VTable from '@/components/table/VTable.vue';
  import VTableColumn from '@/components/table/VTableColumn.vue';
  import VPagination from '@/components/pagination/VPagination.vue';
  import type { SelectionChangeEventData, VTableColumnProps as VTableColumnType } from '@/components/table/types';

  // Референс на таблицю для доступу до методів
  const tableRef = ref();

  // Параметри пагінації
  const currentPage = ref(1);
  const pageSize = ref(10);
  const totalItems = ref(25); // Загальна кількість записів на "сервері"
  const loading = ref(false);

  // Кеш сторінок - зберігаємо завантажені дані
  const pageCache = ref<Record<number, any[]>>({});

  // Поточні дані сторінки
  const currentPageData = ref<any[]>([]);

  // Всі відомі нам дані (для повного виділення)
  const allKnownData = computed(() => {
    return Object.values(pageCache.value).flat();
  });

  // Стан виділених рядків (глобальний стан)
  const selectedRows = ref<any[]>([]);
  const isFullSelection = ref(false);

  // Лічильник змін колонок для debug
  const columnsChangeCount = ref(0);
  const lastColumnsState = ref<VTableColumnType[] | null>(null);

  // Можливість виділити всі записи (тільки якщо завантажили всі сторінки)
  const canSelectAll = computed(() => {
    const totalPages = Math.ceil(totalItems.value / pageSize.value);
    const loadedPages = Object.keys(pageCache.value).length;
    return loadedPages === totalPages;
  });

  // Рядки виділені за замовчуванням
  const defaultSelected = ref<any[]>([]);

  const new_column = ref([
    {
      name: 'client',
      label: 'Дані клієнта',
      order: 1,
      icon: 'user',
      color: '#3b82f6',
      columns: [
        { prop: 'clientName', label: "Ім'я клієнта", group: 'client' },
        { prop: 'clientEmail', label: 'Email клієнта', group: 'client' },
        { prop: 'clientPhone', label: 'Телефон клієнта', group: 'client' },
      ],
    },
    {
      name: 'delivery',
      label: 'Дані доставки',
      order: 2,
      icon: 'truck',
      color: '#10b981',
      columns: [
        { prop: 'deliveryAddress', label: 'Адреса доставки', group: 'delivery' },
        { prop: 'deliveryDate', label: 'Дата доставки', group: 'delivery' },
        { prop: 'deliveryMethod', label: 'Спосіб доставки', group: 'delivery' },
      ],
    },
    {
      name: 'order',
      label: 'Дані замовлення',
      order: 3,
      icon: 'shoppingCart',
      color: '#f59e0b',
      columns: [
        { prop: 'orderNumber', label: 'Номер замовлення', group: 'order' },
        { prop: 'orderTotal', label: 'Сума замовлення', group: 'order' },
        { prop: 'orderStatus', label: 'Статус замовлення', group: 'order' },
      ],
    },
  ]);
  const selectedCount = computed(() => {
    // Якщо повне виділення активне, показуємо загальну кількість записів
    if (isFullSelection.value) {
      return totalItems.value;
    }
    return selectedRows.value.length;
  });

  const visibleSelectedCount = computed(() => {
    return currentPageData.value.filter(row => selectedRows.value.some(selected => selected.id === row.id)).length;
  });

  const selectionStatus = computed(() => {
    if (isFullSelection.value) return '🎯 Всі записи';
    if (visibleSelectedCount.value === currentPageData.value.length && visibleSelectedCount.value > 0) {
      return '✅ Всі на сторінці';
    }
    if (visibleSelectedCount.value > 0) return '◐ Часткове';
    return '⬜ Нічого не вибрано';
  });

  // Обробник зміни колонок - тепер батьківський компонент ТІЛЬКИ СЛУХАЄ зміни
  const handleColumnsChange = (columns: VTableColumnType[]) => {
    console.log('🏗️ Колонки змінилися у таблиці:', columns);
    columnsChangeCount.value++;
    lastColumnsState.value = [...columns]; // Зберігаємо копію для debug

    // Тут батьківський компонент може реагувати на зміни, але НЕ змінює колонки сам
    // Наприклад:
    // - збереження стану колонок в localStorage
    localStorage.setItem('table-columns-state', JSON.stringify(columns));

    // - відправка на сервер для збереження налаштувань користувача
    // await saveUserTablePreferences(columns);

    // - аналітика
    // analytics.track('table_columns_changed', {
    //   columnsCount: columns.length,
    //   pinnedColumns: columns.filter(col => col.pinnedLeft || col.pinnedRight).length
    // });

    // - показати користувачу повідомлення про збереження
    console.log('💾 Налаштування колонок збережено');
  };

  // Симуляція API для завантаження даних сторінки
  const fetchPageData = async (page: number, size: number): Promise<any[]> => {
    // Симулюємо затримку мережі
    await new Promise(resolve => setTimeout(resolve, 500));

    const startId = (page - 1) * size + 1;
    const data = [];

    const names = [
      'Олексій',
      'Марія',
      'Петро',
      'Анна',
      'Іван',
      'Софія',
      'Дмитро',
      'Катерина',
      'Володимир',
      'Олена',
      'Андрій',
      'Юлія',
      'Максим',
      'Тетяна',
      'Сергій',
      'Ірина',
      'Богдан',
      'Оксана',
      'Роман',
      'Людмила',
      'Василь',
      'Наталя',
      'Олександр',
      'Галина',
      'Михайло',
    ];

    const statuses = ['active', 'inactive', 'pending', 'blocked'];

    for (let i = 0; i < size && startId + i <= totalItems.value; i++) {
      const id = startId + i;
      data.push({
        id,
        name: names[(id - 1) % names.length],
        status: statuses[(id - 1) % statuses.length],
        date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        score: Math.floor(Math.random() * 40) + 60, // 60-100
      });
    }

    return data;
  };

  // Завантаження даних для сторінки
  const loadPageData = async (page: number, force = false) => {
    if (pageCache.value[page] && !force) {
      currentPageData.value = pageCache.value[page];
      return;
    }

    loading.value = true;
    try {
      const data = await fetchPageData(page, pageSize.value);
      pageCache.value[page] = data;
      currentPageData.value = data;
      console.log(`📦 Завантажено дані для сторінки ${page}:`, data);
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
    } finally {
      loading.value = false;
    }
  };

  // Завантаження всіх сторінок (для повного виділення)
  const loadAllPages = async () => {
    const totalPages = Math.ceil(totalItems.value / pageSize.value);
    loading.value = true;

    try {
      const promises = [];
      for (let page = 1; page <= totalPages; page++) {
        if (!pageCache.value[page]) {
          promises.push(
            fetchPageData(page, pageSize.value).then(data => {
              pageCache.value[page] = data;
              console.log(`📦 Завантажено всі дані для сторінки ${page}`);
            })
          );
        }
      }

      await Promise.all(promises);
      console.log('🎯 Всі сторінки завантажені для повного виділення');
    } catch (error) {
      console.error('Помилка завантаження всіх даних:', error);
    } finally {
      loading.value = false;
    }
  };

  // Оновлення даних
  const refreshData = async () => {
    pageCache.value = {};
    selectedRows.value = [];
    isFullSelection.value = false;
    await loadPageData(currentPage.value, true);
  };

  // Обробники пагінації
  const handlePageChange = async (page: number) => {
    currentPage.value = page;
    await loadPageData(page);
    console.log(`📄 Перехід на сторінку ${page}`);
  };

  const handlePageSizeChange = async (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    pageCache.value = {}; // Очищаємо кеш при зміні розміру сторінки
    await loadPageData(1, true);
    console.log(`📏 Змінено розмір сторінки на ${size}`);
  };

  const handlePaginationChange = (data: { page: number; pageSize: number }) => {
    console.log(`📋 Пагінація змінена:`, data);
  };

  // Методи управління виділенням
  const selectAll = () => {
    tableRef.value?.toggleAllSelection();
  };

  const selectAbsolutelyAll = async () => {
    if (!canSelectAll.value) {
      // Завантажуємо всі сторінки перед повним виділенням
      await loadAllPages();
    }
    tableRef.value?.selectAbsolutelyAll();
  };

  const clearAll = () => {
    tableRef.value?.clearSelection();
  };

  const selectFirst3 = () => {
    const first3 = currentPageData.value.slice(0, 3);
    tableRef.value?.setSelectionRows(first3);
  };

  const getSelected = () => {
    const selected = tableRef.value?.getSelectionRows() || [];
    console.log('Поточні виділені рядки:', selected);

    const selectedOnCurrentPage = selected.filter(row =>
      currentPageData.value.some(pageRow => pageRow.id === row.id)
    ).length;

    alert(`Виділено ${selected.length} рядків загалом.
  На поточній сторінці: ${selectedOnCurrentPage}
  Завантажено сторінок: ${Object.keys(pageCache.value).length}
  Перевірте консоль для деталей.`);
  };

  const toggleSingleRow = (row: any) => {
    tableRef.value?.toggleRowSelection(row);
  };

  const isRowSelected = (row: any): boolean => {
    return selectedRows.value.some(selected => selected.id === row.id);
  };

  // Обробники подій
  const handleSelectionChange = (data: SelectionChangeEventData) => {
    console.log('📋 Зміна виділення:', data);
    selectedRows.value = data.selection;
    isFullSelection.value = data.isAllSelected || false;

    if (data.row) {
      console.log(`Рядок ${data.row.name} ${data.selected ? 'виділено' : 'знято виділення'}`);
    }

    if (data.isAllSelected) {
      console.log('🎯 Виділені абсолютно всі записи!');
    }
  };

  const handleRowClick = (data: any) => {
    console.log('🖱️ Клік по рядку:', data.row.name);
    if (data.event.ctrlKey || data.event.metaKey) {
      toggleSingleRow(data.row);
    }
  };

  const handleScroll = () => {
    console.log('scrolled');
  };

  const handleTableSort = (data: any) => {
    console.log('📋 Загальне сортування таблиці:', data);
    // При сортуванні в реальному додатку треба робити запит до сервера
  };

  // Допоміжні функції
  const getSummaries = ({ columns, data }: { columns: any[]; data: any[] }) => {
    return columns.map(col => {
      if (!col.prop) return 'Σ';
      const values = data.map(row => row[col.prop]);
      if (values.every(val => typeof val === 'number')) {
        return values.reduce((sum, val) => sum + val, 0);
      }
      return 'N/A';
    });
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      active: 'Активний',
      inactive: 'Неактивний',
      pending: 'В очікуванні',
      blocked: 'Заблокований',
    };
    return labels[status] || status;
  };

  // Завантажуємо першу сторінку при ініціалізації
  loadPageData(1);

  // Спостерігаємо за зміною розміру сторінки
  watch(pageSize, () => {
    // При зміні розміру сторінки потрібно перерахувати можливість повного виділення
    if (isFullSelection.value) {
      isFullSelection.value = false;
      selectedRows.value = [];
    }
  });
</script>

<style scoped>
  .btn {
    padding: 8px 12px;
    margin-right: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .btn--primary {
    background-color: #007bff;
    color: white;
  }

  .btn--secondary {
    background-color: #6c757d;
    color: white;
  }

  .btn--info {
    background-color: #17a2b8;
    color: white;
  }

  .btn--warning {
    background-color: #ffc107;
    color: #212529;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .status-badge--active {
    background-color: #d4edda;
    color: #155724;
  }

  .status-badge--inactive {
    background-color: #f8d7da;
    color: #721c24;
  }

  .status-badge--pending {
    background-color: #fff3cd;
    color: #856404;
  }

  .status-badge--blocked {
    background-color: #d1ecf1;
    color: #0c5460;
  }
</style>
