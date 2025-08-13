<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';

  const copiedCode = ref<string | null>(null);

  // Reactive states for different examples
  const basicStates = reactive({
    unchecked: false,
    checked: true,
    indeterminate: false,
    double: false,
    disabled: true,
  });

  const variantStates = reactive({
    primary: true,
    success: true,
    warning: true,
    danger: true,
    info: true,
  });

  const sizeStates = reactive({
    small: true,
    medium: true,
    large: true,
  });

  const doubleStates = reactive({
    primaryDouble: true,
    successDouble: true,
    warningDouble: true,
    dangerDouble: true,
    infoDouble: true,
  });

  const formStates = reactive({
    terms: false,
    newsletter: true,
    notifications: false,
  });

  const groupStates = reactive({
    selectAll: false,
    item1: false,
    item2: true,
    item3: false,
  });

  // Computed property для indeterminate стану
  const isIndeterminate = computed(() => {
    const selectedItems = [groupStates.item1, groupStates.item2, groupStates.item3];
    const selectedCount = selectedItems.filter(Boolean).length;
    return selectedCount > 0 && selectedCount < selectedItems.length;
  });

  // Handle select all functionality
  const handleSelectAll = (value: boolean) => {
    groupStates.selectAll = value;
    groupStates.item1 = value;
    groupStates.item2 = value;
    groupStates.item3 = value;
  };

  const handleItemChange = () => {
    const allSelected = groupStates.item1 && groupStates.item2 && groupStates.item3;
    groupStates.selectAll = allSelected;
  };

  async function copyCode(code: string, buttonId: string) {
    try {
      await navigator.clipboard.writeText(code);
      copiedCode.value = buttonId;
      setTimeout(() => {
        copiedCode.value = null;
      }, 2000);
    } catch (err) {
      console.error('Не вдалося скопіювати:', err);
    }
  }

  const variants = ['primary', 'success', 'warning', 'danger', 'info'] as const;
  const sizes = ['small', 'medium', 'large'] as const;

  const exampleCode = `<template>
    <!-- Базове використання -->
    <VCheckbox v-model="isChecked" label="Звичайний чекбокс" />

    <!-- Різні варіанти -->
    <VCheckbox v-model="success" variant="success" label="Успіх" />
    <VCheckbox v-model="danger" variant="danger" label="Небезпека" />

    <!-- Різні розміри -->
    <VCheckbox v-model="small" size="small" label="Маленький" />
    <VCheckbox v-model="large" size="large" label="Великий" />

    <!-- Подвійна галочка -->
    <VCheckbox
      v-model="verified"
      :isDouble="true"
      variant="success"
      label="Верифіковано"
    />

    <!-- Indeterminate стан -->
    <VCheckbox
      v-model="selectAll"
      :indeterminate="someSelected && !allSelected"
      label="Вибрати все"
      @change="handleSelectAll"
    />

    <!-- Заблокований -->
    <VCheckbox
      v-model="disabled"
      disabled
      label="Заблокований чекбокс"
    />

    <!-- З слотом -->
    <VCheckbox v-model="custom">
      <template #label>
        <span>Користувацький <strong>лейбл</strong></span>
      </template>
    </VCheckbox>
  </template>`;
</script>

