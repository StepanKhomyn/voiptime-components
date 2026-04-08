<script setup>
  import { ref } from 'vue';

  const activeTab = ref('npm');
  const copiedKey = ref('');

  function copy(text, key) {
    navigator.clipboard.writeText(text);
    copiedKey.value = key;
    setTimeout(() => (copiedKey.value = ''), 2000);
  }

  const installTabs = [
    { key: 'npm', label: 'npm' },
    { key: 'yarn', label: 'yarn' },
    { key: 'pnpm', label: 'pnpm' },
    { key: 'cdn', label: 'CDN' },
  ];

  const installCommands = {
    npm: 'npm install voiptime-components',
    yarn: 'yarn add voiptime-components',
    pnpm: 'pnpm add voiptime-components',
    cdn: '<script src="https://unpkg.com/voiptime-components/dist/index.umd.js"><\/script>',
  };

  const setupFull = `// main.js / main.ts
import { createApp } from 'vue'
import App from './App.vue'
import VoiptimeComponents from 'voiptime-components'
import 'voiptime-components/dist/style.css'

const app = createApp(App)
app.use(VoiptimeComponents)
app.mount('#app')`;

  const setupTreeShake = `// main.js / main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { VButton, VTable, VModal } from 'voiptime-components'
import 'voiptime-components/dist/style.css'

const app = createApp(App)
app.component('VButton', VButton)
app.component('VTable', VTable)
app.component('VModal', VModal)
app.mount('#app')`;

  const setupAutoImport = `// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VoiptimeResolver } from 'voiptime-components/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VoiptimeResolver()],
    }),
  ],
})`;

  const allComponents = [
    { name: 'VButton', desc: 'Кнопки з усіма типами та станами' },
    { name: 'VTable', desc: 'Таблиці з сортуванням та слотами' },
    { name: 'VCheckbox', desc: 'Чекбокси' },
    { name: 'VRadio', desc: 'Радіокнопки' },
    { name: 'VInput', desc: 'Текстові поля вводу' },
    { name: 'VSelect', desc: 'Випадаючі списки' },
    { name: 'VModal', desc: 'Модальні вікна' },
    { name: 'VDropdown', desc: 'Дропдавн меню' },
    { name: 'VTooltip', desc: 'Тултіпи' },
    { name: 'VDatePicker', desc: 'Вибір дати' },
    { name: 'VTimePicker', desc: 'Вибір часу' },
    { name: 'VPagination', desc: 'Пагінація' },
    { name: 'VTabs', desc: 'Вкладки' },
    { name: 'VCollapse', desc: 'Акордеон / collapse' },
    { name: 'VMessage', desc: 'Системні повідомлення' },
    { name: 'VLoader', desc: 'Індикатор завантаження' },
    { name: 'VSlider', desc: 'Слайдер значень' },
    { name: 'VUpload', desc: 'Завантаження файлів' },
    { name: 'VSidebar', desc: 'Бокова панель навігації' },
    { name: 'VChart', desc: 'Графіки та діаграми' },
  ];

  const requirements = [
    { label: 'Vue', value: '≥ 3.5' },
    { label: 'Node.js', value: '≥ 18' },
    { label: 'Vite', value: '≥ 5 (рекомендовано)' },
    { label: 'TypeScript', value: 'Опціонально, підтримується' },
  ];
</script>

