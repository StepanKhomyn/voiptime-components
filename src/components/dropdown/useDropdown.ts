import { nextTick, onUnmounted, ref, type Ref } from 'vue';

// Types
interface DropdownPosition {
  top: string;
  left: string;
  minWidth?: string;
  transformOrigin: string;
}

interface DropdownOptions {
  trigger?: 'hover' | 'click';
  placement?: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end';
  showTimeout?: number;
  hideTimeout?: number;
  disabled?: boolean;
  hideOnClick?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  onScroll?: () => void;
}

interface UseDropdownReturn {
  // State
  visible: Ref<boolean>;
  parentVisible: Ref<boolean>;
  wasVisibleBeforeHiding: Ref<boolean>;
  dropdownPosition: Ref<DropdownPosition>;

  // Methods
  show: () => void;
  hide: () => void;
  toggle: () => void;
  updatePosition: () => Promise<void>;

  // Internal methods (exposed for advanced usage)
  checkParentVisibility: () => void;
  addScrollListeners: () => void;
  removeScrollListeners: () => void;
}

// Helper functions
const isElementVisible = (element: Element): boolean => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();

  // Перевіряємо чи елемент взагалі має розміри
  if (rect.width === 0 && rect.height === 0) return false;

  // Перевіряємо чи елемент в межах вікна
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const isInViewport = rect.top < windowHeight && rect.bottom > 0 && rect.left < windowWidth && rect.right > 0;

  if (!isInViewport) return false;

  // Перевіряємо чи елемент не перекритий батьківськими контейнерами
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    const parentRect = parent.getBoundingClientRect();
    const parentStyle = window.getComputedStyle(parent);

    // Якщо батьківський контейнер має overflow: hidden і елемент виходить за його межі
    if (parentStyle.overflow === 'hidden' || parentStyle.overflowY === 'hidden' || parentStyle.overflowX === 'hidden') {
      if (
        rect.top >= parentRect.bottom ||
        rect.bottom <= parentRect.top ||
        rect.left >= parentRect.right ||
        rect.right <= parentRect.left
      ) {
        return false;
      }
    }

    parent = parent.parentElement;
  }

  return true;
};

const getScrollableParents = (element: Element): Element[] => {
  const parents: Element[] = [];
  let parent = element.parentElement;

  while (parent && parent !== document.body) {
    const computedStyle = window.getComputedStyle(parent);
    const overflowY = computedStyle.overflowY;
    const overflowX = computedStyle.overflowX;

    // Перевіряємо чи елемент може скролитися
    if (
      ['scroll', 'auto'].includes(overflowY) ||
      ['scroll', 'auto'].includes(overflowX) ||
      parent.scrollHeight > parent.clientHeight ||
      parent.scrollWidth > parent.clientWidth
    ) {
      parents.push(parent);
    }

    parent = parent.parentElement;
  }

  // Додаємо window як останній "батьківський" елемент
  parents.push(window as any);

  return parents;
};

const calculateDropdownPosition = (
  triggerRect: DOMRect,
  dropdownRect: DOMRect,
  placement: string
): DropdownPosition => {
  let top = 0;
  let left = 0;

  switch (placement) {
    case 'bottom':
      top = triggerRect.bottom + window.scrollY + 5;
      left = triggerRect.left + window.scrollX + (triggerRect.width - dropdownRect.width) / 2;
      break;
    case 'bottom-start':
      top = triggerRect.bottom + window.scrollY + 5;
      left = triggerRect.left + window.scrollX;
      break;
    case 'bottom-end':
      top = triggerRect.bottom + window.scrollY + 5;
      left = triggerRect.right + window.scrollX - dropdownRect.width;
      break;
    case 'top':
      top = triggerRect.top + window.scrollY - dropdownRect.height - 20;
      left = triggerRect.left + window.scrollX + (triggerRect.width - dropdownRect.width) / 2;
      break;
    case 'top-start':
      top = triggerRect.top + window.scrollY - dropdownRect.height - 20;
      left = triggerRect.left + window.scrollX;
      break;
    case 'top-end':
      top = triggerRect.top + window.scrollY - dropdownRect.height - 20;
      left = triggerRect.right + window.scrollX - dropdownRect.width;
      break;
  }

  // Корекція меж екрана
  if (left + dropdownRect.width > window.innerWidth) {
    left = window.innerWidth - dropdownRect.width - 10;
  }
  if (left < 10) left = 10;

  if (top + dropdownRect.height > window.innerHeight + window.scrollY) {
    top = triggerRect.top + window.scrollY - dropdownRect.height - 5;
  }
  if (top < window.scrollY + 10) top = window.scrollY + 10;

  return {
    top: `${top}px`,
    left: `${left}px`,
    transformOrigin: 'center top',
  };
};

