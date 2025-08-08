export interface VCheckboxProps {
  modelValue?: boolean;
  checked?: boolean;
  label?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string | number;
  indeterminate?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  required?: boolean;
  isDouble?: boolean;
}

export interface VCheckboxEmits {
  'update:modelValue': [value: boolean];
  change: [value: boolean, event: Event];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}

export interface VCheckboxSlots {
  default?: () => any;
  label?: () => any;
}
