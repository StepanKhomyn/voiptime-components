import type { SliderValue } from './types';
import type { VSliderProps } from './types';
declare const _default: import("vue").DefineComponent<VSliderProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (value: SliderValue) => any;
    input: (value: SliderValue) => any;
    "update:modelValue": (value: SliderValue) => any;
}, string, import("vue").PublicProps, Readonly<VSliderProps> & Readonly<{
    onChange?: ((value: SliderValue) => any) | undefined;
    onInput?: ((value: SliderValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: SliderValue) => any) | undefined;
}>, {
    height: string;
    disabled: boolean;
    modelValue: SliderValue;
    range: boolean;
    vertical: boolean;
    min: number;
    max: number;
    step: number;
    showInput: boolean;
    showInputControls: boolean;
    inputSize: import("./types").SliderInputSize;
    showStops: boolean;
    showTooltip: boolean;
    debounce: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=VSlider.vue.d.ts.map