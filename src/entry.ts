// index.ts - оновлений головний файл бібліотеки
import type { App } from 'vue';
import VButton from './components/button/VButton.vue';
import VIcon from './components/icon/VIcon.vue';
import VLoader from './components/loader/VLoader.vue';
import VModal from './components/modal/VModal.vue';
import VPagination from './components/pagination/VPagination.vue';
import VCheckbox from './components/checkbox/VCheckbox.vue';
import VRadiobox from './components/radiobox/VRadiobox.vue';
import VTable from './components/table/VTable.vue';
import VTableColumn from './components/table/VTableColumn.vue';
import VDropdown from './components/dropdown/VDropdown.vue';
import VDropdownItem from './components/dropdown/VDropdownItem.vue';
import VInput from './components/input/VInput.vue';
import VSelect from './components/select/VSelect.vue';
import VOption from './components/select/VOption.vue';
import VDatePicker from './components/datepicker/VDatePicker.vue';
import VTimePicker from './components/timepicker/VTimePicker.vue';
import VCollapse from './components/collapse/VCollapse.vue';
import VCollapseItem from './components/collapse/VCollapseItem.vue';
import VTabs from './components/tabs/VTabs.vue';
import VTabItem from './components/tabs/VTabItem.vue';
import VUpload from './components/upload/VUpload.vue';
import VSidebar from './components/sidebar/VSidebar.vue';

import './assets/main.scss';
import { tooltipDirective } from './directives/tooltip/tooltip';
import { loaderDirective } from './directives/loader/loader';
import { VModalPlugin } from './components/modal/plugin';
import { VMessagePlugin } from './components/message/message-plugin';
import { I18nPlugin, setLocale as internalSetLocale } from './locales/index';
import { LANGUAGES } from './locales/types';

// ----------------- Експортуємо компоненти -----------------
export {
  VButton,
  VIcon,
  VLoader,
  VModal,
  VPagination,
  VCheckbox,
  VRadiobox,
  VTable,
  VTableColumn,
  VDropdown,
  VDropdownItem,
  VInput,
  VSelect,
  VOption,
  VDatePicker,
  VTimePicker,
  VCollapse,
  VCollapseItem,
  VTabs,
  VTabItem,
  VUpload,
  VSidebar,
};

// ----------------- Експортуємо директиви -----------------
export { tooltipDirective };
export { loaderDirective };

// ----------------- Експортуємо типи -----------------
export type { VButtonProps, VButtonEmits, VButtonType } from './components/button/types';
export type { IconName } from './icons/index';
export type { TooltipPlacement } from './directives/tooltip/types';

export type { VModalProps, VModalEmits, VModalSize, VModalConfig, VModalInstance } from './components/modal/types';

// VMessage типи
export type { VMessageType, VMessageOptions, VMessageInstance, VMessageMethods } from './components/message/types';

export type {
  PaginationProps,
  PaginationEmits,
  PaginationChangeData,
  PaginationState,
  PaginationCalculations,
} from './components/pagination/types';

export type { VCheckboxProps, VCheckboxEmits, VCheckboxSlots } from './components/checkbox/types';
export type { VRadioboxProps, VRadioboxEmits } from './components/radiobox/types';

// ----------------- Експортуємо валідацію -----------------
export * from './validation';

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
  VTableRowHighlightType,
  VTableRowHighlight,
  VTableRowHighlightFunction,
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

export type {
  VtSelectProps,
  VtSelectEmits,
  VtSelectMethods,
  VtSelectOption,
  VtSelectStatus,
  VtSelectContext,
  VtOptionEmits,
} from './components/select/types';

// VDatePicker
export type {
  DatePickerType,
  DatePickerSize,
  DateValue,
  DateRangeValue,
  DatePickerValue,
  VDatePickerProps,
  VDatePickerEmits,
  VDatePickerMethods,
  DatePickerShortcut,
  FormatToken,
  DateValidationResult,
} from './components/datepicker/types';

// VTimePicker
export type {
  TimePickerType,
  TimePickerSize,
  TimeValue,
  TimeRangeValue,
  TimePickerValue,
  VTimePickerProps,
  VTimePickerEmits,
  VTimePickerMethods,
  TimeObject,
  TimeValidationResult,
} from './components/timepicker/types';

