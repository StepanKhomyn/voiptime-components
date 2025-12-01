<template>
  <div class="demo-datepicker">
    <h1 class="demo-title">VDatePicker Component Demo</h1>

    <!-- API Documentation -->
    <section class="demo-section">
      <h2>API Documentation</h2>

      <div class="api-docs">
        <h3>Props</h3>
        <table class="api-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>modelValue</code></td>
              <td><code>Date | Date[] | string | string[] | number</code></td>
              <td><code>undefined</code></td>
              <td>Binding value</td>
            </tr>
            <tr>
              <td><code>type</code></td>
              <td
                ><code
                  >'year' | 'month' | 'date' | 'datetime' | 'datetimerange' | 'daterange' | 'monthrange' |
                  'yearrange'</code
                ></td
              >
              <td><code>'date'</code></td>
              <td>Type of picker</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td><code>string</code></td>
              <td><code>'Оберіть дату'</code></td>
              <td>Placeholder text</td>
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
              <td><code>'Початкова дата'</code></td>
              <td>Start date placeholder for range picker</td>
            </tr>
            <tr>
              <td><code>endPlaceholder</code></td>
              <td><code>string</code></td>
              <td><code>'Кінцева дата'</code></td>
              <td>End date placeholder for range picker</td>
            </tr>
            <tr>
              <td><code>rangeSeparator</code></td>
              <td><code>string</code></td>
              <td><code>' - '</code></td>
              <td>Range separator</td>
            </tr>
            <tr>
              <td><code>format</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Display format</td>
            </tr>
            <tr>
              <td><code>valueFormat</code></td>
              <td><code>string</code></td>
              <td><code>''</code></td>
              <td>Value format for binding</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Whether picker is disabled</td>
            </tr>
            <tr>
              <td><code>clearable</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Whether to show clear button</td>
            </tr>
            <tr>
              <td><code>previous-date-disabled</code></td>
              <td><code>boolean</code></td>
              <td><code>false</code></td>
              <td>Previous date disabled</td>
            </tr>
            <tr>
              <td><code>max-date-range</code></td>
              <td><code>number</code></td>
              <td><code>null</code></td>
              <td>Max date range</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td><code>'small' | 'default' | 'large'</code></td>
              <td><code>'default'</code></td>
              <td>Size of the picker</td>
            </tr>
          </tbody>
        </table>

        <h3>Events</h3>
        <table class="api-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Description</th>
              <th>Parameters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>change</code></td>
              <td>Triggers when user confirms the value</td>
              <td>Component's binding value</td>
            </tr>
            <tr>
              <td><code>blur</code></td>
              <td>Triggers when Input blurs</td>
              <td>Component instance</td>
            </tr>
            <tr>
              <td><code>focus</code></td>
              <td>Triggers when Input focuses</td>
              <td>Component instance</td>
            </tr>
          </tbody>
        </table>

        <h3>Date Formats</h3>
        <table class="api-table">
          <thead>
            <tr>
              <th>Format</th>
              <th>Meaning</th>
              <th>Note</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>yyyy</code></td>
              <td>year</td>
              <td></td>
              <td>2017</td>
            </tr>
            <tr>
              <td><code>M</code></td>
              <td>month</td>
              <td>no leading 0</td>
              <td>1</td>
            </tr>
            <tr>
              <td><code>MM</code></td>
              <td>month</td>
              <td></td>
              <td>01</td>
            </tr>
            <tr>
              <td><code>MMM</code></td>
              <td>month</td>
              <td></td>
              <td>Jan</td>
            </tr>
            <tr>
              <td><code>MMMM</code></td>
              <td>month</td>
              <td></td>
              <td>January</td>
            </tr>
            <tr>
              <td><code>d</code></td>
              <td>day</td>
              <td>no leading 0</td>
              <td>2</td>
            </tr>
            <tr>
              <td><code>dd</code></td>
              <td>day</td>
              <td></td>
              <td>02</td>
            </tr>
            <tr>
              <td><code>H</code></td>
              <td>hour</td>
              <td>24-hour clock; no leading 0</td>
              <td>3</td>
            </tr>
            <tr>
              <td><code>HH</code></td>
              <td>hour</td>
              <td>24-hour clock</td>
              <td>03</td>
            </tr>
            <tr>
              <td><code>h</code></td>
              <td>hour</td>
              <td>12-hour clock; must be used with A or a; no leading 0</td>
              <td>3</td>
            </tr>
            <tr>
              <td><code>hh</code></td>
              <td>hour</td>
              <td>12-hour clock; must be used with A or a</td>
              <td>03</td>
            </tr>
            <tr>
              <td><code>m</code></td>
              <td>minute</td>
              <td>no leading 0</td>
              <td>4</td>
            </tr>
            <tr>
              <td><code>mm</code></td>
              <td>minute</td>
              <td></td>
              <td>04</td>
            </tr>
            <tr>
              <td><code>s</code></td>
              <td>second</td>
              <td>no leading 0</td>
              <td>5</td>
            </tr>
            <tr>
              <td><code>ss</code></td>
              <td>second</td>
              <td></td>
              <td>05</td>
            </tr>
            <tr>
              <td><code>A</code></td>
              <td>AM/PM</td>
              <td>only for format, uppercased</td>
              <td>AM</td>
            </tr>
            <tr>
              <td><code>a</code></td>
              <td>am/pm</td>
              <td>only for format, lowercase</td>
              <td>am</td>
            </tr>
            <tr>
              <td><code>timestamp</code></td>
              <td>JS timestamp</td>
              <td>only for value-format; binding value will be a number</td>
              <td>1483326245000</td>
            </tr>
            <tr>
              <td><code>[MM]</code></td>
              <td>No escape characters</td>
              <td>To escape characters, wrap them in square brackets</td>
              <td>MM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Basic Examples -->
    <section class="demo-section">
      <h2>Basic Examples</h2>

      <!-- Date Picker -->
      <div class="demo-item">
        <h3>Date Picker</h3>
        <p>Basic date selection</p>
        <VDatePicker
          v-model="basicDate"
          placeholder="Select date"
          previous-date-disabled
          type="date"
          @change="handleChange('Basic Date', $event)"
        />
        <p class="demo-result">Selected: {{ basicDate || 'None' }}</p>
      </div>

      <!-- Date Picker -->
      <div class="demo-item">
        <h3>Date Picker Outlined</h3>
        <p>Basic date selection</p>
        <VDatePicker
          v-model="basicDate"
          label="Select date"
          outlined
          required
          type="date"
          @change="handleChange('Basic Date', $event)"
        />
        <p class="demo-result">Selected: {{ basicDate || 'None' }}</p>
      </div>

      <!-- Date Picker -->
      <div class="demo-item">
        <h3>DateTime Picker</h3>
        <p>Basic datetime selection</p>
        <VDatePicker
          v-model="basicDateTime"
          placeholder="Select dateTime"
          previous-date-disabled
          type="datetime"
          @change="handleChange('Basic DateTime', $event)"
        />
        <p class="demo-result">Selected: {{ basicDateTime || 'None' }}</p>
      </div>

      <!-- Month Picker -->
      <div class="demo-item">
        <h3>Month Picker</h3>
        <p>Select month and year</p>
        <VDatePicker
          v-model="monthDate"
          placeholder="Select month"
          type="month"
          @change="handleChange('Month', $event)"
        />
        <p class="demo-result">Selected: {{ monthDate || 'None' }}</p>
      </div>

      <!-- Year Picker -->
      <div class="demo-item">
        <h3>Year Picker</h3>
        <p>Select year only</p>
        <VDatePicker v-model="yearDate" placeholder="Select year" type="year" @change="handleChange('Year', $event)" />
        <p class="demo-result">Selected: {{ yearDate || 'None' }}</p>
      </div>
    </section>

    <!-- Range Pickers -->
    <section class="demo-section">
      <h2>Range Pickers</h2>

      <!-- Date Range -->
      <div class="demo-item">
        <h3>Date Range</h3>
        <p>Select date range</p>
        <VDatePicker
          v-model="dateRange"
          end-placeholder="End date"
          range-separator=" to "
          start-placeholder="Start date"
          type="daterange"
          @change="handleChange('Date Range', $event)"
        />
        <p class="demo-result">Selected: {{ dateRange ? `[${dateRange[0]}, ${dateRange[1]}]` : 'None' }}</p>
      </div>

      <!-- Date Range -->
      <div class="demo-item">
        <h3>DateTime Range</h3>
        <p>Select datetime range</p>
        <VDatePicker
          v-model="dateTimeRange"
          :max-date-range="31"
          end-placeholder="End date"
          range-separator=" to "
          start-placeholder="Start date"
          type="datetimerange"
          @change="handleChange('DateTime Range', $event)"
        />
        <p class="demo-result">Selected: {{ dateTimeRange ? `[${dateTimeRange[0]}, ${dateTimeRange[1]}]` : 'None' }}</p>
      </div>

      <!-- Month Range -->
      <div class="demo-item">
        <h3>Month Range</h3>
        <p>Select month range</p>
        <VDatePicker
          v-model="monthRange"
          end-placeholder="End month"
          start-placeholder="Start month"
          type="monthrange"
          @change="handleChange('Month Range', $event)"
        />
        <p class="demo-result">Selected: {{ monthRange ? `[${monthRange[0]}, ${monthRange[1]}]` : 'None' }}</p>
      </div>

      <!-- Year Range -->
      <div class="demo-item">
        <h3>Year Range</h3>
        <p>Select year range</p>
        <VDatePicker
          v-model="yearRange"
          end-placeholder="End year"
          start-placeholder="Start year"
          type="yearrange"
          @change="handleChange('Year Range', $event)"
        />
        <p class="demo-result">Selected: {{ yearRange ? `[${yearRange[0]}, ${yearRange[1]}]` : 'None' }}</p>
      </div>
    </section>

    <!-- Custom Formats -->
    <section class="demo-section">
      <h2>Custom Formats</h2>

      <!-- Display Format -->
      <div class="demo-item">
        <h3>Custom Display Format</h3>
        <p>Display format: dd/MM/yyyy</p>
        <VDatePicker
          v-model="customFormatDate"
          format="dd/MM/yyyy"
          placeholder="Select date"
          @change="handleChange('Custom Format', $event)"
        />
        <p class="demo-result">Selected: {{ customFormatDate || 'None' }}</p>
      </div>

      <!-- Value Format -->
      <div class="demo-item">
        <h3>Custom Value Format</h3>
        <p>Value format: yyyy-MM-dd (ISO format)</p>
        <VDatePicker
          v-model="isoFormatDate"
          format="dd/MM/yyyy"
          placeholder="Select date"
          value-format="yyyy-MM-dd"
          @change="handleChange('ISO Format', $event)"
        />
        <p class="demo-result">Selected: {{ isoFormatDate || 'None' }}</p>
      </div>

      <!-- Timestamp Format -->
      <div class="demo-item">
        <h3>Timestamp Value</h3>
        <p>Value format: timestamp</p>
        <VDatePicker
          v-model="timestampDate"
          placeholder="Select date"
          value-format="timestamp"
          @change="handleChange('Timestamp', $event)"
        />
        <p class="demo-result">Selected: {{ timestampDate || 'None' }}</p>
      </div>

      <!-- Complex Format -->
      <div class="demo-item">
        <h3>Complex Format</h3>
        <p>Format: dd MMMM yyyy [рік]</p>
        <VDatePicker
          v-model="complexFormatDate"
          format="dd MMMM yyyy [рік]"
          placeholder="Select date"
          @change="handleChange('Complex Format', $event)"
        />
        <p class="demo-result">Selected: {{ complexFormatDate || 'None' }}</p>
      </div>
    </section>

    <!-- Sizes -->
    <section class="demo-section">
      <h2>Sizes</h2>

      <div class="demo-item">
        <h3>Small Size</h3>
        <VDatePicker
          v-model="smallSizeDate"
          placeholder="Small picker"
          size="small"
          @change="handleChange('Small Size', $event)"
        />
      </div>

      <div class="demo-item">
        <h3>Default Size</h3>
        <VDatePicker
          v-model="defaultSizeDate"
          placeholder="Default picker"
          size="default"
          @change="handleChange('Default Size', $event)"
        />
      </div>

      <div class="demo-item">
        <h3>Large Size</h3>
        <VDatePicker
          v-model="largeSizeDate"
          placeholder="Large picker"
          size="large"
          @change="handleChange('Large Size', $event)"
        />
      </div>
    </section>

    <!-- States -->
    <section class="demo-section">
      <h2>States</h2>

      <div class="demo-item">
        <h3>Disabled</h3>
        <VDatePicker v-model="disabledDate" disabled placeholder="Disabled picker" />
      </div>

      <div class="demo-item">
        <h3>Not Clearable</h3>
        <VDatePicker
          v-model="notClearableDate"
          :clearable="false"
          placeholder="Not clearable"
          @change="handleChange('Not Clearable', $event)"
        />
      </div>
    </section>

    <!-- Usage Examples -->
    <section class="demo-section">
      <h2>Usage Examples</h2>

      <div class="code-examples">
        <h3>Basic Usage</h3>
        <pre><code>&lt;template&gt;
  &lt;VDatePicker
    v-model="selectedDate"
    placeholder="Select date"
    @change="handleDateChange"
  /&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue'
