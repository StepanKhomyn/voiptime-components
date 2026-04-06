import type { ValidatorFn, WrappedValidator } from './types';
export declare function withParams(params: Record<string, any>, validator: ValidatorFn): WrappedValidator;
export declare function withMessage(message: string | ((params?: any) => string), validator: ValidatorFn): WrappedValidator;
export declare function withAsync(validator: ValidatorFn): WrappedValidator;
export declare function withName(name: string, validator: ValidatorFn): WrappedValidator;
export declare function mk<V extends ValidatorFn>(opts: {
    name?: string;
    params?: Record<string, any>;
    message?: string | ((params?: any) => string);
    async?: boolean;
}, validator: V): WrappedValidator;
//# sourceMappingURL=helpers.d.ts.map