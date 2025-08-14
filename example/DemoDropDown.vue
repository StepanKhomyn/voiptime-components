<template>
  <div class="showcase">
    <!-- Підключення -->
    <section class="section">
      <h2>Підключення до проекту</h2>
      <div class="card">
        <h3>1. Базове використання</h3>
        <pre class="code">
          &lt;template&gt;
            &lt;VDropdown @command="handleCommand"&gt;
              &lt;!-- Trigger елемент --&gt;
              &lt;VButton&gt;Дії&lt;/VButton&gt;

              &lt;!-- Dropdown меню --&gt;
              &lt;template #dropdown&gt;
                &lt;VDropdownItem command="edit" icon="edit"&gt;
                  Редагувати
                &lt;/VDropdownItem&gt;
                &lt;VDropdownItem command="delete" icon="delete" divided&gt;
                  Видалити
                &lt;/VDropdownItem&gt;
                &lt;VDropdownItem command="share" disabled&gt;
                  Поділитися
                &lt;/VDropdownItem&gt;
              &lt;/template&gt;
            &lt;/VDropdown&gt;
          &lt;/template&gt;
        </pre>

        <h3>2. Обробка команд</h3>
        <pre class="code">
          &lt;script setup&gt;
          const handleCommand = (command: string | number) => {
            switch (command) {
              case 'edit':
                console.log('Редагування...');
                break;
              case 'delete':
                console.log('Видалення...');
                break;
              case 'share':
                console.log('Поділитися...');
                break;
            }
          };
          &lt;/script&gt;
        </pre>
      </div>
    </section>

    <!-- Демонстрація -->
    <section class="section">
      <h2>Демонстрація</h2>

      <!-- Типи тригерів -->
      <div class="demo-category">
        <h3>Типи тригерів</h3>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>Hover (наведення)</h4>
            <VDropdown trigger="hover" @command="handleDemoCommand">
              <button class="demo-button">Наведи мишку</button>
              <template #dropdown>
                <VDropdownItem command="hover-1">Пункт 1</VDropdownItem>
                <VDropdownItem command="hover-2">Пункт 2</VDropdownItem>
                <VDropdownItem command="hover-3">Пункт 3</VDropdownItem>
              </template>
            </VDropdown>
          </div>

          <div class="demo-item">
            <h4>Click (клік)</h4>
            <VDropdown trigger="click" @command="handleDemoCommand">
              <button class="demo-button">Клікни мене</button>
              <template #dropdown>
                <VDropdownItem command="click-1">Пункт 1</VDropdownItem>
                <VDropdownItem command="click-2">Пункт 2</VDropdownItem>
                <VDropdownItem command="click-3">Пункт 3</VDropdownItem>
              </template>
            </VDropdown>
          </div>
        </div>
      </div>

      <!-- Позиціонування -->
      <div class="demo-category">
        <h3>Позиціонування</h3>
        <div class="demo-positioning">
          <!-- Верхній ряд -->
          <div class="positioning-row">
            <VDropdown trigger="click" placement="top-start" @command="handleDemoCommand">
              <button class="demo-button small">top-start</button>
              <template #dropdown>
                <VDropdownItem command="top-start-1">Пункт 1</VDropdownItem>
                <VDropdownItem command="top-start-2">Пункт 2</VDropdownItem>
              </template>
            </VDropdown>

            <VDropdown trigger="click" placement="top" @command="handleDemoCommand">
              <button class="demo-button small">top</button>
              <template #dropdown>
                <VDropdownItem command="top-1">Пункт 1</VDropdownItem>
                <VDropdownItem command="top-2">Пункт 2</VDropdownItem>
              </template>
            </VDropdown>

            <VDropdown trigger="click" placement="top-end" @command="handleDemoCommand">
              <button class="demo-button small">top-end</button>
              <template #dropdown>
                <VDropdownItem command="top-end-1">Пункт 1</VDropdownItem>
                <VDropdownItem command="top-end-2">Пункт 2</VDropdownItem>
              </template>
            </VDropdown>
          </div>

          <!-- Нижній ряд -->
          <div class="positioning-row">
            <VDropdown trigger="click" placement="bottom-start" @command="handleDemoCommand">
              <button class="demo-button small">bottom-start</button>
              <template #dropdown>
                <VDropdownItem command="bottom-start-1">Пункт 1</VDropdownItem>
                <VDropdownItem command="bottom-start-2">Пункт 2</VDropdownItem>
              </template>
            </VDropdown>

            <VDropdown trigger="click" placement="bottom" @command="handleDemoCommand">
              <button class="demo-button small">bottom</button>
              <template #dropdown>
                <VDropdownItem command="bottom-1">Пункт 1</VDropdownItem>
                <VDropdownItem command="bottom-2">Пункт 2</VDropdownItem>
              </template>
            </VDropdown>

            <VDropdown trigger="click" placement="bottom-end" @command="handleDemoCommand">
              <button class="demo-button small">bottom-end</button>
              <template #dropdown>
                <VDropdownItem command="bottom-end-1">Пункт 1</VDropdownItem>
                <VDropdownItem command="bottom-end-2">Пункт 2</VDropdownItem>
              </template>
            </VDropdown>
          </div>
        </div>
      </div>

      <!-- Елементи меню -->
      <div class="demo-category">
        <h3>Елементи меню</h3>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>З роздільниками</h4>
            <VDropdown @command="handleDemoCommand">
              <button class="demo-button">Меню з роздільниками</button>
              <template #dropdown>
                <VDropdownItem command="new">Створити</VDropdownItem>
                <VDropdownItem command="open">Відкрити</VDropdownItem>
                <VDropdownItem command="save" divided>Зберегти</VDropdownItem>
                <VDropdownItem command="export">Експорт</VDropdownItem>
                <VDropdownItem command="print" divided>Друк</VDropdownItem>
              </template>
            </VDropdown>
          </div>

          <div class="demo-item">
            <h4>З вимкненими пунктами</h4>
            <VDropdown @command="handleDemoCommand">
              <button class="demo-button">Меню з disabled</button>
              <template #dropdown>
                <VDropdownItem command="available">Доступний</VDropdownItem>
                <VDropdownItem command="disabled" disabled>Недоступний</VDropdownItem>
                <VDropdownItem command="another-available">Ще доступний</VDropdownItem>
                <VDropdownItem command="another-disabled" disabled>Ще недоступний</VDropdownItem>
              </template>
            </VDropdown>
          </div>

          <div class="demo-item">
            <h4>Довге меню</h4>
            <VDropdown maxHeight="150" @command="handleDemoCommand">
              <button class="demo-button">Довге меню</button>
              <template #dropdown>
                <VDropdownItem v-for="i in 15" :key="i" :command="`item-${i}`"> Пункт меню {{ i }}</VDropdownItem>
              </template>
            </VDropdown>
          </div>
        </div>
      </div>

      <!-- Налаштування -->
      <div class="demo-category">
        <h3>Налаштування</h3>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>Вимкнений dropdown</h4>
            <VDropdown disabled @command="handleDemoCommand">
              <button class="demo-button" disabled>Вимкнений</button>
              <template #dropdown>
                <VDropdownItem command="disabled-1">Пункт 1</VDropdownItem>
                <VDropdownItem command="disabled-2">Пункт 2</VDropdownItem>
              </template>
            </VDropdown>
          </div>

          <div class="demo-item">
            <h4>Кастомні таймаути</h4>
            <VDropdown trigger="hover" :showTimeout="500" :hideTimeout="300" @command="handleDemoCommand">
              <button class="demo-button">Повільний hover</button>
              <template #dropdown>
                <VDropdownItem command="slow-1">Пункт 1</VDropdownItem>
                <VDropdownItem command="slow-2">Пункт 2</VDropdownItem>
              </template>
            </VDropdown>
          </div>

          <div class="demo-item">
            <h4>Різний контент</h4>
            <VDropdown @command="handleDemoCommand">
              <div class="custom-trigger">
                <span>🎯</span>
                <span>Кастомний тригер</span>
              </div>
              <template #dropdown>
                <div class="custom-dropdown-content">
                  <VDropdownItem command="custom-1">Звичайний пункт</VDropdownItem>
                  <div class="custom-item">
                    <strong>Кастомний контент</strong>
                    <p>Тут може бути будь-який HTML</p>
                  </div>
                  <VDropdownItem command="custom-2">Ще пункт</VDropdownItem>
                </div>
              </template>
            </VDropdown>
          </div>
        </div>
      </div>
    </section>

    <!-- Властивості -->
    <section class="section">
      <h2>Властивості VDropdown</h2>
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
              <td><code>trigger</code></td>
              <td><code>'click' | 'hover' </code></td>
              <td>'hover'</td>
              <td>Спосіб активації dropdown</td>
            </tr>
            <tr>
              <td><code>placement</code></td>
              <td><code>'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end'</code></td>
              <td>'bottom-start'</td>
              <td>Позиція меню відносно тригера</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Вимкнути dropdown</td>
            </tr>
            <tr>
              <td><code>hideOnClick</code></td>
              <td><code>boolean</code></td>
              <td>true</td>
              <td>Ховати меню при кліку на пункт</td>
            </tr>
            <tr>
              <td><code>showTimeout</code></td>
              <td><code>number</code></td>
              <td>250</td>
              <td>Затримка показу (мс) для hover</td>
            </tr>
            <tr>
              <td><code>hideTimeout</code></td>
              <td><code>number</code></td>
              <td>150</td>
              <td>Затримка приховування (мс) для hover</td>
            </tr>
            <tr>
              <td><code>maxHeight</code></td>
              <td><code>string | number</code></td>
              <td>'200'</td>
              <td>Максимальна висота меню (px)</td>
            </tr>
            <tr>
              <td><code>tabindex</code></td>
              <td><code>number</code></td>
              <td>0</td>
              <td>Tabindex для тригера</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Властивості VDropdownItem -->
    <section class="section">
      <h2>Властивості VDropdownItem</h2>
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
              <td><code>command</code></td>
              <td><code>string | number</code></td>
              <td>-</td>
              <td>Команда, яка передається в @command при кліку</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Вимкнути пункт меню</td>
            </tr>
            <tr>
              <td><code>divided</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Додати роздільник зверху</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>CSS клас або emoji для іконки</td>
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
              <th>Компонент</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>command</code></td>
              <td><code>string | number</code></td>
              <td>Емітується при кліку на VDropdownItem з command</td>
              <td>VDropdown</td>
            </tr>
            <tr>
              <td><code>visible-change</code></td>
              <td><code>boolean</code></td>
              <td>Емітується при зміні видимості dropdown</td>
              <td>VDropdown</td>
            </tr>
            <tr>
              <td><code>click</code></td>
              <td><code>MouseEvent</code></td>
              <td>Емітується при кліку на тригер або пункт меню</td>
              <td>VDropdown, VDropdownItem</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Методи -->
    <section class="section">
      <h2>Методи (Expose)</h2>
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
              <td><code>show()</code></td>
              <td>-</td>
              <td>void</td>
              <td>Програмно показати dropdown</td>
            </tr>
            <tr>
              <td><code>hide()</code></td>
              <td>-</td>
              <td>void</td>
              <td>Програмно сховати dropdown</td>
            </tr>
            <tr>
              <td><code>visible</code></td>
              <td>-</td>
              <td>Ref&lt;boolean&gt;</td>
              <td>Реактивне посилання на стан видимості</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Слоти -->
    <section class="section">
      <h2>Слоти</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Слот</th>
              <th>Опис</th>
              <th>Компонент</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>default</code></td>
              <td>Тригер елемент (кнопка, посилання, тощо)</td>
              <td>VDropdown</td>
            </tr>
            <tr>
              <td><code>dropdown</code></td>
              <td>Контент dropdown меню (VDropdownItem і кастомний контент)</td>
              <td>VDropdown</td>
            </tr>
            <tr>
              <td><code>default</code></td>
              <td>Текст або контент пункту меню</td>
              <td>VDropdownItem</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- TypeScript інтерфейси -->
    <section class="section">
      <h2>TypeScript інтерфейси</h2>

      <div class="card">
        <h3>DropdownProps</h3>
        <pre class="code">
