// components/modal/plugin.ts
import { type App, createApp, h, ref } from 'vue';
import VModal from './VModal.vue';
import type { VModalConfig, VModalInstance } from './types';

interface ModalEntry {
  id: string;
  app: App;
  container: HTMLElement;
  isOpen: { value: boolean };
}

class VModalManager implements VModalInstance {
  private modalStack: ModalEntry[] = [];
  private baseZIndex = 1000;

  open(config: VModalConfig = {}): string {
    // Генеруємо унікальний ID для модального вікна
    const modalId = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Створюємо контейнер
    const container = document.createElement('div');
    container.setAttribute('data-vt-modal', modalId);
    document.body.appendChild(container);

    // Reactive стан
    const isOpen = ref(true);

    // Розраховуємо z-index для нового модального вікна
    const currentZIndex = this.baseZIndex + this.modalStack.length * 10;

    // Створюємо Vue додаток
    const app = createApp({
      setup() {
        const handleClose = () => {
          isOpen.value = false;
          // Затримка для можливої анімації
          setTimeout(() => {
            modalManager.closeById(modalId);
          }, 100);
        };

        return () =>
          h(
            VModal,
            {
              modelValue: isOpen.value,
              'onUpdate:modelValue': handleClose,
              title: config.title,
              size: config.size || 'medium',
              showCloseButton: config.showCloseButton !== false,
              closeOnBackdropClick: config.closeOnBackdropClick !== false,
              onClose: handleClose,
              zIndex: currentZIndex,
            },
            {
              default: () => {
                // Якщо передано компонент
                if (config.component) {
                  return h(config.component, config.props || {});
                }
                // Якщо передано HTML контент
                if (config.content) {
                  return h('div', { innerHTML: config.content });
                }
                return null;
              },
            }
          );
      },
    });

    // Монтуємо
    app.mount(container);

    // Додаємо до стеку
    const modalEntry: ModalEntry = {
      id: modalId,
      app,
      container,
      isOpen,
    };

    this.modalStack.push(modalEntry);

    return modalId;
  }

  close(): void {
    // Закриваємо останнє (верхнє) модальне вікно
    if (this.modalStack.length > 0) {
      const lastModal = this.modalStack[this.modalStack.length - 1];
      this.closeById(lastModal.id);
    }
  }

  closeById(modalId: string): void {
    const modalIndex = this.modalStack.findIndex(modal => modal.id === modalId);

    if (modalIndex !== -1) {
      const modal = this.modalStack[modalIndex];

      // Закриваємо модальне вікно
      this.cleanupModal(modal);

      // Видаляємо з стеку
      this.modalStack.splice(modalIndex, 1);

      // Перерахунок z-index для решти модальних вікон
      this.recalculateZIndices();
    }
  }

  closeAll(): void {
    // Закриваємо всі модальні вікна
    while (this.modalStack.length > 0) {
      const modal = this.modalStack.pop();
      if (modal) {
        this.cleanupModal(modal);
      }
    }
  }

  getOpenModalsCount(): number {
    return this.modalStack.length;
  }

  private cleanupModal(modal: ModalEntry): void {
    if (modal.app) {
      modal.app.unmount();
    }

    if (modal.container && modal.container.parentNode) {
      document.body.removeChild(modal.container);
    }
  }

  private recalculateZIndices(): void {
    // Оскільки z-index тепер передається через пропси,
    // перерахунок відбувається автоматично при ре-рендері
    // Ця функція залишена для майбутньої функціональності
  }
}

// Глобальний екземпляр
const modalManager = new VModalManager();

// Плагін для додавання $modal до Vue
export const VModalPlugin = {
  install(app: App) {
    app.config.globalProperties.$modal = modalManager;

    // Додаємо глобальні методи для управління стеком модальних вікон
    app.config.globalProperties.$modalStack = {
      closeAll: () => modalManager.closeAll(),
      getCount: () => modalManager.getOpenModalsCount(),
      closeById: (id: string) => modalManager.closeById(id),
    };
  },
};

// Експортуємо modalManager для прямого доступу
export { modalManager };

// Default export
export default VModalPlugin;
