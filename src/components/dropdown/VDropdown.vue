<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
  import { useDropdown } from './useDropdown';
  import {
    type DropdownContext,
    DropdownContextKey,
    type DropdownEmits,
    type DropdownProps,
    type DropdownTriggerType,
  } from './types';

  const props = withDefaults(defineProps<DropdownProps>(), {
    trigger: 'hover',
    placement: 'bottom-start',
    disabled: false,
    hideOnClick: true,
    showTimeout: 250,
    hideTimeout: 150,
    maxHeight: '200',
  });

  const emit = defineEmits<DropdownEmits>();

  // Template refs
  const dropdownRef = ref<HTMLElement>();
  const triggerRef = ref<HTMLElement>();
  const menuRef = ref<HTMLElement>();

  // Додаткові стани для відстеження hover
  const isHoveringTrigger = ref(false);
  const isHoveringMenu = ref(false);
  const hideTimeout = ref<number | null>(null);

  // Використання композабла
  const { visible, parentVisible, dropdownPosition, show, hide, toggle, updatePosition } = useDropdown(
    triggerRef,
    menuRef,
    {
      trigger: props.trigger as DropdownTriggerType,
      placement: props.placement,
      showTimeout: props.showTimeout,
      hideTimeout: props.hideTimeout,
      disabled: props.disabled,
      hideOnClick: props.hideOnClick,
      onVisibleChange: isVisible => emit('visible-change', isVisible),
    }
  );

  // Функції для керування hover станом
  const clearHideTimeout = (): void => {
    if (hideTimeout.value) {
      clearTimeout(hideTimeout.value);
      hideTimeout.value = null;
    }
  };

  const scheduleHide = (): void => {
    clearHideTimeout();
    hideTimeout.value = setTimeout(() => {
      if (!isHoveringTrigger.value && !isHoveringMenu.value) {
        hide();
      }
    }, props.hideTimeout);
  };

  // Обробка команд від dropdown items
  const handleCommand = (command: string | number): void => {
    emit('command', command);
    if (props.hideOnClick) {
      hide();
    }
  };

  // Надання контексту для дочірніх компонентів
  provide<DropdownContext>(DropdownContextKey, {
    handleCommand,
    hideOnClick: props.hideOnClick,
  });

  // Event handlers для тригера
  const handleClick = (event: MouseEvent): void => {
    if (props.disabled) return;
    emit('click', event);

    if (props.trigger === 'click') {
      toggle();
    }
  };

  const handleMouseEnter = (): void => {
    if (props.trigger === 'hover') {
      isHoveringTrigger.value = true;
      clearHideTimeout();
      show();
    }
  };

  const handleMouseLeave = (): void => {
    if (props.trigger === 'hover') {
      isHoveringTrigger.value = false;
      scheduleHide();
    }
  };

  // ВИПРАВЛЕНІ обробники для меню
  const handleMenuMouseEnter = (): void => {
    if (props.trigger === 'hover') {
      isHoveringMenu.value = true;
      clearHideTimeout();
    }
  };

  const handleMenuMouseLeave = (): void => {
    if (props.trigger === 'hover') {
      isHoveringMenu.value = false;
      scheduleHide();
    }
  };

  // Click outside handler
  const handleClickOutside = (event: MouseEvent): void => {
    if (!visible.value) return;

    const target = event.target as Node;
    if (dropdownRef.value?.contains(target) || menuRef.value?.contains(target)) {
      return;
    }

    hide();
  };

  // Computed style for menu з урахуванням maxHeight
  const menuStyle = computed(() => ({
    ...dropdownPosition.value,
    position: 'absolute' as const,
    zIndex: 2000,
    maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : `${props.maxHeight}px`,
  }));

  // Expose methods
  defineExpose({
    show,
    hide,
    visible,
  });

  // Lifecycle
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    clearHideTimeout();
  });
</script>

<template>
  <div
    ref="dropdownRef"
    class="vt-dropdown"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Trigger slot (default) -->
    <div ref="triggerRef" class="vt-dropdown__trigger">
      <slot />
    </div>

    <!-- Menu через Teleport -->
    <Teleport v-if="visible && parentVisible" to="body">
      <div
        ref="menuRef"
        :style="menuStyle"
        class="vt-dropdown-menu"
        @mouseenter="handleMenuMouseEnter"
        @mouseleave="handleMenuMouseLeave"
        @click.stop
      >
        <slot name="dropdown" />
      </div>
    </Teleport>
  </div>
</template>
