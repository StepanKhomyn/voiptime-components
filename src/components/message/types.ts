export type VMessageType = 'success' | 'warning' | 'primary' | 'danger';

export interface VMessageOptions {
  message: string;
  title?: string;
  type?: VMessageType;
  showClose?: boolean;
  duration?: number;
  dangerouslyUseHTMLString?: boolean;
}

export interface VMessageInstance extends VMessageOptions {
  id: number;
  type: VMessageType;
}

export interface VMessageMethods {
  success: (message: string, options?: Partial<VMessageOptions>) => number;
  danger: (message: string, options?: Partial<VMessageOptions>) => number;
  warning: (message: string, options?: Partial<VMessageOptions>) => number;
  primary: (message: string, options?: Partial<VMessageOptions>) => number;
  close: (id: number) => void;
  closeAll: () => void;

  (options: VMessageOptions): number;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: VMessageMethods;
  }
}