interface DropdownProps {
  trigger?: 'click' | 'hover' | 'contextmenu';
  placement?: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end';
  disabled?: boolean;
  splitButton?: boolean;
  hideOnClick?: boolean;
  showTimeout?: number;
  hideTimeout?: number;
  tabindex?: number;
  maxHeight?: string | number;
}
        </pre>
      </div>

      <div class="card">
        <h3>DropdownItemProps</h3>
        <pre class="code">
interface DropdownItemProps {
  command?: string | number;
  disabled?: boolean;
  divided?: boolean;
  icon?: string;
}
        </pre>
      </div>

      <div class="card">
        <h3>DropdownEmits</h3>
        <pre class="code">
interface DropdownEmits {
  'visible-change': [visible: boolean];
  click: [event: MouseEvent];
  command: [command: string | number];
}
        </pre>
      </div>

      <div class="card">
        <h3>DropdownContext (provide/inject)</h3>
        <pre class="code">
interface DropdownContext {
  handleCommand: (command: string | number) => void;
  hideOnClick: boolean;
}

export const DropdownContextKey = Symbol('dropdown-context') as InjectionKey&lt;DropdownContext&gt;;
        </pre>
      </div>
    </section>

    <!-- Приклади використання -->
    <section class="section">
      <h2>Розширені приклади</h2>

      <div class="card">
        <h3>Dropdown в таблиці</h3>
        <pre class="code">
