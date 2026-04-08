<script lang="ts" setup>
  import { ref } from 'vue';
  import VTable from '@/components/table/VTable.vue';
  import VTableColumn from '@/components/table/VTableColumn.vue';
  import VPagination from '@/components/pagination/VPagination.vue';
  import VInput from '@/components/input/VInput.vue';
  import type { RowReorderEventData, SelectionChangeEventData } from '@/components/table/types';

  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  // ─── Пагінована таблиця ──────────────────────────────────────────────────────
  const tableRef = ref();
  const currentPage = ref(1);
  const pageSize = ref(10);
  const totalItems = ref(50);
  const loading = ref(false);
  const pageCache = ref<Record<number, any[]>>({});
  const currentPageData = ref<any[]>([]);
  const selectedRows = ref<any[]>([]);
  const isFullSelection = ref(false);

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
  ];
  const statuses = ['active', 'inactive', 'pending', 'blocked'];

  const fetchPageData = async (page: number, size: number) => {
    await new Promise(r => setTimeout(r, 500));
    const startId = (page - 1) * size + 1;
    return Array.from({ length: Math.min(size, totalItems.value - startId + 1) }, (_, i) => ({
      id: startId + i,
      name: names[(startId + i - 1) % names.length],
      status: statuses[(startId + i - 1) % statuses.length],
      date: `2024-${String(((startId + i) % 12) + 1).padStart(2, '0')}-15`,
      score: 60 + ((startId + i * 7) % 40),
    }));
  };

  const loadPageData = async (page: number) => {
    if (pageCache.value[page]) {
      currentPageData.value = pageCache.value[page];
      return;
    }
    loading.value = true;
    try {
      const data = await fetchPageData(page, pageSize.value);
      pageCache.value[page] = data;
      currentPageData.value = data;
    } finally {
      loading.value = false;
    }
  };

  const handlePageChange = (page: number) => {
    currentPage.value = page;
    loadPageData(page);
  };
  const handlePageSizeChange = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    pageCache.value = {};
    selectedRows.value = [];
    isFullSelection.value = false;
    loadPageData(1);
  };
  const handleSelectionChange = (data: SelectionChangeEventData) => {
    selectedRows.value = data.selection;
    isFullSelection.value = data.isAllSelected ?? false;
  };

  const getSummaries = ({ columns, data }: { columns: any[]; data: any[] }) =>
    columns.map(col => {
      if (!col.prop) return 'Σ';
      const vals = data.map(r => r[col.prop]);
      return vals.every(v => typeof v === 'number') ? vals.reduce((a, b) => a + b, 0) : 'N/A';
    });

  const getStatusLabel = (s: string) =>
    ({
      active: 'Активний',
      inactive: 'Неактивний',
      pending: 'В очікуванні',
      blocked: 'Заблокований',
    })[s] ?? s;

  loadPageData(1);

  // ─── Підсвічування ───────────────────────────────────────────────────────────
  const highlightData = ref([
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

  const highlightFunction = (row: any) => {
    if (row.isVip) return { type: 'custom', className: 'vip-row' };
    if (row.status === 'active') return { type: 'success' };
    if (row.status === 'inactive' || row.status === 'error') return { type: 'danger' };
    if (row.status === 'pending') return { type: 'warning' };
    return null;
  };

  // ─── Drag & Drop ─────────────────────────────────────────────────────────────
  const draggableData = ref([
    { id: 1, name: 'Іван Іванов', position: 'Розробник', salary: 50000, status: 'active' },
    { id: 2, name: 'Марія Петренко', position: 'Дизайнер', salary: 45000, status: 'active' },
    { id: 3, name: 'Олександр Сидоренко', position: 'Менеджер', salary: 55000, status: 'inactive' },
    { id: 4, name: 'Анна Коваленко', position: 'Аналітик', salary: 48000, status: 'active' },
    { id: 5, name: 'Дмитро Бондаренко', position: 'Тестувальник', salary: 42000, status: 'active' },
  ]);

  const handleRowReorder = (event: RowReorderEventData) => {
    draggableData.value = event.newData;
  };
  const formatSalary = (v: number) =>
    new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
    }).format(v);

  // ─── Управління колонками ─────────────────────────────────────────────────────
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
        { prop: 'status', label: 'Статус', width: 120, sortable: true },
        { prop: 'isActive', label: 'Активний', width: 80, sortable: true },
        { prop: 'lastLogin', label: 'Останній вхід', width: 140, sortable: true },
        { prop: 'onlineStatus', label: 'Онлайн', width: 90, sortable: true },
      ],
    },
    {
      name: 'actions',
      label: 'Дії',
      order: 3,
      icon: 'prompt',
      color: '#64748b',
      columns: [{ prop: 'actions', label: 'Дії', width: 120, sortable: false, pinnedRight: true, actionColumn: true }],
    },
  ];

  const columnData = ref([
    {
      id: 1,
      name: 'Олексій Петренко',
      email: 'oleksiy@example.com',
      phone: '+380501234567',
      status: 'active',
      isActive: true,
      lastLogin: '2024-08-14 10:30',
      onlineStatus: 'online',
    },
  ]);

  // ─── Документація ─────────────────────────────────────────────────────────────
  const vtableSections: TableSection[] = [
    {
      title: 'Props (VTable)',
      rows: [
        { name: 'data', type: 'Record<string, any>[]', default: '-', description: 'Дані для відображення' },
        { name: 'maxHeight', type: 'number', default: '-', description: 'Макс. висота (sticky header)' },
        { name: 'rowKey', type: 'string', default: "'id'", description: 'Ключ для ідентифікації рядків' },
        { name: 'selectable', type: 'boolean', default: 'false', description: 'Увімкнути виділення рядків' },
        { name: 'selectionKey', type: 'string', default: "'id'", description: 'Ключ для порівняння при виділенні' },
        { name: 'defaultSelection', type: 'any[]', default: '-', description: 'Рядки виділені за замовчуванням' },
        { name: 'selectOnClickRow', type: 'boolean', default: 'false', description: 'Виділяти рядок кліком' },
        { name: 'highlightCurrentRow', type: 'boolean', default: 'false', description: 'Підсвічувати поточний рядок' },
        { name: 'showSummary', type: 'boolean', default: 'false', description: 'Показувати підсумковий рядок' },
        { name: 'summaryMethod', type: 'Function', default: '-', description: 'Метод обчислення підсумків' },
        { name: 'rowHighlight', type: 'Function', default: '-', description: 'Функція підсвічування рядків' },
        {
          name: 'columnsSelector',
          type: 'VTableColumnGroup[]',
          default: '-',
          description: 'Групи колонок для селектора',
        },
        { name: 'allData', type: 'any[]', default: '-', description: 'Всі дані (для абсолютного виділення)' },
        { name: 'rowDraggable', type: 'boolean', default: 'false', description: 'Дозволити drag & drop рядків' },
        { name: 'showDragHandle', type: 'boolean', default: 'false', description: 'Показувати іконку перетягування' },
        { name: 'hideHeader', type: 'boolean', default: 'false', description: 'Приховати заголовок таблиці' },
      ],
    },
    {
      title: 'Props (VTableColumn)',
      rows: [
        { name: 'prop', type: 'string', default: '-', description: 'Ключ властивості в даних', required: true },
        { name: 'label', type: 'string', default: '-', description: 'Заголовок колонки' },
        { name: 'width', type: 'number', default: '-', description: 'Фіксована ширина' },
        { name: 'minWidth', type: 'number', default: '-', description: 'Мінімальна ширина' },
        { name: 'maxWidth', type: 'number', default: '-', description: 'Максимальна ширина' },
        { name: 'sortable', type: 'boolean', default: 'true', description: 'Сортування колонки' },
        { name: 'pinnedLeft', type: 'boolean', default: 'false', description: 'Закріпити ліворуч' },
        { name: 'pinnedRight', type: 'boolean', default: 'false', description: 'Закріпити праворуч' },
        { name: 'actionColumn', type: 'boolean', default: 'false', description: 'Колонка управління' },
        { name: 'manage', type: 'boolean', default: 'false', description: 'Колонка дій' },
        { name: 'showOverflowTooltip', type: 'boolean', default: 'true', description: 'Тултіп при переповненні' },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'sort-change', type: 'SortChangeEventData', description: 'Зміна сортування' },
        { name: 'selection-change', type: 'SelectionChangeEventData', description: 'Зміна виділення рядків' },
        { name: 'row-click', type: '{ row, column, event }', description: 'Клік по рядку' },
        { name: 'column-pin', type: '{ column, position }', description: 'Закріплення колонки' },
        { name: 'column-resize', type: '{ column, width }', description: 'Зміна ширини колонки' },
        { name: 'column-visibility', type: '{ column }', description: 'Зміна видимості колонки' },
        { name: 'columns-change', type: 'VTableColumnProps[]', description: 'Будь-які зміни в колонках' },
        { name: 'row-reorder', type: 'RowReorderEventData', description: 'Зміна порядку рядків (DnD)' },
        { name: 'infinity-scroll', type: '-', description: 'Досягнення кінця скролу' },
      ],
    },
  ];

  const typesSections: TableSection[] = [
    {
      title: 'SelectionChangeEventData',
      rows: [
        { name: 'selection', type: 'Record<string, any>[]', description: 'Масив виділених рядків' },
        { name: 'row', type: 'Record<string, any>', description: 'Рядок що змінився' },
        { name: 'selected', type: 'boolean', description: 'Чи виділений рядок' },
        { name: 'isAllSelected', type: 'boolean', description: 'Чи виділені всі рядки' },
      ],
    },
    {
      title: 'RowReorderEventData',
      rows: [
        { name: 'oldIndex', type: 'number', description: 'Старий індекс рядка' },
        { name: 'newIndex', type: 'number', description: 'Новий індекс рядка' },
        { name: 'row', type: 'Record<string, any>', description: 'Дані переміщеного рядка' },
        { name: 'newData', type: 'Record<string, any>[]', description: 'Оновлений масив даних' },
      ],
    },
    {
      title: 'VTableColumnGroup',
      rows: [
        { name: 'name', type: 'string', description: 'Унікальна назва групи', required: true },
        { name: 'label', type: 'string', description: 'Заголовок групи', required: true },
        { name: 'order', type: 'number', description: 'Порядок відображення' },
        { name: 'icon', type: 'IconName', description: 'Іконка групи' },
        { name: 'color', type: 'string', description: 'Колір групи' },
        { name: 'columns', type: 'VTableColumnProps[]', description: 'Колонки групи', required: true },
      ],
    },
  ];
