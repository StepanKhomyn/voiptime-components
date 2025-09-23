<script setup>
  import { ref } from 'vue';
  import DemoButton from './DemoButton.vue';
  import DemoIcons from './DemoIcons.vue';
  import DemoCheckbox from './DemoCheckbox.vue';
  import DemoModal from './DemoModal.vue';
  import DemoTooltip from './DemoTooltip.vue';
  import DemoPagination from './DemoPagination.vue';
  import DemoDropDown from './DemoDropDown.vue';
  import DemoTable from './DemoTable.vue';
  import DemoDatePicker from './DemoDatePicker.vue';
  import DemoInput from './DemoInput.vue';
  import DemoSelect from './DemoSelect.vue';
  import DemoRadioBox from './DemoRadioBox.vue';
  import DemoForms from './DemoForms.vue';
  import DemoTimePicker from './DemoTimePicker.vue';
  import DemoCollapse from './DemoCollapse.vue';
  import DemoMessage from './DemoMessage.vue';
  import DemoTabs from './DemoTabs.vue';
  import DemoTable2 from './DemoTable2.vue';

  const activeSlot = ref(null);

  const sections = [
    { id: 1, name: 'Кнопки', icon: '🆎' },
    { id: 2, name: 'Таблиці', icon: '📊' },
    { id: 3, name: 'Чекбокси', icon: '☑️' },
    { id: 13, name: 'Радіобокс', icon: '🔘' },
    { id: 4, name: 'Іконки', icon: '🎨' },
    { id: 5, name: 'Модальні вікна', icon: '🪟' },
    { id: 6, name: 'Пагінація', icon: '📄' },
    { id: 7, name: 'Тултіпи', icon: '💬' },
    { id: 8, name: 'Дропдавн', icon: '☰' },
    { id: 9, name: 'Дата пікер', icon: '📅' },
    { id: 15, name: 'Тайм пікер', icon: '🕐' },
    { id: 10, name: 'Інпут', icon: '📝' },
    { id: 11, name: 'Селект', icon: '⬇️' },
    { id: 14, name: 'Форми', icon: '📋' },
    { id: 16, name: 'Коллапс', icon: '⬇️' },
    { id: 17, name: 'Message', icon: '⬇📋' },
    { id: 18, name: 'Tabs', icon: '⬇📋2' },
    { id: 19, name: 'Tab3s', icon: '⬇📋2' },
  ];
</script>

<template>
  <div class="container">
    <header class="header">
      <h1 class="title">VoIPTime Components Documentation</h1>
      <p class="subtitle">Документація кастомних компонентів Vue 3.5!</p>
      <h3> Встановлення через NPM: <code>npm install voiptime-components</code></h3>
      <h3>Встановлення через CDN:</h3>
      <pre><code>&lt;script src="https://unpkg.com/voiptime-components/dist/index.umd.js"&gt;&lt;/script&gt;</code></pre>
      <h3>Для роботи потрібно також імпортувати Vue з мінімальною версією 3.5</h3>
    </header>

    <div class="section-list">
      <div
        v-for="section in sections"
        :key="section.id"
        :class="['section-item', activeSlot === section.id ? 'active' : '']"
        @click="() => (activeSlot = section.id)"
      >
        <div class="section-icon">{{ section.icon }}</div>
        <div class="section-name">{{ section.name }}</div>
      </div>
    </div>
    <button v-if="activeSlot" class="back-button" @click="activeSlot = null"> ← Повернутися до розділів</button>

    <div style="margin-top: 20px">
      <div v-if="!activeSlot" class="empty-state">
        <p>Оберіть розділ для перегляду документації</p>
      </div>

      <!-- Компоненти -->
      <DemoButton v-if="activeSlot === 1" />
      <DemoTable v-if="activeSlot === 2" />
      <DemoCheckbox v-if="activeSlot === 3" />
      <DemoIcons v-if="activeSlot === 4" />
      <DemoModal v-if="activeSlot === 5" />
      <DemoPagination v-if="activeSlot === 6" />
      <DemoTooltip v-if="activeSlot === 7" />
      <DemoDropDown v-if="activeSlot === 8" />
      <DemoDatePicker v-if="activeSlot === 9" />
      <DemoTimePicker v-if="activeSlot === 15" />
      <DemoInput v-if="activeSlot === 10" />
      <DemoSelect v-if="activeSlot === 11" />
      <DemoRadioBox v-if="activeSlot === 13" />
      <DemoForms v-if="activeSlot === 14" />
      <DemoCollapse v-if="activeSlot === 16" />
      <DemoMessage v-if="activeSlot === 17" />
      <DemoTabs v-if="activeSlot === 18" />
      <DemoTable2 v-if="activeSlot === 19" />
      <!-- і т.д. -->
    </div>
  </div>
</template>

<style scoped>
  .header {
    background-color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid #e5e7eb;
    padding: 1.5rem 1rem;
  }

  .title {
    font-size: 2rem;
    font-weight: bold;
    color: #111827;
  }

  .subtitle {
    color: #6b7280;
    margin-top: 0.5rem;
  }

  .section-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin: 2rem;
  }

  .section-item {
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    border: 2px solid #e5e7eb;
    transition: all 0.2s ease;
  }

  .section-item:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .section-item.active {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }

  .section-icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .section-name {
    font-weight: 500;
    color: #111827;
  }

  .back-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #e5e7eb;
    color: #374151;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .back-button:hover {
    background-color: #d1d5db;
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }
</style>
