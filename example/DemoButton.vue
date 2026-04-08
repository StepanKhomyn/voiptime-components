<script lang="ts" setup>
  import { ref } from 'vue';
  import VButton from '@/components/button/VButton.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import { icons } from '@/icons';

  const loadingButtons = ref<Set<string>>(new Set());

  const buttonTypes = ['default', 'primary', 'success', 'danger', 'warning', 'info'] as const;
  const iconNames = Object.keys(icons).slice(0, 6);

  function simulateLoading(id: string) {
    loadingButtons.value.add(id);
    setTimeout(() => loadingButtons.value.delete(id), 2000);
  }

  // --- Документація ---
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'type',
          type: "'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info'",
          default: "'default'",
          description: 'Тип кнопки — визначає кольорову схему',
        },
        {
          name: 'shape',
          type: "'circle' | 'square'",
          default: 'undefined',
          description: 'Форма іконка-кнопки. Приховує текст, показує тільки іконку',
        },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований стан' },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Стан завантаження — показує лоадер, блокує кліки',
        },
        { name: 'icon', type: 'IconName', default: 'undefined', description: 'Назва іконки' },
        {
          name: 'tooltip',
          type: 'boolean',
          default: 'false',
          description: 'Показувати тултіп для іконка-кнопок (текст береться зі слоту)',
        },
        { name: 'tooltipPlacement', type: 'TooltipPlacement', default: "'top'", description: 'Розташування тултіпу' },
        {
          name: 'htmlType',
          type: "'button' | 'submit' | 'reset'",
          default: "'button'",
          description: 'HTML атрибут type для <button>',
        },
        { name: 'color', type: 'string', default: "'#FFFFFF'", description: 'Колір вмісту кнопки (текст + іконка)' },
      ],
    },
    {
      title: 'Events',
      rows: [{ name: 'click', type: 'MouseEvent', description: 'Клік — не спрацьовує якщо disabled або loading' }],
    },
  ];
</script>

<template>
  <div class="button-showcase">
    <!-- ─── Типи ─── -->
    <DocSection title="Типи кнопок">
      <DocPreview>
        <VButton v-for="t in buttonTypes" :key="t" :type="t">{{ t }}</VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── Disabled ─── -->
    <DocSection title="Заблоковані стани">
      <DocPreview>
        <VButton v-for="t in buttonTypes" :key="t" :type="t" disabled>{{ t }}</VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── Loading ─── -->
    <DocSection description="Натисніть кнопку, щоб побачити лоадер на 2 секунди" title="Стани завантаження">
      <DocPreview
        :script="`const loadingButtons = ref(new Set())
  function simulateLoading(id) {
    loadingButtons.value.add(id)
    setTimeout(() => loadingButtons.value.delete(id), 2000)
 }`"
      >
        <VButton
          v-for="t in buttonTypes"
          :key="t"
          :loading="loadingButtons.has(`demo-${t}`)"
          :type="t"
          @click="simulateLoading(`demo-${t}`)"
        >
          {{ t }}
        </VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── З іконками ─── -->
    <DocSection title="Кнопки з іконками">
      <DocPreview>
        <VButton
          v-for="(iconName, i) in iconNames"
          :key="iconName"
          :icon="iconName"
          :type="buttonTypes[i % buttonTypes.length]"
        >
          {{ iconName }}
        </VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── Круглі іконка-кнопки ─── -->
    <DocSection description='shape="circle" + tooltip показує текст зі слоту' title="Іконка-кнопки (круглі)">
      <DocPreview>
        <VButton v-for="(t, i) in buttonTypes" :key="t" :icon="iconNames[i]" :type="t" shape="circle" tooltip>
          {{ t }} action
        </VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── Квадратні іконка-кнопки ─── -->
    <DocSection title="Іконка-кнопки (квадратні)">
      <DocPreview>
        <VButton v-for="(t, i) in buttonTypes" :key="t" :icon="iconNames[i]" :type="t" shape="square" tooltip>
          {{ t }} action
        </VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомний колір ─── -->
    <DocSection title="Кастомний колір вмісту">
      <DocPreview>
        <VButton color="#e74c3c" type="default">Червоний текст</VButton>
        <VButton color="#27ae60" type="default">Зелений текст</VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🔘" title="Іконка-кнопки">
        Коли вказано <code>icon</code> + <code>shape</code> — текст зі слоту приховується і використовується тільки для
        <code>tooltip</code>.
      </DocFeature>
      <DocFeature icon="⏳" title="Автоматичне блокування під час завантаження">
        <code>:loading="true"</code> автоматично ставить <code>disabled</code> і показує спінер замість іконки.
        Повторний клік неможливий.
      </DocFeature>
      <DocFeature icon="📋" title="htmlType для форм">
        За замовчуванням <code>htmlType="button"</code> — кнопка не сабмітить форму випадково. Передайте
        <code>htmlType="submit"</code> явно коли потрібно.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .button-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
