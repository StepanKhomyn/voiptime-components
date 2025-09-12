<template>
  <div>
    <!-- Кнопки для тестування реактивності -->
    <div class="table-controls" style="margin-bottom: 20px">
      <button class="btn btn--primary" @click="changeRandomStatus"> 🎲 Змінити випадковий статус</button>
      <button class="btn btn--info" @click="changeRandomName"> ✏️ Змінити випадкове ім'я</button>
      <button class="btn btn--success" @click="increaseRandomScore"> 📈 +10 балів випадковому</button>
      <button class="btn btn--warning" @click="addNewRow"> ➕ Додати новий рядок</button>
      <button :disabled="tableData.length === 0" class="btn btn--danger" @click="removeLastRow">
        ❌ Видалити останній
      </button>
      <button class="btn btn--secondary" @click="shuffleAllData"> 🔀 Перемішати все</button>
    </div>

    <!-- Статистика -->
    <div style="margin-bottom: 15px; padding: 10px; background-color: #f0f9ff; border-radius: 4px">
      <strong>📊 Статистика:</strong>
      Всього: {{ tableData.length }} | Активних: {{ activeCount }} | Неактивних: {{ inactiveCount }} | В очікуванні:
      {{ pendingCount }} | Заблокованих: {{ blockedCount }} | Середній бал: {{ averageScore }}%
    </div>

    <!-- Лічильник змін -->
    <div style="margin-bottom: 15px; padding: 10px; background-color: #fff3cd; border-radius: 4px">
      <strong>🔄 Тест реактивності:</strong>
      Змін даних: {{ changesCount }} | Останнє оновлення: {{ lastUpdate }}
    </div>

    <!-- VTable -->
    <VTable
      ref="tableRef"
      :data="tableData"
      :max-height="400"
      :summary-method="getSummaries"
      highlight-current-row
      show-summary
    >
      <!-- Звичайна колонка без слота для тестування -->
      <VTableColumn :width="100" label="ID (тест)" prop="id" />
      <VTableColumn :width="150" label="Ім'я (тест)" prop="name" />
      <VTableColumn :width="120" label="Статус (тест)" prop="status" />

      <!-- ID колонка -->
      <VTableColumn :width="80" label="ID" prop="id" />

      <!-- Ім'я з кнопкою зміни -->
      <VTableColumn :width="200" label="Ім'я" prop="name">
        <template #name="{ row }">
          <div style="display: flex; align-items: center; gap: 8px">
            <span>{{ row.name }}</span>
            <button class="btn-mini" title="Змінити ім'я" @click.stop="changeName(row.id)"> ✏️</button>
          </div>
        </template>
      </VTableColumn>

      <!-- Статус з кнопкою зміни -->
      <VTableColumn :width="200" label="Статус" prop="status">
        <template #status="{ row }">
          <div style="display: flex; align-items: center; gap: 8px">
            <span :class="'status-badge status-badge--' + row.status">
              {{ getStatusLabel(row.status) }}
            </span>
            <button class="btn-mini" title="Змінити статус" @click.stop="toggleStatus(row.id)"> 🔄</button>
          </div>
        </template>
      </VTableColumn>

      <!-- Дата -->
      <VTableColumn :width="120" label="Дата" prop="date" />

      <!-- Бали з кнопкою збільшення -->
      <VTableColumn :width="150" label="Бали" prop="score">
        <template #score="{ row }">
          <VDropdown placement="bottom-start" trigger="click">
            <!-- Trigger -->
            <div class="vt-table-header-actions">
              <VIcon name="listBullet" />
            </div>

            <!-- Dropdown Menu -->
            <template #dropdown>
              <VDropdownItem :command="'pin'">
                <VIcon name="unfreeze" />
                <div>Заморозити</div>
              </VDropdownItem>
              <VDropdownItem :command="'columns'">
                <VIcon name="columnInsert" />
                <div>Колонки</div>
              </VDropdownItem>
              <VDropdownItem :command="'columns'">
                <VIcon name="columnInsert" />
                <div>Колонки</div>
              </VDropdownItem>
              <VDropdownItem :command="'columns'">
                <VIcon name="columnInsert" />
                <div>Колонки</div>
              </VDropdownItem>

              <VDropdownItem :command="'columns'">
                <VIcon name="columnInsert" />
                <div>Колонки</div>
              </VDropdownItem>
              <VDropdownItem :command="'columns'">
                <VIcon name="columnInsert" />
                <div>Колонки</div>
              </VDropdownItem>
              <VDropdownItem :command="'columns'">
                <VIcon name="columnInsert" />
                <div>Колонки</div>
              </VDropdownItem>
              <VDropdownItem :command="'columns'">
                <VIcon name="columnInsert" />
                <div>Колонки</div>
              </VDropdownItem>
              <VDropdownItem :command="'columns'">
                <VIcon name="columnInsert" />
                <div>Колонки</div>
              </VDropdownItem>
              <VDropdownItem :command="'columns'">
                <VIcon name="columnInsert" />
                <div>Колонки</div>
              </VDropdownItem>
            </template>
          </VDropdown>
        </template>
      </VTableColumn>

      <!-- Дії -->
      <VTableColumn :selectable="false" :width="100" label="Дії" prop="actions">
        <template #actions="{ row }">
          <button class="btn-mini btn-danger" title="Видалити" @click.stop="removeRow(row.id)"> 🗑️</button>
        </template>
      </VTableColumn>
    </VTable>

    <!-- Інформація про виділення -->
    <div
      v-if="selectedRows.length > 0"
      style="margin-top: 15px; padding: 10px; background: #e8f5e8; border-radius: 4px"
    >
      <strong>Виділено: {{ selectedRows.length }} рядків</strong>
      <div style="margin-top: 8px">
        <button class="btn-small btn-primary" @click="changeSelectedStatus"> 🔄 Змінити статус виділених</button>
        <button class="btn-small btn-success" @click="increaseSelectedScores"> 📈 +20 балів виділеним</button>
        <button class="btn-small btn-danger" @click="removeSelected"> 🗑️ Видалити виділені</button>
      </div>
    </div>

    <!-- Debug -->
    <div style="margin-top: 20px; padding: 10px; background: var(--color-gray-7); border-radius: 4px; font-size: 12px">
      <strong>🔍 Debug реактивності:</strong><br />
      Поточна кількість записів: {{ tableData.length }}<br />
      Активних записів: {{ activeCount }}<br />
      Середній бал: {{ averageScore }}%<br />
      <strong>VTable DEBUG:</strong><br />
      tableData передається в VTable: {{ JSON.stringify(tableData) }}<br />
      tableData.length: {{ tableData.length }}<br />
      Перший елемент: {{ tableData[0] ? JSON.stringify(tableData[0]) : 'Немає' }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import VTable from '@/components/table/VTable.vue';
  import VTableColumn from '@/components/table/VTableColumn.vue';
  import VDropdown from '@/components/dropdown/VDropdown.vue';
  import VDropdownItem from '@/components/dropdown/VDropdownItem.vue';
  import VIcon from '@/components/icon/VIcon.vue';

  // Основний об'єкт з даними
  const dataObject = ref({
    1: { id: 1, name: 'Олексій', status: 'active', date: '2024-01-15', score: 85 },
    2: { id: 2, name: 'Марія', status: 'inactive', date: '2024-02-20', score: 92 },
    3: { id: 3, name: 'Петро', status: 'pending', date: '2024-03-10', score: 78 },
    4: { id: 4, name: 'Анна', status: 'blocked', date: '2024-04-05', score: 95 },
    5: { id: 5, name: 'Іван', status: 'active', date: '2024-05-12', score: 67 },
  });

  // Computed для таблиці
  const tableData = computed(() => {
    return Object.values(dataObject.value).sort((a, b) => a.id - b.id);
  });

  // Прості лічильники
  const changesCount = ref(0);
  const lastUpdate = ref(new Date().toLocaleTimeString());

  // Виділені рядки
  const selectedRows = ref<any[]>([]);
  const tableRef = ref();

  // Статуси та імена для генерації
  const statuses = ['active', 'inactive', 'pending', 'blocked'];
  const names = ['Дмитро', 'Катерина', 'Володимир', 'Олена', 'Андрій', 'Юлія', 'Максим', 'Тетяна', 'Богдан', 'Оксана'];
  let nextId = 6;

  // Computed властивості
  const activeCount = computed(() => Object.values(dataObject.value).filter(item => item.status === 'active').length);

  const inactiveCount = computed(
    () => Object.values(dataObject.value).filter(item => item.status === 'inactive').length
  );

  const pendingCount = computed(() => Object.values(dataObject.value).filter(item => item.status === 'pending').length);

  const blockedCount = computed(() => Object.values(dataObject.value).filter(item => item.status === 'blocked').length);

  const averageScore = computed(() => {
    const scores = Object.values(dataObject.value).map(item => item.score);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  });

  // Функція для оновлення лічильників
  const updateCounters = () => {
    changesCount.value++;
    lastUpdate.value = new Date().toLocaleTimeString();
  };

  // Функції для зміни даних
  const toggleStatus = (id: number) => {
    const item = dataObject.value[id];
    if (!item) return;

    const currentIndex = statuses.indexOf(item.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    item.status = statuses[nextIndex];

    updateCounters();
    console.log(`🔄 Статус "${item.name}" → "${getStatusLabel(item.status)}"`);
  };

  const changeName = (id: number) => {
    const item = dataObject.value[id];
    if (!item) return;

    const randomName = names[Math.floor(Math.random() * names.length)];
    const oldName = item.name;
    item.name = `${randomName} ${Math.floor(Math.random() * 100)}`;

    updateCounters();
    console.log(`✏️ Ім'я "${oldName}" → "${item.name}"`);
  };

  const increaseScore = (id: number) => {
    const item = dataObject.value[id];
    if (!item) return;

    const oldScore = item.score;
    item.score = Math.min(100, item.score + 10);

    updateCounters();
    console.log(`📈 Бали "${item.name}": ${oldScore}% → ${item.score}%`);
  };

  const changeRandomStatus = () => {
    const ids = Object.keys(dataObject.value);
    if (ids.length === 0) return;

    const randomId = parseInt(ids[Math.floor(Math.random() * ids.length)]);
    toggleStatus(randomId);
  };

  const changeRandomName = () => {
    const ids = Object.keys(dataObject.value);
    if (ids.length === 0) return;

    const randomId = parseInt(ids[Math.floor(Math.random() * ids.length)]);
    changeName(randomId);
  };

  const increaseRandomScore = () => {
    const ids = Object.keys(dataObject.value);
    if (ids.length === 0) return;

    const randomId = parseInt(ids[Math.floor(Math.random() * ids.length)]);
    increaseScore(randomId);
  };

  const addNewRow = () => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const today = new Date().toISOString().split('T')[0];
    const randomScore = Math.floor(Math.random() * 40) + 60;

    const newItem = {
      id: nextId,
      name: `${randomName} ${nextId}`,
      status: randomStatus,
      date: today,
      score: randomScore,
    };

    dataObject.value[nextId] = newItem;
    nextId++;
    updateCounters();
    console.log(`➕ Додано: "${newItem.name}"`);
  };

  const removeRow = (id: number) => {
    const item = dataObject.value[id];
    if (item) {
      delete dataObject.value[id];
      updateCounters();
      console.log(`🗑️ Видалено: "${item.name}"`);
    }
  };

  const removeLastRow = () => {
    const ids = Object.keys(dataObject.value)
      .map(id => parseInt(id))
      .sort((a, b) => b - a);
    if (ids.length > 0) {
      removeRow(ids[0]);
    }
  };

  const shuffleAllData = () => {
    Object.values(dataObject.value).forEach(item => {
      item.status = statuses[Math.floor(Math.random() * statuses.length)];
      item.score = Math.floor(Math.random() * 40) + 60;
      item.name = `${names[Math.floor(Math.random() * names.length)]} ${Math.floor(Math.random() * 100)}`;
    });
    updateCounters();
    console.log('🔀 Дані перемішано');
  };

  // Операції з виділеними рядками
  const changeSelectedStatus = () => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    selectedRows.value.forEach(row => {
      if (dataObject.value[row.id]) {
        dataObject.value[row.id].status = randomStatus;
      }
    });
    updateCounters();
    console.log(`🔄 Статус ${selectedRows.value.length} виділених → "${getStatusLabel(randomStatus)}"`);
  };

  const increaseSelectedScores = () => {
    selectedRows.value.forEach(row => {
      if (dataObject.value[row.id]) {
        dataObject.value[row.id].score = Math.min(100, dataObject.value[row.id].score + 20);
      }
    });
    updateCounters();
    console.log(`📈 +20 балів ${selectedRows.value.length} виділеним`);
  };

  const removeSelected = () => {
    const count = selectedRows.value.length;
    selectedRows.value.forEach(row => {
      delete dataObject.value[row.id];
    });
    selectedRows.value = [];
    updateCounters();
    console.log(`🗑️ Видалено ${count} виділених`);
  };

  // Обробники подій
  const handleSelectionChange = (data: any) => {
    selectedRows.value = data.selection;
  };

  const handleRowClick = (data: any) => {
    console.log('🖱️ Клік:', data.row.name);
  };

  // Допоміжні функції
  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      active: 'Активний',
      inactive: 'Неактивний',
      pending: 'В очікуванні',
      blocked: 'Заблокований',
    };
    return labels[status] || status;
  };

  const getScoreClass = (score: number): string => {
    if (score >= 90) return 'score-excellent';
    if (score >= 80) return 'score-good';
    if (score >= 70) return 'score-average';
    return 'score-poor';
  };

  const getSummaries = ({ columns, data }: { columns: any[]; data: any[] }) => {
    return columns.map(col => {
      if (col.prop === 'score') {
        const avg = data.reduce((sum, row) => sum + row.score, 0) / data.length;
        return `Ø ${Math.round(avg)}%`;
      }
      if (col.prop === 'id') return `Σ ${data.length}`;
      return '';
    });
  };
