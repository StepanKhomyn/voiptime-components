import type { IconName } from '../../icons';
import type { TooltipPlacement } from '../../directives/tooltip/types';

export type VButtonType = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info';
export type VButtonShape = 'circle' | 'square';

export interface VButtonEmits {
  click: [event: MouseEvent];
}

export interface VButtonProps {
  type?: VButtonType;
  shape?: VButtonShape;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  tooltip?: boolean;
  tooltipPlacement?: TooltipPlacement;
}
