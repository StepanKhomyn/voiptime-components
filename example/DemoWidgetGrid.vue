<script lang="ts" setup>
  import { ref } from 'vue';
  import VWidgetGrid from '@/components/widget-grid/VWidgetGrid.vue';
  import VWidgetCard from '@/components/widget-card/VWidgetCard.vue';
  import VDonutSummary from '@/components/donut-summary/VDonutSummary.vue';
  import type { VDonutSummaryItem } from '@/components/donut-summary/types';
  import VButton from '@/components/button/VButton.vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';
  import type { VWidgetGridLayout } from '@/components/widget-grid/types';
  import DocSection from './helper/DocSection.vue';
  import DocCodeBlock from './helper/DocCodeBlock.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';

  // ---------------- Дашборд як у кол-центрі ----------------
  const defaults: VWidgetGridLayout = [
    { id: 'inbound', x: 0, y: 0, w: 4, h: 5, minW: 3, minH: 3 },
    { id: 'online', x: 4, y: 0, w: 4, h: 5, minW: 3, minH: 3 },
    { id: 'users', x: 8, y: 0, w: 4, h: 5, minW: 3, minH: 3 },
    { id: 'calls', x: 0, y: 5, w: 6, h: 6, minW: 4, minH: 3 },
    { id: 'operators', x: 6, y: 5, w: 6, h: 6, minW: 4, minH: 3 },
    { id: 'sl', x: 0, y: 11, w: 12, h: 3, minH: 2 },
  ];

  // Компонент нічого не зберігає сам — розкладка живе там, де її тримає застосунок
  const layout = ref<VWidgetGridLayout>(defaults.map(i => ({ ...i })));
  const reset = () => (layout.value = defaults.map(i => ({ ...i })));
  const editing = ref(false);
  const compact = ref(true);
  const showGrid = ref(true);
  const lastEvent = ref('—');

  const titles: Record<string, string> = {
    inbound: 'Всі вхідні дзвінки',
    online: 'Всього дзвінків',
    users: 'Всього у системі',
    calls: 'Моніторинг дзвінків',
    operators: 'Моніторинг операторів',
    sl: 'Service level',
  };

  type SeriesKey = 'inbound' | 'online' | 'users';

  /** Дані для VWidgetCard + VDonutSummary (як у звітах кол-центру) */
  const summaries: Record<SeriesKey, { card: string; title: string; total: number; items: VDonutSummaryItem[] }> = {
    inbound: {
      card: 'Вхідні дзвінки',
      title: 'Всі вхідні дзвінки',
      total: 22,
      items: [
        { label: 'IVR', count: 12, color: '#27AE60', group: 'calls' },
        { label: 'ACD', count: 7, color: '#2D9CDB', group: 'calls' },
        { label: 'Оброблені операторами', count: 5, level: 1, group: 'calls' },
        { label: 'Перенаправлених', count: 1, level: 2, group: 'calls' },
        { label: 'Втрачені', count: 3, color: '#EB5757', group: 'calls' },
      ],
    },
    online: {
      card: 'Онлайн дзвінки',
      title: 'Всього дзвінків',
      total: 11,
      items: [
        { label: 'IVR', count: 4, color: '#27AE60', group: 'calls' },
        { label: 'ACD', count: 2, color: '#2D9CDB', group: 'calls' },
        { label: 'В обробці', count: 5, color: '#F2C94C', group: 'calls' },
      ],
    },
    users: {
      card: 'Оператори',
      title: 'Всього у системі',
      total: 14,
      items: [
        { label: 'Залоговані активні', count: 11 },
        { label: 'Ready', count: 5, color: '#27AE60', group: 'statuses' },
        { label: 'Talking', count: 3, color: '#2D9CDB', group: 'statuses' },
        { label: 'Working', count: 1, color: '#9B51E0', group: 'statuses' },
        { label: 'Not ready', count: 2, color: '#EB5757', group: 'statuses' },
        { label: 'Неактивні оператори', count: 3 },
      ],
    },
  };

  const isSeries = (id: string | number): id is SeriesKey => id in summaries;

  const operators = [
    { name: 'Dev Stepan', status: 'Ready', time: '00:02:05' },
    { name: 'Khomyn Stepan', status: 'Not ready', time: '00:34:02' },
    { name: 'Olena K.', status: 'Talking', time: '00:05:41' },
    { name: 'Ivan P.', status: 'Working', time: '00:11:19' },
  ];

  const statusColor: Record<string, string> = {
    Ready: 'var(--color-status-ready)',
    'Not ready': 'var(--color-status-not-ready)',
    Talking: 'var(--color-status-talking)',
    Working: 'var(--color-status-working)',
  };

  // ---------------- Простий приклад ----------------
  const simple = ref<VWidgetGridLayout>([
    { id: 'a', x: 0, y: 0, w: 2, h: 2 },
    { id: 'b', x: 2, y: 0, w: 2, h: 1 },
    { id: 'c', x: 4, y: 0, w: 2, h: 3 },
    { id: 'd', x: 2, y: 1, w: 2, h: 1 },
    { id: 'lock', x: 0, y: 2, w: 2, h: 1, static: true },
  ]);
  const simpleEditing = ref(true);
  const colors: Record<string, string> = {
    a: '#2E9CDC',
    b: '#219754',
    c: '#9B51E0',
    d: '#FFBB3D',
    lock: '#828282',
  };

  const usageCode = `<script setup>
  import { ref } from 'vue';
  import { VWidgetGrid } from 'voiptime-components';

  // Компонент нічого не зберігає сам: збереження (localStorage, бекенд) — на стороні застосунку
  const layout = ref([
    { id: 'summary',   x: 0, y: 0, w: 4,  h: 4, minW: 3, minH: 3 },
    { id: 'online',    x: 4, y: 0, w: 4,  h: 4 },
    { id: 'users',     x: 8, y: 0, w: 4,  h: 4 },
    { id: 'calls',     x: 0, y: 4, w: 6,  h: 6, minW: 4 },
    { id: 'operators', x: 6, y: 4, w: 6,  h: 6, minW: 4 },
  ]);
  const editing = ref(false);
<\/script>

<template>
  <VButton @click="editing = !editing">{{ editing ? 'Готово' : 'Налаштувати' }}</VButton>

  <VWidgetGrid v-model="layout" v-model:editing="editing" :row-height="60">
    <template #item-summary><InboundDashboardSummaryReport /></template>
    <template #item-online><InboundDashboardOnlineSummaryReport /></template>
    <template #item-users><DashboardUserReport /></template>
    <template #item-calls><InboundDashboardMonitoring /></template>
    <template #item-operators><DashboardUserMonitoring /></template>
  </VWidgetGrid>
</template>`;

  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        { name: 'v-model', type: 'VWidgetGridItem[]', default: '—', description: 'Розкладка: { id, x, y, w, h, minW?, maxW?, minH?, maxH?, static?, draggable?, resizable? }' },
        { name: 'v-model:editing', type: 'boolean', default: 'false', description: 'Режим редагування (рамки, ручки, клітинки)' },
        { name: 'columns', type: 'number', default: '12', description: 'Кількість колонок' },
        { name: 'rowHeight', type: 'number', default: '60', description: 'Висота рядка, px' },
        { name: 'gap', type: 'number', default: '16', description: 'Відступ між віджетами, px' },
        { name: 'compact', type: 'boolean', default: 'true', description: 'Підтягувати віджети вгору, прибираючи порожнечі' },
        { name: 'editButton', type: 'boolean', default: 'true', description: 'Кнопка в правому нижньому куті віджета (при наведенні), що вмикає редагування' },
        { name: 'longPress', type: 'boolean', default: 'false', description: 'Вхід у редагування довгим натисканням на віджет' },
        { name: 'longPressDelay', type: 'number', default: '450', description: 'Тривалість довгого натискання, мс' },
        { name: 'dragHandle', type: 'string', default: 'undefined', description: 'CSS-селектор "ручки" для перетягування (інакше — весь віджет)' },
        { name: 'resizeHandles', type: "('n'|'e'|'s'|'w'|'ne'|'nw'|'se'|'sw')[]", default: 'усі 8', description: 'Які ручки зміни розміру показувати' },
        { name: 'showGrid', type: 'boolean', default: 'true', description: 'Клітинки сітки в режимі редагування' },
        { name: 'stackBelow', type: 'number', default: '0', description: 'Нижче цієї ширини (px) — одна колонка без редагування. 0 — вимкнено' },
      ],
    },
    {
      title: 'VWidgetCard — props / slots / events',
      rows: [
        { name: 'title', type: 'string', default: "''", description: 'Заголовок у шапці (або слот title)' },
        { name: 'downloadable', type: 'boolean', default: 'false', description: 'Іконка завантаження в шапці → подія download' },
        { name: 'flush', type: 'boolean', default: 'false', description: 'Тіло без відступів (таблиці, графіки на всю ширину)' },
        { name: '#filters', type: 'slot', default: '—', description: 'Чіпи фільтрів; переносяться разом із заголовком' },
        { name: '#actions', type: 'slot', default: '—', description: 'Додаткові дії праворуч у шапці' },
        { name: '@download', type: '() => void', default: '—', description: 'Клік по іконці завантаження' },
      ],
    },
    {
      title: 'VDonutSummary — props',
      rows: [
        { name: 'title', type: 'string', default: '—', description: 'Підпис підсумку («Всі вхідні дзвінки»)' },
        { name: 'total', type: 'number', default: '—', description: 'Підсумок; від нього рахуються відсотки (слот #total — свій формат)' },
        { name: 'items', type: 'VDonutSummaryItem[]', default: '—', description: '{ label, count, color?, icon?, value?, level?: 0|1|2, group?, percent?, percentBase?, chart? }' },
        { name: 'segments', type: 'ChartSegment[]', default: 'з items', description: 'Сегменти діаграми, якщо відрізняються від легенди' },
        { name: 'size', type: 'number', default: '200', description: 'Діаметр діаграми, px' },
        { name: 'showCounts', type: 'boolean', default: 'false', description: 'Кількість на сегментах постійно (інакше — при наведенні)' },
        { name: 'layout', type: "'row' | 'column' | 'compact'", default: 'авто', description: 'Зафіксувати розкладку. Авто: вузько → column, низько й широко → compact' },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'change', type: '(layout) => void', description: 'Фінальна розкладка після жесту' },
        { name: 'drag-start / drag-end', type: '(item) => void', description: 'Початок / кінець перетягування' },
        { name: 'resize-start / resize-end', type: '(item) => void', description: 'Початок / кінець зміни розміру' },
        { name: 'select', type: '(id | null) => void', description: 'Обрано віджет у режимі редагування' },
      ],
    },
    {
      title: 'Slots',
      rows: [
        { name: 'item-{id}', type: '{ item, editing, active }', description: 'Вміст конкретного віджета' },
        { name: 'item', type: '{ item, editing, active }', description: 'Спільний слот для всіх віджетів (fallback)' },
      ],
    },
    {
      title: 'Керування',
      rows: [
        { name: 'Кнопка на віджеті', type: '—', description: 'З’являється при наведенні справа знизу, вмикає редагування' },
        { name: '← ↑ → ↓', type: '—', description: 'Перемістити обраний віджет на клітинку' },
        { name: 'Shift + стрілки', type: '—', description: 'Змінити розмір обраного віджета' },
        { name: 'Esc', type: '—', description: 'Скасувати перетягування → зняти виділення → вийти з редагування' },
      ],
    },
  ];