import VDatePicker from '@/components/VDatePicker.vue'

const selectedDate = ref(null)

const handleDateChange = (value) => {
  console.log('Date changed:', value)
}
&lt;/script&gt;</code></pre>

        <h3>Range Picker</h3>
        <pre><code>&lt;VDatePicker
  v-model="dateRange"
  type="daterange"
  start-placeholder="Start date"
  end-placeholder="End date"
  range-separator=" to "
/&gt;</code></pre>

        <h3>Custom Format</h3>
        <pre><code>&lt;VDatePicker
  v-model="customDate"
  format="dd/MM/yyyy"
  value-format="yyyy-MM-dd"
/&gt;</code></pre>

        <h3>Timestamp Value</h3>
        <pre><code>&lt;VDatePicker
  v-model="timestampValue"
  value-format="timestamp"
/&gt;</code></pre>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import VDatePicker from '@/components/datepicker/VDatePicker.vue';

  // Basic examples
  const basicDate = ref<Date | null>(new Date());
  const basicDateTime = ref<Date | null>(null);
  const monthDate = ref<Date | null>(null);
  const yearDate = ref<Date | null>(null);

  // Range examples
  const dateRange = ref<Date[] | null>(null);
  const dateTimeRange = ref<Date[] | null>(null);
  const monthRange = ref<Date[] | null>(null);
  const yearRange = ref<Date[] | null>(null);

  // Format examples
  const customFormatDate = ref<Date | null>(null);
  const isoFormatDate = ref<string | null>(null);
  const timestampDate = ref<number | null>(null);
  const complexFormatDate = ref<Date | null>(null);

  // Size examples
  const smallSizeDate = ref<Date | null>(null);
  const defaultSizeDate = ref<Date | null>(null);
  const largeSizeDate = ref<Date | null>(null);

  // State examples
  const disabledDate = ref<Date | null>(new Date());
  const notClearableDate = ref<Date | null>(null);

  // Events
  interface Event {
    time: string;
    type: string;
    value: string;
  }

  const events = ref<Event[]>([]);

  const handleChange = (type: string, value: any) => {
    console.log(type, value);
    const event: Event = {
      time: new Date().toLocaleTimeString(),
      type: `${type} Changed`,
      value: Array.isArray(value) ? JSON.stringify(value) : String(value || 'null'),
    };
    events.value.unshift(event);

    // Keep only last 10 events
    if (events.value.length > 10) {
      events.value = events.value.slice(0, 10);
    }
  };

  const clearEvents = () => {
    events.value = [];
  };
