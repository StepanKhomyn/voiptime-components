export type BreadcrumbRouteLocation =
  | string
  | {
  name?: string;
  path?: string;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

export interface VBreadcrumbProps {
  separator?: string;
  ariaLabel?: string;
  goBack?: boolean;
}

export interface VBreadcrumbItemProps {
  /** Якщо передано — рендериться як RouterLink або <a> */
  to?: BreadcrumbRouteLocation;
  /** Поточна активна сторінка (остання у ланцюжку) */
  active?: boolean;
  /** Вимикає клік і змінює стиль */
  disabled?: boolean;
}

export interface VBreadcrumbEmits {
  back: [];
}

export interface VBreadcrumbItemEmits {
  click: [event: MouseEvent];
}
