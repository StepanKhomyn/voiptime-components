<script lang="ts" setup>
  import { ref } from 'vue';
  import VRadiobox from '@/components/radiobox/VRadiobox.vue';

  const selectedOption = ref('option1');
  const selectedSize = ref('medium');
  const selectedVariant = ref('primary');
  const customLabel = ref('custom');
</script>

<template>
  <div>
    <!-- Основне використання з v-model -->
    <div class="example-section">
      <h3>Основне використання</h3>
      <p>Вибрана опція: {{ selectedOption }}</p>

      <VRadiobox v-model="selectedOption" label="Опція 1" name="example" value="option1" />

      <VRadiobox v-model="selectedOption" label="Опція 2" name="example" value="option2" />

      <VRadiobox v-model="selectedOption" disabled label="Опція 3" name="example" value="option3" />

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const selectedOption = ref('option1');
&lt;/script&gt;

&lt;template&gt;
  &lt;VRadiobox v-model="selectedOption" label="Опція 1" name="example" value="option1" /&gt;
  &lt;VRadiobox v-model="selectedOption" label="Опція 2" name="example" value="option2" /&gt;
  &lt;VRadiobox v-model="selectedOption" disabled label="Опція 3" name="example" value="option3" /&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Різні розміри -->
    <div class="example-section">
      <h3>Розміри</h3>

      <VRadiobox v-model="selectedSize" label="Маленький" name="sizes" size="small" value="small" />

      <VRadiobox v-model="selectedSize" label="Середній" name="sizes" size="medium" value="medium" />

      <VRadiobox v-model="selectedSize" label="Великий" name="sizes" size="large" value="large" />

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const selectedSize = ref('medium');
&lt;/script&gt;

&lt;template&gt;
  &lt;VRadiobox v-model="selectedSize" label="Маленький" name="sizes" size="small" value="small" /&gt;
  &lt;VRadiobox v-model="selectedSize" label="Середній" name="sizes" size="medium" value="medium" /&gt;
  &lt;VRadiobox v-model="selectedSize"  label="Великий" name="sizes" size="large" value="large" /&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Різні варіанти кольорів -->
    <div class="example-section">
      <h3>Варіанти кольорів</h3>

      <VRadiobox v-model="selectedVariant" label="Primary" name="variants" value="primary" variant="primary" />

      <VRadiobox v-model="selectedVariant" label="Success" name="variants" value="success" variant="success" />

      <VRadiobox v-model="selectedVariant" label="Warning" name="variants" value="warning" variant="warning" />

      <VRadiobox v-model="selectedVariant" label="Danger" name="variants" value="danger" variant="danger" />

      <VRadiobox v-model="selectedVariant" label="Info" name="variants" value="info" variant="info" />

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const selectedVariant = ref('primary');
&lt;/script&gt;

&lt;template&gt;
  &lt;VRadiobox v-model="selectedVariant" label="Primary" name="variants" value="primary" variant="primary" /&gt;
  &lt;VRadiobox v-model="selectedVariant" label="Success" name="variants" value="success" variant="success" /&gt;
  &lt;VRadiobox v-model="selectedVariant" label="Warning" name="variants" value="warning" variant="warning" /&gt;
  &lt;VRadiobox v-model="selectedVariant" label="Danger" name="variants" value="danger" variant="danger"/&gt;
  &lt;VRadiobox v-model="selectedVariant" label="Info" name="variants" value="info" variant="info"/&gt;
&lt;/template&gt;

        </code>
      </pre>
    </div>

    <!-- Використання слотів -->
    <div class="example-section">
      <h3>З кастомним лейблом</h3>

      <VRadiobox v-model="customLabel" name="example" value="custom">
        <template #label><strong>Кастомний лейбл</strong> з <em>форматуванням</em></template>
      </VRadiobox>

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const customLabel = ref('custom');
&lt;/script&gt;

&lt;template&gt;
  &lt;VRadiobox v-model="customLabel" name="example" value="custom"&gt;
    &lt;template #label&gt;
      &lt;strong&gt;Кастомний лейбл&lt;/strong&gt; з &lt;em&gt;форматуванням&lt;/em&gt;
    &lt;/template&gt;
  &lt;/VRadiobox&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- API Documentation -->
    <div class="example-section">
      <h3>API Документація</h3>

      <h4>Props</h4>
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
            <td><code>any</code></td>
            <td><code>undefined</code></td>
            <td>v-model значення - значення вибраного радіобоксу</td>
          </tr>
          <tr>
            <td><code>value</code></td>
            <td><code>any</code></td>
            <td><code>undefined</code></td>
            <td>Значення цієї опції радіобоксу</td>
          </tr>
          <tr>
            <td><code>checked</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Стан вибору (використовується коли не використовується v-model)</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Відключений стан</td>
          </tr>
          <tr>
            <td><code>label</code></td>
            <td><code>string</code></td>
            <td><code>undefined</code></td>
            <td>Текст лейблу радіобоксу</td>
          </tr>
          <tr>
            <td><code>name</code></td>
            <td><code>string</code></td>
            <td><code>undefined</code></td>
            <td>HTML атрибут name для групування радіобоксів</td>
          </tr>
          <tr>
            <td><code>id</code></td>
            <td><code>string</code></td>
            <td><code>undefined</code></td>
            <td>HTML атрибут id</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'small' | 'medium' | 'large'</code></td>
            <td><code>'medium'</code></td>
            <td>Варіант розміру</td>
          </tr>
          <tr>
            <td><code>variant</code></td>
            <td><code>'primary' | 'success' | 'warning' | 'danger' | 'info'</code></td>
            <td><code>'primary'</code></td>
            <td>Колірний варіант</td>
          </tr>
          <tr>
            <td><code>required</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Обов'язкове поле</td>
          </tr>
        </tbody>
      </table>

      <h4>Events</h4>
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
            <td><code>(value: any)</code></td>
            <td>Випромінюється коли v-model значення повинно бути оновлено</td>
          </tr>
          <tr>
            <td><code>change</code></td>
            <td><code>(value: any, event: Event)</code></td>
            <td>Випромінюється коли стан радіобоксу змінюється</td>
          </tr>
          <tr>
            <td><code>focus</code></td>
            <td><code>(event: FocusEvent)</code></td>
            <td>Випромінюється коли радіобокс отримує фокус</td>
          </tr>
          <tr>
            <td><code>blur</code></td>
            <td><code>(event: FocusEvent)</code></td>
            <td>Випромінюється коли радіобокс втрачає фокус</td>
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
            <td>Контент лейблу (альтернатива до <code>label</code> пропу)</td>
          </tr>
          <tr>
            <td><code>label</code></td>
            <td>Контент лейблу з можливістю HTML форматування</td>
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

  .vt-radiobox {
    margin-right: 1rem;
    margin-bottom: 0.5rem;
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
</style>
