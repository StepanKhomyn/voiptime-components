<script lang="ts" setup>
  import { computed, Fragment, ref, type VNode } from 'vue';
  import { useResponsiveFilters } from '@/components/dynamic-filter/functions/useResponsiveFilters';
  import VDropdown from '@/components/dropdown/VDropdown.vue';
  import VButton from '@/components/button/VButton.vue';

  const dynamicFilterRef = ref<HTMLElement | null>(null);
  const actionsRef = ref<HTMLElement | null>(null);
  const dropdownTriggerRef = ref<HTMLElement | null>(null);
  const measurementContainer = ref<HTMLElement | null>(null);

  const slots = defineSlots<{
    default?: () => any[];
    actions?: () => any[];
  }>();
  const slotNodes = computed(() => {
    const raw = slots.default ? slots.default() : [];
    return flattenVNodes(raw);
  });

  const slotNodesLength = computed(() => slotNodes.value.length);

  const { visibleIndexes } = useResponsiveFilters(
    dynamicFilterRef,
    actionsRef,
    dropdownTriggerRef,
    measurementContainer,
    slotNodesLength
  );

  const flattenVNodes = (vnodes: VNode[]): VNode[] => {
    const result: VNode[] = [];
    console.log(vnodes);
    for (const vnode of vnodes) {
      console.log(vnode);
      if (vnode.type === Fragment) {
        const children = vnode.children as VNode[] | null;
        if (Array.isArray(children)) {
          result.push(...flattenVNodes(children));
        }
      } else {
        result.push(vnode);
      }
    }
    return result;
  };
</script>

<template>
  <div ref="dynamicFilterRef" class="manage-form__card-filter">
    <!-- inline видимі фільтри -->
    <div class="manage-form__card-filter__inline">
      <template v-for="(element, idx) in slotNodes" :key="idx">
        <div v-show="visibleIndexes.includes(idx)" class="manage-form__card-filter__control">
          <component :is="element" />
        </div>
      </template>
    </div>

    <!-- Dropdown для прихованих -->
    <VDropdown
      v-if="visibleIndexes.length < slotNodes.length"
      class="manage-form__card-filter__dropdown"
      trigger="click"
    >
      <div ref="dropdownTriggerRef">
        <VButton icon="filterAdd" type="default">Більше фільтрів</VButton>
      </div>
      <template #dropdown>
        <div class="manage-form__card-filter__dropdown-target">
          <template v-for="(element, idx) in slotNodes" :key="'d' + idx">
            <div v-if="!visibleIndexes.includes(idx)" class="manage-form__card-filter__control">
              <component :is="element" />
            </div>
          </template>
        </div>
      </template>
    </VDropdown>

    <!-- Кнопки дій -->
    <div ref="actionsRef" class="manage-form__card-filter__actions">
      <slot name="actions" />
    </div>

    <!-- Прихований контейнер для вимірювання ширин (не впливає на layout) -->
    <div ref="measurementContainer" aria-hidden="true" class="manage-form__card-filter__measure-root">
      <template v-for="(element, idx) in slotNodes" :key="'m' + idx">
        <div class="manage-form__card-filter__measure-element manage-form__card-filter__control">
          <component :is="element" />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use './dynamic-filter';
</style>