</script>

<style scoped>
  .btn {
    padding: 8px 12px;
    margin-right: 8px;
    margin-bottom: 4px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .btn--primary {
    background-color: #007bff;
    color: white;
  }

  .btn--success {
    background-color: #28a745;
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

  .btn--danger {
    background-color: #dc3545;
    color: white;
  }

  .btn--secondary {
    background-color: #6c757d;
    color: white;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .btn-mini {
    padding: 2px 6px;
    font-size: 10px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-mini:hover {
    background-color: #f8f9fa;
    transform: scale(1.1);
  }

  .btn-mini.btn-success {
    border-color: #28a745;
    color: #28a745;
  }

  .btn-mini.btn-success:hover {
    background-color: #28a745;
    color: white;
  }

  .btn-mini.btn-danger {
    border-color: #dc3545;
    color: #dc3545;
  }

  .btn-mini.btn-danger:hover {
    background-color: #dc3545;
    color: white;
  }

  .btn-small {
    padding: 4px 8px;
    margin-right: 4px;
    font-size: 12px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }

  .btn-small.btn-primary {
    background-color: #007bff;
    color: white;
  }

  .btn-small.btn-success {
    background-color: #28a745;
    color: white;
  }

  .btn-small.btn-danger {
    background-color: #dc3545;
    color: white;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
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

  .score-excellent {
    color: #28a745;
  }

  .score-good {
    color: #17a2b8;
  }

  .score-average {
    color: #ffc107;
  }

  .score-poor {
    color: #dc3545;
  }
</style>
