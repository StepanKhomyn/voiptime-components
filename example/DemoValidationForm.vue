<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import {
    useValidate,
    required,
    minLength,
    maxLength,
    email,
    sameAs,
    numeric,
    withMessage,
    withName,
  } from '../src/validation';
  import VInput from '@/components/input/VInput.vue';
  import VSelect from '../src/components/select/VSelect.vue';
  import VOption from '../src/components/select/VOption.vue';
  import VDatePicker from '../src/components/datepicker/VDatePicker.vue';
  import VTimePicker from '../src/components/timepicker/VTimePicker.vue';

  // кастомні валідатори
  const startsWithABC = withMessage(
    "Має починатися з 'ABC'",
    withName('startsWithABC', v => v?.startsWith('ABC') || false)
  );

  // state
  const form = reactive({
    nameRequired: '',
    passwordMin: '',
    passwordMax: '',
    email: '',
    password: '',
    confirm: '',
    age: '',
    nameCustom: '',
    nameAsync: '',
    selectRequired: '',
    basicDate: Date,
    selectedTime: '14:30:00'
  });

  // rules
  const rules = {
    nameRequired: [required],
    passwordMin: [minLength(6)],
    passwordMax: [maxLength(10)],
    email: [email],
    password: [minLength(6)],
    confirm: [minLength(6), sameAs(() => form.password, 'Паролі не співпадають')],
    age: [numeric],
    nameCustom: [startsWithABC],
    selectRequired: [required],
    basicDate: [required],
    selectedTime: [required],
  };

  // validation tree
  const v$ = useValidate(rules, form);

  // toggle code
  const codeCollapsed = ref({
    required: true,
    minLength: true,
    maxLength: true,
    email: true,
    sameAs: true,
    numeric: true,
    custom: true,
    async: true,
  });

  const toggleCode = (key: string) => {
    codeCollapsed.value[key] = !codeCollapsed.value[key];
  };

  const technologies = [
    { label: 'Vue.js', value: 'vue' },
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Svelte3', value: 'svelte23' },
    { label: 'Svelte33', value: 'svelte233' },
    { label: 'Svelte3вці3', value: 'svelte2313' },
  ];

  // приклади коду для кожної секції
  const examplesValidators = {
    required: `
const rules = {
  nameRequired: [required]
};`,

    minLength: `
const rules = {
  passwordMin: [minLength(6)]
};`,

    maxLength: `
const rules = {
  passwordMax: [maxLength(10)]
};`,

    email: `
const rules = {
  email: [email]
};`,

    sameAs: `
const rules = {
  password: [minLength(6)],
  confirm: [minLength(6), sameAs(() => form.password, 'Паролі не співпадають')]
};`,

    numeric: `
const rules = {
  age: [numeric]
};`,

    custom: `
const startsWithABC = withMessage(
  "Має починатися з 'ABC'",
  withName('startsWithABC', v => v?.startsWith('ABC') || false)
);

const rules = {
  nameCustom: [startsWithABC]
};`,

    async: `
const uniqueName = withMessage(
  'Це імʼя вже зайняте',
  withAsync(async val => {
    if (!val) return true;
    const res = await fetch(\`/api/check-name?name=\${val}\`).then(r => r.json());
    return res.ok;
  })
);

const rules = {
  nameAsync: [uniqueName]
};`,
    select: `
          <VSelect
            v-model="form.selectRequired"
            collapsed-tags
            multiple
            placeholder="Оберіть технології..."
            :error-message="v$.selectRequired.$errors[0]?.$message"
          >
            <VOption v-for="item in technologies" :key="item.value" :label="item.label" :value="item.value" />
          </VSelect>`,

    datePicker: `
          <VDatePicker
            v-model="form.basicDate"
            placeholder="Select date"
            type="date"
            previous-date-disabled
            :error-message="v$.basicDate.$errors[0]?.$message"
          />`,
    timePicker:
      `<VTimePicker v-model="form.selectedTime" :error-message="v$.selectedTime.$errors[0]?.$message" placeholder="Оберіть час" />`,
  };
</script>

