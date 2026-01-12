<script lang="ts" setup>
  import { ref } from 'vue';
  import { VMessage } from '@/components/message/message-plugin';
  import VButton from '@/components/button/VButton.vue';

  const messageText = ref('Це тестове повідомлення');
  const messageType = ref<'success' | 'danger' | 'warning' | 'primary'>('success');
  const showClose = ref(true);
  const duration = ref(3000);
  const dangerouslyUseHTMLString = ref(false);
</script>

<template>
  <div>
    <!-- Основне використання -->
    <div class="example-section">
      <h3>Основне використання</h3>
      <p>Натисніть на кнопки щоб показати повідомлення</p>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
        <VButton type="success" @click="VMessage({ type: 'success', message: 'Операція виконана успішно!' })">
          Success Message
        </VButton>

        <VButton type="danger" @click="VMessage({ type: 'danger', message: 'Виникла помилка!' })">
          danger Message
        </VButton>

        <VButton type="warning" @click="VMessage({ type: 'warning', message: 'Попередження!' })">
          Warning Message
        </VButton>

        <VButton type="primary" @click="VMessage({ message: 'Інформаційне повідомлення' })">
          primary Message (за замовчуванням)
        </VButton>
      </div>

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { VMessage } from '@/plugins/message-plugin';
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="VMessage({ type: 'success', message: 'Операція виконана успішно!' })"&gt;Success&lt;/button&gt;
  &lt;button @click="VMessage({ type: 'danger', message: 'Виникла помилка!' })"&gt;danger&lt;/button&gt;
  &lt;button @click="VMessage({ type: 'warning', message: 'Попередження!' })"&gt;Warning&lt;/button&gt;
  &lt;button @click="VMessage({ message: 'Без типу = primary за замовчуванням' })"&gt;Default primary&lt;/button&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Різні опції -->
    <div class="example-section">
      <h3>Різні опції</h3>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
        <VButton type="success" @click="VMessage({ type: 'success', message: 'З кнопкою закриття', showClose: true })">
          З кнопкою закриття
        </VButton>

        <VButton
          type="success"
          @click="
            VMessage({
              type: 'warning',
              title: 'Без закриття',
              message:
                'Без автозакриття Без автозакриття Без автозакриття Без автозакриття Без автозакриття Без автозакриття Без автозакриття Без автозакриття Без автозакриття',
              showClose: true,
              duration: 0,
            })
          "
        >
          Без автозакриття
        </VButton>

        <VButton
          type="primary"
          @click="VMessage({ type: 'primary', message: 'Довге повідомлення (10сек)', duration: 10000 })"
        >
          Довге повідомлення
        </VButton>
      </div>

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { VMessage } from '@/plugins/message-plugin';
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="VMessage({ type: 'success', message: 'З кнопкою закриття', showClose: true })"&gt;З кнопкою закриття&lt;/button&gt;
  &lt;button @click="VMessage({ type: 'danger', message: 'Без автозакриття', showClose: true, duration: 0 })"&gt;Без автозакриття&lt;/button&gt;
  &lt;button @click="VMessage({ type: 'primary', message: 'Довге повідомлення (10сек)', duration: 10000 })"&gt;Довге повідомлення&lt;/button&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- HTML контент -->
    <div class="example-section">
      <h3>HTML контент</h3>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
        <VButton @click="VMessage({ message: 'Завантаження: &lt;b&gt;75%&lt;/b&gt;', dangerouslyUseHTMLString: true })">
          З HTML тегами
        </VButton>

        <VButton
          @click="
            VMessage({
              message: 'Файл &lt;em&gt;document.pdf&lt;/em&gt; завантажено успішно!',
              dangerouslyUseHTMLString: true,
              showClose: true,
            })
          "
        >
          З форматуванням
        </VButton>
      </div>

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { VMessage } from '@/plugins/message-plugin';
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="VMessage({
    type: 'primary',
    message: 'Завантаження: &amp;lt;b&amp;gt;75%&amp;lt;/b&amp;gt;',
    dangerouslyUseHTMLString: true
  })"&gt;З HTML тегами&lt;/button&gt;

  &lt;button @click="VMessage({
    type: 'success',
    message: 'Файл &amp;lt;em&amp;gt;document.pdf&amp;lt;/em&amp;gt; завантажено успішно!',
    dangerouslyUseHTMLString: true,
    showClose: true
  })"&gt;З форматуванням&lt;/button&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Інтерактивний конструктор -->
    <div class="example-section">
      <h3>Інтерактивний конструктор повідомлень</h3>

      <div class="form-grid">
        <div class="form-group">
          <label>Текст повідомлення:</label>
          <input v-model="messageText" class="form-input" type="text" />
        </div>

        <div class="form-group">
          <label>Тип:</label>
          <select v-model="messageType" class="form-select">
            <option value="success">Success</option>
            <option value="danger">danger</option>
            <option value="warning">Warning</option>
            <option value="primary">primary</option>
          </select>
        </div>

        <div class="form-group">
          <label>Тривалість (мс):</label>
          <input v-model.number="duration" class="form-input" min="0" step="1000" type="number" />
          <small>0 = без автозакриття</small>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input v-model="showClose" class="form-checkbox" type="checkbox" />
            Показати кнопку закриття
          </label>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input v-model="dangerouslyUseHTMLString" class="form-checkbox" type="checkbox" />
            Дозволити HTML
          </label>
        </div>
      </div>

      <VButton
        type="primary"
        @click="VMessage({ type: messageType, message: messageText, showClose, duration, dangerouslyUseHTMLString })"
      >
        Показати повідомлення
      </VButton>

      <pre class="code-simple">
        <code>
