<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import VNavRail from '@/components/nav-rail/VNavRail.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import type { VNavRailItem } from '@/components/nav-rail/types';

  // ─── Базовий приклад ───
  const activeTab = ref<string>('stats');

  const items = computed<VNavRailItem[]>(() => [
    { key: 'stats', icon: 'notification', label: 'Статистика' },
    { key: 'chats', icon: 'inboundCall', label: 'Розмови' },
    { key: 'contacts', icon: 'scenarioCall', label: 'Телефонна книга' },
    { key: 'settings', icon: 'settings', label: 'Налаштування' },
  ]);

  // ─── Беджі ───
  const activeTabWithBadges = ref<string>('chats');

  const itemsWithBadges = computed<VNavRailItem[]>(() => [
    { key: 'chats', icon: 'notification', label: 'Розмови', badge: { content: 4, position: 'top-start' } },
    { key: 'mails', icon: 'inboundCall', label: 'Пошта', badge: { content: '99+', position: 'top-start' } },
    { key: 'notifications', icon: 'statsDiagramPie', label: 'Сповіщення', badge: { content: 2, position: 'top-end' } },
  ]);

  // ─── Disabled айтем ───
  const activeTabDisabled = ref<string>('stats');

  const itemsWithDisabled = computed<VNavRailItem[]>(() => [
    { key: 'stats', icon: 'statsDiagramPie', label: 'Статистика' },
    { key: 'scenario', icon: 'diamondInSquare', label: 'Сценарій (недоступно під час дзвінка)', disabled: true },
    { key: 'settings', icon: 'settings', label: 'Налаштування' },
  ]);

  // ─── Footer slot ───
  const activeTabWithFooter = ref<string>('stats');

  const itemsForFooter = computed<VNavRailItem[]>(() => [
    { key: 'stats', icon: 'calendar', label: 'Статистика' },
    { key: 'chats', icon: 'chatDabble', label: 'Розмови' },
  ]);

  // ─── Лог обраних айтемів (для демонстрації @select) ───
  const selectionLog = ref<string[]>([]);

  const handleSelect = (item: VNavRailItem) => {
    selectionLog.value.unshift(`Обрано: ${item.label}`);
    if (selectionLog.value.length > 5) selectionLog.value.pop();
  };

  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        { name: 'items', type: 'VNavRailItem<T>[]', default: '—', description: 'Масив пунктів навігації' },
        {
          name: 'modelValue',
          type: 'T | null',
          default: 'null',
          description: 'Активний пункт (v-model), керується консьюмером',
        },
        {
          name: 'placement',
          type: "'left' | 'right'",
          default: "'left'",
          description: 'Сторона панелі — впливає на data-placement для tooltip',
        },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'update:modelValue', type: 'T', description: 'Зміна активного пункту (v-model)' },
        { name: 'select', type: 'VNavRailItem<T>', description: 'Клік по пункту — для побічних ефектів (роутинг, layout)' },
      ],
    },
    {
      title: 'Slots',
      rows: [{ name: 'footer', type: '—', description: 'Довільний контент внизу панелі (напр. кнопка телефону)' }],
    },
  ];

  const typesSections: TableSection[] = [
    {
      title: 'VNavRailItem<T>',
      rows: [
        { name: 'key', type: 'T', description: 'Унікальний ключ пункту, типізується консьюмером' },
        { name: 'icon', type: 'string', description: "Назва іконки з вашого реєстру VIcon" },
        { name: 'label', type: 'string', description: 'Вже перекладений текст для tooltip' },
        { name: 'disabled', type: 'boolean', description: 'Заблокований, не клікабельний стан' },
        { name: 'badge', type: 'NavRailBadge | null', description: 'Опційний бедж поверх іконки' },
      ],
    },
    {
      title: 'NavRailBadge',
      rows: [
        { name: 'content', type: 'string | number', description: 'Вміст беджа' },
        {
          name: 'position',
          type: "'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'",
          description: 'Позиція беджа відносно іконки',
        },
      ],
    },
  ];
