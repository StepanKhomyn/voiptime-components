<script lang="ts" setup>
  import { computed, reactive, watch } from 'vue';
  import VTable from '@/components/table/VTable.vue';
  import VTableColumn from '@/components/table/VTableColumn.vue';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';

  interface RowData {
    id?: string;

    [key: string]: any;
  }

  // reactive для step та iteration
  const filter = reactive({
    step: 5,
    iteration: 0,
  });

  // Генерація унікального id
  const generateId = () => `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Дані для таблиці
  const rows = reactive<RowData[]>([{ id: generateId() }]);

  // Динамічні колонки на основі step * iteration
  const heading = computed(() => {
    const columns = [];
    columns.push(
      {
        key: `id`,
        i18n: `Колонка id`,
      },
      {
        key: `colInform`,
        i18n: `Колонка colInform`,
      },
      {
        key: `colInformText`,
        i18n: `Колонка colInformT`,
      }
    );
    const totalCols = filter.step * filter.iteration;
    for (let i = 0; i < totalCols; i++) {
      columns.push({
        key: `col_${i}`,
        i18n: `Колонка ${i + 1}`,
      });
    }
    return columns;
  });

  // Функція для додавання рядка
  const addRow = () => {
    const newRow: RowData = { id: generateId() };
    heading.value.forEach(col => (newRow[col.key] = null));
    rows.push(newRow);
  };

  // Слідкуємо за зміною heading і додаємо/змінюємо значення для всіх рядків
  watch(heading, newCols => {
    rows.forEach(row => {
      newCols.forEach(col => {
        if (!(col.key in row)) {
          row[col.key] = null;
        }
      });
      // видаляємо старі ключі, яких вже немає
      Object.keys(row).forEach(k => {
        if (k !== 'id' && !newCols.find(c => c.key === k)) {
          delete row[k];
        }
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

  <VTable :data="rows" max-height="400px" row-key="id">
    <VTableColumn v-for="column in heading" :key="column.key" :label="column.i18n" :prop="column.key" :width="150">
      <template #default="{ row }"> {{ row[column.key] }}</template>
    </VTableColumn>
  </VTable>
</template>
