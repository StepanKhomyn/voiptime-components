import type { IconName } from '@/icons';

export interface VTabsProps {
  modelValue?: string;
}

export interface VTabItemProps {
  label?: string;
  disabled?: boolean;
  name?: string;
  closable?: boolean;
  icon?: IconName;
}

export type VTabsEmits = {
  (e: 'update:modelValue', value: string): void;
  (e: 'tab-change', value: string): void;
  (e: 'tab-remove', name: string): void;
  (e: 'tab-add'): void;
};
