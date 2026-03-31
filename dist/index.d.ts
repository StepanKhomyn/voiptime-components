import { App } from 'vue';
import { Component } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { ComputedRef } from 'vue';
import { CreateComponentPublicInstanceWithMixins } from 'vue';
import { DefineComponent } from 'vue';
import { ExtractPropTypes } from 'vue';
import { GlobalComponents } from 'vue';
import { GlobalDirectives } from 'vue';
import { InjectionKey } from 'vue';
import { ObjectDirective } from 'vue';
import { PublicProps } from 'vue';
import { Ref } from 'vue';
import { VNode } from 'vue';

declare const __VLS_component: DefineComponent<VButtonProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    click: (event: MouseEvent) => any;
}, string, PublicProps, Readonly<VButtonProps> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
}>, {
    color: string;
    type: VButtonType;
    disabled: boolean;
    loading: boolean;
    tooltip: boolean;
    tooltipPlacement: TooltipPlacement;
    htmlType: "button" | "submit" | "reset";
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLButtonElement>;

declare const __VLS_component_10: DefineComponent<CollapseProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
    change: (value: string[]) => any;
    "update:modelValue": (value: string[]) => any;
}, string, PublicProps, Readonly<CollapseProps> & Readonly<{
    onChange?: ((value: string[]) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string[]) => any) | undefined;
}>, {
    accordion: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

declare const __VLS_component_11: DefineComponent<CollapseItemProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
    toggle: (name: string) => any;
}, string, PublicProps, Readonly<CollapseItemProps> & Readonly<{
    onToggle?: ((name: string) => any) | undefined;
}>, {
    disabled: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

declare const __VLS_component_12: DefineComponent<VTabsProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
    "update:modelValue": (value: string) => any;
    "tab-change": (value: string) => any;
    "tab-remove": (name: string) => any;
    "tab-add": () => any;
}, string, PublicProps, Readonly<VTabsProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    "onTab-change"?: ((value: string) => any) | undefined;
    "onTab-remove"?: ((name: string) => any) | undefined;
    "onTab-add"?: (() => any) | undefined;
}>, {
    modelValue: string | number;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
    navRef: HTMLDivElement;
    scrollableRef: HTMLDivElement;
}, HTMLDivElement>;

declare const __VLS_component_13: DefineComponent<ExtractPropTypes<{
    name: {
        type: (StringConstructor | NumberConstructor)[];
        required: true;
    };
    label: StringConstructor;
    disabled: BooleanConstructor;
    closable: BooleanConstructor;
    icon: StringConstructor;
    forceRender: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly< ExtractPropTypes<{
    name: {
        type: (StringConstructor | NumberConstructor)[];
        required: true;
    };
    label: StringConstructor;
    disabled: BooleanConstructor;
    closable: BooleanConstructor;
    icon: StringConstructor;
    forceRender: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    disabled: boolean;
    closable: boolean;
    forceRender: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;

declare const __VLS_component_14: DefineComponent<VAuthentificationProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
    auth: (payload: VAuthentificationData) => any;
}, string, PublicProps, Readonly<VAuthentificationProps> & Readonly<{
    onAuth?: ((payload: VAuthentificationData) => any) | undefined;
}>, {
    loading: boolean;
    privacyPolicyUrl: string;
    forgotPasswordUrl: string;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

declare const __VLS_component_15: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {
    dynamicFilterRef: HTMLDivElement;
    dropdownTriggerRef: HTMLDivElement;
    actionsRef: HTMLDivElement;
    measurementContainer: HTMLDivElement;
}, HTMLDivElement>;

declare const __VLS_component_2: DefineComponent<VModalProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
    close: () => any;
    "update:modelValue": (value: boolean) => any;
}, string, PublicProps, Readonly<VModalProps> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {
    size: VModalSize;
    showCloseButton: boolean;
    closeOnBackdropClick: boolean;
    zIndex: number;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, any>;

declare const __VLS_component_3: DefineComponent<VCheckboxProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    blur: (event: FocusEvent) => any;
    change: (value: boolean, event: Event) => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (value: boolean) => any;
}, string, PublicProps, Readonly<VCheckboxProps> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((value: boolean, event: Event) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {
    required: boolean;
    disabled: boolean;
    modelValue: boolean;
    size: "small" | "medium" | "large";
    checked: boolean;
    indeterminate: boolean;
    variant: "primary" | "success" | "warning" | "danger" | "info";
    isDouble: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLLabelElement>;

declare const __VLS_component_4: DefineComponent<VRadioboxProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    blur: (event: FocusEvent) => any;
    change: (value: any, event: Event) => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (value: any) => any;
}, string, PublicProps, Readonly<VRadioboxProps> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((value: any, event: Event) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
}>, {
    required: boolean;
    disabled: boolean;
    modelValue: any;
    size: "small" | "medium" | "large";
    checked: boolean;
    variant: "primary" | "success" | "warning" | "danger" | "info";
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLLabelElement>;

declare const __VLS_component_5: DefineComponent<__VLS_PublicProps, {
    toggleRowSelection: (row: Record<string, any>, selected?: boolean) => void;
    toggleAllSelection: () => void;
    selectAbsolutelyAll: () => void;
    clearSelection: () => void;
    getSelectionRows: () => Record<string, any>[];
    setSelectionRows: (rows: Record<string, any>[]) => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    "current-change": (payload: {
        currentRow: Record<string, any> | null;
        oldCurrentRow: Record<string, any> | null;
    }) => any;
    "selection-change": (payload: SelectionChangeEventData) => any;
    "row-reorder": (payload: RowReorderEventData) => any;
    "update:data": (data: Record<string, any>[]) => any;
    "sort-change": (payload: SortChangeEventData) => any;
    "row-click": (payload: {
        row: Record<string, any>;
        column: VTableColumnProps;
        event: Event;
    }) => any;
    "row-dblclick": (payload: {
        row: Record<string, any>;
        column: VTableColumnProps;
        event: Event;
    }) => any;
    "update:columns": (...args: unknown[]) => any;
    "column-pin": (payload: {
        column: VTableColumnProps;
        position: "left" | "right" | "none";
    }) => any;
    "column-resize": (payload: {
        column: VTableColumnProps;
        width: number;
        oldWidth?: number;
    }) => any;
    "column-visibility": (payload: {
        column: VTableColumnProps;
    }) => any;
    "column-sort": (payload: {
        column: VTableColumnProps;
        direction: "asc" | "desc" | null;
    }) => any;
    "columns-change": (columns: VTableColumnProps[]) => any;
    "infinity-scroll": () => any;
}, string, PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onCurrent-change"?: ((payload: {
        currentRow: Record<string, any> | null;
        oldCurrentRow: Record<string, any> | null;
    }) => any) | undefined;
    "onSelection-change"?: ((payload: SelectionChangeEventData) => any) | undefined;
    "onRow-reorder"?: ((payload: RowReorderEventData) => any) | undefined;
    "onUpdate:data"?: ((data: Record<string, any>[]) => any) | undefined;
    "onSort-change"?: ((payload: SortChangeEventData) => any) | undefined;
    "onRow-click"?: ((payload: {
        row: Record<string, any>;
        column: VTableColumnProps;
        event: Event;
    }) => any) | undefined;
    "onRow-dblclick"?: ((payload: {
        row: Record<string, any>;
        column: VTableColumnProps;
        event: Event;
    }) => any) | undefined;
    "onUpdate:columns"?: ((...args: unknown[]) => any) | undefined;
    "onColumn-pin"?: ((payload: {
        column: VTableColumnProps;
        position: "left" | "right" | "none";
    }) => any) | undefined;
    "onColumn-resize"?: ((payload: {
        column: VTableColumnProps;
        width: number;
        oldWidth?: number;
    }) => any) | undefined;
    "onColumn-visibility"?: ((payload: {
        column: VTableColumnProps;
    }) => any) | undefined;
    "onColumn-sort"?: ((payload: {
        column: VTableColumnProps;
        direction: "asc" | "desc" | null;
    }) => any) | undefined;
    "onColumns-change"?: ((columns: VTableColumnProps[]) => any) | undefined;
    "onInfinity-scroll"?: (() => any) | undefined;
}>, {
    maxHeight: number;
    selectable: boolean;
    columns: VTableColumnProps[];
    columnsSelector: VTableColumnGroup[];
    rowKey: string;
    showSummary: boolean;
    isAllSelect: boolean;
    selectionKey: string;
    defaultSelection: any[];
    selectOnClickRow: boolean;
    highlightCurrentRow: boolean;
    allData: Record<string, any>[];
    hideHeader: boolean;
    rowDraggable: boolean;
    showDragHandle: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
    tableWrapperRef: HTMLDivElement;
}, HTMLDivElement>;

