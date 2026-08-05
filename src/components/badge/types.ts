export type BadgeColor = 'primary' | 'yellow' | 'success' | 'warning' | 'danger' | 'gray';
export type BadgePosition = 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';

export interface VBadgeProps {
  /** Вміст бейджа — число або текст. Якщо не задано і dot=false — бейдж не рендериться */
  content?: number | string;
  /** Максимальне число перед обрізанням у формат "99+" */
  max?: number;
  /** Режим крапки — без вмісту, тільки маленький індикатор */
  dot?: boolean;
  /** Кольорова схема бейджа */
  color?: BadgeColor;
  /** Кут прив'язки відносно вмісту слоту */
  position?: BadgePosition;
  /** Додатковий зсув по X, px */
  offsetX?: number;
  /** Додатковий зсув по Y, px */
  offsetY?: number;
  /** Біла обвідка навколо бейджа (для контрасту на фото/іконках) */
  bordered?: boolean;
  /** Примусово приховати бейдж (напр. якщо content === 0) */
  hidden?: boolean;
}