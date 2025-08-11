// index.ts - оновлений головний файл бібліотеки з підтримкою таблиці
import type { App } from 'vue';
import VButton from './components/button/VButton.vue';
import VIcon from './components/icon/VIcon.vue';
import VLoader from './components/loader/VLoader.vue';
import VModal from './components/modal/VModal.vue';
import VPagination from './components/pagination/VPagination.vue';
import VCheckbox from './components/checkbox/VCheckbox.vue';
import VTable from './components/table/VTable.vue';
import VTableColumn from './components/table/VTableColumn.vue';
import './assets/main.scss';
import { tooltipDirective } from './directives/tooltip/tooltip';
import { VModalPlugin } from './components/modal/plugin';

// Експортуємо компоненти
export { VButton, VIcon, VLoader, VModal, VPagination, VCheckbox, VTable, VTableColumn };

// Експортуємо директиви
export { tooltipDirective };

// Експортуємо типи для кращої підтримки TypeScript
export type { VButtonProps, VButtonEmits, VButtonType } from './components/button/types';

export type { IconName } from './icons/index';
export type { TooltipPlacement } from './directives/tooltip/types';

export type { VModalProps, VModalEmits, VModalSize, VModalConfig, VModalInstance } from './components/modal/types';

// Експортуємо типи пагінації
export type {
  PaginationProps,
  PaginationEmits,
  PaginationChangeData,
  PaginationState,
  PaginationCalculations,
} from './components/pagination/types';

// Експортуємо типи чекбоксу
export type { VCheckboxProps, VCheckboxEmits, VCheckboxSlots } from './components/checkbox/types';

// Експортуємо ВСІ типи таблиці з явною типізацією
export type {
  VTableProps,
  VTableEmits,
  VTableColumnProps,
  VTableColumnGroup,
  VTableStyleConfig,
  VTableRenderSlot,
  SortDirection,
  SortState,
  StickyPosition,
  ResizeState,
  SortChangeEventData,
  SelectionChangeEventData,
} from './components/table/types';

// Експортуємо константи
export { DEFAULT_COLUMN_CONFIG } from './components/table/types';

// Експортуємо плагін модального вікна окремо
export { VModalPlugin, modalManager } from './components/modal/plugin';

// Інтерфейс для опцій плагіна
export interface VUIPluginOptions {
  prefix?: string;
  modal?: boolean; // Чи підключати $modal глобально
}

// Головний плагін для Vue
const VUIPlugin = {
  install(app: App, options: VUIPluginOptions = {}) {
    const { prefix = 'V', modal = true } = options;

    // Реєструємо компоненти з явною типізацією
    app.component(`${prefix}Button`, VButton);
    app.component(`${prefix}Icon`, VIcon);
    app.component(`${prefix}Loader`, VLoader);
    app.component(`${prefix}Modal`, VModal);
    app.component(`${prefix}Pagination`, VPagination);
    app.component(`${prefix}Checkbox`, VCheckbox);
    app.component(`${prefix}Table`, VTable);
    app.component(`${prefix}TableColumn`, VTableColumn);

    // Реєструємо директиви
    app.directive('tooltip', tooltipDirective);

    // Підключаємо плагін модального вікна якщо потрібно
    if (modal) {
      app.use(VModalPlugin);
    }
  },
};

// Експортуємо плагін як default
export default VUIPlugin;

// Експортуємо окремо для індивідуального імпорту
export const install = VUIPlugin.install;

// TypeScript декларації для глобальних властивостей
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $modal: import('./components/modal/types').VModalInstance;
  }
}
