import type { VtInputProps } from './types';
declare const _default: import("vue").DefineComponent<VtInputProps, {
    focus(): void;
    blur(): void;
    select(): void;
    clear(): void;
    validate(): boolean;
    clearValidation(): void;
    getInputElement(): HTMLInputElement | HTMLTextAreaElement | null;
    getValidationState(): import("./types").VtInputValidationResult;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    blur: (event: FocusEvent) => any;
    change: (event: Event) => any;
    click: (event: MouseEvent) => any;
    focus: (event: FocusEvent) => any;
    input: (event: Event) => any;
    keydown: (event: KeyboardEvent) => any;
    keypress: (event: KeyboardEvent) => any;
    keyup: (event: KeyboardEvent) => any;
    "update:modelValue": (value: string | number) => any;
    clear: () => any;
    validation: (result: import("./types").VtInputValidationResult) => any;
}, string, import("vue").PublicProps, Readonly<VtInputProps> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((event: Event) => any) | undefined;
    onClick?: ((event: MouseEvent) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    onInput?: ((event: Event) => any) | undefined;
    onKeydown?: ((event: KeyboardEvent) => any) | undefined;
    onKeypress?: ((event: KeyboardEvent) => any) | undefined;
    onKeyup?: ((event: KeyboardEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string | number) => any) | undefined;
    onClear?: (() => any) | undefined;
    onValidation?: ((result: import("./types").VtInputValidationResult) => any) | undefined;
}>, {
    resize: import("./types").VtInputResize;
    type: import("./types").VtInputType;
    disabled: boolean;
    clearable: boolean;
    validateOnInput: boolean;
    validateOnBlur: boolean;
    status: import("./types").VtInputStatus;
    outlined: boolean;
    size: import("./types").VtInputSize;
    showPassword: boolean;
    rows: number;
    autosize: boolean | import("./types").VtInputAutosizeConfig;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=VInput.vue.d.ts.map