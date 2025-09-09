<template>
  <div class="showcase">
    <!-- Підключення -->
    <section class="section">
      <h2>Підключення до проекту</h2>
      <div class="card">
        <h3>1. Використання в шаблоні</h3>
        <pre class="code">
          &lt;VInput
            v-model="inputValue"
            type="text"
            label="Назва поля"
            placeholder="Введіть текст..."
            size="medium"
            status="default"
            :required="true"
            :clearable="true"
            prefix-icon="user"
            helper-text="Допоміжний текст"
            @input="handleInput"
            @change="handleChange"
            @validation="handleValidation"
          /&gt;
        </pre>

        <h3>2. Обробка подій</h3>
        <pre class="code">
          const handleInput = (event: Event) => {
            console.log('Input event:', event);
          };

          const handleChange = (event: Event) => {
            console.log('Change event:', event);
          };

          const handleValidation = (result: VInputValidationResult) => {
            console.log('Validation:', result.isValid, result.errors);
          };
        </pre>

        <h3>3. Використання ref методів</h3>
        <pre class="code">
          const inputRef = ref&lt;VInputMethods&gt;();

          // Фокус на поле
          inputRef.value?.focus();

          // Валідація
          const isValid = inputRef.value?.validate();

          // Очистка
          inputRef.value?.clear();
        </pre>
      </div>
    </section>

    <!-- Демо -->
    <section class="section">
      <h2>Демонстрація</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <h4>Базові типи полів</h4>
          <VInput
            v-model="demoData.text"
            label="Текстове поле"
            placeholder="Введіть текст"
            @input="onDemoInput('text', $event)"
          />
          <VInput
            v-model="demoData.email"
            :required="true"
            label="Email"
            placeholder="example@email.com"
            type="email"
            @validation="onValidation('email', $event)"
          />
          <VInput
            v-model="demoData.password"
            :show-password="true"
            label="Пароль"
            placeholder="••••••••"
            type="password"
          />
        </div>

        <div class="demo-item">
          <h4>Стани</h4>
          <VInput
            v-model="demoData.success"
            helper-text="Дані введені правильно"
            label="Успіх"
            status="success"
            value="Валідні дані"
          />
          <VInput
            v-model="demoData.warning"
            helper-text="Перевірте введені дані"
            label="Попередження"
            status="warning"
            value="Потенційна проблема"
          />
          <VInput
            v-model="demoData.error"
            error-message="Це поле є обов'язковим"
            label="Помилка"
            status="error"
            value="Невалідні дані"
          />
        </div>

        <div class="demo-item">
          <h4>Textarea з автоматичним розміром</h4>
          <VInput
            v-model="demoData.textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            helper-text="Висота автоматично підлаштовується"
            label="Багаторядковий текст"
            placeholder="Введіть багаторядковий текст..."
            type="textarea"
          />
        </div>

        <div class="demo-item">
          <h4>Числові поля</h4>
          <VInput
            v-model="demoData.number"
            :max="100"
            :min="0"
            helper-text="Від 0 до 100"
            label="Число"
            placeholder="0"
            type="number"
          />
          <VInput v-model="demoData.price" :step="0.01" label="Ціна" placeholder="0.00" type="number" />
        </div>

        <div class="demo-item">
          <h4>Поля з іконками та функціями</h4>
          <VInput
            v-model="demoData.search"
            :clearable="true"
            label="Пошук"
            placeholder="Введіть запит..."
            prefix-icon="search"
            type="search"
            @clear="onClear"
          />
          <VInput v-model="demoData.url" label="Веб-сайт" placeholder="https://example.com" type="url" />
          <VInput v-model="demoData.disabled" :disabled="true" label="Відключене поле" value="Неактивне" />
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
              <td><code>string | number</code></td>
              <td>-</td>
              <td>Значення поля (v-model)</td>
            </tr>
            <tr>
              <td><code>type</code></td>
              <td><code>VInputType</code></td>
              <td>'text'</td>
              <td>Тип поля: text, email, password, number, url, tel, search, textarea</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>VInputSize</code></td>
              <td>'medium'</td>
              <td>Розмір поля: small, medium, large</td>
            </tr>
            <tr>
              <td><code>status</code></td>
              <td><code>VInputStatus</code></td>
              <td>'default'</td>
              <td>Стан поля: default, success, error, warning</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Відключає поле</td>
            </tr>
            <tr>
              <td><code>clearable</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Показує кнопку очистки</td>
            </tr>
            <tr>
              <td><code>showPassword</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Показує кнопку перегляду пароля</td>
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
              <td>-</td>
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
              <td><code>prefixIcon</code></td>
              <td><code>IconName</code></td>
              <td>-</td>
              <td>Іконка перед полем</td>
            </tr>
            <tr>
              <td><code>suffixIcon</code></td>
              <td><code>IconName</code></td>
              <td>-</td>
              <td>Іконка після поля</td>
            </tr>
            <tr>
              <td><code>required</code></td>
              <td><code>boolean</code></td>
              <td>false</td>
              <td>Обов'язкове поле</td>
            </tr>
            <tr>
              <td><code>minlength</code></td>
              <td><code>number</code></td>
              <td>-</td>
              <td>Мінімальна довжина</td>
            </tr>
            <tr>
              <td><code>maxlength</code></td>
              <td><code>number</code></td>
              <td>-</td>
              <td>Максимальна довжина</td>
            </tr>
            <tr>
              <td><code>min</code></td>
              <td><code>number</code></td>
              <td>-</td>
              <td>Мінімальне значення (для числових полів)</td>
            </tr>
            <tr>
              <td><code>max</code></td>
              <td><code>number</code></td>
              <td>-</td>
              <td>Максимальне значення (для числових полів)</td>
            </tr>
            <tr>
              <td><code>pattern</code></td>
              <td><code>string</code></td>
              <td>-</td>
              <td>Регулярний вираз для валідації</td>
            </tr>
            <tr>
              <td><code>customValidator</code></td>
              <td><code>(value: string | number) => boolean</code></td>
              <td>-</td>
              <td>Кастомна функція валідації</td>
            </tr>
            <tr>
              <td><code>validateOnInput</code></td>
              <td><code>boolean</code></td>
              <td>true</td>
              <td>Валідувати при введенні</td>
            </tr>
            <tr>
              <td><code>validateOnBlur</code></td>
              <td><code>boolean</code></td>
              <td>true</td>
              <td>Валідувати при втраті фокусу</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Textarea-специфічні властивості -->
    <section class="section">
      <h2>Textarea-специфічні властивості</h2>
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
              <td><code>rows</code></td>
              <td><code>number</code></td>
              <td>3</td>
              <td>Кількість рядків</td>
            </tr>
            <tr>
              <td><code>cols</code></td>
              <td><code>number</code></td>
              <td>-</td>
              <td>Кількість колонок</td>
            </tr>
            <tr>
              <td><code>resize</code></td>
              <td><code>VInputResize</code></td>
              <td>'vertical'</td>
              <td>Напрям зміни розміру: none, both, horizontal, vertical</td>
            </tr>
            <tr>
              <td><code>autosize</code></td>
              <td><code>boolean | VInputAutosizeConfig</code></td>
              <td>false</td>
              <td>Автоматичне підлаштування висоти або об'єкт конфігурації</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <h3>Конфігурація autosize</h3>
        <pre class="code">
