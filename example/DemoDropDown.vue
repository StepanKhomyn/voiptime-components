<script lang="ts" setup>
  import { ref } from 'vue';
  import VDropdown from '@/components/dropdown/VDropdown.vue';
  import VDropdownItem from '@/components/dropdown/VDropdownItem.vue';
  import VButton from '@/components/button/VButton.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import DocCodeBlock from './helper/DocCodeBlock.vue';

  const lastCommand = ref<string | null>(null);
  const dropdownRef = ref();

  const onCommand = (cmd: string | number) => {
    lastCommand.value = String(cmd);
    console.log('command:', cmd);
  };

  const propsSections: TableSection[] = [
    {
      title: 'Props (VDropdown)',
      rows: [
        { name: 'trigger', type: "'click' | 'hover'", default: "'hover'", description: 'Спосіб активації' },
        {
          name: 'placement',
          type: "'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end'",
          default: "'bottom-start'",
          description: 'Позиція меню відносно тригера',
        },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Вимкнути dropdown' },
        { name: 'hideOnClick', type: 'boolean', default: 'true', description: 'Ховати меню при кліку на пункт' },
        { name: 'showTimeout', type: 'number', default: '250', description: 'Затримка показу (мс) для hover' },
        { name: 'hideTimeout', type: 'number', default: '150', description: 'Затримка приховування (мс) для hover' },
        { name: 'maxHeight', type: 'string | number', default: "'200'", description: 'Максимальна висота меню (px)' },
        { name: 'tabindex', type: 'number', default: '0', description: 'Tabindex тригера' },
      ],
    },
    {
      title: 'Props (VDropdownItem)',
      rows: [
        {
          name: 'command',
          type: 'string | number',
          default: '-',
          description: 'Значення що передається в @command при кліку',
        },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Вимкнути пункт' },
        { name: 'divided', type: 'boolean', default: 'false', description: 'Роздільник зверху пункту' },
        { name: 'icon', type: 'string', default: '-', description: 'CSS клас або emoji іконки' },
      ],
    },
    {
      title: 'Events (VDropdown)',
      rows: [
        { name: 'command', type: 'string | number', description: 'Клік на VDropdownItem з command' },
        { name: 'visible-change', type: 'boolean', description: 'Зміна видимості меню' },
        { name: 'click', type: 'MouseEvent', description: 'Клік на тригер' },
      ],
    },
    {
      title: 'Slots (VDropdown)',
      rows: [
        { name: 'default', description: 'Тригер — кнопка, посилання або будь-який елемент' },
        { name: 'dropdown', description: 'Вміст меню — VDropdownItem або кастомний контент' },
      ],
    },
    {
      title: 'Expose (ref методи)',
      rows: [
        { name: 'show()', type: 'void', description: 'Програмно показати меню' },
        { name: 'hide()', type: 'void', description: 'Програмно сховати меню' },
        { name: 'visible', type: 'Ref<boolean>', description: 'Реактивний стан видимості' },
      ],
    },
  ];
</script>

