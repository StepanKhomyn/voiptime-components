import { type Ref } from 'vue';
import { type DatePickerType, type DatePickerValue, type DateValue } from './types';
export declare const useDateFormatter: () => {
    formatDate: (date: Date, formatStr: string) => string;
    parseDate: (value: DateValue) => Date | null;
    getWeekOfYear: (date: Date) => number;
    getDefaultFormat: (type: DatePickerType) => string;
};
export declare const useDatePicker: (modelValue: Ref<DatePickerValue>, type: Ref<DatePickerType>, format: Ref<string | undefined>, valueFormat: Ref<string | undefined>, rangeSeparator: Ref<string>, checkRequired?: boolean) => {
    isRange: import("vue").ComputedRef<boolean>;
    displayFormat: import("vue").ComputedRef<string>;
    outputFormat: import("vue").ComputedRef<string>;
    parsedValue: import("vue").ComputedRef<Date | (Date | null)[] | null>;
    displayText: import("vue").ComputedRef<string | string[]>;
    hasDisplayValue: import("vue").ComputedRef<string | boolean>;
    formatOutput: (date: Date | Date[]) => DatePickerValue;
    validate: () => {
        isValid: boolean;
        errors: string[];
    };
    formatDate: (date: Date, formatStr: string) => string;
    parseDate: (value: DateValue) => Date | null;
};
export declare const useCalendar: (currentDate: Ref<Date>) => {
    calendarDates: import("vue").ComputedRef<Date[]>;
    monthsInYear: import("vue").ComputedRef<{
        name: string;
        index: number;
        value: Date;
    }[]>;
    yearsInDecade: import("vue").ComputedRef<{
        year: number;
        value: Date;
    }[]>;
    decadeRange: import("vue").ComputedRef<string>;
    isDateInCurrentMonth: (date: Date) => boolean;
    isToday: (date: Date) => boolean;
    isSameDate: (date1: Date, date2: Date) => boolean;
    isSameMonth: (date1: Date, date2: Date) => boolean;
    isSameYear: (date1: Date, date2: Date) => boolean;
    navigateMonth: (direction: "prev" | "next") => void;
    navigateYear: (direction: "prev" | "next") => void;
    navigateDecade: (direction: "prev" | "next") => void;
};
//# sourceMappingURL=helpers.d.ts.map