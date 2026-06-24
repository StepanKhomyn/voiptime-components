import { type Ref } from 'vue';

export function useEditorCommands(editorRef: Ref<HTMLDivElement | null>, onSync: (html?: string) => void) {
  function exec(command: string, value?: string): void {
    if (!editorRef.value) return;
    editorRef.value.focus();
    document.execCommand(command, false, value ?? '');
    onSync();
  }

  function isActive(command: string): boolean {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }

  function applyBlock(tag: string): void {
    if (!editorRef.value) return;
    editorRef.value.focus();
    document.execCommand('formatBlock', false, tag);
    onSync();
  }

  function applyFont(fontName: string): void {
    if (!editorRef.value) return;
    editorRef.value.focus();
    document.execCommand('fontName', false, fontName);
    onSync();
  }

  function applyForeColor(color: string): void {
    if (!editorRef.value) return;
    editorRef.value.focus();
    document.execCommand('foreColor', false, color);
    onSync();
  }

  function applyBackColor(color: string): void {
    if (!editorRef.value) return;
    editorRef.value.focus();
    document.execCommand('hiliteColor', false, color);
    onSync();
  }

  function handleIndent(type: 'indent' | 'outdent'): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    let element = selection.anchorNode as HTMLElement;
    if (element.nodeType === Node.TEXT_NODE) {
      element = element.parentElement!;
    }

    const closestBlock = element.closest('.vt-editor__content > *') as HTMLElement;
    if (!closestBlock) return;

    const currentMargin = parseInt(closestBlock.style.marginLeft || '0', 10);
    const step = 20;
    const newMargin = type === 'indent' ? currentMargin + step : Math.max(0, currentMargin - step);
    closestBlock.style.marginLeft = newMargin ? `${newMargin}px` : '';
    onSync();
  }

  return { exec, isActive, applyBlock, applyFont, applyForeColor, applyBackColor, handleIndent };
}
