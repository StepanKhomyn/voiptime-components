<script setup lang="ts">

  import VLogin from '../src/components/login/VLogin.vue';
  import VLocaleSelect from '../src/components/select/VLocaleSelect.vue';
  import VLoginLogo from '../src/components/login/VLoginLogo.vue';
  import { LANGUAGES } from '../src/entry';
  import { VLocale } from '../src/components/select/types';
  import { ref } from 'vue';

  const languages: VLocale[] = [
    { value: LANGUAGES.uk, locale: 'Українська', icon: 'ukraine' },
    { value: LANGUAGES.en, locale: 'English',    icon: 'unitedKingdom' },
    { value: LANGUAGES.ru, locale: 'Русский',    icon: 'terrorist' },
  ];

  const lang = ref(LANGUAGES.uk);
</script>

<template>
  <div class="demo-contaoner">
    <VLogin
      privacy-policy-url="/privacy"
      forgot-password-url="/reset-password"
      @auth="({ username, password }) => {}"
    >
      <template #logo><VLoginLogo name="CONTACT CENTERS" /></template>
      <template #language-select>
        <VLocaleSelect v-model="lang" :languages="languages" />
      </template>
    </VLogin>
  </div>
</template>