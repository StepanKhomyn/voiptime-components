<template>
  <div class="showcase">
    <!-- Підключення -->
    <section class="section">
      <h2>Підключення до проекту</h2>
      <div class="card">
        <h3>1. Встановлення плагіну</h3>
        <pre class="code">
          // main.ts
          import { createApp } from 'vue';
          import VoiptimeComponents from 'voiptime-components';

          const app = createApp(App);
          app.use(VoiptimeComponents, { modal: true });
          app.mount('#app');`);
        </pre>

        <h3>2. Використання в компонентах</h3>
        <pre class="code">
      modalManager.open({
        component: VTableColumnSelector,
        title: 'Управління колонками таблиці',
        props: {
          columns: props.allColumns,
          columnsSelector: availableColumns,
          'onUpdate-columns': (updatedColumns: VTableColumnProps[]) => {
            emit('update-columns', updatedColumns);
          },
        },
        size: 'large',
        closeOnBackdropClick: false,
      });
        </pre>
      </div>
    </section>

    <!-- Демо -->
    <section class="section">
      <h2>Демонстрація</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h4>Базове модальне вікно</h4>
          <VButton @click="modals.basic = true">Відкрити</VButton>
        </div>

        <div class="demo-item">
          <h4>Розміри</h4>
          <div class="buttons">
            <VButton size="small" @click="modals.small = true">Small</VButton>
            <VButton @click="modals.medium = true">Medium</VButton>
            <VButton type="success" @click="modals.large = true">Large</VButton>
          </div>
        </div>

        <div class="demo-item">
          <h4>Налаштування</h4>
          <div class="buttons">
            <VButton type="warning" @click="modals.noClose = true">Без X</VButton>
            <VButton type="danger" @click="modals.noBackdrop = true">Без backdrop</VButton>
          </div>
        </div>
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
              <td><code>modelValue</code></td>
              <td><code>boolean</code></td>
              <td>-</td>
              <td>Стан модального вікна (v-model)</td>
            </tr>
            <tr>
              <td><code>title</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>Заголовок</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>'small' | 'medium' | 'large'</code></td>
              <td>'medium'</td>
              <td>Розмір вікна</td>
            </tr>
            <tr>
              <td><code>showCloseButton</code></td>
              <td><code>boolean</code></td>
              <td>true</td>
              <td>Показувати кнопку X</td>
            </tr>
            <tr>
              <td><code>closeOnBackdropClick</code></td>
              <td><code>boolean</code></td>
              <td>true</td>
              <td>Закривати по backdrop</td>
            </tr>
            <tr>
              <td><code>zIndex</code></td>
              <td><code>number</code></td>
              <td>1000</td>
              <td>Z-index</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Події -->
    <section class="section">
      <h2>Події</h2>
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
              <td><code>update:modelValue</code></td>
              <td><code>boolean</code></td>
              <td>Зміна стану (v-model)</td>
            </tr>
            <tr>
              <td><code>close</code></td>
              <td>-</td>
              <td>Закриття вікна</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- API -->
    <section class="section">
      <h2>Програмне API</h2>

      <div class="card">
        <h3>$modal методи</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Метод</th>
                <th>Параметри</th>
                <th>Повертає</th>
                <th>Опис</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>open(config)</code></td>
                <td><code>VModalConfig</code></td>
                <td><code>string</code></td>
                <td>Відкриває вікно, повертає ID</td>
              </tr>
              <tr>
                <td><code>close()</code></td>
                <td>-</td>
                <td>-</td>
                <td>Закриває останнє вікно</td>
              </tr>
              <tr>
                <td><code>closeById(id)</code></td>
                <td><code>string</code></td>
                <td>-</td>
                <td>Закриває вікно за ID</td>
              </tr>
              <tr>
                <td><code>closeAll()</code></td>
                <td>-</td>
                <td>-</td>
                <td>Закриває всі вікна</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3>VModalConfig</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Параметр</th>
                <th>Type</th>
                <th>Опис</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>title</code></td>
                <td><code>string</code></td>
                <td>Заголовок</td>
              </tr>
              <tr>
                <td><code>content</code></td>
                <td><code>string</code></td>
                <td>HTML контент</td>
              </tr>
              <tr>
                <td><code>component</code></td>
                <td><code>Component</code></td>
                <td>Vue компонент</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code>string</code></td>
                <td>Розмір</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Модальні вікна -->
    <VModal v-model="modals.basic" title="Базове модальне вікно">
      <p>Це базове модальне вікно з простим контентом.</p>
    </VModal>

    <VModal v-model="modals.small" size="small" title="Маленьке">
      <p>Маленьке модальне вікно для простих повідомлень.</p>
    </VModal>

    <VModal v-model="modals.medium" size="medium" title="Середнє">
      <p>Середнє модальне вікно - стандартний розмір.</p>
    </VModal>

    <VModal v-model="modals.large" size="large" title="Велике">
      <p>Велике модальне вікно для складного контенту:</p>
      <ul>
        <li>Складні форми</li>
        <li>Таблиці</li>
        <li>Детальна інформація</li>
      </ul>
    </VModal>

    <VModal v-model="modals.noClose" :showCloseButton="false" title="Без кнопки X">
      <p>Це вікно без кнопки закриття. Клікніть поза вікном для закриття.</p>
    </VModal>

    <VModal v-model="modals.noBackdrop" :closeOnBackdropClick="false" title="Без backdrop">
      <p>Це вікно не закривається при кліку поза ним.</p>
      <VButton type="danger" @click="modals.noBackdrop = false">Закрити</VButton>
    </VModal>
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, reactive, ref } from 'vue';
  import VModal from '@/components/modal/VModal.vue';
  import VButton from '@/components/button/VButton.vue';

  const copied = ref<string | null>(null);
  const instance = getCurrentInstance();

  // Стани модальних вікон
  const modals = reactive({
    basic: false,
    small: false,
    medium: false,
    large: false,
    noClose: false,
    noBackdrop: false,
    form: false,
  });
</script>

<style scoped>
  .showcase {
    max-width: 1000px;
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
  }

  .card h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .demo-item {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    transition: all 0.2s;
  }

  .demo-item:hover {
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
  }

  .demo-item h4 {
    color: #2c3e50;
    margin-bottom: 0.8rem;
    font-size: 1rem;
  }

  .buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
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
    position: relative;
    display: block;
    background: #2d3748;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    overflow-x: auto;
    cursor: pointer;
    margin: 1rem 0;
    white-space: pre;
  }

  .code:hover {
    background: #374151;
  }

  .copied {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #10b981;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
  }

  .example {
    margin-bottom: 2rem;
  }

  .example h3 {
    color: #2c3e50;
    margin-bottom: 0.8rem;
    font-size: 1.1rem;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .field label {
    display: block;
    margin-bottom: 0.3rem;
    font-weight: 500;
    color: #374151;
  }

  .field input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 1rem;
  }

  .field input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid #e1e8ed;
  }

  @media (max-width: 768px) {
    .showcase {
      padding: 1rem;
    }

    .demo-grid {
      grid-template-columns: 1fr;
    }

    .buttons {
      flex-direction: column;
    }

    .actions {
      flex-direction: column;
    }

    .table th,
    .table td {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  }
</style>
