export type TimePickerType = 'time' | 'timerange';
export type TimePickerSize = 'small' | 'default' | 'large';
export type TimeValue = string | Date;
export type TimeRangeValue = [TimeValue, TimeValue];
export type TimePickerValue = TimeValue | TimeRangeValue | null | undefined;
export interface VTimePickerProps {
    modelValue?: TimePickerValue;
    type?: TimePickerType;
    placeholder?: string;
    startPlaceholder?: string;
    endPlaceholder?: string;
    rangeSeparator?: string;
    format?: string;
    disabled?: boolean;
    clearable?: boolean;
    outlined?: boolean;
    size?: TimePickerSize;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
    showSeconds?: boolean;
    use12Hours?: boolean;
    disabledHours?: () => number[];
    disabledMinutes?: (selectedHour: number) => number[];
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
    hideDisabledOptions?: boolean;
    label?: string;
    helperText?: string;
    errorMessage?: string;
    required?: boolean;
}
export interface VTimePickerEmits {
    (e: 'update:modelValue', value: TimePickerValue): void;
    (e: 'change', value: TimePickerValue): void;
    (e: 'blur', instance: any): void;
    (e: 'focus', instance: any): void;
    (e: 'open-change', open: boolean): void;
}
export interface VTimePickerMethods {
    focus(): void;
    blur(): void;
    open(): void;
    close(): void;
}
export interface TimeObject {
    hour: number;
    minute: number;
    second: number;
    period?: 'AM' | 'PM';
}
export interface TimeValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare const DEFAULT_TIME_FORMATS: {
    readonly '24h': "HH:mm:ss";
    readonly '24h_no_seconds': "HH:mm";
    readonly '12h': "hh:mm:ss A";
    readonly '12h_no_seconds': "hh:mm A";
};
export declare const isValidTimeString: (timeStr: string) => boolean;
export declare const validateTimeValue: (value: TimePickerValue, type: TimePickerType, required?: boolean) => TimeValidationResult;
export declare const formatTime: (hour: number, minute: number, second?: number, format?: string, use12Hours?: boolean) => string;
export declare const parseTimeString: (timeStr: string) => TimeObject | null;
export declare const generateTimeOptions: (min?: number, max?: number, step?: number, disabled?: number[]) => Array<{
    value: number;
    label: string;
    disabled: boolean;
}>;
//# sourceMappingURL=types.d.ts.map