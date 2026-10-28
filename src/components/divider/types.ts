export interface VDividerProps {
  /** Текст підзаголовка (альтернатива default-слоту) */
  text?: string | number;
  /** Колір фону плашки з текстом (будь-який CSS-колір) */
  background?: string;
  /** Розмір шрифту: число — у px, рядок — як є (напр. '1rem') */
  fontSize?: number | string;
  /** Колір тексту */
  color?: string;
  /** Колір лінії */
  lineColor?: string;
}
