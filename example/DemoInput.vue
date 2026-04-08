<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import VInput from '@/components/input/VInput.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import DocCodeBlock from './helper/DocCodeBlock.vue';

  const demo = reactive({
    text: '',
    email: '',
    password: '',
    outlined: '',
    success: 'Валідні дані',
    warning: 'Потенційна проблема',
    error: 'Невалідні дані',
    textarea: '',
    number: '',
    price: '',
    search: '',
  });

  const inputRef = ref();

  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        { name: 'modelValue', type: 'string | number', default: '-', description: 'Значення (v-model)' },
        {
          name: 'type',
          type: "'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'search' | 'textarea'",
          default: "'text'",
          description: 'Тип поля',
        },
        { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Розмір' },
        {
          name: 'status',
          type: "'default' | 'success' | 'error' | 'warning'",
          default: "'default'",
          description: 'Стан поля',
        },
        { name: 'label', type: 'string', default: '-', description: 'Текст лейблу' },
        { name: 'placeholder', type: 'string', default: '-', description: 'Плейсхолдер' },
        { name: 'outlined', type: 'boolean', default: 'false', description: 'Лейбл і помилки на бордері' },
        { name: 'helperText', type: 'string', default: '-', description: 'Допоміжний текст під полем' },
        { name: 'errorMessage', type: 'string', default: '-', description: 'Кастомне повідомлення про помилку' },
        { name: 'prefixIcon', type: 'IconName', default: '-', description: 'Іконка перед полем' },
        { name: 'suffixIcon', type: 'IconName', default: '-', description: 'Іконка після поля' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований стан' },
        { name: 'clearable', type: 'boolean', default: 'false', description: 'Кнопка очищення' },
        { name: 'showPassword', type: 'boolean', default: 'false', description: 'Перемикач видимості пароля' },
        { name: 'required', type: 'boolean', default: 'false', description: "Обов'язкове поле" },
        { name: 'minlength', type: 'number', default: '-', description: 'Мінімальна довжина' },
        { name: 'maxlength', type: 'number', default: '-', description: 'Максимальна довжина' },
        { name: 'min', type: 'number', default: '-', description: 'Мін. значення (number)' },
        { name: 'max', type: 'number', default: '-', description: 'Макс. значення (number)' },
        { name: 'pattern', type: 'string', default: '-', description: 'Regex для валідації' },
        {
          name: 'customValidator',
          type: '(value: string | number) => boolean',
          default: '-',
          description: 'Кастомна функція валідації',
        },
        { name: 'validateOnInput', type: 'boolean', default: 'true', description: 'Валідувати при кожному введенні' },
        { name: 'validateOnBlur', type: 'boolean', default: 'true', description: 'Валідувати при втраті фокусу' },
      ],
    },
    {
      title: 'Props (тільки textarea)',
      rows: [
        { name: 'rows', type: 'number', default: '3', description: 'Кількість рядків' },
        {
          name: 'resize',
          type: "'none' | 'both' | 'horizontal' | 'vertical'",
          default: "'vertical'",
          description: 'Напрям зміни розміру',
        },
        {
          name: 'autosize',
          type: 'boolean | { minRows?: number, maxRows?: number }',
          default: 'false',
          description: 'Авторозмір висоти',
        },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'update:modelValue', type: 'string | number', description: 'Зміна значення (v-model)' },
        { name: 'input', type: 'Event', description: 'Нативна подія input' },
        { name: 'change', type: 'Event', description: 'Нативна подія change' },
        { name: 'focus', type: 'FocusEvent', description: 'Отримання фокусу' },
        { name: 'blur', type: 'FocusEvent', description: 'Втрата фокусу' },
        { name: 'clear', type: '-', description: 'Очищення поля' },
        { name: 'validation', type: 'VInputValidationResult', description: 'Результат валідації' },
        { name: 'keydown', type: 'KeyboardEvent', description: 'Натискання клавіші' },
        { name: 'click', type: 'MouseEvent', description: 'Клік по полю' },
      ],
    },
    {
      title: 'Методи (ref)',
      rows: [
        { name: 'focus()', type: 'void', description: 'Встановити фокус' },
        { name: 'blur()', type: 'void', description: 'Зняти фокус' },
        { name: 'select()', type: 'void', description: 'Виділити весь текст' },
        { name: 'clear()', type: 'void', description: 'Очистити поле і скинути валідацію' },
        { name: 'validate()', type: 'boolean', description: 'Запустити валідацію, повернути результат' },
        { name: 'clearValidation()', type: 'void', description: 'Очистити помилки валідації' },
        {
          name: 'getInputElement()',
          type: 'HTMLInputElement | HTMLTextAreaElement | null',
          description: 'Повернути DOM-елемент',
        },
        { name: 'getValidationState()', type: 'VInputValidationResult', description: 'Поточний стан валідації' },
      ],
    },
  ];
