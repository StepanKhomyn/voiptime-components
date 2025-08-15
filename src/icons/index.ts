// Цей файл згенеровано автоматично. Не редагуйте вручну!
// Для оновлення запустіть: node scripts/generate-icons.js

import CircleCheckedIcon from './actions/CircleCheckedIcon.vue';
import CircleCloseIcon from './actions/CircleCloseIcon.vue';
import CloseIcon from './actions/CloseIcon.vue';
import DeleteIcon from './actions/DeleteIcon.vue';
import EditIcon from './actions/EditIcon.vue';
import GoToIcon from './actions/GoToIcon.vue';
import ListBulletHorizontalIcon from './actions/ListBulletHorizontalIcon.vue';
import ListBulletIcon from './actions/ListBulletIcon.vue';
import PlusRoundIcon from './actions/PlusRoundIcon.vue';
import PromptIcon from './actions/PromptIcon.vue';
import PrompterIcon from './actions/PrompterIcon.vue';
import SaveIcon from './actions/SaveIcon.vue';
import StatusChange2Icon from './actions/StatusChange2Icon.vue';
import StatusChangeIcon from './actions/StatusChangeIcon.vue';
import UsersGroupIcon from './actions/UsersGroupIcon.vue';
import ArrowDownIcon from './arrow/ArrowDownIcon.vue';
import ArrowLeftIcon from './arrow/ArrowLeftIcon.vue';
import ArrowReloadIcon from './arrow/ArrowReloadIcon.vue';
import ArrowRightIcon from './arrow/ArrowRightIcon.vue';
import ArrowTopIcon from './arrow/ArrowTopIcon.vue';
import FilterAddIcon from './filter/FilterAddIcon.vue';
import FilterAdvancedIcon from './filter/FilterAdvancedIcon.vue';
import FilterDateCheckIcon from './filter/FilterDateCheckIcon.vue';
import FilterEditIcon from './filter/FilterEditIcon.vue';
import FilterExchangeIcon from './filter/FilterExchangeIcon.vue';
import FilterMultiselectIcon from './filter/FilterMultiselectIcon.vue';
import FilterNewIcon from './filter/FilterNewIcon.vue';
import FilterResetIcon from './filter/FilterResetIcon.vue';
import FilterSaveIcon from './filter/FilterSaveIcon.vue';
import AlertCircleIcon from './input/AlertCircleIcon.vue';
import AlertTriangleIcon from './input/AlertTriangleIcon.vue';
import CheckCircleIcon from './input/CheckCircleIcon.vue';
import EmailIcon from './input/EmailIcon.vue';
import EyeClosedIcon from './input/EyeClosedIcon.vue';
import EyeOpenedIcon from './input/EyeOpenedIcon.vue';
import UrlIcon from './input/UrlIcon.vue';
import ColumnInsertIcon from './table/ColumnInsertIcon.vue';
import ColumnsMoveIcon from './table/ColumnsMoveIcon.vue';
import EmptyIcon from './table/EmptyIcon.vue';
import ExcelIcon from './table/ExcelIcon.vue';
import FreezeIcon from './table/FreezeIcon.vue';
import ListAddIcon from './table/ListAddIcon.vue';
import TableSettingsIcon from './table/TableSettingsIcon.vue';
import TwoColumnsIcon from './table/TwoColumnsIcon.vue';
import TwoRowsIcon from './table/TwoRowsIcon.vue';
import UnfreezeIcon from './table/UnfreezeIcon.vue';

export const icons = {
  // actions icons
  circleChecked: CircleCheckedIcon,
  circleClose: CircleCloseIcon,
  close: CloseIcon,
  delete: DeleteIcon,
  edit: EditIcon,
  goTo: GoToIcon,
  listBulletHorizontal: ListBulletHorizontalIcon,
  listBullet: ListBulletIcon,
  plusRound: PlusRoundIcon,
  prompt: PromptIcon,
  prompter: PrompterIcon,
  save: SaveIcon,
  statusChange2: StatusChange2Icon,
  statusChange: StatusChangeIcon,
  usersGroup: UsersGroupIcon,

  // arrow icons
  arrowDown: ArrowDownIcon,
  arrowLeft: ArrowLeftIcon,
  arrowReload: ArrowReloadIcon,
  arrowRight: ArrowRightIcon,
  arrowTop: ArrowTopIcon,

  // filter icons
  filterAdd: FilterAddIcon,
  filterAdvanced: FilterAdvancedIcon,
  filterDateCheck: FilterDateCheckIcon,
  filterEdit: FilterEditIcon,
  filterExchange: FilterExchangeIcon,
  filterMultiselect: FilterMultiselectIcon,
  filterNew: FilterNewIcon,
  filterReset: FilterResetIcon,
  filterSave: FilterSaveIcon,

  // input icons
  alertCircle: AlertCircleIcon,
  alertTriangle: AlertTriangleIcon,
  checkCircle: CheckCircleIcon,
  email: EmailIcon,
  eyeClosed: EyeClosedIcon,
  eyeOpened: EyeOpenedIcon,
  url: UrlIcon,

  // table icons
  columnInsert: ColumnInsertIcon,
  columnsMove: ColumnsMoveIcon,
  empty: EmptyIcon,
  excel: ExcelIcon,
  freeze: FreezeIcon,
  listAdd: ListAddIcon,
  tableSettings: TableSettingsIcon,
  twoColumns: TwoColumnsIcon,
  twoRows: TwoRowsIcon,
  unfreeze: UnfreezeIcon,
} as const;

export type IconName = keyof typeof icons;
