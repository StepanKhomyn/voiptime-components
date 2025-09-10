<template>
  <div class="showcase">
    <!-- Підключення -->
    <section class="section">
      <h2>Підключення до проекту</h2>
      <div class="card">
        <h3>1. Використання в шаблоні</h3>
        <pre class="code">
          &lt;VSelect
            v-model="selectedValue"
            label="Оберіть категорію"
            placeholder="Виберіть опцію..."
            status="default"
            :required="true"
            :clearable="true"
            :filterable="true"
            :multiple="false"
            :collapsedTags="true"
            :loading="false"
            :disabled="false"
            @change="handleChange"
          &gt;
            &lt;VOption label="JavaScript" value="js" /&gt;
            &lt;VOption label="TypeScript" value="ts" /&gt;
            &lt;VOption label="Vue.js" value="vue" /&gt;
            &lt;VOption label="React" value="react" :disabled="true" /&gt;
          &lt;/VSelect&gt;
        </pre>

        <h3>2. Мульти-селект з тегами</h3>
        <pre class="code">
          &lt;VSelect
            v-model="multipleValues"
            label="Оберіть технології"
            :multiple="true"
            :collapsedTags="true"
            :clearable="true"
            placeholder="Виберіть декілька опцій..."
            @change="handleMultipleChange"
            @remove-tag="handleRemoveTag"
          &gt;
            &lt;VOption label="Frontend" value="frontend" /&gt;
            &lt;VOption label="Backend" value="backend" /&gt;
            &lt;VOption label="DevOps" value="devops" /&gt;
            &lt;VOption label="Mobile" value="mobile" /&gt;
          &lt;/VSelect&gt;
        </pre>

        <h3>3. Селект з пошуком</h3>
        <pre class="code">
          &lt;VSelect
            v-model="searchableValue"
            label="Пошук країни"
            :filterable="true"
            :filter-method="customFilter"
            placeholder="Введіть назву країни..."
            no-match-text="Країну не знайдено"
            @filter="handleFilter"
          &gt;
            &lt;VOption
              v-for="country in countries"
              :key="country.code"
              :label="country.name"
              :value="country.code"
            /&gt;
          &lt;/VSelect&gt;
        </pre>
      </div>
    </section>

    <!-- Демо -->
    <section class="section">
      <h2>Демонстрація</h2>
      <div class="demo-grid">
        <div class="demo-item-select">
          <h4>Базові селекти</h4>
          <VSelect
            v-model="demoData.single"
            label="Одинарний вибір"
            placeholder="Оберіть мову..."
            @change="onDemoChange('single', $event)"
          >
            <VOption v-for="item in languages" :key="item.value" :label="item.label" :value="item.value" />
          </VSelect>

          <VSelect
            v-model="demoData.multiple"
            collapsed-tags
            label="Множинний вибір"
            multiple
            placeholder="Оберіть технології..."
            @change="onDemoChange('multiple', $event)"
          >
            <VOption v-for="item in technologies" :key="item.value" :label="item.label" :value="item.value" />
          </VSelect>

          <VSelect
            v-model="demoData.searchable"
            filterable
            label="З пошуком"
            placeholder="Знайдіть країну..."
            @filter="onFilter"
          >
            <VOption v-for="item in countries" :key="item.value" :label="item.label" :value="item.value" />
          </VSelect>
        </div>

        <div class="demo-item-select">
          <h4>Стани селекта</h4>
          <VSelect
            v-model="demoData.success"
            helper-text="Дані вибрані правильно"
            label="Успішний стан"
            status="success"
          >
            <VOption v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </VSelect>

          <VSelect v-model="demoData.warning" helper-text="Перевірте вибір" label="Попередження" status="warning">
            <VOption v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </VSelect>

          <VSelect v-model="demoData.error" error-message="Це поле є обов'язковим" label="Помилка" status="error">
            <VOption v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </VSelect>
        </div>

        <div class="demo-item-select">
          <h4>Спеціальні функції</h4>
          <VSelect v-model="demoData.clearable" clearable label="З очисткою" @clear="onClear">
            <VOption v-for="item in clearableOptions" :key="item.value" :label="item.label" :value="item.value" />
          </VSelect>

          <VSelect v-model="demoData.disabled" disabled label="Відключений">
            <VOption v-for="item in disabledOptions" :key="item.value" :label="item.label" :value="item.value" />
          </VSelect>
        </div>

        <div class="demo-item-select">
          <h4>Collapsed Tags (Згорнуті теги)</h4>
          <VSelect
            v-model="demoData.collapsedTags"
            collapsed-tags
            infinite-scroll
            label="Багато опцій"
            multiple
            placeholder="Виберіть багато опцій..."
          >
            <VOption v-for="item in manyOptions" :key="item.value" :label="item.label" :value="item.value" />
          </VSelect>
        </div>
      </div>
    </section>

    <!-- Властивості -->
    <section class="section">
      <h2>Властивості (Props)</h2>
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
              <td><code>modelValue</code></td>
              <td><code>string | number | Array&lt;string | number&gt;</code></td>
              <td>-</td>
              <td>Значення селекта (v-model)</td>
            </tr>
            <tr>
              <td><code>multiple</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Множинний вибір</td>
            </tr>
            <tr>
              <td><code>collapsedTags</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Згортати теги якщо їх багато</td>
            </tr>
            <tr>
              <td><code>status</code></td>
              <td><code>VSelectStatus</code></td>
              <td>'default'</td>
              <td>Стан селекта: default, success, error, warning</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Відключає селект</td>
            </tr>
            <tr>
              <td><code>clearable</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Показує кнопку очистки</td>
            </tr>
            <tr>
              <td><code>filterable</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Дозволяє пошук серед опцій</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Показує індикатор завантаження</td>
            </tr>
            <tr>
              <td><code>infiniteScroll</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Нескінченний скрол для великих списків</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>Текст лейбла</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td><code>string</code></td>
              <td>'Оберіть опцію'</td>
              <td>Текст підказки</td>
            </tr>
            <tr>
              <td><code>helperText</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>Допоміжний текст</td>
            </tr>
            <tr>
              <td><code>errorMessage</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>Кастомне повідомлення про помилку</td>
            </tr>
            <tr>
              <td><code>noDataText</code></td>
              <td><code>string</code></td>
              <td>'Немає даних'</td>
              <td>Текст коли немає опцій</td>
            </tr>
            <tr>
              <td><code>noMatchText</code></td>
              <td><code>string</code></td>
              <td>'Співпадінь не знайдено'</td>
              <td>Текст коли немає результатів пошуку</td>
            </tr>
            <tr>
              <td><code>loadingText</code></td>
              <td><code>string</code></td>
              <td>'Завантаження...'</td>
              <td>Текст під час завантаження</td>
            </tr>
            <tr>
              <td><code>maxHeight</code></td>
              <td><code>number | string</code></td>
              <td>200</td>
              <td>Максимальна висота випадайки</td>
            </tr>
            <tr>
              <td><code>placement</code></td>
              <td><code>string</code></td>
              <td>'bottom-start'</td>
              <td>Позиція випадайки: bottom, bottom-start, bottom-end, top, top-start, top-end</td>
            </tr>
            <tr>
              <td><code>required</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Обов'язкове поле</td>
            </tr>
            <tr>
              <td><code>validateOnInput</code></td>
              <td><code>boolean</code></td>
              <td>true</td>
              <td>Валідувати при зміні значення</td>
            </tr>
            <tr>
              <td><code>validateOnBlur</code></td>
              <td><code>boolean</code></td>
              <td>true</td>
              <td>Валідувати при втраті фокусу</td>
            </tr>
            <tr>
              <td><code>filterMethod</code></td>
              <td><code>(query: string, option: VSelectOption) => boolean</code></td>
              <td>-</td>
              <td>Кастомна функція фільтрації</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- VOption властивості -->
    <section class="section">
      <h2>VOption властивості</h2>
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
              <td><code>label</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>Текст опції що відображається</td>
            </tr>
            <tr>
              <td><code>value</code></td>
              <td><code>string | number</code></td>
              <td>-</td>
              <td>Значення опції</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Відключає опцію</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>Іконка для опції</td>
            </tr>
            <tr>
              <td><code>group</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>Група опції (для групування)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Події -->
    <section class="section">
      <h2>Події (Emits)</h2>
      <div class="table-wrapper">
        <table class="table">
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
              <td><code>string | number | Array&lt;string | number&gt;</code></td>
              <td>Емітується при зміні значення (v-model)</td>
            </tr>
            <tr>
              <td><code>change</code></td>
              <td><code>string | number | Array&lt;string | number&gt;</code></td>
              <td>Зміна вибраного значення</td>
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
            <tr>
              <td><code>clear</code></td>
              <td>-</td>
              <td>Очистка селекта</td>
            </tr>
            <tr>
              <td><code>visible-change</code></td>
              <td><code>boolean</code></td>
              <td>Зміна видимості випадайки</td>
            </tr>
            <tr>
              <td><code>remove-tag</code></td>
              <td><code>string | number</code></td>
              <td>Видалення тегу (для множинного вибору)</td>
            </tr>
            <tr>
              <td><code>filter</code></td>
              <td><code>string</code></td>
              <td>Введення тексту в пошук</td>
            </tr>
            <tr>
              <td><code>validation</code></td>
              <td><code>{ isValid: boolean; errors: string[] }</code></td>
              <td>Результат валідації</td>
            </tr>
            <tr>
              <td><code>scrolled</code></td>
              <td>-</td>
              <td>Досягнуто кінця списку (infinite scroll)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Методи -->
    <section class="section">
      <h2>Методи компонента (ref)</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Метод</th>
              <th>Повертає</th>
              <th>Опис</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>focus()</code></td>
              <td><code>void</code></td>
              <td>Встановлює фокус на селект</td>
            </tr>
            <tr>
              <td><code>blur()</code></td>
              <td><code>void</code></td>
              <td>Знімає фокус з селекта</td>
            </tr>
            <tr>
              <td><code>clear()</code></td>
              <td><code>void</code></td>
              <td>Очищає селект</td>
            </tr>
            <tr>
              <td><code>validate()</code></td>
              <td><code>boolean</code></td>
              <td>Запускає валідацію і повертає результат</td>
            </tr>
            <tr>
              <td><code>clearValidation()</code></td>
              <td><code>void</code></td>
              <td>Очищає помилки валідації</td>
            </tr>
            <tr>
              <td><code>getSelectedOptions()</code></td>
              <td><code>VSelectOption[]</code></td>
              <td>Повертає вибрані опції</td>
            </tr>
            <tr>
              <td><code>getValidationState()</code></td>
              <td><code>{ isValid: boolean; errors: string[] }</code></td>
              <td>Повертає поточний стан валідації</td>
            </tr>
            <tr>
              <td><code>registerOption()</code></td>
              <td><code>void</code></td>
              <td>Реєструє нову опцію</td>
            </tr>
            <tr>
              <td><code>unregisterOption()</code></td>
              <td><code>void</code></td>
              <td>Видаляє опцію з реєстру</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Приклади використання -->
    <section class="section">
      <h2>Приклади використання</h2>

      <div class="card">
        <h3>Селект з динамічним завантаженням</h3>
        <pre class="code">
