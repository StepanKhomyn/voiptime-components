<!-- VDropdown.vue - З правильною типізацією і provide/inject -->
<script setup lang="ts">
  import { nextTick, onMounted, onUnmounted, provide, ref, useSlots } from 'vue';
  import type { DropdownContext, DropdownEmits, DropdownExpose, DropdownProps } from './types';
  import { DropdownContextKey } from './types';

  const props = withDefaults(defineProps<DropdownProps>(), {
    trigger: 'hover',
    placement: 'bottom-start',
    disabled: false,
    splitButton: false,
    hideOnClick: true,
    showTimeout: 250,
    hideTimeout: 150,
    tabindex: 0,
  });

  const emit = defineEmits<DropdownEmits>();

  // Refs
  const dropdownRef = ref<HTMLElement>();
  const triggerRef = ref<HTMLElement>();
  const menuRef = ref<HTMLElement>();
  const visible = ref(false);
  const timeoutPending = ref<number | null>(null);

  // Стилі для позиціонування
  const menuStyle = ref({
    position: 'absolute' as const,
    top: '0px',
    left: '0px',
    zIndex: 2000,
    transformOrigin: 'center top',
  });

  // Слоти
  const slots = useSlots();

  // Позиціонування меню
  const updatePopper = async (): Promise<void> => {
    await nextTick();
    if (!triggerRef.value || !menuRef.value) return;

    const triggerRect = triggerRef.value.getBoundingClientRect();
    const menuRect = menuRef.value.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (props.placement) {
      case 'bottom':
        top = triggerRect.bottom + window.scrollY + 5;
        left = triggerRect.left + window.scrollX + (triggerRect.width - menuRect.width) / 2;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + window.scrollY + 5;
        left = triggerRect.left + window.scrollX;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + window.scrollY + 5;
        left = triggerRect.right + window.scrollX - menuRect.width;
        break;
      case 'top':
        top = triggerRect.top + window.scrollY - menuRect.height - 5;
        left = triggerRect.left + window.scrollX + (triggerRect.width - menuRect.width) / 2;
        break;
      case 'top-start':
        top = triggerRect.top + window.scrollY - menuRect.height - 5;
        left = triggerRect.left + window.scrollX;
        break;
      case 'top-end':
        top = triggerRect.top + window.scrollY - menuRect.height - 5;
        left = triggerRect.right + window.scrollX - menuRect.width;
        break;
    }

    // Корекція меж екрана
    if (left + menuRect.width > window.innerWidth) {
      left = window.innerWidth - menuRect.width - 10;
    }
    if (left < 10) left = 10;

    if (top + menuRect.height > window.innerHeight) {
      top = triggerRect.top + window.scrollY - menuRect.height - 5;
    }
    if (top < 10) top = 10;

    menuStyle.value.top = `${top}px`;
    menuStyle.value.left = `${left}px`;
  };

  // Показати меню
  const show = (): void => {
    if (props.disabled || visible.value) return;

    clearTimeout();
    timeoutPending.value = window.setTimeout(
      async () => {
        visible.value = true;
        await updatePopper();
        emit('visible-change', true);
      },
      props.trigger === 'hover' ? props.showTimeout : 0
    );
  };

  // Сховати меню
  const hide = (): void => {
    if (!visible.value) return;

    clearTimeout();
    timeoutPending.value = window.setTimeout(
      () => {
        visible.value = false;
        emit('visible-change', false);
      },
      props.trigger === 'hover' ? props.hideTimeout : 0
    );
  };

  // Очистити таймаути
  const clearTimeout = (): void => {
    if (timeoutPending.value) {
      window.clearTimeout(timeoutPending.value);
      timeoutPending.value = null;
    }
  };

  // Обробник команд від дочірніх елементів
  const handleCommand = (command: string | number): void => {
    console.log('VDropdown handleCommand called:', command); // Debug log
    emit('command', command);
    if (props.hideOnClick) {
      hide();
    }
  };

  // Provide контексту для VDropdownItem
  provide<DropdownContext>(DropdownContextKey, {
    handleCommand,
    hideOnClick: props.hideOnClick,
  });

  // Обробники подій
  const handleClick = (event: MouseEvent): void => {
    if (props.disabled) return;

    console.log('VDropdown click triggered'); // Debug log
    emit('click', event);

    if (props.trigger === 'click') {
      if (visible.value) {
        hide();
      } else {
        show();
      }
    }
  };

  const handleMouseEnter = (): void => {
    if (props.trigger === 'hover') {
      show();
    }
  };

  const handleMouseLeave = (): void => {
    if (props.trigger === 'hover') {
      hide();
    }
  };

  const handleMenuMouseEnter = (): void => {
    if (props.trigger === 'hover') {
      clearTimeout();
    }
  };

  const handleMenuMouseLeave = (): void => {
    if (props.trigger === 'hover') {
      hide();
    }
  };

  // Закриття при кліку поза
  const handleClickOutside = (event: MouseEvent): void => {
    if (!visible.value) return;

    const target = event.target as Node;
    if (dropdownRef.value?.contains(target) || menuRef.value?.contains(target)) {
      return;
    }

    hide();
  };

  // Оновлення позиції при скролі
  const handleScroll = (): void => {
    if (visible.value) {
      updatePopper();
    }
  };

  // Expose для використання ззовні
  defineExpose<DropdownExpose>({
    show,
    hide,
    visible,
  });

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
    clearTimeout();
  });
</script>

<template>
  <div
    ref="dropdownRef"
    class="v-dropdown"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Trigger slot (default) -->
    <div ref="triggerRef" class="v-dropdown__trigger">
      <slot />
    </div>

    <!-- Menu через Teleport -->
    <Teleport to="body" v-if="visible">
      <div
        ref="menuRef"
        :style="menuStyle"
        class="v-dropdown-menu"
        @mouseenter="handleMenuMouseEnter"
        @mouseleave="handleMenuMouseLeave"
        @click.stop
      >
        <slot name="dropdown" />
      </div>
    </Teleport>
  </div>
</template>
