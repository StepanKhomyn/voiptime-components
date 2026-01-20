import type { ValidatorFn } from './types';
import { withName } from './helpers';
import { useI18n } from '@/locales/useI18n';
import { LOCALE_KEYS } from '@/locales/types';

// Required validator
export const required: ValidatorFn = v => {
  const { t } = useI18n();

  if (v === null || v === undefined) return t(LOCALE_KEYS.VALIDATION_REQUIRED);
  if (Array.isArray(v)) return v.length > 0 || t(LOCALE_KEYS.VALIDATION_REQUIRED);
  return v.toString().trim() !== '' || t(LOCALE_KEYS.VALIDATION_REQUIRED);
};
withName('required', required);

// Min length validator
export const minLength = (min: number): ValidatorFn => {
  const fn = (v: any) => {
    const { t } = useI18n();
    return v == null || v === ''
      ? true
      : v.length >= min || t(LOCALE_KEYS.VALIDATION_MIN_LENGTH, { length: min.toString() });
  };

  return Object.assign(fn, { $params: { min }, $validatorName: 'minLength' });
};

// Max length validator
export const maxLength = (max: number): ValidatorFn => {
  const fn = (v: any) => {
    const { t } = useI18n();
    return v == null || v === ''
      ? true
      : v.length <= max || t(LOCALE_KEYS.VALIDATION_MAX_LENGTH, { length: max.toString() });
  };

  return Object.assign(fn, { $params: { max }, $validatorName: 'maxLength' });
};

// Email validator
export const email: ValidatorFn = (v: any) => {
  const { t } = useI18n();
  return (
    (v == null || v === '' ? true : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || t(LOCALE_KEYS.VALIDATION_INVALID_EMAIL)
  );
};
withName('email', email);

// URL validator
export const url: ValidatorFn = (v: any) => {
  const { t } = useI18n();
  if (v == null || v === '') return true;

  try {
    new URL(v);
    return true;
  } catch {
    return t(LOCALE_KEYS.VALIDATION_INVALID_URL);
  }
};
withName('url', url);

export const numeric: ValidatorFn = (v: any) => {
  const { t } = useI18n();
  return (v == null || v === '' ? true : !isNaN(Number(v))) || t(LOCALE_KEYS.VALIDATION_INVALID_NUMBER);
};
withName('numeric', numeric);

export const minNumber = (min: number): ValidatorFn => {
  const fn = (v: any) => {
    const { t } = useI18n();
    if (v == null || v === '') return true;
    const num = Number(v);
    return (!isNaN(num) && num >= min) || t(LOCALE_KEYS.VALIDATION_MIN_NUMBER, { number: min.toString() });
  };

  return Object.assign(fn, { $params: { min }, $validatorName: 'minNumber' });
};

export const maxNumber = (max: number): ValidatorFn => {
  const fn = (v: any) => {
    const { t } = useI18n();
    if (v == null || v === '') return true;
    const num = Number(v);
    return (!isNaN(num) && num <= max) || t(LOCALE_KEYS.VALIDATION_MAX_NUMBER, { number: max.toString() });
  };

  return Object.assign(fn, { $params: { max }, $validatorName: 'maxNumber' });
};

export const sameAs = (compare: () => any, msg?: string): ValidatorFn => {
  const fn = (v: any) => {
    const { t } = useI18n();
    return v === compare() || msg || t(LOCALE_KEYS.VALIDATION_SAME_AS);
  };

  return Object.assign(fn, { $params: { eq: compare }, $validatorName: 'sameAs' });
};

export const phoneNumber: ValidatorFn = (v: any) => {
  const { t } = useI18n();
  if (v == null || v === '') return true;

  const str = v.toString().trim();
  const valid = /^\+?\d+$/.test(str);

  return valid || t(LOCALE_KEYS.VALIDATION_INVALID_PHONE);
};
withName('phoneNumber', phoneNumber);

export const containUpperCaseLetter: ValidatorFn = (v: any) => {
  const { t } = useI18n();
  return v == null || v === '' ? true : /[A-Z]/.test(v) || t(LOCALE_KEYS.VALIDATION_CONTAIN_UPPERCASE);
};
withName('containUpperCaseLetter', containUpperCaseLetter);

export const noSpaces: ValidatorFn = (v: any) => {
  const { t } = useI18n();
  return v == null || v === '' ? true : !/\s/.test(v) || t(LOCALE_KEYS.VALIDATION_NO_SPACES);
};
withName('noSpaces', noSpaces);

export const pattern = (regex: RegExp, message?: string): ValidatorFn => {
  const fn = (v: any) => {
    const { t } = useI18n();
    if (v == null || v === '') return true;
    return regex.test(v) || message || t(LOCALE_KEYS.VALIDATION_INVALID_FORMAT);
  };

  return Object.assign(fn, { $params: { regex }, $validatorName: 'pattern' });
};

export const uniqueAsync = (checkFn: (val: any) => Promise<boolean>, message?: string): ValidatorFn => {
  const fn: ValidatorFn = async v => {
    const { t } = useI18n();
    if (v == null || v === '') return true;
    const ok = await checkFn(v);
    return ok || message || t(LOCALE_KEYS.VALIDATION_ALREADY_TAKEN);
  };

  return Object.assign(fn, { $async: true, $validatorName: 'uniqueAsync' });
};
