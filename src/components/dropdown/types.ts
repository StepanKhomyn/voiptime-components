import type { InjectionKey, Ref } from 'vue';

export type DropdownPlacement = 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end';
export type DropdownTriggerType = 'click' | 'hover';

export interface DropdownProps {
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

export interface DropdownItemProps {
  command?: string | number;
  disabled?: boolean;
  divided?: boolean;
  icon?: string;
}

export interface DropdownEmits {
  'visible-change': [visible: boolean];
  click: [event: MouseEvent];
  command: [command: string | number];
}

export interface DropdownItemEmits {
  click: [event: MouseEvent];
}

export interface DropdownExpose {
  show: () => void;
  hide: () => void;
  visible: Ref<boolean>;
}

// Типи для provide/inject
export interface DropdownContext {
  handleCommand: (command: string | number) => void;
  hideOnClick: boolean;
}

export const DropdownContextKey = Symbol('dropdown-context') as InjectionKey<DropdownContext>;
