import ArrowDownIcon from './arrow/ArrowDownIcon.vue';
import ArrowTopIcon from './arrow/ArrowTopIcon.vue';
import ArrowReloadIcon from './arrow/ArrowReloadIcon.vue';
import ArrowRightIcon from './arrow/ArrowRightIcon.vue';
import ArrowLeftIcon from './arrow/ArrowLeftIcon.vue';
import ColumnInsertIcon from './table/ColumnInsertIcon.vue';
import FreezeIcon from './table/FreezeIcon.vue';
import UnfreezeIcon from './table/UnfreezeIcon.vue';
import EmptyIcon from './table/EmptyIcon.vue';
import ColumnsMoveIcon from './table/ColumnsMoveIcon.vue';
import ListBulletIcon from './actions/ListBulletIcon.vue';
import ListBulletHorizontalIcon from './actions/ListBulletHorizontalIcon.vue';
import CloseIcon from './actions/CloseIcon.vue';
import FilterSaveIcon from './filter/FilterSaveIcon.vue';
import FilterResetIcon from './filter/FilterResetIcon.vue';
import FilterNewIcon from './filter/FilterNewIcon.vue';
import FilterMultiselectIcon from './filter/FilterMultiselectIcon.vue';
import FilterExchangeIcon from './filter/FilterExchangeIcon.vue';
import FilterEditIcon from './filter/FilterEditIcon.vue';
import FilterDateCheckIcon from './filter/FilterDateCheckIcon.vue';
import FilterAdvancedIcon from './filter/FilterAdvancedIcon.vue';
import FilterAddIcon from './filter/FilterAddIcon.vue';

export const icons = {
  // arrow icons
  arrowDown: ArrowDownIcon,
  arrowTop: ArrowTopIcon,
  arrowRight: ArrowRightIcon,
  arrowLeft: ArrowLeftIcon,
  arrowReload: ArrowReloadIcon,

  // table icons
  columnInsert: ColumnInsertIcon,
  freeze: FreezeIcon,
  unfreeze: UnfreezeIcon,
  columnsMove: ColumnsMoveIcon,
  empty: EmptyIcon,

  // actions icons
  listBullet: ListBulletIcon,
  listBulletHorizontal: ListBulletHorizontalIcon,
  close: CloseIcon,

  // filter icons
  filterSave: FilterSaveIcon,
  filterReset: FilterResetIcon,
  filterNew: FilterNewIcon,
  filterMultiselect: FilterMultiselectIcon,
  filterExchange: FilterExchangeIcon,
  filterEdit: FilterEditIcon,
  filterDateCheck: FilterDateCheckIcon,
  filterAdvanced: FilterAdvancedIcon,
  filterAdd: FilterAddIcon,
} as const;

export type IconName = keyof typeof icons;
