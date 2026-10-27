<script lang="ts" setup>
  import { ref } from 'vue';
  import VTag from '@/components/tag/VTag.vue';
  import { TAG_PRESET_COLORS } from '@/components/tag/types';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  const sizes = ['sm', 'md', 'lg'] as const;
  const variants = ['soft', 'outline', 'solid'] as const;
  const customColors = ['#8B5CF6', '#0EA5E9', 'rgb(20, 150, 120)', '#F97316', '#FACC15', 'hotpink'];

  const containerWidth = ref(260);

  const tags = ref(['Вхідний', 'Вихідний', 'Пропущений', 'Callback']);
  const removeTag = (tag: string) => (tags.value = tags.value.filter(t => t !== tag));
  const resetTags = () => (tags.value = ['Вхідний', 'Вихідний', 'Пропущений', 'Callback']);

  const clicks = ref(0);

  // --- Документація ---
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        { name: 'label', type: 'string | number', default: 'undefined', description: 'Текст тега (або default-слот)' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Розмір: 20 / 24 / 28 px' },
        {
          name: 'color',
          type: `${TAG_PRESET_COLORS.map(c => `'${c}'`).join(' | ')} | string`,
          default: "'primary'",
          description:
            'Пресет палітри або будь-який CSS-колір — він стає основним, напівпрозорий фон, бордер і читабельний текст виводяться автоматично',
        },
        { name: 'variant', type: "'soft' | 'outline' | 'solid'", default: "'soft'", description: 'Стиль заливки' },
        {
          name: 'prefixIcon',
          type: 'IconName',
          default: 'undefined',
          description: 'Іконка перед текстом (або слот #prefix)',
        },
        {
          name: 'suffixIcon',
          type: 'IconName',
          default: 'undefined',
          description: 'Іконка після тексту (або слот #suffix)',
        },
        { name: 'dot', type: 'boolean', default: 'false', description: 'Кольорова крапка-статус перед текстом' },
        { name: 'closable', type: 'boolean', default: 'false', description: 'Кнопка закриття, емітить close' },
        {
          name: 'clickable',
          type: 'boolean',
          default: 'false',
          description: 'Ховер/фокус-стани, Enter/Space емітять click',
        },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Неактивний стан' },
        {
          name: 'maxWidth',
          type: 'number | string',
          default: 'undefined',
          description: 'Максимальна ширина (число — px)',
        },
        { name: 'tooltip', type: 'string', default: 'undefined', description: 'Власний тултіп — показується завжди' },
        {
          name: 'tooltipOnOverflow',
          type: 'boolean',
          default: 'true',
          description: 'Показувати повний текст у тултіпі, якщо він обрізаний (…)',
        },
        {
          name: 'tooltipPlacement',
          type: "'top' | 'bottom' | 'left' | 'right'",
          default: "'top'",
          description: 'Позиція тултіпа',
        },
        {
          name: 'collapsible',
          type: 'boolean',
          default: 'true',
          description: 'Коли місця зовсім мало — лишається тільки іконка/крапка, текст у тултіпі',
        },
        {
          name: 'minLabelWidth',
          type: 'number',
          default: '32',
          description: 'Мінімальна видима ширина тексту (px), нижче якої тег згортається до іконки',
        },
      ],
    },
    {
      title: 'Events',
      rows: [
        {
          name: 'click',
          type: '(event: MouseEvent | KeyboardEvent)',
          description: 'Клік по тегу (не емітиться у disabled)',
        },
        { name: 'close', type: '(event: MouseEvent)', description: 'Клік по хрестику (closable)' },
      ],
    },
    {
      title: 'Slots',
      rows: [
        { name: 'default', description: 'Текст тега' },
        { name: 'prefix', description: 'Довільний вміст перед текстом (замість prefixIcon)' },
        { name: 'suffix', description: 'Довільний вміст після тексту (замість suffixIcon)' },
      ],
    },
  ];
</script>

