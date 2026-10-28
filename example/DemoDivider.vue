<script lang="ts" setup>
  import VDivider from '@/components/divider/VDivider.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';

  // --- Документація ---
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        { name: 'text', type: 'string | number', default: 'undefined', description: 'Текст підзаголовка' },
        {
          name: 'background',
          type: 'string',
          default: 'var(--color-primary-light)',
          description: 'Колір фону плашки з текстом',
        },
        {
          name: 'fontSize',
          type: 'number | string',
          default: '16',
          description: 'Розмір шрифту: число — у px, рядок — як є',
        },
        { name: 'color', type: 'string', default: 'var(--color-primary-main)', description: 'Колір тексту' },
        { name: 'lineColor', type: 'string', default: 'var(--color-primary-border)', description: 'Колір лінії' },
      ],
    },
    {
      title: 'Slots',
      rows: [{ name: 'default', type: '—', description: 'Довільний вміст плашки замість text' }],
    },
  ];
</script>

<template>
  <div class="vt-divider-showcase">
    <DocSection title="Базове використання">
      <DocPreview>
        <VDivider text="Підзаголовок" />
      </DocPreview>
    </DocSection>

    <DocSection description="Задовгий текст обрізається трикрапкою, повний текст — у title" title="Довгий текст">
      <DocPreview>
        <VDivider text="Дуууууууууууууууууууууууууууууууууууууууууууууже дооооооооооовгий підзаголовок" />
      </DocPreview>
    </DocSection>

    <DocSection title="Колір фону">
      <DocPreview>
        <div class="vt-divider-showcase__col">
          <VDivider text="Primary bg" background="var(--color-primary-bg)" />
          <VDivider text="Success bg" background="var(--color-success-bg)" />
          <VDivider text="Custom #FFF4D6" background="#FFF4D6" />
        </div>
      </DocPreview>
    </DocSection>

    <DocSection title="Розмір шрифту">
      <DocPreview>
        <div class="vt-divider-showcase__col">
          <VDivider text="12px" :font-size="12" />
          <VDivider text="16px" :font-size="16" />
          <VDivider text="1.25rem" font-size="1.25rem" />
        </div>
      </DocPreview>
    </DocSection>

    <DocSection description="Без тексту — просто лінія" title="Без тексту">
      <DocPreview>
        <VDivider />
      </DocPreview>
    </DocSection>

    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .vt-divider-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;

    &__col {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
    }
  }
</style>
