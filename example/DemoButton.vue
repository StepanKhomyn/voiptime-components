<script lang="ts" setup>
  import { ref } from 'vue';
  import { icons } from '@/icons';
  import VButton from '@/components/button/VButton.vue';

  const loadingButtons = ref<Set<string>>(new Set());
  const copiedCode = ref<string | null>(null);

  const buttonTypes = ['default', 'primary', 'success', 'danger', 'warning', 'info'] as const;
  const buttonShapes = ['circle', 'square'] as const;
  const iconNames = Object.keys(icons).slice(0, 10); // Перші 10 іконок для прикладу

  async function copyCode(code: string, buttonId: string) {
    try {
      await navigator.clipboard.writeText(code);
      copiedCode.value = buttonId;
      setTimeout(() => {
        copiedCode.value = null;
      }, 2000);
    } catch (err) {
      console.error('Не  вдалося скопіювати:', err);
    }
  }

  function simulateLoading(buttonId: string) {
    loadingButtons.value.add(buttonId);
    setTimeout(() => {
      loadingButtons.value.delete(buttonId);
    }, 2000);
  }

  const exampleCode = `<template>
  <!-- Базове використання -->
  <VButton>Звичайна кнопка</VButton>

  <!-- Різні типи -->
  <VButton type="primary">Основна кнопка</VButton>
  <VButton type="success">Успіх</VButton>
  <VButton type="danger">Небезпека</VButton>

  <!-- З іконкою -->
  <VButton type="primary" icon="arrowDown">
    З іконкою
  </VButton>

  <!-- Іконка-кнопка -->
  <VButton
    type="primary"
    icon="close"
    shape="circle"
    tooltip
  >
    Закрити
  </VButton>

  <!-- Завантаження -->
  <VButton type="primary" :loading="isLoading">
    Завантажити
  </VButton>

  <!-- Заблокована -->
  <VButton disabled>
    Заблокована кнопка
  </VButton>
</template>`;
</script>