<template>
  <div class="dropdown-showcase">
    <!-- ─── Базове ─── -->
    <DocSection title="Базове використання">
      <DocPreview :script="`const onCommand = (cmd) => console.log('command:', cmd)`">
        <VDropdown @command="onCommand">
          <VButton>Дії</VButton>
          <template #dropdown>
            <VDropdownItem command="edit">Редагувати</VDropdownItem>
            <VDropdownItem command="duplicate">Дублювати</VDropdownItem>
            <VDropdownItem command="delete" divided>Видалити</VDropdownItem>
            <VDropdownItem command="share" disabled>Поділитися</VDropdownItem>
          </template>
        </VDropdown>
      </DocPreview>

      <div v-if="lastCommand" class="event-log">
        Остання команда: <strong>{{ lastCommand }}</strong>
      </div>
    </DocSection>

    <!-- ─── Тригери ─── -->
    <DocSection title="Тригери">
      <DocPreview>
        <VDropdown trigger="hover" @command="onCommand">
          <VButton>Hover</VButton>
          <template #dropdown>
            <VDropdownItem command="h1">Пункт 1</VDropdownItem>
            <VDropdownItem command="h2">Пункт 2</VDropdownItem>
            <VDropdownItem command="h3">Пункт 3</VDropdownItem>
          </template>
        </VDropdown>

        <VDropdown trigger="click" @command="onCommand">
          <VButton type="primary">Click</VButton>
          <template #dropdown>
            <VDropdownItem command="c1">Пункт 1</VDropdownItem>
            <VDropdownItem command="c2">Пункт 2</VDropdownItem>
            <VDropdownItem command="c3">Пункт 3</VDropdownItem>
          </template>
        </VDropdown>
      </DocPreview>
    </DocSection>

    <!-- ─── Позиціонування ─── -->
    <DocSection title="Позиціонування">
      <DocPreview>
        <VDropdown placement="top-start" trigger="click" @command="onCommand">
          <VButton>top-start</VButton>
          <template #dropdown>
            <VDropdownItem command="1">Пункт 1</VDropdownItem>
            <VDropdownItem command="2">Пункт 2</VDropdownItem>
          </template>
        </VDropdown>

        <VDropdown placement="top" trigger="click" @command="onCommand">
          <VButton>top</VButton>
          <template #dropdown>
            <VDropdownItem command="1">Пункт 1</VDropdownItem>
            <VDropdownItem command="2">Пункт 2</VDropdownItem>
          </template>
        </VDropdown>

        <VDropdown placement="top-end" trigger="click" @command="onCommand">
          <VButton>top-end</VButton>
          <template #dropdown>
            <VDropdownItem command="1">Пункт 1</VDropdownItem>
            <VDropdownItem command="2">Пункт 2</VDropdownItem>
          </template>
        </VDropdown>

        <VDropdown placement="bottom-start" trigger="click" @command="onCommand">
          <VButton type="primary">bottom-start</VButton>
          <template #dropdown>
            <VDropdownItem command="1">Пункт 1</VDropdownItem>
            <VDropdownItem command="2">Пункт 2</VDropdownItem>
          </template>
        </VDropdown>

        <VDropdown placement="bottom" trigger="click" @command="onCommand">
          <VButton type="primary">bottom</VButton>
          <template #dropdown>
            <VDropdownItem command="1">Пункт 1</VDropdownItem>
            <VDropdownItem command="2">Пункт 2</VDropdownItem>
          </template>
        </VDropdown>

        <VDropdown placement="bottom-end" trigger="click" @command="onCommand">
          <VButton type="primary">bottom-end</VButton>
          <template #dropdown>
            <VDropdownItem command="1">Пункт 1</VDropdownItem>
            <VDropdownItem command="2">Пункт 2</VDropdownItem>
          </template>
        </VDropdown>
      </DocPreview>
    </DocSection>

    <!-- ─── Пункти меню ─── -->
    <DocSection title="Варіанти пунктів меню">
      <DocPreview title="Роздільники">
        <VDropdown @command="onCommand">
          <VButton>З роздільниками</VButton>
          <template #dropdown>
            <VDropdownItem command="new">Створити</VDropdownItem>
            <VDropdownItem command="open">Відкрити</VDropdownItem>
            <VDropdownItem command="save" divided>Зберегти</VDropdownItem>
            <VDropdownItem command="export">Експорт</VDropdownItem>
            <VDropdownItem command="print" divided>Друк</VDropdownItem>
          </template>
        </VDropdown>
      </DocPreview>

      <DocPreview title="Вимкнені пункти">
        <VDropdown @command="onCommand">
          <VButton>З disabled</VButton>
          <template #dropdown>
            <VDropdownItem command="a1">Доступний</VDropdownItem>
            <VDropdownItem command="a2" disabled>Недоступний</VDropdownItem>
            <VDropdownItem command="a3">Ще доступний</VDropdownItem>
            <VDropdownItem command="a4" disabled>Ще недоступний</VDropdownItem>
          </template>
        </VDropdown>
      </DocPreview>

      <DocPreview title="Довге меню зі скролом">
        <VDropdown :max-height="150" @command="onCommand">
          <VButton>Довге меню</VButton>
          <template #dropdown>
            <VDropdownItem v-for="i in 12" :key="i" :command="`item-${i}`"> Пункт меню {{ i }}</VDropdownItem>
          </template>
        </VDropdown>
      </DocPreview>
    </DocSection>

    <!-- ─── Програмне управління ─── -->
    <DocSection description="ref на VDropdown дає доступ до show() / hide()" title="Програмне управління">
      <DocPreview
        :script="`
