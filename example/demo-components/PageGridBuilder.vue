<script setup>
  import { computed, ref } from 'vue';

  defineOptions({ name: 'PageGridBuilder' });

  const MAX_COLS = 12;
  const MAX_ROW_SPAN = 6;

  // ── Стан конструктора ────────────────────────────────────────────────────────

  const cols = ref(3);
  const rowsMode = ref('equal'); // equal | head | foot | auto
  const gap = ref('base'); // none | sm | base | lg
  const responsive = ref(false);

  let nextId = 1;
  const makeBlock = (span = 1, rowSpan = 1) => ({ id: nextId++, span, rowSpan });

  const blocks = ref([makeBlock(), makeBlock(), makeBlock()]);

  // ── Пресети ──────────────────────────────────────────────────────────────────

  const presets = [
    {
      key: 'three',
      label: 'Три в ряд',
      cols: 3,
      rows: 'equal',
      blocks: [[1], [1], [1]],
    },
    {
      key: 'head-two',
      label: 'Тонка зверху + дві по половині',
      cols: 2,
      rows: 'head',
      blocks: [[2], [1], [1]],
    },
    {
      key: 'two-by-two',
      label: 'Сітка 2×2',
      cols: 2,
      rows: 'equal',
      blocks: [[1], [1], [1], [1]],
    },
    {
      key: 'big-left',
      label: 'Велика зліва + дві справа',
      cols: 3,
      rows: 'equal',
      blocks: [[2, 2], [1], [1]],
    },
    {
      key: 'sidebar',
      label: 'Сайдбар + контент',
      cols: 4,
      rows: 'equal',
      blocks: [[1], [3]],
    },
    {
      key: 'dashboard',
      label: 'Дашборд',
      cols: 4,
      rows: 'head',
      blocks: [[4], [1], [1], [1], [1], [2], [2]],
    },
  ];

  const activePreset = ref('three');

  function applyPreset(preset) {
    activePreset.value = preset.key;
    cols.value = preset.cols;
    rowsMode.value = preset.rows;
    blocks.value = preset.blocks.map(([span, rowSpan = 1]) => makeBlock(span, rowSpan));
  }

  const resetPreset = () => (activePreset.value = '');

  // ── Керування колонками та блоками ───────────────────────────────────────────

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function setCols(value) {
    cols.value = clamp(value, 1, MAX_COLS);
    resetPreset();
  }

  const effectiveSpan = (block) => Math.min(block.span, cols.value);

  function changeSpan(block, delta) {
    block.span = clamp(effectiveSpan(block) + delta, 1, cols.value);
    resetPreset();
  }

  function changeRowSpan(block, delta) {
    block.rowSpan = clamp(block.rowSpan + delta, 1, MAX_ROW_SPAN);
    resetPreset();
  }

  function addBlock() {
    blocks.value.push(makeBlock());
    resetPreset();
  }

  function removeBlock(block) {
    blocks.value = blocks.value.filter((b) => b.id !== block.id);
    resetPreset();
  }

  function setRowsMode(mode) {
    rowsMode.value = mode;
    resetPreset();
  }

  // ── Класи ────────────────────────────────────────────────────────────────────

  const gridClasses = computed(() => {
    const classes = ['vt-card-grid', `vt-card-grid--cols-${cols.value}`];

    if (rowsMode.value !== 'equal') classes.push(`vt-card-grid--rows-${rowsMode.value}`);
    if (gap.value !== 'base') classes.push(`vt-card-grid--gap-${gap.value}`);
    if (responsive.value) classes.push('vt-card-grid--responsive');

    return classes;
  });

  function blockClasses(block) {
    const classes = ['vt-page__card'];
    const span = effectiveSpan(block);

    if (span === cols.value && cols.value > 1) classes.push('vt-card-grid__span-full');
    else if (span > 1) classes.push(`vt-card-grid__span-${span}`);

    if (block.rowSpan > 1) classes.push(`vt-card-grid__row-span-${block.rowSpan}`);

    return classes;
  }

  // ── Згенерована розмітка ─────────────────────────────────────────────────────

  const markup = computed(() => {
    const cards = blocks.value
      .map(
        (block, i) =>
          `    <div class="${blockClasses(block).join(' ')}">\n` +
          `      <!-- Блок ${i + 1} -->\n` +
          `    </div>`,
      )
      .join('\n');

    return (
      `<div class="vt-page">\n` +
      `  <div class="${gridClasses.value.join(' ')}">\n` +
      `${cards}\n` +
      `  </div>\n` +
      `</div>`
    );
  });

  const copied = ref('');

  async function copy(text, key) {
    await navigator.clipboard.writeText(text);
    copied.value = key;
    setTimeout(() => {
      if (copied.value === key) copied.value = '';
    }, 1200);
  }

  // ── Довідка по класах ────────────────────────────────────────────────────────

  const reference = [
    { selector: '.vt-card-grid', desc: 'Контейнер сітки. Без модифікаторів — всі картки в один рядок однакової ширини, займає залишок висоти .vt-page.' },
    { selector: '.vt-card-grid--cols-{1..12}', desc: 'N однакових колонок, картки переносяться на нові рядки.' },
    { selector: '.vt-card-grid--rows-head', desc: 'Перший рядок по висоті контенту (тонкий), решта рядків ділять залишок порівну.' },
    { selector: '.vt-card-grid--rows-foot', desc: 'Другий рядок по висоті контенту — тонка панель під основним контентом.' },
    { selector: '.vt-card-grid--rows-auto', desc: 'Всі рядки по контенту, сітка скролиться вертикально.' },
    { selector: '.vt-card-grid--gap-{none|sm|lg}', desc: 'Відступ між картками (за замовчуванням --vt-gap-base).' },
    { selector: '.vt-card-grid--responsive', desc: 'До 768px — все в одну колонку зі скролом.' },
    { selector: '.vt-card-grid__span-{1..12}', desc: 'Картка займає N колонок.' },
    { selector: '.vt-card-grid__span-full', desc: 'Картка на всю ширину сітки.' },
    { selector: '.vt-card-grid__row-span-{1..6}', desc: 'Картка займає N рядків.' },
    { selector: '--vt-grid-cols / --vt-grid-rows', desc: 'Свої треки інлайном, напр. style="--vt-grid-cols: 300px minmax(0, 1fr)".' },
  ];

  const rowsModes = [
    { key: 'equal', label: 'рівні' },
    { key: 'head', label: '--rows-head' },
    { key: 'foot', label: '--rows-foot' },
    { key: 'auto', label: '--rows-auto' },
  ];

  const gaps = ['none', 'sm', 'base', 'lg'];
