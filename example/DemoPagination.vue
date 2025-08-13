<template>
  <div class="showcase">
    <!-- Підключення -->
    <section class="section">
      <div class="card">
        <h3>Використання в компонентах</h3>
        <pre class="code">
&lt;VPagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total-items="totalItems"
  :page-size-options="[10, 20, 50, 100]"
  :max-visible-pages="7"
  @page-change="handlePageChange"
  @reload-data="handleReloadData"
/&gt;</pre
        >
      </div>
    </section>

    <!-- Демо -->
    <section class="section">
      <h2>Демонстрація</h2>
      <div class="demo-item">
        <h4>Інтерактивна пагінація</h4>
        <div class="controls">
          <div class="control-group">
            <label>Всього елементів:</label>
            <input type="number" v-model.number="totalItems" min="0" />
          </div>
          <div class="control-group">
            <label>Поточна сторінка:</label>
            <input type="number" v-model.number="currentPage" min="1" />
          </div>
        </div>

        <VPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total-items="totalItems"
          :page-size-options="[5, 10, 20, 50]"
          @page-change="handlePageChange"
          @reload-data="handleReloadData"
        />
      </div>
    </section>

    <!-- Props -->
    <section class="section">
      <h2>Властивості</h2>
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
              <td>Кількість елементів на сторінку (v-model)</td>
            </tr>
            <tr>
              <td><code>currentPage</code></td>
              <td><code>number</code></td>
              <td>1</td>
              <td>Поточна сторінка (v-model)</td>
            </tr>
            <tr>
              <td><code>pageSizeOptions</code></td>
              <td><code>number[]</code></td>
              <td>[5, 10, 20, 50]</td>
              <td>Опції для вибору кількості рядків</td>
            </tr>
            <tr>
              <td><code>maxVisiblePages</code></td>
              <td><code>number</code></td>
              <td>6</td>
              <td>Максимальна кількість видимих сторінок</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const currentPage = ref(3);
  const pageSize = ref(10);
  const totalItems = ref(247);

  const handlePageChange = data => {
    console.log('Page changed:', data);
  };

  const handleReloadData = page => {
    alert(`Перезавантаження даних для сторінки ${page}`);
  };
</script>

<script>
  export default {
    components: {
      VPagination: {
        props: {
          totalItems: { type: Number, required: true },
          pageSize: { type: Number, default: 10 },
          currentPage: { type: Number, default: 1 },
          pageSizeOptions: { type: Array, default: () => [5, 10, 20, 50] },
          maxVisiblePages: { type: Number, default: 6 },
        },
        emits: ['update:currentPage', 'update:pageSize', 'pageChange', 'reloadData'],
        computed: {
          currentPageModel: {
            get() {
              return this.currentPage;
            },
            set(val) {
              this.$emit('update:currentPage', val);
            },
          },
          pageSizeModel: {
            get() {
              return this.pageSize;
            },
            set(val) {
              this.$emit('update:pageSize', val);
            },
          },
          totalPages() {
            return Math.ceil(this.totalItems / this.pageSizeModel);
          },
          fromItem() {
            return this.totalItems === 0 ? 0 : (this.currentPageModel - 1) * this.pageSizeModel + 1;
          },
          toItem() {
            return Math.min(this.currentPageModel * this.pageSizeModel, this.totalItems);
          },
          isPreviousDisabled() {
            return this.currentPageModel <= 1;
          },
          isNextDisabled() {
            return this.currentPageModel >= this.totalPages;
          },
          visiblePages() {
            const pages = [];
            const total = this.totalPages;
            const current = this.currentPageModel;
            const maxVisible = this.maxVisiblePages;

            if (total <= maxVisible) {
              for (let i = 1; i <= total; i++) pages.push(i);
            } else {
              pages.push(1);
              const start = Math.max(2, current - Math.floor(maxVisible / 2));
              const end = Math.min(total - 1, current + Math.floor(maxVisible / 2));
              if (start > 2) pages.push('...');
              for (let i = start; i <= end; i++) pages.push(i);
              if (end < total - 1) pages.push('...');
              if (total > 1) pages.push(total);
            }
            return pages;
          },
        },
        methods: {
          emitPageChange() {
            this.$emit('pageChange', {
              page: this.currentPageModel,
              pageSize: this.pageSizeModel,
            });
          },
          goToPage(page) {
            if (typeof page === 'number' && page !== this.currentPageModel) {
              this.currentPageModel = page;
              this.emitPageChange();
            }
          },
          goToPrevious() {
            if (!this.isPreviousDisabled) {
              this.currentPageModel--;
              this.emitPageChange();
            }
          },
          goToNext() {
            if (!this.isNextDisabled) {
              this.currentPageModel++;
              this.emitPageChange();
            }
          },
          handlePageSizeChange() {
            this.currentPageModel = 1;
            this.emitPageChange();
          },
          reloadDataAction() {
            this.$emit('reloadData', this.currentPageModel);
          },
        },
        template: `
        <div class="vt-pagination">
          <div class="vt-pagination__info">
            <div class="vt-pagination__rows-per-page">
              <label class="vt-pagination__label">Рядків на сторінку:</label>
              <select v-model="pageSizeModel" @change="handlePageSizeChange" class="vt-pagination__select">
                <option v-for="option in pageSizeOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
            <span>{{ fromItem }} - {{ toItem }} з {{ totalItems }}</span>
          </div>

          <div class="vt-pagination__navigation">
            <button @click="goToPrevious" :disabled="isPreviousDisabled" class="vt-pagination__nav-button">‹</button>
            <button
              v-for="(page, index) in visiblePages"
              :key="index"
              @click="goToPage(page)"
              class="vt-pagination__nav-button"
              :class="{ 'vt-pagination__nav-button--active': page === currentPageModel }"
              :disabled="typeof page === 'string'"
            >
              {{ page }}
            </button>
            <button @click="goToNext" :disabled="isNextDisabled" class="vt-pagination__nav-button">›</button>
          </div>

          <div>
            <button class="reload-button" @click="reloadDataAction" title="Оновити дані">⟲</button>
          </div>
        </div>
      `,
      },
    },
  };
</script>

<style scoped>
  /* Сюди вставимо всі твої CSS з HTML */
</style>
