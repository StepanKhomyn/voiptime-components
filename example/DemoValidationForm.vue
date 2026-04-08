<script lang="ts" setup>
  import { reactive } from 'vue';
  import {
    email,
    maxLength,
    minLength,
    numeric,
    required,
    sameAs,
    useValidate,
    withMessage,
    withName,
  } from '@/validation';
  import VInput from '@/components/input/VInput.vue';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';
  import VDatePicker from '@/components/datepicker/VDatePicker.vue';
  import VTimePicker from '@/components/timepicker/VTimePicker.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import DocCodeBlock from './helper/DocCodeBlock.vue';

  // ── Кастомний валідатор ──────────────────────────────────────────────────────
  const startsWithABC = withMessage(
    "Має починатися з 'ABC'",
    withName('startsWithABC', (v: any) => v?.startsWith('ABC') || false)
  );

  // ── Стан форми ───────────────────────────────────────────────────────────────
  const form = reactive({
    nameRequired: '',
    passwordMin: '',
    passwordMax: '',
    email: '',
    password: '',
    confirm: '',
    age: '',
    nameCustom: '',
    selectField: [] as string[],
    dateField: null as Date | null,
    timeField: '14:30:00',
  });

  // ── Правила валідації ────────────────────────────────────────────────────────
  const v$ = useValidate(
    {
      nameRequired: [required],
      passwordMin: [minLength(6)],
      passwordMax: [maxLength(10)],
      email: [email],
      password: [minLength(6)],
      confirm: [minLength(6), sameAs(() => form.password, 'Паролі не співпадають')],
      age: [numeric],
      nameCustom: [startsWithABC],
      selectField: [required],
      dateField: [required],
      timeField: [required],
    },
    form
  );

  const technologies = [
    { label: 'Vue.js', value: 'vue' },
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Nuxt', value: 'nuxt' },
  ];

  // ── Документація ─────────────────────────────────────────────────────────────
  const validatorsSections: TableSection[] = [
    {
      title: 'Вбудовані валідатори',
      rows: [
        {
          name: 'required',
          type: 'ValidatorFn',
          description: "Обов'язкове поле (не пусте, не null, масив не порожній)",
        },
        { name: 'minLength(n)', type: '(n: number) => ValidatorFn', description: 'Мінімальна довжина рядка' },
        { name: 'maxLength(n)', type: '(n: number) => ValidatorFn', description: 'Максимальна довжина рядка' },
        { name: 'email', type: 'ValidatorFn', description: 'Перевірка формату email' },
        { name: 'url', type: 'ValidatorFn', description: 'Перевірка формату URL' },
        { name: 'numeric', type: 'ValidatorFn', description: 'Значення є числом' },
        { name: 'minNumber(n)', type: '(n: number) => ValidatorFn', description: 'Числове значення ≥ n' },
        { name: 'maxNumber(n)', type: '(n: number) => ValidatorFn', description: 'Числове значення ≤ n' },
        {
          name: 'sameAs(fn, msg?)',
          type: '(fn: () => any, msg?: string) => ValidatorFn',
          description: 'Значення дорівнює результату fn() — для підтвердження паролю',
        },
        { name: 'phoneNumber', type: 'ValidatorFn', description: 'Перевірка формату телефону (+380...)' },
        { name: 'containUpperCaseLetter', type: 'ValidatorFn', description: 'Є хоча б одна велика літера' },
        { name: 'noSpaces', type: 'ValidatorFn', description: 'Немає пробілів' },
        {
          name: 'pattern(regex, msg?)',
          type: '(regex: RegExp, msg?: string) => ValidatorFn',
          description: 'Кастомний regex',
        },
        {
          name: 'uniqueAsync(fn, msg?)',
          type: '(fn: (v) => Promise<boolean>) => ValidatorFn',
          description: 'Асинхронна перевірка унікальності',
        },
      ],
    },
    {
      title: 'Хелпери',
      rows: [
        {
          name: 'withMessage(msg, fn)',
          type: '(msg: string | fn, validator) => WrappedValidator',
          description: 'Додати кастомне повідомлення помилки',
        },
        {
          name: 'withName(name, fn)',
          type: '(name: string, validator) => WrappedValidator',
          description: "Задати ім'я валідатора для дебагу ($validatorName)",
        },
        {
          name: 'withAsync(fn)',
          type: '(validator) => WrappedValidator',
          description: 'Позначити валідатор як асинхронний ($async = true)',
        },
        {
          name: 'withParams(params, fn)',
          type: '(params: object, validator) => WrappedValidator',
          description: 'Прикріпити додаткові параметри ($params)',
        },
        {
          name: 'mk(opts, fn)',
          type: '(opts: { name?, message?, params?, async? }, validator) => WrappedValidator',
          description: 'Універсальний хелпер — замінює всі попередні разом',
        },
      ],
    },
    {
      title: 'Методи v$ (useValidate)',
      rows: [
        {
          name: '$validate()',
          type: '() => Promise<boolean>',
          description: 'Запустити валідацію всіх полів. Повертає true якщо форма валідна',
        },
        {
          name: '$touch()',
          type: '() => void',
          description: 'Позначити всі поля як торкнуті — помилки починають відображатись',
        },
        {
          name: '$reset()',
          type: '() => void',
          description: 'Скинути стан всіх полів ($dirty, $touched, $errors, $pending)',
        },
      ],
    },
    {
      title: 'FieldValidation (v$.field)',
      rows: [
        { name: '$model', type: 'any', description: 'Реактивне значення поля (get/set)' },
        { name: '$dirty', type: 'boolean', description: 'Поле було змінено' },
        { name: '$touched', type: 'boolean', description: 'Поле отримало фокус' },
        { name: '$invalid', type: 'boolean', description: 'Є помилки валідації' },
        { name: '$error', type: 'boolean', description: '$dirty && $invalid' },
        { name: '$errors', type: 'Array<{ $message, $validator, $params? }>', description: 'Масив помилок' },
        { name: '$pending', type: 'boolean', description: 'Асинхронна валідація в процесі' },
        { name: '$validate()', type: 'Promise<boolean>', description: 'Валідувати конкретне поле' },
        { name: '$touch()', type: 'void', description: 'Позначити поле як торкнуте' },
        { name: '$reset()', type: 'void', description: 'Скинути стан поля' },
      ],
    },
  ];
