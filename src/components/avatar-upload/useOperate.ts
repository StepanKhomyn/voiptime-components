import type { ComputedRef, Ref, StyleValue } from 'vue';
import { computed, ref, watch } from 'vue';
import { getProjectionLength } from './uploadAvatar';
import { useDraggable } from './useDraggable';
import { useWheel } from './useWheel';
import type { RefElement, Size } from './types';

const WHEEL_ZOOM = 0.02;

export function useBackImgOperate(editBox: RefElement, imgSize: Size) {
  useWheel(editBox, updateBgImgZoom);
  const bgImgZoom = ref(1);
  function updateBgImgZoom(delta: number) {
    bgImgZoom.value += delta > 0 ? WHEEL_ZOOM : -WHEEL_ZOOM;
  }

  const imgRotate = ref(0);
  function updateRotate() {
    imgRotate.value = (imgRotate.value + 90) % 360;
  }
  const { style: editPositionStyle, x: baImgX, y: baImgY } = useDraggable(editBox);
  const bgImgStyle = computed(() => {
    return {
      ...editPositionStyle.value,
      width: `${imgSize.width * bgImgZoom.value}px`,
      height: `${imgSize.height * bgImgZoom.value}px`,
      transform: `rotate(${imgRotate.value}deg)`,
    };
  });
  return {
    bgImgZoom,
    editPositionStyle,
    baImgX,
    baImgY,
    bgImgStyle,
    imgRotate,
    updateRotate,
  };
}

interface UseSelectOperateProps {
  initSize: number;
  select: RefElement;
  resize: RefElement;
  limitSize: Size;
  bgBoxSize: Size;
  disable?: boolean;
}

export function useSelectOperate(props: UseSelectOperateProps) {
  const { initSize, select, resize, limitSize, disable = false, bgBoxSize } = props;
  const selectBoxSize = ref(initSize);
  const { x: resizeX, y: resizeY, clear: clearResize } = useDraggable(resize);
  const selectRange = {
    x: {
      min: 0,
      max: limitSize.width - selectBoxSize.value,
    },
    y: {
      min: 0,
      max: limitSize.height - selectBoxSize.value,
    },
  };

  function updateSelectRange() {
    selectRange.x.max = limitSize.width - selectBoxSize.value;
    selectRange.y.max = limitSize.height - selectBoxSize.value;
  }

  const {
    style: selectPositionStyle,
    x: selectX,
    y: selectY,
    setPosition,
    clear: clearSelect,
  } = useDraggable(select, {
    range: selectRange,
  });

  const selectBoxStyle: ComputedRef<StyleValue> = computed(() => {
    return {
      width: `${selectBoxSize.value}px`,
      height: `${selectBoxSize.value}px`,
      ...selectPositionStyle.value,
    };
  });

  function updateSelectSize() {
    if (selectBoxSize.value + selectX.value > limitSize.width) selectBoxSize.value = limitSize.width - selectX.value;
    if (selectBoxSize.value + selectY.value > limitSize.height) selectBoxSize.value = limitSize.height - selectY.value;
  }
  // слухаємо зміну розміру рамки виділення, оновлюємо обмеження
  watch([resizeX, resizeY], (newV, oldV) => {
    const sizeChangeX = newV[0] - oldV[0];
    const sizeChangeY = newV[1] - oldV[1];
    const sizeChange = getProjectionLength([sizeChangeX, sizeChangeY], [1, 1]);
    selectBoxSize.value = selectBoxSize.value + sizeChange;
    selectBoxSize.value = selectBoxSize.value <= 0 ? 0 : selectBoxSize.value;
    updateSelectSize();
    updateSelectRange();
  });
  if (disable) {
    clearResize();
    clearSelect();
  }
  setPosition({ x: (bgBoxSize.height - initSize) / 2, y: (bgBoxSize.width - initSize) / 2 });
  return {
    selectBoxSize,
    selectBoxStyle,
    selectX,
    selectY,
  };
}