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
    blur: (instance: any) => any;
    change: (value: import("@/components/datepicker/types").DatePickerValue) => any;
    focus: (instance: any) => any;
    "update:modelValue": (value: import("@/components/datepicker/types").DatePickerValue) => any;
    "calendar-change": (value: [Date, Date | null]) => any;
    "open-change": (open: boolean) => any;
    "panel-change": (value: Date, mode: string, view: string) => any;
}, string, import("vue").PublicProps, Readonly<VDatePickerProps> & Readonly<{
    onBlur?: ((instance: any) => any) | undefined;
    onChange?: ((value: import("@/components/datepicker/types").DatePickerValue) => any) | undefined;
    onFocus?: ((instance: any) => any) | undefined;
    "onUpdate:modelValue"?: ((value: import("@/components/datepicker/types").DatePickerValue) => any) | undefined;
    "onCalendar-change"?: ((value: [Date, Date | null]) => any) | undefined;
    "onOpen-change"?: ((open: boolean) => any) | undefined;
    "onPanel-change"?: ((value: Date, mode: string, view: string) => any) | undefined;
}>, {
    type: import("@/components/datepicker/types").DatePickerType;
    required: boolean;
    disabled: boolean;
    clearable: boolean;
    placeholder: string;
    outlined: boolean;
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