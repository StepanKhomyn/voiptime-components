export declare enum VChartType {
    donut = "donut",
    combo = "combo",
    horizontal = "horizontal-bar",
    scale = "scale-bar"
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
export interface DonutChartProps {
    type: VChartType.donut;
    segments: ChartSegment[];
    size?: number;
    labels?: boolean;
}
export interface HorizontalBarChartProps {
    type: VChartType.horizontal;
    segments: ChartSegment[];
    showAxis?: boolean;
}
export interface ComboChartProps {
    type: VChartType.combo;
    data: Record<string, number | string>[];
    seriesConfig: Record<string, ComboSeriesConfig>;
    categoryKey: string;
    width?: number;
    height?: number;
    padding?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}
export interface ScaleBarChartProps {
    type: VChartType.scale;
    left: ScaleBarSide;
    right: ScaleBarSide;
    wrapperClass?: string;
}
export type VChartProps = DonutChartProps | HorizontalBarChartProps | ComboChartProps | ScaleBarChartProps;
//# sourceMappingURL=types.d.ts.map