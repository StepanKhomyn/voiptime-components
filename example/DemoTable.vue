<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import VTable from '@/components/table/VTable.vue';
  import VTableColumn from '@/components/table/VTableColumn.vue';
  import VPagination from '@/components/pagination/VPagination.vue';
  import type { SelectionChangeEventData, VTableColumnProps as VTableColumnType } from '@/components/table/types';
  import VInput from '@/components/input/VInput.vue';

  // Референс на таблицю для доступу до методів
  const tableRef = ref();

  // Параметри пагінації
  const currentPage = ref(1);
  const pageSize = ref(10);
  const totalItems = ref(50); // Загальна кількість записів на "сервері"
  const loading = ref(false);

  // Кеш сторінок - зберігаємо завантажені дані
  const pageCache = ref<Record<number, any[]>>({});

  // Поточні дані сторінки
  const currentPageData = ref<any[]>([]);

  // Стан виділених рядків (глобальний стан)
  const selectedRows = ref<any[]>([]);
  const isFullSelection = ref(false);

  // Лічильник змін колонок та стану згортання коду
  const columnsChangeCount = ref(0);
  const lastColumnsState = ref<VTableColumnType[] | null>(null);
  const codeCollapsed = ref({
    defaultTable: true,
    paginatedTable: true,
    columnActionTable: true,
    highlightTable: true,
  });

  // Можливість виділити всі записи (тільки якщо завантажили всі сторінки)
  const canSelectAll = computed(() => {
    const totalPages = Math.ceil(totalItems.value / pageSize.value);
    const loadedPages = Object.keys(pageCache.value).length;
    return loadedPages === totalPages;
  });

  // Рядки виділені за замовчуванням
  const defaultSelected = ref<any[]>([2]);

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
    selectedRows.value = [];
    isFullSelection.value = false;
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
    console.log('📜 Infinity scroll triggered');
    // Можна додати логіку для завантаження наступної сторінки
  };

  const handleTableSort = (data: any) => {
    console.log('📋 Загальне сортування таблиці:', data);
    // При сортуванні в реальному додатку треба робити запит до сервера
  };

  // Обробник зміни колонок
  const handleColumnsChange = (columns: VTableColumnType[]) => {
    console.log('🏗️ Колонки змінилися у таблиці:', columns);
    columnsChangeCount.value++;
    lastColumnsState.value = [...columns];

    // Зберігання стану колонок в localStorage
    localStorage.setItem('table-columns-state', JSON.stringify(columns));
    console.log('💾 Налаштування колонок збережено');
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

  const toggleCode = (tableType: string) => {
    codeCollapsed.value[tableType] = !codeCollapsed.value[tableType];
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

  const columnGroups = [
    {
      name: 'basic',
      label: 'Основна інформація',
      order: 1,
      icon: 'prompter',
      color: '#3b82f6',
      columns: [
        {
          prop: 'id',
          label: 'ID',
          width: 80,
          sortable: true,
          pinnedLeft: true,
          showOverflowTooltip: false,
        },
        {
          prop: 'name',
          label: "Ім'я",
          width: 150,
          sortable: true,
          showOverflowTooltip: true,
        },
        {
          prop: 'email',
          label: 'Email',
          width: 200,
          sortable: true,
          showOverflowTooltip: true,
        },
        {
          prop: 'phone',
          label: 'Телефон',
          width: 120,
          sortable: false,
          showOverflowTooltip: true,
        },
      ],
    },
    {
      name: 'status',
      label: 'Статус і стан',
      order: 2,
      icon: 'usersGroup',
      color: '#10b981',
      columns: [
        {
          prop: 'status',
          label: 'Статус',
          width: 120,
          sortable: true,
          showOverflowTooltip: false,
        },
        {
          prop: 'isActive',
          label: 'Активний',
          width: 80,
          sortable: true,
          showOverflowTooltip: false,
        },
        {
          prop: 'lastLogin',
          label: 'Останній вхід',
          width: 140,
          sortable: true,
          showOverflowTooltip: true,
        },
        {
          prop: 'onlineStatus',
          label: 'Онлайн',
          width: 90,
          sortable: true,
          showOverflowTooltip: false,
        },
      ],
    },
    {
      name: 'financial',
      label: 'Фінансова інформація',
      order: 3,
      icon: 'filterAdvanced',
      color: '#f59e0b',
      columns: [
        {
          prop: 'balance',
          label: 'Баланс',
          width: 100,
          sortable: true,
          showOverflowTooltip: false,
        },
        {
          prop: 'totalSpent',
          label: 'Витрачено',
          width: 110,
          sortable: true,
          showOverflowTooltip: false,
        },
        {
          prop: 'creditLimit',
          label: 'Кредитний ліміт',
          width: 130,
          sortable: true,
          showOverflowTooltip: false,
        },
        {
          prop: 'paymentMethod',
          label: 'Спосіб оплати',
          width: 140,
          sortable: false,
          showOverflowTooltip: true,
        },
      ],
    },
    {
      name: 'analytics',
      label: 'Аналітика',
      order: 4,
      icon: 'filterMultiselect',
      color: '#8b5cf6',
      columns: [
        {
          prop: 'score',
          label: 'Рейтинг',
          width: 100,
          sortable: true,
          showOverflowTooltip: false,
        },
        {
          prop: 'visits',
          label: 'Відвідувань',
          width: 100,
          sortable: true,
          showOverflowTooltip: false,
        },
        {
          prop: 'conversionRate',
          label: 'Конверсія %',
          width: 120,
          sortable: true,
          showOverflowTooltip: false,
        },
        {
          prop: 'avgSessionTime',
          label: 'Сер. час сесії',
          width: 140,
          sortable: true,
          showOverflowTooltip: true,
        },
      ],
    },
    {
      name: 'location',
      label: 'Місцезнаходження',
      order: 5,
      icon: 'excel',
      color: '#ef4444',
      columns: [
        {
          prop: 'country',
          label: 'Країна',
          width: 100,
          sortable: true,
          showOverflowTooltip: true,
        },
        {
          prop: 'city',
          label: 'Місто',
          width: 120,
          sortable: true,
          showOverflowTooltip: true,
        },
        {
          prop: 'timezone',
          label: 'Часовий пояс',
          width: 130,
          sortable: false,
          showOverflowTooltip: true,
        },
        {
          prop: 'coordinates',
          label: 'Координати',
          width: 150,
          sortable: false,
          showOverflowTooltip: true,
        },
      ],
    },
    {
      name: 'dates',
      label: 'Дати',
      order: 6,
      icon: 'filterDateCheck',
      color: '#06b6d4',
      columns: [
        {
          prop: 'createdAt',
          label: 'Дата створення',
          width: 140,
          sortable: true,
          showOverflowTooltip: true,
        },
        {
          prop: 'updatedAt',
          label: 'Останнє оновлення',
          width: 150,
          sortable: true,
          showOverflowTooltip: true,
        },
        {
          prop: 'birthDate',
          label: 'Дата народження',
          width: 140,
          sortable: true,
          showOverflowTooltip: false,
        },
        {
          prop: 'expiresAt',
          label: 'Термін дії',
          width: 120,
          sortable: true,
          showOverflowTooltip: true,
        },
      ],
    },
    {
      name: 'actions',
      label: 'Дії',
      order: 7,
      icon: 'prompt',
      color: '#64748b',
      columns: [
        {
          prop: 'actions',
          label: 'Дії',
          width: 120,
          sortable: false,
          pinnedRight: true,
          actionColumn: true,
          showOverflowTooltip: false,
        },
      ],
    },
  ];

  const sampleColumnData = ref([
    {
      id: 1,
      name: 'Олексій Петренко',
      email: 'oleksiy@example.com',
      phone: '+380501234567',
      status: 'active',
      isActive: true,
      lastLogin: '2024-08-14 10:30:00',
      onlineStatus: 'online',
      balance: 1500.5,
      totalSpent: 3200.0,
      creditLimit: 5000.0,
      paymentMethod: 'Visa ****1234',
      score: 95,
      visits: 142,
      conversionRate: 15.2,
      avgSessionTime: '00:12:45',
      country: 'Україна',
      city: 'Київ',
      timezone: 'Europe/Kiev',
      coordinates: '50.4501, 30.5234',
      createdAt: '2023-01-15',
      updatedAt: '2024-08-14',
      birthDate: '1990-05-20',
      expiresAt: '2025-01-15',
    },
  ]);

  const columnPinMethod = (payload: { column; position: 'left' | 'right' | 'none' }) => {
    console.group('📌 Column Pin Event');
    console.log('Column:', payload.column.label, `(${payload.column.prop})`);
    console.log('Position:', payload.position);
    console.log('Previous state:', {
      pinnedLeft: payload.column.pinnedLeft,
      pinnedRight: payload.column.pinnedRight,
    });

    const emoji = payload.position === 'left' ? '⬅️' : payload.position === 'right' ? '➡️' : '📌❌';
    const action =
      payload.position === 'none' ? 'відкріплена' : `закріплена ${payload.position === 'left' ? 'зліва' : 'справа'}`;

    console.log(`${emoji} Колонка "${payload.column.label}" ${action}`);
    console.log('Full payload:', payload);
    console.groupEnd();
  };
  const columnResizeMethod = (payload: { column; width: number; oldWidth?: number }) => {
    console.group('📏 Column Resize Event');
    console.log('Column:', payload.column.label, `(${payload.column.prop})`);
    console.log('Old Width:', payload.oldWidth ? `${payload.oldWidth}px` : 'auto');
    console.log('New Width:', `${payload.width}px`);

    if (payload.oldWidth) {
      const difference = payload.width - payload.oldWidth;
      const changeType = difference > 0 ? 'збільшена' : 'зменшена';
      const emoji = difference > 0 ? '📈' : '📉';
      console.log(`${emoji} Ширина ${changeType} на ${Math.abs(difference)}px`);
    }

    console.log(`📐 Колонка "${payload.column.label}": ${payload.oldWidth || 'auto'}px → ${payload.width}px`);
    console.log('Full payload:', payload);
    console.groupEnd();
  };

  const columnVisibilityMethod = (payload: { column }) => {
    console.group('👁️ Column Visibility Event');
    console.log('Column:', payload.column.label, `(${payload.column.prop})`);

    // Припускаємо, що в payload.column є поле visible або можемо його визначити
    const isVisible = payload.column.visible !== false;
    const emoji = isVisible ? '👁️' : '👁️‍🗨️';
    const action = isVisible ? 'показана' : 'прихована';

    console.log(`${emoji} Колонка "${payload.column.label}" ${action}`);
    console.log('Visibility state:', isVisible);
    console.log('Column properties:', {
      prop: payload.column.prop,
      label: payload.column.label,
      width: payload.column.width,
      sortable: payload.column.sortable,
      visible: isVisible,
    });
    console.log('Full payload:', payload);
    console.groupEnd();
  };
  const columnChangeMethod = columns => {
    console.group('🔄 Columns Change Event');
    console.log('Total columns:', columns);
    console.groupEnd();
  };

  const highlightTableData = ref([
    {
      id: 1,
      name: 'Олексій Петренко',
      status: 'active',
      priority: 'high',
      salary: 55000,
      department: 'IT',
      isVip: false,
    },
    {
      id: 2,
      name: 'Марія Коваленко',
      status: 'inactive',
      priority: 'medium',
      salary: 45000,
      department: 'HR',
      isVip: false,
    },
    {
      id: 3,
      name: 'Іван Шевченко',
      status: 'pending',
      priority: 'low',
      salary: 40000,
      department: 'Marketing',
      isVip: false,
    },
    {
      id: 4,
      name: 'Анна Мельник',
      status: 'active',
      priority: 'medium',
      salary: 60000,
      department: 'Finance',
      isVip: true,
    },
    {
      id: 5,
      name: 'Петро Сидоренко',
      status: 'error',
      priority: 'critical',
      salary: 35000,
      department: 'Support',
      isVip: false,
    },
  ]);

  const highlightFunction = (row, index) => {
    // VIP клієнти мають найвищий пріоритет
    if (row.isVip) {
      return {
        type: 'custom',
        className: 'vip-customer',
      };
    }

    // Підсвічування за статусом
    if (row.status === 'active') {
      return { type: 'success' };
    }

    if (row.status === 'inactive') {
      return { type: 'danger' };
    }

    if (row.status === 'pending') {
      return { type: 'warning' };
    }

    // Підсвічування за пріоритетом
    if (row.priority === 'critical') {
      return { type: 'default' };
    }

    return null;
  };
</script>

<template>
  <div class="container">
    <!-- Дефолтна таблиця-->
    <div class="container-item">
      <div class="container-item-table">
        <h3>Дефолтна таблиця</h3>
        <div class="table-block">
          <VTable :data="currentPageData.slice(0, 5)">
            <VTableColumn label="ID" prop="id" width="150" />
            <VTableColumn label="Ім'я" prop="name">
              <template #name="{ row }">
                <VInput v-model="row.name" />
              </template>
            </VTableColumn>
            <!--            <VTableColumn :min-width="120" label="Статус" prop="status" />-->
            <!--            <VTableColumn :min-width="150" label="Дата" prop="date" />-->
            <VTableColumn :width="60" label="Рахунок" prop="score" />
          </VTable>
        </div>
      </div>
      <div class="container-item-example">
        <h3 :class="{ collapsed: codeCollapsed.defaultTable }" @click="toggleCode('defaultTable')"> Код </h3>
        <div :class="{ collapsed: codeCollapsed.defaultTable }" class="container-item-code">
          <pre class="code"><code>&lt;VTable :data="dataTable"&gt;
  &lt;VTableColumn prop="id" label="ID" /&gt;
  &lt;VTableColumn prop="name" label="Ім'я"&gt;
    &lt;template #name="{ row }"&gt;
      &lt;div style="color: #0c5460"&gt;
        row.name
      &lt;/div&gt;
    &lt;/template&gt;
  &lt;/VTableColumn&gt;
  &lt;VTableColumn prop="status" label="Статус" /&gt;
  &lt;VTableColumn prop="date" label="Дата" /&gt;
  &lt;VTableColumn prop="score" label="Рахунок" /&gt;
&lt;/VTable&gt;</code></pre>
        </div>
      </div>
    </div>

    <!-- Таблиця з пагінацією та розширеним виділенням -->
    <div class="container-item">
      <div class="container-item-table">
        <h3>Таблиця з пагінацією та розширеним виділенням + summary-row</h3>

        <!-- Інформація про стан виділення -->
        <div class="selection-status">
          <div><strong>Стан виділення:</strong> {{ selectionStatus }}</div>
          <div><strong>Виділено на сторінці:</strong> {{ visibleSelectedCount }} з {{ currentPageData.length }}</div>
          <div><strong>Всього виділено:</strong> {{ selectedCount }} з {{ totalItems }}</div>
          <div v-if="isFullSelection"><strong>🎯 Виділені абсолютно всі записи!</strong></div>
          <div v-if="loading" style="color: #f59e0b"><strong>⏳ Завантажуємо дані...</strong></div>
        </div>

        <!-- Інформація про виділення -->
        <div v-if="selectedRows.length > 0" class="selection-info">
          <strong>Виділено рядків: {{ selectedRows.length }}</strong>
          <div style="margin-top: 5px">
            IDS:
            {{
              selectedRows
                .map(r => r.id)
                .slice(0, 5)
                .join(', ')
            }}
          </div>
        </div>

        <div class="table-block">
          <VTable
            ref="tableRef"
            :all-data="[]"
            :data="currentPageData"
            :max-height="400"
            :summary-method="getSummaries"
            selectable
            selection-key="id"
            show-summary
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
            @sort-change="handleTableSort"
            @columns-change="handleColumnsChange"
          >
            <VTableColumn label="ID" prop="id" />
            <VTableColumn label="Ім'я" pinned-left prop="name">
              <template #name="{ row }">
                <div style="color: #0c5460; font-weight: 600">
                  {{ row.name }}
                </div>
              </template>
            </VTableColumn>
            <VTableColumn label="Статус" prop="status">
              <template #status="{ row }">
                <span :class="`status-${row.status}`" class="status-badge">
                  {{ getStatusLabel(row.status) }}
                </span>
              </template>
            </VTableColumn>
            <VTableColumn label="Дата" prop="date" />
            <VTableColumn label="Рахунок" prop="score">
              <template #score="{ row }">
                <div class="score-cell">
                  <div class="score-bar">
                    <div :style="{ width: `${row.score}%` }" class="score-fill"></div>
                  </div>
                  <span class="score-text">{{ row.score }}</span>
                </div>
              </template>
            </VTableColumn>
          </VTable>
        </div>

        <!-- Пагінація -->
        <div class="pagination-container">
          <VPagination
            :current-page="currentPage"
            :page-size="pageSize"
            :page-size-options="[5, 10, 15, 20]"
            :total-items="totalItems"
            @update:current-page="handlePageChange"
            @update:page-size="handlePageSizeChange"
            @page-change="handlePaginationChange"
          />
        </div>
      </div>

      <div class="container-item-example">
        <h3 :class="{ collapsed: codeCollapsed.paginatedTable }" @click="toggleCode('paginatedTable')"> Код </h3>
        <div :class="{ collapsed: codeCollapsed.paginatedTable }" class="container-item-code">
          <pre class="code"><code>&lt;!-- Кнопки управління --&gt;
&lt;div class="table-controls"&gt;
  &lt;button @click="selectAll"&gt;Виділити всі на сторінці&lt;/button&gt;
  &lt;button @click="selectAbsolutelyAll" :disabled="!canSelectAll"&gt;
    Виділити абсолютно всі ({{ totalItems }})
  &lt;/button&gt;
  &lt;button @click="clearAll"&gt;Зняти виділення&lt;/button&gt;
&lt;/div&gt;

&lt;!-- Таблиця --&gt;
&lt;VTable
  ref="tableRef"
  :data="currentPageData"
  selectable
  select-on-click-row
  highlight-current-row
  show-summary
  :summary-method="getSummaries"
  @selection-change="handleSelectionChange"
  @row-click="handleRowClick"
&gt;
  &lt;VTableColumn prop="id" label="ID" /&gt;
  &lt;VTableColumn prop="name" label="Ім'я" /&gt;
  &lt;VTableColumn prop="status" label="Статус" /&gt;
  &lt;VTableColumn prop="date" label="Дата" /&gt;
  &lt;VTableColumn prop="score" label="Рахунок" /&gt;
&lt;/VTable&gt;

&lt;!-- Пагінація --&gt;
&lt;VPagination
  :total-items="totalItems"
  :page-size="pageSize"
  :current-page="currentPage"
  @update:current-page="handlePageChange"
  @update:page-size="handlePageSizeChange"
/&gt;

// JavaScript логіка
const loadPageData = async (page: number) =&gt; {
  loading.value = true;
  try {
    const data = await fetchPageData(page, pageSize.value);
    pageCache.value[page] = data;
    currentPageData.value = data;
  } finally {
    loading.value = false;
  }
};

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
</code></pre>
        </div>
      </div>
    </div>

    <!-- Управління колонками таблиці -->
    <div class="container-item">
      <div class="container-item-table">
        <h3>Управління колонками таблиці</h3>
        <div class="table-block">
          <VTable
            :columns-selector="columnGroups"
            :data="sampleColumnData"
            @column-pin="columnPinMethod"
            @column-resize="columnResizeMethod"
            @column-visibility="columnVisibilityMethod"
            @columns-change="columnChangeMethod"
          >
            <VTableColumn label="ID" prop="id" />
            <VTableColumn label="Ім'я" prop="name">
              <template #name="{ row }">
                <div style="color: #0c5460">
                  {{ row.name }}
                </div>
              </template>
            </VTableColumn>
            <VTableColumn label="Email" prop="email" />
          </VTable>
        </div>
      </div>
      <div class="container-item-example">
        <h3 :class="{ collapsed: codeCollapsed.columnActionTable }" @click="toggleCode('columnActionTable')"> Код </h3>
        <div :class="{ collapsed: codeCollapsed.columnActionTable }" class="container-item-code">
          <pre class="code">
&lt;template&gt;
  &lt;VTable
    :data="sampleColumnData"
    :columns-selector="columnGroups"
    @column-pin="columnPinMethod"
    @column-resize="columnResizeMethod"
    @column-visibility="columnVisibilityMethod"
    @columns-change="columnChangeMethod"
  &gt;
    &lt;VTableColumn prop="id" label="ID" /&gt;
    &lt;VTableColumn prop="name" label="Ім'я"&gt;
      &lt;template #name="{ row }"&gt;
        &lt;div style="color: #0c5460"&gt;
          &#123;&#123; row.name &#125;&#125;
        &lt;/div&gt;
      &lt;/template&gt;
    &lt;/VTableColumn&gt;
    &lt;VTableColumn prop="email" label="Email" /&gt;
  &lt;/VTable&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const columnGroups = [
  {
    name: 'basic',
    label: 'Основна інформація',
    order: 1,
    icon: 'prompter',
    color: '#3b82f6',
    columns: [
      { prop: 'id', label: 'ID', width: 80, sortable: true, pinnedLeft: true, showOverflowTooltip: false },
      { prop: 'name', label: "Ім'я", width: 150, sortable: true, showOverflowTooltip: true },
      { prop: 'email', label: 'Email', width: 200, sortable: true, showOverflowTooltip: true },
      { prop: 'phone', label: 'Телефон', width: 120, sortable: false, showOverflowTooltip: true },
    ],
  },
  {
    name: 'status',
    label: 'Статус і стан',
    order: 2,
    icon: 'usersGroup',
    color: '#10b981',
    columns: [
      { prop: 'status', label: 'Статус', width: 120, sortable: true, showOverflowTooltip: false },
      { prop: 'isActive', label: 'Активний', width: 80, sortable: true, showOverflowTooltip: false },
      { prop: 'lastLogin', label: 'Останній вхід', width: 140, sortable: true, showOverflowTooltip: true },
      { prop: 'onlineStatus', label: 'Онлайн', width: 90, sortable: true, showOverflowTooltip: false },
    ],
  },
  {
    name: 'financial',
    label: 'Фінансова інформація',
    order: 3,
    icon: 'filterAdvanced',
    color: '#f59e0b',
    columns: [
      { prop: 'balance', label: 'Баланс', width: 100, sortable: true, showOverflowTooltip: false },
      { prop: 'totalSpent', label: 'Витрачено', width: 110, sortable: true, showOverflowTooltip: false },
      { prop: 'creditLimit', label: 'Кредитний ліміт', width: 130, sortable: true, showOverflowTooltip: false },
      { prop: 'paymentMethod', label: 'Спосіб оплати', width: 140, sortable: false, showOverflowTooltip: true },
    ],
  },
  {
    name: 'analytics',
    label: 'Аналітика',
    order: 4,
    icon: 'filterMultiselect',
    color: '#8b5cf6',
    columns: [
      { prop: 'score', label: 'Рейтинг', width: 100, sortable: true, showOverflowTooltip: false },
      { prop: 'visits', label: 'Відвідувань', width: 100, sortable: true, showOverflowTooltip: false },
      { prop: 'conversionRate', label: 'Конверсія %', width: 120, sortable: true, showOverflowTooltip: false },
      { prop: 'avgSessionTime', label: 'Сер. час сесії', width: 140, sortable: true, showOverflowTooltip: true },
    ],
  },
  {
    name: 'location',
    label: 'Місцезнаходження',
    order: 5,
    icon: 'excel',
    color: '#ef4444',
    columns: [
      { prop: 'country', label: 'Країна', width: 100, sortable: true, showOverflowTooltip: true },
      { prop: 'city', label: 'Місто', width: 120, sortable: true, showOverflowTooltip: true },
      { prop: 'timezone', label: 'Часовий пояс', width: 130, sortable: false, showOverflowTooltip: true },
      { prop: 'coordinates', label: 'Координати', width: 150, sortable: false, showOverflowTooltip: true },
    ],
  },
  {
    name: 'dates',
    label: 'Дати',
    order: 6,
    icon: 'filterDateCheck',
    color: '#06b6d4',
    columns: [
      { prop: 'createdAt', label: 'Дата створення', width: 140, sortable: true, showOverflowTooltip: true },
      { prop: 'updatedAt', label: 'Останнє оновлення', width: 150, sortable: true, showOverflowTooltip: true },
      { prop: 'birthDate', label: 'Дата народження', width: 140, sortable: true, showOverflowTooltip: false },
      { prop: 'expiresAt', label: 'Термін дії', width: 120, sortable: true, showOverflowTooltip: true },
    ],
  },
  {
    name: 'actions',
    label: 'Дії',
    order: 7,
    icon: 'prompt',
    color: '#64748b',
    columns: [
      { prop: 'actions', label: 'Дії', width: 120, sortable: false, pinnedRight: true, actionColumn: true, showOverflowTooltip: false },
    ],
  },
];

const sampleColumnData = ref([
  {
    id: 1,
    name: 'Олексій Петренко',
    email: 'oleksiy@example.com',
    phone: '+380501234567',
    status: 'active',
    isActive: true,
    lastLogin: '2024-08-14 10:30:00',
    onlineStatus: 'online',
    balance: 1500.5,
    totalSpent: 3200.0,
    creditLimit: 5000.0,
    paymentMethod: 'Visa ****1234',
    score: 95,
    visits: 142,
    conversionRate: 15.2,
    avgSessionTime: '00:12:45',
    country: 'Україна',
    city: 'Київ',
    timezone: 'Europe/Kiev',
    coordinates: '50.4501, 30.5234',
    createdAt: '2023-01-15',
    updatedAt: '2024-08-14',
    birthDate: '1990-05-20',
    expiresAt: '2025-01-15',
  },
]);

const columnPinMethod = (payload) => {
  console.group('📌 Column Pin Event');
  console.log('Column:', payload.column.label, `(${payload.column.prop})`);
  console.log('Position:', payload.position);
  console.log('Previous state:', {
    pinnedLeft: payload.column.pinnedLeft,
    pinnedRight: payload.column.pinnedRight,
  });
  const emoji = payload.position === 'left' ? '⬅️' : payload.position === 'right' ? '➡️' : '📌❌';
  const action = payload.position === 'none' ? 'відкріплена' : `закріплена ${payload.position === 'left' ? 'зліва' : 'справа'}`;
  console.log(`${emoji} Колонка "${payload.column.label}" ${action}`);
  console.log('Full payload:', payload);
  console.groupEnd();
};

const columnResizeMethod = (payload) => {
  console.group('📏 Column Resize Event');
  console.log('Column:', payload.column.label, `(${payload.column.prop})`);
  console.log('Old Width:', payload.oldWidth ? `${payload.oldWidth}px` : 'auto');
  console.log('New Width:', `${payload.width}px`);
  if (payload.oldWidth) {
    const difference = payload.width - payload.oldWidth;
    const changeType = difference > 0 ? 'збільшена' : 'зменшена';
    const emoji = difference > 0 ? '📈' : '📉';
    console.log(`${emoji} Ширина ${changeType} на ${Math.abs(difference)}px`);
  }
  console.log(`📐 Колонка "${payload.column.label}": ${payload.oldWidth || 'auto'}px → ${payload.width}px`);
  console.log('Full payload:', payload);
  console.groupEnd();
};

const columnVisibilityMethod = (payload) => {
  console.group('👁️ Column Visibility Event');
  console.log('Column:', payload.column.label, `(${payload.column.prop})`);
  const isVisible = payload.column.visible !== false;
  const emoji = isVisible ? '👁️' : '👁️‍🗨️';
  const action = isVisible ? 'показана' : 'прихована';
  console.log(`${emoji} Колонка "${payload.column.label}" ${action}`);
  console.log('Visibility state:', isVisible);
  console.log('Column properties:', {
    prop: payload.column.prop,
    label: payload.column.label,
    width: payload.column.width,
    sortable: payload.column.sortable,
    visible: isVisible,
  });
  console.log('Full payload:', payload);
  console.groupEnd();
};

const columnChangeMethod = (columns) => {
  console.group('🔄 Columns Change Event');
  console.log('Total columns:', columns);
  console.groupEnd();
};
&lt;/script&gt;
  </pre
          >
        </div>
      </div>
    </div>

    <div class="container-item">
      <div class="container-item-table">
        <h3>Підсвічування рядків таблиці</h3>
        <div class="table-block">
          <VTable :data="highlightTableData" :max-height="400" :row-highlight="highlightFunction">
            <VTableColumn label="ID" prop="id" />
            <VTableColumn label="Ім'я" prop="name">
              <template #name="{ row }">
                <div style="font-weight: 600">
                  {{ row.name }}
                </div>
              </template>
            </VTableColumn>
            <VTableColumn label="Статус" prop="status">
              <template #status="{ row }">
                <span :class="`status-${row.status}`" class="status-badge">
                  {{ getStatusLabel(row.status) }}
                </span>
              </template>
            </VTableColumn>
            <VTableColumn label="Пріоритет" prop="priority">
              <template #priority="{ row }">
                <span :class="`priority-${row.priority}`" class="priority-badge">
                  {{ row.priority }}
                </span>
              </template>
            </VTableColumn>
            <VTableColumn label="Зарплата" prop="salary">
              <template #salary="{ row }">
                <div class="salary-cell"> ${{ row.salary.toLocaleString() }}</div>
              </template>
            </VTableColumn>
            <VTableColumn label="Відділ" prop="department" />
          </VTable>
        </div>

        <div>
          export type VTableRowHighlightType = 'default' | 'success' | 'warning' | 'danger' | 'custom'; export interface
          VTableRowHighlight { type: VTableRowHighlightType; className?: string; // для кастомних стилів }
        </div>
      </div>
      <div class="container-item-example">
        <h3 :class="{ collapsed: codeCollapsed.highlightTable }" @click="toggleCode('highlightTable')"> Код </h3>
        <div :class="{ collapsed: codeCollapsed.highlightTable }" class="container-item-code">
          <pre class="code"><code>&lt;template&gt;
  &lt;VTable
    :data="highlightTableData"
    :row-highlight="highlightFunction"
  &gt;
    &lt;VTableColumn prop="id" label="ID" /&gt;
    &lt;VTableColumn prop="name" label="Ім'я" /&gt;
    &lt;VTableColumn prop="status" label="Статус" /&gt;
    &lt;VTableColumn prop="priority" label="Пріоритет" /&gt;
    &lt;VTableColumn prop="salary" label="Зарплата" /&gt;
    &lt;VTableColumn prop="department" label="Відділ" /&gt;
  &lt;/VTable&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue';

// Дані з різними статусами для демонстрації
const highlightTableData = ref([
  {
    id: 1,
    name: 'Олексій Петренко',
    status: 'active',
    priority: 'high',
    salary: 55000,
    department: 'IT',
    isVip: false
  },
  {
    id: 2,
    name: 'Марія Коваленко',
    status: 'inactive',
    priority: 'medium',
    salary: 45000,
    department: 'HR',
    isVip: false
  },
  {
    id: 3,
    name: 'Іван Шевченко',
    status: 'pending',
    priority: 'low',
    salary: 40000,
    department: 'Marketing',
    isVip: false
  },
  {
    id: 4,
    name: 'Анна Мельник',
    status: 'active',
    priority: 'medium',
    salary: 60000,
    department: 'Finance',
    isVip: true // VIP клієнт
  },
  {
    id: 5,
    name: 'Петро Сидоренко',
    status: 'error',
    priority: 'critical',
    salary: 35000,
    department: 'Support',
    isVip: false
  }
]);

// Функція підсвічування рядків
const highlightFunction = (row, index) => {
  // VIP клієнти мають найвищий пріоритет
  if (row.isVip) {
    return {
      type: 'custom',
      className: 'vip-customer'
    };
  }

  // Підсвічування за статусом
  if (row.status === 'active') {
    return { type: 'success' };
  }

  if (row.status === 'inactive' || row.status === 'error') {
    return { type: 'danger' };
  }

  if (row.status === 'pending') {
    return { type: 'warning' };
  }

  // Підсвічування за пріоритетом
  if (row.priority === 'high' || row.priority === 'critical') {
    return { type: 'info' };
  }

  return null;
};
&lt;/script&gt;

&lt;style lang="scss"&gt;
// Стилі для підсвічування рядків
:deep(.vt-table__row) {
  &--highlight-success {
    background-color: #e8f5e8;
    border-left: 3px solid #4caf50;
  }

  &--highlight-danger {
    background-color: #ffebee;
    border-left: 3px solid #f44336;
  }

  &--highlight-warning {
    background-color: #fff8e1;
    border-left: 3px solid #ff9800;
  }

  &--highlight-info {
    background-color: #e3f2fd;
    border-left: 3px solid #2196f3;
  }
}

// Кастомний стиль для VIP клієнтів
 .vip-customer {
    background: linear-gradient(45deg, #ffd700, #ffed4a);
    border-left: 4px solid #f59e0b;
    font-weight: 600;
  }
&lt;/style&gt;</code></pre>
        </div>
      </div>
    </div>

    <!-- Властивості -->
    <section class="section">
      <h2>Властивості</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Опис</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>data</code></td>
              <td><code>Record&lt;string, any&gt;[]</code></td>
              <td>-</td>
              <td>Масив даних для відображення в таблиці</td>
            </tr>
            <tr>
              <td><code>columns</code></td>
              <td><code>VTableColumnProps[]</code></td>
              <td>-</td>
              <td>Конфігурація колонок</td>
            </tr>
            <tr>
              <td><code>maxHeight</code></td>
              <td><code>number</code></td>
              <td>-</td>
              <td>Максимальна висота таблиці (для sticky header)</td>
            </tr>
            <tr>
              <td><code>rowKey</code></td>
              <td><code>string</code></td>
              <td>'id'</td>
              <td>Ключ для ідентифікації рядків</td>
            </tr>
            <tr>
              <td><code>defaultSort</code></td>
              <td><code>SortState</code></td>
              <td>-</td>
              <td>Початкове сортування</td>
            </tr>
            <tr>
              <td><code>showSummary</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Показувати підсумковий рядок</td>
            </tr>
            <tr>
              <td><code>summaryMethod</code></td>
              <td><code>Function</code></td>
              <td>-</td>
              <td>Метод для обчислення підсумкових значень</td>
            </tr>
            <tr>
              <td><code>columnsSelector</code></td>
              <td><code>VTableColumnGroup[]</code></td>
              <td>-</td>
              <td>Групи колонок для селектора</td>
            </tr>
            <tr>
              <td><code>selectable</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Чи включити функціонал виділення рядків</td>
            </tr>
            <tr>
              <td><code>selectionKey</code></td>
              <td><code>string</code></td>
              <td>'id'</td>
              <td>Ключ для ідентифікації рядків при виділенні</td>
            </tr>
            <tr>
              <td><code>defaultSelection</code></td>
              <td><code>any[]</code></td>
              <td>-</td>
              <td>Рядки виділені за замовчуванням</td>
            </tr>
            <tr>
              <td><code>selectOnClickRow</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Виділяти рядок при кліку на нього</td>
            </tr>
            <tr>
              <td><code>highlightCurrentRow</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Підсвічувати поточний рядок</td>
            </tr>
            <tr>
              <td><code>allData</code></td>
              <td><code>Record&lt;string, any&gt;[]</code></td>
              <td>-</td>
              <td>Всі дані для повного виділення (якщо відрізняються від data)</td>
            </tr>
            <tr>
              <td>
                <code>hideHeader</code>
              </td>
              <td>
                <code>boolean</code>
              </td>
              <td> false</td>
              <td> Приховує повністю хедер таблиці</td>
            </tr>

            <tr>
              <td><code>rowHighlight</code></td>
              <td><code>Function</code></td>
              <td>-</td>
              <td>Метод для підсвічування поточного рядка</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Властивості колонки -->
    <section class="section">
      <h2>Властивості колонки (VTableColumnProps)</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Опис</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>prop</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>Ключ властивості в даних</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>Заголовок колонки</td>
            </tr>
            <tr>
              <td><code>width</code></td>
              <td><code>number</code></td>
              <td>-</td>
              <td>Фіксована ширина колонки</td>
            </tr>
            <tr>
              <td><code>minWidth</code></td>
              <td><code>number</code></td>
              <td>-</td>
              <td>Мінімальна ширина колонки</td>
            </tr>
            <tr>
              <td><code>maxWidth</code></td>
              <td><code>number</code></td>
              <td>-</td>
              <td>Максимальна ширина колонки</td>
            </tr>
            <tr>
              <td><code>sortable</code></td>
              <td><code>boolean</code></td>
              <td>true</td>
              <td>Чи можна сортувати колонку</td>
            </tr>
            <tr>
              <td><code>pinnedLeft</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Закріпити колонку ліворуч</td>
            </tr>
            <tr>
              <td><code>pinnedRight</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Закріпити колонку праворуч</td>
            </tr>
            <tr>
              <td><code>actionColumn</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Чи є колонка колонкою дій</td>
            </tr>
            <tr>
              <td><code>showOverflowTooltip</code></td>
              <td><code>boolean</code></td>
              <td>true</td>
              <td>Показувати tooltip при переповненні</td>
            </tr>
            <tr>
              <td><code>selectable</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Чи є колонка колонкою виділення</td>
            </tr>
            <tr>
              <td><code>renderSlot</code></td>
              <td><code>VTableRenderSlot</code></td>
              <td>-</td>
              <td>Функція для кастомного рендерингу</td>
            </tr>
            <tr>
              <td><code>sortMethod</code></td>
              <td><code>Function</code></td>
              <td>-</td>
              <td>Кастомний метод сортування</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Події -->
    <section class="section">
      <h2>Події</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>Опис</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>sort-change</code></td>
              <td><code>SortChangeEventData</code></td>
              <td>Зміна сортування</td>
            </tr>
            <tr>
              <td><code>selection-change</code></td>
              <td><code>SelectionChangeEventData</code></td>
              <td>Зміна виділення рядків</td>
            </tr>
            <tr>
              <td><code>current-change</code></td>
              <td><code>{ currentRow, oldCurrentRow }</code></td>
              <td>Зміна поточного рядка</td>
            </tr>
            <tr>
              <td><code>row-click</code></td>
              <td><code>{ row, column, event }</code></td>
              <td>Клік по рядку</td>
            </tr>
            <tr>
              <td><code>update:columns</code></td>
              <td><code>VTableColumnProps[]</code></td>
              <td>Оновлення конфігурації колонок</td>
            </tr>
            <tr>
              <td><code>column-pin</code></td>
              <td><code>{ column, position }</code></td>
              <td>Закріплення колонки</td>
            </tr>
            <tr>
              <td><code>column-resize</code></td>
              <td><code>{ column, width, oldWidth }</code></td>
              <td>Зміна розміру колонки</td>
            </tr>
            <tr>
              <td><code>column-visibility</code></td>
              <td><code>{ column }</code></td>
              <td>Зміна видимості колонки</td>
            </tr>
            <tr>
              <td><code>column-sort</code></td>
              <td><code>{ column, direction }</code></td>
              <td>Сортування колонки</td>
            </tr>
            <tr>
              <td><code>columns-change</code></td>
              <td><code>VTableColumnProps[]</code></td>
              <td>Загальні зміни в колонках</td>
            </tr>
            <tr>
              <td><code>infinity-scroll</code></td>
              <td>-</td>
              <td>Досягнення кінця скролу</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Типи даних -->
    <section class="section">
      <h2>Типи даних</h2>

      <div class="card">
        <h3>SortState</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Властивість</th>
                <th>Type</th>
                <th>Опис</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>prop</code></td>
                <td><code>string</code></td>
                <td>Ключ колонки для сортування</td>
              </tr>
              <tr>
                <td><code>direction</code></td>
                <td><code>'asc' | 'desc'</code></td>
                <td>Напрямок сортування</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3>SortChangeEventData</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Властивість</th>
                <th>Type</th>
                <th>Опис</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>column</code></td>
                <td><code>VTableColumnProps</code></td>
                <td>Колонка, по якій сортують</td>
              </tr>
              <tr>
                <td><code>direction</code></td>
                <td><code>SortDirection | null</code></td>
                <td>Напрямок сортування</td>
              </tr>
              <tr>
                <td><code>prop</code></td>
                <td><code>string</code></td>
                <td>Ключ властивості</td>
              </tr>
              <tr>
                <td><code>sortedData</code></td>
                <td><code>Record&lt;string, any&gt;[]</code></td>
                <td>Відсортовані дані</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3>SelectionChangeEventData</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Властивість</th>
                <th>Type</th>
                <th>Опис</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>selection</code></td>
                <td><code>Record&lt;string, any&gt;[]</code></td>
                <td>Масив виділених рядків</td>
              </tr>
              <tr>
                <td><code>row</code></td>
                <td><code>Record&lt;string, any&gt;</code></td>
                <td>Рядок, який змінився (опціонально)</td>
              </tr>
              <tr>
                <td><code>selected</code></td>
                <td><code>boolean</code></td>
                <td>Чи виділений рядок (опціонально)</td>
              </tr>
              <tr>
                <td><code>isAllSelected</code></td>
                <td><code>boolean</code></td>
                <td>Чи виділені всі рядки (опціонально)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3>VTableColumnGroup</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Властивість</th>
                <th>Type</th>
                <th>Опис</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>name</code></td>
                <td><code>string</code></td>
                <td>Унікальне ім'я групи</td>
              </tr>
              <tr>
                <td><code>label</code></td>
                <td><code>string</code></td>
                <td>Відображуваний заголовок групи</td>
              </tr>
              <tr>
                <td><code>order</code></td>
                <td><code>number</code></td>
                <td>Порядок відображення групи</td>
              </tr>
              <tr>
                <td><code>icon</code></td>
                <td><code>IconName</code></td>
                <td>Іконка групи (опціонально)</td>
              </tr>
              <tr>
                <td><code>color</code></td>
                <td><code>string</code></td>
                <td>Колір групи (опціонально)</td>
              </tr>
              <tr>
                <td><code>columns</code></td>
                <td><code>VTableColumnProps[]</code></td>
                <td>Колонки в групі</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    gap: 3rem;
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    min-height: 100vh;

    &-item {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      align-items: flex-start;

      @media (max-width: 1024px) {
        flex-direction: column;
      }

      &-table {
        flex: 1;
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow:
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid rgba(226, 232, 240, 0.8);
        transition: all 0.3s ease;
        width: 100%;

        h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 0.5rem;
          display: inline-block;
        }
      }

      &-example {
        flex: 1;
        background: #1e293b;
        border-radius: 16px;
        padding: 2rem;
        box-shadow:
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid #334155;
        width: 100%;

        h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #f1f5f9;
          border-bottom: 3px solid #10b981;
          padding-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.3s ease;
          user-select: none;

          &:hover {
            color: #10b981;
          }

          &::after {
            content: '▼';
            font-size: 1rem;
            color: #64748b;
            transition: all 0.3s ease;
            transform-origin: center;
          }

          &.collapsed::after {
            transform: rotate(-90deg);
            color: #94a3b8;
          }
        }
      }

      &-code {
        border-radius: 12px;
        overflow: auto;
        background: #0f172a;
        border: 1px solid #334155;
        position: relative;
        max-height: 500px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

        &.collapsed {
          max-height: 0;
          opacity: 0;
          border: none;
          margin-top: -1.5rem;
          padding: 0;
        }

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(90deg, #1e293b 0%, #334155 100%);
          border-bottom: 1px solid #475569;
        }

        &::after {
          content: '⬤ ⬤ ⬤';
          position: absolute;
          top: 12px;
          left: 16px;
          color: #64748b;
          font-size: 12px;
          z-index: 1;
        }
      }
    }
  }

  .table-block {
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: white;

    :deep(.v-table) {
      width: 100%;
      border-collapse: collapse;

      th {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        font-weight: 600;
        padding: 1rem;
        text-align: left;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border: none;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
        }

        &:first-child {
          border-top-left-radius: 12px;
        }

        &:last-child {
          border-top-right-radius: 12px;
        }
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid #f1f5f9;
        color: #475569;
        font-size: 0.875rem;
        transition: all 0.2s ease;

        &:first-child {
          font-weight: 600;
          color: #1e293b;
        }
      }

      tbody tr {
        transition: all 0.2s ease;

        &:nth-child(even) {
          background-color: #f8fafc;
        }

        &:hover {
          background-color: #e0f2fe;
          transform: scale(1.01);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        &:last-child td {
          border-bottom: none;
        }
      }
    }
  }

  .table-controls {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;

    .control-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
      }

      &:active {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
    }
  }

  .selection-status {
    margin-bottom: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    color: #0c4a6e;
    font-size: 0.875rem;

    div {
      margin-bottom: 0.25rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .selection-info {
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    color: #0c4a6e;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;

    &.status-active {
      background-color: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    &.status-inactive {
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    &.status-pending {
      background-color: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }

    &.status-blocked {
      background-color: #f3e8ff;
      color: #6b21a8;
      border: 1px solid #e9d5ff;
    }
  }

  .score-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .score-bar {
    flex: 1;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .score-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .score-text {
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
    min-width: 2rem;
    text-align: right;
  }

  .pagination-container {
    margin-top: 1.5rem;
  }

  .debug-info {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--color-gray-7);
    border-radius: 8px;
    font-size: 0.75rem;
    color: #6b7280;
    border: 1px solid #d1d5db;
  }

  .code {
    background: #0f172a;
    color: #e2e8f0;
    padding: 2.5rem 1.5rem 1.5rem;
    margin: 0;
    font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    overflow-x: auto;
    border-radius: 12px;
    position: relative;

    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #1e293b;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #475569;
      border-radius: 4px;

      &:hover {
        background: #64748b;
      }
    }
  }

  // Адаптивність
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
      gap: 2rem;

      &-item {
        gap: 1.5rem;

        &-table,
        &-example {
          padding: 1.5rem;
        }
      }
    }

    .table-block {
      overflow-x: auto;

      :deep(.v-table) {
        min-width: 600px;

        th,
        td {
          padding: 0.75rem 0.5rem;
          font-size: 0.8rem;
        }
      }
    }

    .table-controls {
      .control-btn {
        font-size: 0.75rem;
        padding: 0.4rem 0.8rem;
      }
    }

    .code {
      font-size: 0.75rem;
      padding: 2rem 1rem 1rem;
    }
  }

  // Анімації завантаження
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .container-item {
    animation: fadeIn 0.6s ease-out;

    &:nth-child(even) {
      animation-delay: 0.1s;
    }
  }

  // Додаткові стилі для загрузки
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    z-index: 100;

    .loading-spinner {
      width: 2rem;
      height: 2rem;
      border: 3px solid #e2e8f0;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  section {
    margin-bottom: 3rem;
  }

  .section h2 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
  }

  .card {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .card h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .demo-item {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    transition: all 0.2s;
  }

  .demo-item:hover {
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
  }

  .demo-item h4 {
    color: #2c3e50;
    margin-bottom: 0.8rem;
    font-size: 1rem;
  }

  .buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    background: #ffffff;
  }

  .table th,
  .table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e1e8ed;
  }

  .table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }

  .table code {
    background: #f1f3f4;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    color: #d63384;
  }

  .code {
    position: relative;
    display: block;
    background: #2d3748;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    overflow-x: auto;
    cursor: pointer;
    margin: 1rem 0;
    white-space: pre;
  }

  .code:hover {
    background: #374151;
  }

  .copied {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #10b981;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
  }

  .example {
    margin-bottom: 2rem;
  }

  .example h3 {
    color: #2c3e50;
    margin-bottom: 0.8rem;
    font-size: 1.1rem;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .field label {
    display: block;
    margin-bottom: 0.3rem;
    font-weight: 500;
    color: #374151;
  }

  .field input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 1rem;
  }

  .field input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid #e1e8ed;
  }

  @media (max-width: 768px) {
    .showcase {
      padding: 1rem;
    }

    .demo-grid {
      grid-template-columns: 1fr;
    }

    .buttons {
      flex-direction: column;
    }

    .actions {
      flex-direction: column;
    }

    .table th,
    .table td {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  }

  .vip-customer {
    background: linear-gradient(45deg, #ffd700, #ffed4a);
    border-left: 4px solid #f59e0b;
    font-weight: 600;
  }
</style>
