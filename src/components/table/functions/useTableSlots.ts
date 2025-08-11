import { defineComponent, type VNode } from 'vue';
import type { VTableColumnProps, VTableRenderSlot } from '../types';

// Helper to create typed slot components
export function createTableSlot(renderFn: VTableRenderSlot) {
  return defineComponent({
    props: {
      row: { type: Object, required: true },
      column: { type: Object as () => VTableColumnProps, required: true },
      value: { required: true },
      index: { type: Number },
    },
    setup(props) {
      return () => renderFn(props);
    },
  });
}

// Helper to render slot content safely
export function renderTableSlot(
  renderSlot: VTableRenderSlot | undefined,
  props: {
    row: Record<string, any>;
    column: VTableColumnProps;
    value: any;
    index?: number;
  }
): VNode | VNode[] | string {
  if (!renderSlot) {
    return String(props.value ?? '');
  }

  try {
    const result = renderSlot(props);
    // Remove Component from return type since we only support VNode, VNode[] or string
    if (typeof result === 'string') {
      return result;
    }
    // Ensure result is VNode or VNode[]
    return result as VNode | VNode[];
  } catch (error) {
    console.error('Error rendering table slot:', error);
    return String(props.value ?? '');
  }
}

// Predefined slot types for better IntelliSense
export interface VTableSlotProps {
  row: Record<string, any>;
  column: VTableColumnProps;
  value: any;
  index?: number;
}

export type VTableSlotComponent = (props: VTableSlotProps) => VNode | VNode[] | string;
