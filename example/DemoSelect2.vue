<template>
  <div class="example-container">
    <!-- Базовий приклад з infinite scroll -->
    {{ mapping }}
    <br />
    {{ fields }}

    <!-- Селект з фільтрацією та всіма подіями -->
    <VSelect
      ref="selectRef1"
      v-model="mapping.first"
      clearable
      filter-placeholder="Шукати поле..."
      filterable
      placeholder="Оберіть користувача..."
      required
      @blur="event => console.log('blur', event)"
      @clear="result => console.log('clear', result)"
      @filter="query => handleFilter(query, 'first')"
      @focus="event => console.log('focus', event)"
      @scrolled="() => console.log('SCROLLED')"
      @validation="result => console.log('validation', result)"
      @remove-tag="value => console.log('remove-tag', value)"
      @visible-change="result => console.log('visible-change', result)"
      @filter-clear="() => handleFilterClear('first')"
    >
      <VOption v-for="item in filteredFields" :key="item" :label="item" :value="item" />
      <VOption label="Custom Option" value="custom">
        <VIcon name="email" />
        Кастомна опція з іконкою
      </VOption>
    </VSelect>

    <!-- Другий селект з віддаленою фільтрацією -->
    <VSelect
      ref="selectRef2"
      v-model="mapping.second"
      :loading="isRemoteLoading"
      allow-remote-filter
      clearable
      filter-placeholder="Віддалений пошук..."
      filterable
      placeholder="Оберіть користувача..."
      @filter="query => handleRemoteFilter(query, 'second')"
      @filter-clear="() => handleRemoteFilterClear('second')"
    >
      <VOption v-for="item in remoteFields" :key="item" :label="item" :value="item" />
    </VSelect>

    <!-- Селект з об'єктами -->
    {{ select }}
    <VSelect
      ref="selectRef3"
      v-model="select"
      filter-placeholder="Пошук по значенню..."
      filterable
      placeholder="Оберіть користувача..."
      value-key="id"
      @filter="query => handleObjectFilter(query)"
      @filter-clear="() => handleObjectFilterClear()"
    >
      <VOption
        v-for="item in filteredSelectVal"
        :key="item.id"
        :label="`ID: ${item.id}, Val: ${item.val}`"
        :value="item"
      />
    </VSelect>

    <!-- Контроли для тестування -->
    <div class="controls">
      <h3>Контроли фільтрації:</h3>
      <button @click="setCustomFilter">Встановити фільтр "A" для першого селекту</button>
      <button @click="clearAllFilters">Очистити всі фільтри</button>
      <button @click="getFilterStates">Показати стани фільтрів</button>
      <button @click="simulateRemoteSearch">Симуляція віддаленого пошуку</button>
    </div>

    <!-- Інформація про стан -->
    <div class="info">
      <h3>Стан фільтрів:</h3>
      <p><strong>Перший селект:</strong> {{ filterStates.first }}</p>
      <p><strong>Другий селект (віддалений):</strong> {{ filterStates.second }}</p>
      <p><strong>Третій селект (об'єкти):</strong> {{ filterStates.third }}</p>
      <p><strong>Віддалене завантаження:</strong> {{ isRemoteLoading }}</p>
    </div>

    <!-- Лог подій -->
    <div class="log">
      <h3>Лог подій фільтрації:</h3>
      <div class="log-entries">
        <div v-for="(entry, index) in eventLog" :key="index" class="log-entry">
          <span class="timestamp">{{ entry.timestamp }}</span>
          <span class="event">{{ entry.event }}</span>
          <span class="data">{{ entry.data }}</span>
        </div>
      </div>
      <button @click="clearLog">Очистити лог</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import VOption from '@/components/select/VOption.vue';
  import VSelect from '@/components/select/VSelect.vue';
  import { computed, nextTick, ref } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import type { VtSelectMethods } from '@/components/select/types';

  // Refs для селектів
  const selectRef1 = ref<VtSelectMethods>();
  const selectRef2 = ref<VtSelectMethods>();
  const selectRef3 = ref<VtSelectMethods>();

  const mapping = ref({
    first: '',
    second: '',
  });

  const select = ref({ id: 2, val: 3 });
  const selectVal = [
    { id: 1, val: 2 },
    { id: 2, val: 3 },
    { id: 3, val: 5 },
    { id: 4, val: 8 },
    { id: 5, val: 13 },
  ];

  // Стани фільтрів
  const filterStates = ref({
    first: '',
    second: '',
    third: '',
  });

  const isRemoteLoading = ref(false);
  const remoteFields = ref<string[]>([]);

  // Лог подій
  const eventLog = ref<
    Array<{
      timestamp: string;
      event: string;
      data: string;
    }>
  >([]);

  // Локальні фільтри
  const localFilters = ref({
    fields: '',
    objects: '',
  });

  // Додавання запису в лог
  const addLogEntry = (event: string, data: any) => {
    const timestamp = new Date().toLocaleTimeString();
    eventLog.value.unshift({
      timestamp,
      event,
      data: typeof data === 'object' ? JSON.stringify(data) : String(data),
    });

    // Обмежуємо кількість записів
    if (eventLog.value.length > 50) {
      eventLog.value = eventLog.value.slice(0, 50);
    }
  };

  const fields = computed(() =>
    Array.from(Object.keys(TelemarketClientImportFields)).filter(f => !Object.values(mapping?.value).includes(f))
  );

  // Фільтровані поля для першого селекту
  const filteredFields = computed(() => {
    if (!localFilters.value.fields) return fields.value;

    const query = localFilters.value.fields.toLowerCase();
    return fields.value.filter(field => field.toLowerCase().includes(query));
  });

  // Фільтровані об'єкти для третього селекту
  const filteredSelectVal = computed(() => {
    if (!localFilters.value.objects) return selectVal;

    const query = localFilters.value.objects.toLowerCase();
    return selectVal.filter(item => String(item.id).includes(query) || String(item.val).includes(query));
  });

  // Обробники подій фільтрації

  // Локальна фільтрація для першого селекту
  const handleFilter = (query: string, selectName: string) => {
    filterStates.value.first = query;
    localFilters.value.fields = query;
    addLogEntry(`filter (${selectName})`, query);
    console.log(`Filter ${selectName}:`, query);
  };

  const handleFilterClear = (selectName: string) => {
    filterStates.value.first = '';
    localFilters.value.fields = '';
    addLogEntry(`filter-clear (${selectName})`, 'cleared');
    console.log(`Filter cleared ${selectName}`);
  };

  // Віддалена фільтрація для другого селекту
  const handleRemoteFilter = async (query: string, selectName: string) => {
    filterStates.value.second = query;
    addLogEntry(`remote-filter (${selectName})`, query);
    console.log(`Remote filter ${selectName}:`, query);

    // Симуляція віддаленого запиту
    isRemoteLoading.value = true;

    try {
      // Затримка для симуляції мережевого запиту
      await new Promise(resolve => setTimeout(resolve, 500));

      // Симуляція фільтрації на "сервері"
      const allFields = Object.keys(TelemarketClientImportFields);
      remoteFields.value = query
        ? allFields.filter(field => field.toLowerCase().includes(query.toLowerCase()))
        : allFields.slice(0, 10); // Показуємо перші 10 якщо немає запиту

      addLogEntry(`remote-filter-result (${selectName})`, `${remoteFields.value.length} results`);
    } catch (error) {
      addLogEntry(`remote-filter-error (${selectName})`, String(error));
      console.error('Remote filter error:', error);
    } finally {
      isRemoteLoading.value = false;
    }
  };

  const handleRemoteFilterClear = (selectName: string) => {
    filterStates.value.second = '';
    remoteFields.value = [];
    addLogEntry(`remote-filter-clear (${selectName})`, 'cleared');
    console.log(`Remote filter cleared ${selectName}`);
  };

  // Фільтрація для селекту з об'єктами
  const handleObjectFilter = (query: string) => {
    filterStates.value.third = query;
    localFilters.value.objects = query;
    addLogEntry('object-filter', query);
    console.log('Object filter:', query);
  };

  const handleObjectFilterClear = () => {
    filterStates.value.third = '';
    localFilters.value.objects = '';
    addLogEntry('object-filter-clear', 'cleared');
    console.log('Object filter cleared');
  };

  // Методи для тестування
  const setCustomFilter = async () => {
    if (selectRef1.value) {
      selectRef1.value.setFilter('A');
      addLogEntry('programmatic-filter', 'Set filter to "A"');
      await nextTick();
      console.log('Filter set to "A", current query:', selectRef1.value.getFilterQuery());
    }
  };

  const clearAllFilters = () => {
    if (selectRef1.value) {
      selectRef1.value.clearFilter();
      addLogEntry('programmatic-clear', 'First select');
    }
    if (selectRef2.value) {
      selectRef2.value.clearFilter();
      addLogEntry('programmatic-clear', 'Second select');
    }
    if (selectRef3.value) {
      selectRef3.value.clearFilter();
      addLogEntry('programmatic-clear', 'Third select');
    }

    // Очищаємо локальні стани
    localFilters.value.fields = '';
    localFilters.value.objects = '';
    remoteFields.value = [];
  };

  const getFilterStates = () => {
    const states = {
      first: selectRef1.value?.getFilterQuery() || '',
      second: selectRef2.value?.getFilterQuery() || '',
      third: selectRef3.value?.getFilterQuery() || '',
    };

    addLogEntry('get-filter-states', JSON.stringify(states));
    console.log('Current filter states:', states);
    alert(`Filter States:\nFirst: "${states.first}"\nSecond: "${states.second}"\nThird: "${states.third}"`);
  };

  const simulateRemoteSearch = async () => {
    if (selectRef2.value) {
      selectRef2.value.setFilter('B');
      addLogEntry('simulate-remote', 'Searching for "B"');
    }
  };

  const clearLog = () => {
    eventLog.value = [];
  };

  const enum TelemarketClientImportFields {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    H = 'H',
    I = 'I',
    J = 'J',
    K = 'K',
    L = 'L',
    M = 'M',
    N = 'N',
    O = 'O',
    P = 'P',
    Q = 'Q',
    R = 'R',
    S = 'S',
    T = 'T',
    U = 'U',
    V = 'V',
    W = 'W',
    X = 'X',
    Y = 'Y',
    Z = 'Z',

    AA = 'AA',
    AB = 'AB',
    AC = 'AC',
    AD = 'AD',
    AE = 'AE',
    AF = 'AF',
    AG = 'AG',
    AH = 'AH',
    AI = 'AI',
    AJ = 'AJ',
    AK = 'AK',
    AL = 'AL',
    AM = 'AM',
    AN = 'AN',
    AO = 'AO',
    AP = 'AP',
    AQ = 'AQ',
    AR = 'AR',
    AS = 'AS',
    AT = 'AT',
    AU = 'AU',
    AV = 'AV',
    AW = 'AW',
    AX = 'AX',
    AY = 'AY',
    AZ = 'AZ',

    BA = 'BA',
    BB = 'BB',
    BC = 'BC',
    BD = 'BD',
    BE = 'BE',
    BF = 'BF',
    BG = 'BG',
    BH = 'BH',
    BI = 'BI',
    BJ = 'BJ',
    BK = 'BK',
    BL = 'BL',
    BM = 'BM',
    BN = 'BN',
    BO = 'BO',
    BP = 'BP',
    BQ = 'BQ',
    BR = 'BR',
    BS = 'BS',
    BT = 'BT',
    BU = 'BU',
    BV = 'BV',
    BW = 'BW',
    BX = 'BX',
    BY = 'BY',
    BZ = 'BZ',
  }
</script>

<style scoped>
  .example-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .controls {
    margin: 20px 0;
    padding: 16px;
    background-color: #f0f8ff;
    border-radius: 8px;
    border: 1px solid #b0d4f1;
  }

  .controls h3 {
    margin-top: 0;
    color: #2c5aa0;
  }

  .controls button {
    margin: 4px 8px 4px 0;
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }

  .controls button:hover {
    background-color: #0056b3;
  }

  .info {
    margin: 20px 0;
    padding: 16px;
    background-color: #f5f5f5;
    border-radius: 8px;
    font-size: 14px;
  }

  .info h3 {
    margin-top: 0;
    color: #333;
  }

  .info p {
    margin: 4px 0;
  }

  .log {
    margin: 20px 0;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
  }

  .log h3 {
    margin-top: 0;
    color: #495057;
  }

  .log-entries {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 12px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
  }

  .log-entry {
    padding: 4px 8px;
    margin-bottom: 2px;
    background-color: white;
    border-radius: 3px;
    border-left: 3px solid #28a745;
  }

  .log-entry:nth-child(even) {
    background-color: #f8f9fa;
  }

  .timestamp {
    color: #6c757d;
    margin-right: 8px;
  }

  .event {
    color: #007bff;
    font-weight: bold;
    margin-right: 8px;
  }

  .data {
    color: #28a745;
  }

  .log button {
    padding: 6px 12px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }

  .log button:hover {
    background-color: #c82333;
  }

  /* Стилі для селектів */
  .example-container > * {
    margin-bottom: 16px;
  }
</style>