</script>

<template>
  <div class="gb">
    <div class="gb__intro-badge">Layout · Grid</div>
    <h1 class="gb__title">Сітка карток</h1>
    <p class="gb__subtitle">
      <code class="gb__inline-code">.vt-card-grid</code>
      розкладає кілька
      <code class="gb__inline-code">.vt-page__card</code>
      на сторінці. Оберіть пресет або накидайте свою сітку — розмітка нижче генерується автоматично.
    </p>

    <!-- Пресети -->
    <section class="gb__section">
      <h2 class="gb__section-title">Пресети</h2>
      <div class="gb__toggles">
        <button
          v-for="p in presets"
          :key="p.key"
          :class="['gb__chip', activePreset === p.key && 'is-on']"
          @click="applyPreset(p)"
        >
          {{ p.label }}
        </button>
      </div>
    </section>

    <!-- Конструктор -->
    <section class="gb__section">
      <h2 class="gb__section-title">Конструктор</h2>
      <p class="gb__section-desc">
        На кожній картці: <b>↔</b> — скільки колонок займає, <b>↕</b> — скільки рядків. Розміри картки змінюються
        одразу в превʼю.
      </p>

      <div class="gb__toggles">
        <span class="gb__toggles-label">колонки:</span>
        <div class="gb__stepper">
          <button :disabled="cols <= 1" @click="setCols(cols - 1)">−</button>
          <span>{{ cols }}</span>
          <button :disabled="cols >= MAX_COLS" @click="setCols(cols + 1)">+</button>
        </div>

        <span class="gb__toggles-sep" />
        <span class="gb__toggles-label">рядки:</span>
        <button
          v-for="m in rowsModes"
          :key="m.key"
          :class="['gb__chip', rowsMode === m.key && 'is-on']"
          @click="setRowsMode(m.key)"
        >
          {{ m.label }}
        </button>
      </div>

      <div class="gb__toggles">
        <span class="gb__toggles-label">gap:</span>
        <button
          v-for="g in gaps"
          :key="g"
          :class="['gb__chip', gap === g && 'is-on']"
          @click="gap = g"
        >
          {{ g }}
        </button>

        <span class="gb__toggles-sep" />
        <button :class="['gb__chip', responsive && 'is-on']" @click="responsive = !responsive">
          --responsive
        </button>

        <button class="gb__chip gb__chip--accent" @click="addBlock">+ блок</button>
      </div>

      <div class="gb__stage">
        <div class="vt-page">
          <div :class="gridClasses">
            <div v-for="(block, i) in blocks" :key="block.id" :class="blockClasses(block)">
              <div class="vt-page__card-form-header">
                <span>Блок {{ i + 1 }}</span>

                <div class="vt-page__card-form-header-actions gb__block-actions">
                  <div class="gb__stepper gb__stepper--sm" title="Колонки">
                    <button :disabled="effectiveSpan(block) <= 1" @click="changeSpan(block, -1)">−</button>
                    <span>↔ {{ effectiveSpan(block) }}</span>
                    <button :disabled="effectiveSpan(block) >= cols" @click="changeSpan(block, 1)">+</button>
                  </div>

                  <div class="gb__stepper gb__stepper--sm" title="Рядки">
                    <button :disabled="block.rowSpan <= 1" @click="changeRowSpan(block, -1)">−</button>
                    <span>↕ {{ block.rowSpan }}</span>
                    <button :disabled="block.rowSpan >= MAX_ROW_SPAN" @click="changeRowSpan(block, 1)">+</button>
                  </div>

                  <button class="gb__remove" title="Видалити" @click="removeBlock(block)">×</button>
                </div>
              </div>

              <div class="gb__block-body">
                <code
                  v-for="cls in blockClasses(block).slice(1)"
                  :key="cls"
                  class="gb__inline-code"
                >
                  .{{ cls }}
                </code>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!blocks.length" class="gb__empty">
          Немає блоків —
          <button class="gb__chip gb__chip--accent" @click="addBlock">+ додати</button>
        </div>
      </div>

      <div class="gb__code">
        <div class="gb__code-head">
          <span>Розмітка</span>
          <button class="gb__chip" @click="copy(markup, 'markup')">
            {{ copied === 'markup' ? '✓ скопійовано' : 'копіювати' }}
          </button>
        </div>
        <pre class="gb__markup">{{ markup }}</pre>
      </div>
    </section>

    <!-- Довідка -->
    <section class="gb__section">
      <h2 class="gb__section-title">Класи</h2>
      <div class="gb__ref">
        <div
          v-for="r in reference"
          :key="r.selector"
          class="gb__ref-row"
          @click="copy(r.selector, r.selector)"
        >
          <code>{{ r.selector }}</code>
          <span>{{ r.desc }}</span>
          <em>{{ copied === r.selector ? '✓' : 'copy' }}</em>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .gb {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .gb__intro-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    background: var(--color-primary-light, #e6eef1);
    color: var(--color-primary-main, #00475a);
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .gb__title {
    font-size: 2rem;
    font-weight: 700;
    color: #111;
    margin: 0 0 10px;
  }

  .gb__subtitle {
    font-size: 15px;
    color: #555;
    line-height: 1.7;
    margin: 0 0 16px;
    max-width: 640px;
  }

  .gb__inline-code {
    background: #f3f4f6;
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    color: var(--color-primary-main, #00475a);
  }

  .gb__section {
    margin: 32px 0;
  }

  .gb__section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #222;
    margin: 0 0 4px;
  }

  .gb__section-desc {
    font-size: 13px;
    color: #777;
    margin: 0 0 12px;
  }

  /* Toggles */

  .gb__toggles {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .gb__toggles-label {
    font-size: 11px;
    color: #999;
    margin-right: 2px;
  }

  .gb__toggles-sep {
    width: 1px;
    height: 16px;
    background: #e0e0e0;
    margin: 0 4px;
  }

  .gb__chip {
    font-size: 11.5px;
    font-family: 'JetBrains Mono', monospace;
    padding: 5px 10px;
    border: 1px solid #e0e0e0;
    background: #fff;
    border-radius: 20px;
    cursor: pointer;
    color: #666;
    transition: all 0.12s;
  }

  .gb__chip:hover {
    border-color: var(--color-primary-border, #ccdade);
  }

  .gb__chip.is-on {
    background: var(--color-primary-main, #00475a);
    color: #fff;
    border-color: var(--color-primary-main, #00475a);
  }

  .gb__chip--accent {
    margin-left: auto;
    color: var(--color-primary-main, #00475a);
    border-color: var(--color-primary-border, #ccdade);
  }

  /* Stepper */

  .gb__stepper {
    display: inline-flex;
    align-items: center;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    background: #fff;
    overflow: hidden;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #444;
  }

  .gb__stepper > span {
    min-width: 28px;
    text-align: center;
    padding: 0 4px;
  }

  .gb__stepper button {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 4px 9px;
    color: var(--color-primary-main, #00475a);
    font-size: 13px;
    line-height: 1;
  }

  .gb__stepper button:hover:not(:disabled) {
    background: var(--color-primary-bg, #f2f6f6);
  }

  .gb__stepper button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }

  .gb__stepper--sm {
    font-size: 10.5px;
  }

  .gb__stepper--sm button {
    padding: 2px 6px;
  }

  /* Stage */

  .gb__stage {
    position: relative;
    height: 460px;
    margin-top: 12px;
    border: 1px dashed #d8dce0;
    border-radius: 12px;
    padding: 14px;
    background: var(--color-gray-6, #f0f2f5);
    box-sizing: border-box;
  }

  .gb__stage .vt-page__card {
    border: 1px solid var(--color-primary-border, #ccdade);
    box-sizing: border-box;
  }

  .gb__block-actions {
    gap: 4px;
  }

  .gb__block-body {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 10px 16px;
    overflow: hidden;
  }

  .gb__remove {
    border: none;
    background: transparent;
    cursor: pointer;
    color: #999;
    font-size: 16px;
    line-height: 1;
    padding: 0 4px;
  }

  .gb__remove:hover {
    color: var(--color-danger-main, #e5484d);
  }

  .gb__empty {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
    color: #888;
  }

  .gb__empty .gb__chip--accent {
    margin-left: 0;
  }

  /* Code */

  .gb__code {
    margin-top: 12px;
  }

  .gb__code-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 600;
    color: #777;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .gb__markup {
    margin: 0;
    padding: 14px 16px;
    background: #1a1f2e;
    color: #c9d1d9;
    border-radius: 8px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1.7;
    overflow-x: auto;
  }

  /* Reference */

  .gb__ref {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-top: 10px;
  }

  .gb__ref-row {
    display: grid;
    grid-template-columns: 260px 1fr auto;
    align-items: baseline;
    gap: 12px;
    padding: 7px 9px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12.5px;
    color: #555;
  }

  .gb__ref-row:hover {
    background: #f5f8f8;
    border-color: var(--color-primary-border, #ccdade);
  }

  .gb__ref-row code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--color-primary-main, #00475a);
  }

  .gb__ref-row em {
    font-style: normal;
    font-size: 11px;
    color: #aaa;
  }

  @media (max-width: 640px) {
    .gb__ref-row {
      grid-template-columns: 1fr auto;
    }

    .gb__ref-row span {
      grid-column: 1 / -1;
      grid-row: 2;
    }
  }
</style>