</script>

<template>
  <div class="nav-rail-showcase">
    <!-- ─── Базове використання ─── -->
    <DocSection title="Базове використання" description="Контрольований компонент — активний пункт живе у вашому сторі">
      <DocPreview>
        <div style="height: 260px; display: flex; justify-content: flex-end">
          <VNavRail v-model="activeTab" :items="items" @select="handleSelect" />
        </div>
        <p class="hint-text">Активна вкладка: <strong>{{ activeTab }}</strong></p>
      </DocPreview>
    </DocSection>

    <!-- ─── Беджі ─── -->
    <DocSection title="Беджі" description="Бедж передається як частина айтема — компонент сам вирішує коли рендерити VBadge">
      <DocPreview>
        <div style="height: 220px; display: flex; justify-content: flex-end">
          <VNavRail v-model="activeTabWithBadges" :items="itemsWithBadges" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Disabled айтем ─── -->
    <DocSection title="Disabled айтем" description="Клік ігнорується, стан позначається класом vt-nav-rail__item--disabled">
      <DocPreview>
        <div style="height: 220px; display: flex; justify-content: flex-end">
          <VNavRail v-model="activeTabDisabled" :items="itemsWithDisabled" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Footer slot ─── -->
    <DocSection title="Footer slot" description="Довільний контент знизу — наприклад кнопка телефону в КЦ">
      <DocPreview>
        <div style="height: 300px; display: flex; justify-content: flex-end">
          <VNavRail v-model="activeTabWithFooter" :items="itemsForFooter">
            <template #footer>
              <button class="demo-phone-btn" title="Кнопка телефону (приклад)">☎</button>
            </template>
          </VNavRail>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Обробка select ─── -->
    <DocSection title="Обробка @select" description="select спрацьовує до зміни modelValue — зручно для побічних ефектів">
      <DocPreview>
        <div style="height: 220px; display: flex; justify-content: flex-end">
          <VNavRail v-model="activeTab" :items="items" @select="handleSelect" />
        </div>
        <div v-if="selectionLog.length" class="log-list">
          <div v-for="(entry, i) in selectionLog" :key="i" class="log-item">{{ entry }}</div>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Типи ─── -->
    <DocSection title="TypeScript типи">
      <DocPropsTable :sections="typesSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature title="Контрольований компонент" icon="🎛️">
        Активний пункт не зберігається всередині — це <code>v-model</code>. Стан і надалі живе у вашому Pinia-сторі,
        компонент лише відображає й емітить зміни.
      </DocFeature>
      <DocFeature title="Нуль бізнес-логіки застосунку" icon="🧩">
        Компонент нічого не знає про роути, i18n чи ролі користувача. Формування <code>items</code> (фільтрація,
        переклад, мапінг з роутів) — відповідальність консьюмера.
      </DocFeature>
      <DocFeature title="select vs update:modelValue" icon="🔀">
        <code>@select</code> віддає повний <code>VNavRailItem</code> ще до зміни активної вкладки — зручно, коли клік
        має додатковий ефект (наприклад зміна <code>layoutRightPanelView</code>), а не лише перемикання табу.
      </DocFeature>
      <DocFeature title="Generic ключі" icon="🏷️">
        <code>VNavRailItem&lt;T&gt;</code> типізується вашим enum'ом табів — <code>v-model</code> і <code>@select</code>
        повертають строго типізований <code>T</code>, без <code>any</code>.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style scoped lang="scss">
  .nav-rail-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .hint-text {
    margin-top: 0.75rem;
    font-size: 0.85rem;
    color: #475569;
  }

  .demo-phone-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #52963a;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
  }

  .log-list {
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .log-item {
    padding: 0.5rem 0.75rem;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #0c4a6e;
  }
</style>