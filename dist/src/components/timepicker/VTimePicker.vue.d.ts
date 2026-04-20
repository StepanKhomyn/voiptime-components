import { type TimePickerValue, type VTimePickerProps } from '@/components/timepicker/types';
declare const _default: import("vue").DefineComponent<VTimePickerProps, {
    focus: () => void;
    blur: () => void;
    open: () => void;
    close: () => void;
    validate: (value: TimePickerValue, required?: boolean) => import("@/components/timepicker/types").TimeValidationResult;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    blur: (instance: any) => any;
    change: (value: TimePickerValue) => any;
    focus: (instance: any) => any;
    "update:modelValue": (value: TimePickerValue) => any;
    "open-change": (open: boolean) => any;
}, string, import("vue").PublicProps, Readonly<VTimePickerProps> & Readonly<{
    onBlur?: ((instance: any) => any) | undefined;
    onChange?: ((value: TimePickerValue) => any) | undefined;
    onFocus?: ((instance: any) => any) | undefined;
    "onUpdate:modelValue"?: ((value: TimePickerValue) => any) | undefined;
    "onOpen-change"?: ((open: boolean) => any) | undefined;
}>, {
    type: import("@/components/timepicker/types").TimePickerType;
    disabled: boolean;
    clearable: boolean;
    placeholder: string;
    outlined: boolean;
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