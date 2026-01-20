// locales/useI18n.ts - ТІЛЬКИ для внутрішнього використання в бібліотеці
import { inject, type InjectionKey } from 'vue';
import { i18n, type I18nInstance } from './index';

export const I18nInjectionKey: InjectionKey<I18nInstance> = Symbol('i18n');

/**
 * Composable для роботи з i18n всередині компонентів бібліотеки
 * ⚠️ Не експортується з головного index.ts - тільки для внутрішнього використання
 *
 * @internal
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useI18n } from '@/locales/useI18n';
 * import { LOCALE_KEYS } from '@/locales/types';
 *
 * const { t } = useI18n();
 *
 * const emptyText = computed(() => t(LOCALE_KEYS.TABLE_EMPTY));
 * </script>
 *
 * <template>
 *   <div>{{ emptyText }}</div>
 * </template>
 * ```
 */
export function useI18n(): I18nInstance {
  const injectedI18n = inject(I18nInjectionKey, null);
  return injectedI18n || i18n;
}
