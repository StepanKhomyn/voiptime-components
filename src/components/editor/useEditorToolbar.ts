import { computed, ref } from 'vue';
import type { VtEditorToolbarGroup } from './types';
import { FONT_GROUPS, HEADING_GROUPS, TOOLBAR_ICONS } from './constants';
import { useI18n } from '@/locales/useI18n';
import { LOCALE_KEYS } from '@/locales/types';
import type { IconName } from '@/icons';

export interface ToolbarItem {
  type: 'button' | 'select' | 'separator';
  id?: string;
  tooltip?: string;
  iconName?: IconName;
  action?: () => void;
  activeCheck?: () => boolean;
}

export function useEditorToolbar(
  groups: () => VtEditorToolbarGroup[],
  commands: {
    exec: (command: string, value?: string) => void;
    isActive: (command: string) => boolean;
    applyBlock: (tag: string) => void;
    applyFont: (fontName: string) => void;
    handleIndent: (type: 'indent' | 'outdent') => void;
    openLinkDialog: () => void;
    openImageDialog: () => void;
    toggleHtmlMode: () => void;
    isHtmlMode: () => boolean;
  },
) {
  const { t } = useI18n();
  const selectionTick = ref(0);

  function onSelectionChange(): void {
    selectionTick.value++;
  }

  function getItemActive(item: ToolbarItem): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    selectionTick.value;
    return item.activeCheck?.() ?? false;
  }

  function buildItems(toolbarGroups: VtEditorToolbarGroup[]): (ToolbarItem | null)[] {
    const items: (ToolbarItem | null)[] = [];

    toolbarGroups.forEach((group, idx) => {
      if (idx > 0) items.push({ type: 'separator' });

      switch (group) {
        case 'history':
          items.push(
            {
              type: 'button',
              id: 'undo',
              tooltip: t(LOCALE_KEYS.EDITOR_UNDO),
              iconName: TOOLBAR_ICONS.undo,
              action: () => commands.exec('undo'),
            },
            {
              type: 'button',
              id: 'redo',
              tooltip: t(LOCALE_KEYS.EDITOR_REDO),
              iconName: TOOLBAR_ICONS.redo,
              action: () => commands.exec('redo'),
            },
          );
          break;

        case 'format':
          items.push(
            {
              type: 'button',
              id: 'bold',
              tooltip: t(LOCALE_KEYS.EDITOR_BOLD),
              iconName: TOOLBAR_ICONS.bold,
              action: () => commands.exec('bold'),
              activeCheck: () => commands.isActive('bold'),
            },
            {
              type: 'button',
              id: 'italic',
              tooltip: t(LOCALE_KEYS.EDITOR_ITALIC),
              iconName: TOOLBAR_ICONS.italic,
              action: () => commands.exec('italic'),
              activeCheck: () => commands.isActive('italic'),
            },
            {
              type: 'button',
              id: 'underline',
              tooltip: t(LOCALE_KEYS.EDITOR_UNDERLINE),
              iconName: TOOLBAR_ICONS.underline,
              action: () => commands.exec('underline'),
              activeCheck: () => commands.isActive('underline'),
            },
            {
              type: 'button',
              id: 'strikethrough',
              tooltip: t(LOCALE_KEYS.EDITOR_STRIKETHROUGH),
              iconName: TOOLBAR_ICONS.strikethrough,
              action: () => commands.exec('strikethrough'),
              activeCheck: () => commands.isActive('strikeThrough'),
            },
          );
          break;

        case 'script':
          items.push(
            {
              type: 'button',
              id: 'subscript',
              tooltip: t(LOCALE_KEYS.EDITOR_SUBSCRIPT),
              iconName: TOOLBAR_ICONS.subscript,
              action: () => commands.exec('subscript'),
              activeCheck: () => commands.isActive('subscript'),
            },
            {
              type: 'button',
              id: 'superscript',
              tooltip: t(LOCALE_KEYS.EDITOR_SUPERSCRIPT),
              iconName: TOOLBAR_ICONS.superscript,
              action: () => commands.exec('superscript'),
              activeCheck: () => commands.isActive('superscript'),
            },
          );
          break;

        case 'heading':
          items.push({ type: 'select', id: 'heading' });
          break;
        case 'fontName':
          items.push({ type: 'select', id: 'fontName' });
          break;
        case 'foreColor':
          items.push({ type: 'select', id: 'foreColor' });
          break;

        case 'align':
          items.push(
            {
              type: 'button',
              id: 'alignLeft',
              tooltip: t(LOCALE_KEYS.EDITOR_ALIGN_LEFT),
              iconName: TOOLBAR_ICONS.alignLeft,
              action: () => commands.exec('justifyLeft'),
              activeCheck: () => commands.isActive('justifyLeft'),
            },
            {
              type: 'button',
              id: 'alignCenter',
              tooltip: t(LOCALE_KEYS.EDITOR_ALIGN_CENTER),
              iconName: TOOLBAR_ICONS.alignCenter,
              action: () => commands.exec('justifyCenter'),
              activeCheck: () => commands.isActive('justifyCenter'),
            },
            {
              type: 'button',
              id: 'alignRight',
              tooltip: t(LOCALE_KEYS.EDITOR_ALIGN_RIGHT),
              iconName: TOOLBAR_ICONS.alignRight,
              action: () => commands.exec('justifyRight'),
              activeCheck: () => commands.isActive('justifyRight'),
            },
            {
              type: 'button',
              id: 'alignJustify',
              tooltip: t(LOCALE_KEYS.EDITOR_ALIGN_JUSTIFY),
              iconName: TOOLBAR_ICONS.alignJustify,
              action: () => commands.exec('justifyFull'),
              activeCheck: () => commands.isActive('justifyFull'),
            },
          );
          break;

        case 'list':
          items.push(
            {
              type: 'button',
              id: 'orderedList',
              tooltip: t(LOCALE_KEYS.EDITOR_ORDERED_LIST),
              iconName: TOOLBAR_ICONS.orderedList,
              action: () => commands.exec('insertOrderedList'),
              activeCheck: () => commands.isActive('insertOrderedList'),
            },
            {
              type: 'button',
              id: 'unorderedList',
              tooltip: t(LOCALE_KEYS.EDITOR_UNORDERED_LIST),
              iconName: TOOLBAR_ICONS.unorderedList,
              action: () => commands.exec('insertUnorderedList'),
              activeCheck: () => commands.isActive('insertUnorderedList'),
            },
          );
          break;

        case 'indent':
          items.push(
            {
              type: 'button',
              id: 'indent',
              tooltip: t(LOCALE_KEYS.EDITOR_INDENT),
              iconName: TOOLBAR_ICONS.indent,
              action: () => commands.handleIndent('indent'),
            },
            {
              type: 'button',
              id: 'outdent',
              tooltip: t(LOCALE_KEYS.EDITOR_OUTDENT),
              iconName: TOOLBAR_ICONS.outdent,
              action: () => commands.handleIndent('outdent'),
            },
          );
          break;

        case 'link':
          items.push({
            type: 'button',
            id: 'link',
            tooltip: t(LOCALE_KEYS.EDITOR_INSERT_LINK),
            iconName: TOOLBAR_ICONS.link,
            action: commands.openLinkDialog,
          });
          break;
        case 'image':
          items.push({
            type: 'button',
            id: 'image',
            tooltip: t(LOCALE_KEYS.EDITOR_INSERT_IMAGE),
            iconName: TOOLBAR_ICONS.image,
            action: commands.openImageDialog,
          });
          break;
        case 'blockquote':
          items.push({
            type: 'button',
            id: 'blockquote',
            tooltip: t(LOCALE_KEYS.EDITOR_BLOCKQUOTE),
            iconName: TOOLBAR_ICONS.blockquote,
            action: () => commands.applyBlock('blockquote'),
          });
          break;
        case 'clear':
          items.push({
            type: 'button',
            id: 'clear',
            tooltip: t(LOCALE_KEYS.EDITOR_CLEAR_FORMAT),
            iconName: TOOLBAR_ICONS.clearFormat,
            action: () => commands.exec('removeFormat'),
          });
          break;
        case 'html':
          items.push({
            type: 'button',
            id: 'html',
            tooltip: t(LOCALE_KEYS.EDITOR_HTML_SOURCE),
            iconName: TOOLBAR_ICONS.html,
            action: commands.toggleHtmlMode,
            activeCheck: commands.isHtmlMode,
          });
          break;
      }
    });

    return items;
  }

  const toolbarItems = computed(() => buildItems(groups()));

  return { toolbarItems, selectionTick, onSelectionChange, getItemActive, HEADING_GROUPS, FONT_GROUPS };
}
