<script lang="ts" setup>
  import { reactive } from 'vue';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import DocCodeBlock from './helper/DocCodeBlock.vue';

  const demo = reactive({
    single: '',
    multiple: [] as string[],
    searchable: '',
    outlined: '',
    withIcons: null as any,
    success: 'active',
    warning: 'pending',
    error: '',
    clearable: 'option1',
    disabled: 'disabled',
    collapsed: ['opt1', 'opt2', 'opt3', 'opt4', 'opt5'],
  });

  const languages = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Python', value: 'py' },
    { label: 'Java', value: 'java' },
  ];
  const technologies = [
    { label: 'Vue.js', value: 'vue' },
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Nuxt', value: 'nuxt' },
  ];
  const countries = [
    { label: 'Україна', value: 'ua', icon: '🇺🇦' },
    { label: 'США', value: 'us', icon: '🇺🇸' },
    { label: 'Німеччина', value: 'de', icon: '🇩🇪' },
    { label: 'Франція', value: 'fr', icon: '🇫🇷' },
  ];
  const statusOptions = [
    { label: 'Активний', value: 'active' },
    { label: 'Неактивний', value: 'inactive' },
    { label: 'В очікуванні', value: 'pending' },
  ];
  const manyOptions = Array.from({ length: 15 }, (_, i) => ({
    label: `Опція ${i + 1}`,
    value: `opt${i + 1}`,
  }));

  const propsSections: TableSection[] = [
    {
      title: 'Props (VSelect)',
      rows: [
        {
          name: 'modelValue',
          type: 'string | number | Array<string | number>',
          default: '-',
          description: 'Значення (v-model)',
        },
        { name: 'multiple', type: 'boolean', default: 'false', description: 'Множинний вибір' },
        {
          name: 'collapsedTags',
          type: 'boolean',
          default: 'false',
          description: 'Згортати теги при множинному виборі',
        },
        { name: 'filterable', type: 'boolean', default: 'false', description: 'Пошук серед опцій' },
        { name: 'clearable', type: 'boolean', default: 'false', description: 'Кнопка очищення' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований стан' },
        { name: 'loading', type: 'boolean', default: 'false', description: 'Стан завантаження' },
        { name: 'infiniteScroll', type: 'boolean', default: 'false', description: 'Нескінченний скрол списку' },
        {
          name: 'status',
          type: "'default' | 'success' | 'error' | 'warning'",
          default: "'default'",
          description: 'Стан селекта',
        },
        { name: 'label', type: 'string', default: '-', description: 'Текст лейблу' },
        { name: 'outlined', type: 'boolean', default: 'false', description: 'Лейбл і помилки на бордері' },
        { name: 'placeholder', type: 'string', default: "'Оберіть опцію'", description: 'Плейсхолдер' },
        { name: 'helperText', type: 'string', default: '-', description: 'Допоміжний текст' },
        { name: 'errorMessage', type: 'string', default: '-', description: 'Кастомне повідомлення про помилку' },
        { name: 'noDataText', type: 'string', default: "'Немає даних'", description: 'Текст коли немає опцій' },
        {
          name: 'noMatchText',
          type: 'string',
          default: "'Співпадінь не знайдено'",
          description: 'Текст коли пошук без результатів',
        },
        {
          name: 'maxHeight',
          type: 'number | string',
          default: '200',
          description: 'Макс. висота випадаючого списку (px)',
        },
        {
          name: 'placement',
          type: "'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end'",
          default: "'bottom-start'",
          description: 'Позиція списку',
        },
        { name: 'required', type: 'boolean', default: 'false', description: "Обов'язкове поле" },
        {
          name: 'filterMethod',
          type: '(query: string, option: VSelectOption) => boolean',
          default: '-',
          description: 'Кастомна функція фільтрації',
        },
      ],
    },
    {
      title: 'Props (VOption)',
      rows: [
        { name: 'label', type: 'string', default: '-', description: 'Текст опції', required: true },
        { name: 'value', type: 'string | number', default: '-', description: 'Значення опції', required: true },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокована опція' },
        { name: 'icon', type: 'string', default: '-', description: 'Іконка або emoji' },
        { name: 'group', type: 'string', default: '-', description: 'Назва групи для групування' },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'update:modelValue', type: 'string | number | Array', description: 'Зміна значення (v-model)' },
        { name: 'change', type: 'string | number | Array', description: 'Вибір опції' },
        { name: 'clear', type: '-', description: 'Очищення селекта' },
        { name: 'filter', type: 'string', description: 'Введення тексту пошуку' },
        { name: 'visible-change', type: 'boolean', description: 'Зміна видимості списку' },
        { name: 'remove-tag', type: 'string | number', description: 'Видалення тегу (multiple)' },
        { name: 'scrolled', type: '-', description: 'Кінець списку (infinite scroll)' },
        { name: 'validation', type: '{ isValid: boolean, errors: string[] }', description: 'Результат валідації' },
        { name: 'focus', type: 'FocusEvent', description: 'Отримання фокусу' },
        { name: 'blur', type: 'FocusEvent', description: 'Втрата фокусу' },
      ],
    },
    {
      title: 'Методи (ref)',
      rows: [
        { name: 'focus()', type: 'void', description: 'Встановити фокус' },
        { name: 'blur()', type: 'void', description: 'Зняти фокус' },
        { name: 'clear()', type: 'void', description: 'Очистити селект' },
        { name: 'validate()', type: 'boolean', description: 'Запустити валідацію' },
        { name: 'clearValidation()', type: 'void', description: 'Очистити помилки валідації' },
        { name: 'getSelectedOptions()', type: 'VSelectOption[]', description: 'Повернути вибрані опції' },
        {
          name: 'getValidationState()',
          type: '{ isValid: boolean, errors: string[] }',
          description: 'Поточний стан валідації',
        },
      ],
    },
  ];
