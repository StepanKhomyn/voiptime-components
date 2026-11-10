export type VWidgetGridId = string | number;

/** Позиція та розмір віджета в одиницях сітки (колонки / рядки) */
export interface VWidgetGridItem {
  id: VWidgetGridId;
  /** Колонка (0-based) */
  x: number;
  /** Рядок (0-based) */
  y: number;
  /** Ширина в колонках */
  w: number;
  /** Висота в рядках */
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  /** Зафіксований: не рухається і не змінює розмір, інші його обтікають */
  static?: boolean;
  /** false — заборонити перетягування цього віджета */
  draggable?: boolean;
  /** false — заборонити зміну розміру цього віджета */
  resizable?: boolean;
}

export type VWidgetGridLayout = VWidgetGridItem[];

export type VWidgetGridResizeHandle = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface VWidgetGridProps {
  /** Розкладка (v-model) */
  modelValue: VWidgetGridLayout;
  /** Режим редагування (v-model:editing) */
  editing?: boolean;
  /** Кількість колонок */
  columns?: number;
  /** Висота одного рядка, px */
  rowHeight?: number;
  /** Відступ між віджетами, px */
  gap?: number;
  /** Автоматично "підтягувати" віджети вгору, прибираючи порожнечі */
  compact?: boolean;
  /** Вхід у режим редагування довгим натисканням (як на телефоні) */
  longPress?: boolean;
  /** Тривалість довгого натискання, мс */
  longPressDelay?: number;
  /** CSS-селектор елемента, за який можна тягнути. Без нього — за весь віджет */
  dragHandle?: string;
  /** Які ручки зміни розміру показувати */
  resizeHandles?: VWidgetGridResizeHandle[];
  /** Показувати клітинки сітки в режимі редагування */
  showGrid?: boolean;
  /** Нижче цієї ширини контейнера (px) віджети стають в одну колонку, редагування вимикається. 0 — вимкнено */
  stackBelow?: number;
}

export interface VWidgetGridEmits {
  (e: 'update:modelValue', layout: VWidgetGridLayout): void;
  (e: 'update:editing', value: boolean): void;
  /** Фінальна розкладка після переміщення / зміни розміру */
  (e: 'change', layout: VWidgetGridLayout): void;
  (e: 'drag-start', item: VWidgetGridItem): void;
  (e: 'drag-end', item: VWidgetGridItem): void;
  (e: 'resize-start', item: VWidgetGridItem): void;
  (e: 'resize-end', item: VWidgetGridItem): void;
  (e: 'select', id: VWidgetGridId | null): void;
}

export interface VWidgetGridSlotProps {
  item: VWidgetGridItem;
  editing: boolean;
  active: boolean;
}
