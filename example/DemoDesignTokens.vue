<script setup>
  import { ref } from 'vue';

  const activeGroup = ref('colors');

  const groups = [
    { key: 'colors', label: 'Кольори' },
    { key: 'typography', label: 'Типографіка' },
    { key: 'spacing', label: 'Відступи' },
    { key: 'tokens', label: 'CSS Змінні' },
  ];

  const colorPalettes = [
    {
      name: 'Primary',
      desc: 'Основний бренд-колір. Використовується для активних елементів, посилань, primary-кнопок.',
      colors: [
        { token: '--color-primary-main', hex: '#00475A', label: 'Main', textLight: true },
        { token: '--color-primary-hover', hex: '#00546A', label: 'Hover', textLight: true },
        { token: '--color-primary-pressed', hex: '#003D4D', label: 'Pressed', textLight: true },
        { token: '--color-primary-bg', hex: '#F2F6F6', label: 'BG' },
        { token: '--color-primary-focus', hex: '#E6EDEF', label: 'Focus' },
        { token: '--color-primary-border', hex: '#CCDADE', label: 'Border' },
        { token: '--color-primary-light', hex: '#E6EEF1', label: 'Light' },
        { token: '--color-primary-shadow', hex: '#e6f0f4', label: 'Shadow' },
      ],
    },
    {
      name: 'Yellow / Warning-alt',
      desc: 'Акцентний жовтий. Для виділення важливих елементів без негативного забарвлення.',
      colors: [
        { token: '--color-yellow-main', hex: '#FFBD3E', label: 'Main' },
        { token: '--color-yellow-hover', hex: '#FFC24C', label: 'Hover' },
        { token: '--color-yellow-pressed', hex: '#F3AC24', label: 'Pressed' },
        { token: '--color-yellow-bg', hex: '#FFF9EC', label: 'BG' },
        { token: '--color-yellow-focus', hex: '#FFF5E2', label: 'Focus' },
        { token: '--color-yellow-border', hex: '#FFECC6', label: 'Border' },
      ],
    },
    {
      name: 'Success',
      desc: 'Зелений для успішних операцій, підтверджень, позитивних статусів.',
      colors: [
        { token: '--color-success-main', hex: '#21725E', label: 'Main', textLight: true },
        { token: '--color-success-hover', hex: '#1B5F4E', label: 'Hover', textLight: true },
        { token: '--color-success-pressed', hex: '#164C3F', label: 'Pressed', textLight: true },
        { token: '--color-success-bg', hex: '#E7FAF5', label: 'BG' },
        { token: '--color-success-focus', hex: '#C8EBE2', label: 'Focus' },
        { token: '--color-success-border', hex: '#B5D0C9', label: 'Border' },
      ],
    },
    {
      name: 'Warning',
      desc: 'Жовтий для попереджень, некритичних повідомлень.',
      colors: [
        { token: '--color-warning-main', hex: '#E0CE2C', label: 'Main' },
        { token: '--color-warning-hover', hex: '#BBAC25', label: 'Hover' },
        { token: '--color-warning-pressed', hex: '#95891D', label: 'Pressed' },
        { token: '--color-warning-bg', hex: '#FEFADC', label: 'BG' },
        { token: '--color-warning-focus', hex: '#FDF8CF', label: 'Focus' },
        { token: '--color-warning-border', hex: '#F5EFB9', label: 'Border' },
      ],
    },
    {
      name: 'Danger',
      desc: 'Червоний для помилок, видалення, деструктивних дій.',
      colors: [
        { token: '--color-danger-main', hex: '#A82525', label: 'Main', textLight: true },
        { token: '--color-danger-hover', hex: '#8C1F1F', label: 'Hover', textLight: true },
        { token: '--color-danger-pressed', hex: '#541212', label: 'Pressed', textLight: true },
        { token: '--color-danger-bg', hex: '#FFE8E8', label: 'BG' },
        { token: '--color-danger-focus', hex: '#FFDFDF', label: 'Focus' },
        { token: '--color-danger-border', hex: '#E2B6B6', label: 'Border' },
      ],
    },
    {
      name: 'Neutral / Grayscale',
      desc: 'Нейтральні кольори для тексту, роздільників, фонів.',
      colors: [
        { token: '--color-gray-0', hex: '#252525', label: 'Gray-0', textLight: true },
        { token: '--color-gray-1', hex: '#333333', label: 'Gray-1', textLight: true },
        { token: '--color-gray-2', hex: '#4F4F4F', label: 'Gray-2', textLight: true },
        { token: '--color-gray-3', hex: '#828282', label: 'Gray-3', textLight: true },
        { token: '--color-gray-4', hex: '#BDBDBD', label: 'Gray-4' },
        { token: '--color-gray-5', hex: '#E0E0E0', label: 'Gray-5' },
        { token: '--color-gray-6', hex: '#F2F2F2', label: 'Gray-6' },
        { token: '--color-gray-7', hex: '#f8f9fa', label: 'Gray-7' },
        { token: '--color-white', hex: '#FFFFFF', label: 'White' },
      ],
    },
  ];

  const typographyTokens = [
    {
      group: 'Розміри',
      items: [
        { token: '--font-size-sm', value: '14px', sample: 'Малий текст', size: '14px' },
        { token: '--font-size-base', value: '16px', sample: 'Базовий текст', size: '16px' },
        { token: '--font-size-medium', value: '18px', sample: 'Середній текст', size: '18px' },
        { token: '--font-size-lg', value: '20px', sample: 'Великий текст', size: '20px' },
      ],
    },
    {
      group: 'Вага шрифту',
      items: [
        { token: '--font-weight-regular', value: '400', sample: 'Regular text', weight: '400' },
        { token: '--font-weight-medium', value: '500', sample: 'Medium text', weight: '500' },
        { token: '--font-weight-semibold', value: '600', sample: 'Semibold text', weight: '600' },
        { token: '--font-weight-bold', value: '700', sample: 'Bold text', weight: '700' },
      ],
    },
    {
      group: 'Сімейства шрифтів',
      items: [
        {
          token: '--font-primary',
          value: "'Inter', sans-serif",
          sample: 'Inter — UI, кнопки, заголовки',
          family: 'Inter, sans-serif',
        },
        {
          token: '--font-secondary',
          value: "'Roboto', serif",
          sample: 'Roboto — таблиці, форми, текст',
          family: 'Roboto, sans-serif',
        },
      ],
    },
  ];

  const spacingTokens = [
    { token: '--vt-gap-sm', value: '5px', px: 5, usage: 'Дрібні проміжки між елементами' },
    { token: '--vt-gap-base', value: '10px', px: 10, usage: 'Стандартний gap у flex/grid' },
    { token: '--vt-gap-lg', value: '20px', px: 20, usage: 'Великі відступи між секціями' },
    { token: '--vt-padding-sm', value: '5px', px: 5, usage: 'Маленький padding' },
    { token: '--vt-padding-base', value: '10px', px: 10, usage: 'Стандартний padding' },
    { token: '--vt-padding-lg', value: '20px', px: 20, usage: 'Великий padding' },
    { token: '--padding-button', value: '8px 16px', px: null, usage: 'Padding кнопки' },
    { token: '--padding-input', value: '0px 12px', px: null, usage: 'Padding інпуту' },
    { token: '--padding-table-cell', value: '8px', px: 8, usage: 'Padding комірки таблиці' },
    { token: '--padding-modal-header', value: '15px 20px', px: null, usage: 'Padding заголовку модалки' },
  ];

  const componentTokens = [
    {
      component: 'VButton',
      tokens: [
        '--vt-button-font-family',
        '--vt-button-font-size',
        '--vt-button-font-weight',
        '--vt-button-line-height',
      ],
    },
    {
      component: 'VTable',
      tokens: [
        '--vt-table-th-font-family',
        '--vt-table-th-font-weight',
        '--vt-table-td-font-family',
        '--vt-table-td-font-size',
      ],
    },
    { component: 'VInput', tokens: ['--vt-input-font-family', '--vt-input-font-weight', '--vt-input-font-size'] },
    {
      component: 'VModal',
      tokens: ['--vt-modal-header-font-family', '--vt-modal-header-font-size', '--vt-modal-header-font-weight'],
    },
    {
      component: 'VCheckbox',
      tokens: ['--vt-checkbox-font-family', '--vt-checkbox-font-size', '--vt-checkbox-font-weight'],
    },
    { component: 'VTabs', tokens: ['--vt-tabs-font-family', '--vt-tabs-font-size', '--vt-tabs-font-weight'] },
    {
      component: 'VCollapse',
      tokens: ['--vt-collapse-font-family', '--vt-collapse-font-size', '--vt-collapse-font-weight'],
    },
    {
      component: 'VPagination',
      tokens: ['--vt-pagination-font-family', '--vt-pagination-font-size', '--vt-pagination-font-weight'],
    },
    {
      component: 'Scrollbar',
      tokens: [
        '--color-scrollbar-track',
        '--color-scrollbar-thumb',
        '--color-scrollbar-track-hover',
        '--color-scrollbar-thumb-hover',
      ],
    },
  ];

  const copiedToken = ref('');

  function copyToken(token) {
    navigator.clipboard.writeText(`var(${token})`);
    copiedToken.value = token;
    setTimeout(() => (copiedToken.value = ''), 1500);
  }
