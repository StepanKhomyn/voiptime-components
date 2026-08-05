import type { Ref, StyleValue } from 'vue';

export type MRef<T> = Ref<T | null>;
export type RefElement = Ref<HTMLElement | null>;

export interface Size {
  width: number;
  height: number;
}

/** Аліас на Vue StyleValue — сумісний з :style напряму */
export type SizeStyle = StyleValue;

export interface VAvatarUploadProps {
  /** поточне джерело зображення (base64 / url) */
  avatar?: string;
  /** ім'я поля файлу у формі */
  field?: string;
  /** формат зображення після кропу */
  format?: 'png' | 'jpeg' | 'webp';
  /** прийняті MIME-типи для input[type=file] */
  accept?: string;
  /** ширина зони кропу, px */
  width?: number;
  /** висота зони кропу, px */
  height?: number;
  /** початковий розмір рамки виділення, px */
  selectSize?: number;
  /** чи можна обертати зображення */
  rotate?: boolean;
  /** заблокувати ресайз/переміщення рамки виділення */
  disableSelect?: boolean;
  /** показувати попап як fixed overlay з фейдом */
  fixed?: boolean;
  /** показувати блок прев'ю (коло + квадрат) */
  showPreview?: boolean;
  /** розмір прев'ю, px */
  previewSize?: number;
  /** callback перед відкриттям кропера; false — скасовує вибір файлу */
  onBeforeUpload?: (file: File) => boolean | Promise<boolean>;
}

export type VAvatarUploadEmits = {
  uploadFile: [base64: string | null];
};