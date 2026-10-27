import type { GroupIconName, IconGroup } from '../../icon-groups';
import { iconGroups } from '../../icon-groups';
import type { LegacyIconName } from './legacyIconMap';

export type IconName = GroupIconName | LegacyIconName;

export { iconGroups };
export type { GroupIconName, IconGroup, LegacyIconName };
