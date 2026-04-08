<script lang="ts" setup>
  // DocBadge — колорований тег (new, deprecated, required тощо)
  defineProps<{
    type?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
    label: string;
  }>();
</script>

<template>
  <span :class="`doc-badge--${type ?? 'neutral'}`" class="doc-badge">{{ label }}</span>
</template>

<style lang="scss" scoped>
  .doc-badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 0.15rem 0.5rem;
    border-radius: 20px;
    line-height: 1.4;

    &--info {
      background: #eaf4fd;
      color: #1a6fa8;
    }

    &--success {
      background: #edfbf3;
      color: #1a6e40;
    }

    &--warning {
      background: #fef9ec;
      color: #8a6000;
    }

    &--danger {
      background: #fdecea;
      color: #a11b12;
    }

    &--neutral {
      background: #f0f2f6;
      color: #555;
    }
  }
</style>
