export interface SidebarItemRaw {
  i18n: string;
  icon?: string;
  route?: string;
  extension?: string;
  implemented?: boolean;
  children?: SidebarItemRaw[];
}