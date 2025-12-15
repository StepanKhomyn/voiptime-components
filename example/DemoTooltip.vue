<template>
  <div class="showcase">
    <!-- Підключення -->
    <section class="section">
      <h2>Підключення до проекту</h2>
      <div class="card">
        <h3>1. Реєстрація директиви глобально</h3>
        <pre class="code">
          // main.ts
          import { createApp } from 'vue';
          import { tooltipDirective } from '@/directives/tooltip';

          const app = createApp(App);
          app.directive('tooltip', tooltipDirective);
          app.mount('#app');
        </pre>

        <h3>2. Локальна реєстрація в компоненті</h3>
        <pre class="code">
          // У вашому компоненті
          import { tooltipDirective } from '@/directives/tooltip';

          export default {
            directives: {
              tooltip: tooltipDirective
            }
          }
        </pre>

        <h3>3. Використання в шаблоні</h3>
        <pre class="code">
          &lt;!-- Базове використання --&gt;
          &lt;button v-tooltip="'Це підказка'"&gt;Наведи на мене&lt;/button&gt;

          &lt;!-- З вказанням позиції --&gt;
          &lt;button
            v-tooltip="'Підказка зліва'"
            data-placement="left"
          &gt;
            Кнопка
          &lt;/button&gt;

          &lt;!-- Динамічний текст --&gt;
          &lt;span v-tooltip="dynamicTooltipText"&gt;Динамічна підказка&lt;/span&gt;

          &lt;!-- Умовне відображення --&gt;
          &lt;div v-tooltip="showTooltip ? 'Підказка активна' : ''"&gt;
            Умовний tooltip
          &lt;/div&gt;
        </pre>
      </div>
    </section>

    <!-- Демо -->
    <section class="section">
      <h2>Демонстрація</h2>

      <!-- Базові позиції -->
      <div class="demo-category">
        <h3>Позиціонування</h3>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>Зверху (top)</h4>
            <button v-tooltip="'Це підказка зверху'" class="demo-button" data-placement="top"> Наведи на мене</button>
          </div>

          <div class="demo-item">
            <h4>Знизу (bottom)</h4>
            <button v-tooltip="'Це підказка знизу'" class="demo-button" data-placement="bottom">
              Наведи на мене
            </button>
          </div>

          <div class="demo-item">
            <h4>Зліва (left)</h4>
            <button v-tooltip="'Це підказка зліва'" class="demo-button" data-placement="left"> Наведи на мене</button>
          </div>

          <div class="demo-item">
            <h4>Справа (right)</h4>
            <button v-tooltip="'Це підказка справа'" class="demo-button" data-placement="right">
              Наведи на мене
            </button>
          </div>
        </div>
      </div>

      <!-- Різні типи контенту -->
      <div class="demo-category">
        <h3>Типи контенту</h3>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>Короткий текст</h4>
            <span v-tooltip="'Короткий'" class="demo-text"> Короткий tooltip </span>
          </div>

          <div class="demo-item">
            <h4>Довгий текст</h4>
            <span
              v-tooltip="
                '\n' +
                '  beforeUnmount(el: TooltipHTMLElement) {\n' +
                '    // Видаляємо tooltip з DOM\n' +
                '    if (el.__tooltipEl && el.__tooltipEl.parentElement) {\n' +
                '      el.__tooltipEl.parentElement.removeChild(el.__tooltipEl);\n' +
                '      delete el.__tooltipEl;\n' +
                '    }\n' +
                '\n' +
                '    // Видаляємо обробники подій\n' +
                '    if (el.__mouseenterHandler) {\n' +
                '      el.removeEventListener(\'mouseenter\', el.__mouseenterHandler);\n' +
                '      delete el.__mouseenterHandler;\n' +
                '    }\n' +
                '\n' +
                '    if (el.__mouseleaveHandler) {\n' +
                '      el.removeEventListener(\'mouseleave\', el.__mouseleaveHandler);\n' +
                '      delete el.__mouseleaveHandler;\n' +
                '    }\n' +
                '\n' +
                '    if (el.__scrollHandler) {\n' +
                '      window.removeEventListener(\'scroll\', el.__scrollHandler, true);\n' +
                '      window.removeEventListener(\'resize\', el.__scrollHandler);\n' +
                '      delete el.__scrollHandler;\n' +
                '    }\n' +
                '  },\n' +
                '};'
              "
              class="demo-text"
            >
              Довгий tooltip
            </span>
          </div>

          <div class="demo-item">
            <h4>Динамічний контент</h4>
            <button v-tooltip="dynamicTooltip" class="demo-button" @click="updateDynamicTooltip">
              {{ dynamicTooltip || 'Клікни для зміни' }}
            </button>
          </div>

          <div class="demo-item">
            <h4>Умовний tooltip</h4>
            <label class="demo-checkbox">
              <input v-model="showConditionalTooltip" type="checkbox" />
              <span v-tooltip="showConditionalTooltip ? 'Tooltip активний!' : ''"> Показати tooltip </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Таблиця з overflow detection -->
      <div class="demo-category">
        <h3>Автоматичне визначення overflow в таблицях</h3>
        <div class="table-demo">
          <p class="table-description"> У таблицях tooltip показується тільки якщо текст не поміщається в комірку: </p>
          <table class="vt-table demo-table">
            <thead>
              <tr>
                <th>Коротка колонка</th>
                <th>Середня колонка</th>
                <th style="width: 100px">Вузька колонка</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-tooltip="'Короткий текст'">Короткий</td>
                <td v-tooltip="'Середній за довжиною текст'">Середній текст</td>
                <td v-tooltip="'Дуже довгий текст який точно не поміститься'">Дуже довгий текст</td>
              </tr>
              <tr>
                <td v-tooltip="'Текст'">Текст</td>
                <td v-tooltip="'Звичайний текст нормальної довжини'">Звичайний текст</td>
                <td v-tooltip="'Надзвичайно довгий текст який виходить за межі комірки'">Надзвичайно довгий</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Елементи форми -->
      <div class="demo-category">
        <h3>Елементи форми</h3>
        <div class="form-demo">
          <div class="form-group">
            <label v-tooltip="'Введіть ваше повне ім\'я'"> Ім'я користувача </label>
            <input v-tooltip="'Мінімум 2 символи, максимум 50'" placeholder="Введіть ім'я" type="text" />
          </div>

          <div class="form-group">
            <label v-tooltip="'Пароль має містити мінімум 8 символів'"> Пароль </label>
            <input
              v-tooltip="'Використовуйте літери, цифри та спеціальні символи'"
              placeholder="Введіть пароль"
              type="password"
            />
          </div>

          <div class="form-group">
            <label v-tooltip="'Виберіть вашу країну з списку'"> Країна </label>
            <select v-tooltip="'Список країн оновлюється щомісяця'">
              <option>Україна</option>
              <option>Польща</option>
              <option>Німеччина</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- API Документація -->
    <section class="section">
      <h2>API Документація</h2>

      <!-- Параметри директиви -->
      <div class="card">
        <h3>Параметри директиви</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Параметр</th>
                <th>Type</th>
                <th>Опис</th>
                <th>Приклад</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>v-tooltip</code></td>
                <td><code>string</code></td>
                <td>Текст підказки (обов'язковий)</td>
                <td><code>v-tooltip="'Текст підказки'"</code></td>
              </tr>
              <tr>
                <td><code>data-placement</code></td>
                <td><code>'top' | 'bottom' | 'left' | 'right'</code></td>
                <td>Позиція tooltip відносно елемента</td>
                <td><code>data-placement="top"</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Типи позиціонування -->
      <div class="card">
        <h3>Типи позиціонування (TooltipPlacement)</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Значення</th>
                <th>Опис</th>
                <th>Позиція стрілки</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>'top'</code></td>
                <td>Tooltip з'являється зверху елемента</td>
                <td>Стрілка знизу, по центру</td>
              </tr>
              <tr>
                <td><code>'bottom'</code></td>
                <td>Tooltip з'являється знизу елемента</td>
                <td>Стрілка зверху, по центру</td>
              </tr>
              <tr>
                <td><code>'left'</code></td>
                <td>Tooltip з'являється зліва від елемента</td>
                <td>Стрілка справа, по центру</td>
              </tr>
              <tr>
                <td><code>'right'</code></td>
                <td>Tooltip з'являється справа від елемента</td>
                <td>Стрілка зліва, по центру</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Особливості роботи -->
    <section class="section">
      <h2>Особливості роботи</h2>

      <div class="card">
        <h3>Автоматичне позиціонування</h3>
        <ul class="feature-list">
          <li>Tooltip автоматично коригує позицію при виході за межі viewport</li>
          <li>Горизонтальні межі: мінімум 8px від країв екрана</li>
          <li>Вертикальні межі: автоматична зміна на протилежну сторону при необхідності</li>
          <li>Позиція оновлюється при скролі та зміні розміру вікна</li>
        </ul>
      </div>

      <div class="card">
        <h3>Поведінка в таблицях</h3>
        <ul class="feature-list">
          <li
            >У елементах з класом <code>.vt-table</code> або <code>table</code> tooltip показується тільки при overflow
          </li>
          <li
            >Автоматичне визначення: <code>scrollWidth > clientWidth</code> або
            <code>scrollHeight > clientHeight</code></li
          >
          <li>Для звичайних елементів tooltip показується завжди</li>
        </ul>
      </div>

      <div class="card">
        <h3>Обробка тексту</h3>
        <ul class="feature-list">
          <li>Короткий текст (&lt; 50 символів) відображається в одну лінію</li>
          <li>Довгий текст автоматично переноситься з максимальною шириною 300px</li>
          <li>Підтримка динамічного оновлення тексту</li>
          <li>Автоматичне видалення tooltip при порожньому тексті</li>
        </ul>
      </div>

      <div class="card">
        <h3>Події та lifecycle</h3>
        <ul class="feature-list">
          <li><strong>mouseenter:</strong> Показ tooltip з анімацією появи</li>
          <li><strong>mouseleave:</strong> Приховування tooltip з анімацією зникнення</li>
          <li><strong>scroll/resize:</strong> Автоматичне оновлення позиції</li>
          <li><strong>beforeUnmount:</strong> Очищення DOM та event listeners</li>
        </ul>
      </div>
    </section>

    <!-- TypeScript інтерфейси -->
    <section class="section">
      <h2>TypeScript інтерфейси</h2>

      <div class="card">
        <h3>TooltipPlacement</h3>
        <pre class="code">
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
        </pre>
      </div>

      <div class="card">
        <h3>TooltipHTMLElement</h3>
        <pre class="code">
type TooltipHTMLElement = HTMLElement & {
  __tooltipEl?: HTMLDivElement;
  __mouseenterHandler?: () => void;
  __mouseleaveHandler?: () => void;
  __scrollHandler?: () => void;
};
        </pre>
      </div>

      <div class="card">
        <h3>Реєстрація директиви</h3>
        <pre class="code">
// types/global.d.ts
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    vTooltip: string;
  }
}
        </pre>
      </div>
    </section>

    <!-- Приклади використання -->
    <section class="section">
      <h2>Розширені приклади</h2>

      <div class="card">
        <h3>Tooltip в циклах</h3>
        <pre class="code">