</script>

<template>
  <div class="select-showcase">
    <!-- ─── Базові типи ─── -->
    <DocSection title="Базові типи">
      <DocPreview title="Одинарний вибір">
        <VSelect v-model="demo.single" label="Мова програмування" placeholder="Оберіть мову...">
          <VOption v-for="item in languages" :key="item.value" :label="item.label" :value="item.value" />
        </VSelect>
      </DocPreview>

      <DocPreview title="Множинний вибір з collapsed tags">
        <VSelect v-model="demo.multiple" collapsed-tags label="Технології" multiple placeholder="Оберіть декілька...">
          <VOption v-for="item in technologies" :key="item.value" :label="item.label" :value="item.value" />
        </VSelect>
      </DocPreview>

      <DocPreview title="З пошуком (filterable)">
        <VSelect v-model="demo.searchable" filterable label="Країна" placeholder="Введіть назву...">
          <VOption v-for="item in countries" :key="item.value" :label="item.label" :value="item.value" />
        </VSelect>
      </DocPreview>
    </DocSection>

    <!-- ─── Outlined ─── -->
    <DocSection title="Outlined режим">
      <DocPreview>
        <VSelect v-model="demo.outlined" clearable filterable label="Країна" outlined placeholder="Оберіть..." required>
          <VOption v-for="item in countries" :key="item.value" :label="item.label" :value="item.value" />
        </VSelect>
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомний контент опцій ─── -->
    <DocSection description="Слот default у VOption + слот #selected у VSelect" title="Кастомний контент через слот">
      <DocPreview>
        <VSelect v-model="demo.withIcons" filterable label="Країна з прапором" placeholder="Оберіть країну...">
          <template #selected="{ option }">
            <span style="display: flex; align-items: center; gap: 8px">
              <span>{{ option?.value?.icon }}</span>
              <span>{{ option?.label }}</span>
            </span>
          </template>
          <VOption v-for="item in countries" :key="item.value" :label="item.label" :value="item">
            <span style="display: flex; align-items: center; gap: 8px">
              <span>{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </span>
          </VOption>
        </VSelect>
      </DocPreview>
    </DocSection>

    <!-- ─── Стани ─── -->
    <DocSection title="Стани">
      <DocPreview>
        <VSelect v-model="demo.success" helper-text="Дані вибрані правильно" label="Успіх" status="success">
          <VOption v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </VSelect>
        <VSelect v-model="demo.warning" helper-text="Перевірте вибір" label="Попередження" status="warning">
          <VOption v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </VSelect>
        <VSelect v-model="demo.error" error-message="Це поле є обов'язковим" label="Помилка" status="error">
          <VOption v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </VSelect>
      </DocPreview>
    </DocSection>

    <!-- ─── Clearable і disabled ─── -->
    <DocSection title="Clearable і disabled">
      <DocPreview>
        <VSelect v-model="demo.clearable" clearable label="З очисткою">
          <VOption label="Опція 1" value="option1" />
          <VOption label="Опція 2" value="option2" />
        </VSelect>
        <VSelect v-model="demo.disabled" disabled label="Заблокований">
          <VOption label="Недоступна опція" value="disabled" />
        </VSelect>
      </DocPreview>
    </DocSection>

    <!-- ─── Collapsed tags з великим списком ─── -->
    <DocSection title="Multiple з collapsed tags і великим списком">
      <DocPreview>
        <VSelect
          v-model="demo.collapsed"
          collapsed-tags
          infinite-scroll
          label="Багато опцій"
          multiple
          placeholder="Виберіть..."
        >
          <VOption v-for="item in manyOptions" :key="item.value" :label="item.label" :value="item.value" />
        </VSelect>
      </DocPreview>
    </DocSection>

    <!-- ─── Infinite scroll патерн ─── -->
    <DocSection title="Патерн: infinite scroll з завантаженням">
      <DocCodeBlock
        :code="`<VSelect
  v-model=&quot;selectedUsers&quot;
  label=&quot;Користувачі&quot;
  :multiple=&quot;true&quot;
  :filterable=&quot;true&quot;
  :loading=&quot;loading&quot;
  :infinite-scroll=&quot;true&quot;
  placeholder=&quot;Оберіть користувачів...&quot;
  @filter=&quot;handleSearch&quot;
  @scrolled=&quot;loadMoreUsers&quot;
>
  <VOption
    v-for=&quot;user in users&quot;
    :key=&quot;user.id&quot;
    :label=&quot;user.name&quot;
    :value=&quot;user.id&quot;
  >
    <div style=&quot;display:flex;align-items:center;gap:8px&quot;>
      <img :src=&quot;user.avatar&quot; style=&quot;width:24px;border-radius:50%&quot; />
      <div>
        <div>{{ user.name }}</div>
        <div style=&quot;font-size:.8em;color:#888&quot;>{{ user.email }}</div>
      </div>
    </div>
  </VOption>
</VSelect>`"
        language="html"
      />
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🎨" title="Слот #selected у VSelect">
        Дозволяє кастомізувати відображення <em>вибраного</em> значення в полі. Отримує <code>{ option }</code> — об'єкт
        з <code>label</code> і <code>value</code>.
      </DocFeature>
      <DocFeature icon="🧩" title="Default слот у VOption">
        Будь-який HTML всередині <code>&lt;VOption&gt;</code> відображається як контент рядка списку — іконки, аватари,
        двострочний текст і т.д.
      </DocFeature>
      <DocFeature icon="🏷️" title="collapsedTags">
        При <code>multiple</code> і великій кількості вибраних — показує перший тег і лічильник <code>+N</code> замість
        нескінченного рядка тегів.
      </DocFeature>
      <DocFeature icon="♾️" title="infiniteScroll + @scrolled">
        При досягненні кінця списку емітується <code>@scrolled</code> — підвантажуй наступну сторінку і додавай нові
        <code>VOption</code> в DOM.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .select-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