</script>

<template>
  <div class="table-showcase">
    <!-- ─── Базова таблиця ─── -->
    <DocSection description="Мінімальна конфігурація — data + VTableColumn" title="Базова таблиця">
      <DocPreview>
        <div style="width: 100%">
          <VTable :data="currentPageData.slice(0, 5)">
            <VTableColumn label="ID" prop="id" width="80" />
            <VTableColumn label="Ім'я" prop="name">
              <template #name="{ row }">
                <VInput v-model="row.name" />
              </template>
            </VTableColumn>
            <VTableColumn label="Рахунок" manage prop="score" />
          </VTable>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Пагінація + виділення + summary ─── -->
    <DocSection
      description="Серверна пагінація з кешуванням сторінок, множинним виділенням і summary-рядком"
      title="Пагінація, виділення рядків і підсумки"
    >
      <DocPreview
        :script="`
const tableRef    = ref()
const currentPage = ref(1)
const pageSize    = ref(10)
const totalItems  = ref(50)
const pageCache   = ref({})
const currentPageData = ref([])
const selectedRows = ref([])

const loadPageData = async (page) => {
  if (pageCache.value[page]) {
    currentPageData.value = pageCache.value[page]; return
  }
  const data = await fetchPageData(page, pageSize.value)
  pageCache.value[page] = data
  currentPageData.value = data
}

