export interface VColorPickerProps {
  color?: string;
  isShowLabel?: boolean;
  presets?: string[];
  disabled?: boolean;
}

export type VColorPickerEmits = {
  updateColor: [color: string];
};