interface VInputAutosizeConfig {
  minRows?: number;  // Мінімальна кількість рядків
  maxRows?: number;  // Максимальна кількість рядків
}

// Приклад використання:
&lt;VInput
  type="textarea"
  :autosize="{ minRows: 2, maxRows: 6 }"
/&gt;
        </pre>
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
              <td><code>string | number</code></td>
              <td>Емітується при зміні значення (v-model)</td>
            </tr>
            <tr>
              <td><code>input</code></td>
              <td><code>Event</code></td>
              <td>Нативна подія input</td>
            </tr>
            <tr>
              <td><code>change</code></td>
              <td><code>Event</code></td>
              <td>Нативна подія change</td>
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
              <td>Очистка поля</td>
            </tr>
            <tr>
              <td><code>validation</code></td>
              <td><code>VInputValidationResult</code></td>
              <td>Результат валідації</td>
            </tr>
            <tr>
              <td><code>keydown</code></td>
              <td><code>KeyboardEvent</code></td>
              <td>Натискання клавіші</td>
            </tr>
            <tr>
              <td><code>keyup</code></td>
              <td><code>KeyboardEvent</code></td>
              <td>Відпускання клавіші</td>
            </tr>
            <tr>
              <td><code>keypress</code></td>
              <td><code>KeyboardEvent</code></td>
              <td>Символьна клавіша</td>
            </tr>
            <tr>
              <td><code>click</code></td>
              <td><code>MouseEvent</code></td>
              <td>Клік по полю</td>
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
              <td>Встановлює фокус на поле</td>
            </tr>
            <tr>
              <td><code>blur()</code></td>
              <td><code>void</code></td>
              <td>Знімає фокус з поля</td>
            </tr>
            <tr>
              <td><code>select()</code></td>
              <td><code>void</code></td>
              <td>Виділяє весь текст в полі</td>
            </tr>
            <tr>
              <td><code>clear()</code></td>
              <td><code>void</code></td>
              <td>Очищає поле і скидає валідацію</td>
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
              <td><code>getInputElement()</code></td>
              <td><code>HTMLInputElement | HTMLTextAreaElement | null</code></td>
              <td>Повертає DOM елемент поля</td>
            </tr>
            <tr>
              <td><code>getValidationState()</code></td>
              <td><code>VInputValidationResult</code></td>
              <td>Повертає поточний стан валідації</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Валідація -->
    <section class="section">
      <h2>Система валідації</h2>

      <div class="card">
        <h3>Вбудовані валідатори</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Валідатор</th>
                <th>Застосування</th>
                <th>Опис</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>required</code></td>
                <td>Всі типи</td>
                <td>Перевіряє, що поле не пусте</td>
              </tr>
              <tr>
                <td><code>email</code></td>
                <td>type="email"</td>
                <td>Автоматично перевіряє формат email</td>
              </tr>
              <tr>
                <td><code>url</code></td>
                <td>type="url"</td>
                <td>Автоматично перевіряє формат URL</td>
              </tr>
              <tr>
                <td><code>number</code></td>
                <td>type="number"</td>
                <td>Автоматично перевіряє, що значення є числом</td>
              </tr>
              <tr>
                <td><code>minlength</code></td>
                <td>Текстові типи</td>
                <td>Мінімальна довжина тексту</td>
              </tr>
              <tr>
                <td><code>maxlength</code></td>
                <td>Текстові типи</td>
                <td>Максимальна довжина тексту</td>
              </tr>
              <tr>
                <td><code>min</code></td>
                <td>type="number"</td>
                <td>Мінімальне числове значення</td>
              </tr>
              <tr>
                <td><code>max</code></td>
                <td>type="number"</td>
                <td>Максимальне числове значення</td>
              </tr>
              <tr>
                <td><code>pattern</code></td>
                <td>Текстові типи</td>
                <td>Регулярний вираз для перевірки</td>
              </tr>
              <tr>
                <td><code>custom</code></td>
                <td>Всі типи</td>
                <td>Кастомна функція валідації</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3>Налаштування повідомлень</h3>
        <pre class="code">