<template>
  <div class="container">
    <!-- validators -->
    <div class="container-item">
      <div class="container-item-example">
        <h3 :class="{ collapsed: codeCollapsed.required }" @click="toggleCode('required')"> Валідатори </h3>
        <div :class="{ collapsed: codeCollapsed.required }" class="container-item-code">
          <pre class="code"><h4>{{ 'required' }}</h4><code>{{ examplesValidators.required }}</code></pre>
          <pre class="code"><h4>{{ 'minLength' }}</h4><code>{{ examplesValidators.minLength }}</code></pre>
          <pre class="code"><h4>{{ 'maxLength' }}</h4><code>{{ examplesValidators.maxLength }}</code></pre>
          <pre class="code"><h4>{{ 'email' }}</h4><code>{{ examplesValidators.email }}</code></pre>
          <pre class="code"><h4>{{ 'sameAs' }}</h4><code>{{ examplesValidators.sameAs }}</code></pre>
          <pre class="code"><h4>{{ 'numeric' }}</h4><code>{{ examplesValidators.numeric }}</code></pre>
          <pre class="code"><h4>{{ 'custom' }}</h4><code>{{ examplesValidators.custom }}</code></pre>
          <pre class="code"><h4>{{ 'async' }}</h4><code>{{ examplesValidators.async }}</code></pre>
          <pre class="code"><h4>{{ 'required select' }}</h4><code>{{ examplesValidators.select }}</code></pre>
          <pre class="code"><h4>{{ 'required datePicker' }}</h4><code>{{ examplesValidators.datePicker }}</code></pre>
          <pre class="code"><h4>{{ 'required timePicker' }}</h4><code>{{ examplesValidators.timePicker }}</code></pre>
        </div>
      </div>
      <div class="container-item-table">
        <h3>Базові типи полів</h3>
        <div>
          <h4>{{ 'required' }}</h4>
          <VInput v-model="form.nameRequired" placeholder="Обов'язкове поле"
                  :error-message="v$.nameRequired.$errors[0]?.$message" />
        </div>
        <div>
          <h4>{{ 'minLength' }}</h4>
          <VInput v-model="form.passwordMin" type="password" placeholder="Пароль (>=6)"
                  :error-message="v$.passwordMin.$errors[0]?.$message" />
        </div>
        <div>
          <h4>{{ 'maxLength' }}</h4>
          <VInput v-model="form.passwordMax" type="text" placeholder="Не більше 10 символів"
                  :error-message="v$.passwordMax.$errors[0]?.$message" />
        </div>
        <div>
          <h4>{{ 'email' }}</h4>
          <VInput v-model="form.email" type="email" placeholder="Email"
                  :error-message="v$.email.$errors[0]?.$message" />
        </div>
        <div>
          <h4>{{ 'sameAs' }}</h4>
          <VInput v-model="form.password" :show-password="true" style="margin-bottom: 10px" type="password" placeholder="Пароль"
                  :error-message="v$.password.$errors[0]?.$message" />
          <VInput v-model="form.confirm" :show-password="true" type="password" placeholder="Підтвердження паролю"
                  :error-message="v$.confirm.$errors[0]?.$message" />
        </div>
        <div>
          <h4>{{ 'numeric' }}</h4>
          <VInput v-model="form.age" type="text" placeholder="Вік"
                  :error-message="v$.age.$errors[0]?.$message" />
        </div>
        <div>
          <h4>{{ 'custom' }}</h4>
          <VInput v-model="form.nameCustom" type="text" placeholder="Починається з ABC"
                  :error-message="v$.nameCustom.$errors[0]?.$message" />
        </div>
        <div>
          <h4>{{ 'async' }}</h4>
          <VInput :disabled="true" type="text" placeholder="Унікальне ім'я" />
        </div>
        <div>
          <h4>{{ 'Select' }}</h4>
          <VSelect
            v-model="form.selectRequired"
            collapsed-tags
            multiple
            placeholder="Оберіть технології..."
            :error-message="v$.selectRequired.$errors[0]?.$message"
          >
            <VOption v-for="item in technologies" :key="item.value" :label="item.label" :value="item.value" />
          </VSelect>
        </div>
        <div>
          <h4>{{ 'DatePicker' }}</h4>
          <VDatePicker
            v-model="form.basicDate"
            placeholder="Select date"
            type="date"
            previous-date-disabled
            :error-message="v$.basicDate.$errors[0]?.$message"
          />
        </div>
        <div>
          <h4>{{ 'TimePicker' }}</h4>
          <VTimePicker v-model="form.selectedTime" :error-message="v$.selectedTime.$errors[0]?.$message" placeholder="Оберіть час" />
        </div>
      </div>
    </div>
    <!-- Валідатори та хелпери опис -->
    <section class="section">
      <h2>Доступні валідатори та хелпери</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
          <tr>
            <th>Назва</th>
            <th>Призначення</th>
            <th>Приклад використання</th>
          </tr>
          </thead>
          <tbody>
          <!-- Стандартні валідатори -->
          <tr>
            <td><code>required</code></td>
            <td>Обовʼязкове поле</td>
            <td><code>nameRequired: [required]</code></td>
          </tr>
          <tr>
            <td><code>minLength(n)</code></td>
            <td>Мінімальна довжина рядка</td>
            <td><code>passwordMin: [minLength(6)]</code></td>
          </tr>
          <tr>
            <td><code>maxLength(n)</code></td>
            <td>Максимальна довжина рядка</td>
            <td><code>passwordMax: [maxLength(10)]</code></td>
          </tr>
          <tr>
            <td><code>email</code></td>
            <td>Перевірка email</td>
            <td><code>email: [email]</code></td>
          </tr>
          <tr>
            <td><code>sameAs(() =&gt; field, msg)</code></td>
            <td>Збіг значень (наприклад, пароль і підтвердження)</td>
            <td><code>confirm: [sameAs(() =&gt; form.password, 'Паролі не співпадають')]</code></td>
          </tr>
          <tr>
            <td><code>numeric</code></td>
            <td>Перевірка числового значення</td>
            <td><code>age: [numeric]</code></td>
          </tr>

          <!-- Кастомні валідатори через хелпери -->
          <tr>
            <td><code>withMessage(msg, validator)</code></td>
            <td>Додає кастомне повідомлення помилки до валідатора</td>
            <td><code>nameCustom: [withMessage("Має починатися з 'ABC'", startsWithABC)]</code></td>
          </tr>
          <tr>
            <td><code>withName(name, validator)</code></td>
            <td>Задає імʼя валідатору для дебагу</td>
            <td><code>startsWithABC: withName('startsWithABC', v =&gt; v.startsWith('ABC'))</code></td>
          </tr>
          <tr>
            <td><code>withAsync(fn)</code></td>
            <td>Позначає валідатор як асинхронний (наприклад, запит на сервер)</td>
            <td><code>nameAsync: [withAsync(uniqueCheck)]</code></td>
          </tr>
          <tr>
            <td><code>withParams(params, validator)</code></td>
            <td>Прикріплює додаткові параметри до валідатора ($params)</td>
            <td><code>minLength6: [withParams({min: 6}, minLength(6))]</code></td>
          </tr>
          <tr>
            <td><code>mk({name?, message?, params?, async?}, validator)</code></td>
            <td>Універсальний хелпер, можна одночасно задати імʼя, параметри, повідомлення і async</td>
            <td>
              <code>
                myValidator: [mk({name:'abc', message:'Тільки ABC', async:true}, startsWithABC)]
              </code>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>
    <!-- Робота з формою опис -->

    <section class="section">
      <h2>Методи для роботи з формою</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
          <tr>
            <th>Метод</th>
            <th>Призначення</th>
            <th>Приклад використання</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><code>$validate()</code></td>
            <td>Запускає валідацію для всіх полів форми або групи. Повертає <code>Promise&lt;boolean&gt;</code> — true, якщо всі поля валідні.</td>
            <td>
            <pre><code>
const ok = await v$.$validate();
if (!ok) {
  alert('Форма містить помилки');
}
            </code></pre>
            </td>
          </tr>
          <tr>
            <td><code>$touch()</code></td>
            <td>Позначає всі поля форми як "торкнуті" (<code>$touched = true</code>) та "брудні" (<code>$dirty = true</code>), щоб почали відображатися повідомлення про помилки.</td>
            <td>
            <pre><code>
v$.$touch();
            </code></pre>
            </td>
          </tr>
          <tr>
            <td><code>$reset()</code></td>
            <td>Скидає всі поля форми: <code>$dirty = false</code>, <code>$touched = false</code>, <code>$errors = []</code>, <code>$pending = false</code>.</td>
            <td>
            <pre><code>
v$.$reset();
            </code></pre>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

  </div>
</template>
