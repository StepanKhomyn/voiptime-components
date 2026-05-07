<script lang="ts" setup>
  import VChart from '@/components/charts/VChart.vue';
  import type {
    ChartSegment,
    RadialProgressChartProps,
    SparklineChartProps,
    TreemapChartProps,
  } from '@/components/charts/types';
  import { VChartType } from '@/components/charts/types';
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

  // ── Sparkline дані ────────────────────────────────────────────────────────────
  const sparklineDailyCost: SparklineChartProps = {
    type: VChartType.sparkline,
    area: true,
    height: 180,
    points: [
      { label: 'Apr 28', primary: 0.49, secondary: 4 },
      { label: 'Apr 29', primary: 0.73, secondary: 5 },
      { label: 'Apr 30', primary: 0.13, secondary: 6 },
      { label: 'May 1', primary: 0.21, secondary: 10 },
      { label: 'May 2', primary: 1.17, secondary: 9 },
      { label: 'May 3', primary: 0.52, secondary: 11 },
      { label: 'May 4', primary: 0.45, secondary: 9 },
      { label: 'May 5', primary: 0.18, secondary: 15 },
      { label: 'May 6', primary: 3.38, secondary: 9 },
      { label: 'May 7', primary: 0.34, secondary: 4 },
    ],
    series: [
      { key: 'primary', label: 'Cost (USD)', color: '#6c5ce7', format: v => `$${v.toFixed(2)}` },
      { key: 'secondary', label: 'Requests', color: '#00b894', format: v => String(Math.round(v)) },
    ],
  };

  const sparklineSingleSeries: SparklineChartProps = {
    type: VChartType.sparkline,
    area: false,
    height: 120,
    points: [
      { label: 'Mon', primary: 18 },
      { label: 'Tue', primary: 34 },
      { label: 'Wed', primary: 27 },
      { label: 'Thu', primary: 42 },
      { label: 'Fri', primary: 38 },
      { label: 'Sat', primary: 12 },
      { label: 'Sun', primary: 9 },
    ],
    series: [{ key: 'primary', label: 'Calls', color: '#3b82f6', format: v => String(Math.round(v)) }],
  };

  // ── Treemap дані ──────────────────────────────────────────────────────────────
  const treemapModelCosts: TreemapChartProps = {
    type: VChartType.treemap,
    height: 260,
    format: v => `$${v.toFixed(2)}`,
    nodes: [
      { id: 'gemini-2.5-ultra', label: 'gemini-2.5-ultra', value: 3.66, color: '#1a73e8', group: 'GEMINI' },
      { id: 'o3', label: 'o3', value: 1.52, color: '#10a37f', group: 'OPENAI' },
      { id: 'claude-opus-4-5', label: 'claude-opus-4-5', value: 1.28, color: '#d97757', group: 'ANTHROPIC' },
      { id: 'gemini-2.5-pro-preview', label: 'gemini-2.5-pro-preview', value: 0.46, color: '#4285f4', group: 'GEMINI' },
      { id: 'claude-sonnet-4-5', label: 'claude-sonnet-4-5', value: 0.19, color: '#e8896a', group: 'ANTHROPIC' },
      { id: 'gpt-4o', label: 'gpt-4o', value: 0.18, color: '#1ab394', group: 'OPENAI' },
      { id: 'gemini-2.0-pro-exp', label: 'gemini-2.0-pro-exp', value: 0.17, color: '#669df6', group: 'GEMINI' },
      {
        id: 'gemini-2.5-flash-preview',
        label: 'gemini-2.5-flash-preview',
        value: 0.09,
        color: '#a8c7fa',
        group: 'GEMINI',
      },
      { id: 'o4-mini', label: 'o4-mini', value: 0.04, color: '#34c5a7', group: 'OPENAI' },
      { id: 'claude-haiku-4-5', label: 'claude-haiku-4-5', value: 0.01, color: '#f0a080', group: 'ANTHROPIC' },
    ],
  };

  const treemapSmall: TreemapChartProps = {
    type: VChartType.treemap,
    height: 180,
    format: v => String(v),
    nodes: [
      { id: 'a', label: 'GEMINI', value: 34, color: '#1a73e8' },
      { id: 'b', label: 'OPENAI', value: 27, color: '#10a37f' },
      { id: 'c', label: 'ANTHROPIC', value: 21, color: '#d97757' },
    ],
  };

  // ── Radial Progress дані ──────────────────────────────────────────────────────
  const radialSuccess: RadialProgressChartProps = {
    type: VChartType.radialProgress,
    value: 84.3,
    label: 'Success Rate',
    sublabel: '43 / 51',
    color: '#00b894',
    size: 160,
    strokeWidth: 14,
  };

  const radialLow: RadialProgressChartProps = {
    type: VChartType.radialProgress,
    value: 32,
    label: 'Cache Hit',
    color: '#f59e0b',
    size: 140,
    strokeWidth: 12,
  };

  const radialFull: RadialProgressChartProps = {
    type: VChartType.radialProgress,
    value: 100,
    label: 'Completed',
    color: '#6c5ce7',
    size: 140,
    strokeWidth: 12,
  };

  // ── Props tables ──────────────────────────────────────────────────────────────
  const propsSections: TableSection[] = [
    {
      title: 'Props (VChart — загальні)',
      rows: [
        {
          name: 'type',
          type: "'donut' | 'horizontal-bar' | 'scale-bar' | 'sparkline' | 'treemap' | 'radial-progress'",
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
    {
      title: 'Props — type="sparkline"',
      rows: [
        {
          name: 'points',
          type: 'SparklineDataPoint[]',
          default: '-',
          description: 'Масив точок { label, primary, secondary? }',
          required: true,
        },
        {
          name: 'series',
          type: 'SparklineSeries[]',
          default: '-',
          description: 'Конфігурація серій { key, label, color, format? }',
          required: true,
        },
        { name: 'height', type: 'number', default: '160', description: 'Висота canvas у пікселях' },
        { name: 'area', type: 'boolean', default: 'false', description: 'Показувати area-fill під primary лінією' },
      ],
    },
    {
      title: 'Props — type="treemap"',
      rows: [
        {
          name: 'nodes',
          type: 'TreemapNode[]',
          default: '-',
          description: 'Масив вузлів { id, label, value, color, group? }',
          required: true,
        },
        {
          name: 'format',
          type: '(v: number) => string',
          default: 'String(v)',
          description: 'Форматувати значення для підписів / tooltip',
        },
        { name: 'height', type: 'number', default: '260', description: 'Висота SVG у пікселях' },
      ],
    },
    {
      title: 'Props — type="radial-progress"',
      rows: [
        { name: 'value', type: 'number', default: '-', description: 'Значення 0–100', required: true },
        { name: 'label', type: 'string', default: 'undefined', description: 'Основний підпис по центру' },
        { name: 'sublabel', type: 'string', default: 'undefined', description: 'Другорядний підпис (напр. "43 / 51")' },
        { name: 'color', type: 'string', default: 'var(--color-primary-main)', description: 'Колір дуги заповнення' },
        { name: 'trackColor', type: 'string', default: "'#eee'", description: 'Колір фонової дуги' },
        { name: 'size', type: 'number', default: '160', description: 'Розмір SVG у пікселях' },
        { name: 'strokeWidth', type: 'number', default: '14', description: 'Товщина дуги' },
      ],
    },
  ];

  const typesSections: TableSection[] = [
    {
      title: 'ChartSegment',
      rows: [
        { name: 'label', type: 'string', default: '-', description: 'Підпис сегмента / смужки', required: true },
        { name: 'count', type: 'number', default: '-', description: 'Числове значення', required: true },
        { name: 'color', type: 'string', default: '-', description: 'CSS колір (#hex, rgb…)', required: true },
        {
          name: 'icon',
          type: 'Component',
          default: 'undefined',
          description: 'Vue-компонент іконки (замість кольорового кружка у bar)',
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
    {
      title: 'SparklineDataPoint',
      rows: [
        { name: 'label', type: 'string', default: '-', description: 'Підпис по осі X (напр. дата)', required: true },
        { name: 'primary', type: 'number', default: '-', description: 'Значення основної серії', required: true },
        {
          name: 'secondary',
          type: 'number',
          default: 'undefined',
          description: "Значення другої серії (необов'язково)",
        },
      ],
    },
    {
      title: 'SparklineSeries',
      rows: [
        {
          name: 'key',
          type: "'primary' | 'secondary'",
          default: '-',
          description: 'Яку серію рендерить цей конфіг',
          required: true,
        },
        { name: 'label', type: 'string', default: '-', description: 'Назва серії для легенди', required: true },
        { name: 'color', type: 'string', default: '-', description: 'CSS колір лінії та точок', required: true },
        {
          name: 'format',
          type: '(v: number) => string',
          default: 'String(v)',
          description: 'Форматувати значення у tooltip',
        },
      ],
    },
    {
      title: 'TreemapNode',
      rows: [
        { name: 'id', type: 'string', default: '-', description: 'Унікальний ідентифікатор', required: true },
        { name: 'label', type: 'string', default: '-', description: 'Підпис на тайлі', required: true },
        {
          name: 'value',
          type: 'number',
          default: '-',
          description: 'Числове значення (визначає площу)',
          required: true,
        },
        { name: 'color', type: 'string', default: '-', description: 'Колір тайлу', required: true },
        {
          name: 'group',
          type: 'string',
          default: 'undefined',
          description: 'Групова мітка (для легенди / логіки фарбування)',
        },
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

    <!-- ─── Sparkline ─── -->
    <DocSection title="Sparkline — лінійний часовий ряд">
      <DocPreview title="Дві серії: витрата + запити (з area-fill)">
        <div style="width: 100%">
          <VChart v-bind="sparklineDailyCost" />
        </div>
      </DocPreview>

      <DocPreview title="Одна серія без area-fill">
        <div style="width: 100%">
          <VChart v-bind="sparklineSingleSeries" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Treemap ─── -->
    <DocSection title="Treemap — зважена плиткова карта">
      <DocPreview title="Витрати по моделях AI">
        <div style="width: 100%">
          <VChart v-bind="treemapModelCosts" />
        </div>
      </DocPreview>

      <DocPreview title="Розподіл запитів по провайдерах">
        <div style="width: 100%">
          <VChart v-bind="treemapSmall" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Radial Progress ─── -->
    <DocSection title="Radial Progress — радіальна шкала 270°">
      <DocPreview title="Success Rate з підзаголовком">
        <VChart v-bind="radialSuccess" />
      </DocPreview>

      <DocPreview title="Різні кольори та значення">
        <div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap">
          <VChart v-bind="radialLow" />
          <VChart v-bind="radialFull" />
          <VChart
            :type="VChartType.radialProgress"
            :value="0"
            label="No Data"
            color="#e0e0e0"
            :size="140"
            :stroke-width="12"
          />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Всі разом ─── -->
    <DocSection
      description="Типовий приклад використання всіх типів на одній сторінці"
      title="Комбінація — дашборд колл-центру"
    >
      <DocPreview>
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
            >
              Human vs VM
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
        Замість кольорового кружка у горизонтальному баркарті можна передати Vue-компонент іконки через
        <code>icon</code> — наприклад SVG-іконку каналу.
      </DocFeature>
      <DocFeature icon="📈" title="Sparkline — responsive через ResizeObserver">
        Canvas автоматично перемальовується при зміні ширини контейнера. Підтримує одну або дві незалежні серії з
        окремими Y-осями. При hover відображається crosshair та tooltip з усіма значеннями точки.
      </DocFeature>
      <DocFeature icon="🗺️" title="Treemap — squarified алгоритм">
        Використовує squarify без зовнішніх залежностей — тайли максимально наближені до квадратної форми. Підписи та
        значення приховуються автоматично якщо тайл занадто малий. Hover — <code>filter: brightness</code>.
      </DocFeature>
      <DocFeature icon="🎯" title="Radial Progress — 270° дуга з CSS-анімацією">
        Заповнення анімується через <code>stroke-dasharray</code> transition при зміні <code>value</code>. Коректно
        обробляє крайні значення: 0% і 100%.
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
