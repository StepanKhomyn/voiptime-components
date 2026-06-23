export const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'b',
  'i',
  'u',
  'span',
  'a',
  'img',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'blockquote',
  'div',
]);

export const ALLOWED_ATTRS = new Set(['href', 'target', 'src', 'alt', 'style', 'class', 'rel']);

export const TOOLBAR_ICONS: Record<string, string> = {
  undo: 'undo',
  redo: 'redo',
  bold: 'textBold',
  italic: 'textItalic',
  underline: 'textUndeline',
  strikethrough: 'textStrikethrough',
  subscript: 'subscript',
  superscript: 'superscript',
  orderedList: 'orderedList',
  unorderedList: 'unorderedList',
  indent: 'indent',
  outdent: 'outdent',
  alignLeft: 'alignLeft',
  alignCenter: 'alignCenter',
  alignRight: 'alignRight',
  alignJustify: 'alignJustify',
  link: 'link',
  image: 'image',
  blockquote: 'blockquote',
  clearFormat: 'clearFormat',
  html: 'html',
  chevronDown: 'redo',
};

export const HEADING_GROUPS = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
];

export const FONT_GROUPS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
];
