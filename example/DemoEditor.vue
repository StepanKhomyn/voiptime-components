<script lang="ts" setup>
  import { ref } from 'vue';
  import VButton from '@/components/button/VButton.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import DocCodeBlock from './helper/DocCodeBlock.vue';
  import VEditor from '@/components/editor/VEditor.vue';

  // ─── Demo state ───────────────────────────────────────────────────────────────

  const basicValue = ref('');
  const requiredValue = ref('');
  const errorValue = ref('<p>Неправильний вміст</p>');
  const disabledValue = ref('<p>Цей редактор вимкнено. Редагування недоступне.</p>');
  const customToolbarValue = ref('');
  const fullValue = ref('');

  const editorRef = ref<InstanceType<typeof VEditor> | null>(null);
  const validationResult = ref('');

  function handleValidation(result: { isValid: boolean; errors: string[] }) {
    validationResult.value = result.isValid ? '✅ Валідно' : `❌ ${result.errors.join(', ')}`;
  }

  function runValidate() {
    const ok = editorRef.value?.validate();
    validationResult.value = ok ? '✅ Валідно' : '❌ Є помилки';
  }

  function runClear() {
    editorRef.value?.clear();
    validationResult.value = '';
  }

  // ─── Props table ─────────────────────────────────────────────────────────────

  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'modelValue',
          type: 'string',
          default: "''",
          description: 'HTML-вміст редактора (v-model)',
          required: true,
        },
        {
          name: 'placeholder',
          type: 'string',
          default: "''",
          description: 'Текст-підказка коли редактор порожній',
        },
        {
          name: 'toolbar',
          type: 'VEditorToolbarGroup[]',
          default: 'всі групи',
          description: 'Перелік груп кнопок панелі інструментів',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Вимкнений стан — редагування та панель недоступні',
        },
        {
          name: 'required',
          type: 'boolean',
          default: 'false',
          description: 'Обовʼязкове поле — валідація при blur та input',
        },
        {
          name: 'errorMessage',
          type: 'string',
          default: "''",
          description: 'Зовнішнє повідомлення про помилку (перекриває внутрішню валідацію)',
        },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'update:modelValue', type: 'string', description: 'Зміна HTML-вмісту (v-model)' },
        { name: 'input', type: 'string', description: 'Кожна зміна вмісту' },
        { name: 'change', type: 'string', description: 'Зміна після blur' },
        { name: 'focus', type: 'FocusEvent', description: 'Редактор отримав фокус' },
        { name: 'blur', type: 'FocusEvent', description: 'Редактор втратив фокус' },
        {
          name: 'validation',
          type: 'VEditorValidationResult',
          description: 'Результат валідації після кожної перевірки',
        },
      ],
    },
    {
      title: 'Exposed методи',
      rows: [
        { name: 'focus()', type: '-', description: 'Фокус на редактор' },
        { name: 'blur()', type: '-', description: 'Зняти фокус' },
        { name: 'clear()', type: '-', description: 'Очистити вміст і скинути валідацію' },
        { name: 'getHTML()', type: 'string', description: 'Отримати HTML-вміст' },
        { name: 'getText()', type: 'string', description: 'Отримати текст без тегів' },
        { name: 'setHTML(html)', type: 'string → void', description: 'Програмно встановити вміст' },
        { name: 'insertHTML(html)', type: 'string → void', description: 'Вставити HTML у позицію курсора' },
        { name: 'validate()', type: 'boolean', description: 'Запустити валідацію вручну, повертає isValid' },
        { name: 'clearValidation()', type: '-', description: 'Скинути стан валідації без очищення вмісту' },
        {
          name: 'getValidationState()',
          type: 'VEditorValidationResult',
          description: 'Отримати поточний стан валідації',
        },
        { name: 'getEditorElement()', type: 'HTMLElement | null', description: 'Отримати DOM-елемент редактора' },
      ],
    },
    {
      title: 'VEditorToolbarGroup',
      rows: [
        { name: 'history', type: '-', description: 'Скасувати / Повторити' },
        { name: 'format', type: '-', description: 'Жирний, курсив, підкреслення, закреслення' },
        { name: 'script', type: '-', description: 'Підрядковий, надрядковий' },
        { name: 'heading', type: '-', description: 'Параграф та заголовки H1–H4' },
        { name: 'align', type: '-', description: 'Вирівнювання тексту' },
        { name: 'list', type: '-', description: 'Нумерований та маркований списки' },
        { name: 'indent', type: '-', description: 'Відступ / зворотний відступ' },
        { name: 'link', type: '-', description: 'Вставити посилання' },
        { name: 'image', type: '-', description: 'Вставити зображення за URL' },
        { name: 'blockquote', type: '-', description: 'Цитата' },
        { name: 'code', type: '-', description: 'Інлайновий код' },
        { name: 'clear', type: '-', description: 'Очистити форматування' },
        { name: 'html', type: '-', description: 'Перемкнути HTML-режим' },
      ],
    },
  ];
</script>

<template>
  <div class="editor-showcase">
    <!-- ─── Базовий ─── -->
    <DocSection title="Базовий редактор">
      <DocPreview
        :code="`<VEditor
  v-model=&quot;value&quot;
  placeholder=&quot;Введіть текст...&quot;