&lt;template&gt;
  &lt;div v-for="item in items" :key="item.id"&gt;
    &lt;span
      v-tooltip="item.description"
      :data-placement="getPlacementForIndex(index)"
    &gt;
      Назва
    &lt;/span&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
const getPlacementForIndex = (index) => {
  const placements = ['top', 'right', 'bottom', 'left'];
  return placements[index % placements.length];
};
&lt;/script&gt;
        </pre>
      </div>

      <div class="card">
        <h3>Композиція з іншими директивами</h3>
        <pre class="code">
&lt;template&gt;
  &lt;!-- З v-if --&gt;
  &lt;button
    v-if="showButton"
    v-tooltip="buttonTooltip"
    @click="handleClick"
  &gt;
    Кнопка
  &lt;/button&gt;

  &lt;!-- З v-for та умовами --&gt;
  &lt;div
    v-for="(item, index) in filteredItems"
    :key="item.id"
    v-tooltip="item.error ? item.errorMessage : item.description"
    :data-placement="index % 2 === 0 ? 'top' : 'bottom'"
    :class="{ 'has-error': item.error }"
  &gt;
    Титулка
  &lt;/div&gt;
&lt;/template&gt;
        </pre>
      </div>
    </section>

    <!-- Стилізація -->
    <section class="section">
      <h2>Кастомізація стилів</h2>

      <div class="card">
        <h3>CSS класи для стилізації</h3>
        <pre class="code">
