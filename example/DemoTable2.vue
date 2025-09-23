<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import VTable from '@/components/table/VTable.vue';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';
  import VTableColumn from '@/components/table/VTableColumn.vue';
  import VInput from '@/components/input/VInput.vue';

  interface RowData {
    reportPeriod: string | null;
    totalCalls: number;
    answeredCalls: number;
    abandonedCalls: number;

    [key: string]: any;
  }

  // зробимо reactive, щоб зміни в об’єкті спрацьовували
  const filter = reactive({
    step: 5,
    iteration: 0,
  });

  // Дані для таблиці
  const rows = reactive<RowData[]>([
    {
      reportPeriod: null,
      totalCalls: 0,
      answeredCalls: 0,
      abandonedCalls: 0,
    },
  ]);

  // Генерація інтервалів
  const intervals = computed(() => {
    const options = [];
    if (!filter.step || !filter.iteration) return options;
    for (let i = 0; i < filter.step * filter.iteration; i += filter.step) {
      options.push({ id: i, name: `${i}` });
    }
    return options;
  });

  // Колонки з реактивними ключами
  const heading = ref([
    { key: 'reportPeriod', i18n: 'Період звіту' },
    { key: 'totalCalls', i18n: 'Всього дзвінків' },
    { key: 'answeredCalls', i18n: 'Всього дзвінків із відповіддю' },
  ]);

  // Опції для селектів ітерацій
  const iterationOptions = computed(() => {
    const options = [];
    if (!filter.step) return options;
    const maxIterations = 60 / Number(filter.step);
    for (let i = 1; i <= maxIterations; i++) {
      options.push({ id: i, name: `${i}` });
    }
    return options;
  });
</script>

<template>
  {{ heading.length }}
  {{ heading }}
  <div style="margin-bottom: 16px">
    <VSelect v-model="filter.step" placeholder="Крок (с.)">
      <VOption label="5" value="5" />
      <VOption label="10" value="10" />
      <VOption label="15" value="15" />
    </VSelect>

    <VSelect v-model="filter.iteration" placeholder="Ітерації">
      <VOption v-for="option in iterationOptions" :key="option.id" :label="option.name" :value="option.id" />
    </VSelect>
  </div>

  <VTable :data="rows" max-height="400px">
    <VTableColumn
      v-for="(column, colIndex) in heading"
      :key="column.key"
      :label="column.i18n"
      :prop="column.key"
      :width="250"
    >
      <template #default="{ row, $index }">
        <VInput :key="column.key + '-' + $index" v-model="row[column.key]" />
      </template>
    </VTableColumn>
  </VTable>
</template>
