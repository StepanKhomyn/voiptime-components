import type { ValidatorFn } from './types';
export declare const required: ValidatorFn;
export declare const minLength: (min: number) => ValidatorFn;
export declare const maxLength: (max: number) => ValidatorFn;
export declare const email: ValidatorFn;
export declare const url: ValidatorFn;
export declare const numeric: ValidatorFn;
export declare const minNumber: (min: number) => ValidatorFn;
export declare const maxNumber: (max: number) => ValidatorFn;
export declare const sameAs: (compare: () => any, msg?: string) => ValidatorFn;
export declare const phoneNumber: ValidatorFn;
export declare const containUpperCaseLetter: ValidatorFn;
export declare const noSpaces: ValidatorFn;
export declare const pattern: (regex: RegExp, message?: string) => ValidatorFn;
export declare const uniqueAsync: (checkFn: (val: any) => Promise<boolean>, message?: string) => ValidatorFn;
//# sourceMappingURL=validators.d.ts.map