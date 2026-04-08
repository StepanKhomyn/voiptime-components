<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps<{
    code: string;
    language?: string;
  }>();

  // Light syntax highlight — no deps, just regex transforms
  const highlighted = computed(() => {
    let h = props.code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    if (['html', 'vue', 'template'].includes(props.language ?? 'html')) {
      h = h
        // strings
        .replace(/(&quot;|&#039;)(.*?)\1/g, '<span class="s">$1$2$1</span>')
        // attr names
        .replace(/\s([\w:-]+)(?==)/g, ' <span class="a">$1</span>')
        // tags
        .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="t">$2</span>')
        // comments
        .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="c">$1</span>');
    }

    if (['js', 'ts', 'javascript', 'typescript'].includes(props.language ?? '')) {
      h = h
        .replace(/(\/\/.*$)/gm, '<span class="c">$1</span>')
        .replace(
          /\b(const|let|var|function|return|import|export|from|if|else|for|of|in|async|await|new|true|false|null|undefined|ref|computed|reactive|watch|defineProps|defineEmits|onMounted)\b/g,
          '<span class="k">$1</span>'
        )
        .replace(/('.*?'|".*?"|`[\s\S]*?`)/g, '<span class="s">$1</span>');
    }

    return h;
  });
</script>

<template>
  <pre class="doc-code"><code v-html="highlighted" /></pre>
</template>

<style lang="scss" scoped>
  .doc-code {
    margin: 0;
    padding: 1.25rem 1.5rem;
    background: #1e2532;
    color: #cdd6f4;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    font-size: 0.82rem;
    line-height: 1.65;
    overflow-x: auto;
    tab-size: 2;

    :deep(.t) {
      color: #89b4fa;
    }

    // tag name
    :deep(.a) {
      color: #cba6f7;
    }

    // attribute
    :deep(.s) {
      color: #a6e3a1;
    }

    // string
    :deep(.c) {
      color: #6c7086;
      font-style: italic;
    }

    // comment
    :deep(.k) {
      color: #cba6f7;
      font-weight: 500;
    }

    // keyword
  }
</style>
