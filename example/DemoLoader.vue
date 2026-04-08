<script setup lang="ts">
  import DocSection from './helper/DocSection.vue';
  import DocCodeBlock from './helper/DocCodeBlock.vue';
  import DocPreview from './helper/DocPreview.vue';
</script>

<template>
  <div class="loader-showcase">
    <!-- Підключення -->

    <!-- ─── Програмне API ─── -->
    <DocSection title="Підключення до проекту">
      <DocCodeBlock
        :code="`// main.ts
          import { createApp } from 'vue';
          import { tooltipDirective } from '@/directives/loader';

          const app = createApp(App);
          app.directive('loader', loaderDirective);
          app.mount('#app');
        `"
      />
    </DocSection>

    <!-- ─── Демонстрація ─── -->
    <DocSection title="Демонстрація">
      <DocPreview
        :code="`<div v-loader=&quot;true&quot;>
      <h4>Контент</h4>
      <h4>Контент</h4>
      <h4>Контент</h4>
      <h4>Контент</h4>
  </div>
        `"
      >
        <div v-loader="true" style="width: 100%">
          <h4>Контент</h4>
          <h4>Контент</h4>
          <h4>Контент</h4>
          <h4>Контент</h4>
        </div>
      </DocPreview>
    </DocSection>
  </div>
</template>

<style scoped>
  .loader-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
