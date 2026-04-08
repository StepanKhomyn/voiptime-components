<script lang="ts" setup>
  import { ref } from 'vue';
  import VTimePicker from '@/components/timepicker/VTimePicker.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  const basic = ref('14:30:00');
  const outlined = ref('14:30:00');
  const range = ref(['09:00:00', '17:00:00']);
  const time12h = ref('02:30:00 PM');
  const noSeconds = ref('14:30');
  const withSteps = ref('10:15:30');

  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'modelValue',
          type: 'string | Date | [string, string] | null',
          default: 'undefined',
          description: 'Значення (v-model)',
        },
        { name: 'type', type: "'time' | 'timerange'", default: "'time'", description: 'Тип пікера' },
        { name: 'placeholder', type: 'string', default: "'Оберіть час'", description: 'Плейсхолдер' },
        { name: 'label', type: 'string', default: '-', description: 'Текст лейблу' },
        { name: 'outlined', type: 'boolean', default: 'false', description: 'Лейбл і помилки на бордері' },
        {
          name: 'startPlaceholder',
          type: 'string',
          default: "'Початковий час'",
          description: 'Плейсхолдер початку для range',
        },
        {
          name: 'endPlaceholder',
          type: 'string',
          default: "'Кінцевий час'",
          description: 'Плейсхолдер кінця для range',
        },
        { name: 'rangeSeparator', type: 'string', default: "' - '", description: 'Роздільник діапазону' },
        { name: 'format', type: 'string', default: "'HH:mm:ss'", description: 'Формат відображення часу' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований стан' },
        { name: 'clearable', type: 'boolean', default: 'true', description: 'Кнопка очищення' },
        { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Розмір компонента' },
        { name: 'showSeconds', type: 'boolean', default: 'true', description: 'Показувати секунди' },
        { name: 'use12Hours', type: 'boolean', default: 'false', description: '12-годинний формат (AM/PM)' },
        { name: 'hourStep', type: 'number', default: '1', description: 'Крок для годин' },
        { name: 'minuteStep', type: 'number', default: '1', description: 'Крок для хвилин' },
        { name: 'secondStep', type: 'number', default: '1', description: 'Крок для секунд' },
        {
          name: 'disabledHours',
          type: '() => number[]',
          default: 'undefined',
          description: 'Функція що повертає список заблокованих годин',
        },
        {
          name: 'disabledMinutes',
          type: '(hour: number) => number[]',
          default: 'undefined',
          description: 'Заблоковані хвилини залежно від години',
        },
        {
          name: 'disabledSeconds',
          type: '(hour: number, minute: number) => number[]',
          default: 'undefined',
          description: 'Заблоковані секунди залежно від год. і хв.',
        },
        {
          name: 'hideDisabledOptions',
          type: 'boolean',
          default: 'false',
          description: 'Приховувати заблоковані значення замість сірення',
        },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'update:modelValue', type: 'TimePickerValue', description: 'Зміна значення (v-model)' },
        { name: 'change', type: 'TimePickerValue', description: 'Підтвердження вибору часу' },
        { name: 'focus', type: 'any', description: 'Отримання фокусу' },
        { name: 'blur', type: 'any', description: 'Втрата фокусу' },
        { name: 'open-change', type: 'boolean', description: 'Відкриття / закриття dropdown' },
      ],
    },
    {
      title: 'Методи (ref)',
      rows: [
        { name: 'focus()', type: 'void', description: 'Встановити фокус' },
        { name: 'blur()', type: 'void', description: 'Зняти фокус' },
        { name: 'open()', type: 'void', description: 'Відкрити dropdown' },
        { name: 'close()', type: 'void', description: 'Закрити dropdown' },
      ],
    },
    {
      title: 'TypeScript типи',
      rows: [
        { name: 'TimeValue', type: 'string | Date', description: 'Одиночне значення часу' },
        { name: 'TimeRangeValue', type: '[TimeValue, TimeValue]', description: 'Діапазон часу' },
        {
          name: 'TimePickerValue',
          type: 'TimeValue | TimeRangeValue | null | undefined',
          description: 'Будь-яке значення пікера',
        },
      ],
    },
  ];
</script>

<template>
  <div class="timepicker-showcase">
    <!-- ─── Базові типи ─── -->
    <DocSection title="Базові типи">
      <DocPreview title="Одиночний час">
        <VTimePicker v-model="basic" placeholder="Оберіть час" />
      </DocPreview>

      <DocPreview title="Outlined з лейблом">
        <VTimePicker v-model="outlined" label="Час роботи" outlined />
      </DocPreview>

      <DocPreview title="Діапазон часу (timerange)">
        <VTimePicker
          v-model="range"
          end-placeholder="Кінець"
          range-separator=" до "
          start-placeholder="Початок"
          type="timerange"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Формати ─── -->
    <DocSection title="Формати часу">
      <DocPreview title="12-годинний формат (use12Hours)">
        <VTimePicker v-model="time12h" format="hh:mm:ss A" placeholder="Оберіть час" use12-hours />
      </DocPreview>

      <DocPreview title='Без секунд (:show-seconds="false")'>
        <VTimePicker v-model="noSeconds" :show-seconds="false" format="HH:mm" placeholder="Оберіть час" />
      </DocPreview>
    </DocSection>

    <!-- ─── Кроки та обмеження ─── -->
    <DocSection
      description="hourStep / minuteStep / secondStep — крок прокрутки. disabledHours / disabledMinutes — які значення недоступні"
      title="Кроки та заблоковані значення"
    >
      <DocPreview
        :script="`
const withSteps = ref('10:15:30')

const disabledHours   = () => [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]
const disabledMinutes = (hour) => hour === 10 ? [0, 15, 30, 45] : []
        `"
      >
        <VTimePicker
          v-model="withSteps"
          :disabled-hours="() => [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]"
          :disabled-minutes="hour => (hour === 10 ? [0, 15, 30, 45] : [])"
          :hour-step="2"
          :minute-step="15"
          :second-step="30"
          placeholder="Час з кроками та обмеженнями"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Стани ─── -->
    <DocSection title="Стани">
      <DocPreview>
        <VTimePicker v-model="basic" placeholder="Звичайний" />
        <VTimePicker v-model="basic" disabled placeholder="Заблокований" />
        <VTimePicker v-model="basic" :clearable="false" placeholder="Без кнопки очищення" />
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🔒" title="disabledMinutes залежить від години">
        <code>:disabled-minutes="(hour) => hour === 22 ? [30, 45] : []"</code> — функція отримує поточну вибрану годину
        і повертає список заблокованих хвилин. Аналогічно <code>disabledSeconds</code> отримує і годину і хвилину.
      </DocFeature>
      <DocFeature icon="🕐" title="use12Hours + format">
        При <code>use12-hours</code> використовуй <code>format="hh:mm:ss A"</code> (велика A — AM/PM) або
        <code>format="hh:mm:ss a"</code> (мала a — am/pm).
      </DocFeature>
      <DocFeature icon="👁️" title="hideDisabledOptions">
        За замовчуванням заблоковані значення показуються сірим.
        <code>:hide-disabled-options="true"</code> — повністю приховує їх зі списку.
      </DocFeature>
      <DocFeature icon="🏷️" title="outlined режим">
        Аналогічно до VInput і VDatePicker — <code>outlined</code> переводить лейбл у floating-стиль на бордері
        компонента.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .timepicker-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
