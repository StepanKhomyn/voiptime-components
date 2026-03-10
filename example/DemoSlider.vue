<template>
  <div class="showcase">

    <!-- ========== VSlider ========== -->
    <section class="section">
      <h2>VSlider — Підключення</h2>
      <div class="card">
        <h3>1. Базовий слайдер</h3>
        <pre class="code">&lt;VSlider v-model="value" label="Гучність" /&gt;</pre>

        <h3>2. З мінімумом, максимумом і кроком</h3>
        <pre class="code">&lt;VSlider v-model="value" :min="0" :max="200" :step="10" label="Крок 10" /&gt;</pre>

        <h3>3. З полем вводу</h3>
        <pre class="code">&lt;VSlider v-model="value" :show-input="true" :show-input-controls="true" input-size="small" label="З інпутом" /&gt;</pre>

        <h3>4. Ренж (діапазон)</h3>
        <pre class="code">&lt;VSlider v-model="rangeValue" :range="true" label="Ціновий діапазон" /&gt;</pre>

        <h3>5. Вертикальний</h3>
        <pre class="code">&lt;VSlider v-model="value" :vertical="true" height="150px" label="Вертикальний" /&gt;</pre>

        <h3>6. З мітками (marks)</h3>
        <pre class="code">&lt;VSlider
          v-model="value"
          :marks="{ 0: 'Min', 25: '25%', 50: 'Mid', 75: '75%', 100: 'Max' }"
          label="З мітками"
        /&gt;</pre>

        <h3>7. Форматування тултіпу</h3>
        <pre class="code">&lt;VSlider
          v-model="value"
          :format-tooltip="v => v + '%'"
          label="Відсоток"
        /&gt;</pre>

        <h3>8. Вимкнений</h3>
        <pre class="code">&lt;VSlider v-model="value" :disabled="true" label="Вимкнений" /&gt;</pre>
      </div>
    </section>

    <!-- Demo VSlider -->
    <section class="section">
      <h2>VSlider — Демонстрація</h2>
      <div class="demo-grid">

        <div class="demo-item">
          <h4>Базові стани</h4>
          <VSlider v-model="demo.defaultVal" label="Default value" />
          <VSlider v-model="demo.custom" label="Customized initial value" />
          <VSlider v-model="demo.noTooltip" :show-tooltip="false" label="Hide Tooltip" />
          <VSlider
            v-model="demo.formatted"
            :format-tooltip="v => v + '%'"
            label="Format Tooltip"
          />
          <VSlider v-model="demo.disabled" :disabled="true" label="Disabled" />
        </div>

        <div class="demo-item">
          <h4>З полем вводу</h4>
          <VSlider
            v-model="demo.withInput"
            :show-input="true"
            :show-input-controls="true"
            input-size="small"
            label="Show input (small)"
          />
          <VSlider
            v-model="demo.withInputMedium"
            :show-input="true"
            :show-input-controls="false"
            input-size="medium"
            label="Show input (no controls)"
          />
        </div>

        <div class="demo-item">
          <h4>Крок і зупинки</h4>
          <VSlider
            v-model="demo.steps"
            :step="10"
            :show-stops="true"
            label="Step 10 + Show Stops"
          />
          <VSlider
            v-model="demo.steps2"
            :min="0"
            :max="50"
            :step="5"
            :show-stops="true"
            :show-input="true"
            label="0–50 step 5"
          />
        </div>

        <div class="demo-item">
          <h4>Діапазон (Range)</h4>
          <VSlider
            v-model="demo.range"
            :range="true"
            label="Ціновий діапазон"
          />
          <div class="value-display">
            Вибрано: {{ demo.range[0] }} — {{ demo.range[1] }}
          </div>

          <VSlider
            v-model="demo.rangeStep"
            :range="true"
            :step="10"
            :show-stops="true"
            label="Range + Stops"
          />
        </div>

        <div class="demo-item">
          <h4>З мітками</h4>
          <VSlider
            v-model="demo.marks"
            :marks="sliderMarks"
            :step="25"
            :show-stops="true"
            label="Marks"
          />
          <div class="value-display">Значення: {{ demo.marks }}</div>
        </div>

        <div class="demo-item demo-item--vertical">
          <h4>Вертикальний режим</h4>
          <div class="vertical-demo">
            <VSlider v-model="demo.vert1" :vertical="true" height="150px" label="Default" />
            <VSlider v-model="demo.vert2" :vertical="true" height="150px" :show-tooltip="false" label="No Tooltip" />
            <VSlider v-model="demo.vert3" :vertical="true" height="150px" :step="10" :show-stops="true" label="Steps" />
            <VSlider v-model="demo.vert4" :vertical="true" height="150px" :range="true" label="Range" />
          </div>
        </div>

      </div>
    </section>

    <!-- VSlider Props -->
    <section class="section">
      <h2>VSlider — Властивості (Props)</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Опис</th></tr>
          </thead>
          <tbody>
          <tr><td><code>modelValue / v-model</code></td><td><code>number | [number, number]</code></td><td>0</td><td>Прив'язане значення</td></tr>
          <tr><td><code>min</code></td><td><code>number</code></td><td>0</td><td>Мінімальне значення</td></tr>
          <tr><td><code>max</code></td><td><code>number</code></td><td>100</td><td>Максимальне значення</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td>false</td><td>Вимкнути слайдер</td></tr>
          <tr><td><code>step</code></td><td><code>number</code></td><td>1</td><td>Крок зміни значення</td></tr>
          <tr><td><code>show-input</code></td><td><code>boolean</code></td><td>false</td><td>Показати поле вводу</td></tr>
          <tr><td><code>show-input-controls</code></td><td><code>boolean</code></td><td>true</td><td>Кнопки ±</td></tr>
          <tr><td><code>input-size</code></td><td><code>large | medium | small | mini</code></td><td>small</td><td>Розмір поля вводу</td></tr>
          <tr><td><code>show-stops</code></td><td><code>boolean</code></td><td>false</td><td>Показати крапки-зупинки</td></tr>
          <tr><td><code>show-tooltip</code></td><td><code>boolean</code></td><td>true</td><td>Показати тултіп</td></tr>
          <tr><td><code>format-tooltip</code></td><td><code>(value: number) => string</code></td><td>—</td><td>Функція форматування тултіпу</td></tr>
          <tr><td><code>range</code></td><td><code>boolean</code></td><td>false</td><td>Режим діапазону</td></tr>
          <tr><td><code>vertical</code></td><td><code>boolean</code></td><td>false</td><td>Вертикальний режим</td></tr>
          <tr><td><code>height</code></td><td><code>string</code></td><td>200px</td><td>Висота (для вертикального)</td></tr>
          <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Текст лейбла</td></tr>
          <tr><td><code>debounce</code></td><td><code>number</code></td><td>300</td><td>Debounce для інпута (мс)</td></tr>
          <tr><td><code>marks</code></td><td><code>Record&lt;number, string | MarkItem&gt;</code></td><td>—</td><td>Позначки на треку</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- VSlider Events -->
    <section class="section">
      <h2>VSlider — Події (Emits)</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
          <tr><th>Event</th><th>Payload</th><th>Опис</th></tr>
          </thead>
          <tbody>
          <tr><td><code>change</code></td><td><code>number | [number, number]</code></td><td>При відпусканні (mouseup)</td></tr>
          <tr><td><code>input</code></td><td><code>number | [number, number]</code></td><td>В реальному часі під час перетягування</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <hr class="divider" />

    <!-- ========== VS0eMarkRange ========== -->
    <section class="section">
      <h2>VSliderMarkRange — Підключення</h2>
      <div class="card">
        <h3>1. Базове використання</h3>
        <pre class="code">&lt;VSliderMarkRange
          v-model="value"
          :range="[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
          :show-percent="true"
          label="Баланс"
          @change="handleChange"
        /&gt;</pre>

        <h3>2. Числовий діапазон без відсотків</h3>
        <pre class="code">&lt;VSliderMarkRange
          v-model="rating"
          :range="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
          label="Рейтинг"
        /&gt;</pre>

        <h3>3. Вимкнений</h3>
        <pre class="code">&lt;VSliderMarkRange
          v-model="value"
          :range="[0, 25, 50, 75, 100]"
          :disabled="true"
          label="Вимкнений"
        /&gt;</pre>

        <h3>4. Форматування label</h3>
        <pre class="code">&lt;VSliderMarkRange
          v-model="value"
          :format-label="v => v + '%'"
          label="Відсоток"
        /&gt;</pre>
      </div>
    </section>

    <!-- Demo VSliderMarkRange -->
    <section class="section">
      <h2>VSliderMarkRange — Демонстрація</h2>
      <div class="demo-grid">

        <div class="demo-item demo-item--wide">
          <h4>Відсотковий діапазон</h4>
          <VSliderMarkRange
            v-model="smr.percent"
            :range="[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
            :format-label="v => v + '%'"
            label="Співвідношення балансу"
            @change="onSmrChange"
          />
          <div class="value-display">Вибрано: {{ smr.percent != null ? smr.percent + '%' : 'не вибрано' }}</div>
        </div>

        <div class="demo-item demo-item--wide">
          <h4>Числовий рейтинг</h4>
          <VSliderMarkRange
            v-model="smr.rating"
            :range="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            label="Оцінка якості"
          />
          <div class="value-display">Оцінка: {{ smr.rating ?? '—' }}</div>
        </div>

        <div class="demo-item demo-item--wide">
          <h4>Малий діапазон</h4>
          <VSliderMarkRange
            v-model="smr.small"
            :range="[0, 25, 50, 75, 100]"
            :format-label="v => v + '%'"
            label="Прогрес"
          />
        </div>

        <div class="demo-item demo-item--wide">
          <h4>Вимкнений стан</h4>
          <VSliderMarkRange
            v-model="smr.disabled"
            :range="[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
            :format-label="v => v + '%'"
            :disabled="true"
            label="Вимкнений (disabled)"
          />
        </div>

      </div>
    </section>

    <!-- VSliderMarkRange Props -->
    <section class="section">
      <h2>VSliderMarkRange — Властивості (Props)</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
          <tr><th>Prop</th><th>Type</th><th>Default</th><th>Опис</th></tr>
          </thead>
          <tbody>
          <tr><td><code>modelValue / v-model</code></td><td><code>number</code></td><td>—</td><td>Вибране значення</td></tr>
          <tr><td><code>range</code></td><td><code>number[]</code></td><td>—</td><td>Масив значень для вибору</td></tr>
          <tr><td><code>disabled</code></td><td><code>boolean</code></td><td>false</td><td>Вимкнений стан</td></tr>
          <tr><td><code>format-label</code></td><td><code>(value: number) => string</code></td><td>—</td><td>Функція форматування label</td></tr>
          <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Текст лейбла</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- VSliderMarkRange Events -->
    <section class="section">
      <h2>VSliderMarkRange — Події (Emits)</h2>
      <div class="table-wrapper">
        <table class="table">
          <thead>
          <tr><th>Event</th><th>Payload</th><th>Опис</th></tr>
          </thead>
          <tbody>
          <tr><td><code>update:modelValue</code></td><td><code>number</code></td><td>v-model оновлення</td></tr>
          <tr><td><code>change</code></td><td><code>number</code></td><td>При виборі нового значення</td></tr>
          </tbody>
        </table>
      </div>
    </section>

  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import VSlider from '../src/components/slider/VSlider.vue';
  import VSliderMarkRange from '../src/components/slider/VSliderMarkRange.vue';

  // VSlider demo data
  const demo = reactive({
    defaultVal: 0,
    custom: 30,
    noTooltip: 0,
    formatted: 60,
    disabled: 50,
    withInput: 20,
    withInputMedium: 45,
    steps: 30,
    steps2: 25,
    range: [20, 70] as [number, number],
    rangeStep: [10, 60] as [number, number],
    marks: 50,
    vert1: 40,
    vert2: 70,
    vert3: 30,
    vert4: [20, 80] as [number, number],
  });

  const sliderMarks = {
    0: 'Min',
    25: '25%',
    50: 'Mid',
    75: '75%',
    100: 'Max',
  };

  // VSliderMarkRange demo data
  const smr = reactive({
    percent: 30,
    rating: 7,
    small: 50,
    disabled: 40,
  });

  const onSmrChange = (val: number) => {
    console.log('SMR changed:', val);
  };
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

  .divider {
    border: none;
    border-top: 2px solid #e1e8ed;
    margin: 3rem 0;
  }

  .section {
    margin-bottom: 3rem;
  }

  .section h2 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #409eff;
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
    margin: 1.2rem 0 0.5rem;
    font-size: 1rem;
  }

  .card h3:first-child {
    margin-top: 0;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .demo-item {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    transition: all 0.2s;
  }

  .demo-item:hover {
    border-color: #409eff;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  }

  .demo-item--wide {
    grid-column: span 2;
  }

  @media (max-width: 768px) {
    .demo-item--wide {
      grid-column: span 1;
    }
  }

  .demo-item h4 {
    color: #2c3e50;
    margin: 0 0 1.2rem;
    font-size: 1rem;
    font-weight: 600;
  }

  .demo-item--vertical {
    grid-column: span 2;
  }

  .vertical-demo {
    display: flex;
    gap: 2.5rem;
    align-items: flex-end;
    padding-bottom: 1rem;
  }

  .value-display {
    margin-top: 0.6rem;
    font-size: 13px;
    color: #909399;
    background: #f4f4f5;
    padding: 4px 10px;
    border-radius: 4px;
    display: inline-block;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  .table th,
  .table td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e1e8ed;
    vertical-align: top;
  }

  .table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }

  .table tr:last-child td {
    border-bottom: none;
  }

  .table code {
    background: #f1f3f4;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.85rem;
    color: #d63384;
  }

  .code {
    display: block;
    background: #2d3748;
    color: #e2e8f0;
    padding: 1.2rem 1.5rem;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    overflow-x: auto;
    margin: 0.5rem 0;
    white-space: pre;
  }

  @media (max-width: 768px) {
    .showcase { padding: 1rem; }
    .demo-grid { grid-template-columns: 1fr; }
    .vertical-demo { gap: 1.5rem; }
    .table th, .table td { padding: 0.5rem; font-size: 0.8rem; }
    .code { font-size: 0.78rem; padding: 1rem; }
  }
</style>