<script lang="ts" setup>
  import VTransferList from '@/components/transfer-list/VTransferList.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import { ref } from 'vue';

  // ─── Базовий приклад ─────────────────────────────────────────────────────────

  const basicLeft = ref([
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'TypeScript' },
    { id: 3, name: 'Python' },
    { id: 4, name: 'Rust' },
    { id: 5, name: 'Go' },
    { id: 6, name: 'Go' },
    { id: 7, name: 'Go' },
    { id: 8, name: 'Go' },
    { id: 9, name: 'Go' },
    { id: 10, name: 'Go' },
    { id: 11, name: 'Go' },
    { id: 12, name: 'Go' },
    { id: 13, name: 'Go' },
    { id: 14, name: 'Go' },
    { id: 15, name: 'Go' },
    { id: 16, name: 'Go' },
    { id: 17, name: 'Go' },
    { id: 18, name: 'Go' },
    { id: 19, name: 'Go' },
  ]);
  const basicRight = ref([
    { id: 6, name: 'Vue' },
    { id: 7, name: 'React' },
  ]);

  // ─── З заголовками та плейсхолдерами ─────────────────────────────────────────

  const labeledLeft = ref([
    { id: 1, name: 'Анна Коваль' },
    { id: 2, name: 'Богдан Шевченко' },
    { id: 3, name: 'Галина Мельник' },
    { id: 4, name: 'Денис Бондаренко' },
  ]);
  const labeledRight = ref<{ id: number; name: string }[]>([]);

  // ─── Валідація (invalid state) ────────────────────────────────────────────────

  const validLeft = ref([
    { id: 1, name: 'Навичка A' },
    { id: 2, name: 'Навичка B' },
    { id: 3, name: 'Навичка C' },
  ]);
  const validRight = ref<{ id: number; name: string }[]>([]);
  const isValid = ref(true);
  const validate = () => { isValid.value = validRight.value.length > 0; };

  // ─── Кастомний слот item ──────────────────────────────────────────────────────

  const slotLeft = ref([
    { id: 1, name: 'Іванченко І.І.', role: 'Оператор' },
    { id: 2, name: 'Петренко П.П.', role: 'Менеджер' },
    { id: 3, name: 'Сидоренко С.С.', role: 'Супервайзер' },
  ]);
  const slotRight = ref<{ id: number; name: string; role: string }[]>([]);

  // ─── Фіксована висота ─────────────────────────────────────────────────────────

  const heightLeft = ref(
    Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `Елемент ${i + 1}` }))
  );
  const heightRight = ref<{ id: number; name: string }[]>([]);

  // ─── Transfer event лог ───────────────────────────────────────────────────────

  const eventLeft = ref([
    { id: 1, name: 'Подія A' },
    { id: 2, name: 'Подія B' },
    { id: 3, name: 'Подія C' },
  ]);
  const eventRight = ref<{ id: number; name: string }[]>([]);
  const eventLog = ref<string[]>([]);

  const onTransfer = (item: { id: number; name: string }, direction: 'left' | 'right') => {
    const arrow = direction === 'right' ? '→' : '←';
    eventLog.value.unshift(`${arrow} "${item.name}"`);
    if (eventLog.value.length > 5) eventLog.value.pop();
  };

  // ─── Документація ────────────────────────────────────────────────────────────

  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'optionLabel',
          type: 'keyof T',
          default: "'name'",
          description: "Ключ об'єкта для відображення тексту елемента",
        },
        {
          name: 'optionValue',
          type: 'keyof T',
          default: "'id'",
          description: "Ключ об'єкта для унікальної ідентифікації елемента",
        },
        {
          name: 'isValidRightContainer',
          type: 'boolean',
          default: 'true',
          description: 'Підсвічує правий список червоною рамкою при false',
        },
        {
          name: 'heightStyle',
          type: 'string',
          default: "''",
          description: 'Фіксована висота обох списків (наприклад "200px")',
        },
        {
          name: 'leftLabel',
          type: 'string',
          default: "''",
          description: 'Заголовок над лівим списком',
        },
        {
          name: 'rightLabel',
          type: 'string',
          default: "''",
          description: 'Заголовок над правим списком',
        },
        {
          name: 'leftPlaceholder',
          type: 'string',
          default: "''",
          description: 'Текст коли лівий список порожній',
        },
        {
          name: 'rightPlaceholder',
          type: 'string',
          default: "''",
          description: 'Текст коли правий список порожній',
        },
      ],
    },
    {
      title: 'Models',
      rows: [
        { name: 'listOne', type: 'T[]', description: 'v-model для лівого списку' },
        { name: 'listTwo', type: 'T[]', description: 'v-model для правого списку' },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'selectLeft', type: 'T', description: 'Клік на елемент лівого списку' },
        { name: 'selectRight', type: 'T', description: 'Клік на елемент правого списку' },
        {
          name: 'transfer',
          type: "T, direction: 'left' | 'right'",
          description: 'Переміщення будь-якого елемента — разом із напрямком',
        },
      ],
    },
    {
      title: 'Slots',
      rows: [
        { name: 'item', type: '{ item: T }', description: 'Кастомний рендер кожного рядка в обох списках' },
        { name: 'left-empty', type: '—', description: 'Контент коли лівий список порожній' },
        { name: 'right-empty', type: '—', description: 'Контент коли правий список порожній' },
      ],
    },
  ];
