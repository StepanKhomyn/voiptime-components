<script lang="ts" setup>
  import { ref } from 'vue';
  import VCollapse from '@/components/collapse/VCollapse.vue';
  import VCollapseItem from '@/components/collapse/VCollapseItem.vue';

  const activeNames = ref(['1']);
  const accordionActiveNames = ref(['a']);
  const customActiveNames = ref(['custom1']);
</script>

<template>
  <div>
    <!-- Основне використання з v-model -->
    <div class="example-section">
      <h3>Основне використання</h3>
      <p>Активні елементи: {{ activeNames }}</p>

      <VCollapse v-model="activeNames" @change="val => console.log('Changed:', val)">
        <VCollapseItem name="1" title="Consistency">
          <div
            >Consistent with real life: in line with the process and logic of real life, and comply with languages and
            habits that the users are used to;
          </div>
          <div
            >Consistent within interface: all elements should be consistent, such as: design style, icons and texts,
            position of elements, etc.
          </div>
        </VCollapseItem>

        <VCollapseItem name="2" title="Feedback">
          <div
            >Operation feedback: enable the users to clearly perceive their operations by style updates and interactive
            effects;
          </div>
          <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
        </VCollapseItem>

        <VCollapseItem :disabled="false" name="3" title="Efficiency">
          <div>Simplify the process: keep operating process simple and intuitive;</div>
          <div
            >Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make
            decisions;
          </div>
        </VCollapseItem>
      </VCollapse>

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const activeNames = ref(['1']);
&lt;/script&gt;

&lt;template&gt;
  &lt;VCollapse v-model="activeNames" @change="handleChange"&gt;
    &lt;VCollapseItem title="Consistency" name="1"&gt;
      &lt;div&gt;Content for consistency section&lt;/div&gt;
    &lt;/VCollapseItem&gt;

    &lt;VCollapseItem title="Feedback" name="2"&gt;
      &lt;div&gt;Content for feedback section&lt;/div&gt;
    &lt;/VCollapseItem&gt;
  &lt;/VCollapse&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Режим аккордеона -->
    <div class="example-section">
      <h3>Режим аккордеона</h3>
      <p>Активний елемент: {{ accordionActiveNames }}</p>

      <VCollapse
        v-model="accordionActiveNames"
        :accordion="true"
        @change="val => console.log('Accordion changed:', val)"
      >
        <VCollapseItem name="a" title="Section 1">
          <p>Тільки один елемент може бути відкритий одночасно в режимі аккордеона.</p>
        </VCollapseItem>

        <VCollapseItem name="b" title="Section 2">
          <p>При відкритті цього елементу, попередній автоматично закриється.</p>
        </VCollapseItem>

        <VCollapseItem name="c" title="Section 3">
          <p>Це дозволяє зберегти компактність інтерфейсу.</p>
        </VCollapseItem>
      </VCollapse>

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const accordionActiveNames = ref(['a']);
&lt;/script&gt;

&lt;template&gt;
  &lt;VCollapse v-model="accordionActiveNames" :accordion="true"&gt;
    &lt;VCollapseItem title="Section 1" name="a"&gt;
      &lt;p&gt;Content for section 1&lt;/p&gt;
    &lt;/VCollapseItem&gt;

    &lt;VCollapseItem title="Section 2" name="b"&gt;
      &lt;p&gt;Content for section 2&lt;/p&gt;
    &lt;/VCollapseItem&gt;
  &lt;/VCollapse&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Відключені елементи -->
    <div class="example-section">
      <h3>Відключені елементи</h3>

      <VCollapse v-model="activeNames">
        <VCollapseItem name="active" title="Активний елемент">
          <div>Цей елемент можна відкрити та закрити.</div>
        </VCollapseItem>

        <VCollapseItem :disabled="true" name="disabled" title="Відключений елемент">
          <div>Цей контент недоступний.</div>
        </VCollapseItem>
      </VCollapse>

      <pre class="code-simple">
        <code>