declare const __VLS_component_6: DefineComponent<DropdownProps, {
    show: () => void;
    hide: () => void;
    visible: Ref<boolean, boolean>;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    click: (event: MouseEvent) => any;
    "visible-change": (visible: boolean) => any;
    command: (command: string | number) => any;
}, string, PublicProps, Readonly<DropdownProps> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
    "onVisible-change"?: ((visible: boolean) => any) | undefined;
    onCommand?: ((command: string | number) => any) | undefined;
}>, {
    disabled: boolean;
    trigger: DropdownTriggerType;
    placement: DropdownPlacement;
    showTimeout: number;
    hideTimeout: number;
    hideOnClick: boolean;
    maxHeight: string | number;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
    dropdownRef: HTMLDivElement;
    triggerRef: HTMLDivElement;
    menuRef: HTMLDivElement;
}, HTMLDivElement>;

declare const __VLS_component_7: DefineComponent<DropdownItemProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    click: (event: MouseEvent) => any;
}, string, PublicProps, Readonly<DropdownItemProps> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLLIElement>;

declare const __VLS_component_8: DefineComponent<VtSelectProps, {
    registerOption: (option: VtSelectOption, slotContent?: any) => void;
    unregisterOption: (value: any) => void;
    focus(): void;
    blur(): void;
    clear(): void;
    validate(): boolean;
    clearValidation(): void;
    getSelectedOptions(): VtSelectOption[];
    getValidationState(): {
        isValid: boolean;
        errors: string[];
    };
    setFilter(query: string): void;
    clearFilter(): void;
    getFilterQuery(): string;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, PublicProps, Readonly<VtSelectProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    disabled: boolean;
    loading: boolean;
    placeholder: string;
    trigger: string;
    placement: string;
    showTimeout: number;
    hideTimeout: number;
    status: "default" | "success" | "warning" | "error";
    clearable: boolean;
    outlined: boolean;
    validateOnInput: boolean;
    validateOnBlur: boolean;
    multiple: boolean;
    filterable: boolean;
    noDataText: string;
    loadingText: string;
    maxHeight: number;
    collapsedTags: boolean;
    filterPlaceholder: string;
    allowRemoteFilter: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
    selectRef: HTMLDivElement;
    triggerRef: HTMLDivElement;
    containerRef: HTMLDivElement;
    measureContainer: HTMLDivElement;
    dropdownRef: HTMLDivElement;
    filterInputRef: CreateComponentPublicInstanceWithMixins<Readonly< VtInputProps> & Readonly<{
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
        onValidation?: ((result: VtInputValidationResult) => any) | undefined;
    }>, {
        focus(): void;
        blur(): void;
        select(): void;
        clear(): void;
        validate(): boolean;
        clearValidation(): void;
        getInputElement(): HTMLInputElement | HTMLTextAreaElement | null;
        getValidationState(): VtInputValidationResult;
    }, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
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
        validation: (result: VtInputValidationResult) => any;
    }, PublicProps, {
        resize: VtInputResize;
        type: VtInputType;
        disabled: boolean;
        size: VtInputSize;
        status: VtInputStatus;
        clearable: boolean;
        showPassword: boolean;
        outlined: boolean;
        rows: number;
        autosize: boolean | VtInputAutosizeConfig;
        validateOnInput: boolean;
        validateOnBlur: boolean;
    }, false, {}, {}, GlobalComponents, GlobalDirectives, string, {
        textareaRef: HTMLTextAreaElement;
        inputRef: HTMLInputElement;
    }, HTMLDivElement, ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly< VtInputProps> & Readonly<{
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
        onValidation?: ((result: VtInputValidationResult) => any) | undefined;
    }>, {
        focus(): void;
        blur(): void;
        select(): void;
        clear(): void;
        validate(): boolean;
        clearValidation(): void;
        getInputElement(): HTMLInputElement | HTMLTextAreaElement | null;
        getValidationState(): VtInputValidationResult;
    }, {}, {}, {}, {
        resize: VtInputResize;
        type: VtInputType;
        disabled: boolean;
        size: VtInputSize;
        status: VtInputStatus;
        clearable: boolean;
        showPassword: boolean;
        outlined: boolean;
        rows: number;
        autosize: boolean | VtInputAutosizeConfig;
        validateOnInput: boolean;
        validateOnBlur: boolean;
    }> | null;
    scrollContainerRef: HTMLDivElement;
    setOptionRef: HTMLSpanElement;
}, HTMLDivElement>;

declare const __VLS_component_9: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    click: (option: VtSelectOption) => any;
}, string, PublicProps, Readonly<{}> & Readonly<{
    onClick?: ((option: VtSelectOption) => any) | undefined;
}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, any>;

declare type __VLS_Props = VTableProps;

declare type __VLS_Props_2 = {
    items: SidebarItemRaw[];
    collapsed: boolean;
    currentRoute?: string | null;
};

declare type __VLS_PublicProps = {
    'columns'?: VTableColumnProps[] | undefined;
} & __VLS_Props;

declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLButtonElement;
};

declare function __VLS_template_10(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};

