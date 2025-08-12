<template>
  <div class="timer-table">
    <h2>Таблиця з таймером</h2>

    <!-- Ваша VTable -->
    <VTable ref="tableRef" :data="tableData" :max-height="400" selectable selection-key="id">
      <!-- Колонка з таймером -->
      <VTableColumn prop="startTime" label="Час" :width="150">
        <template #startTime="{ row, column, value }">
          <div class="timer-cell" @click="addTenSeconds(row)" :title="'Клікни щоб додати 10 секунд'">
            <span class="timer-display">
              {{ formatElapsedTime(getElapsedTime(row)) }}
            </span>
            <span class="timer-hint">+10s</span>
          </div>
        </template>
      </VTableColumn>

      <!-- Інші колонки -->
      <VTableColumn prop="name" label="Назва" :width="150" />
      <VTableColumn prop="status" label="Статус" :width="120">
        <template #status="{ row, column, value }">
          <div :class="'status-badge status-' + row.status">
            {{ getStatusLabel(row.status) }}
          </div>
        </template>
      </VTableColumn>
    </VTable>

    <!-- Контролі -->
    <div class="controls">
      <button @click="resetAllTimers" class="btn btn-secondary"> Скинути всі таймери</button>
      <button @click="startStopAll" class="btn btn-primary"> {{ isRunning ? 'Зупинити' : 'Запустити' }} всі</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import VTable from '@/components/table/VTable.vue';
  import VTableColumn from '@/components/table/VTableColumn.vue';

  // Інтерфейси
  interface TableRow {
    id: number;
    name: string;
    status: 'active' | 'paused' | 'completed';
    startTime: Date;
    currentTime: Date;
    additionalSeconds: number;
  }

  // Реактивні дані
  const tableData = ref<TableRow[]>([
    {
      id: 1,
      name: 'Завдання 1',
      status: 'active',
      startTime: new Date(),
      currentTime: new Date(),
      additionalSeconds: 0,
    },
    {
      id: 2,
      name: 'Завдання 2',
      status: 'active',
      startTime: new Date(Date.now() - 30000), // 30 сек тому
      currentTime: new Date(Date.now() - 30000),
      additionalSeconds: 0,
    },
    {
      id: 3,
      name: 'Завдання 3',
      status: 'paused',
      startTime: new Date(Date.now() - 60000), // 1 хв тому
      currentTime: new Date(Date.now() - 60000),
      additionalSeconds: 0,
    },
  ]);

  const isRunning = ref(true);
  const tableRef = ref();
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  // Computed для оптимізації ключів
  const rowKeyMap = new WeakMap<object, string>();
  let globalRowId = 0;

  // Функції для роботи з часом
  const getCurrentTime = (row: TableRow): Date => {
    if (row.status === 'paused') {
      return row.currentTime;
    }

    // Розраховуємо поточний час з додатковими секундами
    const now = new Date();
    const elapsed = now.getTime() - row.startTime.getTime();
    const totalTime = new Date(row.startTime.getTime() + elapsed + row.additionalSeconds * 1000);

    return totalTime;
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Показуємо час у форматі ММ:СС або ГГ:ММ:СС
    const totalSeconds = Math.abs(Math.floor(diff / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Функція додавання 10 секунд
  const addTenSeconds = (row: TableRow) => {
    console.log(`➕ Додаємо 10 секунд до рядка ${row.id}`);

    // Знаходимо рядок і оновлюємо additionalSeconds
    const targetRow = tableData.value.find(r => r.id === row.id);
    if (targetRow) {
      targetRow.additionalSeconds += 10;

      // Якщо таймер на паузі, оновлюємо currentTime
      if (targetRow.status === 'paused') {
        targetRow.currentTime = new Date(targetRow.currentTime.getTime() + 10000);
      }
    }
  };

  // Функції управління таймерами
  const startStopAll = () => {
    isRunning.value = !isRunning.value;

    if (isRunning.value) {
      startTimer();
    } else {
      stopTimer();
    }
  };

  const resetAllTimers = () => {
    const now = new Date();
    tableData.value.forEach(row => {
      row.startTime = now;
      row.currentTime = now;
      row.additionalSeconds = 0;
      row.status = 'active';
    });
  };

  const startTimer = () => {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
      // Оновлюємо тільки активні рядки
      tableData.value.forEach(row => {
        if (row.status === 'active') {
          // Просто тригеримо реактивність, getCurrentTime робить всі обчислення
          row.currentTime = new Date();
        }
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  const getElapsedTime = row => {
    if (row.status === 'paused') {
      const pausedElapsed = row.currentTime.getTime() - row.startTime.getTime();
      return Math.floor(pausedElapsed / 1000) + row.additionalSeconds;
    }

    const now = new Date();
    const elapsed = now.getTime() - row.startTime.getTime();
    return Math.floor(elapsed / 1000) + row.additionalSeconds;
  };

  const formatElapsedTime = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Допоміжні функції
  const getStatusLabel = (status: string): string => {
    const labels = {
      active: 'Активний',
      paused: 'Пауза',
      completed: 'Завершено',
    };
    return labels[status] || status;
  };

  // Lifecycle hooks
  onMounted(() => {
    startTimer();
  });

  onUnmounted(() => {
    stopTimer();
  });
</script>

<style scoped>
  .timer-table {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .timer-cell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #f8f9fa;
  }

  .timer-cell:hover {
    background: #e9ecef;
    transform: scale(1.02);
  }

  .timer-display {
    font-family: 'Courier New', monospace;
    font-weight: bold;
    color: #2c3e50;
  }

  .timer-hint {
    font-size: 10px;
    color: #6c757d;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .timer-cell:hover .timer-hint {
    opacity: 1;
  }

  .status-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
  }

  .status-active {
    background: #d4edda;
    color: #155724;
  }

  .status-paused {
    background: #fff3cd;
    color: #856404;
  }

  .status-completed {
    background: #d1ecf1;
    color: #0c5460;
  }

  .controls {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }

  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background: #0056b3;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background: #545b62;
  }
</style>
