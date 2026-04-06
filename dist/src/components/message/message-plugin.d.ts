import { type App } from 'vue';
import type { VMessageMethods, VMessageOptions } from './types';
declare class VMessageManager {
    private messageInstance;
    private app;
    private container;
    call(options?: VMessageOptions): number;
    success(message: string, options?: Partial<VMessageOptions>): number;
    danger(message: string, options?: Partial<VMessageOptions>): number;
    warning(message: string, options?: Partial<VMessageOptions>): number;
    primary(message: string, options?: Partial<VMessageOptions>): number;
    close(id: number): void;
    closeAll(): void;
    getOpenMessagesCount(): number;
    private ensureInstance;
}
declare const messageManager: VMessageManager;
declare const VMessage: VMessageMethods;
declare const VMessagePlugin: {
    install(app: App): void;
};
export default VMessagePlugin;
export { VMessage, messageManager };
export { VMessagePlugin };
//# sourceMappingURL=message-plugin.d.ts.map