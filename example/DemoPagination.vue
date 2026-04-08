<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import VPagination from '@/components/pagination/VPagination.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import DocCodeBlock from './helper/DocCodeBlock.vue';

  const basic = reactive({ currentPage: 1, pageSize: 10, totalItems: 150 });
  const small = reactive({ currentPage: 1, pageSize: 5 });
  const large = reactive({ currentPage: 1, pageSize: 25 });
  const custom = reactive({ currentPage: 1, pageSize: 7 });

  const lastEvent = ref<string | null>(null);

  const onPageChange = (data: { page: number; pageSize: number }) => {
    lastEvent.value = `pageChange → сторінка ${data.page}, розмір ${data.pageSize}`;
  };
  const onReload = (page: number) => {
    lastEvent.value = `reloadData → сторінка ${page}`;
  };

  const fromItem = (page: number, size: number) => (page - 1) * size + 1;
  const toItem = (page: number, size: number, total: number) => Math.min(page * size, total);

  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'totalItems',
          type: 'number',
          default: '-',
          description: 'Загальна кількість елементів',
          required: true,
        },
        { name: 'currentPage', type: 'number', default: '1', description: 'Поточна сторінка (v-model:currentPage)' },
        { name: 'pageSize', type: 'number', default: '10', description: 'Елементів на сторінку (v-model:pageSize)' },
        {
          name: 'pageSizeOptions',
          type: 'number[]',
          default: '[5,10,20,50]',
          description: 'Варіанти розміру сторінки',
        },
        { name: 'maxVisiblePages', type: 'number', default: '6', description: 'Макс. видимих номерів сторінок' },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'update:currentPage', type: 'number', description: 'Зміна поточної сторінки (v-model)' },
        { name: 'update:pageSize', type: 'number', description: 'Зміна розміру сторінки (v-model)' },
        { name: 'pageChange', type: '{ page: number, pageSize: number }', description: 'Будь-яка зміна пагінації' },
        { name: 'reloadData', type: 'number', description: 'Натискання кнопки оновлення — передає поточну сторінку' },
      ],
    },
  ];
</script>

<template>
  <div class="pagination-showcase">
    <!-- ─── Базова ─── -->
    <DocSection title="Базова пагінація">
      <DocPreview :script="`const currentPage = ref(1)\nconst pageSize = ref(10)`">
        <VPagination
          v-model:currentPage="basic.currentPage"
          v-model:pageSize="basic.pageSize"
          :total-items="basic.totalItems"
          @pageChange="onPageChange"
          @reloadData="onReload"
        />
      </DocPreview>

      <div v-if="lastEvent" class="event-log">
        <span class="event-log__label">Остання подія:</span> {{ lastEvent }}
      </div>

      <div class="state-row">
        <span
          >Сторінка <strong>{{ basic.currentPage }}</strong> з
          <strong>{{ Math.ceil(basic.totalItems / basic.pageSize) }}</strong></span
        >
        <span
          >Показано
          <strong
            >{{ fromItem(basic.currentPage, basic.pageSize) }}–{{
              toItem(basic.currentPage, basic.pageSize, basic.totalItems)
            }}</strong
          >
          з {{ basic.totalItems }}</span
        >
      </div>
    </DocSection>

    <!-- ─── Варіанти ─── -->
    <DocSection title="Варіанти конфігурації">
      <DocPreview title="Малий набір (25 елементів, maxVisiblePages=5)">
        <VPagination
          v-model:currentPage="small.currentPage"
          v-model:pageSize="small.pageSize"
          :max-visible-pages="5"
          :page-size-options="[5, 10, 25]"
          :total-items="25"
        />
      </DocPreview>

      <DocPreview title="Великий набір (10 000 елементів, maxVisiblePages=8)">
        <VPagination
          v-model:currentPage="large.currentPage"
          v-model:pageSize="large.pageSize"
          :max-visible-pages="8"
          :page-size-options="[10, 25, 50, 100]"
          :total-items="10000"
        />
      </DocPreview>

      <DocPreview title="Кастомні опції розміру сторінки">
        <VPagination
          v-model:currentPage="custom.currentPage"
          v-model:pageSize="custom.pageSize"
          :max-visible-pages="4"
          :page-size-options="[3, 7, 15, 30]"
          :total-items="500"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Разом з таблицею ─── -->
    <DocSection description="Типовий патерн — серверна пагінація" title="Разом з таблицею">
      <DocPreview
        :script="`
const currentPage = ref(1)
const pageSize    = ref(10)
const totalItems  = ref(0)
const data        = ref([])

const loadData = async ({ page, pageSize }) => {
  const res = await fetch(\`/api/items?page=\${page}&limit=\${pageSize}\`)
  const json = await res.json()
  data.value = json.items
  totalItems.value = json.total
}
        `"
      >
        <VPagination
          v-model:currentPage="basic.currentPage"
          v-model:pageSize="basic.pageSize"
          :total-items="basic.totalItems"
          @pageChange="onPageChange"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── TypeScript інтерфейси ─── -->
    <DocSection title="TypeScript інтерфейси">
      <DocCodeBlock
        :code="`interface PaginationProps {
  totalItems: number
  pageSize?: number           // default: 10
  currentPage?: number        // default: 1
  pageSizeOptions?: number[]  // default: [5, 10, 20, 50]
  maxVisiblePages?: number    // default: 6
}

interface PaginationChangeData {
  page: number
  pageSize: number
}

// Emits
'update:currentPage' // (page: number) => void
'update:pageSize'    // (size: number) => void
'pageChange'         // (data: PaginationChangeData) => void
'reloadData'         // (page: number) => void`"
        language="ts"
      />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🔄" title="v-model на обох props">
        Підтримує <code>v-model:currentPage</code> і <code>v-model:pageSize</code> одночасно — не потрібно вручну
        слухати <code>update:</code> події.
      </DocFeature>
      <DocFeature icon="📡" title="pageChange vs update:currentPage">
        <code>@pageChange</code> отримує і сторінку і розмір в одному об'єкті — зручно для API-запитів.
        <code>@update:currentPage</code> — тільки для синхронізації стану.
      </DocFeature>
      <DocFeature icon="🔁" title="reloadData">
        Кнопка оновлення емітує <code>reloadData</code> з поточною сторінкою — повторно завантажує дані без зміни номера
        сторінки.
      </DocFeature>
      <DocFeature icon="📄" title="maxVisiblePages">
        При великій кількості сторінок автоматично додаються <code>...</code> роздільники. Поточна сторінка завжди
        видима.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .pagination-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .event-log {
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #0c4a6e;

    &__label {
      font-weight: 600;
    }
  }

  .state-row {
    display: flex;
    gap: 2rem;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: #555;
  }
</style>
