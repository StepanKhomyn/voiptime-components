<script lang="ts" setup>
  defineProps<{
    title: string;
    description?: string;
  }>();
</script>

<template>
  <div class="doc-section">
    <div class="doc-section__header">
      <h2 class="doc-section__title">{{ title }}</h2>
      <p v-if="description" class="doc-section__desc">{{ description }}</p>
    </div>
    <div class="doc-section__body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .doc-section {
    margin-bottom: 4rem;

    &__header {
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--color-primary-main);
    }

    &__title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-primary-main);
      margin: 0 0 0.4rem;
    }

    &__desc {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
      line-height: 1.5;
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  }
</style>