const getSummaries = ({ columns, data }) =>
  columns.map(col => {
    const vals = data.map(r => r[col.prop])
    return vals.every(v => typeof v === 'number')
      ? vals.reduce((a, b) => a + b, 0) : 'N/A'
  })

const handleSelectionChange = (data) => {
  selectedRows.value = data.selection
}
        `"
      >
        <div style="width: 100%">
          <div v-if="loading" class="loading-bar">⏳ Завантаження...</div>
          <div v-if="selectedRows.length" class="selection-info">
            Виділено: {{ selectedRows.length }} рядків (IDs:
            {{
              selectedRows
                .map(r => r.id)
                .slice(0, 5)
                .join(', ')
            }})
          </div>

          <VTable
            ref="tableRef"
            :data="currentPageData"
            :max-height="360"
            :summary-method="getSummaries"
            selectable
            selection-key="id"
            show-summary
            @selection-change="handleSelectionChange"
          >
            <VTableColumn label="ID" prop="id" width="70" />
            <VTableColumn label="Ім'я" prop="name">
              <template #name="{ row }">
                <div style="font-weight: 600; color: #0c5460">{{ row.name }}</div>
              </template>
            </VTableColumn>
            <VTableColumn label="Статус" prop="status">
              <template #status="{ row }">
                <span :class="`status-badge status-${row.status}`">{{ getStatusLabel(row.status) }}</span>
              </template>
            </VTableColumn>
            <VTableColumn label="Дата" prop="date" />
            <VTableColumn label="Рахунок" prop="score">
              <template #score="{ row }">
                <div class="score-cell">
                  <div class="score-bar">
                    <div :style="{ width: `${row.score}%` }" class="score-fill" />
                  </div>
                  <span class="score-text">{{ row.score }}</span>
                </div>
              </template>
            </VTableColumn>
          </VTable>

          <VPagination
            :current-page="currentPage"
            :page-size="pageSize"
            :page-size-options="[5, 10, 15, 20]"
            :total-items="totalItems"
            style="margin-top: 1rem"
            @update:current-page="handlePageChange"
            @update:page-size="handlePageSizeChange"
          />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Підсвічування рядків ─── -->
    <DocSection
      description="rowHighlight повертає { type } або { type: 'custom', className } для кожного рядка"
      title="Підсвічування рядків"
    >
      <DocPreview
        :script="`
