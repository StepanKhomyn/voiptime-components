export interface VBreadcrumbProps {
  separator?: string;
  ariaLabel?: string;
  goBack?: boolean;
}

export interface VBreadcrumbItemProps {
  /** Якщо передано — рендериться як RouterLink або <a> */
  to?: string | Record<string, any>;
  /** Поточна активна сторінка (остання у ланцюжку) */
  active?: boolean;
  /** Вимикає клік і змінює стиль */
  disabled?: boolean;
}

export interface VBreadcrumbItemEmits {
  click: [event: MouseEvent];
}