<template>
  <div class="install">
    <!-- Hero -->
    <div class="install__hero">
      <div class="install__hero-badge">v1.0.0 · Stable</div>
      <h1 class="install__hero-title">Встановлення</h1>
      <p class="install__hero-subtitle">
        VoIPTime Components — бібліотека Vue 3.5 компонентів для корпоративних інтерфейсів. Встановіть за одну команду і
        почніть розробку.
      </p>

      <div class="install__requirements">
        <div v-for="r in requirements" :key="r.label" class="install__req-chip">
          <span class="install__req-label">{{ r.label }}</span>
          <span class="install__req-value">{{ r.value }}</span>
        </div>
      </div>
    </div>

    <!-- Step 1: Install -->
    <section class="install__section">
      <div class="install__step-number">01</div>
      <h2 class="install__section-title">Встановіть пакет</h2>

      <div class="install__tabs">
        <button
          v-for="tab in installTabs"
          :key="tab.key"
          :class="['install__tab', activeTab === tab.key ? 'is-active' : '']"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="install__code-block">
        <pre class="install__code">{{ installCommands[activeTab] }}</pre>
        <button class="install__copy-btn" @click="copy(installCommands[activeTab], 'install')">
          {{ copiedKey === 'install' ? '✓ Скопійовано' : 'Копіювати' }}
        </button>
      </div>
    </section>

    <!-- Step 2: Register -->
    <section class="install__section">
      <div class="install__step-number">02</div>
      <h2 class="install__section-title">Підключіть до проекту</h2>
      <p class="install__section-desc">
        Є три способи підключення — глобальний, вибірковий або через auto-import плагін.
      </p>

      <div class="install__setup-grid">
        <!-- Full -->
        <div class="install__setup-card">
          <div class="install__setup-card-header">
            <span class="install__setup-badge install__setup-badge--blue">Рекомендовано</span>
            <h3 class="install__setup-card-title">Глобальна реєстрація</h3>
            <p class="install__setup-card-desc">Всі компоненти доступні одразу в будь-якому .vue файлі</p>
          </div>
          <div class="install__code-block">
            <pre class="install__code">{{ setupFull }}</pre>
            <button class="install__copy-btn" @click="copy(setupFull, 'full')">
              {{ copiedKey === 'full' ? '✓ Скопійовано' : 'Копіювати' }}
            </button>
          </div>
        </div>

        <!-- Tree-shaking -->
        <div class="install__setup-card">
          <div class="install__setup-card-header">
            <span class="install__setup-badge install__setup-badge--green">Tree-shaking</span>
            <h3 class="install__setup-card-title">Вибіркове підключення</h3>
            <p class="install__setup-card-desc">Імпортуйте тільки потрібні компоненти — менший bundle</p>
          </div>
          <div class="install__code-block">
            <pre class="install__code">{{ setupTreeShake }}</pre>
            <button class="install__copy-btn" @click="copy(setupTreeShake, 'tree')">
              {{ copiedKey === 'tree' ? '✓ Скопійовано' : 'Копіювати' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Step 3: Components list -->
    <section class="install__section">
      <div class="install__step-number">03</div>
      <h2 class="install__section-title">Доступні компоненти</h2>
      <p class="install__section-desc">
        Бібліотека містить {{ allComponents.length }} компонентів. Кожен можна підключати окремо або всі разом.
      </p>

      <div class="install__components-grid">
        <div v-for="comp in allComponents" :key="comp.name" class="install__comp-card">
          <code class="install__comp-name">{{ comp.name }}</code>
          <span class="install__comp-desc">{{ comp.desc }}</span>
        </div>
      </div>
    </section>

    <!-- Quick start -->
    <section class="install__section">
      <div class="install__step-number">04</div>
      <h2 class="install__section-title">Перший компонент</h2>
      <p class="install__section-desc">Після підключення ви можете одразу використовувати компоненти:</p>

      <div class="install__code-block">
        <pre class="install__code">
&lt;template&gt;
  &lt;VButton type="primary" @click="handleClick"&gt;
    Привіт, VoIPTime!
  &lt;/VButton&gt;

  &lt;VButton type="success" icon="check" :loading="loading"&gt;
    Зберегти
  &lt;/VButton&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue'
const loading = ref(false)
function handleClick() { loading.value = true }
&lt;/script&gt;</pre
        >
        <button class="install__copy-btn" @click="copy('...', 'quickstart')">
          {{ copiedKey === 'quickstart' ? '✓ Скопійовано' : 'Копіювати' }}
        </button>
      </div>

      <div class="install__success-banner">
        <span class="install__success-icon">🎉</span>
        <div>
          <strong>Готово!</strong>
          Перейдіть до документації окремих компонентів у лівому меню щоб дізнатись про всі можливості.
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .install {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  /* Hero */
  .install__hero {
    margin-bottom: 48px;
  }

  .install__hero-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    background: var(--color-primary-light, #e6eef1);
    color: var(--color-primary-main, #00475a);
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .install__hero-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111;
    margin: 0 0 10px;
  }

  .install__hero-subtitle {
    font-size: 15px;
    color: #555;
    line-height: 1.7;
    margin: 0 0 20px;
    max-width: 600px;
  }

  .install__requirements {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .install__req-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #fff;
    font-size: 13px;
  }

  .install__req-label {
    color: #888;
  }

  .install__req-value {
    color: #222;
    font-weight: 500;
  }

  /* Section */
  .install__section {
    margin-bottom: 52px;
    position: relative;
    padding-left: 0;
  }

  .install__step-number {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--color-primary-main, #00475a);
    opacity: 0.5;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .install__section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111;
    margin: 0 0 8px;
  }

  .install__section-desc {
    font-size: 14px;
    color: #666;
    margin: 0 0 20px;
    line-height: 1.6;
  }

  /* Tabs */
  .install__tabs {
    display: flex;
    gap: 2px;
    margin-bottom: 0;
    border-bottom: 2px solid #e5e7eb;
  }

  .install__tab {
    padding: 8px 16px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 13px;
    color: #888;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition:
      color 0.15s,
      border-color 0.15s;
  }

  .install__tab.is-active {
    color: var(--color-primary-main, #00475a);
    border-bottom-color: var(--color-primary-main, #00475a);
  }

  /* Code block */
  .install__code-block {
    position: relative;
    background: #1a1f2e;
    border-radius: 0 8px 8px 8px;
    overflow: hidden;
  }

  .install__section > .install__code-block {
    border-radius: 8px;
  }

  .install__code {
    margin: 0;
    padding: 20px 24px;
    font-size: 13px;
    line-height: 1.7;
    color: #c9d1d9;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    overflow-x: auto;
    white-space: pre;
  }

  .install__copy-btn {
    position: absolute;
    top: 10px;
    right: 12px;
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.1);
    color: #ccc;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 5px;
    font-size: 11px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .install__copy-btn:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
  }

  /* Setup grid */
  .install__setup-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .install__setup-card {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }

  .install__setup-card-header {
    padding: 16px 20px 14px;
    border-bottom: 1px solid #f0f0f0;
  }

  .install__setup-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .install__setup-badge--blue {
    background: var(--color-primary-light, #e6eef1);
    color: var(--color-primary-main, #00475a);
  }

  .install__setup-badge--green {
    background: var(--color-success-bg, #e7faf5);
    color: var(--color-success-main, #21725e);
  }

  .install__setup-badge--purple {
    background: #f0eeff;
    color: #6c47ff;
  }

  .install__setup-card-title {
    font-size: 14px;
    font-weight: 600;
    color: #111;
    margin: 0 0 4px;
  }

  .install__setup-card-desc {
    font-size: 12.5px;
    color: #777;
    margin: 0;
  }

  .install__setup-card .install__code-block {
    border-radius: 0;
  }

  /* Components grid */
  .install__components-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 10px;
  }

  .install__comp-card {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 12px 14px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    transition: border-color 0.15s;
  }

  .install__comp-card:hover {
    border-color: var(--color-primary-border, #ccdade);
  }

  .install__comp-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-primary-main, #00475a);
    font-family: 'JetBrains Mono', monospace;
  }

  .install__comp-desc {
    font-size: 12px;
    color: #888;
  }

  /* Success */
  .install__success-banner {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-top: 20px;
    padding: 16px 20px;
    background: var(--color-success-bg, #e7faf5);
    border: 1px solid var(--color-success-border, #b5d0c9);
    border-radius: 10px;
    font-size: 14px;
    color: #333;
    line-height: 1.6;
  }

  .install__success-icon {
    font-size: 20px;
    flex-shrink: 0;
  }
</style>
