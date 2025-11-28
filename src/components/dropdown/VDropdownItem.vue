<!-- VDropdownItem.vue -->
<script lang="ts" setup>
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
    emit('click', event);

    // Викликаємо команду через контекст
    if (props.command !== undefined && dropdownContext) {
      dropdownContext.handleCommand(props.command);
    }
  };
</script>

<template>
  <li
    :class="{
      'is-disabled': disabled,
      'vt-dropdown-item--divided': divided,
    }"
    class="vt-dropdown-item"
    @click="handleClick"
  >
    <i v-if="icon" :class="icon" class="vt-dropdown-item__icon"></i>
    <slot />
  </li>
</template>
