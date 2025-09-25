<template>
  <div class="showcase">
    <!-- Підключення -->
    <section class="section">
      <h2>Підключення до проекту</h2>
      <div class="card">
        <h3>1. Реєстрація директиви глобально</h3>
        <pre class="code">
          // main.ts
          import { createApp } from 'vue';
          import { tooltipDirective } from '@/directives/loader';

          const app = createApp(App);
          app.directive('loader', loaderDirective);
          app.mount('#app');
        </pre>
      </div>
    </section>

    <!-- Демо -->
    <section class="section">
      <h2>Демонстрація</h2>

      <!-- Базові позиції -->
      <div class="demo-category">
        <div class="demo-grid">
          <div class="demo-item" v-loader="true">
            <h4>Контент</h4>
            <h4>Контент</h4>
            <h4>Контент</h4>
            <h4>Контент</h4>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  // Реактивні дані для демонстрації
  const dynamicTooltip = ref('Початковий текст');
  const showConditionalTooltip = ref(true);

  // Список динамічних підказок
  const tooltipTexts = [
    'Початковий текст',
    'Оновлений tooltip',
    'Нова підказка',
    'Ще одна варіація',
    'Фінальний текст',
  ];

  let tooltipIndex = 0;

  // Методи
  const updateDynamicTooltip = () => {
    tooltipIndex = (tooltipIndex + 1) % tooltipTexts.length;
    dynamicTooltip.value = tooltipTexts[tooltipIndex];
  };

  const resetDemo = () => {
    dynamicTooltip.value = 'Початковий текст';
    showConditionalTooltip.value = true;
    tooltipIndex = 0;
  };
</script>

<style scoped>
  .showcase {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }

  .section {
    margin-bottom: 3rem;
  }

  .section h2 {
    color: #2c3e50;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
  }

  .card {
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .card h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .demo-category {
    margin-bottom: 2rem;
  }

  .demo-category h3 {
    color: #2c3e50;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e1e8ed;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .demo-item {
    background: #f8f9fa;
    border: 1px solid #e1e8ed;
    border-radius: 6px;
    padding: 1rem;
    text-align: center;
    transition: all 0.2s;
  }

  .demo-item:hover {
    border-color: #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
  }

  .demo-item h4 {
    color: #495057;
    margin-bottom: 0.8rem;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .demo-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }

  .demo-button:hover {
    background: #0056b3;
  }

  .demo-text {
    display: inline-block;
    padding: 0.5rem;
    background: #e9ecef;
    border-radius: 4px;
    cursor: help;
    color: #495057;
  }

  .demo-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .demo-checkbox input {
    margin: 0;
  }

  .table-demo {
    margin-top: 1rem;
  }

  .table-description {
    color: #6c757d;
    font-style: italic;
    margin-bottom: 1rem;
  }

  .demo-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #e1e8ed;
  }

  .demo-table th,
  .demo-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e1e8ed;
    position: relative;
  }

  .demo-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }

  .demo-table td {
    cursor: help;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .form-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .form-group label {
    font-weight: 500;
    color: #495057;
    cursor: help;
  }

  .form-group input,
  .form-group select {
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  .table th,
  .table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e1e8ed;
    vertical-align: top;
  }

  .table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }

  .table code {
    background: #f1f3f4;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    color: #d63384;
  }

  .code {
    display: block;
    background: #2d3748;
    color: #e2e8f0;
    padding: 1.5rem;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    overflow-x: auto;
    margin: 1rem 0;
    white-space: pre;
  }

  .feature-list {
    margin: 0;
    padding-left: 1.5rem;
  }

  .feature-list li {
    margin-bottom: 0.5rem;
    color: #495057;
    line-height: 1.5;
  }

  .feature-list code {
    background: #f1f3f4;
    padding: 0.1rem 0.3rem;
    border-radius: 2px;
    font-family: monospace;
    font-size: 0.9rem;
  }

  .control-panel {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .control-group {
    margin-bottom: 1rem;
  }

  .control-group:last-child {
    margin-bottom: 0;
  }

  .control-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #495057;
  }

  .control-group input[type='text'] {
    width: 100%;
    max-width: 300px;
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
  }

  .control-group input[type='text']:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .control-group input[type='checkbox'] {
    margin-right: 0.5rem;
  }

  .control-button {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }

  .control-button:hover {
    background: #218838;
  }

  @media (max-width: 768px) {
    .showcase {
      padding: 1rem;
    }

    .demo-grid {
      grid-template-columns: 1fr;
    }

    .form-demo {
      max-width: none;
    }

    .table th,
    .table td {
      padding: 0.5rem;
      font-size: 0.8rem;
    }

    .code {
      font-size: 0.8rem;
      padding: 1rem;
    }

    .control-group input[type='text'] {
      max-width: none;
    }
  }
</style>
