export enum ChartType {
  donut = 'donut',
  combo = 'combo',
  horizontal = 'horizontal-bar',
  scale = 'scale-bar',
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
  type: ChartType.donut;
  segments: ChartSegment[];
  size?: number;
  labels?: boolean;
}

// ── Horizontal Bar ────────────────────────────────────────────────────────────
export interface HorizontalBarChartProps {
  type: ChartType.horizontal;
  segments: ChartSegment[];
  showAxis?: boolean;
}

// ── Combo ─────────────────────────────────────────────────────────────────────
export interface ComboChartProps {
  type: ChartType.combo;
  data: Record<string, number | string>[];
  seriesConfig: Record<string, ComboSeriesConfig>;
  categoryKey: string;
  width?: number;
  height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
}

// ── Scale Bar ─────────────────────────────────────────────────────────────────
export interface ScaleBarChartProps {
  type: ChartType.scale;
  left: ScaleBarSide;
  right: ScaleBarSide;
  wrapperClass?: string;
}

export type VChartProps = DonutChartProps | HorizontalBarChartProps | ComboChartProps | ScaleBarChartProps;
