import { type App } from 'vue';
import type { VModalConfig, VModalInstance } from './types';
declare class VModalManager implements VModalInstance {
    private modalStack;
    private baseZIndex;
    private parentApp;
    setParentApp(app: App): void;
    open(config?: VModalConfig): string;
    close(): void;
    closeById(modalId: string): void;
    closeAll(): void;
    getOpenModalsCount(): number;
    private inheritFromParentApp;
    private cleanupModal;
    private recalculateZIndices;
}
declare const modalManager: VModalManager;
export declare const VModalPlugin: {
    install(app: App): void;
};
export { modalManager };
export default VModalPlugin;
//# sourceMappingURL=plugin.d.ts.map