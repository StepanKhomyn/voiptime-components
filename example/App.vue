<script setup>
  import { ref } from 'vue';
  import ButtonTest from './ButtonTest.vue';

  const activeSlot = ref(null);

  const sections = [
    { id: 1, name: 'Кнопки', icon: '🔘' },
    { id: 2, name: 'Таблиці', icon: '📋' },
    { id: 3, name: 'Чекбокси', icon: '☑️' },
    { id: 4, name: 'Іконки', icon: '🎨' },
    { id: 5, name: 'Модальні вікна', icon: '🪟' },
    { id: 6, name: 'Пагінація', icon: '📄' },
    { id: 7, name: 'Директиви', icon: '⚡' },
  ];
</script>

<template>
  <div class="container">
    <header class="header">
      <h1 class="title">Vue Components Documentation</h1>
      <p class="subtitle">Документація кастомних компонентів Vue 3.5</p>
    </header>

    <div class="section-list">
      <div
        v-for="section in sections"
        :key="section.id"
        @click="() => (activeSlot = section.id)"
        :class="['section-item', activeSlot === section.id ? 'active' : '']"
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
      <ButtonTest v-if="activeSlot === 1" />
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