VMessage({
  type: '{{ messageType }}',
  message: '{{ messageText }}',
  showClose: {{ showClose }},
  duration: {{ duration }},
  dangerouslyUseHTMLString: {{ dangerouslyUseHTMLString }}
})
        </code>
      </pre>
    </div>

    <!-- Керування повідомленнями -->
    <div class="example-section">
      <h3>Керування повідомленнями</h3>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
        <VButton
          type="primary"
          @click="
            () => {
              VMessage({ type: 'primary', message: 'Повідомлення 1', duration: 10000 });
              VMessage({ type: 'warning', message: 'Повідомлення 2', duration: 10000 });
              VMessage({ type: 'success', message: 'Повідомлення 3', duration: 10000 });
            }
          "
        >
          Показати кілька повідомлень
        </VButton>

        <VButton @click="VMessage.closeAll()"> Закрити всі повідомлення</VButton>
      </div>
      <pre class="code-simple">
        <code>
// Створення кількох повідомлень
VMessage({ type: 'primary', message: 'Повідомлення 1', duration: 10000 })
VMessage({ type: 'warning', message: 'Повідомлення 2', duration: 10000 })
VMessage({ type: 'success', message: 'Повідомлення 3', duration: 10000 })

// Закриття всіх повідомлень
VMessage.closeAll()
        </code>
      </pre>
    </div>

    <!-- API Documentation -->
    <div class="example-section">
      <h3>API Документація</h3>

      <h4>Основний метод</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Тип</th>
            <th>Повертає</th>
            <th>Опис</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>VMessage(options)</code></td>
            <td><code>VMessageOptions</code></td>
            <td><code>number</code></td>
            <td>Головний метод для створення повідомлень</td>
          </tr>
          <tr>
            <td><code>VMessage.success(message, options?)</code></td>
            <td><code>string, Partial&lt;VMessageOptions&gt;</code></td>
            <td><code>number</code></td>
            <td>Швидкий метод для успішного повідомлення</td>
          </tr>
          <tr>
            <td><code>VMessage.danger(message, options?)</code></td>
            <td><code>string, Partial&lt;VMessageOptions&gt;</code></td>
            <td><code>number</code></td>
            <td>Швидкий метод для повідомлення про помилку</td>
          </tr>
          <tr>
            <td><code>VMessage.warning(message, options?)</code></td>
            <td><code>string, Partial&lt;VMessageOptions&gt;</code></td>
            <td><code>number</code></td>
            <td>Швидкий метод для попереджувального повідомлення</td>
          </tr>
          <tr>
            <td><code>VMessage.primary(message, options?)</code></td>
            <td><code>string, Partial&lt;VMessageOptions&gt;</code></td>
            <td><code>number</code></td>
            <td>Швидкий метод для інформаційного повідомлення</td>
          </tr>
          <tr>
            <td><code>VMessage.close(id)</code></td>
            <td><code>number</code></td>
            <td><code>void</code></td>
            <td>Закриває конкретне повідомлення за ID</td>
          </tr>
          <tr>
            <td><code>VMessage.closeAll()</code></td>
            <td><code>-</code></td>
            <td><code>void</code></td>
            <td>Закриває всі активні повідомлення</td>
          </tr>
        </tbody>
      </table>

      <h4>VMessageOptions</h4>
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
            <td><code>message</code></td>
            <td><code>string</code></td>
            <td><code>-</code></td>
            <td>Текст повідомлення</td>
          </tr>
          <tr>
            <td><code>type</code></td>
            <td><code>'success' | 'danger' | 'warning' | 'primary'</code></td>
            <td><code>'primary'</code></td>
            <td>Тип повідомлення</td>
          </tr>
          <tr>
            <td><code>showClose</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Показати кнопку закриття</td>
          </tr>
          <tr>
            <td><code>duration</code></td>
            <td><code>number</code></td>
            <td><code>3000</code></td>
            <td>Час відображення в мілісекундах (0 = без автозакриття)</td>
          </tr>
          <tr>
            <td><code>dangerouslyUseHTMLString</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Дозволити HTML в повідомленні (використовувати обережно!)</td>
          </tr>
        </tbody>
      </table>

      <h4>Глобальні властивості Vue</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Приклад</th>
            <th>Опис</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Options API</td>
            <td><code>this.$message({ type: 'success', message: 'Успіх!' })</code></td>
            <td>Використання через глобальну властивість</td>
          </tr>
          <tr>
            <td>Composition API (inject)</td>
            <td><code>const $message = inject('$message')</code></td>
            <td>Отримання через dependency injection</td>
          </tr>
          <tr>
            <td>Прямий імпорт</td>
            <td><code>import { VMessage } from '@/plugins/message-plugin'</code></td>
            <td>Найкращий варіант - прямий імпорт</td>
          </tr>
        </tbody>
      </table>

      <h4>Використання в різних контекстах</h4>
      <pre class="code-simple">
        <code>
// 1. Прямий імпорт (рекомендовано)
import { VMessage } from '@/plugins/message-plugin';
VMessage({ type: 'success', message: 'Успіх!' })

// 2. Options API
export default {
  methods: {
    showMessage() {
      this.$message({ type: 'success', message: 'Через this.$message!' })
    }
  }
}

// 3. Composition API з inject
import { inject } from 'vue'
const $message = inject('$message')
$message({ type: 'primary', message: 'Через inject' })

// 4. Швидкі методи
VMessage.success('Операція завершена')
VMessage.danger('Сталася помилка')
VMessage.warning('Увага!')
VMessage.primary('Інформація')
        </code>
      </pre>
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

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
  }

  .form-input,
  .form-select {
    padding: 8px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.2s ease;
  }

  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }

  .checkbox-label {
    display: flex !important;
    flex-direction: row !important;
    align-items: center;
    cursor: pointer;
  }

  .form-checkbox {
    margin-right: 8px;
    margin-bottom: 0;
  }

  .form-group small {
    margin-top: 4px;
    color: #909399;
    font-size: 12px;
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
