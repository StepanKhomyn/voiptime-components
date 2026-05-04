export interface VTransferListFetchParams {
  limit: number;
  offset: number;
}

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

  // ─── Async / pagination (опціонально) ────────────────────────────────────

  /**
   * Функція для підвантаження елементів лівої колонки.
   * Якщо передана — колонка переходить в async режим (infinite scroll + search).
   */
  fetchLeft?: (params: VTransferListFetchParams) => Promise<void>;
  /** Загальна кількість елементів лівої колонки (для визначення кінця списку) */
  leftTotal?: number;
  /** Індикатор завантаження лівої колонки */
  leftLoading?: boolean;

  /**
   * Функція для підвантаження елементів правої колонки.
   * Опціональна — використовувати лише якщо призначені елементи
   * не повертаються разом з об'єктом і їх може бути багато.
   */
  fetchRight?: (params: VTransferListFetchParams) => Promise<void>;
  /** Загальна кількість елементів правої колонки */
  rightTotal?: number;
  /** Індикатор завантаження правої колонки */
  rightLoading?: boolean;
}

export interface VTransferListEmits<T extends Record<string, any>> {
  selectLeft: [item: T];
  selectRight: [item: T];
  /** Емітується при кожному переносі елемента, з напрямком */
  transfer: [item: T, direction: 'left' | 'right'];
}