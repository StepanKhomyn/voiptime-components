import type { IconName } from '../icon/icons';
import type { TooltipPlacement } from '../../directives/tooltip/types';

// Палітри дизайн-системи (_colors.scss)
export const TAG_PRESET_COLORS = ['primary', 'success', 'warning', 'danger', 'yellow', 'gray'] as const;

export type VTagPresetColor = (typeof TAG_PRESET_COLORS)[number];
// Пресет палітри або будь-який CSS-колір (#hex, rgb(), var(--...)) — він стає основним,
// а напівпрозорий фон, бордер і читабельний текст виводяться з нього автоматично
export type VTagColor = VTagPresetColor | (string & {});
export type VTagSize = 'sm' | 'md' | 'lg';
export type VTagVariant = 'soft' | 'outline' | 'solid';

export interface VTagProps {
  /** Текст тега (альтернатива default-слоту) */
  label?: string | number;
  /** Розмір */
  size?: VTagSize;
  /** Пресет палітри або довільний CSS-колір (стає основним, решта відтінків виводиться з нього) */
  color?: VTagColor;
  /** Стиль заливки */
  variant?: VTagVariant;
  /** Іконка перед текстом (або слот #prefix) */
  prefixIcon?: IconName;
  /** Іконка після тексту (або слот #suffix) */
  suffixIcon?: IconName;
  /** Кольорова крапка-статус перед текстом */
  dot?: boolean;
  /** Кнопка закриття (емітить close) */
  closable?: boolean;
  /** Ховер/фокус-стани та click з клавіатури */
  clickable?: boolean;
  disabled?: boolean;
  /** Максимальна ширина тега (число — px) */
  maxWidth?: number | string;
  /** Власний текст тултіпа — показується завжди */
  tooltip?: string;
  /** Показувати повний текст у тултіпі, якщо він обрізаний */
  tooltipOnOverflow?: boolean;
  tooltipPlacement?: TooltipPlacement;
  /** Коли місця зовсім мало — лишати тільки іконку/крапку (текст у тултіпі) */
  collapsible?: boolean;
  /** Мінімальна видима ширина тексту, px, нижче якої тег згортається до іконки */
  minLabelWidth?: number;
}

export interface VTagEmits {
  (e: 'click', event: MouseEvent | KeyboardEvent): void;
  (e: 'close', event: MouseEvent): void;
}
