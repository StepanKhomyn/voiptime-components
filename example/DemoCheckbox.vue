<script lang="ts" setup>
  import { computed, reactive } from 'vue';
  import VCheckbox from '@/components/checkbox/VCheckbox.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  // --- стани для прикладів ---
  const basic = reactive({ unchecked: false, checked: true, indeterminate: false, disabled: true });
  const variants = reactive({ primary: true, success: true, warning: true, danger: true, info: true });
  const sizes = reactive({ small: true, medium: true, large: true });
  const doubles = reactive({ primary: true, success: true, warning: true, danger: true, info: true });

  const group = reactive({ selectAll: false, item1: false, item2: true, item3: false });
  const isIndeterminate = computed(() => {
    const sel = [group.item1, group.item2, group.item3].filter(Boolean).length;
    return sel > 0 && sel < 3;
  });
  const handleSelectAll = (v: boolean) => {
    group.selectAll = v;
    group.item1 = v;
    group.item2 = v;
    group.item3 = v;
  };
  const handleItemChange = () => {
    group.selectAll = group.item1 && group.item2 && group.item3;
  };

  const variantList = ['primary', 'success', 'warning', 'danger', 'info'] as const;
  const sizeList = ['small', 'medium', 'large'] as const;

  // --- документація ---
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        { name: 'modelValue', type: 'boolean', default: 'undefined', description: 'Значення для v-model' },
        {
          name: 'checked',
          type: 'boolean',
          default: 'false',
          description: 'Початковий стан (якщо v-model не використовується)',
        },
        { name: 'label', type: 'string', default: 'undefined', description: 'Текст лейблу' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований стан' },
        { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Стан "частково вибрано"' },
        { name: 'isDouble', type: 'boolean', default: 'false', description: 'Показати подвійну галочку' },
        { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Розмір компонента' },
        {
          name: 'variant',
          type: "'primary' | 'success' | 'warning' | 'danger' | 'info'",
          default: "'primary'",
          description: 'Кольорова схема',
        },
        { name: 'required', type: 'boolean', default: 'false', description: "Обов'язкове поле" },
        { name: 'id', type: 'string', default: 'auto', description: 'Атрибут id' },
        { name: 'name', type: 'string', default: 'undefined', description: 'Атрибут name для форми' },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'update:modelValue', type: 'boolean', description: 'Оновлення значення (v-model)' },
        { name: 'change', type: '(value: boolean, event: Event)', description: 'Зміна стану' },
        { name: 'focus', type: 'FocusEvent', description: 'Отримання фокусу' },
        { name: 'blur', type: 'FocusEvent', description: 'Втрата фокусу' },
      ],
    },
    {
      title: 'Slots',
      rows: [
        { name: 'default', description: 'Основний контент лейблу' },
        { name: 'label', description: 'Кастомний лейбл (пріоритет над default і prop label)' },
      ],
    },
  ];
</script>

<template>
  <div class="checkbox-showcase">
    <!-- ─── Базові стани ─── -->
    <DocSection title="Базові стани">
      <DocPreview>
        <VCheckbox v-model="basic.unchecked" label="Не вибрано" />
        <VCheckbox v-model="basic.checked" label="Вибрано" />
        <VCheckbox v-model="basic.indeterminate" :indeterminate="true" label="Indeterminate" />
        <VCheckbox v-model="basic.disabled" disabled label="Заблокований" />
      </DocPreview>
    </DocSection>

    <!-- ─── Або всі варіанти одразу ─── -->
    <DocSection title="Всі типи">
      <DocPreview>
        <VCheckbox v-for="v in variantList" :key="v" v-model="variants[v]" :label="v" :variant="v" />
      </DocPreview>
    </DocSection>

    <!-- ─── Розміри ─── -->
    <DocSection title="Розміри">
      <DocPreview>
        <VCheckbox v-for="s in sizeList" :key="s" v-model="sizes[s]" :label="s" :size="s" />
      </DocPreview>
    </DocSection>

    <!-- ─── Подвійні галочки ─── -->
    <DocSection
      description="isDouble=true додає другу галочку — використовується для масових дій"
      title="Подвійні галочки"
    >
      <DocPreview>
        <VCheckbox v-for="v in variantList" :key="v" v-model="doubles[v]" :isDouble="true" :label="v" :variant="v" />
      </DocPreview>
    </DocSection>

    <!-- ─── Група з "Вибрати все" ─── -->
    <DocSection
      description="Indeterminate автоматично вмикається, якщо вибрана частина елементів"
      title="Група з «Вибрати все»"
    >
      <DocPreview
        :script="`
const group = reactive({ selectAll: false, item1: false, item2: true, item3: false })
const isIndeterminate = computed(() => {
  const sel = [group.item1, group.item2, group.item3].filter(Boolean).length
  return sel > 0 && sel < 3
})
const handleSelectAll = (v) => Object.assign(group, { selectAll: v, item1: v, item2: v, item3: v })
const handleItemChange = () => { group.selectAll = group.item1 && group.item2 && group.item3 }
`"
      >
        <div class="group-demo">
          <VCheckbox
            v-model="group.selectAll"
            :indeterminate="isIndeterminate"
            label="Вибрати все"
            variant="primary"
            @change="handleSelectAll"
          />
          <div class="group-demo__items">
            <VCheckbox v-model="group.item1" label="Елемент 1" variant="success" @change="handleItemChange" />
            <VCheckbox v-model="group.item2" label="Елемент 2" variant="success" @change="handleItemChange" />
            <VCheckbox v-model="group.item3" label="Елемент 3" variant="success" @change="handleItemChange" />
          </div>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Props / Events / Slots ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="⚡" title="modelValue vs checked">
        <code>modelValue</code> (v-model) має пріоритет над <code>checked</code>. Якщо передати обидва —
        <code>checked</code> ігнорується.
      </DocFeature>
      <DocFeature icon="➖" title="Indeterminate">
        Встановіть <code>:indeterminate="someSelected && !allSelected"</code> для реалізації «Вибрати все» у списках.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .checkbox-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .group-demo {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &__items {
      margin-left: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
  }
</style>
