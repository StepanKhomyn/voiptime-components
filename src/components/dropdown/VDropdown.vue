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

  // Масив для зберігання всіх скролабельних батьків
  const scrollableParents = ref<Element[]>([]);

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

  // Знаходження всіх скролабельних батьківських елементів
  const getScrollableParents = (element: Element): Element[] => {
    const parents: Element[] = [];
    let parent = element.parentElement;

    while (parent && parent !== document.body) {
      const computedStyle = window.getComputedStyle(parent);
      const overflowY = computedStyle.overflowY;
      const overflowX = computedStyle.overflowX;

      // Перевіряємо чи елемент може скролитися
      if (
        ['scroll', 'auto'].includes(overflowY) ||
        ['scroll', 'auto'].includes(overflowX) ||
        parent.scrollHeight > parent.clientHeight ||
        parent.scrollWidth > parent.clientWidth
      ) {
        parents.push(parent);
      }

      parent = parent.parentElement;
    }

    // Додаємо window як останній "батьківський" елемент
    parents.push(window as any);

    return parents;
  };

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

    if (top + menuRect.height > window.innerHeight + window.scrollY) {
      top = triggerRect.top + window.scrollY - menuRect.height - 5;
    }
    if (top < window.scrollY + 10) top = window.scrollY + 10;

    menuStyle.value.top = `${top}px`;
    menuStyle.value.left = `${left}px`;
  };

  // Додавання слухачів скролу до всіх батьківських елементів
  const addScrollListeners = (): void => {
    if (!triggerRef.value) return;

    // Знаходимо всі скролабельні батьки
    scrollableParents.value = getScrollableParents(triggerRef.value);

    // Додаємо слухачі для кожного батька
    scrollableParents.value.forEach(parent => {
      parent.addEventListener('scroll', handleScroll, { passive: true });
    });

    // Додаємо слухач для resize
    window.addEventListener('resize', handleScroll);
  };

  // Видалення слухачів скролу
  const removeScrollListeners = (): void => {
    scrollableParents.value.forEach(parent => {
      parent.removeEventListener('scroll', handleScroll);
    });
    window.removeEventListener('resize', handleScroll);
    scrollableParents.value = [];
  };

  // Показати меню
  const show = (): void => {
    if (props.disabled || visible.value) return;

    clearTimeout();
    timeoutPending.value = window.setTimeout(
      async () => {
        visible.value = true;
        await updatePopper();
        addScrollListeners(); // Додаємо слухачі після показу меню
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
        removeScrollListeners(); // Видаляємо слухачі при закритті меню
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
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    removeScrollListeners();
    clearTimeout();
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
    <Teleport to="body" v-if="visible">
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