const highlightFunction = (row) => {
  if (row.isVip)                return { type: 'custom', className: 'vip-row' }
  if (row.status === 'active')  return { type: 'success' }
  if (row.status === 'inactive' || row.status === 'error') return { type: 'danger' }
  if (row.status === 'pending') return { type: 'warning' }
  return null
}
        `"
      >
        <div style="width: 100%">
          <VTable :data="highlightData" :max-height="320" :row-highlight="highlightFunction">
            <VTableColumn label="ID" prop="id" width="60" />
            <VTableColumn label="Ім'я" prop="name">
              <template #name="{ row }">
                <div :style="{ fontWeight: row.isVip ? 700 : 400 }">{{ row.name }}</div>
              </template>
            </VTableColumn>
            <VTableColumn label="Статус" prop="status">
              <template #status="{ row }">
                <span :class="`status-badge status-${row.status}`">{{ getStatusLabel(row.status) }}</span>
              </template>
            </VTableColumn>
            <VTableColumn label="Пріоритет" prop="priority" />
            <VTableColumn label="Зарплата" prop="salary">
              <template #salary="{ row }">{{ formatSalary(row.salary) }}</template>
            </VTableColumn>
            <VTableColumn label="Відділ" prop="department" />
          </VTable>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Drag & Drop ─── -->
    <DocSection description="row-draggable + show-drag-handle + @row-reorder" title="Drag & Drop рядків">
      <DocPreview
        :script="`
const draggableData = ref([
  { id:1, name:'Іван Іванов',         position:'Розробник',    salary:50000 },
  { id:2, name:'Марія Петренко',      position:'Дизайнер',     salary:45000 },
  { id:3, name:'Олександр Сидоренко', position:'Менеджер',     salary:55000 },
])

const handleRowReorder = (event) => {
  draggableData.value = event.newData
  // await api.updateOrder(event.newData.map(r => r.id))
}
        `"
      >
        <div style="width: 100%">
          <VTable
            :data="draggableData"
            :max-height="320"
            :row-draggable="true"
            :show-drag-handle="true"
            row-key="id"
            @row-reorder="handleRowReorder"
          >
            <VTableColumn :sortable="true" :width="200" label="Ім'я" prop="name" />
            <VTableColumn :sortable="true" :width="180" label="Посада" prop="position" />
            <VTableColumn :sortable="true" :width="160" label="Зарплата" prop="salary">
              <template #default="{ value }">
                <span class="salary-text">{{ formatSalary(value) }}</span>
              </template>
            </VTableColumn>
            <VTableColumn :sortable="true" :width="130" label="Статус" prop="status">
              <template #default="{ value }">
                <span :class="`status-badge status-${value}`">
                  {{ value === 'active' ? 'Активний' : 'Неактивний' }}
                </span>
              </template>
            </VTableColumn>
          </VTable>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Управління колонками ─── -->
    <DocSection
      description="columnsSelector дозволяє показувати/приховувати, закріплювати і змінювати порядок колонок"
      title="Управління колонками"
    >
      <DocPreview
        :script="`
