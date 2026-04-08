<script lang="ts" setup>
  import { ref } from 'vue';
  import VRadiobox from '@/components/radiobox/VRadiobox.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  const selectedOption = ref('option1');
  const selectedSize = ref('medium');
  const selectedVariant = ref('primary');
  const customLabel = ref('custom');

  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'modelValue',
          type: 'any',
          default: 'undefined',
          description: 'v-model — значення вибраного радіобоксу в групі',
        },
        { name: 'value', type: 'any', default: 'undefined', description: 'Значення цієї конкретної опції' },
        { name: 'checked', type: 'boolean', default: 'false', description: 'Стан вибору без v-model' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований стан' },
        { name: 'label', type: 'string', default: 'undefined', description: 'Текст лейблу' },
        {
          name: 'name',
          type: 'string',
          default: 'undefined',
          description: 'HTML атрибут name — групує радіобокси разом',
        },
        { name: 'id', type: 'string', default: 'auto', description: 'HTML атрибут id' },
        {
          name: 'size',
          type: "'small' | 'medium' | 'large'",
          default: "'medium'",
          description: 'Розмір компонента',
        },
        {
          name: 'variant',
          type: "'primary' | 'success' | 'warning' | 'danger' | 'info'",
          default: "'primary'",
          description: 'Кольорова схема',
        },
        { name: 'required', type: 'boolean', default: 'false', description: "Обов'язкове поле" },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'update:modelValue', type: '(value: any)', description: 'Оновлення v-model' },
        { name: 'change', type: '(value: any, event: Event)', description: 'Зміна вибраного стану' },
        { name: 'focus', type: 'FocusEvent', description: 'Отримання фокусу' },
        { name: 'blur', type: 'FocusEvent', description: 'Втрата фокусу' },
      ],
    },
    {
      title: 'Slots',
      rows: [
        { name: 'default', description: 'Альтернатива prop label' },
        { name: 'label', description: 'Кастомний лейбл з HTML-форматуванням (пріоритет над default і prop label)' },
      ],
    },
  ];
</script>

<template>
  <div class="radiobox-showcase">
    <!-- ─── Основне використання ─── -->
    <DocSection
      description="Групуйте радіобокси через однаковий name + v-model на спільну ref-змінну"
      title="Основне використання"
    >
      <DocPreview :script="`const selectedOption = ref('option1')`">
        <VRadiobox v-model="selectedOption" label="Опція 1" name="example" value="option1" />
        <VRadiobox v-model="selectedOption" label="Опція 2" name="example" value="option2" />
        <VRadiobox v-model="selectedOption" disabled label="Опція 3 (disabled)" name="example" value="option3" />
      </DocPreview>
    </DocSection>

    <!-- ─── Розміри ─── -->
    <DocSection title="Розміри">
      <DocPreview :script="`const selectedSize = ref('medium')`">
        <VRadiobox v-model="selectedSize" label="Маленький" name="sizes" size="small" value="small" />
        <VRadiobox v-model="selectedSize" label="Середній" name="sizes" size="medium" value="medium" />
        <VRadiobox v-model="selectedSize" label="Великий" name="sizes" size="large" value="large" />
      </DocPreview>
    </DocSection>

    <!-- ─── Варіанти кольорів ─── -->
    <DocSection title="Варіанти кольорів">
      <DocPreview :script="`const selectedVariant = ref('primary')`">
        <VRadiobox v-model="selectedVariant" label="Primary" name="variants" value="primary" variant="primary" />
        <VRadiobox v-model="selectedVariant" label="Success" name="variants" value="success" variant="success" />
        <VRadiobox v-model="selectedVariant" label="Warning" name="variants" value="warning" variant="warning" />
        <VRadiobox v-model="selectedVariant" label="Danger" name="variants" value="danger" variant="danger" />
        <VRadiobox v-model="selectedVariant" label="Info" name="variants" value="info" variant="info" />
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомний лейбл через слот ─── -->
    <DocSection description="Слот #label дозволяє передати будь-який HTML замість тексту" title="Кастомний лейбл">
      <DocPreview :script="`const customLabel = ref('custom')`">
        <VRadiobox v-model="customLabel" name="custom" value="custom">
          <template #label><strong>Кастомний лейбл</strong> з <em>форматуванням</em></template>
        </VRadiobox>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🔗" title="Групування через name">
        Всі радіобокси з однаковим <code>name</code> утворюють групу — вибір одного автоматично знімає вибір з інших.
      </DocFeature>
      <DocFeature icon="🔄" title="value vs modelValue">
        <code>value</code> — унікальне значення цієї опції. <code>modelValue</code> (v-model) — значення
        <em>вибраної</em> опції в групі. Радіобокс відмічений коли <code>value === modelValue</code>.
      </DocFeature>
      <DocFeature icon="🏷️" title="Слот #label">
        Має пріоритет над prop <code>label</code> і дефолтним слотом. Використовуй для лейблів з іконками, посиланнями
        або іншим форматуванням.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .radiobox-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
