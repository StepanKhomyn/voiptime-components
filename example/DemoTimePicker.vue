<script lang="ts" setup>
  import { ref } from 'vue';
  import VTimePicker from '@/components/timepicker/VTimePicker.vue';

  const selectedTime = ref('14:30:00');
  const selectedTime2 = ref('14:30:00');
  const selectedTimeRange = ref(['09:00:00', '17:00:00']);
  const selectedTime12h = ref('02:30:00 PM');
  const selectedTimeNoSeconds = ref('14:30');
  const disabledTime = ref('10:15:30');
  const customFormatTime = ref('14:30:00');
</script>

<template>
  <div>
    <!-- Основне використання -->
    <div class="example-section">
      <h3>Основне використання</h3>
      <p>Вибраний час: {{ selectedTime }}</p>

      <VTimePicker v-model="selectedTime" placeholder="Оберіть час" />

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const selectedTime = ref('14:30:00');
&lt;/script&gt;

&lt;template&gt;
  &lt;VTimePicker v-model="selectedTime" placeholder="Оберіть час" /&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <div class="example-section">
      <h3>Outlined</h3>
      <p>Вибраний час: {{ selectedTime2 }}</p>

      <VTimePicker v-model="selectedTime2" label="Outlined" outlined />

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const selectedTime = ref('14:30:00');
&lt;/script&gt;

&lt;template&gt;
  &lt;VTimePicker v-model="selectedTime" label="Outlined" outlined /&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Діапазон часу -->
    <div class="example-section">
      <h3>Діапазон часу</h3>
      <p>Вибраний діапазон: {{ selectedTimeRange }}</p>

      <VTimePicker
        v-model="selectedTimeRange"
        end-placeholder="Кінцевий час"
        range-separator=" до "
        start-placeholder="Початковий час"
        type="timerange"
      />

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const selectedTimeRange = ref(['09:00:00', '17:00:00']);
&lt;/script&gt;

&lt;template&gt;
  &lt;VTimePicker
    v-model="selectedTimeRange"
    type="timerange"
    start-placeholder="Початковий час"
    end-placeholder="Кінцевий час"
    range-separator=" до "
  /&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- 12-годинний формат -->
    <div class="example-section">
      <h3>12-годинний формат</h3>
      <p>Вибраний час: {{ selectedTime12h }}</p>

      <VTimePicker v-model="selectedTime12h" format="hh:mm:ss A" placeholder="Оберіть час" use12-hours />

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const selectedTime12h = ref('02:30:00 PM');
&lt;/script&gt;

&lt;template&gt;
  &lt;VTimePicker
    v-model="selectedTime12h"
    use12-hours
    format="hh:mm:ss A"
    placeholder="Оберіть час"
  /&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Без секунд -->
    <div class="example-section">
      <h3>Без секунд</h3>
      <p>Вибраний час: {{ selectedTimeNoSeconds }}</p>

      <VTimePicker v-model="selectedTimeNoSeconds" :show-seconds="false" format="HH:mm" placeholder="Оберіть час" />

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const selectedTimeNoSeconds = ref('14:30');
&lt;/script&gt;

&lt;template&gt;
  &lt;VTimePicker
    v-model="selectedTimeNoSeconds"
    :show-seconds="false"
    format="HH:mm"
    placeholder="Оберіть час"
  /&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Різні розміри -->
    <div class="example-section">
      <h3>Розміри</h3>

      <div style="margin-bottom: 1rem">
        <label>Маленький:</label>
        <VTimePicker v-model="selectedTime" placeholder="Маленький" size="small" />
      </div>

      <div style="margin-bottom: 1rem">
        <label>Стандартний:</label>
        <VTimePicker v-model="selectedTime" placeholder="Стандартний" size="default" />
      </div>

      <div style="margin-bottom: 1rem">
        <label>Великий:</label>
        <VTimePicker v-model="selectedTime" placeholder="Великий" size="large" />
      </div>

      <pre class="code-simple">
        <code>
&lt;template&gt;
  &lt;VTimePicker v-model="selectedTime" size="small" placeholder="Маленький" /&gt;
  &lt;VTimePicker v-model="selectedTime" size="default" placeholder="Стандартний" /&gt;
  &lt;VTimePicker v-model="selectedTime" size="large" placeholder="Великий" /&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- З кроками та обмеженнями -->
    <div class="example-section">
      <h3>Кроки та обмеження</h3>
      <p>Час з обмеженнями: {{ disabledTime }}</p>

      <VTimePicker
        v-model="disabledTime"
        :disabled-hours="() => [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]"
        :disabled-minutes="hour => (hour === 10 ? [0, 15, 30, 45] : [])"
        :hour-step="2"
        :minute-step="15"
        :second-step="30"
        placeholder="Час з обмеженнями"
      />

      <pre class="code-simple">
        <code>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue';

