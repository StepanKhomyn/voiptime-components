<template>
  <div class="example-container">
    <!-- Debug info -->
    <div class="debug-info">
      <p>Загружено опцій: {{ filteredFields.length }} / {{ totalFields.length }}</p>
      <p>Mapping: {{ mapping }}</p>
      <p>Loading: {{ isLoading }}</p>
    </div>

    <!-- Селект з динамічним завантаженням -->
    <VSelect
      ref="selectRef1"
      v-model="mapping.first"
      :loading="isLoading"
      clearable
      filter-placeholder="Шукати поле..."
      filterable
      placeholder="Оберіть поле..."
      required
      @scrolled="loadMoreOptions"
      @visible-change="handleVisibleChange"
    >
      <VOption v-for="item in filteredFields" :key="item" :label="item" :value="item" />
    </VSelect>

    <!-- Controls для тестування -->
    <div class="controls">
      <h3>Controls</h3>
      <button @click="resetOptions">Reset Options</button>
      <button @click="loadMoreOptions">Load More Manually</button>
      <button @click="showDebugInfo">Show Debug Info</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import VOption from '@/components/select/VOption.vue';
  import VSelect from '@/components/select/VSelect.vue';
  import { computed, ref } from 'vue';
  import type { VtSelectMethods } from '@/components/select/types';

  // Refs
  const selectRef1 = ref<VtSelectMethods>();

  // State
  const mapping = ref({
    first: '',
    second: '',
  });

  const isLoading = ref(false);
  const loadedCount = ref(0);
  const batchSize = 20;

  // Всі доступні поля (у реальному застосунку це може бути з API)
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

  // Всі поля як масив
  const totalFields = Object.values(TelemarketClientImportFields);

  // Завантажені поля
  const loadedFields = ref<string[]>([]);

  // Computed для фільтрованих полів
  const filteredFields = computed(() => loadedFields.value);

  // Симуляція завантаження даних з сервера
  const loadOptions = async (append = false) => {
    if (isLoading.value) return;

    console.log('Loading options...', { append, currentCount: loadedFields.value.length });

    isLoading.value = true;

    try {
      // Симуляція затримки API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Визначаємо які поля завантажувати
      const startIndex = append ? loadedFields.value.length : 0;
      const endIndex = Math.min(startIndex + batchSize, totalFields.length);
      const newFields = totalFields.slice(startIndex, endIndex);

      console.log('Loaded fields:', { startIndex, endIndex, newFields });

      if (append) {
        // Додаємо до існуючих
        loadedFields.value.push(...newFields);
      } else {
        // Замінюємо всі
        loadedFields.value = [...newFields];
      }

      loadedCount.value = loadedFields.value.length;

      // Оновлюємо sentinel після завантаження
      if (selectRef1.value?.updateScrollSentinel) {
        await new Promise(resolve => setTimeout(resolve, 100));
        selectRef1.value.updateScrollSentinel();
      }
    } catch (error) {
      console.error('Error loading options:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Обробники подій
  const handleVisibleChange = async (visible: boolean) => {
    console.log('Visible change:', visible);

    if (visible && loadedFields.value.length === 0) {
      console.log('Loading initial options...');
      await loadOptions(false);
    }
  };

  const loadMoreOptions = async () => {
    console.log('scrolled');
    // Перевіряємо чи є ще опції для завантаження
    if (loadedFields.value.length >= totalFields.length) {
      console.log('All options already loaded');
      return;
    }

    console.log('Loading more options...');
    await loadOptions(true);
  };

  // Utility функції
  const resetOptions = () => {
    console.log('Resetting options...');
    loadedFields.value = [];
    loadedCount.value = 0;
    mapping.value.first = '';
  };

  const showDebugInfo = () => {
    if (selectRef1.value?.getScrollInfo) {
      const scrollInfo = selectRef1.value.getScrollInfo();
      console.log('Debug info:', {
        scrollInfo,
        loadedCount: loadedFields.value.length,
        totalCount: totalFields.length,
        hasMore: loadedFields.value.length < totalFields.length,
      });
    }
  };
</script>

<style scoped>
  .example-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  .debug-info {
    margin-bottom: 20px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #dee2e6;
    font-size: 14px;
  }

  .debug-info p {
    margin: 4px 0;
    font-family: 'Courier New', monospace;
  }

  .controls {
    margin-top: 20px;
    padding: 16px;
    background-color: #f0f8ff;
    border-radius: 8px;
    border: 1px solid #b0d4f1;
  }

  .controls h3 {
    margin-top: 0;
    margin-bottom: 12px;
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
    transition: background-color 0.2s;
  }

  .controls button:hover {
    background-color: #0056b3;
  }

  .controls button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
</style>
