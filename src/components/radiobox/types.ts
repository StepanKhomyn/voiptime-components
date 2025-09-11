export interface VRadioboxProps {
  modelValue?: any;
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
  id?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  required?: boolean;
}

export interface VRadioboxEmits {
  'update:modelValue': [value: any];
  change: [value: any, event: Event];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}
