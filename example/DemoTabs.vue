<script lang="ts" setup>
  import { ref } from 'vue';
  import VTabs from '@/components/tabs/VTabs.vue';
  import VTabItem from '@/components/tabs/VTabItem.vue';

  const activeTab = ref('1');

  // Хендлери івентів
  const onTabChange = (name: string) => {
    console.log('tab-change:', name);
  };
  const onTabRemove = (name: string) => {
    console.log('tab-remove:', name);
  };
  const onTabAdd = () => {
    console.log('tab-add');
  };
</script>

<template>
  <div>
    <!-- Основне використання -->
    <div class="example-section">
      <h3>Основне використання</h3>
      <p>Активний таб: {{ activeTab }}</p>

      <VTabs v-model="activeTab" @tab-change="onTabChange" @tab-remove="onTabRemove" @tab-add="onTabAdd">
        <VTabItem icon="paperClip" label="Таб 1" name="1"> Контент табу 1</VTabItem>

        <VTabItem closable label="Таб 2" name="2"> Контент табу 2</VTabItem>

        <VTabItem disabled label="Таб 3 (disabled)" name="3"> Контент табу 3</VTabItem>
      </VTabs>

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue'

const activeTab = ref('1')
&lt;/script&gt;

&lt;template&gt;
  &lt;VTabs v-model="activeTab"&gt;
    &lt;VTabItem label="Таб 1" name="1"&gt;Контент табу 1&lt;/VTabItem&gt;
    &lt;VTabItem label="Таб 2" name="2" closable&gt;Контент табу 2&lt;/VTabItem&gt;
    &lt;VTabItem label="Таб 3 (disabled)" name="3" disabled&gt;Контент табу 3&lt;/VTabItem&gt;
  &lt;/VTabs&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Використання слотів -->
    <div class="example-section">
      <h3>Кастомний заголовок</h3>

      <VTabs v-model="activeTab">
        <VTabItem name="custom">
          <template #title="{ isActive }">
            <span :style="{ color: isActive ? 'red' : 'inherit' }"> ⭐ Кастомний заголовок </span>
          </template>
          Контент кастомного табу
        </VTabItem>
      </VTabs>

      <pre class="code-simple">
        <code>
&lt;VTabItem name="custom"&gt;
  &lt;template #title="{ isActive }"&gt;
    &lt;span :style="{ color: isActive ? 'red' : 'inherit' }"&gt;
      ⭐ Кастомний заголовок
    &lt;/span&gt;
  &lt;/template&gt;
  Контент кастомного табу
&lt;/VTabItem&gt;
        </code>
      </pre>
    </div>

    <!-- API Документація -->
    <div class="example-section">
      <h3>API Документація</h3>

      <h4>Props (VTabItem)</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Тип</th>
            <th>За замовчуванням</th>
            <th>Опис</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>label</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>Заголовок вкладки</td>
          </tr>
          <tr>
            <td><code>name</code></td>
            <td><code>string</code></td>
            <td><code>—</code></td>
            <td>Унікальний ідентифікатор вкладки</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Вимикає можливість вибору</td>
          </tr>
          <tr>
            <td><code>closable</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Дозволяє закривати вкладку</td>
          </tr>
        </tbody>
      </table>

      <h4>Events (VTabs)</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Параметри</th>
            <th>Опис</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:modelValue</code></td>
            <td><code>(value: string)</code></td>
            <td>Випромінюється при зміні активної вкладки</td>
          </tr>
          <tr>
            <td><code>tab-change</code></td>
            <td><code>(name: string)</code></td>
            <td>Коли змінився активний таб</td>
          </tr>
          <tr>
            <td><code>tab-remove</code></td>
            <td><code>(name: string)</code></td>
            <td>Коли таб видалений</td>
          </tr>
          <tr>
            <td><code>tab-add</code></td>
            <td><code>()</code></td>
            <td>Коли натиснута кнопка додавання табів</td>
          </tr>
        </tbody>
      </table>

      <h4>Slots</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Опис</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>default</code></td>
            <td>Контент вкладки</td>
          </tr>
          <tr>
            <td><code>title</code></td>
            <td>Кастомний заголовок табу (отримує <code>{ isActive, title }</code>)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
  .example-section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
  }

  .example-section h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .code-simple {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 1rem;
    overflow-x: auto;
    font-family: 'Courier New', Consolas, monospace;
    font-size: 14px;
    line-height: 1.4;
    margin-top: 1rem;
  }

  .api-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
    font-size: 14px;
  }

  .api-table th,
  .api-table td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
  }

  .api-table th {
    background-color: #f8f9fa;
    font-weight: 600;
  }
</style>
