<script lang="ts" setup>
  import { reactive } from 'vue';
  import VSlider from '@/components/slider/VSlider.vue';
  import VSliderMarkRange from '@/components/slider/VSliderMarkRange.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  const demo = reactive({
    basic: 30,
    noTooltip: 50,
    formatted: 60,
    disabled: 50,
    withInput: 20,
    steps: 30,
    range: [20, 70] as [number, number],
    marks: 50,
    vert: 40,
    vertRange: [20, 80] as [number, number],
  });

  const smr = reactive({
    percent: 30,
    rating: 7,
    small: 50,
    disabled: 40,
  });

  const sliderMarks = { 0: 'Min', 25: '25%', 50: 'Mid', 75: '75%', 100: 'Max' };

  const sliderSections: TableSection[] = [
    {
      title: 'Props (VSlider)',
      rows: [
        { name: 'modelValue', type: 'number | [number, number]', default: '0', description: 'Значення (v-model)' },
        { name: 'min', type: 'number', default: '0', description: 'Мінімальне значення' },
        { name: 'max', type: 'number', default: '100', description: 'Максимальне значення' },
        { name: 'step', type: 'number', default: '1', description: 'Крок зміни значення' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований стан' },
        { name: 'range', type: 'boolean', default: 'false', description: 'Режим діапазону (два повзунки)' },
        { name: 'vertical', type: 'boolean', default: 'false', description: 'Вертикальний режим' },
        { name: 'height', type: 'string', default: "'200px'", description: 'Висота (тільки для vertical)' },
        { name: 'label', type: 'string', default: '-', description: 'Текст лейблу' },
        { name: 'showInput', type: 'boolean', default: 'false', description: 'Поле вводу поруч' },
        { name: 'showInputControls', type: 'boolean', default: 'true', description: 'Кнопки ± при showInput' },
        {
          name: 'inputSize',
          type: "'small' | 'medium' | 'large' | 'mini'",
          default: "'small'",
          description: 'Розмір поля вводу',
        },
        { name: 'showStops', type: 'boolean', default: 'false', description: 'Крапки-зупинки на треку' },
        { name: 'showTooltip', type: 'boolean', default: 'true', description: 'Тултіп при перетягуванні' },
        {
          name: 'formatTooltip',
          type: '(v: number) => string',
          default: '-',
          description: 'Форматування тексту тултіпу',
        },
        { name: 'marks', type: 'Record<number, string>', default: '-', description: 'Мітки на треку' },
        { name: 'debounce', type: 'number', default: '300', description: 'Debounce для інпута (мс)' },
      ],
    },
    {
      title: 'Events (VSlider)',
      rows: [
        { name: 'change', type: 'number | [number, number]', description: 'При відпусканні повзунка (mouseup)' },
        { name: 'input', type: 'number | [number, number]', description: 'В реальному часі під час перетягування' },
      ],
    },
    {
      title: 'Props (VSliderMarkRange)',
      rows: [
        { name: 'modelValue', type: 'number', default: '-', description: 'Вибране значення (v-model)' },
        {
          name: 'range',
          type: 'number[]',
          default: '-',
          description: 'Масив дискретних значень для вибору',
          required: true,
        },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований стан' },
        {
          name: 'formatLabel',
          type: '(v: number) => string',
          default: '-',
          description: 'Форматування підписів міток',
        },
        { name: 'label', type: 'string', default: '-', description: 'Текст лейблу' },
      ],
    },
    {
      title: 'Events (VSliderMarkRange)',
      rows: [
        { name: 'update:modelValue', type: 'number', description: 'Зміна значення (v-model)' },
        { name: 'change', type: 'number', description: 'Вибір нового значення' },
      ],
    },
  ];
</script>

<template>
  <div class="slider-showcase">
    <!-- ─── Базові стани VSlider ─── -->
    <DocSection title="VSlider — базові стани">
      <DocPreview title="Базовий">
        <div style="width: 100%">
          <VSlider v-model="demo.basic" label="Гучність" />
        </div>
      </DocPreview>

      <DocPreview title="Без тултіпу">
        <div style="width: 100%">
          <VSlider v-model="demo.noTooltip" :show-tooltip="false" label="Без тултіпу" />
        </div>
      </DocPreview>

      <DocPreview title="Форматування тултіпу">
        <div style="width: 100%">
          <VSlider v-model="demo.formatted" :format-tooltip="v => v + '%'" label="Відсоток" />
        </div>
      </DocPreview>

      <DocPreview title="Disabled">
        <div style="width: 100%">
          <VSlider v-model="demo.disabled" :disabled="true" label="Вимкнений" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── З полем вводу ─── -->
    <DocSection title="VSlider — з полем вводу">
      <DocPreview>
        <div style="width: 100%">
          <VSlider
            v-model="demo.withInput"
            :show-input="true"
            :show-input-controls="true"
            input-size="small"
            label="З кнопками ±"
          />
          <VSlider
            v-model="demo.withInput"
            :show-input="true"
            :show-input-controls="false"
            input-size="medium"
            label="Без кнопок"
          />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Кроки і зупинки ─── -->
    <DocSection title="VSlider — крок і зупинки">
      <DocPreview>
        <div style="width: 100%">
          <VSlider v-model="demo.steps" :step="10" :show-stops="true" label="Крок 10 + зупинки" />
          <VSlider v-model="demo.steps" :min="0" :max="50" :step="5" :show-stops="true" label="0–50 крок 5" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Range ─── -->
    <DocSection title="VSlider — діапазон (range)">
      <DocPreview :script="`const range = ref([20, 70])`">
        <div style="width: 100%">
          <VSlider v-model="demo.range" :range="true" label="Ціновий діапазон" />
          <div class="value-badge">{{ demo.range[0] }} — {{ demo.range[1] }}</div>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Мітки ─── -->
    <DocSection title="VSlider — мітки (marks)">
      <DocPreview :script="`const marks = { 0: 'Min', 25: '25%', 50: 'Mid', 75: '75%', 100: 'Max' }`">
        <div style="width: 100%">
          <VSlider v-model="demo.marks" :marks="sliderMarks" :step="25" :show-stops="true" label="З мітками" />
          <div class="value-badge">{{ demo.marks }}</div>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Вертикальний ─── -->
    <DocSection title="VSlider — вертикальний режим">
      <DocPreview>
        <div style="display: flex; gap: 2.5rem; align-items: flex-end; padding-bottom: 1rem; height: 220px">
          <VSlider v-model="demo.vert" :vertical="true" height="150px" label="Default" />
          <VSlider v-model="demo.vert" :vertical="true" height="150px" :show-tooltip="false" label="No tooltip" />
          <VSlider v-model="demo.vert" :vertical="true" height="150px" :step="10" :show-stops="true" label="Steps" />
          <VSlider v-model="demo.vertRange" :vertical="true" height="150px" :range="true" label="Range" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── VSliderMarkRange ─── -->
    <DocSection
      title="VSliderMarkRange — дискретний вибір"
      description="Вибір з фіксованого набору значень через масив range"
    >
      <DocPreview title="Відсотковий діапазон">
        <div style="width: 100%">
          <VSliderMarkRange
            v-model="smr.percent"
            :range="[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
            :format-label="v => v + '%'"
            label="Баланс"
          />
          <div class="value-badge">{{ smr.percent != null ? smr.percent + '%' : '—' }}</div>
        </div>
      </DocPreview>

      <DocPreview title="Числовий рейтинг">
        <div style="width: 100%">
          <VSliderMarkRange v-model="smr.rating" :range="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" label="Оцінка якості" />
          <div class="value-badge">{{ smr.rating ?? '—' }}</div>
        </div>
      </DocPreview>

      <DocPreview title="Disabled">
        <div style="width: 100%">
          <VSliderMarkRange
            v-model="smr.disabled"
            :range="[0, 25, 50, 75, 100]"
            :format-label="v => v + '%'"
            :disabled="true"
            label="Вимкнений"
          />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="sliderSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature title="range vs VSliderMarkRange" icon="🔢">
        <code>VSlider :range="true"</code> — вільний діапазон між min і max з кроком. <code>VSliderMarkRange</code> —
        вибір одного значення з фіксованого масиву. Другий варіант — для бізнес-значень типу балансу або рейтингу.
      </DocFeature>
      <DocFeature title="marks + showStops" icon="📍">
        <code>marks</code> додає підписи під конкретними позначками. <code>show-stops</code> показує крапки на треку для
        всіх значень кроку. Можна використовувати разом.
      </DocFeature>
      <DocFeature title="formatTooltip" icon="💬">
        <code>:format-tooltip="v => v + ' грн'"</code> — форматує текст тултіпу без зміни реального значення v-model.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style scoped lang="scss">
  .slider-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .value-badge {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.2rem 0.6rem;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 5px;
    font-size: 0.8rem;
    font-family: 'JetBrains Mono', monospace;
    color: #0c4a6e;
  }
</style>