const disabledTime = ref('10:15:30');
&lt;/script&gt;

&lt;template&gt;
  &lt;VTimePicker
    v-model="disabledTime"
    :hour-step="2"
    :minute-step="15"
    :second-step="30"
    :disabled-hours="() =&gt; [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]"
    :disabled-minutes="(hour) =&gt; hour === 10 ? [0, 15, 30, 45] : []"
    placeholder="Час з обмеженнями"
  /&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- Відключений стан -->
    <div class="example-section">
      <h3>Стани</h3>

      <div style="margin-bottom: 1rem">
        <label>Звичайний:</label>
        <VTimePicker v-model="selectedTime" placeholder="Звичайний стан" />
      </div>

      <div style="margin-bottom: 1rem">
        <label>Відключений:</label>
        <VTimePicker v-model="selectedTime" disabled placeholder="Відключений" />
      </div>

      <div style="margin-bottom: 1rem">
        <label>Без очищення:</label>
        <VTimePicker v-model="selectedTime" :clearable="false" placeholder="Без кнопки очищення" />
      </div>

      <pre class="code-simple">
        <code>
&lt;template&gt;
  &lt;VTimePicker v-model="selectedTime" placeholder="Звичайний стан" /&gt;
  &lt;VTimePicker v-model="selectedTime" disabled placeholder="Відключений" /&gt;
  &lt;VTimePicker v-model="selectedTime" :clearable="false" placeholder="Без кнопки очищення" /&gt;
