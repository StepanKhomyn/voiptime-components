<script setup lang="ts">
  import { nextTick, onMounted, onUnmounted, ref } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import type { VTableColumnGroup, VTableColumnProps } from './types';
  import { modalManager } from '@/components/modal/plugin';
  import VTableColumnSelector from './VTableColumnSelector.vue';

  interface ColumnActionsProps {
    column: VTableColumnProps;
    allColumns: VTableColumnProps[]; // Додаємо всі колонки
    columnsSelector?: VTableColumnGroup[] | undefined; // Колонки які можна додати
  }

  const props = defineProps<ColumnActionsProps>();

  // Emit для передачі подій до батьківського компонента
  const emit = defineEmits<{
    pin: [column: VTableColumnProps, position: 'left' | 'right' | 'none'];
    'update-columns': [columns: VTableColumnProps[]]; // Для оновлення колонок після збереження
  }>();

  const menuRef = ref<HTMLElement>();
  const triggerRef = ref<HTMLElement>();
  const thRef = ref<HTMLElement>(); // Референс на сам th елемент
  const isOpen = ref(false);
  const isClosing = ref(false); // Прапорець для запобігання повторному відкриттю

  // Зберігаємо стан доступних колонок для селектора
  // Це буде включати як columnsSelector, так і колонки, які були видалені з таблиці
  const availableColumnsForSelector = ref<VTableColumnGroup[]>([]);

  const positionMenu = async () => {
    await nextTick();
    if (!menuRef.value || !triggerRef.value) return;

    const triggerRect = triggerRef.value.getBoundingClientRect();
    const menu = menuRef.value;

    // Позиціонуємо меню по центру іконки
    const menuWidth = menu.offsetWidth;
    const centerX = triggerRect.left + triggerRect.width / 2;

    menu.style.top = `${triggerRect.bottom - 20}px`; // Трохи нижче
    menu.style.left = `${centerX - menuWidth / 2}px`;

    // Перевіряємо чи не виходить за межі екрану
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menu.style.left = `${window.innerWidth - menuWidth - 8}px`;
    }
    if (rect.left < 0) {
      menu.style.left = '8px';
    }
  };

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation(); // Зупиняємо подію, щоб не спрацював handleClickOutside

    // Не відкриваємо меню, якщо воно зараз закривається
    if (isClosing.value) return;

    if (isOpen.value) {
      // Якщо меню відкрите - закриваємо
      closeMenu();
    } else {
      // Якщо меню закрите - відкриваємо
      openMenu();
    }
  };

  const openMenu = () => {
    if (isClosing.value) return;

    isOpen.value = true;
    positionMenu();

    // Збільшуємо z-index батьківського th
    if (thRef.value) {
      thRef.value.style.zIndex = '22';
    }
  };

  const closeMenu = () => {
    isClosing.value = true;
    isOpen.value = false;

    // Повертаємо оригінальний z-index
    if (thRef.value) {
      thRef.value.style.removeProperty('z-index');
    }

    // Скидаємо прапорець закриття через невелику затримку
    setTimeout(() => {
      isClosing.value = false;
    }, 100);
  };

  // Закриття меню при кліку поза ним
  const handleClickOutside = (event: MouseEvent) => {
    if (!triggerRef.value?.contains(event.target as Node) && !menuRef.value?.contains(event.target as Node)) {
      closeMenu();
    }
  };

  const handlePin = () => {
    const isPinned = isPinnedAny();

    if (isPinned) {
      // Відкріпити
      emit('pin', props.column, 'none');
      console.log(`Колонка "${props.column.label}" відкріплена`);
    } else {
      // Прикріпити зліва
      emit('pin', props.column, 'left');
      console.log(`Колонка "${props.column.label}" прикріплена зліва`);
    }

    // Закриваємо меню
    closeMenu();
  };

  // Функція для створення групи з видалених колонок
  const createRemovedColumnsGroup = (removedColumns: VTableColumnProps[]): VTableColumnGroup => ({
    name: 'removed',
    label: 'Видалені колонки',
    order: 999, // Найвищий порядок, щоб відображались останніми
    columns: removedColumns,
  });

  // Функція для оновлення доступних колонок для селектора
  const updateAvailableColumnsForSelector = (updatedColumns: VTableColumnProps[]) => {
    const currentColumnProps = new Set(updatedColumns.map(col => col.prop));
    const allPossibleColumns = new Set<string>();

    // Збираємо всі можливі колонки з columnsSelector
    props.columnsSelector?.forEach(group => {
      group.columns.forEach(col => allPossibleColumns.add(col.prop));
    });

    // Додаємо поточні колонки (вони також можуть бути видалені)
    props.allColumns.forEach(col => allPossibleColumns.add(col.prop));

    // Знаходимо колонки, які були видалені
    const removedColumns: VTableColumnProps[] = [];

    // Шукаємо серед усіх можливих колонок ті, що не входять в поточний список
    allPossibleColumns.forEach(prop => {
      if (!currentColumnProps.has(prop)) {
        // Шукаємо колонку в columnsSelector
        let foundColumn: VTableColumnProps | undefined;

        props.columnsSelector?.forEach(group => {
          const column = group.columns.find(col => col.prop === prop);
          if (column) foundColumn = column;
        });

        // Якщо не знайшли в columnsSelector, шукаємо в allColumns
        if (!foundColumn) {
          foundColumn = props.allColumns.find(col => col.prop === prop);
        }

        if (foundColumn) {
          removedColumns.push(foundColumn);
        }
      }
    });

    // Оновлюємо availableColumnsForSelector
    const newAvailableColumns = [...(props.columnsSelector || [])];

    // Додаємо групу видалених колонок, якщо є видалені колонки
    if (removedColumns.length > 0) {
      newAvailableColumns.push(createRemovedColumnsGroup(removedColumns));
    }

    availableColumnsForSelector.value = newAvailableColumns;
  };

  const handleToggleVisibility = () => {
    // Оновлюємо доступні колонки перед відкриттям модального вікна
    updateAvailableColumnsForSelector(props.allColumns);

    modalManager.open({
      component: VTableColumnSelector,
      title: 'Управління колонками таблиці',
      props: {
        columns: props.allColumns, // Передаємо всі колонки
        columnsSelector: availableColumnsForSelector.value, // Передаємо оновлені доступні колонки
        'onUpdate-columns': (updatedColumns: VTableColumnProps[]) => {
          console.log('ColumnActions отримав оновлені колонки:', updatedColumns);
          emit('update-columns', updatedColumns);
          // Оновлюємо availableColumnsForSelector після змін
          updateAvailableColumnsForSelector(updatedColumns);
        },
      },
      size: 'large',
      closeOnBackdropClick: false,
    });

    // Закриваємо меню
    closeMenu();
  };

  // Computed властивості для показу стану
  const isPinnedLeft = () => props.column.pinnedLeft;
  const isPinnedRight = () => props.column.pinnedRight;
  const isPinnedAny = () => isPinnedLeft() || isPinnedRight();

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);

    // Знаходимо батьківський th елемент
    if (triggerRef.value) {
      thRef.value = triggerRef.value.closest('th') as HTMLElement;
    }

    // Ініціалізуємо доступні колонки
    updateAvailableColumnsForSelector(props.allColumns);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<template>
  <div ref="triggerRef" class="vt-table-header-actions" @click="handleClick">
    <VIcon name="listBullet" />

    <!-- Dropdown меню -->
    <ul v-if="isOpen" ref="menuRef" :class="['dropdown-menu', 'vt-table-dropdown', { visible: isOpen }]">
      <!-- Прикріплення -->
      <li @click="handlePin">
        <VIcon :name="isPinnedAny() ? 'unfreeze' : 'freeze'" />
        <span>{{ isPinnedAny() ? 'Розморозити' : 'Заморозити' }}</span>
      </li>

      <!-- Управління колонками/видимістю -->
      <li @click="handleToggleVisibility">
        <VIcon name="columnInsert" />
        <span>Колонки</span>
      </li>
    </ul>
  </div>
</template>
