import { type InjectionKey } from 'vue';
import { type I18nInstance } from './index';
export declare const I18nInjectionKey: InjectionKey<I18nInstance>;
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
export declare function useI18n(): I18nInstance;
//# sourceMappingURL=useI18n.d.ts.map