<template>
  <div class="button-showcase">
    <!-- Button Types -->
    <div class="showcase-section">
      <h2>Типи кнопок</h2>
      <div class="button-grid">
        <div v-for="type in buttonTypes" :key="type" class="button-item">
          <VButton :type="type">{{ type }}</VButton>
          <div class="button-code">
            <code @click="copyCode(`<VButton type=&quot;${type}&quot;>${type}</VButton>`, `type-${type}`)">
              &lt;VButton type="{{ type }}"&gt;{{ type }}&lt;/VButton&gt;
            </code>
            <span v-if="copiedCode === `type-${type}`" class="copied-indicator">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Disabled States -->
    <div class="showcase-section">
      <h2>Заблоковані стани</h2>
      <div class="button-grid">
        <div v-for="type in buttonTypes" :key="`disabled-${type}`" class="button-item">
          <VButton :type="type" disabled>{{ type }}</VButton>
          <div class="button-code">
            <code @click="copyCode(`<VButton type=&quot;${type}&quot; disabled>${type}</VButton>`, `disabled-${type}`)">
              &lt;VButton type="{{ type }}" disabled&gt;{{ type }}&lt;/VButton&gt;
            </code>
            <span v-if="copiedCode === `disabled-${type}`" class="copied-indicator">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading States -->
    <div class="showcase-section">
      <h2>Стани завантаження</h2>
      <div class="button-grid">
        <div v-for="type in buttonTypes" :key="`loading-${type}`" class="button-item">
          <VButton
            :loading="loadingButtons.has(`loading-${type}`)"
            :type="type"
            @click="simulateLoading(`loading-${type}`)"
          >
            {{ type }}
          </VButton>
          <div class="button-code">
            <code
              @click="
                copyCode(
                  `<VButton type=&quot;${type}&quot; :loading=&quot;isLoading&quot;>${type}</VButton>`,
                  `loading-${type}`
                )
              "
            >
              &lt;VButton type="{{ type }}" :loading="isLoading"&gt;{{ type }}&lt;/VButton&gt;
            </code>
            <span v-if="copiedCode === `loading-${type}`" class="copied-indicator">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Buttons with Icons -->
    <div class="showcase-section">
      <h2>Кнопки з іконками</h2>
      <div class="button-grid">
        <div v-for="(iconName, index) in iconNames" :key="`icon-${iconName}`" class="button-item">
          <VButton :icon="iconName" :type="buttonTypes[index % buttonTypes.length]">
            {{ iconName }}
          </VButton>
          <div class="button-code">
            <code
              @click="
                copyCode(
                  `<VButton type=&quot;${buttonTypes[index % buttonTypes.length]}&quot; icon=&quot;${iconName}&quot;>${iconName}</VButton>`,
                  `icon-${iconName}`
                )
              "
            >
              &lt;VButton type="{{ buttonTypes[index % buttonTypes.length] }}" icon="{{ iconName }}"&gt;{{
                iconName
              }}&lt;/VButton&gt;
            </code>
            <span v-if="copiedCode === `icon-${iconName}`" class="copied-indicator">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Icon-only Buttons - Circle -->
    <div class="showcase-section">
      <h2>Іконка-кнопки (круглі)</h2>
      <div class="button-grid">
        <div v-for="(type, index) in buttonTypes" :key="`circle-${type}`" class="button-item">
          <VButton :icon="iconNames[index]" :type="type" shape="circle" tooltip> {{ type }} action</VButton>
          <div class="button-code">
            <code
              @click="
                copyCode(
                  `<VButton type=&quot;${type}&quot; icon=&quot;${iconNames[index]}&quot; shape=&quot;circle&quot; tooltip>${type} action</VButton>`,
                  `circle-${type}`
                )
              "
            >
              &lt;VButton type="{{ type }}" icon="{{ iconNames[index] }}" shape="circle" tooltip&gt;{{ type }}
              action&lt;/VButton&gt;
            </code>
            <span v-if="copiedCode === `circle-${type}`" class="copied-indicator">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Icon-only Buttons - Square -->
    <div class="showcase-section">
      <h2>Іконка-кнопки (квадратні)</h2>
      <div class="button-grid">
        <div v-for="(type, index) in buttonTypes" :key="`square-${type}`" class="button-item">
          <VButton :icon="iconNames[index]" :type="type" shape="square" tooltip> {{ type }} action</VButton>
          <div class="button-code">
            <code
              @click="
                copyCode(
                  `<VButton type=&quot;${type}&quot; icon=&quot;${iconNames[index]}&quot; shape=&quot;square&quot; tooltip>${type} action</VButton>`,
                  `square-${type}`
                )
              "
            >
              &lt;VButton type="{{ type }}" icon="{{ iconNames[index] }}" shape="square" tooltip&gt;{{ type }}
              action&lt;/VButton&gt;
            </code>
            <span v-if="copiedCode === `square-${type}`" class="copied-indicator">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Documentation -->
    <div class="documentation">
      <h2>Документація компонента VButton</h2>

      <div class="doc-section">
        <h3>Props</h3>
        <table class="props-table">
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
              <td><code>type</code></td>
              <td><code>'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info'</code></td>
              <td>'default'</td>
              <td>Тип кнопки, що визначає її стиль</td>
            </tr>
            <tr>
              <td><code>shape</code></td>
              <td><code>'circle' | 'square'</code></td>
              <td>undefined</td>
              <td>Форма кнопки для іконка-кнопок</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Чи є кнопка заблокованою</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Показує стан завантаження</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>IconName</code></td>
              <td>undefined</td>
              <td>Назва іконки для відображення</td>
            </tr>
            <tr>
              <td><code>tooltip</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Показувати tooltip для іконка-кнопок</td>
            </tr>
            <tr>
              <td><code>tooltipPlacement</code></td>
              <td><code>TooltipPlacement</code></td>
              <td>'top'</td>
              <td>Розташування tooltip</td>
            </tr>
            <tr>
              <td><code>htmlType</code></td>
              <td><code>'button' | 'submit' | 'reset'</code></td>
              <td>'button'</td>
              <td>HTML тип кнопки</td>
            </tr>
            <tr>
              <td><code>color</code></td>
              <td><code>String</code></td>
              <td>#FFFFFF</td>
              <td>Зміна кольору вмісту кнопки</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="doc-section">
        <h3>Events</h3>
        <table class="props-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>Опис</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>click</code></td>
              <td><code>MouseEvent</code></td>
              <td>Спрацьовує при кліку на кнопку (якщо не заблокована і не в стані завантаження)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="doc-section">
        <h3>Приклади використання</h3>
        <pre class="code-example"><code>{{ exampleCode }}</code></pre>
      </div>

      <div class="doc-section">
        <h3>Особливості</h3>
        <div class="features-list">
          <div class="feature">
            <strong>Іконка-кнопки:</strong> Коли вказано і <code>icon</code> і <code>shape</code>, кнопка автоматично
            стає іконка-кнопкою та приховує текстовий контент
          </div>
          <div class="feature">
            <strong>Tooltip:</strong> Для іконка-кнопок можна увімкнути tooltip, який буде показувати текст зі слота
          </div>
          <div class="feature">
            <strong>Стан завантаження:</strong> Під час завантаження кнопка показує loader замість іконки та стає
            неактивною
          </div>
          <div class="feature">
            <strong>Автоматичне блокування:</strong> Кнопка автоматично блокується під час завантаження
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .button-showcase {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .showcase-section {
    margin-bottom: 4rem;

    h2 {
      color: #2c3e50;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #3498db;
      padding-bottom: 0.5rem;
    }
  }

  .button-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .button-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem;
    border: 1px solid #ecf0f1;
    border-radius: 8px;
    background: white;
    transition: all 0.2s;

    &:hover {
      border-color: #3498db;
      box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
    }

    .button-code {
      position: relative;
      width: 100%;

      code {
        display: block;
        background: #f8f9fa;
        padding: 0.75rem;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
        color: #495057;
        cursor: pointer;
        transition: background-color 0.2s;
        word-break: break-all;
        line-height: 1.4;

        &:hover {
          background: #e9ecef;
        }
      }

      .copied-indicator {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #27ae60;
        color: white;
        font-size: 0.7rem;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        animation: fadeIn 0.3s ease;
      }
    }
  }

  .documentation {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 2rem;
    margin-top: 3rem;

    h2,
    h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.8rem;
      border-bottom: 2px solid #3498db;
      padding-bottom: 0.5rem;
    }

    h3 {
      font-size: 1.3rem;
      margin-top: 2rem;
    }
  }

  .doc-section {
    margin-bottom: 2rem;
  }

  .props-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;

    th,
    td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    th {
      background: #e9ecef;
      font-weight: 600;
      color: #495057;
    }

    code {
      background: #f1f3f4;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
    }
  }

  .code-example {
    background: #2d3748;
    color: #e2e8f0;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;

    code {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }

  .features-list {
    .feature {
      margin-bottom: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 6px;
      border-left: 4px solid #3498db;

      strong {
        color: #2c3e50;
      }

      code {
        background: #f1f3f4;
        padding: 0.1rem 0.3rem;
        border-radius: 3px;
        font-size: 0.85rem;
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    .button-showcase {
      padding: 1rem;
    }

    .button-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .button-item {
      padding: 1rem;
    }

    .documentation {
      padding: 1rem;
    }

    .props-table {
      font-size: 0.9rem;

      th,
      td {
        padding: 0.5rem;
      }
    }
  }
</style>
