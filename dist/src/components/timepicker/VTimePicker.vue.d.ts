import { type TimePickerValue, type VTimePickerProps } from '@/components/timepicker/types';
declare const _default: import("vue").DefineComponent<VTimePickerProps, {
    focus: () => void;
    blur: () => void;
    open: () => void;
    close: () => void;
    validate: (value: TimePickerValue, required?: boolean) => import("@/components/timepicker/types").TimeValidationResult;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    blur: any;
    change: any;
    focus: any;
    "update:modelValue": any;
    "open-change": any;
}, string, import("vue").PublicProps, Readonly<VTimePickerProps> & Readonly<{
    onBlur?: ((...args: any) => any) | undefined;
    onChange?: ((...args: any) => any) | undefined;
    onFocus?: ((...args: any) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any) => any) | undefined;
    "onOpen-change"?: ((...args: any) => any) | undefined;
}>, {
    disabled: boolean;
    clearable: boolean;
    placeholder: string;
    outlined: boolean;
    type: import("@/components/timepicker/types").TimePickerType;
    size: import("@/components/timepicker/types").TimePickerSize;
    startPlaceholder: string;
    endPlaceholder: string;
    rangeSeparator: string;
    format: string;
    hourStep: number;
    minuteStep: number;
    secondStep: number;
    showSeconds: boolean;
    use12Hours: boolean;
    hideDisabledOptions: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=VTimePicker.vue.d.ts.map