import type { ValidatorFn, WrappedValidator } from './types';

// Прикріпляємо до валідатора додаткові параметри ($params)
export function withParams(params: Record<string, any>, validator: ValidatorFn): WrappedValidator {
  const v = validator as WrappedValidator;
  v.$params = params;
  return v;
}

// Прикріпляємо певний message до валідатора, тут буде вертатись динамічний текст ($message)
export function withMessage(message: string | ((params?: any) => string), validator: ValidatorFn): WrappedValidator {
  const v = validator as WrappedValidator;
  v.$message = message;
  return v;
}

// Позначає валідатор як асинхронний і дозволяє робити запит на сервак ($async)
export function withAsync(validator: ValidatorFn): WrappedValidator {
  const v = validator as WrappedValidator;
  v.$async = true;
  return v;
}

// Він задає імя валідатору для дебагу ($validatorName)
export function withName(name: string, validator: ValidatorFn): WrappedValidator {
  const v = validator as WrappedValidator;
  v.$validatorName = name;
  return v;
}

// Універсальний хелпер, можна заюзати лише mk, якщо потрібно декілька хелперів
export function mk<V extends ValidatorFn>(opts: {
  name?: string;
  params?: Record<string, any>;
  message?: string | ((params?: any) => string);
  async?: boolean;
}, validator: V): WrappedValidator {
  let v = validator as WrappedValidator;
  if (opts.name) v.$validatorName = opts.name;
  if (opts.params) v.$params = opts.params;
  if (opts.message) v.$message = opts.message;
  if (opts.async) v.$async = true;
  return v;
}