&lt;template&gt;
  &lt;VTable&gt;
    &lt;tr v-for="item in tableData" :key="item.id"&gt;
      &lt;td&gt;Назва&lt;/td&gt;
      &lt;td&gt;Статус&lt;/td&gt;
      &lt;td&gt;
        &lt;VDropdown @command="(cmd) => handleRowAction(cmd, item)"&gt;
          &lt;VButton size="small"&gt;Дії&lt;/VButton&gt;
          &lt;template #dropdown&gt;
            &lt;VDropdownItem command="edit" icon="✏️"&gt;Редагувати&lt;/VDropdownItem&gt;
            &lt;VDropdownItem command="duplicate" icon="📋"&gt;Дублювати&lt;/VDropdownItem&gt;
            &lt;VDropdownItem
              command="delete"
              icon="🗑️"
              divided
              :disabled="!item.canDelete"
            &gt;
              Видалити
            &lt;/VDropdownItem&gt;
          &lt;/template&gt;
        &lt;/VDropdown&gt;
      &lt;/td&gt;
    &lt;/tr&gt;
  &lt;/VTable&gt;
&lt;/template&gt;

&lt;script setup&gt;
const handleRowAction = (command: string, item: any) => {
  switch (command) {
    case 'edit':
      editItem(item);
      break;
    case 'duplicate':
      duplicateItem(item);
      break;
    case 'delete':
      deleteItem(item);
      break;
  }
};
&lt;/script&gt;
        </pre>
      </div>
    </section>

    <!-- Особливості роботи -->
    <section class="section">
      <h2>Особливості роботи</h2>

      <div class="card">
        <h3>Позиціонування та адаптивність</h3>
        <ul class="feature-list">
          <li
            ><strong>Автоматична корекція позиції:</strong> dropdown автоматично змінює позицію при виході за межі
            viewport
          </li>
          <li><strong>Teleport:</strong> меню рендериться в body для уникнення z-index конфліктів</li>
          <li><strong>Scroll detection:</strong> відстеження скролу батьківських елементів</li>
          <li
            ><strong>Visibility tracking:</strong> автоматичне приховування при прокрутці тригера за межі видимості
          </li>
        </ul>
      </div>

      <div class="card">
        <h3>Provide/Inject архітектура</h3>
        <ul class="feature-list">
          <li><strong>Контекст:</strong> VDropdown надає контекст через provide/inject</li>
          <li><strong>Команди:</strong> VDropdownItem автоматично викликає handleCommand батьківського dropdown</li>
          <li><strong>Налаштування:</strong> hideOnClick передається через контекст до всіх дочірніх елементів</li>
          <li><strong>Гнучкість:</strong> можна використовувати як VDropdownItem, так і кастомний контент</li>
        </ul>
      </div>

      <div class="card">
        <h3>Оптимізація продуктивності</h3>
        <ul class="feature-list">
          <li><strong>Lazy rendering:</strong> меню рендериться тільки при відкритті</li>
          <li><strong>Event listeners:</strong> додаються/видаляються динамічно</li>
          <li><strong>Timeout management:</strong> правильне очищення таймерів</li>
          <li><strong>Memory leaks prevention:</strong> cleanup в onUnmounted</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import VDropdown from '@/components/dropdown/VDropdown.vue';
  import VDropdownItem from '@/components/dropdown/VDropdownItem.vue';

  // Реактивні дані
  const lastCommand = ref<string | null>(null);
  const commandCount = ref(0);
  const programmaticDropdown = ref();

  // Методи для демонстрації
  const handleDemoCommand = (command: string | number) => {
    lastCommand.value = String(command);
    commandCount.value++;
    console.log('Dropdown command:', command);
  };

  const showProgrammatic = () => {
    programmaticDropdown.value?.show();
  };

  const hideProgrammatic = () => {
    programmaticDropdown.value?.hide();
  };

  const resetDemo = () => {
    commandCount.value = 0;
    lastCommand.value = null;
  };

  const clearLastCommand = () => {
    lastCommand.value = null;
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
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .demo-item {
    background: #f8f9fa;
    border: 1px solid #e1e8ed;
    border-radius: 6px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.2s;
  }

  .demo-item:hover {
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
  }

  .demo-item h4 {
    color: #495057;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .demo-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
    min-width: 120px;
  }

  .demo-button:hover:not(:disabled) {
    background: #0056b3;
  }

  .demo-button:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  .demo-button.small {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    min-width: 90px;
  }

  .demo-context-area {
    background: #e9ecef;
    border: 2px dashed #adb5bd;
    padding: 2rem;
    border-radius: 4px;
    color: #6c757d;
    cursor: context-menu;
    user-select: none;
  }

  .demo-controls {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .control-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.3rem 0.8rem;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background-color 0.2s;
  }

  .control-btn:hover {
    background: #218838;
  }

  .demo-positioning {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .positioning-row {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .custom-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: #6f42c1;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .custom-trigger:hover {
    background: #5a2d91;
  }

  .custom-dropdown-content {
    min-width: 200px;
  }

  .custom-item {
    padding: 0.8rem 1.2rem;
    border-bottom: 1px solid #e9ecef;
  }

  .custom-item:last-child {
    border-bottom: none;
  }

  .custom-item strong {
    display: block;
    color: #2c3e50;
    margin-bottom: 0.3rem;
  }

  .custom-item p {
    margin: 0;
    color: #6c757d;
    font-size: 0.9rem;
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

  .feature-list strong {
    color: #2c3e50;
  }

  @media (max-width: 768px) {
    .showcase {
      padding: 1rem;
    }

    .demo-grid {
      grid-template-columns: 1fr;
    }

    .positioning-row {
      flex-wrap: wrap;
      gap: 1rem;
    }

    .control-row {
      flex-direction: column;
      align-items: stretch;
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
