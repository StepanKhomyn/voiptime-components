import { type VNode } from 'vue';
import type { VTableColumnProps, VTableRenderSlot } from '../types';
export declare function createTableSlot(renderFn: VTableRenderSlot): import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    row: {
        type: ObjectConstructor;
        required: true;
    };
    column: {
        type: () => VTableColumnProps;
        required: true;
    };
    value: {
        required: true;
    };
    index: {
        type: NumberConstructor;
    };
}>, () => string | VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> | import("vue").Component | VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    row: {
        type: ObjectConstructor;
        required: true;
    };
    column: {
        type: () => VTableColumnProps;
        required: true;
    };
    value: {
        required: true;
    };
    index: {
        type: NumberConstructor;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare function renderTableSlot(renderSlot: VTableRenderSlot | undefined, props: {
    row: Record<string, any>;
    column: VTableColumnProps;
    value: any;
    index?: number;
}): VNode | VNode[] | string;
export interface VTableSlotProps {
    row: Record<string, any>;
    column: VTableColumnProps;
    value: any;
    index?: number;
}
export type VTableSlotComponent = (props: VTableSlotProps) => VNode | VNode[] | string;
//# sourceMappingURL=useTableSlots.d.ts.map