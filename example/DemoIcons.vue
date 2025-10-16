<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { icons } from '@/icons';
  import VIcon from '@/components/icon/VIcon.vue';

  const copiedIcon = ref<string | null>(null);

  async function copyIconName(iconName: string) {
    try {
      await navigator.clipboard.writeText(iconName);
      copiedIcon.value = iconName;
      setTimeout(() => {
        copiedIcon.value = null;
      }, 2000);
    } catch (err) {
      console.error('Не вдалося скопіювати:', err);
    }
  }

  const exampleCode = `<template>
  <!-- Базове використання -->
  <VIcon name="arrowDown" />

  <!-- З розміром -->
  <VIcon name="filterSave" :width="32" :height="32" />

  <!-- З кольором -->
  <VIcon name="close" color="#ff0000" />

  <!-- Комбінування властивостей -->
  <VIcon
    name="arrowRight"
    :width="48"
    :height="24"
    color="#007bff"
  />
</template>`;

  const sortedIcons = computed(() =>
    Object.entries(icons)
      .sort(([aName], [bName]) => aName.localeCompare(bName))
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as typeof icons
      )
  );
</script>

<template>
  <div class="icon-showcase">
    <!-- Icons Grid -->
    <div class="icons-section">
      <div class="icons-grid">
        <div
          v-for="(iconComponent, iconName) in sortedIcons"
          :key="iconName"
          :class="{ copied: copiedIcon === iconName }"
          :title="`Клікніть для копіювання: ${iconName}`"
          class="icon-item"
          @click="copyIconName(iconName)"
        >
          <div class="icon-wrapper">
            <VIcon :height="32" :name="iconName" :width="32" />
          </div>
          <div class="icon-name">{{ iconName }}</div>
          <div v-if="copiedIcon === iconName" class="copied-indicator"> ✓ Скопійовано!</div>
        </div>
      </div>
    </div>

    <!-- Documentation -->
    <div class="documentation">
      <h2>Використання компонента VIcon</h2>

      <div class="doc-section">
        <h3>Props</h3>
        <table class="props-table">
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
              <td><code>name</code></td>
              <td><code>IconName</code></td>
              <td>-</td>
              <td>Назва іконки (обов'язкова)</td>
            </tr>
            <tr>
              <td><code>width</code></td>
              <td><code>string | number</code></td>
              <td>За замовчуванням береться з розміру svg</td>
              <td>Ширина іконки</td>
            </tr>
            <tr>
              <td><code>height</code></td>
              <td><code>string | number</code></td>
              <td>За замовчуванням береться з розміру svg</td>
              <td>Висота іконки</td>
            </tr>
            <tr>
              <td><code>color</code></td>
              <td><code>string</code></td>
              <td>currentColor</td>
              <td>Колір іконки</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="doc-section">
        <h3>Приклади використання</h3>
        <pre class="code-example"><code>{{ exampleCode }}</code></pre>
      </div>

      <div class="doc-section">
        <h3>Живі приклади</h3>
        <div class="live-examples">
          <div class="example">
            <div class="example-title">Різні розміри:</div>
            <div class="example-content">
              <VIcon :height="16" :width="16" name="arrowDown" />
              <VIcon :height="24" :width="24" name="arrowDown" />
              <VIcon :height="32" :width="32" name="arrowDown" />
              <VIcon :height="48" :width="48" name="arrowDown" />
            </div>
          </div>

          <div class="example">
            <div class="example-title">Різні кольори:</div>
            <div class="example-content">
              <VIcon color="#ff0000" name="filterSave" />
              <VIcon color="#00ff00" name="filterSave" />
              <VIcon color="#0000ff" name="filterSave" />
              <VIcon color="#ff6600" name="filterSave" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .icon-showcase {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .icons-section {
    margin-bottom: 4rem;
  }

  .icons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border: 2px solid #ecf0f1;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;

    &:hover {
      border-color: #3498db;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
    }

    &.copied {
      border-color: #27ae60;
      background-color: #d5f4e6;
    }

    .icon-wrapper {
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 32px;
    }

    .icon-name {
      font-size: 0.8rem;
      color: #2c3e50;
      text-align: center;
      font-family: 'Courier New', monospace;
      word-break: break-all;
    }

    .copied-indicator {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #27ae60;
      color: white;
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      animation: fadeIn 0.3s ease;
    }
  }

  .documentation {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 2rem;
    margin-top: 3rem;

    h2,
    h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.8rem;
      border-bottom: 2px solid #3498db;
      padding-bottom: 0.5rem;
    }

    h3 {
      font-size: 1.3rem;
      margin-top: 2rem;
    }
  }

  .doc-section {
    margin-bottom: 2rem;
  }

  .props-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;

    th,
    td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    th {
      background: #e9ecef;
      font-weight: 600;
      color: #495057;
    }

    code {
      background: #f1f3f4;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
    }
  }

  .code-example {
    background: #2d3748;
    color: #e2e8f0;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;

    code {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }

  .live-examples {
    .example {
      margin-bottom: 1.5rem;
      padding: 1rem;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      background: white;

      .example-title {
        font-weight: 600;
        color: #495057;
        margin-bottom: 0.75rem;
      }

      .example-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    .icon-showcase {
      padding: 1rem;
    }

    .icons-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.75rem;
    }

    .icon-item {
      padding: 0.75rem;
    }

    .documentation {
      padding: 1rem;
    }

    .props-table {
      font-size: 0.9rem;

      th,
      td {
        padding: 0.5rem;
      }
    }
  }
</style>
