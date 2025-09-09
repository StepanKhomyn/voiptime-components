<template>
  <div class="showcase">
    <!-- Підключення -->
    <section class="section">
      <h2>Підключення до проекту</h2>
      <div class="card">
        <h3>1. Використання в шаблоні</h3>
        <pre class="code">
          &lt;VPagination
            :totalItems="totalItems"
            :pageSize="pageSize"
            :currentPage="currentPage"
            :pageSizeOptions="[5, 10, 20, 50]"
            :maxVisiblePages="6"
            @update:currentPage="handlePageChange"
            @update:pageSize="handlePageSizeChange"
            @pageChange="handlePaginationChange"
            @reloadData="handleReloadData"
          /&gt;
        </pre>

        <h3>2. Обробка подій</h3>
        <pre class="code">
          const handlePageChange = (page: number) => {
            currentPage.value = page;
            // Завантаження даних для нової сторінки
          };

          const handlePageSizeChange = (size: number) => {
            pageSize.value = size;
            currentPage.value = 1;
            // Перезавантаження даних з новим розміром сторінки
          };

          const handlePaginationChange = (data: { page: number; pageSize: number }) => {
            // Комплексна обробка змін пагінації
            loadData(data.page, data.pageSize);
          };
        </pre>
      </div>
    </section>

    <!-- Демо -->
    <section class="section">
      <h2>Демонстрація</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h4>Базова пагінація</h4>
          <VPagination
            v-model:currentPage="demoData.basic.currentPage"
            v-model:pageSize="demoData.basic.pageSize"
            :totalItems="demoData.basic.totalItems"
            @pageChange="onBasicPageChange"
            @reloadData="onBasicReload"
          />
        </div>

        <div class="demo-item">
          <h4>Малий набір даних</h4>
          <VPagination
            v-model:currentPage="demoData.small.currentPage"
            v-model:pageSize="demoData.small.pageSize"
            :maxVisiblePages="5"
            :pageSizeOptions="[5, 10, 25]"
            :totalItems="25"
          />
        </div>

        <div class="demo-item">
          <h4>Великий набір даних</h4>
          <VPagination
            v-model:currentPage="demoData.large.currentPage"
            v-model:pageSize="demoData.large.pageSize"
            :maxVisiblePages="8"
            :pageSizeOptions="[10, 25, 50, 100]"
            :totalItems="10000"
          />
        </div>

        <div class="demo-item">
          <h4>Кастомні опції</h4>
          <VPagination
            v-model:currentPage="demoData.custom.currentPage"
            v-model:pageSize="demoData.custom.pageSize"
            :maxVisiblePages="4"
            :pageSizeOptions="[3, 7, 15, 30]"
            :totalItems="500"
          />
        </div>
      </div>
    </section>

    <!-- Властивості -->
    <section class="section">
      <h2>Властивості (Props)</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Опис</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>totalItems</code></td>
              <td><code>number</code></td>
              <td>-</td>
              <td>Загальна кількість елементів (обов'язковий)</td>
            </tr>
            <tr>
              <td><code>pageSize</code></td>
              <td><code>number</code></td>
              <td>10</td>
              <td>Кількість елементів на сторінку</td>
            </tr>
            <tr>
              <td><code>currentPage</code></td>
              <td><code>number</code></td>
              <td>1</td>
              <td>Поточна активна сторінка</td>
            </tr>
            <tr>
              <td><code>pageSizeOptions</code></td>
              <td><code>number[]</code></td>
              <td>[5, 10, 20, 50]</td>
              <td>Опції для вибору розміру сторінки</td>
            </tr>
            <tr>
              <td><code>maxVisiblePages</code></td>
              <td><code>number</code></td>
              <td>6</td>
              <td>Максимальна кількість видимих номерів сторінок</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Події -->
    <section class="section">
      <h2>Події (Emits)</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>Опис</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>update:currentPage</code></td>
              <td><code>number</code></td>
              <td>Емітується при зміні поточної сторінки (v-model)</td>
            </tr>
            <tr>
              <td><code>update:pageSize</code></td>
              <td><code>number</code></td>
              <td>Емітується при зміні розміру сторінки (v-model)</td>
            </tr>
            <tr>
              <td><code>pageChange</code></td>
              <td><code>{ page: number, pageSize: number }</code></td>
              <td>Емітується при будь-якій зміні пагінації</td>
            </tr>
            <tr>
              <td><code>reloadData</code></td>
              <td><code>number</code></td>
              <td>Емітується при натисканні кнопки оновлення, передає поточну сторінку</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Computed Properties -->
    <section class="section">
      <h2>Обчислювані властивості</h2>
      <div class="card">
        <h3>Внутрішні обчислення компонента:</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Властивість</th>
                <th>Type</th>
                <th>Опис</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>totalPages</code></td>
                <td><code>number</code></td>
                <td>Загальна кількість сторінок: Math.ceil(totalItems / pageSize)</td>
              </tr>
              <tr>
                <td><code>fromItem</code></td>
                <td><code>number</code></td>
                <td>Номер першого елемента на поточній сторінці</td>
              </tr>
              <tr>
                <td><code>toItem</code></td>
                <td><code>number</code></td>
                <td>Номер останнього елемента на поточній сторінці</td>
              </tr>
              <tr>
                <td><code>visiblePages</code></td>
                <td><code>(number | string)[]</code></td>
                <td>Масив номерів сторінок та роздільників ("...") для відображення</td>
              </tr>
              <tr>
                <td><code>isPreviousDisabled</code></td>
                <td><code>boolean</code></td>
                <td>Чи заблокована кнопка "Попередня"</td>
              </tr>
              <tr>
                <td><code>isNextDisabled</code></td>
                <td><code>boolean</code></td>
                <td>Чи заблокована кнопка "Наступна"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Методи -->
    <section class="section">
      <h2>Методи компонента</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Метод</th>
              <th>Параметри</th>
              <th>Опис</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>goToPage</code></td>
              <td><code>page: number | string</code></td>
              <td>Переходить на вказану сторінку</td>
            </tr>
            <tr>
              <td><code>goToPrevious</code></td>
              <td>-</td>
              <td>Переходить на попередню сторінку</td>
            </tr>
            <tr>
              <td><code>goToNext</code></td>
              <td>-</td>
              <td>Переходить на наступну сторінку</td>
            </tr>
            <tr>
              <td><code>handlePageSizeChange</code></td>
              <td>-</td>
              <td>Обробляє зміну розміру сторінки (скидає на першу сторінку)</td>
            </tr>
            <tr>
              <td><code>reloadData</code></td>
              <td>-</td>
              <td>Емітує подію перезавантаження даних</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Типи -->
    <section class="section">
      <h2>TypeScript інтерфейси</h2>

      <div class="card">
        <h3>PaginationProps</h3>
        <pre class="code">
interface PaginationProps {
  totalItems: number;
  pageSize?: number;
  currentPage?: number;
  pageSizeOptions?: number[];
  maxVisiblePages?: number;
}
        </pre>
      </div>

      <div class="card">
        <h3>PaginationEmits</h3>
        <pre class="code">
interface PaginationEmits {
  (e: 'update:currentPage', page: number): void;
  (e: 'update:pageSize', size: number): void;
  (e: 'pageChange', data: PaginationChangeData): void;
  (e: 'reloadData', page: number): void;
}
        </pre>
      </div>

      <div class="card">
        <h3>PaginationChangeData</h3>
        <pre class="code">
interface PaginationChangeData {
  page: number;
  pageSize: number;
}
        </pre>
      </div>
    </section>

    <!-- Приклади використання -->
    <section class="section">
      <h2>Приклади використання</h2>

      <div class="card">
        <h3>Базове використання з таблицею</h3>
        <pre class="code">
&lt;template&gt;
  &lt;div&gt;
    &lt;VTable :data="paginatedData" /&gt;

    &lt;VPagination
      :totalItems="totalItems"
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      @pageChange="loadData"
    /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const data = ref([]);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return data.value.slice(start, end);
});

