export function useEditorSelection() {
  let savedRange: Range | null = null;

  function saveSelection(): void {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection(): void {
    if (!savedRange) return;
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }

  function clearSavedRange(): void {
    savedRange = null;
  }

  function getSavedRange(): Range | null {
    return savedRange;
  }

  return { saveSelection, restoreSelection, clearSavedRange, getSavedRange };
}
