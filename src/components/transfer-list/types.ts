export interface VTransferListFetchParams {
  limit: number;
  offset: number;
}

export interface VTransferListProps<T extends Record<string, any>> {
  optionLabel?: keyof T & string;
  optionValue?: keyof T & string;
  isValidRightContainer?: boolean;
  heightStyle?: string;
  leftPlaceholder?: string;
  rightPlaceholder?: string;
  leftLabel?: string;
  rightLabel?: string;
  fetchLeft?: (params: VTransferListFetchParams) => Promise<void>;
  leftTotal?: number;
  leftLoading?: boolean;
  fetchRight?: (params: VTransferListFetchParams) => Promise<void>;
  rightTotal?: number;
  rightLoading?: boolean;
  fetchLimit?: number;
  added?: T[];
  removed?: T[];
}

export interface VTransferListEmits<T extends Record<string, any>> {
  selectLeft: [item: T];
  selectRight: [item: T];
  transfer: [item: T, direction: 'left' | 'right'];
  'update:added': [items: T[]];
  'update:removed': [items: T[]];
}