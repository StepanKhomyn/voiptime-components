<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { iconGroups } from '@/icon-groups';
  import type { GroupIconName, IconGroup } from '@/icon-groups';
  import VIcon from '@/components/icon/VIcon.vue';

  const GROUP_LABELS: Record<IconGroup, string> = {
    acd: 'ACD',
    actions: 'Дії',
    ai: 'AI',
    arrows: 'Стрілки',
    calendar: 'Календар і час',
    'call-quality': 'Якість дзвінків',
    chat: 'Чат',
    client: 'Клієнт',
    conversation: 'Розмова',
    field: 'Типи полів',
    files: 'Файли',
    filter: 'Фільтр',
    flags: 'Прапори',
    input: 'Інпути',
    itr: 'ITR',
    ivr: 'IVR',
    'left-menu': 'Ліве меню',
    mail: 'Пошта',
    media: 'Месенджери',
    message: 'Повідомлення',
    misc: 'Різне',
    'no-data': 'Немає даних',
    notification: 'Сповіщення',
    phone: 'Телефон',
    player: 'Плеєр',
    'right-menu': 'Праве меню',
    statistics: 'Статистика',
    status: 'Статус',
    table: 'Таблиця',
    tasks: 'Задачі',
    'text-editor': 'Текстовий редактор',
    users: 'Користувачі',
    widget: 'Віджет',
  };

  const SIZES = [16, 20, 24, 32, 48];

  const groupNames = Object.keys(iconGroups) as IconGroup[];

  const search = ref('');
  const activeGroup = ref<IconGroup | 'all'>('all');
  const color = ref('#00475a');
  const size = ref(24);
  const copyAsTag = ref(true);
  const copiedIcon = ref<GroupIconName | null>(null);

  const totalCount = computed(() => groupNames.reduce((sum, group) => sum + iconGroups[group].length, 0));

  const visibleGroups = computed(() => {
    const query = search.value
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_');
    const groups = activeGroup.value === 'all' ? groupNames : [activeGroup.value];

    return groups
      .map(group => ({
        group,
        icons: iconGroups[group].filter(name => !query || name.includes(query)),
      }))
      .filter(({ icons }) => icons.length);
  });

  const foundCount = computed(() => visibleGroups.value.reduce((sum, { icons }) => sum + icons.length, 0));

  async function copyIcon(name: GroupIconName) {
    const text = copyAsTag.value ? `<VIcon name="${name}" />` : name;
    try {
      await navigator.clipboard.writeText(text);
      copiedIcon.value = name;
      setTimeout(() => {
        if (copiedIcon.value === name) copiedIcon.value = null;
      }, 1500);
    } catch (err) {
      console.error('Не вдалося скопіювати:', err);
    }
  }

  const exampleCode = `<template>
  <!-- Назва = префікс групи + назва іконки -->
  <VIcon name="left_menu_crm" />

  <!-- Розмір -->
  <VIcon name="phone_hangup" :width="24" :height="24" />

  <!-- Колір (усі іконки, окрім багатоколірних, використовують currentColor) -->
  <VIcon name="filter_save" color="#a82525" />

  <!-- Старі назви (src/icons) теж працюють, але вони deprecated -->
  <VIcon name="arrowDown" />
</template>`;
</script>

