<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import VDatePicker from '@/components/datepicker/VDatePicker.vue';
  import type { DateShortcut } from '@/components/datepicker/types';

  // Reactive data object as requested
  const dataValue = reactive({
    value1: '', // Single date
    value2: '', // Week picker
    value3: '', // Month picker
    value4: '', // Year picker
    value5: null as [string, string] | null, // Date range
  });

  // Additional examples
  const examples = reactive({
    datetime: '',
    withValidation: '',
    customFormat: '',
    minMaxDate: '',
    disabledDates: '',
  });

  // Date range shortcuts
  const shortcuts: DateShortcut[] = [
    {
      text: 'Сьогодні',
      value: () => [new Date(), new Date()],
    },
    {
      text: 'Вчора',
      value: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return [yesterday, yesterday];
      },
    },
    {
      text: 'Останні 7 днів',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        return [start, end];
      },
    },
    {
      text: 'Останні 30 днів',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 29);
        return [start, end];
      },
    },
    {
      text: 'Цей місяць',
      value: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return [start, end];
      },
    },
    {
      text: 'Минулий місяць',
      value: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return [start, end];
      },
    },
  ];

  // Min/Max dates for validation example
  const minDate = ref(new Date());
  const maxDate = ref(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date;
  });

  // Custom disabled dates function
  const disabledDate = (date: Date): boolean => {
    // Disable weekends
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Validation handlers
  const handleValidation = (result: { isValid: boolean; errors: string[] }) => {
    console.log('Validation result:', result);
  };

  const handleChange = (value: any) => {
    console.log('Date changed:', value);
  };

  const handleVisibleChange = (visible: boolean) => {
    console.log('Dropdown visible:', visible);
  };

  const handleClear = () => {
    console.log('Date cleared');
  };
</script>

<template>
  <div class="date-picker-examples">
    <h2>VDatePicker Examples</h2>

    <!-- Basic Examples as requested -->
    <div class="example-section">
      <h3>Основні типи</h3>

      <div class="example-row">
        <VDatePicker
          v-model="dataValue.value1"
          clearable
          label="Дата"
          placeholder="Виберіть день"
          type="date"
          @change="handleChange"
          @validation="handleValidation"
        />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="dataValue.value2"
          clearable
          format="yyyy-WW"
          label="Тиждень"
          placeholder="Виберіть тиждень"
          type="week"
          @change="handleChange"
        />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="dataValue.value3"
          clearable
          format="MM.yyyy"
          label="Місяць"
          placeholder="Виберіть місяць"
          type="month"
          @change="handleChange"
        />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="dataValue.value4"
          clearable
          format="yyyy"
          label="Рік"
          placeholder="Виберіть рік"
          type="year"
          @change="handleChange"
        />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="dataValue.value5"
          :shortcuts="shortcuts"
          clearable
          end-placeholder="Кінцева дата"
          label="Діапазон дат"
          range
          range-separator="до"
          start-placeholder="Початкова дата"
          type="date"
          @change="handleChange"
        />
      </div>
    </div>

    <!-- Advanced Examples -->
    <div class="example-section">
      <h3>Розширені можливості</h3>

      <div class="example-row">
        <VDatePicker
          v-model="examples.datetime"
          clearable
          format="dd.MM.yyyy HH:mm:ss"
          label="Дата та час"
          placeholder="Виберіть дату та час"
          type="datetime"
          @change="handleChange"
        />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="examples.withValidation"
          label="З валідацією"
          placeholder="Обов'язкове поле"
          required
          required-message="Дата обов'язкова для заповнення"
          status="error"
          type="date"
          validate-on-blur
          validate-on-input
          @validation="handleValidation"
        />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="examples.customFormat"
          clearable
          format="dd/MM/yyyy"
          label="Користувацький формат"
          placeholder="Виберіть дату"
          type="date"
          value-format="yyyy-MM-dd"
        />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="examples.minMaxDate"
          :max-date="maxDate()"
          :min-date="minDate"
          clearable
          label="З обмеженням дат"
          placeholder="Тільки наступні 3 місяці"
          type="date"
        />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="examples.disabledDates"
          :disabled-date="disabledDate"
          clearable
          label="Заборонені дати"
          placeholder="Без вихідних"
          type="date"
        />
      </div>
    </div>

    <!-- Size and Status Examples -->
    <div class="example-section">
      <h3>Статуси</h3>

      <div class="example-row">
        <VDatePicker v-model="dataValue.value1" label="Успішний статус" placeholder="Успіх" status="success" />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="dataValue.value1"
          label="Попереджувальний статус"
          placeholder="Попередження"
          status="warning"
        />
      </div>

      <div class="example-row">
        <VDatePicker v-model="dataValue.value1" label="Помилковий статус" placeholder="Помилка" status="error" />
      </div>
    </div>

    <!-- Special States -->
    <div class="example-section">
      <h3>Спеціальні стани</h3>

      <div class="example-row">
        <VDatePicker v-model="dataValue.value1" disabled label="Відключений" placeholder="Відключений датапікер" />
      </div>

      <div class="example-row">
        <VDatePicker v-model="dataValue.value1" label="Тільки для читання" placeholder="Тільки читання" readonly />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="dataValue.value1"
          editable
          format="dd.MM.yyyy"
          label="Редагований"
          placeholder="Можна вводити текст"
        />
      </div>
    </div>

    <!-- Range Examples -->
    <div class="example-section">
      <h3>Діапазони</h3>

      <div class="example-row">
        <VDatePicker
          v-model="dataValue.value5"
          clearable
          end-placeholder="Кінцевий тиждень"
          label="Діапазон тижнів"
          range
          range-separator="до"
          start-placeholder="Початковий тиждень"
          type="week"
        />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="dataValue.value5"
          clearable
          end-placeholder="Кінцевий місяць"
          format="MMMM yyyy"
          label="Діапазон місяців"
          range
          range-separator="до"
          start-placeholder="Початковий місяць"
          type="month"
        />
      </div>

      <div class="example-row">
        <VDatePicker
          v-model="dataValue.value5"
          clearable
          end-placeholder="Кінцевий рік"
          label="Діапазон років"
          range
          range-separator="до"
          start-placeholder="Початковий рік"
          type="year"
        />
      </div>
    </div>

    <!-- Values Display -->
    <div class="example-section">
      <h3>Поточні значення</h3>

      <div class="values-display">
        <div class="value-item"><strong>Дата:</strong> {{ dataValue.value1 || 'Не вибрано' }}</div>
        <div class="value-item"><strong>Тиждень:</strong> {{ dataValue.value2 || 'Не вибрано' }}</div>
        <div class="value-item"><strong>Місяць:</strong> {{ dataValue.value3 || 'Не вибрано' }}</div>
        <div class="value-item"><strong>Рік:</strong> {{ dataValue.value4 || 'Не вибрано' }}</div>
        <div class="value-item">
          <strong>Діапазон:</strong>
          {{ dataValue.value5 ? `${dataValue.value5[0]} - ${dataValue.value5[1]}` : 'Не вибрано' }}
        </div>
      </div>
    </div>

    <!-- Format Examples -->
    <div class="example-section">
      <h3>Приклади форматів</h3>

      <div class="format-examples">
        <div class="format-row"><code>dd.MM.yyyy</code> → 25.12.2024</div>
        <div class="format-row"><code>MM/dd/yyyy</code> → 12/25/2024</div>
        <div class="format-row"><code>yyyy-MM-dd</code> → 2024-12-25</div>
        <div class="format-row"><code>dd MMMM yyyy</code> → 25 Грудень 2024</div>
        <div class="format-row"><code>MMM dd, yyyy</code> → Гру 25, 2024</div>
        <div class="format-row"><code>yyyy-WW</code> → 2024-52 (тиждень)</div>
        <div class="format-row"><code>MM.yyyy</code> → 12.2024 (місяць)</div>
        <div class="format-row"><code>yyyy</code> → 2024 (рік)</div>
        <div class="format-row"><code>dd.MM.yyyy HH:mm:ss</code> → 25.12.2024 14:30:45</div>
        <div class="format-row"><code>timestamp</code> → 1703515845000</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .date-picker-examples {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .example-section {
    margin-bottom: 32px;
  }

  .example-section h3 {
    margin-bottom: 16px;
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 8px;
  }

  .example-row {
    margin-bottom: 16px;
    max-width: 400px;
  }

  .values-display {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .value-item {
    margin-bottom: 8px;
    padding: 4px 0;
  }

  .value-item strong {
    color: #495057;
    margin-right: 8px;
  }

  .format-examples {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .format-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    padding: 4px 8px;
    background: white;
    border-radius: 4px;
    border: 1px solid #dee2e6;
  }

  .format-row code {
    color: #e83e8c;
    font-weight: 600;
  }

  h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 32px;
  }
</style>
