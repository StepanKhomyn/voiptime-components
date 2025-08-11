<script setup lang="ts">
  import { computed } from 'vue';
  import type { IconName } from '../../icons';
  import { icons } from '../../icons';

  const props = defineProps<{ name: IconName }>();

  const Icon = computed(() => icons[props.name]);
</script>

<template>
  <component :is="Icon" v-if="Icon" />
</template>