<template>
  <div class="icon-groups-demo">
    <aside class="groups-nav">
      <button :class="{ active: activeGroup === 'all' }" class="group-link" @click="activeGroup = 'all'">
        <span>Усі групи</span>
        <span class="count">{{ totalCount }}</span>
      </button>
      <button
        v-for="group in groupNames"
        :key="group"
        :class="{ active: activeGroup === group }"
        class="group-link"
        @click="activeGroup = group"
      >
        <span>{{ GROUP_LABELS[group] ?? group }}</span>
        <span class="count">{{ iconGroups[group].length }}</span>
      </button>
    </aside>

    <main class="content">
      <div class="toolbar">
        <input v-model="search" class="search" placeholder="Пошук іконки: crm, phone_hangup..." type="search" />

        <label class="control">
          Колір
          <input v-model="color" type="color" />
        </label>

        <label class="control">
          Розмір
          <select v-model.number="size">
            <option v-for="option in SIZES" :key="option" :value="option">{{ option }}px</option>
          </select>
        </label>

        <label class="control">
          <input v-model="copyAsTag" type="checkbox" />
          Копіювати як &lt;VIcon /&gt;
        </label>
      </div>

      <div class="summary">Знайдено: {{ foundCount }}</div>

      <section v-for="{ group, icons } in visibleGroups" :key="group" class="group-section">
        <h3 class="group-title">
          {{ GROUP_LABELS[group] ?? group }}
          <code>src/icon-groups/{{ group }}</code>
        </h3>

        <div class="icons-grid">
          <button
            v-for="name in icons"
            :key="name"
            :class="{ copied: copiedIcon === name }"
            :title="`Клікніть для копіювання: ${name}`"
            class="icon-item"
            @click="copyIcon(name)"
          >
            <span class="icon-wrapper" :style="{ minHeight: `${size}px` }">
              <VIcon :color="color" :height="size" :name="name" :width="size" />
            </span>
            <span class="icon-name">{{ copiedIcon === name ? '✓ Скопійовано' : name }}</span>
          </button>
        </div>
      </section>

      <div v-if="!foundCount" class="empty">Нічого не знайдено</div>

      <div class="documentation">
        <h3>Використання</h3>
        <pre class="code-example"><code>{{ exampleCode }}</code></pre>
        <p>
          Іконки імпортуються з Figma командою <code>npm run fetch-icons</code>. Групи та перейменування налаштовуються
          у <code>scripts/icon-groups.config.cjs</code>, після зміни конфігу без звернення до Figma:
          <code>npm run fetch-icons:offline</code>.
        </p>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
  .icon-groups-demo {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem;
    font-family: var(--font-secondary, 'Roboto', sans-serif);
  }

  .groups-nav {
    position: sticky;
    top: 1rem;
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
  }

  .group-link {
    display: flex;
    justify-content: space-between;
    padding: 0.45rem 0.75rem;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #2c3e50;
    font: inherit;
    font-size: 0.9rem;
    text-align: left;
    cursor: pointer;

    &:hover {
      background: #f1f3f4;
    }

    &.active {
      background: var(--color-primary-light, #e6eef1);
      color: var(--color-primary-main, #00475a);
      font-weight: 600;
    }

    .count {
      color: #95a5a6;
      font-size: 0.8rem;
    }
  }

  .toolbar {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    background: #fff;
  }

  .search {
    flex: 1;
    min-width: 220px;
    padding: 0.5rem 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font: inherit;

    &:focus {
      outline: none;
      border-color: var(--color-primary-main, #00475a);
    }
  }

  .control {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    color: #495057;
  }

  .summary {
    margin-bottom: 1rem;
    color: #95a5a6;
    font-size: 0.85rem;
  }

  .group-section {
    margin-bottom: 2rem;
  }

  .group-title {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    color: #2c3e50;
    font-size: 1.1rem;

    code {
      color: #95a5a6;
      font-size: 0.75rem;
      font-weight: 400;
    }
  }

  .icons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 0.5rem;
    border: 1px solid #ecf0f1;
    border-radius: 8px;
    background: #fff;
    font: inherit;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--color-primary-main, #00475a);
      box-shadow: 0 2px 8px rgba(0, 71, 90, 0.12);
    }

    &.copied {
      border-color: #27ae60;
      background-color: #d5f4e6;
    }
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-name {
    color: #2c3e50;
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    text-align: center;
    word-break: break-all;
  }

  .empty {
    padding: 3rem;
    color: #95a5a6;
    text-align: center;
  }

  .documentation {
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: 12px;
    background: #f8f9fa;
    color: #495057;

    h3 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }

    code {
      padding: 0.1rem 0.3rem;
      border-radius: 4px;
      background: #e9ecef;
      font-size: 0.85rem;
    }
  }

  .code-example {
    padding: 1rem;
    border-radius: 8px;
    background: #2d3748;
    color: #e2e8f0;
    font-size: 0.85rem;
    overflow-x: auto;

    code {
      padding: 0;
      background: none;
    }
  }

  @media (max-width: 768px) {
    .icon-groups-demo {
      grid-template-columns: 1fr;
      padding: 1rem;
    }

    .groups-nav {
      position: static;
      flex-direction: row;
      flex-wrap: wrap;
      max-height: none;
    }

    .icons-grid {
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    }
  }
</style>
