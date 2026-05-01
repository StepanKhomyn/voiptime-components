export interface VTransferListProps<T extends Record<string, any>> {
  /** Ключ для відображення тексту елемента */
  optionLabel?: keyof T & string;
  /** Ключ унікального ідентифікатора елемента */
  optionValue?: keyof T & string;
  /** Підсвічує правий контейнер червоною рамкою при невалідному стані */
  isValidRightContainer?: boolean;
  /** Фіксована висота контейнерів (наприклад: '300px') */
  heightStyle?: string;
  /** Плейсхолдер лівого списку */
  leftPlaceholder?: string;
  /** Плейсхолдер правого списку */
  rightPlaceholder?: string;
  /** Заголовок лівого списку */
  leftLabel?: string;
  /** Заголовок правого списку */
  rightLabel?: string;
}

export interface VTransferListEmits<T extends Record<string, any>> {
  selectLeft: [item: T];
  selectRight: [item: T];
  /** Емітується при кожному переносі елемента, з напрямком */
  transfer: [item: T, direction: 'left' | 'right'];
}