</script>

<template>
  <div class="dt">
    <!-- Page header -->
    <div class="dt__header">
      <div class="dt__header-badge">Design System</div>
      <h1 class="dt__title">Дизайн токени</h1>
      <p class="dt__subtitle">
        Всі кольори, розміри та відступи бібліотеки зберігаються як CSS змінні. Ви можете перевизначити будь-який токен
        у своєму проекті, додавши стилі до <code>:root</code>.
      </p>
    </div>

    <!-- Tab navigation -->
    <div class="dt__tabs">
      <button
        v-for="g in groups"
        :key="g.key"
        :class="['dt__tab', activeGroup === g.key ? 'is-active' : '']"
        @click="activeGroup = g.key"
      >
        {{ g.label }}
      </button>
    </div>

    <!-- COLORS -->
    <div v-if="activeGroup === 'colors'">
      <div v-for="palette in colorPalettes" :key="palette.name" class="dt__palette">
        <div class="dt__palette-header">
          <h2 class="dt__palette-name">{{ palette.name }}</h2>
          <p class="dt__palette-desc">{{ palette.desc }}</p>
        </div>

        <div class="dt__swatches">
          <div
            v-for="color in palette.colors"
            :key="color.token"
            :style="{ background: color.hex }"
            class="dt__swatch"
            @click="copyToken(color.token)"
          >
            <div :class="['dt__swatch-label', color.textLight ? 'dt__swatch-label--light' : '']">
              <span class="dt__swatch-name">{{ color.label }}</span>
              <span class="dt__swatch-hex">{{ color.hex }}</span>
              <span v-if="copiedToken === color.token" class="dt__swatch-copied">✓</span>
            </div>
          </div>
        </div>

        <div class="dt__token-list">
          <div
            v-for="color in palette.colors"
            :key="color.token + '-row'"
            class="dt__token-row"
            @click="copyToken(color.token)"
          >
            <div :style="{ background: color.hex }" class="dt__token-dot" />
            <code class="dt__token-name">{{ color.token }}</code>
            <span class="dt__token-value">{{ color.hex }}</span>
            <span class="dt__token-copy">
              {{ copiedToken === color.token ? '✓' : 'copy' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- TYPOGRAPHY -->
    <div v-if="activeGroup === 'typography'">
      <div v-for="group in typographyTokens" :key="group.group" class="dt__typo-group">
        <h2 class="dt__palette-name">{{ group.group }}</h2>

        <div class="dt__typo-list">
          <div v-for="item in group.items" :key="item.token" class="dt__typo-item">
            <div
              :style="{
                fontSize: item.size || 'inherit',
                fontWeight: item.weight || 'inherit',
                fontFamily: item.family || 'inherit',
              }"
              class="dt__typo-sample"
            >
              {{ item.sample }}
            </div>
            <div class="dt__typo-meta">
              <code class="dt__token-name" @click="copyToken(item.token)">{{ item.token }}</code>
              <span class="dt__token-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SPACING -->
    <div v-if="activeGroup === 'spacing'">
      <h2 class="dt__palette-name" style="margin-bottom: 20px">Відступи та розміри</h2>

      <div class="dt__spacing-list">
        <div v-for="item in spacingTokens" :key="item.token" class="dt__spacing-item">
          <div class="dt__spacing-bar-wrap">
            <div :style="{ width: item.px ? Math.min(item.px * 6, 120) + 'px' : '80px' }" class="dt__spacing-bar" />
          </div>
          <code class="dt__token-name" style="cursor: pointer" @click="copyToken(item.token)">{{ item.token }}</code>
          <span class="dt__spacing-value">{{ item.value }}</span>
          <span class="dt__spacing-usage">{{ item.usage }}</span>
        </div>
      </div>
    </div>

    <!-- TOKEN TABLE -->
    <div v-if="activeGroup === 'tokens'">
      <div class="dt__override-tip">
        <span>💡</span>
        <div>
          <strong>Як перевизначити токени</strong><br />
          Додайте у ваш глобальний CSS файл перевизначення для <code>:root</code>. Воно буде мати вищий пріоритет ніж
          токени бібліотеки.
          <pre class="dt__override-example">
:root {
  --color-primary-main: #2563eb;   /* синій замість дефолтного */
  --vt-button-font-size: 15px;     /* більший шрифт кнопок */
}</pre
          >
        </div>
      </div>

      <div v-for="comp in componentTokens" :key="comp.component" class="dt__comp-tokens">
        <h3 class="dt__comp-tokens-title">{{ comp.component }}</h3>
        <div class="dt__token-list">
          <div v-for="token in comp.tokens" :key="token" class="dt__token-row" @click="copyToken(token)">
            <code class="dt__token-name">{{ token }}</code>
            <span class="dt__token-copy">
              {{ copiedToken === token ? '✓ скопійовано' : 'copy' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .dt {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .dt__header {
    margin-bottom: 36px;
  }

  .dt__header-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    background: var(--color-primary-light, #e6eef1);
    color: var(--color-primary-main, #00475a);
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .dt__title {
    font-size: 2rem;
    font-weight: 700;
    color: #111;
    margin: 0 0 10px;
  }

  .dt__subtitle {
    font-size: 15px;
    color: #555;
    line-height: 1.7;
    margin: 0;
    max-width: 620px;
  }

  .dt__subtitle code {
    background: #f3f4f6;
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 13px;
  }

  /* Tabs */
  .dt__tabs {
    display: flex;
    gap: 2px;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 32px;
  }

  .dt__tab {
    padding: 9px 18px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    color: #888;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition:
      color 0.15s,
      border-color 0.15s;
  }

  .dt__tab.is-active {
    color: var(--color-primary-main, #00475a);
    border-bottom-color: var(--color-primary-main, #00475a);
  }

  /* Palette */
  .dt__palette {
    margin-bottom: 44px;
  }

  .dt__palette-header {
    margin-bottom: 14px;
  }

  .dt__palette-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #222;
    margin: 0 0 4px;
  }

  .dt__palette-desc {
    font-size: 13px;
    color: #777;
    margin: 0;
  }

  /* Swatches */
  .dt__swatches {
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    height: 88px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  .dt__swatch {
    flex: 1;
    cursor: pointer;
    display: flex;
    align-items: flex-end;
    padding: 8px;
    transition: flex 0.2s;
    position: relative;
  }

  .dt__swatch:hover {
    flex: 1.5;
  }

  .dt__swatch-label {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .dt__swatch-name {
    font-size: 10px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.7);
    white-space: nowrap;
  }

  .dt__swatch-hex {
    font-size: 9px;
    color: rgba(0, 0, 0, 0.5);
    font-family: monospace;
  }

  .dt__swatch-label--light .dt__swatch-name {
    color: rgba(255, 255, 255, 0.9);
  }

  .dt__swatch-label--light .dt__swatch-hex {
    color: rgba(255, 255, 255, 0.6);
  }

  .dt__swatch-copied {
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: 12px;
    color: #fff;
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 5px;
    border-radius: 4px;
  }

  /* Token row */
  .dt__token-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .dt__token-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 12px;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.1s;
    font-size: 13px;
  }

  .dt__token-row:hover {
    background: #f9fafb;
  }

  .dt__token-dot {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    flex-shrink: 0;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .dt__token-name {
    flex: 1;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px;
    color: var(--color-primary-main, #00475a);
    cursor: pointer;
  }

  .dt__token-value {
    color: #888;
    font-size: 12px;
    font-family: monospace;
  }

  .dt__token-copy {
    font-size: 11px;
    color: #bbb;
    min-width: 60px;
    text-align: right;
  }

  /* Typography */
  .dt__typo-group {
    margin-bottom: 36px;
  }

  .dt__typo-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .dt__typo-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 14px 16px;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
  }

  .dt__typo-sample {
    flex: 1;
    color: #222;
  }

  .dt__typo-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
    flex-shrink: 0;
  }

  /* Spacing */
  .dt__spacing-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .dt__spacing-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 14px;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    font-size: 13px;
  }

  .dt__spacing-bar-wrap {
    width: 130px;
    flex-shrink: 0;
  }

  .dt__spacing-bar {
    height: 10px;
    background: var(--color-primary-light, #e6eef1);
    border-right: 2px solid var(--color-primary-main, #00475a);
    border-radius: 2px;
    min-width: 6px;
  }

  .dt__spacing-value {
    font-family: monospace;
    color: #444;
    font-weight: 500;
    min-width: 80px;
    flex-shrink: 0;
  }

  .dt__spacing-usage {
    color: #888;
    font-size: 12.5px;
  }

  /* Override tip */
  .dt__override-tip {
    display: flex;
    gap: 14px;
    padding: 16px 20px;
    background: var(--color-yellow-bg, #fff9ec);
    border: 1px solid var(--color-yellow-border, #ffecc6);
    border-radius: 10px;
    margin-bottom: 32px;
    font-size: 14px;
    color: #333;
    line-height: 1.6;
  }

  .dt__override-tip > span {
    font-size: 20px;
    flex-shrink: 0;
  }

  .dt__override-example {
    margin: 10px 0 0;
    padding: 12px 16px;
    background: #1a1f2e;
    border-radius: 8px;
    color: #c9d1d9;
    font-size: 12.5px;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1.7;
  }

  /* Component tokens */
  .dt__comp-tokens {
    margin-bottom: 24px;
  }

  .dt__comp-tokens-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px;
    font-family: 'JetBrains Mono', monospace;
  }
</style>
