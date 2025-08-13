<!-- VDropdownItem.vue -->
<script setup lang="ts">
  import { inject } from 'vue';
  import type { DropdownContext, DropdownItemEmits, DropdownItemProps } from './types';
  import { DropdownContextKey } from './types';

  const props = defineProps<DropdownItemProps>();

  const emit = defineEmits<DropdownItemEmits>();

  // Отримуємо контекст від батьківського VDropdown
  const dropdownContext = inject<DropdownContext>(DropdownContextKey);

  if (!dropdownContext) {
    console.warn('VDropdownItem must be used within VDropdown');
  }

  const handleClick = (event: MouseEvent): void => {
    if (props.disabled) return;

    console.log('VDropdownItem click:', props.command); // Debug log

    emit('click', event);

    // Викликаємо команду через контекст
    if (props.command !== undefined && dropdownContext) {
      console.log('Calling handleCommand with:', props.command); // Debug log
      dropdownContext.handleCommand(props.command);
    }
  };
</script>

<template>
  <li
    class="vt-dropdown-item"
    :class="{
      'is-disabled': disabled,
      'vt-dropdown-item--divided': divided,
    }"
    @click="handleClick"
  >
    <i v-if="icon" :class="icon" class="vt-dropdown-item__icon"></i>
    <slot />
  </li>
</template>
