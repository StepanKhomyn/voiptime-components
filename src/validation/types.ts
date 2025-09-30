import type { ComputedRef } from 'vue';

export type ValidatorResult = boolean | string | Promise<boolean | string>;
export type ValidatorFn = (value: any, vm?: any, sibling?: any) => ValidatorResult;

export interface WrappedValidator extends ValidatorFn {
  $validatorName?: string;
  $params?: Record<string, any>;
  $message?: string | ((params?: any) => string);
  $async?: boolean;
}

export type RulesObject = {
  [key: string]:
    | ValidatorFn[]
    | ValidatorFn
    | RulesObject
    | (() => ValidatorFn[] | RulesObject);
};

export interface FieldValidation {
  $model: any;
  $dirty: boolean;
  $touched: boolean;
  $error: boolean; // $dirty && $invalid
  $invalid: boolean;
  $errors: Array<{ $message: string; $validator: string; $params?: any; $pending?: boolean }>;
  $pending: boolean;
  $params?: Record<string, any>;
  $touch(): void;
  $reset(): void;
  $validate(): Promise<boolean>;
}

export type ValidationNode = FieldValidation | ValidationGroup;

export type ValidationGroup = {
  [key: string]: ValidationNode;
} & {
  $validate(): Promise<boolean>;
  $touch(): void;
  $reset(): void;
  $anyDirty: ComputedRef<boolean>;
  $anyInvalid: ComputedRef<boolean>;
  $anyError: ComputedRef<boolean>;
  $pending: ComputedRef<boolean>;
  $silentErrors?: boolean;
  $externalResults?: Array<any>;
  $addExternalResults?(res: any): void;
  $clearExternalResults?(): void;
};

