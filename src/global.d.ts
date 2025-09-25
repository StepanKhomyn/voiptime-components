// src/global.d.ts - у лібці voiptime-components
import type { VModalInstance } from './components/modal/types';
import type { VMessageMethods } from './components/message/types';
import type { tooltipDirective } from './directives/tooltip/tooltip';
import type { loaderDirective } from './directives/loader/loader';

// Імпортуємо типи компонентів
import type VButton from './components/button/VButton.vue';
import type VIcon from './components/icon/VIcon.vue';
import type VLoader from './components/loader/VLoader.vue';
import type VModal from './components/modal/VModal.vue';
import type VPagination from './components/pagination/VPagination.vue';
import type VCheckbox from './components/checkbox/VCheckbox.vue';
import type VRadiobox from './components/radiobox/VRadiobox.vue';
import type VTable from './components/table/VTable.vue';
import type VTableColumn from './components/table/VTableColumn.vue';
import type VDropdown from './components/dropdown/VDropdown.vue';
import type VDropdownItem from './components/dropdown/VDropdownItem.vue';
import type VInput from './components/input/VInput.vue';
import type VSelect from './components/select/VSelect.vue';
import type VOption from './components/select/VOption.vue';
import type VDatePicker from './components/datepicker/VDatePicker.vue';
import type VTimePicker from './components/timepicker/VTimePicker.vue';
import type VCollapse from './components/collapse/VCollapse.vue';
import type VCollapseItem from './components/collapse/VCollapseItem.vue';
import type VTabs from './components/tabs/VTabs.vue';
import type VTabItem from './components/tabs/VTabItem.vue';

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    VButton: typeof VButton;
    VIcon: typeof VIcon;
    VLoader: typeof VLoader;
    VModal: typeof VModal;
    VPagination: typeof VPagination;
    VCheckbox: typeof VCheckbox;
    VRadiobox: typeof VRadiobox;
    VTable: typeof VTable;
    VTableColumn: typeof VTableColumn;
    VDropdown: typeof VDropdown;
    VDropdownItem: typeof VDropdownItem;
    VInput: typeof VInput;
    VSelect: typeof VSelect;
    VOption: typeof VOption;
    VDatePicker: typeof VDatePicker;
    VTimePicker: typeof VTimePicker;
    VCollapse: typeof VCollapse;
    VCollapseItem: typeof VCollapseItem;
    VTabs: typeof VTabs;
    VTabItem: typeof VTabItem;
  }

  interface ComponentCustomDirectives {
    vTooltip: typeof tooltipDirective;
    vLoader: typeof loaderDirective;
  }

  interface ComponentCustomProperties {
    $modal: VModalInstance;
    $message: VMessageMethods;
    $messageStack: {
      closeAll: () => void;
      getCount: () => number;
      closeById: (id: number) => void;
    };
  }
}
