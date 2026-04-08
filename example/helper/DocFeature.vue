<script lang="ts" setup>
  defineProps<{
    title: string;
    icon?: string;
  }>();
</script>

<template>
  <div class="doc-feature">
    <span v-if="icon" class="doc-feature__icon">{{ icon }}</span>
    <div>
      <strong class="doc-feature__title">{{ title }}</strong>
      <div class="doc-feature__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .doc-feature {
    display: flex;
    gap: 0.75rem;
    padding: 0.9rem 1rem;
    background: #fff;
    border-left: 3px solid #3498db;
    border-radius: 0 8px 8px 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

    &__icon {
      font-size: 1.1rem;
      line-height: 1.4;
      flex-shrink: 0;
    }

    &__title {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.25rem;
    }

    &__body {
      font-size: 0.85rem;
      color: #555;
      line-height: 1.5;

      :deep(code) {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        background: #f0f2f6;
        padding: 0.1rem 0.3rem;
        border-radius: 3px;
        color: #3498db;
      }
    }
  }
</style>
