// src/global-components.d.ts

declare module 'vue' {
  export interface GlobalComponents {
    VButton: (typeof import('./components/button/VButton.vue'))['default'];
    VIcon: (typeof import('./components/icon/VIcon.vue'))['default'];
    VLoader: (typeof import('./components/loader/VLoader.vue'))['default'];
    VModal: (typeof import('./components/modal/VModal.vue'))['default'];
    VPagination: (typeof import('./components/pagination/VPagination.vue'))['default'];
    VCheckbox: (typeof import('./components/checkbox/VCheckbox.vue'))['default'];
    VRadiobox: (typeof import('./components/radiobox/VRadiobox.vue'))['default'];
    VTable: (typeof import('./components/table/VTable.vue'))['default'];
    VTableColumn: (typeof import('./components/table/VTableColumn.vue'))['default'];
    VDropdown: (typeof import('./components/dropdown/VDropdown.vue'))['default'];
    VDropdownItem: (typeof import('./components/dropdown/VDropdownItem.vue'))['default'];
    VInput: (typeof import('./components/input/VInput.vue'))['default'];
    VSelect: (typeof import('./components/select/VSelect.vue'))['default'];
    VOption: (typeof import('./components/select/VOption.vue'))['default'];
    VDatePicker: (typeof import('./components/datepicker/VDatePicker.vue'))['default'];
    VTimePicker: (typeof import('./components/timepicker/VTimePicker.vue'))['default'];
    VCollapse: (typeof import('./components/collapse/VCollapse.vue'))['default'];
    VCollapseItem: (typeof import('./components/collapse/VCollapseItem.vue'))['default'];
    VTabs: (typeof import('./components/tabs/VTabs.vue'))['default'];
    VTabItem: (typeof import('./components/tabs/VTabItem.vue'))['default'];
  }
}
