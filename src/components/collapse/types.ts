export interface CollapseItemProps {
  title?: string;
  name: string;
  disabled?: boolean;
}

export interface CollapseProps {
  modelValue: string[];
  accordion?: boolean;
}

export interface CollapseEmits {
  (e: 'update:modelValue', value: string[]): void;

  (e: 'change', value: string[]): void;
}

export interface CollapseItemEmits {
  (e: 'toggle', name: string): void;
}

export interface CollapseContext {
  readonly activeNames: string[];
  readonly accordion: boolean;
  toggle: (name: string) => void;
}
