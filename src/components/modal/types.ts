// components/modal/types.ts
export interface VModalProps {
  /** Чи відкрите модальне вікно */
  modelValue: boolean;
  /** Заголовок модального вікна */
  title?: string;
  /** Розмір модального вікна */
  size?: VModalSize;
  /** Чи показувати кнопку закриття */
  showCloseButton?: boolean;
  /** Чи закривати при кліку на backdrop */
  closeOnBackdropClick?: boolean;
  /** Z-index для модального вікна */
  zIndex?: number;
}

export interface VModalEmits {
  (e: 'update:modelValue', value: boolean): void;

  (e: 'close'): void;
}

export type VModalSize = 'small' | 'medium' | 'large';

// Конфігурація для програмного виклику
export interface VModalConfig {
  title?: string;
  content?: string;
  component?: any;
  props?: Record<any, any>;
  size?: VModalSize;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

// Оновлений інтерфейс для $modal із підтримкою стеку
export interface VModalInstance {
  /** Відкриває нове модальне вікно та повертає його ID */
  open: (config: VModalConfig) => string;
  /** Закриває останнє (верхнє) модальне вікно */
  close: () => void;
  /** Закриває модальне вікно за ID */
  closeById: (modalId: string) => void;
  /** Закриває всі модальні вікна */
  closeAll: () => void;
  /** Повертає кількість відкритих модальних вікон */
  getOpenModalsCount: () => number;
}

// Інтерфейс для глобального $modalStack
export interface VModalStack {
  closeAll: () => void;
  getCount: () => number;
  closeById: (id: string) => void;
}

// Розширення глобальних властивостей Vue
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $modal: VModalInstance;
    $modalStack: VModalStack;
  }
}
