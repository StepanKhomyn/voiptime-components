<script lang="ts" setup>
  import VImageFullscreen from '@/components/image-fullscreen/VImageFullscreen.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  // --- Документація ---
  const propsSections: TableSection[] = [
    {
      title: 'Slots',
      rows: [
        {
          name: 'image',
          type: 'VNode',
          default: '—',
          description: 'Контент, що показується і в превʼю, і у fullscreen-режимі (зазвичай <img>)',
        },
      ],
    },
  ];
</script>

<template>
  <div class="image-fullscreen-showcase">
    <!-- ─── Базове використання ─── -->
    <DocSection title="Базове використання" description="Клік по зображенню відкриває його на весь екран, повторний клік закриває">
      <DocPreview>
        <VImageFullscreen>
          <template #image>
            <img alt="demo" src="https://picsum.photos/seed/vt-demo-1/300/200" />
          </template>
        </VImageFullscreen>
      </DocPreview>
    </DocSection>

    <!-- ─── Кілька зображень поспіль ─── -->
    <DocSection title="Група зображень" description="Кожен екземпляр керує своїм fullscreen-станом незалежно">
      <DocPreview>
        <VImageFullscreen v-for="i in 4" :key="i">
          <template #image>
            <img :alt="`demo-${i}`" :src="`https://picsum.photos/seed/vt-demo-${i}/150/150`" />
          </template>
        </VImageFullscreen>
      </DocPreview>
    </DocSection>

    <!-- ─── Вертикальне зображення ─── -->
    <DocSection title="Вертикальне зображення" description="object-fit: contain у fullscreen-режимі зберігає пропорції для будь-якої орієнтації">
      <DocPreview>
        <VImageFullscreen>
          <template #image>
            <img alt="portrait" src="https://picsum.photos/seed/vt-demo-portrait/200/350" />
          </template>
        </VImageFullscreen>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🖼️" title="Тільки слот, без пропів">
        Компонент не приймає пропів — весь контент (зазвичай <code>&lt;img&gt;</code>) передається через слот
        <code>#image</code> і рендериться однаково в обох станах.
      </DocFeature>
      <DocFeature icon="🔍" title="Zoom-in курсор">
        У звичайному стані курсор <code>zoom-in</code> підказує, що елемент клікабельний і розкривається на весь
        екран.
      </DocFeature>
      <DocFeature icon="🖱️" title="Клік для закриття">
        У fullscreen-режимі клік будь-де по overlay закриває перегляд — окремої кнопки закриття не потрібно.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .image-fullscreen-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>