// Кастомні повідомлення про помилки
&lt;VInput
  type="email"
  :required="true"
  :minlength="5"
  required-message="Email є обов'язковим"
  email-message="Введіть коректну email адресу"
  minlength-message="Email повинен містити мінімум 5 символів"
/&gt;
        </pre>
      </div>

      <div class="card">
        <h3>Кастомна валідація</h3>
        <pre class="code">
// Функція валідації
const validatePassword = (value: string | number): boolean => {
  const password = String(value);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|&lt;&gt;]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

// Використання
&lt;VInput
  type="password"
  :custom-validator="validatePassword"
  custom-validator-message="Пароль повинен містити великі та малі літери, цифри та спеціальні символи"
/&gt;
        </pre>
      </div>
    </section>

    <!-- Приклади використання -->
    <section class="section">
      <h2>Приклади використання</h2>

      <div class="card">
        <h3>Форма реєстрації</h3>
        <pre class="code">
&lt;template&gt;
  &lt;form @submit.prevent="handleSubmit"&gt;
    &lt;VInput
      ref="nameRef"
      v-model="form.name"
      label="Ім'я"
      :required="true"
      :minlength="2"
      :maxlength="50"
      placeholder="Введіть ваше ім'я"
      @validation="handleNameValidation"
    /&gt;

    &lt;VInput
      ref="emailRef"
      v-model="form.email"
      type="email"
      label="Email"
      :required="true"
      placeholder="example@email.com"
      prefix-icon="email"
      :clearable="true"
    /&gt;

    &lt;VInput
      ref="passwordRef"
      v-model="form.password"
      type="password"
      label="Пароль"
      :required="true"
      :minlength="8"
      :show-password="true"
      :custom-validator="validatePassword"
      custom-validator-message="Пароль повинен містити мінімум 8 символів, включаючи букви та цифри"
    /&gt;

    &lt;VInput
      v-model="form.age"
      type="number"
      label="Вік"
      :min="18"
      :max="100"
      placeholder="18"
    /&gt;

    &lt;VInput
      v-model="form.bio"
      type="textarea"
      label="Про себе"
      :maxlength="500"
      :autosize="{ minRows: 3, maxRows: 6 }"
      placeholder="Розкажіть про себе..."
      helper-text="Максимум 500 символів"
    /&gt;

    &lt;button type="submit" :disabled="!isFormValid"&gt;
      Зареєструватися
    &lt;/button&gt;
  &lt;/form&gt;
