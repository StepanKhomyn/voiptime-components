import type { DirectiveBinding, ObjectDirective } from 'vue';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

type TooltipHTMLElement = HTMLElement & {
  __tooltipEl?: HTMLDivElement;
  __tooltipText?: string;
  __mouseenterHandler?: () => void;
  __mouseleaveHandler?: () => void;
  __scrollHandler?: () => void;
};

// Функція для створення tooltip елемента
const createTooltip = (text: string, placement: TooltipPlacement): HTMLDivElement => {
  const tooltip = document.createElement('div');
  tooltip.className = `vt-tooltip vt-tooltip--${placement}`;
  tooltip.innerText = text;

  // Базові стилі
  Object.assign(tooltip.style, {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    lineHeight: '1.4',
    zIndex: '9999',
    pointerEvents: 'none',
    visibility: 'hidden',
    opacity: '0',
    transition: 'opacity 0.2s ease, visibility 0.2s ease',
    maxWidth: '300px',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    // Видаляємо minWidth: 'max-content' - це може викликати overflow
  });

  // Стрілка для tooltip
  const arrow = document.createElement('div');
  arrow.className = 'vt-tooltip__arrow';
  Object.assign(arrow.style, {
    position: 'absolute',
    width: '0',
    height: '0',
    borderStyle: 'solid',
  });

  // Позиціонування стрілки в залежності від placement
  switch (placement) {
    case 'top':
      Object.assign(arrow.style, {
        top: '100%',
        left: '50%',
        marginLeft: '-5px',
        borderWidth: '5px 5px 0 5px',
        borderColor: 'rgba(0, 0, 0, 0.8) transparent transparent transparent',
      });
      break;
    case 'bottom':
      Object.assign(arrow.style, {
        bottom: '100%',
        left: '50%',
        marginLeft: '-5px',
        borderWidth: '0 5px 5px 5px',
        borderColor: 'transparent transparent rgba(0, 0, 0, 0.8) transparent',
      });
      break;
    case 'left':
      Object.assign(arrow.style, {
        top: '50%',
        left: '100%',
        marginTop: '-5px',
        borderWidth: '5px 0 5px 5px',
        borderColor: 'transparent transparent transparent rgba(0, 0, 0, 0.8)',
      });
      break;
    case 'right':
      Object.assign(arrow.style, {
        top: '50%',
        right: '100%',
        marginTop: '-5px',
        borderWidth: '5px 5px 5px 0',
        borderColor: 'transparent rgba(0, 0, 0, 0.8) transparent transparent',
      });
      break;
  }

  tooltip.appendChild(arrow);
  return tooltip;
};

// Функція для позиціонування tooltip
const positionTooltip = (tooltip: HTMLDivElement, target: HTMLElement, placement: TooltipPlacement) => {
  const targetRect = target.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const PADDING = 8;

  // Обмежуємо максимальну ширину tooltip в залежності від viewport
  const maxTooltipWidth = Math.min(300, viewportWidth - PADDING * 2);
  tooltip.style.maxWidth = `${maxTooltipWidth}px`;

  // Тепер отримуємо розміри після встановлення maxWidth
  const tooltipRect = tooltip.getBoundingClientRect();

  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = targetRect.top + scrollY - tooltipRect.height - 8;
      left = targetRect.left + scrollX + (targetRect.width - tooltipRect.width) / 2;
      break;
    case 'bottom':
      top = targetRect.bottom + scrollY + 8;
      left = targetRect.left + scrollX + (targetRect.width - tooltipRect.width) / 2;
      break;
    case 'left':
      top = targetRect.top + scrollY + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.left + scrollX - tooltipRect.width - 8;
      break;
    case 'right':
      top = targetRect.top + scrollY + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.right + scrollX + 8;
      break;
  }

  // Перевіряємо горизонтальні межі
  if (left < PADDING) {
    left = PADDING;
  } else if (left + tooltipRect.width > viewportWidth - PADDING) {
    left = viewportWidth - tooltipRect.width - PADDING;
  }

  // Перевіряємо вертикальні межі
  if (top < scrollY + PADDING) {
    // Якщо tooltip зверху виходить за межі, показуємо знизу
    if (placement === 'top') {
      top = targetRect.bottom + scrollY + 8;
    } else {
      top = scrollY + PADDING;
    }
  } else if (top + tooltipRect.height > scrollY + viewportHeight - PADDING) {
    // Якщо tooltip знизу виходить за межі, показуємо зверху
    if (placement === 'bottom') {
      top = targetRect.top + scrollY - tooltipRect.height - 8;
    } else {
      top = scrollY + viewportHeight - tooltipRect.height - PADDING;
    }
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
};

