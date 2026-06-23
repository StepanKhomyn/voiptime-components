export type VtEditorToolbarGroup =
  | 'history'
  | 'format'
  | 'script'
  | 'heading'
  | 'fontName' // Нове
  | 'foreColor' // Нове
  | 'align'
  | 'list'
  | 'indent'
  | 'link'
  | 'image'
  | 'blockquote'
  | 'clear'
  | 'html';

// ─── Link dialog state ───────────────────────────────────────────────────────
export interface VtEditorLinkState {
  visible: boolean;
  url: string;
  text: string;
  openInNewTab: boolean;
}

// ─── Image dialog state ──────────────────────────────────────────────────────
export interface VtEditorImageState {
  visible: boolean;
  url: string;
  alt: string;
}

// ─── Validation ──────────────────────────────────────────────────────────────
export interface VtEditorValidationResult {
  isValid: boolean;
  errors: string[];
}

// ─── Props ───────────────────────────────────────────────────────────────────
export interface VtEditorProps {
  modelValue?: string | null | undefined;
  placeholder?: string;
  toolbar?: VtEditorToolbarGroup[];
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
}

// ─── Emits ───────────────────────────────────────────────────────────────────
export interface VtEditorEmits {
  'update:modelValue': [value: string];
  input: [html: string];
  change: [html: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  validation: [result: VtEditorValidationResult];
}

// ─── Exposed methods ─────────────────────────────────────────────────────────
export interface VtEditorMethods {
  focus(): void;

  blur(): void;

  clear(): void;

  getHTML(): string;

  getText(): string;

  setHTML(html: string): void;

  insertHTML(html: string): void;

  validate(): boolean;

  clearValidation(): void;

  getValidationState(): VtEditorValidationResult;

  getEditorElement(): HTMLElement | null;
}

// ─── Internal command map ─────────────────────────────────────────────────────
export type VtEditorCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'subscript'
  | 'superscript'
  | 'undo'
  | 'redo'
  | 'insertOrderedList'
  | 'insertUnorderedList'
  | 'justifyLeft'
  | 'justifyCenter'
  | 'justifyRight'
  | 'justifyFull'
  | 'removeFormat'
  | 'insertHTML'
  | 'fontName'
  | 'foreColor';
