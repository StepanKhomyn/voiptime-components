import { App } from 'vue';
import { Component } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { ObjectDirective } from 'vue';
import { PublicProps } from 'vue';
import { VNode } from 'vue';

declare const __VLS_component: DefineComponent<VButtonProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    click: (event: MouseEvent) => any;
}, string, PublicProps, Readonly<VButtonProps> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
}>, {
    type: VButtonType;
    disabled: boolean;
    loading: boolean;
    tooltip: boolean;
    tooltipPlacement: TooltipPlacement;
    htmlType: "button" | "submit" | "reset";
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLButtonElement>;

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
    disabled: boolean;
    modelValue: boolean;
    size: "small" | "medium" | "large";
    required: boolean;
    checked: boolean;
    indeterminate: boolean;
    variant: "primary" | "success" | "warning" | "danger" | "info";
    isDouble: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLLabelElement>;

declare const __VLS_component_4: DefineComponent<__VLS_PublicProps, {
    toggleRowSelection: (row: Record<string, any>, selected?: boolean) => void;
    toggleAllSelection: () => void;
    selectAbsolutelyAll: () => void;
    clearSelection: () => void;
    getSelectionRows: () => Record<string, any>[];
    setSelectionRows: (rows: Record<string, any>[]) => void;
    resetInfinityScroll: () => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    "current-change": (payload: {
        currentRow: Record<string, any> | null;
        oldCurrentRow: Record<string, any> | null;
    }) => any;
    "selection-change": (payload: SelectionChangeEventData) => any;
    "sort-change": (payload: SortChangeEventData) => any;
    "row-click": (payload: {
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
    "onSort-change"?: ((payload: SortChangeEventData) => any) | undefined;
    "onRow-click"?: ((payload: {
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
    selectionKey: string;
    defaultSelection: any[];
    selectOnClickRow: boolean;
    highlightCurrentRow: boolean;
    allData: Record<string, any>[];
}, {}, {}, {}, string, ComponentProvideOptions, false, {
    tableWrapperRef: HTMLDivElement;
}, HTMLDivElement>;

declare type __VLS_Props = {
    name: IconName;
};

declare type __VLS_Props_2 = VTableProps;

declare type __VLS_PublicProps = {
    'columns'?: VTableColumnProps[] | undefined;
} & __VLS_Props_2;

declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLButtonElement;
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
        default?(_: {}): any;
    };
    refs: {
        tableWrapperRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};

declare type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;

declare type __VLS_TemplateResult_2 = ReturnType<typeof __VLS_template_2>;

declare type __VLS_TemplateResult_3 = ReturnType<typeof __VLS_template_3>;

declare type __VLS_TemplateResult_4 = ReturnType<typeof __VLS_template_4>;

declare type __VLS_WithTemplateSlots<T, S> = T & {
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

export declare const DEFAULT_COLUMN_CONFIG: {
    readonly sortable: true;
    readonly actionColumn: false;
    readonly showOverflowTooltip: true;
    readonly visible: true;
    readonly pinnedLeft: false;
    readonly pinnedRight: false;
};

export declare type IconName = keyof typeof icons;

declare const icons: {
    readonly arrowDown: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly arrowTop: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly arrowRight: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly arrowLeft: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly arrowReload: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly columnInsert: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly freeze: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly unfreeze: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly columnsMove: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly empty: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly listBullet: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly listBulletHorizontal: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly close: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterSave: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterReset: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterNew: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterMultiselect: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterExchange: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterEdit: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterDateCheck: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterAdvanced: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
    readonly filterAdd: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, SVGSVGElement>;
};

export declare const install: (app: App, options?: VUIPluginOptions) => void;

export declare const modalManager: VModalManager;

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

export declare interface ResizeState {
    resizingCol: VTableColumnProps | null;
    startX: number;
    startWidth: number;
}

export declare interface SelectionChangeEventData {
    selection: Record<string, any>[];
    row?: Record<string, any>;
    selected?: boolean;
    isAllSelected?: boolean;
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

export declare const tooltipDirective: ObjectDirective;

export declare type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

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

export declare const VIcon: DefineComponent<__VLS_Props, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, any>;

export declare const VLoader: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, HTMLSpanElement>;

export declare const VModal: __VLS_WithTemplateSlots_2<typeof __VLS_component_2, __VLS_TemplateResult_2["slots"]>;

export declare interface VModalConfig {
    title?: string;
    content?: string;
    component?: any;
    props?: Record<string, any>;
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
    open(config?: VModalConfig): string;
    close(): void;
    closeById(modalId: string): void;
    closeAll(): void;
    getOpenModalsCount(): number;
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

export declare const VTable: __VLS_WithTemplateSlots_4<typeof __VLS_component_4, __VLS_TemplateResult_4["slots"]>;

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
}

export declare interface VTableProps {
    /** Масив даних для відображення в таблиці */
    data: Record<string, any>[];
    /** Максимальна висота таблиці (для sticky header) */
    maxHeight?: number;
    /** Максимальна висота таблиці (для sticky header) */
    rowKey?: string;
    /** Початкове сортування */
    defaultSort?: SortState;
    /** Показувати підсумковий рядок */
    showSummary?: boolean;
    /** Метод для обчислення підсумкових значень */
    summaryMethod?: (params: {
        columns: VTableColumnProps[];
        data: Record<string, any>[];
    }) => any[];
    /** Групи колонок для селектора */
    columnsSelector?: VTableColumnGroup[];
    /** Чи включити функціонал виділення рядків */
    selectable?: boolean;
    /** Ключ для ідентифікації рядків (за замовчуванням 'id') */
    selectionKey?: string;
    /** Рядки виділені за замовчуванням */
    defaultSelection?: any[];
    /** Виділяти рядок при кліку на нього */
    selectOnClickRow?: boolean;
    /** Підсвічувати поточний рядок */
    highlightCurrentRow?: boolean;
    /** Всі дані для повного виділення (якщо відрізняються від data) */
    allData?: Record<string, any>[];
    /** Конфігурація колонок */
    columns?: VTableColumnProps[];
}

export declare type VTableRenderSlot = (props: {
    row: Record<string, any>;
    column: VTableColumnProps;
    value: any;
    index?: number;
}) => VNode | VNode[] | string | Component;

export declare interface VTableStyleConfig {
    [key: string]: string;
}

declare const VUIPlugin: {
    install(app: App, options?: VUIPluginOptions): void;
};
export default VUIPlugin;

export declare interface VUIPluginOptions {
    prefix?: string;
    modal?: boolean;
}

export { }


declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $modal: import('./components/modal/types').VModalInstance;
    }
}


declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $modal: VModalInstance;
        $modalStack: VModalStack;
    }
}
