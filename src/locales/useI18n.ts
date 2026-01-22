// locales/useI18n.ts
import { getCurrentInstance, inject, type InjectionKey } from 'vue';
import { i18n, type I18nInstance } from './index';

export const I18nInjectionKey: InjectionKey<I18nInstance> = Symbol('i18n');

/**
 * Composable для роботи з i18n
 * Працює як всередині компонентів (через inject), так і поза ними (глобальний i18n)
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useI18n } from '@/locales/useI18n';
 *
 * const { t } = useI18n();
 * const errorMsg = t(LOCALE_KEYS.ERROR);
 * </script>
 * ```
 *
 * @example
 * ```ts
 * // У валідаторах або будь-де поза компонентом
 * export const required: ValidatorFn = v => {
 *   const { t } = useI18n();
 *   return v || t(LOCALE_KEYS.VALIDATION_REQUIRED);
 * };
 * ```
 */
export function useI18n(): I18nInstance {
  // Перевіряємо чи є активний компонент Vue
  const instance = getCurrentInstance();

  if (instance) {
    // Всередині компонента - пробуємо отримати через inject
    const injectedI18n = inject(I18nInjectionKey, null);
    return injectedI18n || i18n;
  }

  // Поза компонентом - повертаємо глобальний інстанс
  return i18n;
}
