<script lang="ts" setup>
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import VInfoBox from '@/components/info-box/VInfoBox.vue';
</script>

<template>
  <div class="info-box-showcase">
    <!-- ─── Типи ─── -->
    <DocSection title="Типи повідомлень">
      <DocPreview>
        <VInfoBox type="success">
          The content of MessageBox can be VNode, allowing us to pass custom components The content of MessageBox can be
          VNode, allowing us to pass custom components The content of MessageBox can be VNode, allowing us to pass
          custom components The content of MessageBox can be VNode, allowing us to pass custom components The content of
          MessageBox can be VNode, allowing us to pass custom components The content of MessageBox can be VNode,
          allowing us to pass custom components allowing us to pass custom components allowing us to pass custom
          components allowing us to pass custom components allowing us to pass custom components allowing us to pass
          custom components allowing us to pass custom components custom components allowing us to pass custom
          components custom components allowing us to pass custom components custom components allowing us to pass
          custom components custom components allowing us to pass custom components
        </VInfoBox>
        <VInfoBox type="primary">
          The content of MessageBox can be VNode, allowing us to pass custom components
        </VInfoBox>
        <VInfoBox type="warning">
          The content of MessageBox can be VNode, allowing us to pass custom components
        </VInfoBox>
        <VInfoBox type="danger">
          The content of MessageBox can be VNode, allowing us to pass custom components
        </VInfoBox>
      </DocPreview>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .info-box-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
