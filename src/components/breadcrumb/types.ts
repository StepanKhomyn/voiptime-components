export type BreadcrumbRouteLocation =
  | string
  | {
  name?: string;
  path?: string;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

export interface BreadcrumbRoute {
  i18n?: string;
  label?: string;
  route?: BreadcrumbRouteLocation | null;
}

export interface VBreadcrumbProps {
  separator?: string;
  ariaLabel?: string;
  goBack?: boolean;
  routes?: BreadcrumbRoute[];
}

export interface VBreadcrumbItemProps {
  /** Якщо передано — рендериться як RouterLink або <a> */
  to?: BreadcrumbRouteLocation;
  /** Поточна активна сторінка (остання у ланцюжку) */
  active?: boolean;
  /** Вимикає клік і змінює стиль */
  disabled?: boolean;
}

export interface VBreadcrumbItemEmits {
  click: [event: MouseEvent];
}