<template>
  <div class="tag-showcase">
    <!-- ─── Кольори ─── -->
    <DocSection description="Палітри дизайн-системи" title="Кольори">
      <DocPreview>
        <VTag v-for="c in TAG_PRESET_COLORS" :key="c" :color="c" :label="c" />
      </DocPreview>
    </DocSection>

    <DocSection
      description="Будь-який CSS-колір стає основним: фон і бордер — напівпрозорі від нього, текст автоматично затемнюється, якщо колір надто світлий для читання, а на solid підбирається білий чи темний текст"
      title="Довільний колір"
    >
      <DocPreview>
        <div v-for="v in variants" :key="v" class="tag-showcase__row">
          <VTag v-for="c in customColors" :key="c" :color="c" :label="c" :variant="v" />
        </div>
      </DocPreview>

      <DocPreview>
        <VTag color="var(--color-status-talking)" dot label="Розмовляє" />
        <VTag color="var(--color-status-working)" dot label="Працює" />
        <VTag color="var(--color-status-in-process)" dot label="В обробці" variant="solid" />
      </DocPreview>

      <DocPreview>
        <div class="tag-showcase__tinted">
          <VTag color="#8B5CF6" label="Напівпрозорий фон" prefix-icon="actions_star" />
          <VTag color="tomato" dot label="лягає на будь-яку підкладку" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Варіанти ─── -->
    <DocSection title="Варіанти">
      <DocPreview>
        <div v-for="v in variants" :key="v" class="tag-showcase__row">
          <VTag :variant="v" color="primary" :label="v" />
          <VTag :variant="v" color="success" label="Оплачено" prefix-icon="chat_check" />
          <VTag :variant="v" color="warning" dot label="Очікує" />
          <VTag :variant="v" color="danger" closable label="Видалити" />
          <VTag :variant="v" color="#8B5CF6" label="Premium" prefix-icon="actions_star" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Розміри ─── -->
    <DocSection title="Розміри">
      <DocPreview>
        <VTag v-for="s in sizes" :key="s" :label="`Tag ${s}`" :size="s" prefix-icon="users_user" />
      </DocPreview>
    </DocSection>

    <!-- ─── Іконки ─── -->
    <DocSection description="Іконки з бібліотеки або будь-який вміст через слоти" title="Prefix / suffix">
      <DocPreview>
        <VTag color="success" label="Оплачено" prefix-icon="chat_check" />
        <VTag color="yellow" label="В очікуванні" prefix-icon="ivr_clock" />
        <VTag color="success" label="12.4%" prefix-icon="arrows_top" />
        <VTag color="#8B5CF6" label="Premium" prefix-icon="actions_star" size="lg" suffix-icon="arrows_down" />
        <VTag color="primary" label="Україна">
          <template #prefix>🇺🇦</template>
        </VTag>
        <VTag color="gray" label="+380 67 123 45 67" prefix-icon="phone_phone" />
      </DocPreview>
    </DocSection>

    <!-- ─── Dot ─── -->
    <DocSection title="Крапка-статус">
      <DocPreview>
        <VTag color="success" dot label="Онлайн" />
        <VTag color="danger" dot label="Зайнятий" />
        <VTag color="gray" dot label="Офлайн" />
        <VTag color="warning" dot label="На перевірці" size="lg" />
      </DocPreview>
    </DocSection>

    <!-- ─── Overflow ─── -->
    <DocSection
      description="Текст, що не влазить, обрізається з … і показується в тултіпі. Коли місця зовсім мало — лишається тільки іконка з тултіпом. Тягніть повзунок"
      title="Переповнення"
    >
      <DocPreview>
        <div class="tag-showcase__overflow">
          <label class="tag-showcase__range">
            Ширина контейнера: {{ containerWidth }}px
            <input v-model.number="containerWidth" max="400" min="20" type="range" />
          </label>

          <div :style="{ width: `${containerWidth}px` }" class="tag-showcase__box">
            <VTag color="primary" label="Оператор Олександр Коваленко-Петренко" prefix-icon="users_user" />
          </div>
          <div :style="{ width: `${containerWidth}px` }" class="tag-showcase__box">
            <VTag color="success" dot label="Доступний для вхідних дзвінків" />
          </div>
          <div :style="{ width: `${containerWidth}px` }" class="tag-showcase__box">
            <VTag color="danger" label="Без іконки — тільки обрізання тексту з тултіпом" />
          </div>
        </div>
      </DocPreview>

      <DocPreview>
        <VTag :max-width="140" color="var(--color-status-talking)" label="Обмеження через maxWidth без контейнера" />
        <VTag color="gray" label="Власний тултіп" tooltip="Показується завжди, незалежно від ширини" />
      </DocPreview>
    </DocSection>

    <!-- ─── Інтерактивність ─── -->
    <DocSection title="Closable / clickable / disabled">
      <DocPreview
        :script="`const tags = ref(['Вхідний', 'Вихідний', 'Пропущений', 'Callback'])
const removeTag = tag => (tags.value = tags.value.filter(t => t !== tag))`"
      >
        <VTag v-for="tag in tags" :key="tag" :label="tag" closable color="primary" @close="removeTag(tag)" />
        <button v-if="!tags.length" class="tag-showcase__reset" @click="resetTags">Повернути</button>
      </DocPreview>

      <DocPreview>
        <VTag :label="`Клікнуто: ${clicks}`" clickable color="#8B5CF6" @click="clicks++" />
        <VTag clickable label="Solid clickable" variant="solid" @click="clicks++" />
        <VTag closable disabled label="Disabled" prefix-icon="actions_lock" />
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🎨" title="Один колір — усі відтінки">
        Пресети <code>primary</code>, <code>success</code>, <code>warning</code>, <code>danger</code>,
        <code>yellow</code>, <code>gray</code> беруть токени дизайн-системи. Довільний колір (hex, rgb, назва,
        <code>var(--...)</code>) стає основним, фон і бордер — напівпрозорі від нього.
      </DocFeature>
      <DocFeature icon="👁️" title="Читабельність за контрастом">
        Якщо власний колір надто світлий, текст на м'якому фоні затемнюється до контрасту WCAG AA (4.5:1), а на
        <code>solid</code> автоматично обирається білий або темний текст.
      </DocFeature>
      <DocFeature icon="✂️" title="Розумне переповнення">
        Обрізаний текст автоматично показується в тултіпі. Якщо видима частина тексту менша за
        <code>minLabelWidth</code>, тег згортається до іконки чи крапки й розгортається назад, коли місця стає
        достатньо.
      </DocFeature>
      <DocFeature icon="🔲" title="Радіус дизайн-системи">
        Кути беруться з <code>--radius-main</code> (5px), як у решти компонентів бібліотеки.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .tag-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;

    &__row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    &__overflow {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    &__range {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-width: 400px;
      color: var(--color-gray-2);
      font-size: 12px;
    }

    &__box {
      display: flex;
      padding: 6px;
      border: 1px dashed var(--color-gray-4);
      border-radius: var(--radius-main);
      box-sizing: border-box;
    }

    &__tinted {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px;
      border-radius: var(--radius-main);
      background: linear-gradient(90deg, var(--color-primary-main), var(--color-yellow-bg));
    }

    &__reset {
      padding: 4px 10px;
      border: 1px solid var(--color-gray-5);
      border-radius: var(--radius-main);
      background: var(--color-white);
      cursor: pointer;
    }
  }
</style>