</script>

<template>
  <div class="validation-showcase">
    <!-- ─── Базові валідатори ─── -->
    <DocSection
      description="Помилка з'являється при введенні — завдяки автоматичному watch на поле"
      title="Базові валідатори"
    >
      <DocPreview title="required">
        <VInput
          v-model="form.nameRequired"
          :error-message="v$.nameRequired.$errors[0]?.$message"
          placeholder="Обов'язкове поле"
        />
      </DocPreview>

      <DocPreview title="minLength(6)">
        <VInput
          v-model="form.passwordMin"
          :error-message="v$.passwordMin.$errors[0]?.$message"
          placeholder="Мінімум 6 символів"
          type="password"
        />
      </DocPreview>

      <DocPreview title="maxLength(10)">
        <VInput
          v-model="form.passwordMax"
          :error-message="v$.passwordMax.$errors[0]?.$message"
          placeholder="Не більше 10 символів"
        />
      </DocPreview>

      <DocPreview title="email">
        <VInput
          v-model="form.email"
          :error-message="v$.email.$errors[0]?.$message"
          placeholder="example@mail.com"
          type="email"
        />
      </DocPreview>

      <DocPreview title="numeric">
        <VInput v-model="form.age" :error-message="v$.age.$errors[0]?.$message" placeholder="Тільки числа" />
      </DocPreview>
    </DocSection>

    <!-- ─── sameAs ─── -->
    <DocSection title="sameAs — підтвердження пароля">
      <DocPreview
        :script="`
const form = reactive({ password: '', confirm: '' })

const v$ = useValidate({
  password: [minLength(6)],
  confirm:  [minLength(6), sameAs(() => form.password, 'Паролі не співпадають')],
}, form)
        `"
      >
        <VInput
          v-model="form.password"
          :error-message="v$.password.$errors[0]?.$message"
          :show-password="true"
          placeholder="Пароль"
          type="password"
        />
        <VInput
          v-model="form.confirm"
          :error-message="v$.confirm.$errors[0]?.$message"
          :show-password="true"
          placeholder="Підтвердження паролю"
          type="password"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомний валідатор ─── -->
    <DocSection title="Кастомний валідатор через withMessage + withName">
      <DocPreview
        :script="`
