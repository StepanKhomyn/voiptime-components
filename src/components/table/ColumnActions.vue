<script lang="ts" setup>
  import VIcon from '@/components/icon/VIcon.vue';
  import VDropdown from '@/components/dropdown/VDropdown.vue';
  import VDropdownItem from '@/components/dropdown/VDropdownItem.vue';
  import type { VTableColumnGroup, VTableColumnProps } from './types';
  import { modalManager } from '@/components/modal/plugin';
  import VTableColumnSelector from './VTableColumnSelector.vue';
  import { useI18n } from '@/locales/useI18n';
  import { LOCALE_KEYS } from '@/locales/types';

  interface ColumnActionsProps {
    column: VTableColumnProps;
    allColumns: VTableColumnProps[];
    columnsSelector?: VTableColumnGroup[] | undefined;
  }

  const props = defineProps<ColumnActionsProps>();

  const emit = defineEmits<{
    pin: [column: VTableColumnProps, position: 'left' | 'right' | 'none'];
    'update-columns': [columns: VTableColumnProps[]];
  }>();

  const { t } = useI18n();

  // Обчислення стану pin
  const isPinnedAny = (): boolean => !!(props.column.pinnedLeft || props.column.pinnedRight);

  // Обробка команд dropdown
  const handleCommand = (command: string | number): void => {
    console.log('ColumnActions - Command received:', command, typeof command); // Debug log

    switch (
      String(command) // Приводимо до string для надійності
    ) {
      case 'pin':
        console.log('Executing pin command'); // Debug log
        handlePin();
        break;
      case 'columns':
        console.log('Executing columns command'); // Debug log
        handleToggleVisibility();
        break;
      default:
        console.warn('Unknown command:', command);
    }
  };

  const handlePin = (): void => {
    const isPinned = isPinnedAny();
    console.log('handlePin called, isPinned:', isPinned); // Debug log

    if (isPinned) {
      emit('pin', props.column, 'none');
    } else {
      emit('pin', props.column, 'left');
    }
  };

  const createRemovedColumnsGroup = (removedColumns: VTableColumnProps[]): VTableColumnGroup => ({
    name: 'removed',
    label: 'Видалені колонки',
    order: 999,
    columns: removedColumns,
  });

  const updateAvailableColumnsForSelector = (updatedColumns: VTableColumnProps[]): VTableColumnGroup[] => {
    const currentColumnProps = new Set(updatedColumns.map(col => col.prop));
    const allPossibleColumns = new Set<string>();

    props.columnsSelector?.forEach(group => {
      group.columns.forEach(col => allPossibleColumns.add(col.prop));
    });

    props.allColumns.forEach(col => allPossibleColumns.add(col.prop));

    const removedColumns: VTableColumnProps[] = [];

    allPossibleColumns.forEach(prop => {
      if (!currentColumnProps.has(prop)) {
        let foundColumn: VTableColumnProps | undefined;

        props.columnsSelector?.forEach(group => {
          const column = group.columns.find(col => col.prop === prop);
          if (column) foundColumn = column;
        });

        if (!foundColumn) {
          foundColumn = props.allColumns.find(col => col.prop === prop);
        }

        if (foundColumn) {
          removedColumns.push(foundColumn);
        }
      }
    });

    const newAvailableColumns = [...(props.columnsSelector || [])];

    if (removedColumns.length > 0) {
      newAvailableColumns.push(createRemovedColumnsGroup(removedColumns));
    }

    return newAvailableColumns;
  };

  const handleToggleVisibility = (): void => {
    const availableColumns = updateAvailableColumnsForSelector(props.allColumns);

    modalManager.open({
      component: VTableColumnSelector,
      title: t(LOCALE_KEYS.TABLE_COLUMN_ACTION),
      props: {
        columns: props.allColumns,
        columnsSelector: availableColumns,
        'onUpdate-columns': (updatedColumns: VTableColumnProps[]) => {
          emit('update-columns', updatedColumns);
        },
      },
      size: 'large',
      closeOnBackdropClick: false,
    });
  };
</script>

<template>
  <VDropdown placement="bottom-start" trigger="click" @command="handleCommand">
    <!-- Trigger -->
    <div class="vt-table-header-actions">
      <VIcon name="listBullet" />
    </div>

    <!-- Dropdown Menu -->
    <template #dropdown>
      <VDropdownItem command="pin">
        <VIcon :name="isPinnedAny() ? 'unfreeze' : 'freeze'" />
        <div>{{ isPinnedAny() ? t(LOCALE_KEYS.TABLE_UNFREEZE) : t(LOCALE_KEYS.TABLE_FREEZE) }}</div>
      </VDropdownItem>
      <VDropdownItem command="columns">
        <VIcon name="columnInsert" />
        <div>{{ t(LOCALE_KEYS.TABLE_COLUMNS) }}</div>
      </VDropdownItem>
    </template>
  </VDropdown>
</template>