</script>

<template>
  <div class="input-showcase">
    <!-- ─── Типи полів ─── -->
    <DocSection title="Типи полів">
      <DocPreview>
        <VInput v-model="demo.text" label="text" placeholder="Звичайний текст" />
        <VInput v-model="demo.email" :required="true" label="email" placeholder="example@mail.com" type="email" />
        <VInput v-model="demo.password" :show-password="true" label="password" placeholder="••••••••" type="password" />
        <VInput
          v-model="demo.search"
          :clearable="true"
          label="search"
          placeholder="Пошук..."
          prefix-icon="search"
          type="search"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Outlined ─── -->
    <DocSection description="Лейбл і помилки відображаються безпосередньо на бордері інпута" title="Outlined режим">
      <DocPreview>
        <VInput
          v-model="demo.outlined"
          label="Email"
          outlined
          placeholder="example@mail.com"
          prefix-icon="url"
          required
          type="email"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Стани ─── -->
    <DocSection title="Стани">
      <DocPreview title="Звичайні">
        <VInput v-model="demo.success" helper-text="Дані введені правильно" label="Успіх" status="success" />
        <VInput v-model="demo.warning" helper-text="Перевірте введені дані" label="Попередження" status="warning" />
        <VInput v-model="demo.error" error-message="Це поле є обов'язковим" label="Помилка" status="error" />
      </DocPreview>

      <DocPreview title="Outlined">
        <VInput v-model="demo.success" helper-text="Дані введені правильно" label="Успіх" outlined status="success" />
        <VInput
          v-model="demo.warning"
          helper-text="Перевірте введені дані"
          label="Попередження"
          outlined
          status="warning"
        />
        <VInput
          v-model="demo.error"
          error-message="Це поле є обов'язковим"
          label="Помилка"
          outlined
          required
          status="error"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Числові ─── -->
    <DocSection title="Числові поля">
      <DocPreview>
        <VInput
          v-model="demo.number"
          :max="100"
          :min="0"
          helper-text="Від 0 до 100"
          label="Вік"
          placeholder="0"
          type="number"
        />
        <VInput v-model="demo.price" :step="0.01" label="Ціна" placeholder="0.00" type="number" />
      </DocPreview>
    </DocSection>

    <!-- ─── Textarea ─── -->
    <DocSection title="Textarea">
      <DocPreview>
        <VInput
          v-model="demo.textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
          helper-text="Висота підлаштовується автоматично"
          label="Коментар"
          placeholder="Введіть текст..."
          type="textarea"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Disabled та clearable ─── -->
    <DocSection title="Стани disabled і clearable">
      <DocPreview>
        <VInput :disabled="true" label="Disabled" value="Неактивне поле" />
        <VInput v-model="demo.search" :clearable="true" label="Clearable" placeholder="Можна очистити" />
      </DocPreview>
    </DocSection>

    <!-- ─── Програмне управління ─── -->
    <DocSection title="Програмне управління через ref">
      <DocPreview
        :script="`
const inputRef = ref()