&lt;template&gt;
  &lt;VCollapse v-model="activeNames"&gt;
    &lt;VCollapseItem title="Активний елемент" name="active"&gt;
      &lt;div&gt;Цей елемент можна відкрити та закрити.&lt;/div&gt;
    &lt;/VCollapseItem&gt;

    &lt;VCollapseItem title="Відключений елемент" name="disabled" :disabled="true"&gt;
      &lt;div&gt;Цей контент недоступний.&lt;/div&gt;
    &lt;/VCollapseItem&gt;
  &lt;/VCollapse&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Кастомні заголовки -->
    <div class="example-section">
      <h3>Кастомні заголовки</h3>

      <VCollapse v-model="customActiveNames">
        <VCollapseItem name="custom1">
          <template #title="{ isActive }">
            <div style="display: flex; align-items: center; gap: 8px">
              <span :style="{ color: isActive ? '#409eff' : '#303133' }">🚀 Custom Title</span>
              <span style="font-size: 12px; color: #909399">{{ isActive ? 'Відкрито' : 'Закрито' }}</span>
            </div>
          </template>
          <div>Кастомний контент з динамічним заголовком.</div>
        </VCollapseItem>

        <VCollapseItem name="custom2">
          <template #title="{ isActive }">
            <div style="display: flex; align-items: center; gap: 12px">
              <div
                :style="{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#67c23a' : '#dcdfe6',
                }"
              ></div>
              <strong>Індикатор статусу</strong>
            </div>
          </template>
          <div>Заголовок з кольоровим індикатором стану.</div>
        </VCollapseItem>
      </VCollapse>

      <pre class="code-simple">
        <code>
&lt;template&gt;
  &lt;VCollapse v-model="customActiveNames"&gt;
    &lt;VCollapseItem name="custom1"&gt;
      &lt;template #title="{ isActive }"&gt;
        &lt;div style="display: flex; align-items: center; gap: 8px;"&gt;
          &lt;span :style="{ color: isActive ? '#409eff' : '#303133' }"&gt;🚀 Custom Title&lt;/span&gt;
          &lt;span style="font-size: 12px; color: #909399;"&gt;{{ isActive ? 'Відкрито' : 'Закрито' }}&lt;/span&gt;
        &lt;/div&gt;
      &lt;/template&gt;
      &lt;div&gt;Кастомний контент з динамічним заголовком.&lt;/div&gt;
    &lt;/VCollapseItem&gt;
  &lt;/VCollapse&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- API Documentation -->
    <div class="example-section">
      <h3>API Документація</h3>

      <h4>VCollapse Props</h4>
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
            <td><code>modelValue</code></td>
            <td><code>string[]</code></td>
            <td><code>[]</code></td>
            <td>v-model значення - масив імен активних елементів</td>
          </tr>
          <tr>
            <td><code>accordion</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Режим аккордеона - тільки один елемент може бути відкритим</td>
          </tr>
        </tbody>
      </table>

      <h4>VCollapseItem Props</h4>
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
            <td><code>name</code></td>
            <td><code>string</code></td>
            <td><code>undefined</code></td>
            <td>Унікальний ідентифікатор елемента (обов'язковий)</td>
          </tr>
          <tr>
            <td><code>title</code></td>
            <td><code>string</code></td>
            <td><code>undefined</code></td>
            <td>Текст заголовку елемента</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Відключений стан елемента</td>
          </tr>
        </tbody>
      </table>

      <h4>VCollapse Events</h4>
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
            <td><code>(value: string[])</code></td>
            <td>Випромінюється коли v-model значення повинно бути оновлено</td>
          </tr>
          <tr>
            <td><code>change</code></td>
            <td><code>(value: string[])</code></td>
            <td>Випромінюється коли стан колапсу змінюється</td>
          </tr>
        </tbody>
      </table>

      <h4>VCollapseItem Events</h4>
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
            <td><code>toggle</code></td>
            <td><code>(name: string)</code></td>
            <td>Випромінюється коли елемент переключається</td>
          </tr>
        </tbody>
      </table>

      <h4>VCollapseItem Slots</h4>
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
            <td><code>default</code></td>
            <td>-</td>
            <td>Основний контент елемента колапсу</td>
          </tr>
          <tr>
            <td><code>title</code></td>
            <td><code>{ title: string, isActive: boolean }</code></td>
            <td>Кастомний заголовок з доступом до стану та оригінального title</td>
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

  .example-section h4 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #333;
    font-size: 1.1rem;
  }

  .v-collapse {
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

  .code-simple code {
    color: #333;
    background: none;
    padding: 0;
    border-radius: 0;
    font-family: inherit;
    font-size: inherit;
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
    vertical-align: top;
  }

  .api-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
  }

  .api-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .api-table tbody tr:hover {
    background-color: #f0f0f0;
  }

  .api-table code {
    background-color: #f1f3f4;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Courier New', Consolas, monospace;
    font-size: 12px;
    color: #d73a49;
  }

  .api-table th code {
    color: #333;
  }

  ul {
    padding-left: 1.5rem;
  }

  ul li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
</style>