const dropdownRef = ref()
const show = () => dropdownRef.value?.show()
const hide = () => dropdownRef.value?.hide()
        `"
      >
        <VDropdown ref="dropdownRef" trigger="click" @command="onCommand">
          <VButton type="primary">Dropdown</VButton>
          <template #dropdown>
            <VDropdownItem command="p1">Пункт 1</VDropdownItem>
            <VDropdownItem command="p2">Пункт 2</VDropdownItem>
          </template>
        </VDropdown>

        <VButton @click="dropdownRef?.show()">show()</VButton>
        <VButton type="danger" @click="dropdownRef?.hide()">hide()</VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── Hover таймаути ─── -->
    <DocSection title="Кастомні таймаути hover">
      <DocPreview>
        <VDropdown :hide-timeout="400" :show-timeout="600" trigger="hover" @command="onCommand">
          <VButton type="warning">Повільний hover (600 / 400 мс)</VButton>
          <template #dropdown>
            <VDropdownItem command="s1">Пункт 1</VDropdownItem>
            <VDropdownItem command="s2">Пункт 2</VDropdownItem>
          </template>
        </VDropdown>
      </DocPreview>
    </DocSection>

    <!-- ─── Вимкнений ─── -->
    <DocSection title="Вимкнений стан">
      <DocPreview>
        <VDropdown disabled @command="onCommand">
          <VButton disabled>Вимкнений dropdown</VButton>
          <template #dropdown>
            <VDropdownItem command="x1">Пункт 1</VDropdownItem>
          </template>
        </VDropdown>
      </DocPreview>
    </DocSection>

    <!-- ─── В таблиці ─── -->
    <DocSection title="Патерн: dropdown в таблиці">
      <DocCodeBlock
        :code="`<VDropdown @command=&quot;(cmd) => handleRowAction(cmd, row)&quot;>
  <VButton type=&quot;default&quot; icon=&quot;more&quot; shape=&quot;circle&quot; tooltip>
    Дії з рядком
  </VButton>
  <template #dropdown>
    <VDropdownItem command=&quot;edit&quot;>Редагувати</VDropdownItem>
    <VDropdownItem command=&quot;duplicate&quot;>Дублювати</VDropdownItem>
    <VDropdownItem command=&quot;delete&quot; divided :disabled=&quot;!row.canDelete&quot;>
      Видалити
    </VDropdownItem>
  </template>
</VDropdown>`"
        language="html"
      />
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🚀" title="Teleport в body">
        Меню рендериться через <code>Teleport</code> в <code>body</code> — немає конфліктів з
        <code>z-index</code> батьківських елементів.
      </DocFeature>
      <DocFeature icon="📐" title="Автоматична корекція позиції">
        При виході за межі viewport dropdown автоматично змінює сторону. Відстежує скрол батьківських елементів і
        приховується при виході тригера з видимості.
      </DocFeature>
      <DocFeature icon="🔗" title="Provide / Inject архітектура">
        <code>VDropdown</code> надає контекст дочірнім <code>VDropdownItem</code> через provide/inject — можна вкладати
        будь-який кастомний контент поряд з VDropdownItem.
      </DocFeature>
      <DocFeature icon="🎛️" title="Програмне управління">
        <code>ref.show()</code> / <code>ref.hide()</code> дозволяють відкривати меню програмно — з обробника події,
        composable або після async-операції.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .dropdown-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .event-log {
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #0c4a6e;
  }
</style>
