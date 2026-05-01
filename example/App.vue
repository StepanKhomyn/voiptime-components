<script setup>
  import { computed, ref } from 'vue';
  import pkg from '../package.json';
  import DemoButton from './DemoButton.vue';
  import DemoIcons from './DemoIcons.vue';
  import DemoModal from './DemoModal.vue';
  import DemoTooltip from './DemoTooltip.vue';
  import DemoPagination from './DemoPagination.vue';
  import DemoDropDown from './DemoDropDown.vue';
  import DemoTable from './DemoTable.vue';
  import DemoDatePicker from './DemoDatePicker.vue';
  import DemoInput from './DemoInput.vue';
  import DemoSelect from './DemoSelect.vue';
  import DemoRadioBox from './DemoRadioBox.vue';
  import DemoTimePicker from './DemoTimePicker.vue';
  import DemoCollapse from './DemoCollapse.vue';
  import DemoMessage from './DemoMessage.vue';
  import DemoTabs from './DemoTabs.vue';
  import DemoLoader from './DemoLoader.vue';
  import DemoValidationForm from './DemoValidationForm.vue';
  import DemoUpload from './DemoUpload.vue';
  import DemoSidebar from './DemoSidebar.vue';
  import DemoLogin from './DemoLogin.vue';
  import DemoSlider from './DemoSlider.vue';
  import DemoChart from './DemoChart.vue';
  import DemoCheckbox from './DemoCheckbox.vue';
  import DemoInstallation from './DemoInstallation.vue';
  import DemoDesignTokens from './DemoDesignTokens.vue';
  import DemoInfoBox from './DemoInfoBox.vue';
  import DemoTransferList from './DemoTransferList.vue';

  const searchQuery = ref('');

  const sections = [
    {
      group: 'Початок роботи',
      items: [
        {
          name: 'Встановлення',
          icon: '📦',
          tag: 'new',
          component: DemoInstallation,
        },
        {
          name: 'Дизайн токени',
          icon: '🎨',
          tag: 'new',
          component: DemoDesignTokens,
        },
      ],
    },

    {
      group: 'Форми та введення',
      items: [
        { name: 'Кнопки', icon: '🆎', component: DemoButton },
        { name: 'Інпут', icon: '📝', component: DemoInput },
        { name: 'Селект', icon: '⬇️', component: DemoSelect },
        { name: 'Чекбокси', icon: '☑️', component: DemoCheckbox },
        { name: 'Радіобокс', icon: '🔘', component: DemoRadioBox },
        { name: 'Валідація', icon: '✅', component: DemoValidationForm },
        { name: 'Slider', icon: '🎚', component: DemoSlider },
        { name: 'Transfer List', icon: '↔️', component: DemoTransferList },
      ],
    },

    {
      group: 'Дата та час',
      items: [
        { name: 'Дата пікер', icon: '📅', component: DemoDatePicker },
        { name: 'Тайм пікер', icon: '🕐', component: DemoTimePicker },
      ],
    },

    {
      group: 'Дані та відображення',
      items: [
        { name: 'Таблиці', icon: '📊', component: DemoTable },
        { name: 'VChart', icon: '📈', component: DemoChart },
        { name: 'Пагінація', icon: '📄', component: DemoPagination },
      ],
    },

    {
      group: 'Навігація та оверлеї',
      items: [
        { name: 'Модальні вікна', icon: '🪟', component: DemoModal },
        { name: 'Дропдавн', icon: '☰', component: DemoDropDown },
        { name: 'Тултіпи', icon: '💬', component: DemoTooltip },
        { name: 'Tabs', icon: '📑', component: DemoTabs },
        { name: 'Sidebar', icon: '◀', component: DemoSidebar },
      ],
    },

    {
      group: "Зворотній зв'язок",
      items: [
        { name: 'Message', icon: '💌', component: DemoMessage },
        { name: 'InfoBox', icon: '💌', component: DemoInfoBox },
        { name: 'Лоадер', icon: '⏳', component: DemoLoader },
        { name: 'Коллапс', icon: '🔽', component: DemoCollapse },
      ],
    },

    {
      group: 'Медіа та UI',
      items: [
        { name: 'Іконки', icon: '🎨', component: DemoIcons },
        { name: 'Upload', icon: '📤', component: DemoUpload },
        { name: 'Логін', icon: '🔐', component: DemoLogin },
      ],
    },
  ];

  const filteredSections = computed(() => {
    if (!searchQuery.value.trim()) return sections;

    const q = searchQuery.value.toLowerCase();

    return sections
      .map(group => ({
        ...group,
        items: group.items.filter(item => item.name.toLowerCase().includes(q)),
      }))
      .filter(group => group.items.length > 0);
  });

  const activeItem = ref(sections[0].items[0]);

  function selectSection(item) {
    activeItem.value = item;
    searchQuery.value = '';
  }
</script>

