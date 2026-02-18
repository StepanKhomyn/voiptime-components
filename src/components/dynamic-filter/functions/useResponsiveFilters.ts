import { nextTick, onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue';

export function useResponsiveFilters(
  containerRef: Ref<HTMLElement | null>,
  actionsRef: Ref<HTMLElement | null>,
  dropdownTriggerRef: Ref<HTMLElement | null>,
  measurementContainerRef: Ref<HTMLElement | null>,
  slotNodesLength: Ref<number>
) {
  const visibleIndexes = ref<number[]>([]);

  // debounce через rAF
  let rafId = 0;
  function scheduleCalculate() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      calculate();
      rafId = 0;
    });
  }

  // ResizeObserver для відстеження змін розмірів
  let ro: ResizeObserver | null = null;

  function getHorizontalMargins(el: HTMLElement) {
    const s = getComputedStyle(el);
    return parseFloat(s.marginLeft || "0") + parseFloat(s.marginRight || "0");
  }

  function calculate() {
    const el = containerRef.value;
    const measureRoot = measurementContainerRef.value;
    if (!el || !measureRoot) return;

    // Знаходимо головний контейнер manage-form__card
    const manageFormCard = el.closest('.manage-form__card') as HTMLElement;
    if (!manageFormCard) {
      console.warn('manage-form__card container not found');
      return;
    }

    // Отримуємо розміри
    const containerRect = el.getBoundingClientRect();
    const cardRect = manageFormCard.getBoundingClientRect();

    // Обчислюємо ширину правих елементів
    let rightElementsWidth = 0;

    // Кнопки дій (якщо є)
    if (actionsRef.value) {
      const actionsRect = actionsRef.value.getBoundingClientRect();
      rightElementsWidth += actionsRect.width + getHorizontalMargins(actionsRef.value);
    }

    // Дропдаун тригер
    if (dropdownTriggerRef.value) {
      const triggerRect = dropdownTriggerRef.value.getBoundingClientRect();
      rightElementsWidth += triggerRect.width + getHorizontalMargins(dropdownTriggerRef.value);
    }

    // Шукаємо всі елементи праворуч від фільтрів в рамках manage-form__card-list
    const cardList = el.closest('.manage-form__card-list') as HTMLElement;
    if (cardList) {
      const allChildren = Array.from(cardList.children) as HTMLElement[];
      const containerIndex = allChildren.findIndex(child => child.contains(el));

      if (containerIndex >= 0) {
        const rightSiblings = allChildren.slice(containerIndex + 1);
        rightSiblings.forEach((sibling) => {
          // Пропускаємо приховані елементи
          const siblingStyles = getComputedStyle(sibling);
          if (siblingStyles.display === 'none' || siblingStyles.visibility === 'hidden') {
            return;
          }

          const siblingRect = sibling.getBoundingClientRect();
          rightElementsWidth += siblingRect.width + getHorizontalMargins(sibling);
        });
      }
    }

    // Додаємо запас для стабільності
    const extraReserve = 20;

    // Доступна ширина: від лівого краю контейнера до правого краю карти мінус праві елементи
    let availableWidth = Math.max(0, cardRect.right - containerRect.left - rightElementsWidth - extraReserve);

    // Обмежуємо власною шириною контейнера
    const containerPadding = parseFloat(getComputedStyle(el).paddingLeft || "0") +
      parseFloat(getComputedStyle(el).paddingRight || "0");
    availableWidth = Math.min(availableWidth, el.clientWidth - containerPadding);

    // Вимірюємо фільтри
    const measureItems = measureRoot.querySelectorAll<HTMLElement>(".manage-form__card-filter__measure-element");
    const newVisible: number[] = [];
    let used = 0;
    const GAP = 10;
    const MIN_FILTER_WIDTH = 150;
    for (let i = 0; i < measureItems.length; i++) {
      const itemRect = measureItems[i].getBoundingClientRect();
      const itemWidth = Math.max(
        itemRect.width,
        MIN_FILTER_WIDTH
      );
      const wWithGap = itemWidth + (i > 0 ? GAP : 0);

      if (used + wWithGap <= availableWidth) {
        newVisible.push(i);
        used += wWithGap;
      } else {
        break;
      }
    }

    visibleIndexes.value = newVisible;
  }

  const init = () => {
    // Перший розрахунок
    nextTick(() => {
      setTimeout(calculate, 50); // Невелика затримка для стабілізації
    });

    // Window resize
    window.addEventListener("resize", scheduleCalculate);

    // ResizeObserver для ключових контейнерів
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver((entries) => {
        // Перевіряємо чи є значні зміни розмірів
        const hasSignificantChange = entries.some(entry => {
          const { width, height } = entry.contentRect;
          return width > 0 && height > 0; // Ігноруємо нульові розміри
        });

        if (hasSignificantChange) {
          scheduleCalculate();
        }
      });

      const el = containerRef.value;
      if (el) {
        // Стежимо за основними контейнерами
        ro.observe(el);

        const manageFormCard = el.closest('.manage-form__card');
        if (manageFormCard) {
          ro.observe(manageFormCard);
        }

        // Стежимо за левим sidebar
        const sidebar = document.querySelector('.left-panel, .sidebar, nav[class*="nav"], .main-layout__aside');
        if (sidebar) {
          ro.observe(sidebar);
        }
      }
    }

    // Спостерігач за змінами класів (для sidebar toggle)
    const body = document.body;
    const bodyObserver = new MutationObserver((mutations) => {
      const hasClassChanges = mutations.some(mutation =>
        mutation.type === 'attributes' && mutation.attributeName === 'class'
      );

      if (hasClassChanges) {
        // Затримка для завершення CSS анімації
        setTimeout(scheduleCalculate, 300);
      }
    });

    bodyObserver.observe(body, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup function для body observer
    const cleanup = () => {
      bodyObserver.disconnect();
    };

    // Додаємо cleanup до основної функції cleanup
    const originalCleanup = window.addEventListener.prototype;

    // Слухач змін слотів
    watch(
      () => slotNodesLength.value,
      () => {
        nextTick(() => {
          setTimeout(calculate, 100);
        });
      },
    );

    // Слухач змін кнопок
    watch(
      [actionsRef, dropdownTriggerRef],
      () => {
        nextTick(scheduleCalculate);
      },
      { flush: 'post' }
    );
  };

  const cleanup = () => {
    window.removeEventListener("resize", scheduleCalculate);
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    if (ro) {
      ro.disconnect();
      ro = null;
    }
  };

  onMounted(init);
  onBeforeUnmount(cleanup);

  // Додаткові методи для ручного контролю
  const forceRecalculate = () => {
    setTimeout(calculate, 100);
  };

  return {
    visibleIndexes,
    calculate,
    scheduleCalculate,
    forceRecalculate
  };
}