// message-plugin.ts
import { type App, createApp } from 'vue';
import VMessageComponent from './VMessage.vue';
import type { VMessageMethods, VMessageOptions } from './types';

class VMessageManager {
  private messageInstance: any = null;
  private app: App | null = null;
  private container: HTMLElement | null = null;

  // Головний метод для створення повідомлень
  call(options: VMessageOptions = {} as VMessageOptions): number {
    const instance = this.ensureInstance();
    return instance.addMessage({
      message: options.message || '',
      title: options.title || '',
      type: options.type || 'primary',
      showClose: options.showClose || false,
      duration: options.duration !== undefined ? options.duration : 3000,
      dangerouslyUseHTMLString: options.dangerouslyUseHTMLString || false,
    });
  }

  // Швидкі методи для різних типів повідомлень
  success(message: string, options: Partial<VMessageOptions> = {}): number {
    return this.call({ ...options, message, type: 'success' });
  }

  danger(message: string, options: Partial<VMessageOptions> = {}): number {
    return this.call({ ...options, message, type: 'danger' });
  }

  warning(message: string, options: Partial<VMessageOptions> = {}): number {
    return this.call({ ...options, message, type: 'warning' });
  }

  primary(message: string, options: Partial<VMessageOptions> = {}): number {
    return this.call({ ...options, message, type: 'primary' });
  }

  close(id: number): void {
    if (this.messageInstance) {
      this.messageInstance.removeMessage(id);
    }
  }

  closeAll(): void {
    if (this.messageInstance) {
      // Очищуємо всі повідомлення
      this.messageInstance.messages = [];
    }

    // Видаляємо контейнер і скидуємо instance
    if (this.container && this.container.parentNode) {
      document.body.removeChild(this.container);
    }

    if (this.app) {
      this.app.unmount();
    }

    this.messageInstance = null;
    this.app = null;
    this.container = null;
  }

  getOpenMessagesCount(): number {
    return this.messageInstance ? this.messageInstance.messages.length : 0;
  }

  private ensureInstance() {
    if (this.messageInstance) return this.messageInstance;

    // Створюємо контейнер
    this.container = document.createElement('div');
    this.container.setAttribute('data-vt-message-container', '');
    document.body.appendChild(this.container);

    // Створюємо Vue додаток з компонентою VMessage
    this.app = createApp(VMessageComponent);
    this.messageInstance = this.app.mount(this.container);

    return this.messageInstance;
  }
}

// Глобальний екземпляр менеджера
const messageManager = new VMessageManager();

// Створюємо функцію VMessage що делегує виклики до менеджера
const VMessage: VMessageMethods = Object.assign(
  (options: VMessageOptions = {} as VMessageOptions): number => {
    return messageManager.call(options);
  },
  {
    success: (message: string, options: Partial<VMessageOptions> = {}): number => {
      return messageManager.success(message, options);
    },
    danger: (message: string, options: Partial<VMessageOptions> = {}): number => {
      return messageManager.danger(message, options);
    },
    warning: (message: string, options: Partial<VMessageOptions> = {}): number => {
      return messageManager.warning(message, options);
    },
    primary: (message: string, options: Partial<VMessageOptions> = {}): number => {
      return messageManager.primary(message, options);
    },
    close: (id: number): void => {
      messageManager.close(id);
    },
    closeAll: (): void => {
      messageManager.closeAll();
    },
  }
);

// Плагін для Vue 3
const VMessagePlugin = {
  install(app: App) {
    // Додаємо $message до глобальних властивостей
    app.config.globalProperties.$message = VMessage;

    // Додаємо через provide/inject
    app.provide('$message', VMessage);

    // Додаємо додаткові утиліти для роботи зі стеком повідомлень
    app.config.globalProperties.$messageStack = {
      closeAll: () => messageManager.closeAll(),
      getCount: () => messageManager.getOpenMessagesCount(),
      closeById: (id: number) => messageManager.close(id),
    };
  },
};

export default VMessagePlugin;
export { VMessage, messageManager };
// Альтернативні експорти для зворотної сумісності
export { VMessagePlugin };