<template>
  <div class="docs-layout">
    <!-- Sidebar -->
    <aside class="docs-sidebar">
      <div class="docs-sidebar__brand">
        <div class="docs-sidebar__logo">
          <span class="docs-sidebar__logo-mark">VT</span>
        </div>
        <div>
          <div class="docs-sidebar__brand-name">VoIPTime UI</div>
          <div class="docs-sidebar__brand-version"> v{{ pkg.version }}</div>
        </div>
      </div>

      <div class="docs-sidebar__search">
        <span class="docs-sidebar__search-icon">🔍</span>
        <input
          v-model="searchQuery"
          class="docs-sidebar__search-input"
          placeholder="Пошук компонентів..."
          type="text"
        />
      </div>

      <nav class="docs-sidebar__nav">
        <template v-for="section in filteredSections" :key="section.group">
          <div class="docs-sidebar__group-label">{{ section.group }}</div>
          <button
            v-for="item in section.items"
            :key="item.name"
            :class="['docs-sidebar__nav-item', activeItem === item ? 'is-active' : '']"
            @click="selectSection(item)"
          >
            <span class="docs-sidebar__nav-icon">{{ item.icon }}</span>
            <span class="docs-sidebar__nav-label">{{ item.name }}</span>
            <span v-if="item.tag" class="docs-sidebar__nav-badge">{{ item.tag }}</span>
          </button>
        </template>

        <div v-if="filteredSections.length === 0" class="docs-sidebar__empty"> Нічого не знайдено</div>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="docs-main">
      <header class="docs-topbar">
        <div class="docs-topbar__breadcrumb">
          <span class="docs-topbar__breadcrumb-root">Документація</span>
          <span class="docs-topbar__breadcrumb-sep">›</span>
          <span class="docs-topbar__breadcrumb-current">{{ activeItem?.name ?? 'Головна' }}</span>
        </div>
        <div class="docs-topbar__actions">
          <a class="docs-topbar__link" href="https://npmjs.com/package/voiptime-components" target="_blank">NPM ↗</a>
        </div>
      </header>

      <main class="docs-content">
        <component :is="activeItem.component" />
      </main>
    </div>
  </div>
</template>

<style scoped>
  /* ── Layout ───────────────────────────────────── */
  .docs-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: #f6f8fa;
    font-family: var(--font-secondary, 'Roboto', sans-serif);
  }

  /* ── Sidebar ──────────────────────────────────── */
  .docs-sidebar {
    width: 260px;
    flex-shrink: 0;
    background: #fff;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .docs-sidebar__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 16px 16px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
  }

  .docs-sidebar__logo {
    width: 36px;
    height: 36px;
    background: var(--color-primary-main, #00475a);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .docs-sidebar__logo-mark {
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .docs-sidebar__brand-name {
    font-size: 15px;
    font-weight: 600;
    color: #111;
  }

  .docs-sidebar__brand-version {
    font-size: 11px;
    color: #999;
    margin-top: 1px;
  }

  .docs-sidebar__search {
    position: relative;
    padding: 12px 12px 8px;
    flex-shrink: 0;
  }

  .docs-sidebar__search-icon {
    position: absolute;
    left: 22px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    pointer-events: none;
  }

  .docs-sidebar__search-input {
    width: 100%;
    box-sizing: border-box;
    padding: 7px 10px 7px 30px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 13px;
    color: #333;
    background: #f9fafb;
    outline: none;
    transition: border-color 0.15s;
  }

  .docs-sidebar__search-input:focus {
    border-color: var(--color-primary-main, #00475a);
    background: #fff;
  }

  .docs-sidebar__nav {
    flex: 1;
    overflow-y: auto;
    padding: 4px 8px 16px;
  }

  .docs-sidebar__group-label {
    padding: 12px 8px 4px;
    font-size: 10.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #aab;
  }

  .docs-sidebar__nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 7px 10px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    font-size: 13.5px;
    color: #444;
    transition:
      background 0.12s,
      color 0.12s;
    margin-bottom: 1px;
  }

  .docs-sidebar__nav-item:hover {
    background: #f3f4f6;
    color: #111;
  }

  .docs-sidebar__nav-item.is-active {
    background: var(--color-primary-light, #e6eef1);
    color: var(--color-primary-main, #00475a);
    font-weight: 500;
  }

  .docs-sidebar__nav-icon {
    font-size: 14px;
    flex-shrink: 0;
  }

  .docs-sidebar__nav-label {
    flex: 1;
  }

  .docs-sidebar__nav-badge {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 10px;
    background: var(--color-primary-main, #00475a);
    color: #fff;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .docs-sidebar__empty {
    padding: 16px 10px;
    font-size: 13px;
    color: #aaa;
    text-align: center;
  }

  /* ── Main ─────────────────────────────────────── */
  .docs-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .docs-topbar {
    height: 52px;
    flex-shrink: 0;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
  }

  .docs-topbar__breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
  }

  .docs-topbar__breadcrumb-root {
    color: #aaa;
  }

  .docs-topbar__breadcrumb-sep {
    color: #ddd;
  }

  .docs-topbar__breadcrumb-current {
    color: #333;
    font-weight: 500;
  }

  .docs-topbar__actions {
    display: flex;
    gap: 16px;
  }

  .docs-topbar__link {
    font-size: 13px;
    color: var(--color-primary-main, #00475a);
    text-decoration: none;
    font-weight: 500;
    opacity: 0.8;
    transition: opacity 0.15s;
  }

  .docs-topbar__link:hover {
    opacity: 1;
  }

  .docs-content {
    flex: 1;
    overflow-y: auto;
    padding: 32px 40px;
  }

  /* ── Scrollbar ────────────────────────────────── */
  .docs-sidebar__nav::-webkit-scrollbar,
  .docs-content::-webkit-scrollbar {
    width: 5px;
  }

  .docs-sidebar__nav::-webkit-scrollbar-track,
  .docs-content::-webkit-scrollbar-track {
    background: var(--color-scrollbar-track, #e6eef1);
  }

  .docs-sidebar__nav::-webkit-scrollbar-thumb,
  .docs-content::-webkit-scrollbar-thumb {
    background: var(--color-scrollbar-thumb, #cfdfe4);
    border-radius: 4px;
  }
</style>
