<script setup lang="ts">
  import { reactive } from 'vue';
  import { containUpperCaseLetter, minLength, noSpaces, required, useValidate } from '@/validation';
  import VInput from '@/components/input/VInput.vue';
  import VButton from '@/components/button/VButton.vue';
  import { LOCALE_KEYS } from '@/locales/types';
  import { useI18n } from '@/locales/useI18n';
  import VRadiobox from '@/components/radiobox/VRadiobox.vue';
  import type { VAuthentificationData, VAuthentificationEmits, VAuthentificationProps } from '@/components/login/types';

  const { t } = useI18n();

  /* -------------------- Props -------------------- */
  const props = withDefaults(defineProps<VAuthentificationProps>(), {
    loading: false,
    privacyPolicyUrl: '#',
    forgotPasswordUrl: '#',
  });

  /* -------------------- Emits -------------------- */

  const emit = defineEmits<VAuthentificationEmits>();

  /* -------------------- State -------------------- */

  const form = reactive<VAuthentificationData>({
    username: '',
    password: '',
    remember: false,
  });

  /* -------------------- Validation -------------------- */

  const rules = {
    username: [required, minLength(3)],
    password: [required, minLength(6), containUpperCaseLetter, noSpaces],
  };

  const v$ = useValidate(rules, form);

  /* -------------------- Methods -------------------- */

  const submit = async () => {
    v$.$touch();
    const isValid = await v$.$validate();
    if (isValid) {
      const payload = {
        username: form.username,
        password: form.password,
        remember: form.remember
      } as VAuthentificationData;
      emit('auth', payload);
    }
  };
</script>

<template>
  <div class="vt-login">
    <div class="vt-login__wrapper">

      <div class="vt-login__logo">
        <slot name="logo" />
      </div>

      <div class="vt-login__greeting">
        <slot name="greeting">{{ t(LOCALE_KEYS.LOGIN_TITLE) }}</slot>
      </div>

      <div v-loader="props.loading" class="vt-login__form">

        <div class="vt-login__form-item">
          <div
            class="vt-login__form-label vt-login__form-label__required"
          >
            {{ t(LOCALE_KEYS.LOGIN_USERNAME) }}
          </div>
          <VInput
            v-model="form.username"
            :error-message="Array.isArray(v$.username?.$errors) ? v$.username.$errors[0]?.$message : undefined"
            outlined
            @keyup.enter="submit"
          />
        </div>

        <div class="vt-login__form-item">
          <div
            class="vt-login__form-label vt-login__form-label__required"
          >
            {{ t(LOCALE_KEYS.LOGIN_PASSWORD) }}
          </div>
          <VInput
            v-model.trim="form.password"
            :error-message="Array.isArray(v$.password?.$errors) ? v$.password.$errors[0]?.$message : undefined"
            :show-password="true"
            type="password"
            outlined
            @keyup.enter="submit"
          />
        </div>

        <div class="vt-login__form-item">
          <div
            class="vt-login__form-label"
          >
            {{ t(LOCALE_KEYS.LOGIN_LANGUAGE) }}
          </div>
          <slot name="language-select" />
        </div>

        <div class="vt-login__form-item vt-login__form-item--row">
          <VRadiobox v-model="form.remember" :label="t(LOCALE_KEYS.LOGIN_REMEMBER)" />
          <a
            class="vt-login__link"
            :href="props.forgotPasswordUrl"
          >
            {{ t(LOCALE_KEYS.LOGIN_FORGET_PASSWORD) }}
          </a>
        </div>

        <div class="vt-login__form-item">
          <VButton
            class="vt-login__form-submit"
            :disabled="props.loading"
            type="primary"
            @click="submit"
          >
            {{ t(LOCALE_KEYS.LOGIN_SUBMIT) }}
          </VButton>
        </div>

        <div class="vt-login__form-item vt-login__form-item--center">
          <a class="vt-login__link" target="_blank" :href="props.privacyPolicyUrl">{{ t(LOCALE_KEYS.LOGIN_PRIVACY_POLICY) }}</a>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @use './login';
</style>