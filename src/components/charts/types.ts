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
}

export interface ComboSeriesConfig {
  type: 'bar' | 'line';
  color: string;
  axis?: 'left' | 'right';
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
}

// ── Horizontal Bar ────────────────────────────────────────────────────────────
export interface HorizontalBarChartProps {
  type: VChartType.horizontal;
  segments: ChartSegment[];
  showAxis?: boolean;
}

// ── Combo ─────────────────────────────────────────────────────────────────────
export interface ComboChartProps {
  type: VChartType.combo;
  data: Record<string, number | string>[];
  seriesConfig: Record<string, ComboSeriesConfig>;
  categoryKey: string;
  width?: number;
  height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
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
