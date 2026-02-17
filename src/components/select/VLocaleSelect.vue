<script lang="ts" setup>
  import { computed } from 'vue';
  import type { VLocale } from './types';
  import type { VLocaleEmits, VLocaleSelectProps } from './types';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import { LANGUAGES } from '@/entry';
  import type {IconName} from '@/entry'

  const emit = defineEmits<VLocaleEmits>();

  /* -------------------- Props -------------------- */

  const props = withDefaults(defineProps<VLocaleSelectProps>(), {
    modelValue: () => LANGUAGES.uk,
    languages: () => [],
  });

  /* -------------------- Computed -------------------- */

  const currentLocale = computed<LANGUAGES>({
    get: () => props.modelValue || LANGUAGES.uk,
    set: (value: LANGUAGES) => {
      emit('update:modelValue', value);
      emit('change', value);
    }
  });

  const selectedLanguage = computed<VLocale | undefined>(
    () => props.languages.find(lang => lang.value === currentLocale.value),
  );
</script>

<template>
  <VSelect v-model="currentLocale" class="vt-language-select">
    <template #selected>
      <div class="vt-language-select__selected">
        <VIcon :name="selectedLanguage?.icon as IconName" class="vt-language-select__flag"/>
        <span class="vt-language-select__label">{{ selectedLanguage?.locale }}</span>
      </div>
    </template>

    <VOption
      v-for="lang in props.languages"
      :key="lang.value"
      :label="lang.locale"
      :value="lang.value"
    >
      <div class="vt-language-select__option">
        <VIcon :name="lang?.icon as IconName" class="vt-language-select__flag"/>
        <span class="vt-language-select__label">{{ lang.locale }}</span>
      </div>
    </VOption>
  </VSelect>
</template>

<style scoped lang="scss">
  @use 'locale-select';
</style>