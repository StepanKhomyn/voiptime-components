<script lang="ts" setup>
  import { computed, reactive, watch } from 'vue';
  import VTable from '@/components/table/VTable.vue';
  import VTableColumn from '@/components/table/VTableColumn.vue';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';
  import VInput from '@/components/input/VInput.vue';

  interface RowData {
    id: string;
    reportPeriod?: string;
    totalCalls?: number;
    answeredCalls?: number;
    abandonedCalls?: number;
    answeredInterval?: Record<string, number>;
    abandonedInterval?: Record<string, number>;

    [key: string]: any;
  }

  // Reactive step та iteration
  const filter = reactive({
    step: 5,
    iteration: 0,
  });

  // Генерація інтервалів
  const intervals = computed(() => {
    const options = [];
    if (!filter.step || !filter.iteration) return options;

    for (let i = 0; i < Number(filter.step) * Number(filter.iteration); i += Number(filter.step)) {
      options.push({ id: i, name: `${i}` });
    }
    return options;
  });

  // Heading колонок
  const heading = computed(() => {
    const columns = [];

    // Статичні
    columns.push(
      { key: 'reportPeriod', i18n: 'Період звіту' },
      { key: 'totalCalls', i18n: 'Всього дзвінків' },
      { key: 'answeredCalls', i18n: 'Всього дзвінків із відповіддю' }
    );

    // Динамічні answered
    intervals.value.forEach((interval, idx) => {
      columns.push({ key: `answered_${interval.id}`, i18n: `Відповідь на ${interval.name}s` });
      if (idx === intervals.value.length - 1) {
        columns.push({ key: `answered_more_${interval.id}`, i18n: `Відповідь на > ${interval.name}s` });
      }
    });

    // Статична abandoned
    columns.push({ key: 'abandonedCalls', i18n: 'Всього втрачених дзвінків' });

    // Динамічні abandoned
    intervals.value.forEach((interval, idx) => {
      columns.push({ key: `abandoned_${interval.id}`, i18n: `Втрачені на ${interval.name}s` });
      if (idx === intervals.value.length - 1) {
        columns.push({ key: `abandoned_more_${interval.id}`, i18n: `Втрачені на > ${interval.name}s` });
      }
    });

    return columns;
  });

  // Дані таблиці
  const rows = reactive<RowData[]>([
    {
      id: `row_${Date.now()}`,
      reportPeriod: null,
      totalCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      answeredInterval: {},
      abandonedInterval: {},
    },
  ]);

  // Функція додавання рядка
  const addRow = () => {
    rows.push({
      id: `row_${Date.now()}_${Math.random()}`,
      reportPeriod: null,
      totalCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
      answeredInterval: {},
      abandonedInterval: {},
    });
  };

  // Watch, щоб додавати нові інтервальні ключі
  watch(intervals, newIntervals => {
    rows.forEach(row => {
      row.answeredInterval ||= {};
      row.abandonedInterval ||= {};

      newIntervals.forEach(interval => {
        if (!(interval.id in row.answeredInterval)) row.answeredInterval[interval.id] = 0;
        if (!(interval.id in row.abandonedInterval)) row.abandonedInterval[interval.id] = 0;
      });
    });
  });
</script>

<template>
  <div style="margin-bottom: 16px">
    <VSelect v-model="filter.step" placeholder="Крок (с.)">
      <VOption label="5" value="5" />
      <VOption label="10" value="10" />
      <VOption label="15" value="15" />
    </VSelect>

    <VSelect v-model="filter.iteration" placeholder="Ітерації">
      <VOption v-for="i in 12" :key="i" :label="i" :value="i" />
    </VSelect>

    <button @click="addRow">Додати рядок</button>
  </div>
  {{ rows }}
  <VTable :data="rows" row-key="id">
    <VTableColumn v-for="column in heading" :key="column.key" :label="column.i18n" :prop="column.key" :width="200">
      <template #default="{ row }">
        <VInput v-model="row[column.key]" />
      </template>
    </VTableColumn>
  </VTable>
</template>
