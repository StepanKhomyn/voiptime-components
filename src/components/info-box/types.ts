import type { IconName } from '@/components/icon/icons';

export type VInfoBoxType = 'success' | 'warning' | 'primary' | 'danger';

export interface VInfoBoxProps {
  type?: VInfoBoxType;
  message?: string;
  title?: string;
  showIcon?: boolean;
  icon?: IconName;
}
