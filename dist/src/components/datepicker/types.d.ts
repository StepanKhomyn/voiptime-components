import { LOCALE_KEYS } from '@/locales/types';
export type DatePickerType = 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'monthrange' | 'year' | 'yearrange';
export type DatePickerSize = 'small' | 'default' | 'large';
export type DateValue = string | number | Date;
export type DateRangeValue = [DateValue, DateValue];
export type DatePickerValue = DateValue | DateRangeValue | null | undefined;
export type TranslateFunction = (key: LOCALE_KEYS, params?: Record<string, string | number>) => string;
export interface VDatePickerProps {
    modelValue?: DatePickerValue;
    type?: DatePickerType;
    placeholder?: string;
    startPlaceholder?: string;
    endPlaceholder?: string;
    rangeSeparator?: string;
    format?: string;
    valueFormat?: string;
    disabled?: boolean;
    clearable?: boolean;
    size?: DatePickerSize;
    disabledDate?: (date: Date) => boolean;
    shortcuts?: DatePickerShortcut[];
    unlinkPanels?: boolean;
    defaultValue?: DatePickerValue;
    defaultTime?: string | string[];
    label?: string;
    outlined?: boolean;
    required?: boolean;
    id?: string;
    errorMessage?: string;
    helperText?: string;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
    showSeconds?: boolean;
    use12Hours?: boolean;
    disabledHours?: () => number[];
    disabledMinutes?: (selectedHour: number) => number[];
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
    hideDisabledOptions?: boolean;
    maxDateRange?: number;
    previousDateDisabled?: boolean;
}
export interface VDatePickerEmits {
    (e: 'update:modelValue', value: DatePickerValue): void;
    (e: 'change', value: DatePickerValue): void;
    (e: 'blur', instance: any): void;
    (e: 'focus', instance: any): void;
    (e: 'calendar-change', value: [Date, Date | null]): void;
    (e: 'panel-change', value: Date, mode: string, view: string): void;
    (e: 'open-change', open: boolean): void;
}
export interface DatePickerShortcut {
    text: string;
    value: () => DatePickerValue;
}
export interface VDatePickerMethods {
    focus(): void;
    blur(): void;
    handleOpen(): void;
    handleClose(): void;
}
export interface FormatToken {
    pattern: RegExp;
    replacement: (date: Date) => string;
}
export declare const FORMAT_TOKENS: Record<string, FormatToken>;
export declare const useDateLocale: () => {
    months: import("vue").ComputedRef<string[]>;
    monthsShort: import("vue").ComputedRef<string[]>;
    weekdays: import("vue").ComputedRef<string[]>;
    weekdaysShort: import("vue").ComputedRef<string[]>;
};
export declare const DEFAULT_FORMATS: Record<DatePickerType, string>;
export interface DateValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare const isValidDate: (value: any) => boolean;
export declare const validateDateValue: (value: DatePickerValue | null | undefined, type: DatePickerType, required?: boolean) => DateValidationResult;
//# sourceMappingURL=types.d.ts.map