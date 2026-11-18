export interface VWidgetCardProps {
  /** Заголовок у шапці (або слот `title`) */
  title?: string;
  /** Показати іконку завантаження в шапці (подія `download`) */
  downloadable?: boolean;
  /** Тіло без внутрішніх відступів — для таблиць і графіків на всю ширину */
  flush?: boolean;
}

export interface VWidgetCardEmits {
  (e: 'download'): void;
}
