<script lang="ts" setup>
  import { ref } from 'vue';
  import VDatePicker from '@/components/datepicker/VDatePicker.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  // ── Стани ────────────────────────────────────────────────────────────────────
  const basicDate = ref<Date | null>(new Date());
  const basicDateTime = ref<Date | null>(null);
  const monthDate = ref<Date | null>(null);
  const yearDate = ref<Date | null>(null);

  const dateRange = ref<Date[] | null>(null);
  const dateTimeRange = ref<Date[] | null>(null);
  const monthRange = ref<Date[] | null>(null);
  const yearRange = ref<Date[] | null>(null);

  const customFormat = ref<Date | null>(null);
  const isoFormat = ref<string | null>(null);
  const tsFormat = ref<number | null>(null);

  const disabledDate = ref<Date | null>(new Date());
  const notClearable = ref<Date | null>(null);
  const outlinedDate = ref<Date | null>(null);

  // ── Документація ─────────────────────────────────────────────────────────────
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'modelValue',
          type: 'Date | Date[] | string | string[] | number',
          default: 'undefined',
          description: 'Значення (v-model)',
        },
        {
          name: 'type',
          type: "'date' | 'datetime' | 'month' | 'year' | 'daterange' | 'datetimerange' | 'monthrange' | 'yearrange'",
          default: "'date'",
          description: 'Тип пікера',
        },
        { name: 'placeholder', type: 'string', default: "'Оберіть дату'", description: 'Текст плейсхолдера' },
        { name: 'label', type: 'string', default: '-', description: 'Текст лейблу' },
        { name: 'outlined', type: 'boolean', default: 'false', description: 'Відображати лейбл і помилки на бордері' },
        { name: 'required', type: 'boolean', default: 'false', description: "Обов'язкове поле (разом з outlined)" },
        {
          name: 'startPlaceholder',
          type: 'string',
          default: "'Початкова дата'",
          description: 'Плейсхолдер початку для range',
        },
        {
          name: 'endPlaceholder',
          type: 'string',
          default: "'Кінцева дата'",
          description: 'Плейсхолдер кінця для range',
        },
        { name: 'rangeSeparator', type: 'string', default: "' - '", description: 'Роздільник дат для range' },
        { name: 'format', type: 'string', default: "''", description: 'Формат відображення дати' },
        {
          name: 'valueFormat',
          type: 'string',
          default: "''",
          description: 'Формат значення що зберігається у v-model',
        },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований стан' },
        { name: 'clearable', type: 'boolean', default: 'true', description: 'Показувати кнопку очищення' },
        {
          name: 'previousDateDisabled',
          type: 'boolean',
          default: 'false',
          description: 'Забороняти вибір минулих дат',
        },
        {
          name: 'maxDateRange',
          type: 'number',
          default: 'null',
          description: 'Максимальний діапазон дат (в днях) для range',
        },
        { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Розмір компонента' },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'change', type: 'Date | Date[] | string | number', description: 'Зміна значення після підтвердження' },
        { name: 'blur', type: 'FocusEvent', description: 'Втрата фокусу' },
        { name: 'focus', type: 'FocusEvent', description: 'Отримання фокусу' },
      ],
    },
  ];

  const formatRows = [
    { token: 'yyyy', meaning: 'Рік', example: '2024' },
    { token: 'MM', meaning: 'Місяць', example: '01' },
    { token: 'M', meaning: 'Місяць', example: '1 (без нуля)' },
    { token: 'MMMM', meaning: 'Місяць', example: 'January' },
    { token: 'dd', meaning: 'День', example: '02' },
    { token: 'd', meaning: 'День', example: '2 (без нуля)' },
    { token: 'HH', meaning: 'Год 24h', example: '03' },
    { token: 'mm', meaning: 'Хвилини', example: '04' },
    { token: 'ss', meaning: 'Секунди', example: '05' },
    { token: 'timestamp', meaning: 'Unix timestamp', example: '1483326245000' },
    { token: '[текст]', meaning: 'Екранування символів', example: 'dd [рік] → 02 рік' },
  ];
</script>

