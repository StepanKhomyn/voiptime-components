<!-- VTabs.vue -->
<script lang="ts" setup>
  import { nextTick, onBeforeUnmount, onMounted, provide, ref, useSlots, type VNode, watch } from 'vue';
  import type { VTabsEmits, VTabsProps } from './types';
  import VIcon from '@/components/icon/VIcon.vue';

  const props = withDefaults(defineProps<VTabsProps>(), {
    modelValue: undefined,
  });

  const emit = defineEmits<VTabsEmits>();
  const slots = useSlots();

  const currentValue = ref<string | undefined>(props.modelValue);
  const tabs = ref<any[]>([]);
  const navRef = ref<HTMLElement | null>(null);
  const scrollableRef = ref<HTMLElement | null>(null);
  const showLeftArrow = ref(false);
  const showRightArrow = ref(false);
  const visitedTabs = ref<Set<string>>(new Set());

  watch(currentValue, val => {
    if (val) {
      visitedTabs.value.add(val);
    }
  },
    { immediate: true });

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
      visitedTabs.value.add(tab.name);
    }
    nextTick(() => {
      updateArrows();
    });
  };

  const removeTab = (name: string) => {
    tabs.value = tabs.value.filter(t => t.name !== name);
    emit('tab-remove', name);
    if (currentValue.value === name && tabs.value.length > 0) {
      currentValue.value = tabs.value[0].name;
    }
    nextTick(() => {
      updateArrows();
    });
  };

  const selectTab = (name: string) => {
    currentValue.value = name;
  };

  const getTabTitle = (tab: any) => {
    const defaultSlots = slots.default?.() || [];
    const tabItem = defaultSlots.find((vnode: VNode) => vnode.props?.name === tab.name);

    if (tabItem && tabItem.children && typeof tabItem.children === 'object' && 'title' in tabItem.children) {
      return tabItem.children.title;
    }

    return null;
  };

  // Перевірка видимості стрілок
  const updateArrows = () => {
    if (!scrollableRef.value) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollableRef.value;

    showLeftArrow.value = scrollLeft > 0;
    showRightArrow.value = scrollLeft + clientWidth < scrollWidth - 1;
  };

  // Скрол вліво
  const scrollLeft = () => {
    if (!scrollableRef.value) return;

    scrollableRef.value.scrollBy({
      left: -200,
      behavior: 'smooth',
    });
  };

  // Скрол вправо
  const scrollRight = () => {
    if (!scrollableRef.value) return;

    scrollableRef.value.scrollBy({
      left: 200,
      behavior: 'smooth',
    });
  };

  // Слухачі подій
  onMounted(() => {
    if (scrollableRef.value) {
      scrollableRef.value.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);
      updateArrows();
    }
  });

  onBeforeUnmount(() => {
    if (scrollableRef.value) {
      scrollableRef.value.removeEventListener('scroll', updateArrows);
    }
    window.removeEventListener('resize', updateArrows);
  });

  provide('VTabsContext', {
    currentValue,
    visitedTabs,
    addTab,
    removeTab,
    selectTab,
  });
</script>

<template>
  <div class="vt-tabs">
    <div ref="navRef" class="vt-tabs__nav">
      <!-- Стрілка вліво -->
      <button v-show="showLeftArrow" class="vt-tabs__arrow vt-tabs__arrow--left" @click="scrollLeft">
        <VIcon name="arrowLeft" />
      </button>

      <!-- Контейнер з табами -->
      <div ref="scrollableRef" class="vt-tabs__scrollable">
        <div class="vt-tabs__items">
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
            <!-- Кастомний заголовок -->
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
      </div>

      <!-- Стрілка вправо -->
      <button v-show="showRightArrow" class="vt-tabs__arrow vt-tabs__arrow--right" @click="scrollRight">
        <VIcon name="arrowRight" />
      </button>
    </div>

    <div class="vt-tabs__content">
      <slot />
    </div>
  </div>
</template>
