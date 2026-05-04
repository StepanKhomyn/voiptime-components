<script lang="ts" setup>
  import { computed, inject } from 'vue';
  import type { VBreadcrumbItemEmits, VBreadcrumbItemProps } from './types';

  const props = withDefaults(defineProps<VBreadcrumbItemProps>(), {
    active: false,
    disabled: false,
  });

  const emit = defineEmits<VBreadcrumbItemEmits>();

  const separator = inject<string>('vt-breadcrumb-separator', '/');

  const hasRouter = !!inject<unknown>('router', null);

  const tag = computed(() => {
    if (props.active || props.disabled || !props.to) return 'span';
    if (!hasRouter) return 'a';
    return 'RouterLink';
  });

  const linkProps = computed(() => {
    if (tag.value === 'a') return { href: String(props.to) };
    if (tag.value === 'RouterLink') return { to: props.to };
    return {};
  });

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
      class="vt-breadcrumb__link"
      v-bind="linkProps"
      @click="handleClick"
    >
      <slot />
    </component>
  </li>
</template>
