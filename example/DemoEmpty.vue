<script lang="ts" setup>
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import VEmpty from '@/components/empty/VEmpty.vue';

  // --- Документація ---
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'icon',
          type: 'IconName',
          default: "'noData'",
          description: 'Іконка для відображення',
        },
        {
          name: 'text',
          type: 'string',
          default: "'Немає даних!'",
          description: 'Тест для відображення',
        },
      ],
    },
  ];
</script>

<template>
  <div class="empty-showcase">
    <!-- ─── Типи ─── -->
    <DocSection title="Приклад">
      <DocPreview>
        <VEmpty />
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .empty-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
