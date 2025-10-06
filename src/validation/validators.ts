import type { ValidatorFn } from './types';
import { withName } from './helpers';

// Тут додаємо стандартні валідатори по типу required, minLength

export const required: ValidatorFn = (v) => {
  if (v === null || v === undefined) return 'Поле є обовʼязковим';
  if (Array.isArray(v)) return v.length > 0 || 'Поле є обовʼязковим';
  return v.toString().trim() !== '' || 'Поле є обовʼязковим';
};
withName('required', required);

export const minLength = (min: number): ValidatorFn =>
  Object.assign(
    (v: any) => (v == null || v === '' ? true : (v.length >= min) || `Мінімальна довжина ${min}`),
    { $params: { min }, $validatorName: 'minLength' }
  );

export const maxLength = (max: number): ValidatorFn =>
  Object.assign(
    (v: any) => (v == null || v === '' ? true : (v.length <= max) || `Максимальна довжина ${max}`),
    { $params: { max }, $validatorName: 'maxLength' }
  );

export const email: ValidatorFn = (v: any) =>
  (v == null || v === '' ? true : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || 'Невірний email';
withName('email', email);

export const sameAs = (compare: () => any, msg?: string): ValidatorFn =>
  Object.assign(
    (v: any) => v === compare() || msg || 'Значення не співпадає',
    { $params: { eq: compare }, $validatorName: 'sameAs' }
  );

export const numeric: ValidatorFn = (v: any) =>
  (v == null || v === '' ? true : !isNaN(Number(v))) || 'Повинно бути числом';
withName('numeric', numeric);

// Example async validator factory
export const uniqueAsync = (checkFn: (val: any) => Promise<boolean>, message = 'Значення вже зайнято'): ValidatorFn => {
  const fn: ValidatorFn = async (v) => {
    if (v == null || v === '') return true;
    const ok = await checkFn(v);
    return ok || message;
  };
  return Object.assign(fn, { $async: true, $validatorName: 'uniqueAsync' });
};
