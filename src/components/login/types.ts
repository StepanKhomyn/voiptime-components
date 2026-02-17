export interface VAuthentificationData {
  username: string;
  password: string;
  remember: boolean;
}

export interface VAuthentificationProps {
  loading?: boolean;
  privacyPolicyUrl?: string;
  forgotPasswordUrl?: string;
}

export interface VAuthentificationEmits {
  (e: 'auth', payload: VAuthentificationData): void;
}

export interface VLoginLogoProps {
  name: string;
  x?: number;
  y?: number;
}