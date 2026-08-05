<script lang="ts" setup>
  import { ref } from 'vue';
  import VBadge from '@/components/badge/VBadge.vue';
  import VButton from '@/components/button/VButton.vue';
  import VAvatar from '@/components/avatar/VAvatar.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  const badgeColors = ['primary', 'yellow', 'success', 'warning', 'danger', 'gray'] as const;
  const positions = ['top-end', 'top-start', 'bottom-end', 'bottom-start'] as const;

  const unreadCount = ref(5);

  function incrementCount() {
    unreadCount.value++;
  }

  function resetCount() {
    unreadCount.value = 0;
  }

  // --- Документація ---
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'content',
          type: 'number | string',
          default: 'undefined',
          description: 'Вміст бейджа. Якщо число ≤ 0 або не задано — бейдж не рендериться',
        },
        { name: 'max', type: 'number', default: '99', description: 'Максимальне число перед обрізанням у "99+"' },
        { name: 'dot', type: 'boolean', default: 'false', description: 'Режим маленької крапки без вмісту' },
        {
          name: 'color',
          type: "'primary' | 'yellow' | 'success' | 'warning' | 'danger' | 'gray'",
          default: "'danger'",
          description: 'Кольорова схема бейджа',
        },
        {
          name: 'position',
          type: "'top-end' | 'top-start' | 'bottom-end' | 'bottom-start'",
          default: "'top-end'",
          description: 'Кут прив\'язки відносно вмісту слоту',
        },
        { name: 'offsetX', type: 'number', default: '0', description: 'Додатковий зсув по X, px' },
        { name: 'offsetY', type: 'number', default: '0', description: 'Додатковий зсув по Y, px' },
        { name: 'bordered', type: 'boolean', default: 'false', description: 'Біла обвідка навколо бейджа' },
        { name: 'hidden', type: 'boolean', default: 'false', description: 'Примусово приховати бейдж' },
      ],
    },
    {
      title: 'Slots',
      rows: [{ name: 'default', type: '—', description: 'Вміст, відносно якого позиціонується бейдж' }],
    },
  ];
</script>

<template>
  <div class="badge-showcase">
    <!-- ─── Кольори ─── -->
    <DocSection title="Кольорові варіанти">
      <DocPreview>
        <VBadge v-for="c in badgeColors" :key="c" :content="8" :color="c">
          <VButton type="default" shape="circle" icon="notification" />
        </VBadge>
      </DocPreview>
    </DocSection>

    <!-- ─── Обрізання числа ─── -->
    <DocSection description="Число понад max відображається як 'max+'" title="Максимальне значення">
      <DocPreview>
        <VBadge :content="42">
          <VButton type="default" shape="circle" icon="mail" />
        </VBadge>
        <VBadge :content="164">
          <VButton type="default" shape="circle" icon="mail" />
        </VBadge>
        <VBadge :content="1200" :max="999">
          <VButton type="default" shape="circle" icon="mail" />
        </VBadge>
      </DocPreview>
    </DocSection>

    <!-- ─── Dot режим ─── -->
    <DocSection description="Крапка-індикатор без конкретного числа" title="Dot-режим">
      <DocPreview>
        <VBadge dot color="success">
          <VAvatar first-name="Олег" last-name="Ковальчук" />
        </VBadge>
        <VBadge dot color="danger">
          <VAvatar first-name="Марія" last-name="Петренко" />
        </VBadge>
        <VBadge dot color="yellow">
          <VButton type="default" shape="circle" icon="notification" />
        </VBadge>
      </DocPreview>
    </DocSection>

    <!-- ─── Позиції ─── -->
    <DocSection title="Позиції">
      <DocPreview>
        <VBadge v-for="p in positions" :key="p" :content="3" :position="p">
          <div class="badge-showcase__box">{{ p }}</div>
        </VBadge>
      </DocPreview>
    </DocSection>

    <!-- ─── Bordered ─── -->
    <DocSection description="Біла обвідка додає контраст на фото та іконках" title="Обвідка (bordered)">
      <DocPreview>
        <VBadge dot color="success" bordered>
          <VAvatar :size="48" first-name="Олег" last-name="Ковальчук" />
        </VBadge>
        <VBadge :content="3" bordered>
          <VAvatar :size="48" first-name="Іван" last-name="Шевченко" />
        </VBadge>
      </DocPreview>
    </DocSection>

    <!-- ─── Реактивний приклад ─── -->
    <DocSection description="Бейдж автоматично зникає при content = 0" title="Реактивне оновлення">
      <DocPreview
        :script="`const unreadCount = ref(5)
function incrementCount() { unreadCount.value++ }
function resetCount() { unreadCount.value = 0 }`"
      >
        <div class="badge-showcase__row">
          <VBadge :content="unreadCount">
            <VButton type="default" shape="circle" icon="chat" />
          </VBadge>
          <VButton type="primary" @click="incrementCount">+1</VButton>
          <VButton type="default" @click="resetCount">Скинути</VButton>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🎯" title="Прив'язка до будь-якого вмісту">
        VBadge обгортає слот і сам позиціонує себе в потрібному куті — не треба вручну задавати
        <code>position: relative</code> батьківському елементу.
      </DocFeature>
      <DocFeature icon="🔢" title="Автоматичне обрізання чисел">
        Значення понад <code>max</code> (за замовчуванням 99) показуються як <code>"99+"</code>.
      </DocFeature>
      <DocFeature icon="👁️" title="Авто-приховування">
        Якщо <code>content</code> — число ≤ 0, бейдж автоматично зникає без потреби вручну керувати
        <code>v-if</code> зовні.
      </DocFeature>
      <DocFeature icon="🎨" title="Палітра бібліотеки">
        6 кольорових варіантів (<code>primary</code>, <code>yellow</code>, <code>success</code>,
        <code>warning</code>, <code>danger</code>, <code>gray</code>) відповідають CSS-змінним дизайн-системи.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .badge-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;

    &__row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 48px;
      border-radius: 8px;
      background: var(--color-gray-6);
      color: var(--color-gray-2);
      font-size: 11px;
    }
  }
</style>