&lt;/template&gt;

&lt;script setup&gt;
const form = reactive({
  name: '',
  email: '',
  password: '',
  age: '',
  bio: ''
});

const isFormValid = ref(false);

// Валідація всієї форми
const validateForm = () => {
  const nameValid = nameRef.value?.validate() ?? false;
  const emailValid = emailRef.value?.validate() ?? false;
  const passwordValid = passwordRef.value?.validate() ?? false;

  isFormValid.value = nameValid && emailValid && passwordValid;
};

const handleSubmit = () => {
  validateForm();

  if (isFormValid.value) {
    // Відправка форми
    console.log('Form data:', form);
  }
};
&lt;/script&gt;
        </pre>
      </div>

      <div class="card">
        <h3>Пошукове поле з автодоповненням</h3>
        <pre class="code">
&lt;template&gt;
  &lt;VInput
    v-model="searchQuery"
    type="search"
    label="Пошук"
    placeholder="Введіть запит для пошуку..."
    prefix-icon="search"
    :clearable="true"
    :debounce="300"
    @input="handleSearch"
    @clear="handleClear"
  /&gt;
&lt;/template&gt;

&lt;script setup&gt;
const searchQuery = ref('');

const handleSearch = debounce((event: Event) => {
  const query = (event.target as HTMLInputElement).value;

  if (query.length >= 2) {
    // Виконання пошуку
    performSearch(query);
  }
}, 300);

const handleClear = () => {
  // Очистка результатів пошуку
  clearSearchResults();
};
&lt;/script&gt;
        </pre>
      </div>

      <div class="card">
        <h3>Числове поле з форматуванням</h3>
        <pre class="code">
&lt;template&gt;
  &lt;VInput
    v-model="price"
    type="number"
    label="Ціна"
    :min="0"
    :max="999999"
    :step="0.01"
    placeholder="0.00"
    suffix-icon="currency"
    helper-text="Введіть ціну в гривнях"
    @input="formatPrice"
  /&gt;
&lt;/template&gt;

&lt;script setup&gt;
const price = ref('');

