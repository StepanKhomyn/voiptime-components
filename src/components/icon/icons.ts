import type { GroupIconName, IconGroup } from '../../icon-groups';
import { groupIcons, iconGroups } from '../../icon-groups';

/**
 * Реєстр іконок для VIcon:
 * - нові згруповані іконки з src/icon-groups (left_menu_crm, phone_hangup, ...)
 * - старі іконки з src/icons (arrowDown, filterSave, ...) - deprecated, залишені для сумісності
 */
export const allIcons = { ...groupIcons };

export type IconName = GroupIconName;

export { iconGroups };
export type { GroupIconName, IconGroup };