<template>
  <div class="checkbox-showcase">
    <!-- Basic States -->
    <div class="showcase-section">
      <h2>Базові стани</h2>
      <div class="checkbox-grid">
        <div class="checkbox-item">
          <VCheckbox v-model="basicStates.unchecked" label="Не вибрано" />
          <div class="checkbox-code">
            <code
              @click="
                copyCode('<VCheckbox v-model=&quot;unchecked&quot; label=&quot;Не вибрано&quot; />', 'basic-unchecked')
              "
            >
              &lt;VCheckbox v-model="unchecked" label="Не вибрано" /&gt;
            </code>
            <span v-if="copiedCode === 'basic-unchecked'" class="copied-indicator">✓</span>
          </div>
        </div>

        <div class="checkbox-item">
          <VCheckbox v-model="basicStates.checked" label="Вибрано" />
          <div class="checkbox-code">
            <code
              @click="copyCode('<VCheckbox v-model=&quot;checked&quot; label=&quot;Вибрано&quot; />', 'basic-checked')"
            >
              &lt;VCheckbox v-model="checked" label="Вибрано" /&gt;
            </code>
            <span v-if="copiedCode === 'basic-checked'" class="copied-indicator">✓</span>
          </div>
        </div>

        <div class="checkbox-item">
          <VCheckbox v-model="basicStates.indeterminate" :indeterminate="true" label="Indeterminate" />
          <div class="checkbox-code">
            <code
              @click="
                copyCode(
                  '<VCheckbox v-model=&quot;indeterminate&quot; :indeterminate=&quot;true&quot; label=&quot;Indeterminate&quot; />',
                  'basic-indeterminate'
                )
              "
            >
              &lt;VCheckbox v-model="indeterminate" :indeterminate="true" label="Indeterminate" /&gt;
            </code>
            <span v-if="copiedCode === 'basic-indeterminate'" class="copied-indicator">✓</span>
          </div>
        </div>

        <div class="checkbox-item">
          <VCheckbox v-model="basicStates.disabled" disabled label="Заблокований" />
          <div class="checkbox-code">
            <code
              @click="
                copyCode(
                  '<VCheckbox v-model=&quot;disabled&quot; disabled label=&quot;Заблокований&quot; />',
                  'basic-disabled'
                )
              "
            >
              &lt;VCheckbox v-model="disabled" disabled label="Заблокований" /&gt;
            </code>
            <span v-if="copiedCode === 'basic-disabled'" class="copied-indicator">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Variants -->
    <div class="showcase-section">
      <h2>Варіанти кольорів</h2>
      <div class="checkbox-grid">
        <div v-for="variant in variants" :key="variant" class="checkbox-item">
          <VCheckbox v-model="variantStates[variant]" :variant="variant" :label="variant" />
          <div class="checkbox-code">
            <code
              @click="
                copyCode(
                  `<VCheckbox v-model=&quot;${variant}&quot; variant=&quot;${variant}&quot; label=&quot;${variant}&quot; />`,
                  `variant-${variant}`
                )
              "
            >
              &lt;VCheckbox v-model="{{ variant }}" variant="{{ variant }}" label="{{ variant }}" /&gt;
            </code>
            <span v-if="copiedCode === `variant-${variant}`" class="copied-indicator">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sizes -->
    <div class="showcase-section">
      <h2>Розміри</h2>
      <div class="checkbox-grid">
        <div v-for="size in sizes" :key="size" class="checkbox-item">
          <VCheckbox v-model="sizeStates[size]" :size="size" :label="`${size} розмір`" />
          <div class="checkbox-code">
            <code
              @click="
                copyCode(
                  `<VCheckbox v-model=&quot;${size}&quot; size=&quot;${size}&quot; label=&quot;${size} розмір&quot; />`,
                  `size-${size}`
                )
              "
            >
              &lt;VCheckbox v-model="{{ size }}" size="{{ size }}" label="{{ size }} розмір" /&gt;
            </code>
            <span v-if="copiedCode === `size-${size}`" class="copied-indicator">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Double Checkmarks -->
    <div class="showcase-section">
      <h2>Подвійні галочки</h2>
      <div class="checkbox-grid">
        <div v-for="variant in variants" :key="`double-${variant}`" class="checkbox-item">
          <VCheckbox
            v-model="doubleStates[`${variant}Double`]"
            :variant="variant"
            :isDouble="true"
            :label="`${variant} подвійна`"
          />
          <div class="checkbox-code">
            <code
              @click="
                copyCode(
                  `<VCheckbox v-model=&quot;${variant}Double&quot; variant=&quot;${variant}&quot; :isDouble=&quot;true&quot; label=&quot;${variant} подвійна&quot; />`,
                  `double-${variant}`
                )
              "
            >
              &lt;VCheckbox v-model="{{ variant }}Double" variant="{{ variant }}" :isDouble="true" label="{{ variant }}
              подвійна" /&gt;
            </code>
            <span v-if="copiedCode === `double-${variant}`" class="copied-indicator">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Disabled States -->
    <div class="showcase-section">
      <h2>Заблоковані стани</h2>
      <div class="checkbox-grid">
        <div class="checkbox-item">
          <VCheckbox :checked="false" disabled label="Заблокований (не вибрано)" />
          <div class="checkbox-code">
            <code
              @click="
                copyCode(
                  '<VCheckbox :checked=&quot;false&quot; disabled label=&quot;Заблокований (не вибрано)&quot; />',
                  'disabled-unchecked'
                )
              "
            >
              &lt;VCheckbox :checked="false" disabled label="Заблокований (не вибрано)" /&gt;
            </code>
            <span v-if="copiedCode === 'disabled-unchecked'" class="copied-indicator">✓</span>
          </div>
        </div>

        <div class="checkbox-item">
          <VCheckbox :checked="true" disabled label="Заблокований (вибрано)" />
          <div class="checkbox-code">
            <code
              @click="
                copyCode(
                  '<VCheckbox :checked=&quot;true&quot; disabled label=&quot;Заблокований (вибрано)&quot; />',
                  'disabled-checked'
                )
              "
            >
              &lt;VCheckbox :checked="true" disabled label="Заблокований (вибрано)" /&gt;
            </code>
            <span v-if="copiedCode === 'disabled-checked'" class="copied-indicator">✓</span>
          </div>
        </div>

        <div class="checkbox-item">
          <VCheckbox :checked="true" :isDouble="true" disabled variant="success" label="Заблокований (подвійна)" />
          <div class="checkbox-code">
            <code
              @click="
                copyCode(
                  '<VCheckbox :checked=&quot;true&quot; :isDouble=&quot;true&quot; disabled variant=&quot;success&quot; label=&quot;Заблокований (подвійна)&quot; />',
                  'disabled-double'
                )
              "
            >
              &lt;VCheckbox :checked="true" :isDouble="true" disabled variant="success" label="Заблокований (подвійна)"
              /&gt;
            </code>
            <span v-if="copiedCode === 'disabled-double'" class="copied-indicator">✓</span>
          </div>
        </div>

        <div class="checkbox-item">
          <VCheckbox :checked="false" :indeterminate="true" disabled label="Заблокований (indeterminate)" />
          <div class="checkbox-code">
            <code
              @click="
                copyCode(
                  '<VCheckbox :checked=&quot;false&quot; :indeterminate=&quot;true&quot; disabled label=&quot;Заблокований (indeterminate)&quot; />',
                  'disabled-indeterminate'
                )
              "
            >
              &lt;VCheckbox :checked="false" :indeterminate="true" disabled label="Заблокований (indeterminate)" /&gt;
            </code>
            <span v-if="copiedCode === 'disabled-indeterminate'" class="copied-indicator">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Example -->
    <div class="showcase-section">
      <h2>Приклад форми</h2>
      <div class="form-example">
        <div class="form-group">
          <VCheckbox
            v-model="formStates.terms"
            variant="danger"
            required
            label="Я погоджуюся з умовами використання *"
          />
        </div>
        <div class="form-group">
          <VCheckbox v-model="formStates.newsletter" variant="info" label="Отримувати розсилку новин" />
        </div>
        <div class="form-group">
          <VCheckbox v-model="formStates.notifications" variant="warning">
            <template #label> Отримувати <strong>push-повідомлення</strong> на пристрій</template>
          </VCheckbox>
        </div>
        <div class="checkbox-code">
          <code
            @click="
              copyCode(
                `<VCheckbox v-model=&quot;terms&quot; variant=&quot;danger&quot; required label=&quot;Я погоджуюся з умовами *&quot; />
<VCheckbox v-model=&quot;newsletter&quot; variant=&quot;info&quot; label=&quot;Отримувати розсилку&quot; />
<VCheckbox v-model=&quot;notifications&quot; variant=&quot;warning&quot;>
  <template #label>Отримувати <strong>push-повідомлення</strong></template>
</VCheckbox>`,
                'form-example'
              )
            "
          >
            Форма з різними варіантами чекбоксів
          </code>
          <span v-if="copiedCode === 'form-example'" class="copied-indicator">✓</span>
        </div>
      </div>
    </div>

    <!-- Group Example with Select All -->
    <div class="showcase-section">
      <h2>Група з "Вибрати все"</h2>
      <div class="group-example">
        <div class="group-header">
          <VCheckbox
            v-model="groupStates.selectAll"
            :indeterminate="isIndeterminate"
            variant="primary"
            label="Вибрати всі елементи"
            @change="handleSelectAll"
          />
        </div>
        <div class="group-items">
          <VCheckbox v-model="groupStates.item1" variant="success" label="Елемент 1" @change="handleItemChange" />
          <VCheckbox v-model="groupStates.item2" variant="success" label="Елемент 2" @change="handleItemChange" />
          <VCheckbox v-model="groupStates.item3" variant="success" label="Елемент 3" @change="handleItemChange" />
        </div>

        <!-- Debug Info -->
        <div class="debug-info">
          <h4>Стан об'єкта:</h4>
          <pre>{{ JSON.stringify(groupStates, null, 2) }}</pre>
          <p><strong>isIndeterminate:</strong> {{ isIndeterminate }}</p>
        </div>

        <div class="checkbox-code">
          <code
            @click="
              copyCode(
                `<script setup>
const groupStates = reactive({
  selectAll: false,
  item1: false,
  item2: false,
  item3: false,
});

// Computed для indeterminate стану
const isIndeterminate = computed(() => {
  const selectedItems = [groupStates.item1, groupStates.item2, groupStates.item3];
  const selectedCount = selectedItems.filter(Boolean).length;
  return selectedCount > 0 && selectedCount < selectedItems.length;
});

const handleSelectAll = (value) => {
  groupStates.selectAll = value;
  groupStates.item1 = value;
  groupStates.item2 = value;
  groupStates.item3 = value;
};

const handleItemChange = () => {
  const allSelected = groupStates.item1 && groupStates.item2 && groupStates.item3;
  groupStates.selectAll = allSelected;
};
</script>

<template>
  <VCheckbox
    v-model=&quot;groupStates.selectAll&quot;
    :indeterminate=&quot;isIndeterminate&quot;
    label=&quot;Вибрати всі&quot;
    @change=&quot;handleSelectAll&quot;
  />
  <VCheckbox v-model=&quot;groupStates.item1&quot; @change=&quot;handleItemChange&quot; />
  <VCheckbox v-model=&quot;groupStates.item2&quot; @change=&quot;handleItemChange&quot; />
  <VCheckbox v-model=&quot;groupStates.item3&quot; @change=&quot;handleItemChange&quot; />
</template>`,
                'group-example'
              )
            "
          >
            Повний приклад групи чекбоксів з indeterminate
          </code>
          <span v-if="copiedCode === 'group-example'" class="copied-indicator">✓</span>
        </div>
      </div>
    </div>

    <!-- Documentation -->
    <div class="documentation">
      <h2>Документація компонента VCheckbox</h2>

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
              <td><code>modelValue</code></td>
              <td><code>boolean</code></td>
              <td>undefined</td>
              <td>Значення чекбоксу (v-model)</td>
            </tr>
            <tr>
              <td><code>checked</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Початковий стан чекбоксу (якщо modelValue не використовується)</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>undefined</td>
              <td>Текст лейблу</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Чи заблокований чекбокс</td>
            </tr>
            <tr>
              <td><code>indeterminate</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Стан "частково вибрано"</td>
            </tr>
            <tr>
              <td><code>isDouble</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Показувати подвійну галочку</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>'small' | 'medium' | 'large'</code></td>
              <td>'medium'</td>
              <td>Розмір чекбоксу</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td><code>'primary' | 'success' | 'warning' | 'danger' | 'info'</code></td>
              <td>'primary'</td>
              <td>Кольорова схема чекбоксу</td>
            </tr>
            <tr>
              <td><code>required</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Чи є поле обов'язковим</td>
            </tr>
            <tr>
              <td><code>id</code></td>
              <td><code>string</code></td>
              <td>auto-generated</td>
              <td>ID елементу</td>
            </tr>
            <tr>
              <td><code>name</code></td>
              <td><code>string</code></td>
              <td>undefined</td>
              <td>Атрибут name для форми</td>
            </tr>
            <tr>
              <td><code>value</code></td>
              <td><code>string | number</code></td>
              <td>undefined</td>
              <td>Значення чекбоксу для форми</td>
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
              <td><code>update:modelValue</code></td>
              <td><code>boolean</code></td>
              <td>Оновлення значення (для v-model)</td>
            </tr>
            <tr>
              <td><code>change</code></td>
              <td><code>(value: boolean, event: Event)</code></td>
              <td>Зміна стану чекбоксу</td>
            </tr>
            <tr>
              <td><code>focus</code></td>
              <td><code>FocusEvent</code></td>
              <td>Отримання фокусу</td>
            </tr>
            <tr>
              <td><code>blur</code></td>
              <td><code>FocusEvent</code></td>
              <td>Втрата фокусу</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="doc-section">
        <h3>Слоти</h3>
        <table class="props-table">
          <thead>
            <tr>
              <th>Слот</th>
              <th>Опис</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>default</code></td>
              <td>Основний контент лейблу</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td>Користувацький лейбл (має пріоритет над default)</td>
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
            <strong>modelValue vs checked:</strong> Проп <code>modelValue</code> має пріоритет над <code>checked</code>.
            Використовуйте <code>modelValue</code> для v-model
          </div>
          <div class="feature">
            <strong>Автоматичний ID:</strong> Якщо ID не вказано, компонент автоматично генерує унікальний ID
          </div>
          <div class="feature">
            <strong>Подвійна галочка:</strong> Встановіть <code>isDouble="true"</code> для відображення подвійної
            галочки (використовується для масових дій)
          </div>
          <div class="feature">
            <strong>Indeterminate стан:</strong> Використовується для "вибрати все" функціональності, коли частина
            елементів вибрана
          </div>
          <div class="feature">
            <strong>Гнучкі лейбли:</strong> Підтримка як prop <code>label</code>, так і слотів для складного контенту
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .checkbox-showcase {
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

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .checkbox-item {
    display: flex;
    flex-direction: column;
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

    .checkbox-code {
      position: relative;

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

  .form-example,
  .group-example {
    background: white;
    border: 1px solid #ecf0f1;
    border-radius: 8px;
    padding: 2rem;

    .form-group {
      margin-bottom: 1rem;
    }

    .group-header {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #ecf0f1;
    }

    .group-items {
      margin-left: 1.5rem;
      margin-bottom: 1rem;

      > * {
        margin-bottom: 0.5rem;
      }
    }

    .checkbox-code {
      margin-top: 1.5rem;
      position: relative;

      code {
        display: block;
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
        color: #495057;
        cursor: pointer;
        transition: background-color 0.2s;
        line-height: 1.4;
        white-space: pre-line;

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
    .checkbox-showcase {
      padding: 1rem;
    }

    .checkbox-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .checkbox-item {
      padding: 1rem;
    }

    .form-example,
    .group-example {
      padding: 1rem;

      .group-items {
        margin-left: 1rem;
      }
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
