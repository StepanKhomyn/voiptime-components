import type { SliderValue } from './types';
import type { VSliderProps } from './types';
declare const _default: import("vue").DefineComponent<VSliderProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: any;
    input: any;
    "update:modelValue": any;
}, string, import("vue").PublicProps, Readonly<VSliderProps> & Readonly<{
    onChange?: ((...args: any) => any) | undefined;
    onInput?: ((...args: any) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any) => any) | undefined;
}>, {
    height: string;
    disabled: boolean;
    modelValue: SliderValue;
    vertical: boolean;
    min: number;
    max: number;
    step: number;
    showInput: boolean;
    showInputControls: boolean;
    inputSize: import("./types").SliderInputSize;
    showStops: boolean;
    showTooltip: boolean;
    range: boolean;
    debounce: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=VSlider.vue.d.ts.map