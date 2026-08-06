import type { IconName } from '@/icons';
export type VNavRailPlacement = 'left' | 'right';

// Локальний тип позиції беджа — якщо у вашому VBadge вже є експортований
// BadgePosition, замініть на: import type { BadgePosition } from '../badge/types';
export type VNavRailBadgePosition = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

export interface NavRailBadge {
  content: string | number;
  position?: VNavRailBadgePosition;
}

export interface VNavRailItem<T extends string = string> {
  key: T;
  icon: IconName;
  /** Вже перекладений рядок для tooltip — i18n лишається на стороні застосунку */
  label: string;
  disabled?: boolean;
  badge?: NavRailBadge | null;
}

export interface VNavRailProps<T extends string = string> {
  items: VNavRailItem<T>[];
  modelValue?: T | null;
  placement?: VNavRailPlacement;
}

export interface VNavRailEmits<T extends string = string> {
  (e: 'update:modelValue', value: T): void;
  (e: 'select', item: VNavRailItem<T>): void;
}