/* Базовий tooltip */
.vt-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
  z-index: 9999;
  max-width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Стрілка */
.vt-tooltip__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

/* Модифікатори позиції */
.vt-tooltip--top { /* стилі для top */ }
.vt-tooltip--bottom { /* стилі для bottom */ }
.vt-tooltip--left { /* стилі для left */ }
.vt-tooltip--right { /* стилі для right */ }
        </pre>
      </div>

      <div class="card">
        <h3>Кастомна тема</h3>
        <pre class="code">
/* Темна тема */
.vt-tooltip.dark-theme {
  background: #1a1a1a;
  color: #ffffff;
  border: 1px solid #333;
}

/* Світла тема */
.vt-tooltip.light-theme {
  background: #ffffff;
  color: #333333;
  border: 1px solid #e1e8ed;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Помилка */
.vt-tooltip.error-theme {
  background: #dc3545;
  color: white;
}

/* Успіх */
.vt-tooltip.success-theme {
  background: #28a745;
  color: white;
}
        </pre>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  // Реактивні дані для демонстрації
  const dynamicTooltip = ref('Початковий текст');
  const showConditionalTooltip = ref(true);

  // Список динамічних підказок
  const tooltipTexts = [
    'Початковий текст',
    'Оновлений tooltip',
    'Нова підказка',
    'Ще одна варіація',
    'Фінальний текст',
  ];

  let tooltipIndex = 0;

  // Методи
  const updateDynamicTooltip = () => {
    tooltipIndex = (tooltipIndex + 1) % tooltipTexts.length;
    dynamicTooltip.value = tooltipTexts[tooltipIndex];
  };

  const resetDemo = () => {
    dynamicTooltip.value = 'Початковий текст';
    showConditionalTooltip.value = true;
    tooltipIndex = 0;
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
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .card h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .demo-category {
    margin-bottom: 2rem;
  }

  .demo-category h3 {
    color: #2c3e50;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e1e8ed;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .demo-item {
    background: #f8f9fa;
    border: 1px solid #e1e8ed;
    border-radius: 6px;
    padding: 1rem;
    text-align: center;
    transition: all 0.2s;
  }

  .demo-item:hover {
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
  }

  .demo-item h4 {
    color: #495057;
    margin-bottom: 0.8rem;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .demo-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }

  .demo-button:hover {
    background: #0056b3;
  }

  .demo-text {
    display: inline-block;
    padding: 0.5rem;
    background: #e9ecef;
    border-radius: 4px;
    cursor: help;
    color: #495057;
  }

  .demo-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .demo-checkbox input {
    margin: 0;
  }

  .table-demo {
    margin-top: 1rem;
  }

  .table-description {
    color: #6c757d;
    font-style: italic;
    margin-bottom: 1rem;
  }

  .demo-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #e1e8ed;
  }

  .demo-table th,
  .demo-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e1e8ed;
    position: relative;
  }

  .demo-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }

  .demo-table td {
    cursor: help;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .form-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .form-group label {
    font-weight: 500;
    color: #495057;
    cursor: help;
  }

  .form-group input,
  .form-group select {
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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

  .feature-list {
    margin: 0;
    padding-left: 1.5rem;
  }

  .feature-list li {
    margin-bottom: 0.5rem;
    color: #495057;
    line-height: 1.5;
  }

  .feature-list code {
    background: #f1f3f4;
    padding: 0.1rem 0.3rem;
    border-radius: 2px;
    font-family: monospace;
    font-size: 0.9rem;
  }

  .control-panel {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .control-group {
    margin-bottom: 1rem;
  }

  .control-group:last-child {
    margin-bottom: 0;
  }

  .control-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #495057;
  }

  .control-group input[type='text'] {
    width: 100%;
    max-width: 300px;
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
  }

  .control-group input[type='text']:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .control-group input[type='checkbox'] {
    margin-right: 0.5rem;
  }

  .control-button {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }

  .control-button:hover {
    background: #218838;
  }

  @media (max-width: 768px) {
    .showcase {
      padding: 1rem;
    }

    .demo-grid {
      grid-template-columns: 1fr;
    }

    .form-demo {
      max-width: none;
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

    .control-group input[type='text'] {
      max-width: none;
    }
  }
</style>
