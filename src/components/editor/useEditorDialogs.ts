import { ref } from 'vue';
import type { VtEditorLinkState, VtEditorImageState } from './types';
import { useEditorSelection } from './useEditorSelection';

export function useEditorDialogs(execInsertHtml: (html: string) => void, onSync: () => void) {
  const { saveSelection, restoreSelection, clearSavedRange, getSavedRange } = useEditorSelection();

  // ─── Link ─────────────────────────────────────────────────────────────────

  const linkState = ref<VtEditorLinkState>({
    visible: false,
    url: '',
    text: '',
    openInNewTab: false,
  });

  function openLinkDialog(): void {
    saveSelection();
    const sel = window.getSelection();
    const text = sel?.toString() ?? '';
    const anchor = sel?.anchorNode?.parentElement?.closest('a');
    linkState.value = {
      visible: true,
      url: anchor?.getAttribute('href') ?? '',
      text,
      openInNewTab: anchor?.getAttribute('target') === '_blank',
    };
  }

  function confirmLink(): void {
    restoreSelection();
    const { url, text, openInNewTab } = linkState.value;
    if (!url) {
      cancelLink();
      return;
    }

    const a = document.createElement('a');
    a.href = url;
    a.textContent = text || url;
    if (openInNewTab) a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');

    const savedRange = getSavedRange();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && savedRange) {
      savedRange.deleteContents();
      savedRange.insertNode(a);
    } else {
      execInsertHtml(a.outerHTML);
    }
    cancelLink();
    onSync();
  }

  function cancelLink(): void {
    linkState.value = { visible: false, url: '', text: '', openInNewTab: false };
    clearSavedRange();
  }

  // ─── Image ────────────────────────────────────────────────────────────────

  const imageState = ref<VtEditorImageState>({
    visible: false,
    url: '',
    alt: '',
  });

  function openImageDialog(): void {
    saveSelection();
    imageState.value = { visible: true, url: '', alt: '' };
  }

  function confirmImage(): void {
    restoreSelection();
    const { url, alt } = imageState.value;
    if (!url) {
      cancelImage();
      return;
    }
    execInsertHtml(`<img src="${url}" alt="${alt}" style="max-width:100%;" />`);
    cancelImage();
  }

  function cancelImage(): void {
    imageState.value = { visible: false, url: '', alt: '' };
    clearSavedRange();
  }

  return {
    linkState,
    openLinkDialog,
    confirmLink,
    cancelLink,
    imageState,
    openImageDialog,
    confirmImage,
    cancelImage,
  };
}