<template>
  <div class="datepicker-showcase">
    <!-- ─── Базові типи ─── -->
    <DocSection title="Базові типи">
      <DocPreview title="date">
        <VDatePicker v-model="basicDate" placeholder="Оберіть дату" previous-date-disabled type="date" />
      </DocPreview>

      <DocPreview title="datetime">
        <VDatePicker v-model="basicDateTime" placeholder="Оберіть дату і час" type="datetime" />
      </DocPreview>

      <DocPreview title="month">
        <VDatePicker v-model="monthDate" placeholder="Оберіть місяць" type="month" />
      </DocPreview>

      <DocPreview title="year">
        <VDatePicker v-model="yearDate" placeholder="Оберіть рік" type="year" />
      </DocPreview>
    </DocSection>

    <!-- ─── Outlined з лейблом ─── -->
    <DocSection description="outlined + label виводить лейбл і помилки на бордері інпута" title="Outlined з лейблом">
      <DocPreview>
        <VDatePicker v-model="outlinedDate" label="Дата народження" outlined required type="date" />
      </DocPreview>
    </DocSection>

    <!-- ─── Range ─── -->
    <DocSection title="Діапазони дат">
      <DocPreview title="daterange">
        <VDatePicker
          v-model="dateRange"
          end-placeholder="Кінець"
          range-separator=" — "
          start-placeholder="Початок"
          type="daterange"
        />
      </DocPreview>

      <DocPreview title="datetimerange з maxDateRange=31">
        <VDatePicker
          v-model="dateTimeRange"
          :max-date-range="31"
          end-placeholder="Кінець"
          start-placeholder="Початок"
          type="datetimerange"
        />
      </DocPreview>

      <DocPreview title="monthrange">
        <VDatePicker
          v-model="monthRange"
          end-placeholder="Кінець місяця"
          start-placeholder="Початок місяця"
          type="monthrange"
        />
      </DocPreview>

      <DocPreview title="yearrange">
        <VDatePicker
          v-model="yearRange"
          end-placeholder="Кінцевий рік"
          start-placeholder="Початковий рік"
          type="yearrange"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Формати ─── -->
    <DocSection title="Формати відображення і значення">
      <DocPreview title='format="dd/MM/yyyy"'>
        <VDatePicker v-model="customFormat" format="dd/MM/yyyy" placeholder="дд/мм/рррр" />
      </DocPreview>

      <DocPreview title='format display + value-format="yyyy-MM-dd"'>
        <VDatePicker
          v-model="isoFormat"
          format="dd/MM/yyyy"
          placeholder="Зберігається як ISO рядок"
          value-format="yyyy-MM-dd"
        />
        <div v-if="isoFormat" class="value-badge">v-model: {{ isoFormat }}</div>
      </DocPreview>

      <DocPreview title='value-format="timestamp"'>
        <VDatePicker v-model="tsFormat" placeholder="Зберігається як timestamp" value-format="timestamp" />
        <div v-if="tsFormat" class="value-badge">v-model: {{ tsFormat }}</div>
      </DocPreview>

      <DocPreview title='Екранування: format="dd MMMM yyyy [рік]"'>
        <VDatePicker v-model="customFormat" format="dd MMMM yyyy [рік]" placeholder="01 January 2024 рік" />
      </DocPreview>
    </DocSection>

    <!-- ─── Стани ─── -->
    <DocSection title="Стани">
      <DocPreview>
        <VDatePicker v-model="disabledDate" disabled placeholder="Заблокований" />
        <VDatePicker v-model="notClearable" :clearable="false" placeholder="Без кнопки очищення" />
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Формати токени ─── -->
    <DocSection title="Токени формату">
      <div class="format-table-wrap">
        <table class="format-table">
          <thead>
            <tr>
              <th>Токен</th>
              <th>Значення</th>
              <th>Приклад</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in formatRows" :key="row.token">
              <td
                ><code>{{ row.token }}</code></td
              >
              <td>{{ row.meaning }}</td>
              <td>{{ row.example }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🔄" title="format vs valueFormat">
        <code>format</code> — як дата <em>відображається</em> користувачу. <code>value-format</code> — у якому форматі
        значення потрапляє в <code>v-model</code>. Без <code>value-format</code> — зберігається об'єкт
        <code>Date</code>.
      </DocFeature>
      <DocFeature icon="📅" title="previousDateDisabled">
        Забороняє вибір дат раніше сьогодні — зручно для форм бронювання або планування майбутніх подій.
      </DocFeature>
      <DocFeature icon="📏" title="maxDateRange для range">
        <code>:max-date-range="31"</code> обмежує максимальний діапазон в днях — корисно для звітів щоб уникнути занадто
        великих запитів.
      </DocFeature>
      <DocFeature icon="🏷️" title="outlined + label">
        Режим <code>outlined</code> перетворює компонент на поле з плаваючим лейблом і відображенням помилок прямо на
        бордері — для використання у формах.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .datepicker-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .value-badge {
    margin-top: 0.5rem;
    padding: 0.3rem 0.75rem;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 5px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: #0c4a6e;
  }

  .format-table-wrap {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #e5e9f0;
  }

  .format-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;

    th {
      background: #f5f7fa;
      padding: 0.6rem 1rem;
      text-align: left;
      font-weight: 600;
      color: #555;
      border-bottom: 1px solid #e5e9f0;
    }

    td {
      padding: 0.55rem 1rem;
      border-bottom: 1px solid #f0f2f6;
      color: #444;

      code {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        background: #eaf4fd;
        color: #1a6fa8;
        padding: 0.1rem 0.35rem;
        border-radius: 4px;
      }
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr:hover td {
      background: #f9fbff;
    }
  }
</style>
