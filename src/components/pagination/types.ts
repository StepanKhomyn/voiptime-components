// components/pagination/types.ts

export interface PaginationProps {
  /** Загальна кількість елементів */
  totalItems: number;
  /** Кількість елементів на сторінку */
  pageSize?: number;
  /** Поточна сторінка */
  currentPage?: number;
  /** Опції для вибору кількості рядків на сторінку */
  pageSizeOptions?: number[];
  /** Максимальна кількість видимих сторінок в навігації */
  maxVisiblePages?: number;
}

export interface PaginationEmits {
  /** Емітується при зміні поточної сторінки */
  (e: 'update:currentPage', page: number): void;

  /** Емітується при зміні розміру сторінки */
  (e: 'update:pageSize', size: number): void;

  /** Емітується при будь-якій зміні пагінації */
  (e: 'pageChange', data: PaginationChangeData): void;

  /** Емітується при натисканні на кнопку */
  (e: 'reloadData', page: number): void;
}

export interface PaginationChangeData {
  /** Номер поточної сторінки */
  page: number;
  /** Розмір сторінки */
  pageSize: number;
}

export interface PaginationState {
  /** Поточна сторінка */
  currentPage: number;
  /** Розмір сторінки */
  pageSize: number;
  /** Загальна кількість сторінок */
  totalPages: number;
  /** Індекс першого елемента на поточній сторінці */
  fromItem: number;
  /** Індекс останнього елемента на поточній сторінці */
  toItem: number;
}

// Utility type for pagination calculations
export interface PaginationCalculations {
  /** Обчислює загальну кількість сторінок */
  getTotalPages(totalItems: number, pageSize: number): number;

  /** Обчислює індекс першого елемента */
  getFromItem(currentPage: number, pageSize: number): number;

  /** Обчислює індекс останнього елемента */
  getToItem(currentPage: number, pageSize: number, totalItems: number): number;

  /** Генерує масив видимих сторінок для навігації */
  getVisiblePages(currentPage: number, totalPages: number, maxVisible: number): (number | string)[];
}

// Додаткові типи для роботи з пагінацією
export type PaginationPageItem = number | string;

export interface PaginationNavigationState {
  /** Чи вимкнена кнопка "Попередня" */
  isPreviousDisabled: boolean;
  /** Чи вимкнена кнопка "Наступна" */
  isNextDisabled: boolean;
  /** Масив видимих сторінок */
  visiblePages: PaginationPageItem[];
}

// Тип для обробника зміни сторінки
export type PaginationPageChangeHandler = (page: number) => void;

// Тип для обробника зміни розміру сторінки
export type PaginationPageSizeChangeHandler = (pageSize: number) => void;

// Композабла для пагінації
export interface UsePaginationOptions {
  totalItems: number;
  pageSize?: number;
  currentPage?: number;
  maxVisiblePages?: number;
}

export interface UsePaginationReturn extends PaginationState, PaginationNavigationState {
  /** Перейти на конкретну сторінку */
  goToPage: PaginationPageChangeHandler;
  /** Перейти на попередню сторінку */
  goToPrevious: () => void;
  /** Перейти на наступну сторінку */
  goToNext: () => void;
  /** Змінити розмір сторінки */
  changePageSize: PaginationPageSizeChangeHandler;
  /** Оновити загальну кількість елементів */
  updateTotalItems: (total: number) => void;
}