</script>

<template>
  <div class="demo-wg">
    <DocSection
      description="Наведіть на блок і натисніть кнопку справа знизу — вмикається редагування. Тягніть, щоб переставити; тягніть за ручки, щоб розтягнути чи стягнути. Зведення (VWidgetCard + VDonutSummary) перебудовують легенду під розмір блоку. Компонент нічого не зберігає — розкладку тримає застосунок через v-model."
      title="Дашборд"
    >
      <div class="demo-wg__toolbar">
        <VButton :type="editing ? 'primary' : 'default'" @click="editing = !editing">
          {{ editing ? '✓ Готово' : '✎ Налаштувати' }}
        </VButton>
        <VButton @click="reset">Скинути</VButton>
        <VCheckbox v-model="compact" label="Compact" />
        <VCheckbox v-model="showGrid" label="Клітинки" />
        <span class="demo-wg__event">Остання подія: {{ lastEvent }}</span>
      </div>

      <div class="demo-wg__canvas">
        <VWidgetGrid
          v-model="layout"
          v-model:editing="editing"
          :compact="compact"
          :row-height="56"
          :show-grid="showGrid"
          :stack-below="640"
          @change="lastEvent = 'change'"
          @drag-end="i => (lastEvent = `drag-end: ${i.id} → (${i.x}, ${i.y})`)"
          @resize-end="i => (lastEvent = `resize-end: ${i.id} → ${i.w}×${i.h}`)"
        >
          <template #item="{ item, active }">
            <!-- Зведення: VWidgetCard + VDonutSummary, адаптуються під розмір блоку -->
            <VWidgetCard v-if="isSeries(item.id)" :title="summaries[item.id].card" downloadable class="demo-wg__widget">
              <VDonutSummary
                :items="summaries[item.id].items"
                :title="summaries[item.id].title"
                :total="summaries[item.id].total"
              />
            </VWidgetCard>

            <div v-else :class="{ 'is-active': active }" class="demo-wg__card">
              <div class="demo-wg__title">{{ titles[item.id] }}</div>

              <!-- Таблиця операторів -->
              <div v-if="item.id === 'operators'" class="demo-wg__table">
                <div v-for="o in operators" :key="o.name" class="demo-wg__row">
                  <span>{{ o.name }}</span>
                  <span :style="{ color: statusColor[o.status] }" class="demo-wg__status">● {{ o.status }}</span>
                  <span class="demo-wg__muted">{{ o.time }}</span>
                </div>
              </div>

              <!-- SL -->
              <div v-else-if="item.id === 'sl'" class="demo-wg__bars">
                <div v-for="n in 24" :key="n" :style="{ height: `${30 + ((n * 37) % 70)}%` }" class="demo-wg__bar" />
              </div>

              <div v-else class="demo-wg__empty">Немає даних!</div>

              <div class="demo-wg__meta">{{ item.w }} × {{ item.h }}</div>
            </div>
          </template>
        </VWidgetGrid>
      </div>
    </DocSection>

    <DocSection
      description="6 колонок, сірий блок — static: його не можна рухати, інші обтікають. Спробуйте стрілки та Shift+стрілки на обраному віджеті."
      title="Базовий приклад"
    >
      <div class="demo-wg__toolbar">
        <VCheckbox v-model="simpleEditing" label="Редагування" />
      </div>
      <div class="demo-wg__canvas">
        <VWidgetGrid v-model="simple" v-model:editing="simpleEditing" :columns="6" :gap="12" :row-height="70">
          <template #item="{ item }">
            <div :style="{ background: colors[item.id] }" class="demo-wg__tile">
              <b>{{ item.static ? '🔒' : item.id.toString().toUpperCase() }}</b>
              <small>{{ item.w }}×{{ item.h }}</small>
            </div>
          </template>
        </VWidgetGrid>
      </div>
    </DocSection>

    <DocSection title="Використання">
      <DocCodeBlock :code="usageCode" language="vue" />
    </DocSection>

    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .demo-wg {
    &__toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    &__event {
      margin-left: auto;
      font-size: 12px;
      color: var(--color-gray-3);
      font-family: monospace;
    }

    &__canvas {
      padding: 16px;
      border-radius: 16px;
      background: var(--color-gray-7);
    }

    &__card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
      padding: 16px 20px;
      box-sizing: border-box;
      background: var(--color-white);
      border: 1px solid var(--color-gray-5);
      border-radius: 12px;
      overflow: hidden;
    }

    &__title {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-primary-main);
    }

    &__table {
      display: flex;
      flex-direction: column;
      overflow: auto;
      font-size: 13px;
    }

    &__row {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 8px;
      padding: 10px 0;
      border-bottom: 1px solid var(--color-gray-6);
    }

    &__status {
      font-weight: 500;
    }

    &__muted {
      color: var(--color-gray-3);
    }

    &__bars {
      display: flex;
      flex: 1;
      align-items: flex-end;
      gap: 4px;
      min-height: 0;
    }

    &__bar {
      flex: 1;
      border-radius: 4px 4px 0 0;
      background: linear-gradient(to top, var(--color-primary-main), var(--color-status-talking));
    }

    &__empty {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      color: var(--color-gray-4);
    }

    &__meta {
      position: absolute;
      right: 12px;
      bottom: 8px;
      font-size: 11px;
      color: var(--color-gray-4);
      font-variant-numeric: tabular-nums;
    }

    &__tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      border-radius: 12px;
      color: #fff;
      font-size: 22px;

      small {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }
</style>
