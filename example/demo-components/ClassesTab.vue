<script setup>
  import { ref } from 'vue';
  import PageLayoutAnatomy from './PageLayoutAnatomy.vue';

  defineOptions({ name: 'ClassesTab' });

  const activeSub = ref('layout');

  const subTabs = [
    { key: 'layout', label: 'Лейаут', ready: true },
  ];

  function selectSub(tab) {
    if (!tab.ready) return;
    activeSub.value = tab.key;
  }
</script>

<template>
  <div class="cls">
    <div class="cls__subtabs">
      <button
        v-for="t in subTabs"
        :key="t.key"
        :class="['cls__subtab', activeSub === t.key && 'is-active', !t.ready && 'is-disabled']"
        :disabled="!t.ready"
        @click="selectSub(t)"
      >
        {{ t.label }}
        <span v-if="!t.ready" class="cls__soon">скоро</span>
      </button>
    </div>

    <!-- Кожна анатомія — окремий компонент, підключений сюди за ключем -->
    <PageLayoutAnatomy v-if="activeSub === 'layout'" />
  </div>
</template>

<style scoped>
  .cls__subtabs {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }

  .cls__subtab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid #e0e0e0;
    background: #fff;
    color: #666;
    cursor: pointer;
    transition: all 0.12s;
  }
  .cls__subtab:hover:not(.is-disabled) {
    border-color: var(--color-primary-border, #ccdade);
  }
  .cls__subtab.is-active {
    background: var(--color-primary-main, #00475a);
    border-color: var(--color-primary-main, #00475a);
    color: #fff;
  }
  .cls__subtab.is-disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .cls__soon {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    background: var(--color-yellow-bg, #fff9ec);
    color: var(--color-yellow-pressed, #f3ac24);
    border: 1px solid var(--color-yellow-border, #ffecc6);
    padding: 1px 5px;
    border-radius: 4px;
  }
</style>