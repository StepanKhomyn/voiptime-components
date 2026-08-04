<script lang="ts" setup>
  import { ref } from 'vue';
  import VColorPicker from '@/components/color-picker/VColorPicker.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  // ── Demo state ────────────────────────────────────────────────────────────
  const basicColor = ref('#00475A');
  const labeledColor = ref('#F2994A');
  const customPresetsColor = ref('#2F80ED');
  const disabledColor = ref('#EB5757');

  const brandPresets = ['#00475A', '#F2994A', '#0047FF', '#1B998B', '#111111'];

  // ── API docs ──────────────────────────────────────────────────────────────
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        { name: 'color', type: 'string', default: "'#FFFFFF'", description: 'Поточний колір у hex-форматі' },
        {
          name: 'isShowLabel',
          type: 'boolean',
          default: 'false',
          description: 'Показувати hex-код поруч зі свотчем-кнопкою',
        },
        {
          name: 'presets',
          type: 'string[]',
          default: '[8 базових кольорів]',
          description: 'Список пресетів для швидкого вибору в панелі',
        },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований стан' },
      ],
    },
    {
      title: 'Events',
      rows: [
        {
          name: 'updateColor',
          type: '[color: string]',
          description: 'Спрацьовує при виборі кольору — через нативний picker, hex-інпут або пресет',
        },
      ],
    },
  ];
</script>

<template>
  <div class="color-picker-showcase">
    <!-- ─── Базове використання ─── -->
    <DocSection title="Базове використання" description="Клік на свотч відкриває панель з нативним picker'ом, hex-полем і пресетами">
      <DocPreview title="Без лейбла">
        <VColorPicker :color="basicColor" @update-color="c => (basicColor = c)" />
      </DocPreview>
    </DocSection>

    <!-- ─── З лейблом ─── -->
    <DocSection title="З відображенням hex-коду">
      <DocPreview title="isShowLabel = true">
        <VColorPicker :color="labeledColor" is-show-label @update-color="c => (labeledColor = c)" />
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомні пресети ─── -->
    <DocSection title="Кастомні пресети" description="Можна передати власний набір кольорів замість дефолтних 8">
      <DocPreview title="Брендові кольори">
        <VColorPicker
          :color="customPresetsColor"
          :presets="brandPresets"
          is-show-label
          @update-color="c => (customPresetsColor = c)"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Заблокований стан ─── -->
    <DocSection title="Заблокований стан">
      <DocPreview>
        <VColorPicker :color="disabledColor" disabled is-show-label />
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🎨" title="Три способи вибору кольору">
        Нативний OS color picker (з eyedropper у Chrome/Edge), ручне введення hex-коду, або клік на один з пресетів.
      </DocFeature>
      <DocFeature icon="✅" title="Валідація hex-вводу">
        Колір застосовується (емітиться <code>updateColor</code>) лише коли введене значення — валідний
        3- або 6-значний hex; невалідний ввід просто не емітить подію, не ламаючи стан.
      </DocFeature>
      <DocFeature icon="🖱️" title="Закриття по кліку поза межами">
        Панель закривається автоматично при кліку будь-де за межами компонента, або по Enter у hex-полі.
      </DocFeature>
      <DocFeature icon="🔒" title="Disabled-стан">
        При <code>disabled</code> кнопка-тригер неактивна, панель не відкривається, весь компонент напівпрозорий.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .color-picker-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;

    &__field-label {
      font-size: 13px;
      color: var(--color-gray-2);
      margin-bottom: 6px;
    }
  }
</style>