const columnGroups = [
  {
    name: 'basic', label: 'Основна інформація', order: 1, color: '#3b82f6',
    columns: [
      { prop: 'id', label: 'ID', width: 80, sortable: true, pinnedLeft: true },
      { prop: 'name', label: 'Ім\\'я', width: 150, sortable: true },
      { prop: 'email', label: 'Email', width: 200, sortable: true },
    ],
  },
  {
    name: 'status', label: 'Статус', order: 2, color: '#10b981',
    columns: [
      { prop: 'status', label: 'Статус', width: 120 },
      { prop: 'isActive', label: 'Активний', width: 80 },
    ],
  },
]
`"
      >
        <div style="width: 100%">
          <VTable
            :columns-selector="columnGroups"
            :data="columnData"
            @column-pin="p => console.log('pin', p)"
            @column-resize="p => console.log('resize', p)"
            @column-visibility="p => console.log('visibility', p)"
            @columns-change="c => console.log('change', c)"
          >
            <VTableColumn label="ID" prop="id" />
            <VTableColumn label="Ім'я" prop="name">
              <template #name="{ row }">
                <div style="color: #0c5460">{{ row.name }}</div>
              </template>
            </VTableColumn>
            <VTableColumn label="Email" prop="email" />
            <VTableColumn label="Статус" prop="status" />
            <VTableColumn label="Онлайн" prop="onlineStatus" />
          </VTable>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="vtableSections" />
    </DocSection>

    <!-- ─── Типи ─── -->
    <DocSection title="Типи даних">
      <DocPropsTable :sections="typesSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="📦" title="Серверна пагінація з кешем">
        Зберігайте завантажені сторінки в <code>pageCache</code> — повторні переходи не роблять зайвих запитів.
      </DocFeature>
      <DocFeature icon="☑️" title="Три рівні виділення">
        Виділення на сторінці → виділення всіх завантажених → абсолютне виділення всіх (потребує
        <code>allData</code> або <code>isAllSelect</code>).
      </DocFeature>
      <DocFeature icon="🎨" title="rowHighlight">
        Повертай <code>{ type: 'success' | 'warning' | 'danger' }</code> або
        <code>{ type: 'custom', className: '...' }</code> — CSS-клас додається до рядка.
      </DocFeature>
      <DocFeature icon="🏗️" title="columnsSelector">
        Передай масив груп колонок — таблиця отримає UI для показу/приховування, закріплення і перетягування колонок.
        Зберігай стан у <code>localStorage</code>.
      </DocFeature>
      <DocFeature icon="↕️" title="Drag & Drop">
        <code>:row-draggable="true"</code> + <code>@row-reorder</code> повертає <code>event.newData</code> — готовий
        масив для збереження нового порядку.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .table-showcase {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .loading-bar {
    padding: 0.5rem 1rem;
    background: #fef3c7;
    color: #92400e;
    border-radius: 6px;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
  }

  .selection-info {
    padding: 0.5rem 1rem;
    background: #e0f2fe;
    color: #0c4a6e;
    border-radius: 6px;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;

    &.status-active {
      background: #dcfce7;
      color: #166534;
    }

    &.status-inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    &.status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    &.status-blocked {
      background: #f3e8ff;
      color: #6b21a8;
    }

    &.status-error {
      background: #fee2e2;
      color: #991b1b;
    }
  }

  .score-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .score-bar {
    flex: 1;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }

  .score-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 3px;
  }

  .score-text {
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
    min-width: 2rem;
    text-align: right;
  }

  .salary-text {
    font-weight: 500;
    color: #059669;
  }

  :deep(.vip-row) {
    background: linear-gradient(45deg, #ffd700, #ffed4a) !important;
    border-left: 4px solid #f59e0b;
    font-weight: 600;
  }
</style>