const formatPrice = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  const numValue = parseFloat(value);

  if (!isNaN(numValue)) {
    // Форматування з двома десятковими знаками
    const formatted = numValue.toFixed(2);
    price.value = formatted;
  }
};
&lt;/script&gt;
        </pre>
      </div>
    </section>

    <!-- Автоматичні іконки -->
    <section class="section">
      <h2>Автоматичні іконки та стани</h2>

      <div class="card">
        <h3>Автоматичні prefix іконки за типом</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Тип поля</th>
                <th>Автоматична іконка</th>
                <th>Опис</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>email</code></td>
                <td>email</td>
                <td>Іконка конверта</td>
              </tr>
              <tr>
                <td><code>url</code></td>
                <td>url</td>
                <td>Іконка посилання</td>
              </tr>
              <tr>
                <td><code>password</code></td>
                <td>-</td>
                <td>Без автоматичної іконки</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3>Автоматичні іконки станів</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Стан</th>
                <th>Іконка</th>
                <th>Колір</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>success</code></td>
                <td>checkCircle</td>
                <td>Зелений</td>
              </tr>
              <tr>
                <td><code>error</code></td>
                <td>alertCircle</td>
                <td>Червоний</td>
              </tr>
              <tr>
                <td><code>warning</code></td>
                <td>alertTriangle</td>
                <td>Помаранчевий</td>
              </tr>
              <tr>
                <td>Валідаційна помилка</td>
                <td>alertCircle</td>
                <td>Червоний</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3>Suffix функціональні іконки</h3>
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Функція</th>
                <th>Іконка</th>
                <th>Умови відображення</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Очистка поля</td>
                <td>close</td>
                <td>clearable=true і поле не пусте</td>
              </tr>
              <tr>
                <td>Показати пароль</td>
                <td>eyeOpened</td>
                <td>type="password" і showPassword=true</td>
              </tr>
              <tr>
                <td>Сховати пароль</td>
                <td>eyeClosed</td>
                <td>type="password" і showPassword=true</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Інформаційна панель -->
    <section class="section">
      <h2>Стан демонстрації</h2>
      <div class="info-panel">
        <div class="info-item">
          <strong>Останній input:</strong>
          <span>{{ lastInputEvent || 'Немає подій' }}</span>
        </div>
        <div class="info-item">
          <strong>Валідація email:</strong>
          <span>{{ emailValidation || 'Не перевірено' }}</span>
        </div>
        <div class="info-item">
          <strong>Поточні значення:</strong>
          <span>{{ Object.keys(demoData).length }} полів заповнено</span>
        </div>
      </div>
    </section>

    <!-- Підсумок -->
    <section class="section">
      <h2>Підсумок можливостей</h2>
      <div class="info-panel">
        <div class="info-item">
          <strong>Типи полів:</strong>
          <span>8 різних типів (text, email, password, number, url, tel, search, textarea)</span>
        </div>
        <div class="info-item">
          <strong>Стани:</strong>
          <span>4 стани (default, success, error, warning)</span>
        </div>
        <div class="info-item">
          <strong>Валідація:</strong>
          <span>10 вбудованих валідаторів + кастомна валідація</span>
        </div>
        <div class="info-item">
          <strong>Події:</strong>
          <span>10 подій включно з валідацією</span>
        </div>
        <div class="info-item">
          <strong>Методи ref:</strong>
          <span>8 методів для програмного керування</span>
        </div>
        <div class="info-item">
          <strong>Автоматичні іконки:</strong>
          <span>Автоматичні іконки за типом поля та станом</span>
        </div>
        <div class="info-item">
          <strong>Доступність:</strong>
          <span>Повна підтримка accessibility стандартів</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import VInput from '@/components/input/VInput.vue';

  // Дані для демонстрації
  const demoData = reactive({
    text: '',
    email: '',
    password: '',
    small: '',
    medium: '',
    large: '',
    success: 'Валідні дані',
    warning: 'Потенційна проблема',
    error: 'Невалідні дані',
    textarea: '',
    number: '',
    price: '',
    search: '',
    url: '',
    disabled: 'Неактивне',
  });

  const lastInputEvent = ref<string | null>(null);
  const emailValidation = ref<string | null>(null);

  // Методи для демонстрації
  const onDemoInput = (field: string, event: Event) => {
    const target = event.target as HTMLInputElement;
    lastInputEvent.value = `${field}: "${target.value}"`;
    console.log(`Input in ${field}:`, target.value);
  };

  const onValidation = (field: string, result: { isValid: boolean; errors: string[] }) => {
    emailValidation.value = result.isValid ? 'Валідний' : result.errors[0];
    console.log(`Validation ${field}:`, result);
  };

  const onClear = () => {
    lastInputEvent.value = 'Поле очищено';
    console.log('Field cleared');
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
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .card h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .demo-item {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }

  .demo-item:hover {
    border-color: #3498db;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
  }

  .demo-item h4 {
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
