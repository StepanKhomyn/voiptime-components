<script lang="ts" setup>
  import VChart from '@/components/charts/VChart.vue';
  import type { ChartSegment } from '@/components/charts/types';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  // ── Donut дані ────────────────────────────────────────────────────────────────
  const callResults: ChartSegment[] = [
    { label: 'Voicemail', count: 456, color: '#f59e0b' },
    { label: 'Human', count: 55, color: '#10b981' },
    { label: 'Not predicted', count: 644, color: '#ef4444' },
  ];

  const statusSegments: ChartSegment[] = [
    { label: 'Completed', count: 320, color: '#3b82f6' },
    { label: 'In progress', count: 145, color: '#8b5cf6' },
    { label: 'Pending', count: 88, color: '#f59e0b' },
    { label: 'Failed', count: 23, color: '#ef4444' },
  ];

  // ── Horizontal Bar дані ───────────────────────────────────────────────────────
  const channelSegments: ChartSegment[] = [
    { label: 'Inbound', count: 712, color: '#3b82f6' },
    { label: 'Outbound', count: 489, color: '#10b981' },
    { label: 'Callback', count: 203, color: '#f59e0b' },
    { label: 'Voicemail', count: 156, color: '#ef4444' },
  ];

  const agentSegments: ChartSegment[] = [
    { label: 'Alice', count: 245, color: '#6366f1' },
    { label: 'Bob', count: 198, color: '#ec4899' },
    { label: 'Carol', count: 312, color: '#14b8a6' },
    { label: 'David', count: 167, color: '#f97316' },
    { label: 'Eve', count: 289, color: '#8b5cf6' },
  ];

  // ── Scale Bar дані ────────────────────────────────────────────────────────────
  const propsSections: TableSection[] = [
    {
      title: 'Props (VChart — загальні)',
      rows: [
        {
          name: 'type',
          type: "'donut' | 'horizontal-bar' | 'scale-bar'",
          default: '-',
          description: 'Тип графіку',
          required: true,
        },
      ],
    },
    {
      title: 'Props — type="donut"',
      rows: [
        {
          name: 'segments',
          type: 'ChartSegment[]',
          default: '-',
          description: 'Масив сегментів пирога',
          required: true,
        },
        { name: 'size', type: 'number', default: '200', description: 'Розмір canvas у пікселях' },
        { name: 'labels', type: 'boolean', default: 'false', description: 'Показувати легенду під графіком' },
      ],
    },
    {
      title: 'Props — type="horizontal-bar"',
      rows: [
        { name: 'segments', type: 'ChartSegment[]', default: '-', description: 'Масив смужок', required: true },
        { name: 'showAxis', type: 'boolean', default: 'false', description: 'Показувати вісь X з підписами значень' },
      ],
    },
    {
      title: 'Props — type="scale-bar"',
      rows: [
        {
          name: 'left',
          type: 'ScaleBarSide',
          default: '-',
          description: 'Ліва сторона — { label?, value }',
          required: true,
        },
        {
          name: 'right',
          type: 'ScaleBarSide',
          default: '-',
          description: 'Права сторона — { label?, value }',
          required: true,
        },
      ],
    },
  ];

  const typesSections: TableSection[] = [
    {
      title: 'ChartSegment',
      rows: [
        { name: 'label', type: 'string', default: '-', description: 'Підпис сегмента / смужки', required: true },
        { name: 'count', type: 'number', default: '-', description: 'Числове значення', required: true },
        { name: 'color', type: 'string', default: '-', description: 'CSS колір (#hex, rgb, тощо)', required: true },
        {
          name: 'icon',
          type: 'Component',
          default: 'undefined',
          description: 'Vue-компонент іконки (замість кольорового квадрату у bar)',
        },
      ],
    },
    {
      title: 'ScaleBarSide',
      rows: [
        { name: 'value', type: 'number', default: '-', description: 'Числове значення сторони', required: true },
        { name: 'label', type: 'string', default: 'undefined', description: 'Підпис сторони' },
      ],
    },
  ];
</script>