const loadData = async ({ page, pageSize }) => {
  const response = await api.getData({
    page,
    pageSize
  });
  data.value = response.data;
  totalItems.value = response.total;
};
&lt;/script&gt;
        </pre>
      </div>

      <div class="card">
        <h3>Серверна пагінація</h3>
        <pre class="code">
const loadServerData = async (page: number, pageSize: number) => {
  try {
    loading.value = true;

    const response = await fetch(`/api/data?page=${page}&limit=${pageSize}`);
    const result = await response.json();

    data.value = result.items;
    totalItems.value = result.total;

  } catch (error) {
    console.error('Помилка завантаження:', error);
  } finally {
    loading.value = false;
  }
};

// Обробка зміни пагінації
const handlePaginationChange = ({ page, pageSize }) => {
  loadServerData(page, pageSize);
};
        </pre>
      </div>
    </section>

    <!-- Інформаційна панель -->
    <section class="section">
      <h2>Стан демонстрації</h2>
      <div class="info-panel">
        <div class="info-item">
          <strong>Базова пагінація:</strong>
          <span
            >Сторінка {{ demoData.basic.currentPage }} з
            {{ Math.ceil(demoData.basic.totalItems / demoData.basic.pageSize) }}</span
          >
        </div>
        <div class="info-item">
          <strong>Елементи:</strong>
          <span
            >{{ getFromItem(demoData.basic.currentPage, demoData.basic.pageSize) }} -
            {{ getToItem(demoData.basic.currentPage, demoData.basic.pageSize, demoData.basic.totalItems) }} з
            {{ demoData.basic.totalItems }}</span
          >
        </div>
        <div v-if="lastPageChangeEvent" class="info-item">
          <strong>Остання подія:</strong>
          <span>{{ lastPageChangeEvent }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import VPagination from '@/components/pagination/VPagination.vue';
  // Дані для демонстрації
  const demoData = reactive({
    basic: {
      totalItems: 150,
      currentPage: 1,
      pageSize: 10,
    },
    small: {
      currentPage: 1,
      pageSize: 5,
    },
    large: {
      currentPage: 1,
      pageSize: 25,
    },
    custom: {
      currentPage: 1,
      pageSize: 7,
    },
  });

  const lastPageChangeEvent = ref<string | null>(null);

  // Методи для демонстрації
  const onBasicPageChange = (data: { page: number; pageSize: number }) => {
    lastPageChangeEvent.value = `pageChange: сторінка ${data.page}, розмір ${data.pageSize}`;
    console.log('Page change:', data);
  };

  const onBasicReload = (page: number) => {
    lastPageChangeEvent.value = `reloadData: сторінка ${page}`;
    console.log('Reload data for page:', page);
  };

  // Допоміжні функції для інформаційної панелі
  const getFromItem = (currentPage: number, pageSize: number) => {
    return (currentPage - 1) * pageSize + 1;
  };

  const getToItem = (currentPage: number, pageSize: number, totalItems: number) => {
    return Math.min(currentPage * pageSize, totalItems);
  };
</script>

<style scoped>
  .showcase {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }

  .section {
    margin-bottom: 3rem;
  }

  .section h2 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
  }

  .card {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .card h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .demo-item {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }

  .demo-item:hover {
    border-color: #3498db;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
  }

  .demo-item h4 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: 600;
  }

  .demo-controls {
    margin-bottom: 1rem;
  }

  .demo-controls label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }

  .demo-controls input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .demo-info {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  .table th,
  .table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e1e8ed;
    vertical-align: top;
  }

  .table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }

  .table code {
    background: #f1f3f4;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    color: #d63384;
  }

  .code {
    display: block;
    background: #2d3748;
    color: #e2e8f0;
    padding: 1.5rem;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    overflow-x: auto;
    margin: 1rem 0;
    white-space: pre;
  }

  .info-panel {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e9ecef;
  }

  .info-item:last-child {
    border-bottom: none;
  }

  .info-item strong {
    color: #495057;
  }

  .info-item span {
    color: #6c757d;
    font-family: monospace;
  }

  /* Стилі для демо пагінації */
  .vt-pagination-demo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e1e8ed;
    border-radius: 6px;
    background: #fafafa;
    font-size: 0.9rem;
  }

  .pagination-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .pagination-info select {
    padding: 0.3rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .pagination-nav {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .pagination-nav button {
    padding: 0.4rem 0.8rem;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .pagination-nav button:hover:not(:disabled) {
    background: #e9ecef;
    border-color: #adb5bd;
  }

  .pagination-nav button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-nav button.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  .reload-btn {
    padding: 0.4rem 0.8rem;
    border: 1px solid #28a745;
    background: #28a745;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .reload-btn:hover {
    background: #218838;
    border-color: #218838;
  }

  @media (max-width: 768px) {
    .showcase {
      padding: 1rem;
    }

    .vt-pagination-demo {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .pagination-info {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .info-item {
      flex-direction: column;
      gap: 0.3rem;
    }

    .table th,
    .table td {
      padding: 0.5rem;
      font-size: 0.8rem;
    }

    .code {
      font-size: 0.8rem;
      padding: 1rem;
    }
  }
</style>
