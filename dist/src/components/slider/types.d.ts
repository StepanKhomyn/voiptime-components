export type SliderValue = number | [number, number];
export interface SliderMarkItem {
    label: string;
    style?: Record<string, string>;
}
export type SliderMarks = Record<number, string | SliderMarkItem>;
export type SliderInputSize = 'large' | 'medium' | 'small' | 'mini';
export interface VSliderProps {
    modelValue?: SliderValue;
    min?: number;
    max?: number;
    disabled?: boolean;
    step?: number;
    showInput?: boolean;
    showInputControls?: boolean;
    inputSize?: SliderInputSize;
    showStops?: boolean;
    showTooltip?: boolean;
    formatTooltip?: (value: number) => string;
    range?: boolean;
    vertical?: boolean;
    height?: string;
    label?: string;
    debounce?: number;
    tooltipClass?: string;
    marks?: SliderMarks;
}
export interface VSliderEmits {
    (e: 'update:modelValue', value: SliderValue): void;
    (e: 'change', value: SliderValue): void;
    (e: 'input', value: SliderValue): void;
}
export interface VSingleMarkRangeProps {
    range: number[];
    modelValue?: number;
    disabled?: boolean;
    formatLabel?: (value: number) => string;
    label?: string;
}
export interface VSingleMarkRangeEmits {
    (e: 'update:modelValue', value: number): void;
    (e: 'change', value: number): void;
}
//# sourceMappingURL=types.d.ts.map