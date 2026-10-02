import { icons as legacyIcons } from '../../icons';
import type { IconName as LegacyIconName } from '../../icons';
import { groupIcons, iconGroups } from '../../icon-groups';
import type { GroupIconName, IconGroup } from '../../icon-groups';

/**
 * Реєстр іконок для VIcon:
 * - нові згруповані іконки з src/icon-groups (left_menu_crm, phone_hangup, ...)
 * - старі іконки з src/icons (arrowDown, filterSave, ...) - deprecated, залишені для сумісності
 */
export const allIcons = { ...legacyIcons, ...groupIcons };

export type IconName = GroupIconName | LegacyIconName;

export { iconGroups };
export type { GroupIconName, IconGroup, LegacyIconName };
