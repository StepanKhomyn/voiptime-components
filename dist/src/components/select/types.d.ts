import type { InjectionKey } from 'vue';
import type { IconName } from '@/icons';
import { LANGUAGES } from '@/locales/types';
export type VtSelectStatus = 'default' | 'success' | 'error' | 'warning';
export interface VtSelectOption {
    label: any;
    value: any;
    disabled?: boolean;
    [key: string]: any;
}
export interface VtSelectProps {
    modelValue?: any;
    options?: VtSelectOption[];
    multiple?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    filterable?: boolean;
    loading?: boolean;
    placeholder?: string;
    noDataText?: string;
    loadingText?: string;
    maxHeight?: number;
    maxOptionsHeight?: number;
    collapsedTags?: boolean;
    validateOnInput?: boolean;
    validateOnBlur?: boolean;
    placement?: string;
    trigger?: string;
    showTimeout?: number;
    hideTimeout?: number;
    status?: 'default' | 'success' | 'warning' | 'error';
    label?: string;
    outlined?: boolean;
    id?: string;
    required?: boolean;
    requiredMessage?: string;
    valueKey?: string;
    errorMessage?: string;
    filterPlaceholder?: string;
    allowRemoteFilter?: boolean;
}
export interface VtSelectEmits {
    (e: 'update:modelValue', value: any): void;
    (e: 'change', value: any): void;
    (e: 'clear'): void;
    (e: 'focus'): void;
    (e: 'blur'): void;
    (e: 'visible-change', visible: boolean): void;
    (e: 'validation', result: {
        isValid: boolean;
        errors: string[];
    }): void;
    (e: 'scrolled'): void;
    (e: 'remove-tag', value: any): void;
    (e: 'filter', query: string): void;
    (e: 'filter-clear'): void;
}
export interface VtOptionEmits {
    click: [option: VtSelectOption];
}
export interface VLocale {
    value: LANGUAGES;
    locale: string;
    icon: IconName;
}
export interface VLocaleSelectProps {
    modelValue?: LANGUAGES;
    languages?: VLocale[];
}
export interface VLocaleEmits {
    (e: 'update:modelValue', value: LANGUAGES): void;
    (e: 'change', value: LANGUAGES): void;
}
export interface VtSelectContext {
    selectValue: any;
    multiple: boolean;
    valueKey?: string;
    handleOptionClick: (option: VtSelectOption) => void;
    isOptionSelected: (value: any) => boolean;
    registerOption: (option: VtSelectOption, slotContent?: any) => void;
    unregisterOption: (value: any) => void;
}
export interface VtSelectMethods {
    registerOption: (option: VtSelectOption, slotContent?: any) => void;
    unregisterOption: (value: any) => void;
    focus(): void;
    blur(): void;
    clear(): void;
    validate(): boolean;
    clearValidation(): void;
    getSelectedOptions(): VtSelectOption[];
    getValidationState(): {
        isValid: boolean;
        errors: string[];
    };
    setFilter(query: string): void;
    clearFilter(): void;
    getFilterQuery(): string;
}
export declare const VtSelectContextKey: InjectionKey<VtSelectContext>;
//# sourceMappingURL=types.d.ts.map