&lt;template&gt;
  &lt;VSelect
    v-model="selectedUsers"
    label="Користувачі"
    :multiple="true"
    :filterable="true"
    :loading="loading"
    :infinite-scroll="true"
    placeholder="Оберіть користувачів..."
    @filter="handleSearch"
    @scrolled="loadMoreUsers"
  &gt;
    &lt;VOption
      v-for="user in users"
      :key="user.id"
      :label="`${user.name} (${user.email})`"
      :value="user.id"
    &gt;
      &lt;div class="flex items-center"&gt;
        &lt;img :src="user.avatar" class="w-6 h-6 rounded-full mr-2" /&gt;
        &lt;div&gt;
          &lt;div class="font-medium"&gt;{{ 'user.name' }}&lt;/div&gt;
          &lt;div class="text-sm text-gray-500"&gt;{{ 'user.email' }}&lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/VOption&gt;
  &lt;/VSelect&gt;
&lt;/template&gt;

&lt;script setup&gt;
const selectedUsers = ref([]);
const users = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const searchQuery = ref('');

const loadUsers = async (page = 1, search = '') => {
  loading.value = true;

  try {
    const response = await fetch(`/api/users?page=${page}&search=${search}`);
    const data = await response.json();

    if (page === 1) {
      users.value = data.users;
    } else {
      users.value.push(...data.users);
    }

    currentPage.value = page;
  } catch (error) {
    console.error('Error loading users:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
  loadUsers(1, query);
};

const loadMoreUsers = () => {
  if (!loading.value) {
    loadUsers(currentPage.value + 1, searchQuery.value);
  }
};

// Початкове завантаження
onMounted(() => {
  loadUsers();
});
&lt;/script&gt;
        </pre>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';

  // Дані для демонстрації
  const demoData = reactive({
    single: '',
    multiple: [],
    searchable: '',
    success: 'success-value',
    warning: 'warning-value',
    error: '',
    small: '',
    medium: '',
    large: '',
    clearable: 'clearable-value',
    disabled: 'disabled-value',
    loading: '',
    collapsedTags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    infinite: '',
  });

  const lastFilter = ref<string | null>(null);
  const isLoading = ref(false);
  const infiniteLoading = ref(false);

  // Опції для демо
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
    { label: 'Svelte3', value: 'svelte23' },
    { label: 'Svelte33', value: 'svelte233' },
    { label: 'Svelte3вці3', value: 'svelte2313' },
  ];

  const countries = [
    { label: 'Україна', value: 'ua' },
    { label: 'США', value: 'us' },
    { label: 'Німеччина', value: 'de' },
    { label: 'Франція', value: 'fr' },
  ];

  const statusOptions = [
    { label: 'Активний', value: 'active' },
    { label: 'Неактивний', value: 'inactive' },
    { label: 'В очікуванні', value: 'pending' },
  ];

  const sizeOptions = [
    { label: 'Маленький', value: 'small' },
    { label: 'Середній', value: 'medium' },
    { label: 'Великий', value: 'large' },
  ];

  const clearableOptions = [
    { label: 'Опція 1', value: 'option1' },
    { label: 'Опція 2', value: 'option2' },
  ];

  const disabledOptions = [{ label: 'Недоступна опція', value: 'disabled' }];

  const loadingOptions = [{ label: 'Завантажуємо...', value: 'loading' }];

  const manyOptions = [
    { label: 'Опція 1', value: 'opt1' },
    { label: 'Опція 2', value: 'opt2' },
    { label: 'Опція 3', value: 'opt3' },
    { label: 'Опція 4', value: 'opt4' },
    { label: 'Опція 5', value: 'opt5' },
    { label: 'Опція 6', value: 'opt6' },
  ];

  const infiniteOptions = ref([
    { label: 'Елемент 1', value: 'item1' },
    { label: 'Елемент 2', value: 'item2' },
    { label: 'Елемент 3', value: 'item3' },
  ]);

  // Методи для демонстрації
  const onDemoChange = (field: string, value: any) => {
    console.log(`Changed ${field}:`, value);
  };

  const onFilter = (query: string) => {
    lastFilter.value = query;
    console.log('Filter query:', query);
  };

  const onClear = () => {
    console.log('Select cleared');
  };

  const loadMoreOptions = () => {
    infiniteLoading.value = true;

    setTimeout(() => {
      const currentLength = infiniteOptions.value.length;
      for (let i = 1; i <= 10; i++) {
        infiniteOptions.value.push({
          label: `Елемент ${currentLength + i}`,
          value: `item${currentLength + i}`,
        });
      }
      infiniteLoading.value = false;
    }, 1000);
  };

  // Симуляція завантаження
  const simulateLoading = () => {
    isLoading.value = true;
    setTimeout(() => {
      isLoading.value = false;
    }, 2000);
  };

  simulateLoading();

  const mapping = ref('');
  const mapping2 = ref('A');

  const fieldsForFirst = computed(() =>
    Object.values(TelemarketClientImportFields).filter(field => field !== mapping2.value)
  );

  const fieldsForSecond = computed(() => []);

  const enum TelemarketClientImportFields {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    H = 'H',
    I = 'I',
    J = 'J',
    K = 'K',
    L = 'L',
    M = 'M',
    N = 'N',
    O = 'O',
    P = 'P',
    Q = 'Q',
    R = 'R',
    S = 'S',
    T = 'T',
    U = 'U',
    V = 'V',
    W = 'W',
    X = 'X',
    Y = 'Y',
    Z = 'Z',

    AA = 'AA',
    AB = 'AB',
    AC = 'AC',
    AD = 'AD',
    AE = 'AE',
    AF = 'AF',
    AG = 'AG',
    AH = 'AH',
    AI = 'AI',
    AJ = 'AJ',
    AK = 'AK',
    AL = 'AL',
    AM = 'AM',
    AN = 'AN',
    AO = 'AO',
    AP = 'AP',
    AQ = 'AQ',
    AR = 'AR',
    AS = 'AS',
    AT = 'AT',
    AU = 'AU',
    AV = 'AV',
    AW = 'AW',
    AX = 'AX',
    AY = 'AY',
    AZ = 'AZ',

    BA = 'BA',
    BB = 'BB',
    BC = 'BC',
    BD = 'BD',
    BE = 'BE',
    BF = 'BF',
    BG = 'BG',
    BH = 'BH',
    BI = 'BI',
    BJ = 'BJ',
    BK = 'BK',
    BL = 'BL',
    BM = 'BM',
    BN = 'BN',
    BO = 'BO',
    BP = 'BP',
    BQ = 'BQ',
    BR = 'BR',
    BS = 'BS',
    BT = 'BT',
    BU = 'BU',
    BV = 'BV',
    BW = 'BW',
    BX = 'BX',
    BY = 'BY',
    BZ = 'BZ',
  }
</script>

<style scoped>
  .showcase {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
    background: #f8f9fa;
    min-height: 100vh;
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
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .card h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .card h4 {
    color: #34495e;
    margin-bottom: 0.8rem;
    font-size: 1rem;
    font-weight: 600;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .demo-item-select {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }

  .demo-item-select:hover {
    border-color: #3498db;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
  }

  .demo-item-select h4 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: 600;
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

  .info-panel {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e9ecef;
  }

  .info-item:last-child {
    border-bottom: none;
  }

  .info-item strong {
    color: #495057;
  }

  .info-item span {
    color: #6c757d;
    font-family: monospace;
  }

  /* Демо селект стилі */
  .demo-select-wrapper {
    margin-bottom: 1rem;
  }

  .demo-select__label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
    font-size: 0.9rem;
  }

  .demo-select {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;
    padding: 0.5rem 0.75rem;
    background: white;
    border: 2px solid #e1e8ed;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .demo-select:hover {
    border-color: #3498db;
  }

  .demo-select--small {
    min-height: 32px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  .demo-select--medium {
    min-height: 40px;
  }

  .demo-select--large {
    min-height: 48px;
    padding: 0.75rem 1rem;
    font-size: 1.1rem;
  }

  .demo-select--success {
    border-color: #27ae60;
  }

  .demo-select--error {
    border-color: #e74c3c;
  }

  .demo-select--warning {
    border-color: #f39c12;
  }

  .demo-select--disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .demo-select--multiple {
    min-height: 45px;
  }

  .demo-select__content {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .demo-select__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
  }

  .demo-select__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.375rem;
    background: #3498db;
    color: white;
    border-radius: 3px;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .demo-select__tag--collapsed {
    background: #95a5a6;
  }

  .demo-select__tag-close {
    cursor: pointer;
    opacity: 0.7;
    font-weight: bold;
  }

  .demo-select__tag-close:hover {
    opacity: 1;
  }

  .demo-select__value {
    color: #2c3e50;
  }

  .demo-select__placeholder {
    color: #6c757d;
  }

  .demo-select__suffix {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: 0.5rem;
  }

  .demo-select__loading {
    animation: spin 1s linear infinite;
    color: #3498db;
  }

  .demo-select__clear {
    cursor: pointer;
    color: #6c757d;
    font-weight: bold;
  }

  .demo-select__clear:hover {
    color: #e74c3c;
  }

  .demo-select__arrow {
    color: #6c757d;
    font-size: 0.7rem;
    transition: transform 0.2s;
  }

  .demo-select__helper {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: #6c757d;
  }

  .demo-select__error {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: #e74c3c;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .showcase {
      padding: 1rem;
    }

    .demo-grid {
      grid-template-columns: 1fr;
    }

    .info-item {
      flex-direction: column;
      gap: 0.3rem;
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
