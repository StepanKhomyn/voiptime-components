<script lang="ts" setup>
  import { ref } from 'vue';
  import VAppBar from '@/components/app-bar/VAppBar.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  // ─── Динамічний центральний слот ───
  const activeSection = ref<'call' | 'chat' | null>(null);

  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        { name: 'sticky', type: 'boolean', default: 'false', description: 'position: sticky; top: 0' },
      ],
    },
    {
      title: 'Slots',
      rows: [
        { name: 'logo', type: '—', description: 'Лого зліва, завжди видиме' },
        { name: 'center', type: '—', description: 'Опційний центральний блок (напр. активний дзвінок)' },
        { name: 'actions', type: '—', description: 'Дії справа (профіль, кнопки користувача)' },
      ],
    },
  ];
</script>

<template>
  <div class="app-bar-showcase">
    <!-- ─── Базове використання ─── -->
    <DocSection title="Базове використання" description="Логотип + дії користувача, без центрального блоку">
      <DocPreview>
        <VAppBar>
          <template #logo>
            <div class="demo-logo">VOIPTIME</div>
          </template>
          <template #actions>
            <button class="demo-action-btn">🔔</button>
            <div class="demo-avatar">O</div>
          </template>
        </VAppBar>
      </DocPreview>
    </DocSection>

    <!-- ─── Центральний слот ─── -->
    <DocSection
      title="Центральний слот (center)"
      description="Рендериться лише якщо слот переданий — зручно для динамічного контенту типу активного дзвінка"
    >
      <DocPreview>
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
          <div class="demo-controls">
            <button class="demo-toggle" :class="{ active: activeSection === null }" @click="activeSection = null">
              Немає активності
            </button>
            <button class="demo-toggle" :class="{ active: activeSection === 'call' }" @click="activeSection = 'call'">
              Активний дзвінок
            </button>
            <button class="demo-toggle" :class="{ active: activeSection === 'chat' }" @click="activeSection = 'chat'">
              Активний чат
            </button>
          </div>

          <VAppBar>
            <template #logo>
              <div class="demo-logo">VOIPTIME</div>
            </template>
            <template v-if="activeSection" #center>
              <div class="demo-center-widget">
                {{ activeSection === 'call' ? '📞 Дзвінок з +380 XX XXX XX XX · 02:14' : '💬 Чат з клієнтом #4521' }}
              </div>
            </template>
            <template #actions>
              <div class="demo-avatar">O</div>
            </template>
          </VAppBar>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Sticky режим ─── -->
    <DocSection
      title="Sticky режим"
      description="При sticky панель лишається зверху вʼюпорта при скролі основного контенту"
    >
      <DocPreview>
        <VAppBar sticky>
          <template #logo>
            <div class="demo-logo">VOIPTIME</div>
          </template>
          <template #actions>
            <div class="demo-avatar">O</div>
          </template>
        </VAppBar>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature title="Slot-композиція замість пропсів" icon="🧩">
        Замість жорстких пропсів на кшталт <code>userName</code> чи <code>notificationsCount</code> — три слоти:
        <code>#logo</code>, <code>#center</code>, <code>#actions</code>. Компонент не знає про ролі, стори чи i18n.
      </DocFeature>
      <DocFeature title="center рендериться умовно" icon="👁️">
        Блок <code>#center</code> зʼявляється в DOM лише якщо слот переданий (<code>v-if="$slots.center"</code>) —
        не потрібно самому ховати обгортку через <code>v-if</code> ззовні.
      </DocFeature>
      <DocFeature title="Кастомізація через CSS-змінні" icon="🎨">
        Висота, фон і z-index керуються через <code>--vt-app-bar-height</code>, <code>--vt-app-bar-bg</code>,
        <code>--vt-app-bar-z-index</code> — можна перевизначити локально без правки бібліотеки.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style scoped lang="scss">
  .app-bar-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .demo-logo {
    color: #fff;
    font-weight: 700;
    letter-spacing: 0.05em;
    font-size: 1.1rem;
  }

  .demo-action-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    cursor: pointer;
  }

  .demo-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #fff;
    color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  .demo-center-widget {
    padding: 0.4rem 1rem;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 999px;
    color: #fff;
    font-size: 0.85rem;
  }

  .demo-controls {
    display: flex;
    gap: 0.5rem;
  }

  .demo-toggle {
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    background: #fff;
    cursor: pointer;
    font-size: 0.8rem;

    &.active {
      background: #0f172a;
      color: #fff;
      border-color: #0f172a;
    }
  }
</style>