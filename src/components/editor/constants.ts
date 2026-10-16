import type { IconName } from '@/components/icon/icons';

export const TOOLBAR_ICONS: Record<string, IconName> = {
  undo: 'arrows_undo',
  redo: 'arrows_redo',
  bold: 'text_editor_bold',
  italic: 'text_editor_italic',
  underline: 'text_editor_underline',
  strikethrough: 'text_editor_strikethrough',
  subscript: 'text_editor_subscript',
  superscript: 'text_editor_superscript',
  orderedList: 'text_editor_ordered_list',
  unorderedList: 'text_editor_unordered_list',
  indent: 'text_editor_indent',
  outdent: 'text_editor_outdent',
  alignLeft: 'text_editor_align_left',
  alignCenter: 'text_editor_align_center',
  alignRight: 'text_editor_align_right',
  alignJustify: 'text_editor_align_justify',
  link: 'actions_link',
  image: 'message_image',
  blockquote: 'text_editor_blockquote',
  clearFormat: 'text_editor_clear_format',
  html: 'misc_html',
  chevronDown: 'arrows_redo',
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