inputRef.value?.focus()
inputRef.value?.validate()
inputRef.value?.clear()
inputRef.value?.clearValidation()
        `"
      >
        <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%">
          <VInput ref="inputRef" v-model="demo.text" :required="true" label="Поле для управління через ref" />
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap">
            <button class="ref-btn" @click="inputRef?.focus()">focus()</button>
            <button class="ref-btn" @click="inputRef?.select()">select()</button>
            <button class="ref-btn" @click="inputRef?.validate()">validate()</button>
            <button class="ref-btn" @click="inputRef?.clear()">clear()</button>
            <button class="ref-btn" @click="inputRef?.clearValidation()">clearValidation()</button>
          </div>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Валідація ─── -->
    <DocSection title="Вбудована валідація">
      <DocPreview
        :script="`
// Вбудовані валідатори — автоматично за props
<VInput type=&quot;email&quot; :required=&quot;true&quot; :minlength=&quot;5&quot; />

// Кастомний validator
const validatePassword = (value) => {
  return /[A-Z]/.test(value) && /\\d/.test(value) && value.length >= 8
}
        `"
      >
        <VInput
          v-model="demo.email"
          :minlength="5"
          :required="true"
          label="Email з валідацією"
          placeholder="example@mail.com"
          type="email"
        />
        <VInput
          v-model="demo.password"
          :minlength="8"
          :required="true"
          :show-password="true"
          custom-validator-message="Потрібні великі літери, цифри та спецсимволи"
          label="Пароль (мін. 8 символів)"
          type="password"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Приклад форми ─── -->
    <DocSection title="Патерн: форма реєстрації">
      <DocCodeBlock
        :code="`<VInput ref=&quot;nameRef&quot; v-model=&quot;form.name&quot;
  label=&quot;Ім'я&quot; :required=&quot;true&quot; :minlength=&quot;2&quot; :maxlength=&quot;50&quot; />

<VInput ref=&quot;emailRef&quot; v-model=&quot;form.email&quot;
  type=&quot;email&quot; label=&quot;Email&quot; :required=&quot;true&quot;
  prefix-icon=&quot;email&quot; :clearable=&quot;true&quot; />

<VInput ref=&quot;passwordRef&quot; v-model=&quot;form.password&quot;
  type=&quot;password&quot; label=&quot;Пароль&quot;
  :required=&quot;true&quot; :minlength=&quot;8&quot; :show-password=&quot;true&quot;
  :custom-validator=&quot;validatePassword&quot; />

<VInput v-model=&quot;form.bio&quot; type=&quot;textarea&quot;
  label=&quot;Про себе&quot; :maxlength=&quot;500&quot;
  :autosize=&quot;{ minRows: 3, maxRows: 6 }&quot;
  helper-text=&quot;Максимум 500 символів&quot; />`"
        language="html"
      />
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🎨" title="Автоматичні іконки">
        <code>type="email"</code> і <code>type="url"</code> автоматично додають prefix-іконку. Стани
        <code>success</code> / <code>error</code> / <code>warning</code> додають suffix-іконку зі статусом.
      </DocFeature>
      <DocFeature icon="🏷️" title="outlined режим">
        <code>outlined</code> переводить лейбл у floating-стиль і відображає помилки прямо на бордері — ідеально для
        щільних форм.
      </DocFeature>
      <DocFeature icon="✅" title="Валідація через ref">
        Виклик <code>inputRef.value?.validate()</code> повертає <code>boolean</code> — зручно для валідації всієї форми
        перед сабмітом.
      </DocFeature>
      <DocFeature icon="📐" title="autosize для textarea">
        <code>:autosize="{ minRows: 3, maxRows: 6 }"</code> — висота підлаштовується автоматично в межах заданого
        діапазону рядків.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .input-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .ref-btn {
    padding: 0.3rem 0.75rem;
    background: #f0f7ff;
    border: 1px solid #bdd4f5;
    border-radius: 6px;
    color: #1a6fa8;
    font-size: 0.78rem;
    font-family: 'JetBrains Mono', monospace;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
      background: #dbeafe;
      border-color: #3498db;
    }
  }
</style>
