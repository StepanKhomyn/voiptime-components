<!-- VOption.vue -->
<script lang="ts" setup>
  import { inject, onMounted, onUnmounted } from 'vue';

  interface Props {
    value: string | number;
    label: string;
  }

  const props = defineProps<Props>();

  // Get context from VSelect
  const context = inject('vt-select-context') as {
    registerOption: (option: { value: string | number; label: string }) => void;
    unregisterOption: (value: string | number) => void;
    selectedValue: any;
  } | null;

  onMounted(() => {
    if (context) {
      context.registerOption({
        value: props.value,
        label: props.label,
      });
    }
  });

  onUnmounted(() => {
    if (context) {
      context.unregisterOption(props.value);
    }
  });
</script>

<template>
  <!-- VOption не рендерить нічого в DOM, тільки реєструється в VSelect -->
</template>