&lt;/template&gt;
        </code>
      </pre>
    </div>

    <!-- API Документація -->
    <div class="example-section">
      <h3>API Документація</h3>

      <h4>Props</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Тип</th>
            <th>За замовчуванням</th>
            <th>Опис</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>modelValue</code></td>
            <td><code>TimePickerValue</code></td>
            <td><code>undefined</code></td>
            <td>v-model значення - вибраний час або діапазон часу</td>
          </tr>
          <tr>
            <td><code>type</code></td>
            <td><code>'time' | 'timerange'</code></td>
            <td><code>'time'</code></td>
            <td>Тип picker'а - одиночний час або діапазон</td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td><code>'Оберіть час'</code></td>
            <td>Placeholder текст для одиночного вибору</td>
          </tr>
          <tr>
            <td><code>label</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Текст лейбла</td>
          </tr>
          <tr>
            <td><code>outlined</code></td>
            <td><code>boolean</code></td>
            <td>false</td>
            <td>Виводити помилки та лейбл на бордері</td>
          </tr>
          <tr>
            <td><code>startPlaceholder</code></td>
            <td><code>string</code></td>
            <td><code>'Початковий час'</code></td>
            <td>Placeholder для початкового часу в діапазоні</td>
          </tr>
          <tr>
            <td><code>endPlaceholder</code></td>
            <td><code>string</code></td>
            <td><code>'Кінцевий час'</code></td>
            <td>Placeholder для кінцевого часу в діапазоні</td>
          </tr>
          <tr>
            <td><code>rangeSeparator</code></td>
            <td><code>string</code></td>
            <td><code>' - '</code></td>
            <td>Розділювач між початковим та кінцевим часом</td>
          </tr>
          <tr>
            <td><code>format</code></td>
            <td><code>string</code></td>
            <td><code>'HH:mm:ss'</code></td>
            <td>Формат відображення часу</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Відключений стан</td>
          </tr>
          <tr>
            <td><code>clearable</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Показувати кнопку очищення</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'small' | 'default' | 'large'</code></td>
            <td><code>'default'</code></td>
            <td>Розмір компонента</td>
          </tr>
          <tr>
            <td><code>hourStep</code></td>
            <td><code>number</code></td>
            <td><code>1</code></td>
            <td>Крок для годин</td>
          </tr>
          <tr>
            <td><code>minuteStep</code></td>
            <td><code>number</code></td>
            <td><code>1</code></td>
            <td>Крок для хвилин</td>
          </tr>
          <tr>
            <td><code>secondStep</code></td>
            <td><code>number</code></td>
            <td><code>1</code></td>
            <td>Крок для секунд</td>
          </tr>
          <tr>
            <td><code>showSeconds</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Показувати секунди</td>
          </tr>
          <tr>
            <td><code>use12Hours</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Використовувати 12-годинний формат</td>
          </tr>
          <tr>
            <td><code>disabledHours</code></td>
            <td><code>() => number[]</code></td>
            <td><code>undefined</code></td>
            <td>Функція для відключення годин</td>
          </tr>
          <tr>
            <td><code>disabledMinutes</code></td>
            <td><code>(hour: number) => number[]</code></td>
            <td><code>undefined</code></td>
            <td>Функція для відключення хвилин залежно від години</td>
          </tr>
          <tr>
            <td><code>disabledSeconds</code></td>
            <td><code>(hour: number, minute: number) => number[]</code></td>
            <td><code>undefined</code></td>
            <td>Функція для відключення секунд залежно від години та хвилини</td>
          </tr>
          <tr>
            <td><code>hideDisabledOptions</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Приховувати відключені опції замість їх відключення</td>
          </tr>
        </tbody>
      </table>

      <h4>Events</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Параметри</th>
            <th>Опис</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:modelValue</code></td>
            <td><code>(value: TimePickerValue)</code></td>
            <td>Випромінюється при зміні v-model значення</td>
          </tr>
          <tr>
            <td><code>change</code></td>
            <td><code>(value: TimePickerValue)</code></td>
            <td>Випромінюється при зміні вибраного часу</td>
          </tr>
          <tr>
            <td><code>focus</code></td>
            <td><code>(instance: any)</code></td>
            <td>Випромінюється при отриманні фокусу</td>
          </tr>
          <tr>
            <td><code>blur</code></td>
            <td><code>(instance: any)</code></td>
            <td>Випромінюється при втраті фокусу</td>
          </tr>
          <tr>
            <td><code>open-change</code></td>
            <td><code>(open: boolean)</code></td>
            <td>Випромінюється при відкритті/закритті dropdown</td>
          </tr>
        </tbody>
      </table>

      <h4>Methods</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Параметри</th>
            <th>Опис</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>focus()</code></td>
            <td>-</td>
            <td>Встановлює фокус на компонент</td>
          </tr>
          <tr>
            <td><code>blur()</code></td>
            <td>-</td>
            <td>Забирає фокус з компонента</td>
          </tr>
          <tr>
            <td><code>open()</code></td>
            <td>-</td>
            <td>Відкриває dropdown</td>
          </tr>
          <tr>
            <td><code>close()</code></td>
            <td>-</td>
            <td>Закриває dropdown</td>
          </tr>
        </tbody>
      </table>

      <h4>Типи</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Опис</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>TimeValue</code></td>
            <td><code>string | Date</code> - одиночне значення часу</td>
          </tr>
          <tr>
            <td><code>TimeRangeValue</code></td>
            <td><code>[TimeValue, TimeValue]</code> - діапазон часу</td>
          </tr>
          <tr>
            <td><code>TimePickerValue</code></td>
            <td><code>TimeValue | TimeRangeValue | null | undefined</code> - будь-яке значення TimePicker</td>
          </tr>
          <tr>
            <td><code>TimeObject</code></td>
            <td>Об'єкт з полями hour, minute, second, period</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
  .example-section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
  }

  .example-section h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .example-section h4 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #333;
    font-size: 1.1rem;
  }

  .vt-timepicker {
    margin-right: 1rem;
    margin-bottom: 0.5rem;
  }

  label {
    display: inline-block;
    width: 120px;
    font-weight: 500;
    margin-right: 8px;
  }

  .code-simple {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 1rem;
    overflow-x: auto;
    font-family: 'Courier New', Consolas, monospace;
    font-size: 14px;
    line-height: 1.4;
    margin-top: 1rem;
  }

  .code-simple code {
    color: #333;
    background: none;
    padding: 0;
    border-radius: 0;
    font-family: inherit;
    font-size: inherit;
  }

  .api-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
    font-size: 14px;
  }

  .api-table th,
  .api-table td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
    vertical-align: top;
  }

  .api-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
  }

  .api-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .api-table tbody tr:hover {
    background-color: #f0f0f0;
  }

  .api-table code {
    background-color: #f1f3f4;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Courier New', Consolas, monospace;
    font-size: 12px;
    color: #d73a49;
  }

  .api-table th code {
    color: #333;
  }
</style>
