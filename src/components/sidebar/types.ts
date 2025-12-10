export interface SidebarItemRaw {
  name: string;
  i18n: string;
  icon?: string;
  route?: string;
  children?: SidebarItemRaw[];
}