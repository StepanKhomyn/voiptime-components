<!-- VTabs.vue - Краще рішення -->
<script lang="ts" setup>
  import { provide, ref, useSlots, type VNode, watch } from 'vue';
  import type { VTabsEmits, VTabsProps } from './types';
  import VIcon from '@/components/icon/VIcon.vue';

  const props = withDefaults(defineProps<VTabsProps>(), {
    modelValue: undefined,
  });

  const emit = defineEmits<VTabsEmits>();
  const slots = useSlots();

  const currentValue = ref<string | undefined>(props.modelValue);
  const tabs = ref<any[]>([]);

  watch(
    () => props.modelValue,
    val => {
      currentValue.value = val;
    }
  );

  watch(currentValue, val => {
    if (val !== props.modelValue) {
      emit('update:modelValue', val as string);
      emit('tab-change', val as string);
    }
  });

  const addTab = (tab: any) => {
    tabs.value.push(tab);
    if (!currentValue.value) {
      currentValue.value = tab.name;
    }
  };

  const removeTab = (name: string) => {
    tabs.value = tabs.value.filter(t => t.name !== name);
    emit('tab-remove', name);
    if (currentValue.value === name && tabs.value.length > 0) {
      currentValue.value = tabs.value[0].name;
    }
  };

  const selectTab = (name: string) => {
    currentValue.value = name;
  };

  // Функція для отримання кастомного заголовка табу
  const getTabTitle = (tab: any) => {
    const defaultSlots = slots.default?.() || [];

    // Знаходимо відповідний VTabItem компонент
    const tabItem = defaultSlots.find((vnode: VNode) => vnode.props?.name === tab.name);

    // Якщо знайшли компонент і у нього є слот title
    if (tabItem && tabItem.children && typeof tabItem.children === 'object' && 'title' in tabItem.children) {
      return tabItem.children.title;
    }

    return null;
  };

  provide('VTabsContext', {
    currentValue,
    addTab,
    removeTab,
    selectTab,
  });
</script>

<template>
  <div class="vt-tabs">
    <div class="vt-tabs__nav">
      <div
        v-for="tab in tabs"
        :key="tab.name"
        :class="{
          'is-active': currentValue === tab.name,
          'is-disabled': tab.disabled,
        }"
        class="vt-tabs__nav-item"
        @click="!tab.disabled && selectTab(tab.name)"
      >
        <!-- Рендеримо кастомний заголовок якщо він є -->
        <component :is="getTabTitle(tab)" v-if="getTabTitle(tab)" :is-active="currentValue === tab.name" />

        <!-- Стандартний заголовок -->
        <template v-else>
          <VIcon v-if="tab.icon" :name="tab.icon" class="vt-tab-icon" />
          <span v-if="tab.label">{{ tab.label }}</span>
        </template>

        <!-- Кнопка закриття -->
        <span v-if="tab.closable" class="vt-tabs__close" @click.stop="removeTab(tab.name)">
          <VIcon name="close" />
        </span>
      </div>
    </div>

    <div class="vt-tabs__content">
      <slot />
    </div>
  </div>
</template>
