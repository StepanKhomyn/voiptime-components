<script setup lang="ts">
  import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';
  import type { SidebarItemRaw } from './types';
  import SidebarItem from './SidebarItem.vue';
  import VIcon from '@/components/icon/VIcon.vue';

  const activeRoute = ref<string | null>(null);

  const onNavigate = (to: string) => {
    activeRoute.value = to;

    emit('navigate', to);
  };

  const props = defineProps<{
    items: SidebarItemRaw[];
    collapsed: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:collapsed', value: boolean): void;
    (e: 'navigate', to: string): void;
  }>();

  const collapsed = ref(props.collapsed);
  const scrollEl = ref<HTMLElement | null>(null);

  const toggleCollapse = () => {
    collapsed.value = !collapsed.value;
    emit('update:collapsed', collapsed.value);
  };

  onMounted(() => {
    if (scrollEl.value) {
      scrollEl.value.addEventListener('scroll', () => {
        // тут можна поставити тіні або скрол-індикатори
      });
    }
  });

  watch(
    () => props.collapsed,
    v => {
      collapsed.value = v;
    }
  );
</script>

<template>
  <aside class="hub-sidebar" :class="{ collapsed }">
    <nav class="hub-sidebar-nav">
      <ul class="hub-sidebar-list">
        <SidebarItem
          v-for="item in items"
          :key="item.i18n"
          :item="item"
          :collapsed="collapsed"
          :active-route="activeRoute"
          @navigate="onNavigate"
        />
      </ul>
    </nav>
    <div @click="toggleCollapse" class="hub-sidebar-footer" :class="{ collapsed }">
      <VIcon v-if="collapsed" name="arrowRight"></VIcon>
<!--      <span v-if="!collapsed" class="hub-sidebar-footer__label">Згорнути меню</span>-->
      <VIcon v-if="!collapsed" name="arrowLeft"></VIcon>
    </div>
  </aside>
</template>

<style scoped lang="scss">
  @import 'sidebar';
</style>
