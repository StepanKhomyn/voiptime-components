import type { VLocale } from './types';
import type { VLocaleSelectProps } from './types';
import { LANGUAGES } from '@/entry';
declare const _default: import("vue").DefineComponent<VLocaleSelectProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (value: LANGUAGES) => any;
    "update:modelValue": (value: LANGUAGES) => any;
}, string, import("vue").PublicProps, Readonly<VLocaleSelectProps> & Readonly<{
    onChange?: ((value: LANGUAGES) => any) | undefined;
    "onUpdate:modelValue"?: ((value: LANGUAGES) => any) | undefined;
}>, {
    modelValue: LANGUAGES;
    languages: VLocale[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=VLocaleSelect.vue.d.ts.map