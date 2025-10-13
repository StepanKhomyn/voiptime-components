import { ref } from 'vue';
import type { RowReorderEventData } from '../types';

export interface DragState {
  draggedIndex: number | null;
  draggedRow: Record<string, any> | null;
  targetIndex: number | null;
  isDragging: boolean;
  insertPosition: 'before' | 'after' | null;
}

export function useRowDrag(getData: () => Record<string, any>[], emit: (...args: any[]) => void) {
  const dragState = ref<DragState>({
    draggedIndex: null,
    draggedRow: null,
    targetIndex: null,
    isDragging: false,
    insertPosition: null,
  });

  let dragImage: HTMLElement | null = null;

  const handleDragStart = (event: DragEvent, row: Record<string, any>, index: number) => {
    if (!event.dataTransfer) return;

    dragState.value.draggedIndex = index;
    dragState.value.draggedRow = row;
    dragState.value.isDragging = true;

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));

    // Створюємо custom drag image щоб не зсувався layout
    const target = event.target as HTMLElement;
    const rowElement = target.closest('tr');

    if (rowElement) {
      dragImage = rowElement.cloneNode(true) as HTMLElement;
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-9999px';
      dragImage.style.opacity = '0.8';
      dragImage.style.width = rowElement.offsetWidth + 'px';
      dragImage.style.backgroundColor = 'white';
      dragImage.style.border = '1px solid var(--color-primary-main)';
      document.body.appendChild(dragImage);

      event.dataTransfer.setDragImage(dragImage, 0, 0);

      setTimeout(() => {
        dragImage?.parentNode?.removeChild(dragImage);
        dragImage = null;
      }, 0);
    }

    requestAnimationFrame(() => {
      target.closest('tr')?.classList.add('vt-table__row--dragging');
    });
  };

  const handleDragOver = (event: DragEvent, index: number) => {
    event.preventDefault();
    if (!event.dataTransfer) return;

    event.dataTransfer.dropEffect = 'move';

    if (dragState.value.draggedIndex === index) {
      dragState.value.targetIndex = null;
      dragState.value.insertPosition = null;
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const mouseY = event.clientY;

    // Визначаємо чи вставляємо до чи після
    const insertPosition = mouseY < midpoint ? 'before' : 'after';

    dragState.value.targetIndex = index;
    dragState.value.insertPosition = insertPosition;
  };

  const handleDragEnter = (event: DragEvent, index: number) => {
    event.preventDefault();

    if (dragState.value.draggedIndex === index) return;
  };

  const handleDragLeave = (event: DragEvent) => {
    const target = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;

    // Перевіряємо чи не переходимо в дочірній елемент
    if (relatedTarget && target.contains(relatedTarget)) {
      return;
    }

    // Видаляємо target тільки якщо покидаємо row повністю
    if (!relatedTarget || !relatedTarget.closest('tr')) {
      dragState.value.targetIndex = null;
      dragState.value.insertPosition = null;
    }
  };

  const handleDrop = (event: DragEvent, targetIndex: number) => {
    event.preventDefault();
    event.stopPropagation();

    const draggedIndex = dragState.value.draggedIndex;
    const draggedRow = dragState.value.draggedRow;
    const insertPosition = dragState.value.insertPosition;

    if (draggedIndex === null || draggedRow === null) {
      resetDragState();
      return;
    }

    // Якщо скидаємо на той самий рядок - нічого не робимо
    if (draggedIndex === targetIndex) {
      resetDragState();
      return;
    }

    const data = getData();
    const newData = [...data];

    // Видаляємо елемент зі старої позиції
    const [removed] = newData.splice(draggedIndex, 1);

    // Вираховуємо нову позицію
    let newIndex = targetIndex;

    // Якщо перетягуємо вниз, потрібно скорегувати індекс
    if (draggedIndex < targetIndex) {
      newIndex = targetIndex - 1;
    }

    // Якщо вставляємо після - додаємо 1
    if (insertPosition === 'after') {
      newIndex = newIndex + 1;
    }

    // Вставляємо на нову позицію
    newData.splice(newIndex, 0, removed);

    // Емітимо події
    const eventData: RowReorderEventData = {
      oldIndex: draggedIndex,
      newIndex: newIndex,
      row: draggedRow,
      newData: newData,
    };

    emit('row-reorder', eventData);
    emit('update:data', newData);

    resetDragState();
  };

  const handleDragEnd = (event: DragEvent) => {
    const target = event.target as HTMLElement;
    target.closest('tr')?.classList.remove('vt-table__row--dragging');

    // Очищаємо drag image якщо залишився
    if (dragImage && dragImage.parentNode) {
      dragImage.parentNode.removeChild(dragImage);
      dragImage = null;
    }

    resetDragState();
  };

  const resetDragState = () => {
    dragState.value = {
      draggedIndex: null,
      draggedRow: null,
      targetIndex: null,
      isDragging: false,
      insertPosition: null,
    };
  };

  const shouldShowInsertLine = (index: number, position: 'before' | 'after'): boolean => {
    return (
      dragState.value.isDragging &&
      dragState.value.targetIndex === index &&
      dragState.value.insertPosition === position &&
      dragState.value.draggedIndex !== index
    );
  };

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    shouldShowInsertLine,
  };
}