// Функція для показу tooltip
const showTooltip = (tooltip: HTMLDivElement, target: HTMLElement, placement: TooltipPlacement) => {
  if (!tooltip.parentElement) {
    document.body.appendChild(tooltip);
  }

  tooltip.style.visibility = 'visible';
  positionTooltip(tooltip, target, placement);

  requestAnimationFrame(() => {
    tooltip.style.opacity = '1';
  });
};

// Функція для приховування tooltip
const hideTooltip = (tooltip: HTMLDivElement) => {
  tooltip.style.opacity = '0';
  tooltip.style.visibility = 'hidden';
};

// Функція для перевірки overflow
const hasTextOverflow = (element: HTMLElement): boolean => {
  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
};

// Функція для перевірки чи елемент в таблиці
const isInTable = (element: HTMLElement): boolean => {
  return !!element.closest('.vt-table, table');
};

const getPlacement = (el: HTMLElement): TooltipPlacement => (el.dataset.placement as TooltipPlacement) || 'top';

const getBindingText = (binding: DirectiveBinding<string>): string => binding.value?.trim() ?? '';

// Видаляємо tooltip з DOM (обробники залишаються і створять його знову при потребі)
const removeTooltip = (el: TooltipHTMLElement) => {
  el.__tooltipEl?.remove();
  delete el.__tooltipEl;
};

export const tooltipDirective: ObjectDirective = {
  mounted(el: TooltipHTMLElement, binding: DirectiveBinding<string>) {
    el.__tooltipText = getBindingText(binding);

    // Обробники читають актуальний текст з елемента, тому їх достатньо додати один раз
    const show = () => {
      const text = el.__tooltipText;
      if (!text) return;

      // Якщо елемент в таблиці, показуємо тільки при overflow
      // Інакше показуємо завжди
      if (isInTable(el) && !hasTextOverflow(el)) return;

      const placement = getPlacement(el);
      if (!el.__tooltipEl) {
        el.__tooltipEl = createTooltip(text, placement);
      }

      showTooltip(el.__tooltipEl, el, placement);
    };

    const hide = () => {
      if (el.__tooltipEl) hideTooltip(el.__tooltipEl);
    };

    // Оновлюємо позицію при скролі
    const updatePosition = () => {
      if (el.__tooltipEl?.style.opacity === '1') {
        positionTooltip(el.__tooltipEl, el, getPlacement(el));
      }
    };

    el.__mouseenterHandler = show;
    el.__mouseleaveHandler = hide;
    el.__scrollHandler = updatePosition;

    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);

    // Додаємо обробник скролу для оновлення позиції
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
  },

  updated(el: TooltipHTMLElement, binding: DirectiveBinding<string>) {
    const text = getBindingText(binding);
    if (text === el.__tooltipText) return;

    el.__tooltipText = text;

    if (!text) {
      // Якщо немає тексту, видаляємо tooltip (в т.ч. якщо він зараз показаний)
      removeTooltip(el);
    } else if (el.__tooltipEl) {
      // Оновлюємо текст tooltip'а
      el.__tooltipEl.firstChild!.textContent = text;
    }
  },

  beforeUnmount(el: TooltipHTMLElement) {
    // Видаляємо tooltip з DOM
    removeTooltip(el);
    delete el.__tooltipText;

    // Видаляємо обробники подій
    if (el.__mouseenterHandler) {
      el.removeEventListener('mouseenter', el.__mouseenterHandler);
      delete el.__mouseenterHandler;
    }

    if (el.__mouseleaveHandler) {
      el.removeEventListener('mouseleave', el.__mouseleaveHandler);
      delete el.__mouseleaveHandler;
    }

    if (el.__scrollHandler) {
      window.removeEventListener('scroll', el.__scrollHandler, true);
      window.removeEventListener('resize', el.__scrollHandler);
      delete el.__scrollHandler;
    }
  },
};
