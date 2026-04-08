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
import VLocaleSelect from '@/components/select/VLocaleSelect.vue';
import VOption from './components/select/VOption.vue';
import VDatePicker from './components/datepicker/VDatePicker.vue';
import VTimePicker from './components/timepicker/VTimePicker.vue';
import VCollapse from './components/collapse/VCollapse.vue';
import VCollapseItem from './components/collapse/VCollapseItem.vue';
import VTabs from './components/tabs/VTabs.vue';
import VTabItem from './components/tabs/VTabItem.vue';
import VUpload from './components/upload/VUpload.vue';
import VSidebar from './components/sidebar/VSidebar.vue';
import VLogin from '@/components/login/VLogin.vue';
import VLoginLogo from '@/components/login/VLoginLogo.vue';
import VDynamicFilter from '@/components/dynamic-filter/VDynamicFilter.vue';
import VSlider from '@/components/slider/VSlider.vue';
import VSliderMarkRange from '@/components/slider/VSliderMarkRange.vue';
import VChart from '@/components/charts/VChart.vue';
import './assets/main.scss';
import { tooltipDirective } from './directives/tooltip/tooltip';
import { loaderDirective } from './directives/loader/loader';
import { LANGUAGES } from './locales/types';
export { VButton, VIcon, VLoader, VModal, VPagination, VCheckbox, VRadiobox, VTable, VTableColumn, VDropdown, VDropdownItem, VInput, VSelect, VLocaleSelect, VOption, VDatePicker, VTimePicker, VCollapse, VCollapseItem, VTabs, VTabItem, VUpload, VSidebar, VLogin, VLoginLogo, VDynamicFilter, VSlider, VSliderMarkRange, VChart, };
export { tooltipDirective };
export { loaderDirective };
export type { VButtonProps, VButtonEmits, VButtonType } from './components/button/types';
export type { IconName } from './icons/index';
export type { TooltipPlacement } from './directives/tooltip/types';
export type { VModalProps, VModalEmits, VModalSize, VModalConfig, VModalInstance } from './components/modal/types';
export type { VMessageType, VMessageOptions, VMessageInstance, VMessageMethods } from './components/message/types';
export type { PaginationProps, PaginationEmits, PaginationChangeData, PaginationState, PaginationCalculations, } from './components/pagination/types';
export type { VCheckboxProps, VCheckboxEmits, VCheckboxSlots } from './components/checkbox/types';
export type { VRadioboxProps, VRadioboxEmits } from './components/radiobox/types';
export * from './validation';
export type { VTableProps, VTableEmits, VTableColumnProps, VTableColumnGroup, VTableStyleConfig, VTableRenderSlot, SortDirection, SortState, StickyPosition, ResizeState, SortChangeEventData, SelectionChangeEventData, VTableRowHighlightType, VTableRowHighlight, VTableRowHighlightFunction, } from './components/table/types';
export type { DropdownProps, DropdownItemProps, DropdownEmits, DropdownItemEmits, DropdownExpose, DropdownContext, DropdownTriggerType, DropdownPlacement, } from './components/dropdown/types';
export type { VtInputProps, VtInputEmits, VtInputMethods, VtInputValidationResult, VtInputAutosizeConfig, VtInputSize, VtInputStatus, VtInputType, VtInputResize, } from './components/input/types';
export type { VtSelectProps, VtSelectEmits, VtSelectMethods, VtSelectOption, VtSelectStatus, VtSelectContext, VtOptionEmits, VLocaleSelectProps, VLocale, VLocaleEmits, } from './components/select/types';
export type { DatePickerType, DatePickerSize, DateValue, DateRangeValue, DatePickerValue, VDatePickerProps, VDatePickerEmits, VDatePickerMethods, DatePickerShortcut, FormatToken, DateValidationResult, } from './components/datepicker/types';
export type { TimePickerType, TimePickerSize, TimeValue, TimeRangeValue, TimePickerValue, VTimePickerProps, VTimePickerEmits, VTimePickerMethods, TimeObject, TimeValidationResult, } from './components/timepicker/types';
export type { CollapseItemProps, CollapseProps, CollapseEmits, CollapseItemEmits, CollapseContext, } from './components/collapse/types';
export type { VTabsProps, VTabItemProps, VTabsEmits } from './components/tabs/types';
export type { VAuthentificationProps, VAuthentificationData, VAuthentificationEmits, VLoginLogoProps, } from './components/login/types';
export { FileValidator, FileParser } from './components/upload/types';
export type { UploadFile, VUploadProps, VUploadEmits, UploadError, ParseResult, SheetParseResult, } from './components/upload/types';
export type { VSliderProps, VSliderEmits, VSingleMarkRangeProps, VSingleMarkRangeEmits, } from './components/slider/types';
export type { VChartType, VChartProps } from './components/charts/types';
export { DEFAULT_COLUMN_CONFIG } from './components/table/types';
export { DropdownContextKey } from './components/dropdown/types';
export { VtSelectContextKey } from './components/select/types';
export { FORMAT_TOKENS, DEFAULT_FORMATS, isValidDate, validateDateValue } from './components/datepicker/types';
export { DEFAULT_TIME_FORMATS, isValidTimeString, validateTimeValue, formatTime, parseTimeString, generateTimeOptions, } from './components/timepicker/types';
export { VModalPlugin, modalManager } from './components/modal/plugin';
export { VMessagePlugin, VMessage, messageManager } from './components/message/message-plugin';
export declare function setLocale(locale: LANGUAGES): void;
export { LANGUAGES };
export interface VUIPluginOptions {
    prefix?: string;
    modal?: boolean;
    message?: boolean;
    locale?: LANGUAGES;
}
declare const VUIPlugin: {
    install(app: App, options?: VUIPluginOptions): void;
};
export default VUIPlugin;
export declare const install: (app: App, options?: VUIPluginOptions) => void;
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
//# sourceMappingURL=entry.d.ts.map