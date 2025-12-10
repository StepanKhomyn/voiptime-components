<script setup lang="ts">
  import { ref, defineProps, defineEmits, onBeforeUnmount } from 'vue';
  import type { SidebarItemRaw } from './types';
  import VIcon from '@/components/icon/VIcon.vue';
  import type { IconName } from '@/icons';

  const props = defineProps<{
    item: SidebarItemRaw;
    collapsed: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'navigate', to: string): void;
  }>();

  const showSub = ref(false);
  const hoveringItem = ref(false);
  const hoveringSub = ref(false);
  const openTimeout: any = ref(null);
  const closeTimeout: any = ref(null);
  const itemEl = ref<HTMLElement | null>(null);

  const submenuStyle = ref({
    top: '0px',
    left: '0px',
    bottom: 'auto',
    maxHeight: '100vh',
  });

  const clearTimers = () => {
    if (openTimeout.value) clearTimeout(openTimeout.value);
    if (closeTimeout.value) clearTimeout(closeTimeout.value);
  };

  const openSubmenu = () => {
    if (!props.item.children) return;
    hoveringItem.value = true;
    clearTimers();

    openTimeout.value = setTimeout(() => {
      if (!hoveringItem.value) return;

      positionSubmenu();
      showSub.value = true;
    }, 120); // HubSpot–style delay
  };

  const closeSubmenu = () => {
    hoveringItem.value = false;
    clearTimers();

    closeTimeout.value = setTimeout(() => {
      if (!hoveringItem.value && !hoveringSub.value) {
        showSub.value = false;
      }
    }, 220);
  };

  const positionSubmenu = () => {
    const rect = itemEl.value!.getBoundingClientRect();

    const submenuHeight = (props.item.children?.length ?? 0) * 40 + 20;
    const viewportHeight = window.innerHeight;

    let top: number | string = rect.top;
    let bottom: string | number = 'auto';

    const overflows = top + submenuHeight > viewportHeight - 10;

    if (overflows) {
      // Якщо виходить за нижню межу — прижимаємо вниз
      bottom = 10;
      top = 'auto';
    } else {
      if (top < 10) top = 10; // невеликий відступ зверху
    }

    submenuStyle.value = {
      left: rect.right + 10 + 'px',
      top: typeof top === 'number' ? top + 'px' : top,
      bottom: typeof bottom === 'number' ? bottom + 'px' : bottom,
      maxHeight: '90vh',
    };
  };

  const handleClick = () => {
    // Якщо collapsed, як у HubSpot — відкриваємо popout по кліку
    if (props.collapsed && props.item.children) {
      showSub.value = true;
      positionSubmenu();
      return;
    }

    if (!props.item.children && props.item.route) {
      emit('navigate', props.item.route);
    }
  };

  const navigate = (child: SidebarItemRaw) => {
    emit('navigate', child.route!);
  };

  onBeforeUnmount(() => {
    clearTimers();
  });
</script>

<template>
  <li class="hub-item" @mouseenter="openSubmenu" @mouseleave="closeSubmenu" ref="itemEl">
    <!-- MAIN ROW -->
    <div class="hub-item-main" @click="handleClick" :class="{ collapsed, active: hoveringItem || showSub }">
      <VIcon class="hub-item-icon" color="#9ac9d6" :name="(item.icon ?? 'empty') as IconName" />
      <span v-if="!collapsed" class="hub-item-label">{{ item.i18n }}</span>
      <VIcon v-if="item.children && !collapsed" class="hub-item-arrow" color="#9ac9d6" name="arrowRight"></VIcon>
    </div>

    <!-- DIVIDER -->
    <div class="hub-item-divider"></div>

    <!-- POPOUT SUBMENU -->
    <teleport to="body">
      <div
        v-if="showSub"
        class="hub-submenu"
        :style="submenuStyle"
        @mouseenter="
          hoveringSub = true;
          clearTimers();
        "
        @mouseleave="
          hoveringSub = false;
          closeSubmenu();
        "
      >
        <ul class="hub-submenu-list">
          <li v-for="child in item.children" :key="child.name" class="hub-submenu-item" @click="navigate(child)">
            <span class="hub-submenu-label">{{ child.i18n }}</span>
          </li>
        </ul>
      </div>
    </teleport>
  </li>
</template>

<style scoped lang="scss">
  @import 'sidebar';
</style>
