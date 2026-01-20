// locales/index.ts - ТІЛЬКИ для внутрішнього використання
import { type App, computed, type ComputedRef, readonly, ref } from 'vue';
import { LANGUAGES, LOCALE_KEYS } from './types';
import { translations } from './translations';

export interface I18nInstance {
  locale: ComputedRef<LANGUAGES>;
  t: (key: LOCALE_KEYS, params?: Record<string, string | number>) => string;
  setLocale: (locale: LANGUAGES) => void;
  getAvailableLocales: () => LANGUAGES[];
}

export interface I18nOptions {
  locale?: LANGUAGES;
}

// Поточна мова (реактивна)
const currentLocale = ref<LANGUAGES>(LANGUAGES.uk);

// Функція інтерполяції параметрів
function interpolate(message: string, params?: Record<string, string | number>): string {
  if (!params) return message;

  return message.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
}

// Отримати повідомлення
function getMessage(locale: LANGUAGES, key: LOCALE_KEYS): string | undefined {
  return translations[locale]?.[key];
}

// Функція перекладу
export function t(key: LOCALE_KEYS, params?: Record<string, string | number>): string {
  const message = getMessage(currentLocale.value, key);

  if (!message) {
    console.warn(`[VUI I18n] Translation key "${key}" not found for locale "${currentLocale.value}"`);
    return key;
  }

  return interpolate(message, params);
}

// Функція зміни мови
export function setLocale(locale: LANGUAGES): void {
  if (!translations[locale]) {
    console.warn(`[VUI I18n] Locale "${locale}" is not available`);
    return;
  }

  currentLocale.value = locale;
}

// Отримати доступні мови
export function getAvailableLocales(): LANGUAGES[] {
  return Object.values(LANGUAGES);
}

// Створення інстансу i18n
export function createI18n(options: I18nOptions = {}): I18nInstance {
  const { locale = LANGUAGES.uk } = options;

  if (translations[locale]) {
    currentLocale.value = locale;
  }

  return {
    locale: computed(() => currentLocale.value),
    t,
    setLocale,
    getAvailableLocales,
  };
}

// Глобальний інстанс
export const i18n = createI18n();

// Readonly версія поточної мови
export const locale = readonly(currentLocale);

// Vue плагін для i18n (внутрішній)
export const I18nPlugin = {
  install(app: App, options: I18nOptions = {}) {
    const i18nInstance = createI18n(options);

    // Надаємо глобальний доступ через provide/inject для внутрішніх компонентів
    app.provide('i18n', i18nInstance);
  },
};
