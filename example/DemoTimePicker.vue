<template>
  <div class="timepicker-examples">
    <h2>VTimePicker Examples</h2>

    <!-- Single Time Picker -->
    <div class="example-section">
      <h3>Одиночний вибір часу</h3>

      <div class="example-group">
        <label>Звичайний TimePicker:</label>
        <VTimePicker v-model="singleTime" placeholder="Оберіть час" @change="onSingleTimeChange" />
        <p>Вибраний час: {{ singleTime || 'Не вибрано' }}</p>
      </div>

      <div class="example-group">
        <label>Без секунд:</label>
        <VTimePicker v-model="timeWithoutSeconds" :show-seconds="false" format="HH:mm" placeholder="Оберіть час" />
        <p>Вибраний час: {{ timeWithoutSeconds || 'Не вибрано' }}</p>
      </div>

      <div class="example-group">
        <label>12-годинний формат:</label>
        <VTimePicker v-model="time12h" :use12-hours="true" format="hh:mm:ss A" placeholder="Оберіть час" />
        <p>Вибраний час: {{ time12h || 'Не вибрано' }}</p>
      </div>
    </div>

    <!-- Time Range Picker -->
    <div class="example-section">
      <h3>Діапазон часу</h3>

      <div class="example-group">
        <label>Звичайний TimeRange:</label>
        <VTimePicker
          v-model="timeRange"
          end-placeholder="Кінцевий час"
          start-placeholder="Початковий час"
          type="timerange"
          @change="onTimeRangeChange"
        />
        <p>Вибраний діапазон: {{ formatTimeRange(timeRange) }}</p>
      </div>

      <div class="example-group">
        <label>TimeRange без секунд:</label>
        <VTimePicker
          v-model="timeRangeNoSeconds"
          :show-seconds="false"
          end-placeholder="До"
          format="HH:mm"
          start-placeholder="Від"
          type="timerange"
        />
        <p>Вибраний діапазон: {{ formatTimeRange(timeRangeNoSeconds) }}</p>
      </div>

      <div class="example-group">
        <label>12-годинний діапазон:</label>
        <VTimePicker
          v-model="timeRange12h"
          :show-seconds="false"
          :use12-hours="true"
          end-placeholder="До"
          format="hh:mm A"
          start-placeholder="Від"
          type="timerange"
        />
        <p>Вибраний діапазон: {{ formatTimeRange(timeRange12h) }}</p>
      </div>
    </div>

    <!-- Different Sizes -->
    <div class="example-section">
      <h3>Різні розміри</h3>

      <div class="size-examples">
        <div class="size-group">
          <label>Малий:</label>
          <VTimePicker v-model="sizeSmall" placeholder="Малий" size="small" />
        </div>

        <div class="size-group">
          <label>Звичайний:</label>
          <VTimePicker v-model="sizeDefault" placeholder="Звичайний" size="default" />
        </div>

        <div class="size-group">
          <label>Великий:</label>
          <VTimePicker v-model="sizeLarge" placeholder="Великий" size="large" />
        </div>
      </div>
    </div>

    <!-- Disabled and Custom Steps -->
    <div class="example-section">
      <h3>Додаткові параметри</h3>

      <div class="example-group">
        <label>Вимкнений:</label>
        <VTimePicker v-model="disabledTime" disabled placeholder="Вимкнений" />
      </div>

      <div class="example-group">
        <label>Кроки: години +2, хвилини +15:</label>
        <VTimePicker
          v-model="customStepsTime"
          :hour-step="2"
          :minute-step="15"
          :second-step="30"
          placeholder="Власні кроки"
        />
        <p>Вибраний час: {{ customStepsTime || 'Не вибрано' }}</p>
      </div>

      <div class="example-group">
        <label>Без кнопки очищення:</label>
        <VTimePicker v-model="noClearTime" :clearable="false" placeholder="Без очищення" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import VTimePicker from '@/components/timepicker/VTimePicker.vue';

  // Single time pickers
  const singleTime = ref('14:30:00');
  const timeWithoutSeconds = ref('09:15');
  const time12h = ref('02:30:00 PM');

  // Time range pickers
  const timeRange = ref(['09:00:00', '17:00:00']);
  const timeRangeNoSeconds = ref(['09:00', '17:30']);
  const timeRange12h = ref(['09:00 AM', '05:30 PM']);

  // Size examples
  const sizeSmall = ref('');
  const sizeDefault = ref('');
  const sizeLarge = ref('');

  // Special cases
  const disabledTime = ref('12:00:00');
  const customStepsTime = ref('');
  const noClearTime = ref('10:30:00');

  // Event handlers
  const onSingleTimeChange = value => {
    console.log('Single time changed:', value);
  };

  const onTimeRangeChange = value => {
    console.log('Time range changed:', value);
  };

  // Helper functions
  const formatTimeRange = range => {
    if (!range || !Array.isArray(range)) return 'Не вибрано';
    return `${range[0] || 'Не вибрано'} - ${range[1] || 'Не вибрано'}`;
  };
</script>

<style scoped>
  .timepicker-examples {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .example-section {
    margin-bottom: 40px;
    padding: 20px;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
  }

  .example-section h3 {
    margin-top: 0;
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
  }

  .example-group {
    margin-bottom: 20px;
  }

  .example-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #34495e;
  }

  .example-group p {
    margin-top: 8px;
    padding: 8px 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    font-family: monospace;
    color: #495057;
    border-left: 3px solid #3498db;
  }

  .size-examples {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .size-group {
    flex: 1;
    min-width: 200px;
  }

  .size-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #34495e;
  }

  @media (max-width: 768px) {
    .size-examples {
      flex-direction: column;
    }

    .size-group {
      min-width: auto;
    }
  }
</style>