// VCollapse
export type {
  CollapseItemProps,
  CollapseProps,
  CollapseEmits,
  CollapseItemEmits,
  CollapseContext,
} from './components/collapse/types';

// VTabs
export type { VTabsProps, VTabItemProps, VTabsEmits } from './components/tabs/types';

// ----------------- Upload -----------------
export { FileValidator, FileParser } from './components/upload/types';

export type {
  UploadFile,
  VUploadProps,
  VUploadEmits,
  UploadError,
  ParseResult,
  SheetParseResult,
} from './components/upload/types';

// ----------------- Експортуємо константи -----------------
export { DEFAULT_COLUMN_CONFIG } from './components/table/types';
export { DropdownContextKey } from './components/dropdown/types';
export { VtSelectContextKey } from './components/select/types';

// VDatePicker константи
export { FORMAT_TOKENS, DEFAULT_FORMATS, isValidDate, validateDateValue } from './components/datepicker/types';

// VTimePicker константи
export {
  DEFAULT_TIME_FORMATS,
  isValidTimeString,
  validateTimeValue,
  formatTime,
  parseTimeString,
  generateTimeOptions,
} from './components/timepicker/types';

// ----------------- Плагіни -----------------
export { VModalPlugin, modalManager } from './components/modal/plugin';
export { VMessagePlugin, VMessage, messageManager } from './components/message/message-plugin';

// ----------------- Локалізація (тільки публічний API) -----------------

// Публічна функція для зміни мови
export function setLocale(locale: LANGUAGES): void {
  internalSetLocale(locale);
}

export { LANGUAGES };

// ----------------- Інтерфейс опцій плагіна -----------------
export interface VUIPluginOptions {
  prefix?: string;
  modal?: boolean;
  message?: boolean;
  locale?: LANGUAGES; // Початкова мова (за замовчуванням: uk)
}

const VUIPlugin = {
  install(app: App, options: VUIPluginOptions = {}) {
    const { prefix = 'V', modal = true, message = true, locale = LANGUAGES.uk } = options;

    // Реєстрація компонентів
    app.component(`${prefix}Button`, VButton);
    app.component(`${prefix}Icon`, VIcon);
    app.component(`${prefix}Loader`, VLoader);
    app.component(`${prefix}Modal`, VModal);
    app.component(`${prefix}Pagination`, VPagination);
    app.component(`${prefix}Checkbox`, VCheckbox);
    app.component(`${prefix}Radiobox`, VRadiobox);
    app.component(`${prefix}Table`, VTable);
    app.component(`${prefix}TableColumn`, VTableColumn);
    app.component(`${prefix}Dropdown`, VDropdown);
    app.component(`${prefix}DropdownItem`, VDropdownItem);
    app.component(`${prefix}Input`, VInput);
    app.component(`${prefix}Select`, VSelect);
    app.component(`${prefix}Option`, VOption);
    app.component(`${prefix}DatePicker`, VDatePicker);
    app.component(`${prefix}TimePicker`, VTimePicker);
    app.component(`${prefix}Collapse`, VCollapse);
    app.component(`${prefix}CollapseItem`, VCollapseItem);
    app.component(`${prefix}Tabs`, VTabs);
    app.component(`${prefix}TabItem`, VTabItem);
    app.component(`${prefix}Upload`, VUpload);
    app.component(`${prefix}Sidebar`, VSidebar);

    // Директиви
    app.directive('tooltip', tooltipDirective);
    app.directive('loader', loaderDirective);

    // Плагіни
    if (modal) {
      app.use(VModalPlugin);
    }

    if (message) {
      app.use(VMessagePlugin);
    }

    // Ініціалізація локалізації з вибраною мовою
    app.use(I18nPlugin, { locale: locale as LANGUAGES });
  },
};

export default VUIPlugin;
export const install = VUIPlugin.install;

// ----------------- Глобальні властивості -----------------
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $modal: import('./components/modal/types').VModalInstance;
    $message: import('./components/message/types').VMessageMethods;
    $messageStack: {
      closeAll: () => void;
      getCount: () => number;
      closeById: (id: number) => void;
    };
  }
}