const startsWithABC = withMessage(
  Має починатися з 'ABC'\,
      withName('startsWithABC', (v) => v?.startsWith('ABC') || false)
      )

      const v$ = useValidate({
      nameCustom: [startsWithABC],
      }, form)
      `"
      >
        <VInput
          v-model="form.nameCustom"
          :error-message="v$.nameCustom.$errors[0]?.$message"
          placeholder="Введіть рядок що починається з ABC"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Асинхронний ─── -->
    <DocSection title="Асинхронний валідатор (withAsync)">
      <DocCodeBlock
        :code="`import { withMessage, withAsync } from '../src/validation'

const uniqueName = withMessage(
  'Це ім\\'я вже зайняте',
  withAsync(async (val) => {
    if (!val) return true
    const res = await fetch(\`/api/check-name?name=\${val}\`).then(r => r.json())
    return res.ok
  })
)

const v$ = useValidate({
  nameAsync: [uniqueName],
}, form)`"
        language="ts"
      />
    </DocSection>

    <!-- ─── Select / DatePicker / TimePicker ─── -->
    <DocSection title="Валідація Select, DatePicker, TimePicker">
      <DocPreview title="VSelect + required">
        <VSelect
          v-model="form.selectField"
          :error-message="v$.selectField.$errors[0]?.$message"
          collapsed-tags
          multiple
          placeholder="Оберіть технології..."
        >
          <VOption v-for="item in technologies" :key="item.value" :label="item.label" :value="item.value" />
        </VSelect>
      </DocPreview>

      <DocPreview title="VDatePicker + required">
        <VDatePicker
          v-model="form.dateField"
          :error-message="v$.dateField.$errors[0]?.$message"
          placeholder="Оберіть дату"
          previous-date-disabled
          type="date"
        />
      </DocPreview>

      <DocPreview title="VTimePicker + required">
        <VTimePicker
          v-model="form.timeField"
          :error-message="v$.timeField.$errors[0]?.$message"
          placeholder="Оберіть час"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Патерн: сабміт форми ─── -->
    <DocSection title="Патерн: валідація при сабміті">
      <DocCodeBlock
        :code="`const form = reactive({ name: '', email: '', password: '' })

const v$ = useValidate({
  name:     [required, minLength(2)],
  email:    [required, email],
  password: [required, minLength(8)],
}, form)

async function handleSubmit() {
  // Запускаємо валідацію всіх полів і показуємо помилки
  const isValid = await v$.$validate()
  if (!isValid) return

  // Форма валідна — відправляємо
  await api.submit(form)
}

// Скидання стану після закриття модалки
function resetForm() {
  Object.assign(form, { name: '', email: '', password: '' })
  v$.$reset()
}`"
        language="ts"
      />
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="validatorsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="⚡" title="Автоматична реактивність">
        <code>useValidate</code> ставить <code>watch</code> на кожне поле форми — валідація запускається автоматично при
        зміні значення. Не потрібно викликати нічого вручну під час введення.
      </DocFeature>
      <DocFeature icon="🚀" title="$validate() перед сабмітом">
        <code>await v$.$validate()</code> запускає всі валідатори і встановлює <code>$dirty = true</code> — після цього
        помилки відображаються навіть на незачеплених полях. Повертає <code>boolean</code>.
      </DocFeature>
      <DocFeature icon="🔧" title="mk() — один хелпер замість чотирьох">
        <code>mk({ name: 'abc', message: 'Тільки ABC', async: true }, validator)</code>
        — замінює <code>withName + withMessage + withAsync</code> в один виклик.
      </DocFeature>
      <DocFeature icon="🔴" title="$errors[0]?.$message для компонентів">
        Всі компоненти (VInput, VSelect, VDatePicker, VTimePicker) приймають
        <code>:error-message</code> — передай <code>v$.field.$errors[0]?.$message</code>
        і помилка з'явиться автоматично.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .validation-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
