<template>
  <div class="v-collapse">
    <slot />
  </div>
</template>

<script lang="ts" setup>
  import { provide, reactive, toRefs } from 'vue';
  import type { CollapseContext, CollapseEmits, CollapseProps } from './types';

  const props = withDefaults(defineProps<CollapseProps>(), {
    accordion: false,
  });

  const emit = defineEmits<CollapseEmits>();

  const { modelValue, accordion } = toRefs(props);

  const toggle = (name: string) => {
    const current = [...modelValue.value];
    const index = current.indexOf(name);

    if (accordion.value) {
      // В режиме аккордеона только один элемент может быть открыт
      const newValue = index > -1 ? [] : [name];
      emit('update:modelValue', newValue);
      emit('change', newValue);
    } else {
      // В обычном режиме можно открывать несколько элементов
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(name);
      }
      emit('update:modelValue', current);
      emit('change', current);
    }
  };

  // Створюємо реактивний контекст
  const collapseContext = reactive<CollapseContext>({
    get activeNames() {
      return modelValue.value;
    },
    get accordion() {
      return accordion.value;
    },
    toggle,
  });

  provide('collapseContext', collapseContext);
</script>
