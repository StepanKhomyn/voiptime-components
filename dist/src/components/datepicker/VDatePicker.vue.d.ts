import { type VDatePickerProps } from '@/components/datepicker/types';
declare const _default: import("vue").DefineComponent<VDatePickerProps, {
    focus: () => void;
    blur: () => void;
    open: () => void;
    close: () => void;
    validate: () => {
        isValid: boolean;
        errors: string[];
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    blur: any;
    change: any;
    focus: any;
    "update:modelValue": any;
    "calendar-change": any;
    "open-change": any;
    "panel-change": any;
}, string, import("vue").PublicProps, Readonly<VDatePickerProps> & Readonly<{
    onBlur?: ((...args: any) => any) | undefined;
    onChange?: ((...args: any) => any) | undefined;
    onFocus?: ((...args: any) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any) => any) | undefined;
    "onCalendar-change"?: ((...args: any) => any) | undefined;
    "onOpen-change"?: ((...args: any) => any) | undefined;
    "onPanel-change"?: ((...args: any) => any) | undefined;
}>, {
    disabled: boolean;
    clearable: boolean;
    placeholder: string;
    outlined: boolean;
    required: boolean;
    type: import("@/components/datepicker/types").DatePickerType;
    size: import("@/components/datepicker/types").DatePickerSize;
    startPlaceholder: string;
    endPlaceholder: string;
    rangeSeparator: string;
    format: string;
    valueFormat: string;
    hourStep: number;
    minuteStep: number;
    secondStep: number;
    showSeconds: boolean;
    use12Hours: boolean;
    hideDisabledOptions: boolean;
    maxDateRange: number;
    previousDateDisabled: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=VDatePicker.vue.d.ts.map