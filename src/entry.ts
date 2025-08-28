// index.ts - оновлений головний файл бібліотеки з підтримкою input, select, таблиці та dropdown
import type { App } from 'vue';
import VButton from './components/button/VButton.vue';
import VIcon from './components/icon/VIcon.vue';
import VLoader from './components/loader/VLoader.vue';
import VModal from './components/modal/VModal.vue';
import VPagination from './components/pagination/VPagination.vue';
import VCheckbox from './components/checkbox/VCheckbox.vue';
import VTable from './components/table/VTable.vue';
import VTableColumn from './components/table/VTableColumn.vue';
import VDropdown from './components/dropdown/VDropdown.vue';
import VDropdownItem from './components/dropdown/VDropdownItem.vue';
import VInput from './components/input/VInput.vue';
import VSelect from './components/select/VSelect.vue';
import VOption from './components/select/VOption.vue';

import './assets/main.scss';
import { tooltipDirective } from './directives/tooltip/tooltip';
import { VModalPlugin } from './components/modal/plugin';

// ----------------- Експортуємо компоненти -----------------
export {
  VButton,
  VIcon,
  VLoader,
  VModal,
  VPagination,
  VCheckbox,
  VTable,
  VTableColumn,
  VDropdown,
  VDropdownItem,
  VInput,
  VSelect,
  VOption,
};

// ----------------- Експортуємо директиви -----------------
export { tooltipDirective };

// ----------------- Експортуємо типи -----------------
export type { VButtonProps, VButtonEmits, VButtonType } from './components/button/types';
export type { IconName } from './icons/index';
export type { TooltipPlacement } from './directives/tooltip/types';

export type { VModalProps, VModalEmits, VModalSize, VModalConfig, VModalInstance } from './components/modal/types';

export type {
  PaginationProps,
  PaginationEmits,
  PaginationChangeData,
  PaginationState,
  PaginationCalculations,
} from './components/pagination/types';

export type { VCheckboxProps, VCheckboxEmits, VCheckboxSlots } from './components/checkbox/types';

// Таблиця
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

// Dropdown
export type {
  DropdownProps,
  DropdownItemProps,
  DropdownEmits,
  DropdownItemEmits,
  DropdownExpose,
  DropdownContext,
  DropdownTriggerType,
  DropdownPlacement,
} from './components/dropdown/types';

// Input
export type {
  VtInputProps,
  VtInputEmits,
  VtInputMethods,
  VtInputValidationResult,
  VtInputAutosizeConfig,
  VtInputSize,
  VtInputStatus,
  VtInputType,
  VtInputResize,
} from './components/input/types';

// Select
export type {
  VtSelectProps,
  VtSelectEmits,
  VtSelectMethods,
  VtSelectOption,
  VtSelectSize,
  VtSelectStatus,
  VtOptionProps,
  VtOptionEmits,
  VtSelectContext,
} from './components/select/types';

// ----------------- Експортуємо константи -----------------
export { DEFAULT_COLUMN_CONFIG } from './components/table/types';
export { DropdownContextKey } from './components/dropdown/types';
export { VtSelectContextKey } from './components/select/types';

// ----------------- Плагін -----------------
export { VModalPlugin, modalManager } from './components/modal/plugin';

export interface VUIPluginOptions {
  prefix?: string;
  modal?: boolean;
}

const VUIPlugin = {
  install(app: App, options: VUIPluginOptions = {}) {
    const { prefix = 'V', modal = true } = options;

    // Реєстрація компонентів
    app.component(`${prefix}Button`, VButton);
    app.component(`${prefix}Icon`, VIcon);
    app.component(`${prefix}Loader`, VLoader);
    app.component(`${prefix}Modal`, VModal);
    app.component(`${prefix}Pagination`, VPagination);
    app.component(`${prefix}Checkbox`, VCheckbox);
    app.component(`${prefix}Table`, VTable);
    app.component(`${prefix}TableColumn`, VTableColumn);
    app.component(`${prefix}Dropdown`, VDropdown);
    app.component(`${prefix}DropdownItem`, VDropdownItem);
    app.component(`${prefix}Input`, VInput);
    app.component(`${prefix}Select`, VSelect);
    app.component(`${prefix}Option`, VOption);

    // Директиви
    app.directive('tooltip', tooltipDirective);

    if (modal) {
      app.use(VModalPlugin);
    }
  },
};

export default VUIPlugin;
export const install = VUIPlugin.install;

// ----------------- Глобальні властивості -----------------
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $modal: import('./components/modal/types').VModalInstance;
  }
}
