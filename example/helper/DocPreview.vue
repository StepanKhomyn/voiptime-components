<script lang="ts" setup>
  import { computed, ref, useSlots } from 'vue';
  import DocCodeBlock from './DocCodeBlock.vue';
  import { vnodeToCode } from './vnodetocode';

  const props = defineProps<{
    title?: string;
    // Якщо передано вручну — використовується як є (для edge-cases)
    code?: string;
    // Опційний script setup блок (тільки вміст, без тегів)
    script?: string;
    language?: string;
  }>();

  const slots = useSlots();
  const isOpen = ref(false);
  const copied = ref(false);

  // Відновлюємо код з vnode дерева слоту в runtime
  const autoCode = computed(() => {
    if (props.code) return props.code;
    const defaultSlot = slots.default?.();
    if (!defaultSlot?.length) return '';
    return vnodeToCode(defaultSlot);
  });

  const fullCode = computed(() => {
    if (!props.script) return autoCode.value;
    return `<script setup>\n${props.script.trim()}\n<\/script>\n\n<template>\n${autoCode.value}\n</template>`;
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(fullCode.value);
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000);
    } catch {}
  }
</script>

<template>
  <div class="doc-preview">
    <p v-if="title" class="doc-preview__title">{{ title }}</p>

    <div class="doc-preview__stage">
      <slot />
    </div>

    <div class="doc-preview__toolbar">
      <button class="doc-preview__btn" @click="isOpen = !isOpen">
        <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
          <path
            d="M4 5L7 2L10 5M10 9L7 12L4 9"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          />
        </svg>
        {{ isOpen ? 'Сховати код' : 'Показати код' }}
      </button>

      <span v-if="script" class="doc-preview__script-badge">
        <svg fill="none" height="12" viewBox="0 0 12 12" width="12">
          <rect height="10" rx="2" stroke="currentColor" stroke-width="1.2" width="10" x="1" y="1" />
          <path
            d="M3.5 4.5L5.5 6L3.5 7.5M6.5 7.5H8.5"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.2"
          />
        </svg>
        з &lt;script setup&gt;
      </span>

      <button class="doc-preview__btn doc-preview__btn--copy" @click="copy">
        <svg v-if="!copied" fill="none" height="13" viewBox="0 0 13 13" width="13">
          <rect height="8" rx="1.5" stroke="currentColor" stroke-width="1.3" width="8" x="4" y="4" />
          <path d="M2 9V2h7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" />
        </svg>
        <svg v-else fill="none" height="13" viewBox="0 0 13 13" width="13">
          <path d="M2 7L5 10L11 3" stroke="#27ae60" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" />
        </svg>
        {{ copied ? 'Скопійовано!' : 'Копіювати' }}
      </button>
    </div>

    <Transition name="slide">
      <div v-if="isOpen" class="doc-preview__code">
        <template v-if="script">
          <div class="doc-preview__code-label doc-preview__code-label--script">script setup</div>
          <DocCodeBlock :code="`<script setup>\n${script.trim()}\n<\/script>`" language="vue" />
          <div class="doc-preview__code-label doc-preview__code-label--template">template</div>
          <DocCodeBlock :code="autoCode" :language="language ?? 'html'" />
        </template>
        <DocCodeBlock v-else :code="autoCode" :language="language ?? 'html'" />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
  .doc-preview {
    border: 1px solid #e0e4ea;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;

    &__title {
      padding: 0.6rem 1.25rem;
      margin: 0;
      font-size: 0.8rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #f0f0f0;
      background: #fafafa;
    }

    &__stage {
      padding: 2rem 1.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: flex-start;
      background: #fff;
      min-height: 64px;
    }

    &__toolbar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-top: 1px solid #f0f0f0;
      background: #fafafa;
    }

    &__script-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      background: #f0e6ff;
      color: #7c3aed;
      font-size: 0.72rem;
      font-weight: 500;
      font-family: 'JetBrains Mono', monospace;
    }

    &__btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.7rem;
      border: 1px solid #dde1e8;
      border-radius: 6px;
      background: #fff;
      color: #555;
      font-size: 0.78rem;
      cursor: pointer;
      transition: all 0.15s;
      line-height: 1;

      &:hover {
        border-color: #3498db;
        color: #3498db;
        background: #f0f7ff;
      }

      &--copy {
        margin-left: auto;
      }
    }

    &__code {
      border-top: 1px solid #e0e4ea;
    }

    &__code-label {
      padding: 0.3rem 1rem;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      background: #161b27;

      &--script {
        color: #c792ea;
        border-bottom: 1px solid #2a2f40;
      }

      &--template {
        color: #89ddff;
        border-top: 2px solid #2a2f40;
        border-bottom: 1px solid #2a2f40;
      }
    }
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.22s ease;
    overflow: hidden;
  }

  .slide-enter-from,
  .slide-leave-to {
    max-height: 0;
    opacity: 0;
  }

  .slide-enter-to,
  .slide-leave-from {
    max-height: 2000px;
    opacity: 1;
  }
</style>