</script>

<template>
  <div class="transfer-list-showcase">

    <!-- ─── Базовий ─── -->
    <DocSection title="Базовий приклад">
      <DocPreview>
        <VTransferList
          v-model:list-one="basicLeft"
          v-model:list-two="basicRight"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Заголовки та плейсхолдери ─── -->
    <DocSection
      title="Заголовки та плейсхолдери"
      description="leftLabel / rightLabel додають підписи над списками. leftPlaceholder / rightPlaceholder — текст для порожнього стану"
    >
      <DocPreview>
        <VTransferList
          v-model:list-one="labeledLeft"
          v-model:list-two="labeledRight"
          left-label="Доступні"
          right-label="Призначені"
          right-placeholder="Перетягніть сюди або оберіть зі списку"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Invalid state ─── -->
    <DocSection
      title="Стан валідації"
      description="isValidRightContainer=false підсвічує правий список червоною рамкою — використовується разом з вашою логікою валідації форми"
    >
      <DocPreview>
        <VTransferList
          v-model:list-one="validLeft"
          v-model:list-two="validRight"
          left-label="Навички"
          right-label="Призначені навички"
          right-placeholder="Оберіть хоча б одну навичку"
          :is-valid-right-container="isValid"
        />
        <VButton type="primary" style="margin-top: 12px" @click="validate">
          Валідувати
        </VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомний слот item ─── -->
    <DocSection
      title="Кастомний слот #item"
      description="Слот item отримує { item } — можна рендерити будь-який контент замість plain тексту"
    >
      <DocPreview>
        <VTransferList
          v-model:list-one="slotLeft"
          v-model:list-two="slotRight"
          left-label="Співробітники"
          right-label="Команда"
        >
          <template #item="{ item }">
            <span style="display: flex; flex-direction: column; gap: 1px">
              <span>{{ item.name }}</span>
              <span style="font-size: 11px; opacity: 0.6">{{ item.role }}</span>
            </span>
          </template>
        </VTransferList>
      </DocPreview>
    </DocSection>

    <!-- ─── Фіксована висота ─── -->
    <DocSection
      title="Фіксована висота"
      description="heightStyle фіксує висоту обох списків — корисно коли елементів багато"
    >
      <DocPreview>
        <VTransferList
          v-model:list-one="heightLeft"
          v-model:list-two="heightRight"
          height-style="200px"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Transfer event ─── -->
    <DocSection
      title="Подія transfer"
      description="Кожне переміщення емітує transfer(item, direction) — зручно для відстеження змін або side-effects"
    >
      <DocPreview>
        <VTransferList
          v-model:list-one="eventLeft"
          v-model:list-two="eventRight"
          @transfer="onTransfer"
        />
        <div style="margin-top: 12px; font-size: 13px; color: var(--color-gray-3)">
          <div v-if="!eventLog.length" style="opacity: 0.5">Лог порожній — перемістіть елемент</div>
          <div v-for="(entry, i) in eventLog" :key="i">{{ entry }}</div>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Drag & Drop ─── -->
    <DocSection title="Drag & Drop">
      <DocFeature icon="🖱️" title="Перетягування елементів">
        Кожен елемент має атрибут <code>draggable</code> — його можна перетягнути між списками без кліку на стрілки.
        Працює в обох напрямках.
      </DocFeature>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🔀" title="Дженерік-типізація">
        Компонент оголошено як <code>generic="T extends Record&lt;string, any&gt;"</code> — типи списків та
        слотів виводяться автоматично без ручних кастів.
      </DocFeature>
      <DocFeature icon="✅" title="Дедублікація">
        При переміщенні перевіряється унікальність за <code>optionValue</code> — дублікати в список не потраплять
        навіть при швидкому drag & drop.
      </DocFeature>
      <DocFeature icon="⌨️" title="Кнопки керування">
        Чотири <code>VButton shape="square"</code> з тултіпами: перемістити вибраний елемент або всі одразу
        в обох напрямках. Кнопки автоматично блокуються коли переміщати нічого.
      </DocFeature>
    </DocSection>

  </div>
</template>

<style lang="scss" scoped>
  .transfer-list-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
  }
</style>