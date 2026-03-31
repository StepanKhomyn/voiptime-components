import type { RulesObject, ValidationGroup } from './types';
type AnyObject = Record<string, any>;
/**
 * Build validation tree recursively
 */
export declare function useValidate(rulesOrFactory: RulesObject | (() => RulesObject), state: AnyObject | any, globalOpts?: {
    silentErrors?: boolean;
}): ValidationGroup;
export {};
//# sourceMappingURL=useValidate.d.ts.map