</script>

<style scoped>
  .demo-datepicker {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .demo-title {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
  }

  .demo-section {
    margin-bottom: 3rem;
    padding: 1.5rem;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    background: #fafbfc;
  }

  .demo-section h2 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
  }

  .demo-item {
    margin-bottom: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 6px;
    border: 1px solid #e1e8ed;
  }

  .demo-item h3 {
    font-size: 1.2rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .demo-item p {
    color: #7f8c8d;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .demo-result {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: #f8f9fa;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.85rem;
    color: #2c3e50;
  }

  /* API Documentation */
  .api-docs h3 {
    color: #2c3e50;
    margin: 1.5rem 0 1rem 0;
    font-size: 1.2rem;
  }

  .api-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 2rem;
    background: white;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .api-table th {
    background: #3498db;
    color: white;
    padding: 12px;
    text-align: left;
    font-weight: 600;
  }

  .api-table td {
    padding: 12px;
    border-bottom: 1px solid #e1e8ed;
  }

  .api-table tr:last-child td {
    border-bottom: none;
  }

  .api-table code {
    background: #f1f2f6;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.85rem;
    color: #e74c3c;
  }

  /* Events Log */
  .events-log {
    background: white;
    border-radius: 6px;
    padding: 1rem;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #e1e8ed;
  }

  .events-log h4 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }

  .no-events {
    color: #7f8c8d;
    font-style: italic;
    text-align: center;
    padding: 1rem;
  }

  .event-item {
    display: flex;
    gap: 1rem;
    padding: 0.5rem;
    border-bottom: 1px solid #f1f2f6;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.85rem;
  }

  .event-item:last-child {
    border-bottom: none;
  }

  .event-time {
    color: #7f8c8d;
    min-width: 80px;
  }

  .event-type {
    color: #3498db;
    font-weight: 600;
    min-width: 150px;
  }

  .event-value {
    color: #2c3e50;
    word-break: break-all;
  }

  .clear-events-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .clear-events-btn:hover {
    background: #c0392b;
  }

  /* Code Examples */
  .code-examples h3 {
    color: #2c3e50;
    margin: 1.5rem 0 1rem 0;
  }

  .code-examples pre {
    background: #2d3748;
    color: #e2e8f0;
    padding: 1.5rem;
    border-radius: 6px;
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }

  .code-examples code {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .demo-datepicker {
      padding: 10px;
    }

    .demo-title {
      font-size: 2rem;
    }

    .api-table {
      font-size: 0.85rem;
    }

    .api-table th,
    .api-table td {
      padding: 8px;
    }

    .event-item {
      flex-direction: column;
      gap: 0.25rem;
    }

    .event-time,
    .event-type {
      min-width: auto;
    }
  }
</style>
