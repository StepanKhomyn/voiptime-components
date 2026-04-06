import { type App, type ComputedRef } from 'vue';
import { LANGUAGES, LOCALE_KEYS } from './types';
export interface I18nInstance {
    locale: ComputedRef<LANGUAGES>;
    t: (key: LOCALE_KEYS, params?: Record<string, string | number>) => string;
    setLocale: (locale: LANGUAGES) => void;
    getAvailableLocales: () => LANGUAGES[];
}
export interface I18nOptions {
    locale?: LANGUAGES;
}
export declare function t(key: LOCALE_KEYS, params?: Record<string, string | number>): string;
export declare function setLocale(locale: LANGUAGES): void;
export declare function getAvailableLocales(): LANGUAGES[];
export declare function createI18n(options?: I18nOptions): I18nInstance;
export declare const i18n: I18nInstance;
export declare const locale: Readonly<import("vue").Ref<LANGUAGES, LANGUAGES>>;
export declare const I18nPlugin: {
    install(app: App, options?: I18nOptions): void;
};
//# sourceMappingURL=index.d.ts.map