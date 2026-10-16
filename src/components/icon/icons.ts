import type { GroupIconName, IconGroup } from '../../icon-groups';
import { groupIcons, iconGroups } from '../../icon-groups';

/**
 * Реєстр іконок для VIcon: згруповані іконки з src/icon-groups (left_menu_crm, phone_hangup, ...)
 */
export const allIcons = { ...groupIcons };

export type IconName = GroupIconName;

export { iconGroups };
export type { GroupIconName, IconGroup };