/>`"
      >
        <div style="height: 200px; display: flex; flex-direction: column">
          <VEditor v-model="basicValue" placeholder="Введіть текст..." />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Required + валідація ─── -->
    <DocSection
      description="Валідація спрацьовує при blur і input. Через ref можна запустити вручну."
      title="Required + валідація"
    >
      <DocPreview
        :code="`<VEditor
  ref=&quot;editorRef&quot;
  v-model=&quot;value&quot;
  required
  placeholder=&quot;Це поле обов'язкове&quot;
  @validation=&quot;handleValidation&quot;
/>
<VButton @click=&quot;editorRef.validate()&quot;>Валідувати</VButton>`"
      >
        <div style="display: flex; flex-direction: column; gap: 12px">
          <div style="height: 100px; display: flex; flex-direction: column">
            <VEditor
              ref="editorRef"
              v-model="requiredValue"
              placeholder="Це поле обов'язкове — залиште порожнім і перейдіть далі"
              required
              @validation="handleValidation"
            />
          </div>
          <div style="display: flex; align-items: center; gap: 12px">
            <VButton type="primary" @click="runValidate">Валідувати</VButton>
            <VButton @click="runClear">Очистити</VButton>
            <span v-if="validationResult" style="font-size: 13px">{{ validationResult }}</span>
          </div>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── errorMessage ─── -->
    <DocSection
      description="errorMessage перекриває внутрішню валідацію — зручно для серверних помилок."
      title="Зовнішня помилка (errorMessage)"
    >
      <DocPreview
        :code="`<VEditor
  v-model=&quot;value&quot;
  error-message=&quot;Сервер повернув помилку: поле не може містити HTML-теги&quot;
/>`"
      >
        <VEditor v-model="errorValue" error-message="Сервер повернув помилку: поле не може містити HTML-теги" />
      </DocPreview>
    </DocSection>

    <!-- ─── Disabled ─── -->
    <DocSection title="Вимкнений стан (disabled)">
      <DocPreview :code="`<VEditor v-model=&quot;value&quot; disabled />`">
        <VEditor v-model="disabledValue" disabled />
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомна панель ─── -->
    <DocSection
      description="Передайте масив toolbar щоб показати лише потрібні групи кнопок."
      title="Кастомна панель інструментів"
    >
      <DocPreview
        :code="`<VEditor
  v-model=&quot;value&quot;
  :toolbar=&quot;['format', 'link', 'clear']&quot;
/>`"
      >
        <VEditor
          v-model="customToolbarValue"
          :toolbar="['format', 'link', 'clear']"
          placeholder="Тільки формат, посилання та очищення"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Програмне API ─── -->
    <DocSection
      description="Через template ref доступні методи: validate, clear, getHTML, setHTML, insertHTML та інші."
      title="API"
    >
      <DocCodeBlock
        :code="`<script setup>
import { ref } from 'vue'
import VEditor from '@/components/editor/VEditor.vue'

const editorRef = ref(null)

// Запустити валідацію вручну
const ok = editorRef.value.validate()

// Отримати вміст
const html = editorRef.value.getHTML()
const text = editorRef.value.getText()

// Встановити вміст програмно
editorRef.value.setHTML('<p>Новий вміст</p>')

// Вставити в позицію курсора
editorRef.value.insertHTML('<strong>вставка</strong>')

// Очистити
editorRef.value.clear()
<\/script>

<template>
  <VEditor ref=&quot;editorRef&quot; v-model=&quot;value&quot; required />
</template>`"
        language="ts"
      />
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="📐" title="Flex-розтягування">
        Редактор займає <code>100%</code> ширини та висоти батька. Батько повинен мати
        <code>display: flex; flex-direction: column</code> і визначену висоту. Шапка — фіксована, тіло — скролиться.
      </DocFeature>
      <DocFeature icon="✅" title="Валідація">
        <code>required</code> вмикає автоматичну перевірку при <code>blur</code> та <code>input</code>. Через
        <code>ref</code> можна викликати <code>validate()</code> вручну — зручно перед сабмітом форми.
      </DocFeature>
      <DocFeature icon="⚠️" title="errorMessage vs required">
        <code>errorMessage</code> — для серверних або зовнішніх помилок; перекриває внутрішню валідацію.
        <code>required</code> — для клієнтської перевірки. Використовуйте одночасно або окремо.
      </DocFeature>
      <DocFeature icon="🌐" title="Локалізація тултіпів і діалогів">
        Усі підказки кнопок (через <code>v-tooltip</code>) і тексти діалогових вікон беруться з
        <code>LOCALE_KEYS.EDITOR_*</code>. Додайте нові ключі в <code>locales/translations.ts</code> для всіх трьох мов.
      </DocFeature>
      <DocFeature icon="🔗" title="Посилання та зображення">
        Діалоги вставки відкриваються через <code>VModal</code>. Виділений текст стає текстом посилання автоматично. Для
        зображень вставляється тег <code>&lt;img&gt;</code> з <code>max-width: 100%</code>.
      </DocFeature>
      <DocFeature icon="💻" title="HTML-режим">
        Кнопка <code>html</code> у тулбарі перемикає вид на textarea з сирим HTML. Зміни синхронізуються назад у
        <code>v-model</code> при перемиканні.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .editor-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