// Main composable
export function useDropdown(
  triggerRef: Ref<HTMLElement | undefined>,
  dropdownRef: Ref<HTMLElement | undefined>,
  options: DropdownOptions = {}
): UseDropdownReturn {
  const {
    trigger = 'click',
    placement = 'bottom-start',
    showTimeout = 250,
    hideTimeout = 150,
    disabled = false,
    hideOnClick = true,
    onVisibleChange,
    onScroll,
  } = options;

  // State
  const visible = ref(false);
  const parentVisible = ref(true);
  const wasVisibleBeforeHiding = ref(false);
  const timeoutPending = ref<number | null>(null);
  const scrollableParents = ref<Element[]>([]);

  const dropdownPosition = ref<DropdownPosition>({
    top: '0px',
    left: '0px',
    transformOrigin: 'center top',
  });

  const checkParentVisibility = (): void => {
    if (!triggerRef.value) return;

    const isVisible = isElementVisible(triggerRef.value);

    if (parentVisible.value !== isVisible) {
      parentVisible.value = isVisible;

      if (!isVisible && visible.value) {
        // Батьківський елемент став невидимим, ховаємо дропдаун
        wasVisibleBeforeHiding.value = true;
        visible.value = false;
        onVisibleChange?.(false);
      } else if (isVisible && wasVisibleBeforeHiding.value && !visible.value) {
        // Батьківський елемент знову став видимим, показуємо дропдаун якщо він був відкритий
        wasVisibleBeforeHiding.value = false;
        visible.value = true;
        updatePosition();
        onVisibleChange?.(true);
      }
    }
  };

  const updatePosition = async (): Promise<void> => {
    await nextTick();
    if (!triggerRef.value || !dropdownRef.value) return;

    const triggerRect = triggerRef.value.getBoundingClientRect();
    const dropdownRect = dropdownRef.value.getBoundingClientRect();

    const position = calculateDropdownPosition(triggerRect, dropdownRect, placement);
    dropdownPosition.value = {
      ...position,
      minWidth: `${triggerRect.width}px`,
    };
  };

  const handleScroll = (): void => {
    if (visible.value || wasVisibleBeforeHiding.value) {
      checkParentVisibility();
      if (visible.value) {
        updatePosition();
      }
      onScroll?.();
    }
  };

  const addScrollListeners = (): void => {
    if (!triggerRef.value) return;

    scrollableParents.value = getScrollableParents(triggerRef.value);
    scrollableParents.value.forEach(parent => {
      parent.addEventListener('scroll', handleScroll, { passive: true });
    });
    window.addEventListener('resize', handleScroll);
  };

  const removeScrollListeners = (): void => {
    scrollableParents.value.forEach(parent => {
      parent.removeEventListener('scroll', handleScroll);
    });
    window.removeEventListener('resize', handleScroll);
    scrollableParents.value = [];
  };

  // Main methods
  const show = (): void => {
    if (disabled || visible.value) return;

    if (!triggerRef.value || !isElementVisible(triggerRef.value)) {
      return;
    }

    timeoutPending.value = window.setTimeout(
      async () => {
        visible.value = true;
        parentVisible.value = true;
        wasVisibleBeforeHiding.value = false;
        await updatePosition();
        addScrollListeners();
        onVisibleChange?.(true);
      },
      trigger === 'hover' ? showTimeout : 0
    );
  };

  const hide = (): void => {
    if (!visible.value) return;

    timeoutPending.value = window.setTimeout(
      () => {
        visible.value = false;
        wasVisibleBeforeHiding.value = false;
        removeScrollListeners();
        onVisibleChange?.(false);
      },
      trigger === 'hover' ? hideTimeout : 0
    );
  };

  const toggle = (): void => {
    if (disabled) return;
    visible.value ? hide() : show();
  };

  // Lifecycle
  onUnmounted(() => {
    removeScrollListeners();
  });

  return {
    // State
    visible,
    parentVisible,
    wasVisibleBeforeHiding,
    dropdownPosition,

    // Methods
    show,
    hide,
    toggle,
    updatePosition,

    // Internal methods
    checkParentVisibility,
    addScrollListeners,
    removeScrollListeners,
  };
}
