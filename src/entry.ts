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
import { tooltipDirective } from './directives/tooltip/tooltip.ts';
import { VModalPlugin } from './components/modal/plugin';

// Експортуємо компоненти з типами
export { VButton, VIcon, VLoader, VModal, VPagination, VCheckbox, VTable, VTableColumn };
export { tooltipDirective };

// Експортуємо типи для кращої підтримки TypeScript
export type { VButtonProps, VButtonEmits, VButtonType, VButtonSize } from './components/button/types';
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

// Експортуємо типи таблиці
export type {
  VTableProps,
  VTableColumn,
  VTableColumnGroup,
  VTableEmits,
  VTableStyleConfig,
  SortDirection,
  SortState,
  StickyPosition,
  ResizeState,
  SortChangeEventData,
  SelectionChangeEventData,
  DEFAULT_COLUMN_CONFIG,
} from './components/table/types';

// Експортуємо плагін модального вікна окремо
export { VModalPlugin, modalManager } from './components/modal/plugin';

// Плагін для Vue
export interface VUIPluginOptions {
  prefix?: string;
  modal?: boolean; // Чи підключати $modal глобально
}

const VUIPlugin = {
  install(app: App, options: VUIPluginOptions = {}) {
    const { prefix = 'V', modal = true } = options;

    // Реєструємо компоненти
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

export default VUIPlugin;

// Експортуємо окремо для індивідуального імпорту
export const install = VUIPlugin.install;

// TypeScript декларації для глобальних властивостей
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $modal: VModalInstance;
  }
}