<template>
  <div class="chart-showcase">
    <!-- ─── Donut ─── -->
    <DocSection title="Donut — кільцева діаграма">
      <DocPreview title="З легендою (labels)">
        <VChart :labels="true" :segments="callResults" type="donut" />
      </DocPreview>

      <DocPreview title="Без легенди, кастомний розмір">
        <VChart :segments="callResults" :size="150" type="donut" />
        <VChart :segments="callResults" :size="250" type="donut" />
      </DocPreview>

      <DocPreview title="4 сегменти — статуси завдань">
        <VChart :labels="true" :segments="statusSegments" :size="220" type="donut" />
      </DocPreview>

      <DocPreview title="Порожній стан (усі count=0)">
        <VChart
          :labels="true"
          :segments="[
            { label: 'A', count: 0, color: '#3b82f6' },
            { label: 'B', count: 0, color: '#10b981' },
          ]"
          type="donut"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Horizontal Bar ─── -->
    <DocSection title="Horizontal Bar — горизонтальні смужки">
      <DocPreview title="Канали дзвінків">
        <div style="width: 100%">
          <VChart :segments="channelSegments" type="horizontal-bar" />
        </div>
      </DocPreview>

      <DocPreview title="З віссю (showAxis)">
        <div style="width: 100%">
          <VChart :segments="channelSegments" :show-axis="true" type="horizontal-bar" />
        </div>
      </DocPreview>

      <DocPreview title="5 агентів — навантаження">
        <div style="width: 100%">
          <VChart :segments="agentSegments" :show-axis="true" type="horizontal-bar" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Scale Bar ─── -->
    <DocSection title="Scale Bar — двосторонній прогрес-бар">
      <DocPreview title="Human vs Voicemail">
        <div style="width: 100%">
          <VChart :left="{ label: 'Human', value: 120 }" :right="{ label: 'Voicemail', value: 80 }" type="scale-bar" />
        </div>
      </DocPreview>

      <DocPreview title="Успішні vs Невдалі виклики">
        <div style="width: 100%">
          <VChart :left="{ label: 'Успішні', value: 789 }" :right="{ label: 'Невдалі', value: 143 }" type="scale-bar" />
        </div>
      </DocPreview>

      <DocPreview title="Рівний розподіл 50/50">
        <div style="width: 100%">
          <VChart
            :left="{ label: 'Inbound', value: 500 }"
            :right="{ label: 'Outbound', value: 500 }"
            type="scale-bar"
          />
        </div>
      </DocPreview>

      <DocPreview title="Без лейблів (тільки значення)">
        <div style="width: 100%">
          <VChart :left="{ value: 330 }" :right="{ value: 670 }" type="scale-bar" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Всі разом ─── -->
    <DocSection
      description="Типовий приклад використання всіх трьох типів на одній сторінці"
      title="Комбінація — дашборд колл-центру"
    >
      <DocPreview
        :script="`
const segments: ChartSegment[] = [
  { label: 'Voicemail',     count: 456, color: '#f59e0b' },
  { label: 'Human',         count: 55,  color: '#10b981' },
  { label: 'Not predicted', count: 644, color: '#ef4444' },
]
        `"
      >
        <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start; width: 100%">
          <div>
            <div
              style="
                font-size: 0.75rem;
                color: #888;
                margin-bottom: 0.5rem;
                font-weight: 600;
                text-transform: uppercase;
              "
            >
              Результати дзвінків
            </div>
            <VChart :labels="true" :segments="callResults" :size="180" type="donut" />
          </div>
          <div style="flex: 1; min-width: 240px">
            <div
              style="
                font-size: 0.75rem;
                color: #888;
                margin-bottom: 0.5rem;
                font-weight: 600;
                text-transform: uppercase;
              "
            >
              Канали
            </div>
            <VChart :segments="channelSegments" :show-axis="true" type="horizontal-bar" />
          </div>
          <div style="width: 100%">
            <div
              style="
                font-size: 0.75rem;
                color: #888;
                margin-bottom: 0.5rem;
                font-weight: 600;
                text-transform: uppercase;
              "
              >Human vs VM
            </div>
            <VChart
              :left="{ label: 'Human', value: 55 }"
              :right="{ label: 'Voicemail', value: 456 }"
              type="scale-bar"
            />
          </div>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Типи ─── -->
    <DocSection title="TypeScript типи">
      <DocPropsTable :sections="typesSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🍩" title="Donut — hover показує count">
        При наведенні на сегмент donut-діаграми з'являється підказка з числовим значенням. Відстежується через canvas
        mousemove — не потребує зовнішніх бібліотек.
      </DocFeature>
      <DocFeature icon="⭕" title="Donut — порожній стан">
        Якщо всі <code>count === 0</code> — відображається сірий повний круг без помилок. Не потрібна додаткова обробка
        на стороні споживача.
      </DocFeature>
      <DocFeature icon="📊" title="Horizontal Bar — автомасштаб">
        Максимальне значення осі X обчислюється автоматично і округлюється до найближчого кратного 10. Вісь ділиться на
        5 рівних інтервалів.
      </DocFeature>
      <DocFeature icon="🎨" title="icon в ChartSegment">
        Замість кольорового квадрату у горизонтальному баркарті можна передати Vue-компонент іконки через
        <code>icon</code> — наприклад SVG-іконку каналу.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .chart-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
