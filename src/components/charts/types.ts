export enum VChartType {
  donut = 'donut',
  combo = 'combo',
  horizontal = 'horizontal-bar',
  scale = 'scale-bar',
  sparkline = 'sparkline',
  treemap = 'treemap',
  radialProgress = 'radial-progress',
}

export interface ChartSegment {
  label: string;
  count: number;
  color: string;
  icon?: any;
  percent?: number;
}

export type BarSortOrder = 'none' | 'asc' | 'desc';

export interface ComboSeriesConfig {
  type: 'bar' | 'line';
  color: string;
  axis?: 'left' | 'right';
  /** Назва в легенді й тултіпі. За замовчуванням — ключ серії */
  label?: string;
  /** Форматування значення в тултіпі та підписах. За замовчуванням — формат осі серії */
  format?: (v: number) => string;
  /** Колір стовпця для «поточних» категорій (див. ComboChartProps.currentKey) */
  currentColor?: string;
  /** Підписи значень над стовпцями (лише для type: 'bar'; ховаються, якщо стовпці вузькі) */
  showValues?: boolean;
}

export interface ComboAxisConfig {
  /**
   * Форматування підписів осі. Для правої осі: якщо задано — шкала будується по даних
   * (як ліва), інакше лишається відсоткова 0–100% (SL)
   */
  format?: (v: number) => string;
}

export interface ComboTooltipRow {
  label: string;
  value: string;
  /** Колір значення: up — зелений, down — червоний */
  tone?: 'up' | 'down';
}

export interface ScaleBarSide {
  label?: string;
  value: number;
}

// ── Donut ─────────────────────────────────────────────────────────────────────
export interface DonutChartProps {
  type: VChartType.donut;
  segments: ChartSegment[];
  size?: number;
  labels?: boolean;
  /** Показувати кількість на кожному сегменті постійно (а не лише при наведенні) */
  showCounts?: boolean;
}

// ── Horizontal Bar ────────────────────────────────────────────────────────────
export interface HorizontalBarChartProps {
  type: VChartType.horizontal;
  segments: ChartSegment[];
  showAxis?: boolean;
  showPercent?: boolean;
  sort?: BarSortOrder
}

// ── Combo ─────────────────────────────────────────────────────────────────────
export interface ComboChartProps {
  type: VChartType.combo;
  data: Record<string, number | string | boolean>[];
  seriesConfig: Record<string, ComboSeriesConfig>;
  categoryKey: string;
  width?: number;
  height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  // ── Необов'язкові налаштування: без них графік поводиться як раніше ──
  leftAxis?: ComboAxisConfig;
  rightAxis?: ComboAxisConfig;
  /** Поле в data: true → стовпці категорії малюються currentColor (напр. незавершений період) */
  currentKey?: string;
  /** Пункт легенди для «поточних» стовпців (показується, лише якщо такі є) */
  currentLabel?: string;
  /** Заголовок тултіпа. За замовчуванням — значення categoryKey */
  tooltipTitle?: (item: ComboDataPoint, index: number) => string;
  /** Додаткові рядки тултіпа під значеннями серій (напр. дельта до попереднього періоду) */
  tooltipExtra?: (item: ComboDataPoint, index: number) => ComboTooltipRow[];
  /** Темний тултіп. За замовчуванням — світлий */
  tooltipTheme?: 'light' | 'dark';
  /** Смуги категорій через одну */
  striped?: boolean;
  /** Легенда над графіком (за замовчуванням) або під ним по центру */
  legendPosition?: 'top' | 'bottom';
  /** Максимальна ширина одного стовпця, px. За замовчуванням 28 */
  maxBarWidth?: number;
}

export interface ComboDataPoint {
  [key: string]: number | string | boolean;
}

export interface ComboChartPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// ── Scale Bar ─────────────────────────────────────────────────────────────────
export interface ScaleBarChartProps {
  type: VChartType.scale;
  left: ScaleBarSide;
  right: ScaleBarSide;
  wrapperClass?: string;
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
export interface SparklineDataPoint {
  label: string; // e.g. formatted date "Apr 28"
  primary: number; // main metric (e.g. cost)
  secondary?: number; // optional second metric (e.g. requests)
}

export interface SparklineSeries {
  key: 'primary' | 'secondary';
  label: string;
  color: string;
  format?: (v: number) => string;
}

export interface SparklineChartProps {
  type: VChartType.sparkline;
  points: SparklineDataPoint[];
  series: SparklineSeries[];
  height?: number;
  /** Show area fill under the primary line */
  area?: boolean;
}

// ── Treemap ───────────────────────────────────────────────────────────────────
export interface TreemapNode {
  id: string;
  label: string;
  value: number;
  color: string;
  /** Optional group label shown as a parent tile header */
  group?: string;
}

export interface TreemapChartProps {
  type: VChartType.treemap;
  nodes: TreemapNode[];
  /** Format value for tooltip/label, e.g. (v) => `$${v.toFixed(2)}` */
  format?: (v: number) => string;
  height?: number;
}

// ── Radial Progress ───────────────────────────────────────────────────────────
export interface RadialProgressChartProps {
  type: VChartType.radialProgress;
  /** 0–100 */
  value: number;
  label?: string;
  sublabel?: string;
  color?: string;
  trackColor?: string;
  size?: number;
  strokeWidth?: number;
}

export type VChartProps =
  | DonutChartProps
  | HorizontalBarChartProps
  | ComboChartProps
  | ScaleBarChartProps
  | SparklineChartProps
  | TreemapChartProps
  | RadialProgressChartProps;
