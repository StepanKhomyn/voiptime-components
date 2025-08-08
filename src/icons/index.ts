import ArrowDownIcon from './arrow/ArrowDownIcon.vue';
import ArrowTopIcon from './arrow/ArrowTopIcon.vue';
import ArrowReloadIcon from './arrow/ArrowReloadIcon.vue';
import ArrowRightIcon from './arrow/ArrowRightIcon.vue';
import ArrowLeftIcon from './arrow/ArrowLeftIcon.vue';
import ColumnInsertIcon from './table/ColumnInsertIcon.vue';
import FreezeIcon from './table/FreezeIcon.vue';
import UnfreezeIcon from './table/UnfreezeIcon.vue';
import ColumnsMoveIcon from './table/ColumnsMoveIcon.vue';
import ListBulletIcon from './actions/ListBulletIcon.vue';
import ListBulletHorizontalIcon from './actions/ListBulletHorizontalIcon.vue';
import CloseIcon from './actions/CloseIcon.vue';

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

  // actions icons
  listBullet: ListBulletIcon,
  listBulletHorizontal: ListBulletHorizontalIcon,
  close: CloseIcon,
} as const;

export type IconName = keyof typeof icons;