declare function __VLS_template_11(): {
    attrs: Partial<{}>;
    slots: {
        title?(_: {
            isActive: boolean;
            title: string | undefined;
        }): any;
        default?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};

declare function __VLS_template_12(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {
        navRef: HTMLDivElement;
        scrollableRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};

declare function __VLS_template_13(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {};
    rootEl: any;
};

declare function __VLS_template_14(): {
    attrs: Partial<{}>;
    slots: {
        logo?(_: {}): any;
        greeting?(_: {}): any;
        'language-select'?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};

declare function __VLS_template_15(): {
    attrs: Partial<{}>;
    slots: Readonly<{
        default?: () => any[];
        actions?: () => any[];
    }> & {
        default?: () => any[];
        actions?: () => any[];
    };
    refs: {
        dynamicFilterRef: HTMLDivElement;
        dropdownTriggerRef: HTMLDivElement;
        actionsRef: HTMLDivElement;
        measurementContainer: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};

declare function __VLS_template_2(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {};
    rootEl: any;
};

declare function __VLS_template_3(): {
    attrs: Partial<{}>;
    slots: {
        label?(_: {}): any;
        default?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLLabelElement;
};

declare function __VLS_template_4(): {
    attrs: Partial<{}>;
    slots: {
        label?(_: {}): any;
        default?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLLabelElement;
};

declare function __VLS_template_5(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {
        tableWrapperRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};

declare function __VLS_template_6(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
        dropdown?(_: {}): any;
    };
    refs: {
        dropdownRef: HTMLDivElement;
        triggerRef: HTMLDivElement;
        menuRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};

declare function __VLS_template_7(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLLIElement;
};

declare function __VLS_template_8(): {
    attrs: Partial<{}>;
    slots: {
        selected?(_: {
            option: VtSelectOption;
        }): any;
        default?(_: {}): any;
    };
    refs: {
        selectRef: HTMLDivElement;
        triggerRef: HTMLDivElement;
        containerRef: HTMLDivElement;
        measureContainer: HTMLDivElement;
        dropdownRef: HTMLDivElement;
        filterInputRef: CreateComponentPublicInstanceWithMixins<Readonly< VtInputProps> & Readonly<{
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
            onValidation?: ((result: VtInputValidationResult) => any) | undefined;
        }>, {
            focus(): void;
            blur(): void;
            select(): void;
            clear(): void;
            validate(): boolean;
            clearValidation(): void;
            getInputElement(): HTMLInputElement | HTMLTextAreaElement | null;
            getValidationState(): VtInputValidationResult;
        }, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
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
            validation: (result: VtInputValidationResult) => any;
        }, PublicProps, {
            resize: VtInputResize;
            type: VtInputType;
            disabled: boolean;
            size: VtInputSize;
            status: VtInputStatus;
            clearable: boolean;
            showPassword: boolean;
            outlined: boolean;
            rows: number;
            autosize: boolean | VtInputAutosizeConfig;
            validateOnInput: boolean;
            validateOnBlur: boolean;
        }, false, {}, {}, GlobalComponents, GlobalDirectives, string, {
            textareaRef: HTMLTextAreaElement;
            inputRef: HTMLInputElement;
        }, HTMLDivElement, ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly< VtInputProps> & Readonly<{
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
            onValidation?: ((result: VtInputValidationResult) => any) | undefined;
        }>, {
            focus(): void;
            blur(): void;
            select(): void;
            clear(): void;
            validate(): boolean;
            clearValidation(): void;
            getInputElement(): HTMLInputElement | HTMLTextAreaElement | null;
            getValidationState(): VtInputValidationResult;
        }, {}, {}, {}, {
            resize: VtInputResize;
            type: VtInputType;
            disabled: boolean;
            size: VtInputSize;
            status: VtInputStatus;
            clearable: boolean;
            showPassword: boolean;
            outlined: boolean;
            rows: number;
            autosize: boolean | VtInputAutosizeConfig;
            validateOnInput: boolean;
            validateOnBlur: boolean;
        }> | null;
        scrollContainerRef: HTMLDivElement;
        setOptionRef: HTMLSpanElement;
    };
    rootEl: HTMLDivElement;
};

declare function __VLS_template_9(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {};
    rootEl: any;
};

declare type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;

declare type __VLS_TemplateResult_10 = ReturnType<typeof __VLS_template_10>;

declare type __VLS_TemplateResult_11 = ReturnType<typeof __VLS_template_11>;

declare type __VLS_TemplateResult_12 = ReturnType<typeof __VLS_template_12>;

declare type __VLS_TemplateResult_13 = ReturnType<typeof __VLS_template_13>;

declare type __VLS_TemplateResult_14 = ReturnType<typeof __VLS_template_14>;

declare type __VLS_TemplateResult_15 = ReturnType<typeof __VLS_template_15>;

declare type __VLS_TemplateResult_2 = ReturnType<typeof __VLS_template_2>;

declare type __VLS_TemplateResult_3 = ReturnType<typeof __VLS_template_3>;

declare type __VLS_TemplateResult_4 = ReturnType<typeof __VLS_template_4>;

declare type __VLS_TemplateResult_5 = ReturnType<typeof __VLS_template_5>;

declare type __VLS_TemplateResult_6 = ReturnType<typeof __VLS_template_6>;

declare type __VLS_TemplateResult_7 = ReturnType<typeof __VLS_template_7>;

declare type __VLS_TemplateResult_8 = ReturnType<typeof __VLS_template_8>;

declare type __VLS_TemplateResult_9 = ReturnType<typeof __VLS_template_9>;

declare type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_10<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_11<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_12<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_13<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_14<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_15<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_2<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_3<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_4<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_5<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_6<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_7<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_8<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_9<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type AnyObject = Record<string, any>;

export declare interface CollapseContext {
    readonly activeNames: string[];
    readonly accordion: boolean;
    toggle: (name: string) => void;
}

export declare interface CollapseEmits {
    (e: 'update:modelValue', value: string[]): void;
    (e: 'change', value: string[]): void;
}

export declare interface CollapseItemEmits {
    (e: 'toggle', name: string): void;
}

export declare interface CollapseItemProps {
    title?: string;
    name: string;
    disabled?: boolean;
}

export declare interface CollapseProps {
    modelValue: string[];
    accordion?: boolean;
}

export declare const containUpperCaseLetter: ValidatorFn;

export declare interface DatePickerShortcut {
    text: string;
    value: () => DatePickerValue;
}

export declare type DatePickerSize = 'small' | 'default' | 'large';

export declare type DatePickerType = 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'monthrange' | 'year' | 'yearrange';

export declare type DatePickerValue = DateValue | DateRangeValue | null | undefined;

export declare type DateRangeValue = [DateValue, DateValue];

export declare interface DateValidationResult {
    isValid: boolean;
    errors: string[];
}

export declare type DateValue = string | number | Date;

export declare const DEFAULT_COLUMN_CONFIG: {
    readonly sortable: true;
    readonly actionColumn: false;
    readonly showOverflowTooltip: true;
    readonly visible: true;
    readonly pinnedLeft: false;
    readonly pinnedRight: false;
    readonly manage: false;
};

export declare const DEFAULT_FORMATS: Record<DatePickerType, string>;

export declare const DEFAULT_TIME_FORMATS: {
    readonly '24h': "HH:mm:ss";
    readonly '24h_no_seconds': "HH:mm";
    readonly '12h': "hh:mm:ss A";
    readonly '12h_no_seconds': "hh:mm A";
};

export declare interface DropdownContext {
    handleCommand: (command: string | number) => void;
    hideOnClick: boolean;
}

export declare const DropdownContextKey: InjectionKey<DropdownContext>;

export declare interface DropdownEmits {
    'visible-change': [visible: boolean];
    click: [event: MouseEvent];
    command: [command: string | number];
}

export declare interface DropdownExpose {
    show: () => void;
    hide: () => void;
    visible: Ref<boolean>;
}

export declare interface DropdownItemEmits {
    click: [event: MouseEvent];
}

export declare interface DropdownItemProps {
    command?: string | number;
    disabled?: boolean;
    divided?: boolean;
    icon?: string;
}

export declare type DropdownPlacement = 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end';

export declare interface DropdownProps {
    trigger?: DropdownTriggerType;
    placement?: DropdownPlacement;
    disabled?: boolean;
    splitButton?: boolean;
    hideOnClick?: boolean;
    showTimeout?: number;
    hideTimeout?: number;
    tabindex?: number;
    maxHeight?: string | number;
}

export declare type DropdownTriggerType = 'click' | 'hover';

export declare const email: ValidatorFn;

export declare interface FieldValidation {
    $model: any;
    $dirty: boolean;
    $touched: boolean;
    $error: boolean;
    $invalid: boolean;
    $errors: Array<{
        $message: string;
        $validator: string;
        $params?: any;
        $pending?: boolean;
    }>;
    $pending: boolean;
    $params?: Record<string, any>;
    $touch(): void;
    $reset(): void;
    $validate(): Promise<boolean>;
}

export declare class FileParser {
    private static workerPool;
    static getWorkerPool(): WorkerPool;
    static isDataFile(file: File): boolean;
    static parseFile(file: File, maxRows?: number, returnData?: boolean): Promise<ParseResult>;
    static terminateWorkers(): void;
}

export declare class FileValidator {
    static validateSize(file: File, maxSize?: number): boolean;
    static validateType(file: File, accept?: string): boolean;
    static formatFileSize(bytes: number): string;
    static generateId(): string;
}

export declare const FORMAT_TOKENS: Record<string, FormatToken>;

export declare const formatTime: (hour: number, minute: number, second?: number, format?: string, use12Hours?: boolean) => string;

export declare interface FormatToken {
    pattern: RegExp;
    replacement: (date: Date) => string;
}

export declare const generateTimeOptions: (min?: number, max?: number, step?: number, disabled?: number[]) => Array<{
    value: number;
    label: string;
    disabled: boolean;
}>;

export declare type IconName = keyof typeof icons;

declare const icons: {
    readonly addLine: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly channelsChange: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly circleChecked: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly circleClose: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly close: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly delete: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly download: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly edit: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly forward: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly goTo: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly listBulletHorizontal: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly listBullet: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly lock: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly paperClip: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly plusRound: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly prompt: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly prompter: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly reply: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly save: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly star: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly statusChange2: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly statusChange: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly unlock: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly uploadCloud: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly usersGroup: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly arrowDown: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly arrowLeft: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly arrowReload: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly arrowRight: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly arrowTop: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly addNumber: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly answerCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clientCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly hangupCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly inboundCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly keyboardCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly microphoneCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly outboundCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly ownCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneActiveTalk: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneArrowDown: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneCalling: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneCancelRecall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneExecuteRecall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneHangup: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneInactiveTalk: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneOffline: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneRecall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneTalking: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneTransfer: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly phoneUnavailable: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly scenarioCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly telemarketCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly transferCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly volumeCall: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatAttention: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatBlock: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatCheck: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatDabble: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatDelete: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatFlash: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatForward: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatIn: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatOut: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatRemove: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatStar: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly chatTag: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly facebookEChat: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly facebook: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly instagram: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly telegramEChat: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly telegram: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly viberEChat: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly viber: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly whatsUp: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly widget: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clientActivity: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clientComment: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clientContacts: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clientDigitalChannel: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clientHistory: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clientLocation: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clientSocial: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clientTask: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clientVoiceChannel: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly azerbaijan: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly kazakhstan: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly polan: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly terrorist: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly thailand: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly ukraine: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly unitedKingdom: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly emptyImg: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly fileChoose: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly fileDoc: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly fileSign: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterAdd: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterAdvanced: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterDateCheck: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterEdit: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterExchange: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterMultiselect: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterNew: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterReset: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterSave: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly alertCircle: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly alertTriangle: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly calendar: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly checkCircle: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clock: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly eyeClosed: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly eyeOpened: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly infoCircle: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly search: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly url: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly emailDeleted: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly emailDraft: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly email: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly emailIncoming: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly emailNew: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly emailOutgoing: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly emailQueue: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly emailSpam: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly add: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly diamondInSquare: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly dsr: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly emptyRound: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly hold: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly import: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly ivr: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly minus: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly nodeTree: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly notification: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly notificationRead: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly plus: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly predictive: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly preview: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly prioritySelect: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly progressive: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly schedule: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly sms: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly starFilled: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly statisticDetail: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly statisticSummary: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly statusSelect: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly taskSelect: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly transcription: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly transcriptionStart: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly windowStart: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly operator: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly pause: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly start: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly stop: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly anketBlock: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly callSubject: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly iframBlock: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly infoBlock: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly proposalBlock: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly variable: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly comment: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly timeManagementCircle: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly timer: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly callQuality: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly callQualityStatistic: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly clients: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly collection: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly crm: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly dashboard: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly group: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly home: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly iTR: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly integration: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly ivr2: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly pbx: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly scenario: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly scenarios: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly settings: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly tasks: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly users: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly wFM: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly statsDiagramPie: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly columnInsert: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly columnsMove: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly empty: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly excel: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly freeze: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly listAdd: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly numberList: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly tableSettings: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly twoColumns: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly twoRows: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly unfreeze: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
};

export declare const install: (app: App, options?: VUIPluginOptions) => void;

export declare const isValidDate: (value: any) => boolean;

export declare const isValidTimeString: (timeStr: string) => boolean;

export declare enum LANGUAGES {
    en = "en",// Англійська
    uk = "uk",// Українська
    ru = "ru"
}

export declare const loaderDirective: ObjectDirective;

export declare const maxLength: (max: number) => ValidatorFn;

export declare const maxNumber: (max: number) => ValidatorFn;

export declare const messageManager: VMessageManager;

export declare const minLength: (min: number) => ValidatorFn;

export declare const minNumber: (min: number) => ValidatorFn;

export declare function mk<V extends ValidatorFn>(opts: {
    name?: string;
    params?: Record<string, any>;
    message?: string | ((params?: any) => string);
    async?: boolean;
}, validator: V): WrappedValidator;

export declare const modalManager: VModalManager;

export declare const noSpaces: ValidatorFn;

export declare const numeric: ValidatorFn;

export declare interface PaginationCalculations {
    /** Обчислює загальну кількість сторінок */
    getTotalPages(totalItems: number, pageSize: number): number;
    /** Обчислює індекс першого елемента */
    getFromItem(currentPage: number, pageSize: number): number;
    /** Обчислює індекс останнього елемента */
    getToItem(currentPage: number, pageSize: number, totalItems: number): number;
    /** Генерує масив видимих сторінок для навігації */
    getVisiblePages(currentPage: number, totalPages: number, maxVisible: number): (number | string)[];
}

export declare interface PaginationChangeData {
    /** Номер поточної сторінки */
    page: number;
    /** Розмір сторінки */
    pageSize: number;
}

export declare interface PaginationEmits {
    /** Емітується при зміні поточної сторінки */
    (e: 'update:currentPage', page: number): void;
    /** Емітується при зміні розміру сторінки */
    (e: 'update:pageSize', size: number): void;
    /** Емітується при будь-якій зміні пагінації */
    (e: 'pageChange', data: PaginationChangeData): void;
    /** Емітується при натисканні на кнопку */
    (e: 'reloadData', page: number): void;
}

export declare interface PaginationProps {
    /** Загальна кількість елементів */
    totalItems: number;
    /** Кількість елементів на сторінку */
    pageSize?: number;
    /** Поточна сторінка */
    currentPage?: number;
    /** Опції для вибору кількості рядків на сторінку */
    pageSizeOptions?: number[];
    /** Максимальна кількість видимих сторінок в навігації */
    maxVisiblePages?: number;
}

export declare interface PaginationState {
    /** Поточна сторінка */
    currentPage: number;
    /** Розмір сторінки */
    pageSize: number;
    /** Загальна кількість сторінок */
    totalPages: number;
    /** Індекс першого елемента на поточній сторінці */
    fromItem: number;
    /** Індекс останнього елемента на поточній сторінці */
    toItem: number;
}

export declare interface ParseResult {
    sheets: SheetParseResult[];
    rows: number;
    columns: string[];
    data?: any[];
}

export declare const parseTimeString: (timeStr: string) => TimeObject | null;

export declare const pattern: (regex: RegExp, message?: string) => ValidatorFn;

export declare const phoneNumber: ValidatorFn;

declare interface Props {
    name: IconName;
    width?: string | number;
    height?: string | number;
    color?: string;
}

export declare const required: ValidatorFn;

export declare interface ResizeState {
    resizingCol: VTableColumnProps | null;
    startX: number;
    startWidth: number;
}

declare interface RowReorderEventData {
    oldIndex: number;
    newIndex: number;
    row: Record<string, any>;
    newData: Record<string, any>[];
}

export declare type RulesObject = {
    [key: string]: ValidatorFn[] | ValidatorFn | RulesObject | (() => ValidatorFn[] | RulesObject);
};

export declare const sameAs: (compare: () => any, msg?: string) => ValidatorFn;

export declare interface SelectionChangeEventData {
    selection: Record<string, any>[];
    row?: Record<string, any>;
    selected?: boolean;
    isAllSelected?: boolean;
}

export declare function setLocale(locale: LANGUAGES): void;

export declare interface SheetParseResult {
    name: string;
    rows: number;
    columns: string[];
    data?: any[];
}

declare interface SidebarItemRaw {
    i18n: string;
    icon?: string;
    route?: string;
    extension?: string;
    implemented?: boolean;
    children?: SidebarItemRaw[];
}

export declare interface SortChangeEventData {
    column: VTableColumnProps;
    direction: SortDirection | null;
    prop: string;
    sortedData: Record<string, any>[];
}

export declare type SortDirection = 'asc' | 'desc';

export declare interface SortState {
    prop: string;
    direction: SortDirection;
}

export declare type StickyPosition = 'left' | 'right';

export declare interface TimeObject {
    hour: number;
    minute: number;
    second: number;
    period?: 'AM' | 'PM';
}

export declare type TimePickerSize = 'small' | 'default' | 'large';

export declare type TimePickerType = 'time' | 'timerange';

export declare type TimePickerValue = TimeValue | TimeRangeValue | null | undefined;

export declare type TimeRangeValue = [TimeValue, TimeValue];

export declare interface TimeValidationResult {
    isValid: boolean;
    errors: string[];
}

export declare type TimeValue = string | Date;

export declare const tooltipDirective: ObjectDirective;

export declare type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export declare const uniqueAsync: (checkFn: (val: any) => Promise<boolean>, message?: string) => ValidatorFn;

export declare interface UploadError {
    type: 'size' | 'type' | 'count' | 'parse';
    message: string;
    file?: File;
}

export declare interface UploadFile {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress?: number;
    error?: string;
}

export declare const url: ValidatorFn;

/**
 * Build validation tree recursively
 */
export declare function useValidate(rulesOrFactory: RulesObject | (() => RulesObject), state: AnyObject | any, globalOpts?: {
    silentErrors?: boolean;
}): ValidationGroup;

export declare const validateDateValue: (value: DatePickerValue | null | undefined, type: DatePickerType, required?: boolean) => DateValidationResult;

export declare const validateTimeValue: (value: TimePickerValue, type: TimePickerType, required?: boolean) => TimeValidationResult;

export declare type ValidationGroup = {
    [key: string]: ValidationNode;
} & {
    $validate(): Promise<boolean>;
    $touch(): void;
    $reset(): void;
    $anyDirty: ComputedRef<boolean>;
    $anyInvalid: ComputedRef<boolean>;
    $anyError: ComputedRef<boolean>;
    $pending: ComputedRef<boolean>;
    $silentErrors?: boolean;
    $externalResults?: Array<any>;
    $addExternalResults?(res: any): void;
    $clearExternalResults?(): void;
};

export declare type ValidationNode = FieldValidation | ValidationGroup;

export declare type ValidatorFn = (value: any, vm?: any, sibling?: any) => ValidatorResult;

export declare type ValidatorResult = boolean | string | Promise<boolean | string>;

export declare interface VAuthentificationData {
    username: string;
    password: string;
    remember: boolean;
}

export declare interface VAuthentificationEmits {
    (e: 'auth', payload: VAuthentificationData): void;
}

export declare interface VAuthentificationProps {
    loading?: boolean;
    privacyPolicyUrl?: string;
    forgotPasswordUrl?: string;
}

export declare const VButton: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;

export declare interface VButtonEmits {
    click: [event: MouseEvent];
}

export declare interface VButtonProps {
    type?: VButtonType;
    shape?: VButtonShape;
    disabled?: boolean;
    loading?: boolean;
    icon?: IconName;
    tooltip?: boolean;
    tooltipPlacement?: TooltipPlacement;
    htmlType?: 'button' | 'submit' | 'reset';
    color?: string;
}

declare type VButtonShape = 'circle' | 'square';

export declare type VButtonType = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info';

export declare const VCheckbox: __VLS_WithTemplateSlots_3<typeof __VLS_component_3, __VLS_TemplateResult_3["slots"]>;

export declare interface VCheckboxEmits {
    'update:modelValue': [value: boolean];
    change: [value: boolean, event: Event];
    focus: [event: FocusEvent];
    blur: [event: FocusEvent];
}

export declare interface VCheckboxProps {
    modelValue?: boolean;
    checked?: boolean;
    label?: string;
    disabled?: boolean;
    id?: string;
    name?: string;
    value?: string | number;
    indeterminate?: boolean;
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    required?: boolean;
    isDouble?: boolean;
}

export declare interface VCheckboxSlots {
    default?: () => any;
    label?: () => any;
}

export declare const VCollapse: __VLS_WithTemplateSlots_10<typeof __VLS_component_10, __VLS_TemplateResult_10["slots"]>;

export declare const VCollapseItem: __VLS_WithTemplateSlots_11<typeof __VLS_component_11, __VLS_TemplateResult_11["slots"]>;

export declare const VDatePicker: DefineComponent<VDatePickerProps, {
    focus: () => void;
    blur: () => void;
    open: () => void;
    close: () => void;
    validate: () => {
        isValid: boolean;
        errors: string[];
    };
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
    blur: (instance: any) => any;
    change: (value: DatePickerValue) => any;
    focus: (instance: any) => any;
    "update:modelValue": (value: DatePickerValue) => any;
    "calendar-change": (value: [Date, Date | null]) => any;
    "panel-change": (value: Date, mode: string, view: string) => any;
    "open-change": (open: boolean) => any;
}, string, PublicProps, Readonly<VDatePickerProps> & Readonly<{
    onBlur?: ((instance: any) => any) | undefined;
    onChange?: ((value: DatePickerValue) => any) | undefined;
    onFocus?: ((instance: any) => any) | undefined;
    "onUpdate:modelValue"?: ((value: DatePickerValue) => any) | undefined;
    "onCalendar-change"?: ((value: [Date, Date | null]) => any) | undefined;
    "onPanel-change"?: ((value: Date, mode: string, view: string) => any) | undefined;
    "onOpen-change"?: ((open: boolean) => any) | undefined;
}>, {
    type: DatePickerType;
    required: boolean;
    disabled: boolean;
    size: DatePickerSize;
    placeholder: string;
    clearable: boolean;
    outlined: boolean;
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
    valueFormat: string;
    maxDateRange: number;
    previousDateDisabled: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
    datePickerRef: HTMLDivElement;
    triggerRef: HTMLDivElement;
    dropdownRef: HTMLDivElement;
    startTimePickerRef: CreateComponentPublicInstanceWithMixins<Readonly< VTimePickerProps> & Readonly<{
        onBlur?: ((instance: any) => any) | undefined;
        onChange?: ((value: TimePickerValue) => any) | undefined;
        onFocus?: ((instance: any) => any) | undefined;
        "onUpdate:modelValue"?: ((value: TimePickerValue) => any) | undefined;
        "onOpen-change"?: ((open: boolean) => any) | undefined;
    }>, {
        focus: () => void;
        blur: () => void;
        open: () => void;
        close: () => void;
        validate: (value: TimePickerValue, required?: boolean) => TimeValidationResult;
    }, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
        blur: (instance: any) => any;
        change: (value: TimePickerValue) => any;
        focus: (instance: any) => any;
        "update:modelValue": (value: TimePickerValue) => any;
        "open-change": (open: boolean) => any;
    }, PublicProps, {
        type: TimePickerType;
        disabled: boolean;
        size: TimePickerSize;
        placeholder: string;
        clearable: boolean;
        outlined: boolean;
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
    }, false, {}, {}, GlobalComponents, GlobalDirectives, string, {
        timePickerRef: HTMLDivElement;
        triggerRef: HTMLDivElement;
        dropdownRef: HTMLDivElement;
    }, HTMLDivElement, ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly< VTimePickerProps> & Readonly<{
        onBlur?: ((instance: any) => any) | undefined;
        onChange?: ((value: TimePickerValue) => any) | undefined;
        onFocus?: ((instance: any) => any) | undefined;
        "onUpdate:modelValue"?: ((value: TimePickerValue) => any) | undefined;
        "onOpen-change"?: ((open: boolean) => any) | undefined;
    }>, {
        focus: () => void;
        blur: () => void;
        open: () => void;
        close: () => void;
        validate: (value: TimePickerValue, required?: boolean) => TimeValidationResult;
    }, {}, {}, {}, {
        type: TimePickerType;
        disabled: boolean;
        size: TimePickerSize;
        placeholder: string;
        clearable: boolean;
        outlined: boolean;
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
    }> | null;
    endTimePickerRef: CreateComponentPublicInstanceWithMixins<Readonly< VTimePickerProps> & Readonly<{
        onBlur?: ((instance: any) => any) | undefined;
        onChange?: ((value: TimePickerValue) => any) | undefined;
        onFocus?: ((instance: any) => any) | undefined;
        "onUpdate:modelValue"?: ((value: TimePickerValue) => any) | undefined;
        "onOpen-change"?: ((open: boolean) => any) | undefined;
    }>, {
        focus: () => void;
        blur: () => void;
        open: () => void;
        close: () => void;
        validate: (value: TimePickerValue, required?: boolean) => TimeValidationResult;
    }, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
        blur: (instance: any) => any;
        change: (value: TimePickerValue) => any;
        focus: (instance: any) => any;
        "update:modelValue": (value: TimePickerValue) => any;
        "open-change": (open: boolean) => any;
    }, PublicProps, {
        type: TimePickerType;
        disabled: boolean;
        size: TimePickerSize;
        placeholder: string;
        clearable: boolean;
        outlined: boolean;
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
    }, false, {}, {}, GlobalComponents, GlobalDirectives, string, {
        timePickerRef: HTMLDivElement;
        triggerRef: HTMLDivElement;
        dropdownRef: HTMLDivElement;
    }, HTMLDivElement, ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly< VTimePickerProps> & Readonly<{
        onBlur?: ((instance: any) => any) | undefined;
        onChange?: ((value: TimePickerValue) => any) | undefined;
        onFocus?: ((instance: any) => any) | undefined;
        "onUpdate:modelValue"?: ((value: TimePickerValue) => any) | undefined;
        "onOpen-change"?: ((open: boolean) => any) | undefined;
    }>, {
        focus: () => void;
        blur: () => void;
        open: () => void;
        close: () => void;
        validate: (value: TimePickerValue, required?: boolean) => TimeValidationResult;
    }, {}, {}, {}, {
        type: TimePickerType;
        disabled: boolean;
        size: TimePickerSize;
        placeholder: string;
        clearable: boolean;
        outlined: boolean;
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
    }> | null;
}, HTMLDivElement>;

export declare interface VDatePickerEmits {
    (e: 'update:modelValue', value: DatePickerValue): void;
    (e: 'change', value: DatePickerValue): void;
    (e: 'blur', instance: any): void;
    (e: 'focus', instance: any): void;
    (e: 'calendar-change', value: [Date, Date | null]): void;
    (e: 'panel-change', value: Date, mode: string, view: string): void;
    (e: 'open-change', open: boolean): void;
}

export declare interface VDatePickerMethods {
    focus(): void;
    blur(): void;
    handleOpen(): void;
    handleClose(): void;
}

export declare interface VDatePickerProps {
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

export declare const VDropdown: __VLS_WithTemplateSlots_6<typeof __VLS_component_6, __VLS_TemplateResult_6["slots"]>;

export declare const VDropdownItem: __VLS_WithTemplateSlots_7<typeof __VLS_component_7, __VLS_TemplateResult_7["slots"]>;

export declare const VDynamicFilter: __VLS_WithTemplateSlots_15<typeof __VLS_component_15, __VLS_TemplateResult_15["slots"]>;

export declare const VIcon: DefineComponent<Props, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<Props> & Readonly<{}>, {
    color: string;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, any>;

export declare const VInput: DefineComponent<VtInputProps, {
    focus(): void;
    blur(): void;
    select(): void;
    clear(): void;
    validate(): boolean;
    clearValidation(): void;
    getInputElement(): HTMLInputElement | HTMLTextAreaElement | null;
    getValidationState(): VtInputValidationResult;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
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
    validation: (result: VtInputValidationResult) => any;
}, string, PublicProps, Readonly<VtInputProps> & Readonly<{
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
    onValidation?: ((result: VtInputValidationResult) => any) | undefined;
}>, {
    resize: VtInputResize;
    type: VtInputType;
    disabled: boolean;
    size: VtInputSize;
    status: VtInputStatus;
    clearable: boolean;
    showPassword: boolean;
    outlined: boolean;
    rows: number;
    autosize: boolean | VtInputAutosizeConfig;
    validateOnInput: boolean;
    validateOnBlur: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
    textareaRef: HTMLTextAreaElement;
    inputRef: HTMLInputElement;
}, HTMLDivElement>;

export declare const VLoader: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, HTMLSpanElement>;

export declare interface VLocale {
    value: LANGUAGES;
    locale: string;
    icon: IconName;
}

export declare interface VLocaleEmits {
    (e: 'update:modelValue', value: LANGUAGES): void;
    (e: 'change', value: LANGUAGES): void;
}

export declare const VLocaleSelect: DefineComponent<VLocaleSelectProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
    change: (value: LANGUAGES) => any;
    "update:modelValue": (value: LANGUAGES) => any;
}, string, PublicProps, Readonly<VLocaleSelectProps> & Readonly<{
    onChange?: ((value: LANGUAGES) => any) | undefined;
    "onUpdate:modelValue"?: ((value: LANGUAGES) => any) | undefined;
}>, {
    modelValue: LANGUAGES;
    languages: VLocale[];
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

export declare interface VLocaleSelectProps {
    modelValue?: LANGUAGES;
    languages?: VLocale[];
}

export declare const VLogin: __VLS_WithTemplateSlots_14<typeof __VLS_component_14, __VLS_TemplateResult_14["slots"]>;

export declare const VLoginLogo: DefineComponent<VLoginLogoProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<VLoginLogoProps> & Readonly<{}>, {
    x: number;
    y: number;
    name: string;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, SVGSVGElement>;

export declare interface VLoginLogoProps {
    name: string;
    x?: number;
    y?: number;
}

export declare const VMessage: VMessageMethods;

export declare interface VMessageInstance extends VMessageOptions {
    id: number;
    type: VMessageType;
}

declare class VMessageManager {
    private messageInstance;
    private app;
    private container;
    call(options?: VMessageOptions): number;
    success(message: string, options?: Partial<VMessageOptions>): number;
    danger(message: string, options?: Partial<VMessageOptions>): number;
    warning(message: string, options?: Partial<VMessageOptions>): number;
    primary(message: string, options?: Partial<VMessageOptions>): number;
    close(id: number): void;
    closeAll(): void;
    getOpenMessagesCount(): number;
    private ensureInstance;
}

export declare interface VMessageMethods {
    success: (message: string, options?: Partial<VMessageOptions>) => number;
    danger: (message: string, options?: Partial<VMessageOptions>) => number;
    warning: (message: string, options?: Partial<VMessageOptions>) => number;
    primary: (message: string, options?: Partial<VMessageOptions>) => number;
    close: (id: number) => void;
    closeAll: () => void;
    (options: VMessageOptions): number;
}

export declare interface VMessageOptions {
    message: string;
    title?: string;
    type?: VMessageType;
    showClose?: boolean;
    duration?: number;
    dangerouslyUseHTMLString?: boolean;
}

export declare const VMessagePlugin: {
    install(app: App): void;
};

export declare type VMessageType = 'success' | 'warning' | 'primary' | 'danger';

export declare const VModal: __VLS_WithTemplateSlots_2<typeof __VLS_component_2, __VLS_TemplateResult_2["slots"]>;

export declare interface VModalConfig {
    title?: string;
    content?: string;
    component?: any;
    props?: Record<any, any>;
    size?: VModalSize;
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
}

export declare interface VModalEmits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'close'): void;
}

export declare interface VModalInstance {
    /** Відкриває нове модальне вікно та повертає його ID */
    open: (config: VModalConfig) => string;
    /** Закриває останнє (верхнє) модальне вікно */
    close: () => void;
    /** Закриває модальне вікно за ID */
    closeById: (modalId: string) => void;
    /** Закриває всі модальні вікна */
    closeAll: () => void;
    /** Повертає кількість відкритих модальних вікон */
    getOpenModalsCount: () => number;
}

declare class VModalManager implements VModalInstance {
    private modalStack;
    private baseZIndex;
    private parentApp;
    setParentApp(app: App): void;
    open(config?: VModalConfig): string;
    close(): void;
    closeById(modalId: string): void;
    closeAll(): void;
    getOpenModalsCount(): number;
    private inheritFromParentApp;
    private cleanupModal;
    private recalculateZIndices;
}

export declare const VModalPlugin: {
    install(app: App): void;
};

export declare interface VModalProps {
    /** Чи відкрите модальне вікно */
    modelValue: boolean;
    /** Заголовок модального вікна */
    title?: string;
    /** Розмір модального вікна */
    size?: VModalSize;
    /** Чи показувати кнопку закриття */
    showCloseButton?: boolean;
    /** Чи закривати при кліку на backdrop */
    closeOnBackdropClick?: boolean;
    /** Z-index для модального вікна */
    zIndex?: number;
}

export declare type VModalSize = 'small' | 'medium' | 'large';

export declare const VOption: __VLS_WithTemplateSlots_9<typeof __VLS_component_9, __VLS_TemplateResult_9["slots"]>;

export declare const VPagination: DefineComponent<PaginationProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
    "update:currentPage": (page: number) => any;
    "update:pageSize": (size: number) => any;
    pageChange: (data: PaginationChangeData) => any;
    reloadData: (page: number) => any;
}, string, PublicProps, Readonly<PaginationProps> & Readonly<{
    "onUpdate:currentPage"?: ((page: number) => any) | undefined;
    "onUpdate:pageSize"?: ((size: number) => any) | undefined;
    onPageChange?: ((data: PaginationChangeData) => any) | undefined;
    onReloadData?: ((page: number) => any) | undefined;
}>, {
    pageSize: number;
    currentPage: number;
    pageSizeOptions: number[];
    maxVisiblePages: number;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

export declare const VRadiobox: __VLS_WithTemplateSlots_4<typeof __VLS_component_4, __VLS_TemplateResult_4["slots"]>;

export declare interface VRadioboxEmits {
    'update:modelValue': [value: any];
    change: [value: any, event: Event];
    focus: [event: FocusEvent];
    blur: [event: FocusEvent];
}

export declare interface VRadioboxProps {
    modelValue?: any;
    value?: any;
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    name?: string;
    id?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    required?: boolean;
}

export declare const VSelect: __VLS_WithTemplateSlots_8<typeof __VLS_component_8, __VLS_TemplateResult_8["slots"]>;

export declare const VSidebar: DefineComponent<__VLS_Props_2, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
    navigate: (to: string) => any;
    "update:collapsed": (value: boolean) => any;
}, string, PublicProps, Readonly<__VLS_Props_2> & Readonly<{
    onNavigate?: ((to: string) => any) | undefined;
    "onUpdate:collapsed"?: ((value: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLElement>;

export declare const VTabItem: __VLS_WithTemplateSlots_13<typeof __VLS_component_13, __VLS_TemplateResult_13["slots"]>;

export declare interface VTabItemProps {
    label?: string;
    disabled?: boolean;
    name?: string | number;
    closable?: boolean;
    icon?: IconName;
}

export declare const VTable: __VLS_WithTemplateSlots_5<typeof __VLS_component_5, __VLS_TemplateResult_5["slots"]>;

export declare const VTableColumn: DefineComponent<VTableColumnProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<VTableColumnProps> & Readonly<{}>, {
    sortable: boolean;
    pinnedLeft: boolean;
    pinnedRight: boolean;
    actionColumn: boolean;
    showOverflowTooltip: boolean;
    selectable: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, any>;

export declare interface VTableColumnGroup {
    name: string;
    label: string;
    order: number;
    icon?: IconName;
    color?: string;
    columns: VTableColumnProps[];
}

export declare interface VTableColumnProps {
    prop: string;
    label: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    sortable?: boolean;
    pinnedLeft?: boolean;
    pinnedRight?: boolean;
    actionColumn?: boolean;
    showOverflowTooltip?: boolean;
    selectable?: boolean;
    manage?: boolean;
    renderSlot?: VTableRenderSlot;
    sortMethod?: Function;
}

export declare interface VTableEmits {
    'sort-change': [payload: SortChangeEventData];
    'selection-change': [payload: SelectionChangeEventData];
    'current-change': [
    payload: {
        currentRow: Record<string, any> | null;
        oldCurrentRow: Record<string, any> | null;
    }
    ];
    'row-click': [payload: {
        row: Record<string, any>;
        column: VTableColumnProps;
        event: Event;
    }];
    'row-dblclick': [
    payload: {
        row: Record<string, any>;
        column: VTableColumnProps;
        event: Event;
    }
    ];
    'update:columns': [payload: VTableColumnProps[]];
    'column-pin': [payload: {
        column: VTableColumnProps;
        position: 'left' | 'right' | 'none';
    }];
    'column-resize': [payload: {
        column: VTableColumnProps;
        width: number;
        oldWidth?: number;
    }];
    'column-visibility': [payload: {
        column: VTableColumnProps;
    }];
    'column-sort': [payload: {
        column: VTableColumnProps;
        direction: 'asc' | 'desc' | null;
    }];
    'columns-change': [columns: VTableColumnProps[]];
    'infinity-scroll': [];
    'row-reorder': [payload: RowReorderEventData];
    'update:data': [data: Record<string, any>[]];
}

export declare interface VTableProps {
    data: Record<string, any>[];
    maxHeight?: number;
    rowKey?: string;
    defaultSort?: SortState;
    showSummary?: boolean;
    summaryMethod?: (params: {
        columns: VTableColumnProps[];
        data: Record<string, any>[];
    }) => any[];
    columnsSelector?: VTableColumnGroup[];
    selectable?: boolean;
    isAllSelect?: boolean;
    selectionKey?: string;
    defaultSelection?: any[];
    selectOnClickRow?: boolean;
    highlightCurrentRow?: boolean;
    allData?: Record<string, any>[];
    columns?: VTableColumnProps[];
    hideHeader?: boolean;
    rowHighlight?: VTableRowHighlightFunction;
    /** Дозволити перетягування рядків */
    rowDraggable?: boolean;
    /** Показувати handle для перетягування */
    showDragHandle?: boolean;
}

export declare type VTableRenderSlot = (props: {
    row: Record<string, any>;
    column: VTableColumnProps;
    value: any;
    index?: number;
}) => VNode | VNode[] | string | Component;

export declare interface VTableRowHighlight {
    type: VTableRowHighlightType;
    className?: string;
}

export declare type VTableRowHighlightFunction = (row: any, index: number) => VTableRowHighlight | null;

export declare type VTableRowHighlightType = 'default' | 'success' | 'warning' | 'danger' | 'custom';

export declare interface VTableStyleConfig {
    [key: string]: string;
}

export declare const VTabs: __VLS_WithTemplateSlots_12<typeof __VLS_component_12, __VLS_TemplateResult_12["slots"]>;

export declare type VTabsEmits = {
    (e: 'update:modelValue', value: string): void;
    (e: 'tab-change', value: string): void;
    (e: 'tab-remove', name: string): void;
    (e: 'tab-add'): void;
};

export declare interface VTabsProps {
    modelValue?: string | number;
}

export declare const VTimePicker: DefineComponent<VTimePickerProps, {
    focus: () => void;
    blur: () => void;
    open: () => void;
    close: () => void;
    validate: (value: TimePickerValue, required?: boolean) => TimeValidationResult;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
    blur: (instance: any) => any;
    change: (value: TimePickerValue) => any;
    focus: (instance: any) => any;
    "update:modelValue": (value: TimePickerValue) => any;
    "open-change": (open: boolean) => any;
}, string, PublicProps, Readonly<VTimePickerProps> & Readonly<{
    onBlur?: ((instance: any) => any) | undefined;
    onChange?: ((value: TimePickerValue) => any) | undefined;
    onFocus?: ((instance: any) => any) | undefined;
    "onUpdate:modelValue"?: ((value: TimePickerValue) => any) | undefined;
    "onOpen-change"?: ((open: boolean) => any) | undefined;
}>, {
    type: TimePickerType;
    disabled: boolean;
    size: TimePickerSize;
    placeholder: string;
    clearable: boolean;
    outlined: boolean;
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
}, {}, {}, {}, string, ComponentProvideOptions, false, {
    timePickerRef: HTMLDivElement;
    triggerRef: HTMLDivElement;
    dropdownRef: HTMLDivElement;
}, HTMLDivElement>;

export declare interface VTimePickerEmits {
    (e: 'update:modelValue', value: TimePickerValue): void;
    (e: 'change', value: TimePickerValue): void;
    (e: 'blur', instance: any): void;
    (e: 'focus', instance: any): void;
    (e: 'open-change', open: boolean): void;
}

export declare interface VTimePickerMethods {
    focus(): void;
    blur(): void;
    open(): void;
    close(): void;
}

export declare interface VTimePickerProps {
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

export declare interface VtInputAutosizeConfig {
    minRows?: number;
    maxRows?: number;
}

export declare interface VtInputEmits {
    'update:modelValue': [value: string | number];
    input: [event: Event];
    change: [event: Event];
    focus: [event: FocusEvent];
    blur: [event: FocusEvent];
    clear: [];
    validation: [result: VtInputValidationResult];
    keydown: [event: KeyboardEvent];
    keyup: [event: KeyboardEvent];
    keypress: [event: KeyboardEvent];
    click: [event: MouseEvent];
}

export declare interface VtInputMethods {
    focus(): void;
    blur(): void;
    select(): void;
    clear(): void;
    validate(): boolean;
    clearValidation(): void;
    getInputElement(): HTMLInputElement | HTMLTextAreaElement | null;
    getValidationState(): VtInputValidationResult;
}

export declare interface VtInputProps {
    modelValue?: string | number;
    type?: VtInputType;
    size?: VtInputSize;
    status?: VtInputStatus;
    disabled?: boolean;
    clearable?: boolean;
    showPassword?: boolean;
    label?: string;
    placeholder?: string;
    helperText?: string;
    errorMessage?: string;
    outlined?: boolean;
    id?: string;
    name?: string;
    tabindex?: number;
    autocomplete?: string;
    prefixIcon?: IconName;
    suffixIcon?: IconName;
    rows?: number;
    cols?: number;
    resize?: VtInputResize;
    autosize?: boolean | VtInputAutosizeConfig;
    required?: boolean;
    validateOnInput?: boolean;
    validateOnBlur?: boolean;
    showAllErrors?: boolean;
    requiredMessage?: string;
    emailMessage?: string;
    urlMessage?: string;
    numberMessage?: string;
    minlengthMessage?: string;
    maxlengthMessage?: string;
    minMessage?: string;
    maxMessage?: string;
    patternMessage?: string;
    customValidatorMessage?: string;
    minlength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
    customValidator?: (value: string | number) => boolean;
}

export declare type VtInputResize = 'none' | 'both' | 'horizontal' | 'vertical';

export declare type VtInputSize = 'small' | 'medium' | 'large';

export declare type VtInputStatus = 'default' | 'success' | 'error' | 'warning';

export declare type VtInputType = 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'search' | 'textarea';

export declare interface VtInputValidationResult {
    isValid: boolean;
    errors: string[];
}

export declare interface VtOptionEmits {
    click: [option: VtSelectOption];
}

export declare interface VtSelectContext {
    selectValue: any;
    multiple: boolean;
    valueKey?: string;
    handleOptionClick: (option: VtSelectOption) => void;
    isOptionSelected: (value: any) => boolean;
    registerOption: (option: VtSelectOption, slotContent?: any) => void;
    unregisterOption: (value: any) => void;
}

export declare const VtSelectContextKey: InjectionKey<VtSelectContext>;

export declare interface VtSelectEmits {
    (e: 'update:modelValue', value: any): void;
    (e: 'change', value: any): void;
    (e: 'clear'): void;
    (e: 'focus'): void;
    (e: 'blur'): void;
    (e: 'visible-change', visible: boolean): void;
    (e: 'validation', result: {
        isValid: boolean;
        errors: string[];
    }): void;
    (e: 'scrolled'): void;
    (e: 'remove-tag', value: any): void;
    (e: 'filter', query: string): void;
    (e: 'filter-clear'): void;
}

export declare interface VtSelectMethods {
    registerOption: (option: VtSelectOption, slotContent?: any) => void;
    unregisterOption: (value: any) => void;
    focus(): void;
    blur(): void;
    clear(): void;
    validate(): boolean;
    clearValidation(): void;
    getSelectedOptions(): VtSelectOption[];
    getValidationState(): {
        isValid: boolean;
        errors: string[];
    };
    setFilter(query: string): void;
    clearFilter(): void;
    getFilterQuery(): string;
}

export declare interface VtSelectOption {
    label: any;
    value: any;
    disabled?: boolean;
    [key: string]: any;
}

export declare interface VtSelectProps {
    modelValue?: any;
    options?: VtSelectOption[];
    multiple?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    filterable?: boolean;
    loading?: boolean;
    placeholder?: string;
    noDataText?: string;
    loadingText?: string;
    maxHeight?: number;
    collapsedTags?: boolean;
    validateOnInput?: boolean;
    validateOnBlur?: boolean;
    placement?: string;
    trigger?: string;
    showTimeout?: number;
    hideTimeout?: number;
    status?: 'default' | 'success' | 'warning' | 'error';
    label?: string;
    outlined?: boolean;
    id?: string;
    required?: boolean;
    requiredMessage?: string;
    valueKey?: string;
    errorMessage?: string;
    filterPlaceholder?: string;
    allowRemoteFilter?: boolean;
}

export declare type VtSelectStatus = 'default' | 'success' | 'error' | 'warning';

declare const VUIPlugin: {
    install(app: App, options?: VUIPluginOptions): void;
};
export default VUIPlugin;

export declare interface VUIPluginOptions {
    prefix?: string;
    modal?: boolean;
    message?: boolean;
    locale?: LANGUAGES;
}

export declare const VUpload: DefineComponent<VUploadProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
    change: (files: UploadFile[]) => any;
    error: (error: UploadError) => any;
    "update:modelValue": (files: UploadFile[]) => any;
    remove: (file: UploadFile) => any;
    exceed: (files: File[]) => any;
    parse: (result: {
        file: UploadFile;
        result: ParseResult;
    }) => any;
    rowsExceed: (data: {
        file: UploadFile;
        rows: number;
        maxRows: number;
    }) => any;
}, string, PublicProps, Readonly<VUploadProps> & Readonly<{
    onChange?: ((files: UploadFile[]) => any) | undefined;
    onError?: ((error: UploadError) => any) | undefined;
    "onUpdate:modelValue"?: ((files: UploadFile[]) => any) | undefined;
    onRemove?: ((file: UploadFile) => any) | undefined;
    onExceed?: ((files: File[]) => any) | undefined;
    onParse?: ((result: {
        file: UploadFile;
        result: ParseResult;
    }) => any) | undefined;
    onRowsExceed?: ((data: {
        file: UploadFile;
        rows: number;
        maxRows: number;
    }) => any) | undefined;
}>, {
    type: "drag" | "button";
    disabled: boolean;
    modelValue: UploadFile[];
    placeholder: string;
    maxRows: number;
    multiple: boolean;
    accept: string;
    maxSize: number;
    maxFiles: number;
    tip: string;
    parseFiles: boolean;
    returnData: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
    fileInputRef: HTMLInputElement;
}, HTMLDivElement>;

export declare interface VUploadEmits {
    (e: 'update:modelValue', files: UploadFile[]): void;
    (e: 'change', files: UploadFile[]): void;
    (e: 'remove', file: UploadFile): void;
    (e: 'exceed', files: File[]): void;
    (e: 'error', error: UploadError): void;
    (e: 'parse', result: {
        file: UploadFile;
        result: ParseResult;
    }): void;
    (e: 'rowsExceed', data: {
        file: UploadFile;
        rows: number;
        maxRows: number;
    }): void;
}

export declare interface VUploadProps {
    modelValue?: UploadFile[];
    accept?: string;
    maxSize?: number;
    maxFiles?: number;
    maxRows?: number;
    multiple?: boolean;
    type?: 'drag' | 'button';
    disabled?: boolean;
    placeholder?: string;
    tip?: string;
    parseFiles?: boolean;
    returnData?: boolean;
}

export declare function withAsync(validator: ValidatorFn): WrappedValidator;

export declare function withMessage(message: string | ((params?: any) => string), validator: ValidatorFn): WrappedValidator;

export declare function withName(name: string, validator: ValidatorFn): WrappedValidator;

export declare function withParams(params: Record<string, any>, validator: ValidatorFn): WrappedValidator;

declare class WorkerPool {
    private worker;
    private resolveMap;
    private messageId;
    constructor();
    parseFile(file: File, maxRows?: number, returnData?: boolean): Promise<ParseResult>;
    terminate(): void;
    private initWorker;
}

export declare interface WrappedValidator extends ValidatorFn {
    $validatorName?: string;
    $params?: Record<string, any>;
    $message?: string | ((params?: any) => string);
    $async?: boolean;
}

export { }


declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $modal: import('./components/modal/types').VModalInstance;
        $message: import('./components/message/types').VMessageMethods;
        $messageStack: {
            closeAll: () => void;
            getCount: () => number;
            closeById: (id: number) => void;
        };
    }
}


declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $modal: VModalInstance;
        $modalStack: VModalStack;
    }
}


declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $message: VMessageMethods;
    }
}
