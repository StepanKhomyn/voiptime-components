<script lang="ts" setup>
  import { computed, inject, resolveComponent } from 'vue';
  import type { VBreadcrumbItemEmits, VBreadcrumbItemProps } from './types';

  const props = withDefaults(defineProps<VBreadcrumbItemProps>(), {
    active: false,
    disabled: false,
  });

  const emit = defineEmits<VBreadcrumbItemEmits>();

  // ─── Inject separator від батьківського VBreadcrumb ───────────────────────

  const separator = inject<string>('vt-breadcrumb-separator', '/');

  // ─── Динамічний тег ───────────────────────────────────────────────────────

  const RouterLink = resolveComponent('RouterLink');

  const tag = computed(() => {
    if (props.active || props.disabled || !props.to) return 'span';
    return RouterLink;
  });

  // ─── Click handler ────────────────────────────────────────────────────────

  const handleClick = (event: MouseEvent): void => {
    if (props.disabled) return;
    emit('click', event);
  };
</script>

<template>
  <li
    :class="{
      'vt-breadcrumb__item--active': active,
      'vt-breadcrumb__item--disabled': disabled,
    }"
    class="vt-breadcrumb__item"
  >
    <span aria-hidden="true" class="vt-breadcrumb__separator">
      {{ separator }}
    </span>

    <component
      :is="tag"
      :aria-current="active ? 'page' : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      :class="{
        'vt-breadcrumb__link--active': active,
        'vt-breadcrumb__link--disabled': disabled,
      }"
      :to="to"
      class="vt-breadcrumb__link"
      @click="handleClick"
    >
      <slot />
    </component>
  </li>
</template>
