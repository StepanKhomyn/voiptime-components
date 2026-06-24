<script lang="ts" setup>
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import type { VtEditorEmits, VtEditorMethods, VtEditorProps, VtEditorValidationResult } from './types';
  import { useI18n } from '@/locales/useI18n';
  import { LOCALE_KEYS } from '@/locales/types';

  import VButton from '@/components/button/VButton.vue';
  import VModal from '@/components/modal/VModal.vue';
  import VDropdown from '@/components/dropdown/VDropdown.vue';
  import VDropdownItem from '@/components/dropdown/VDropdownItem.vue';
  import VIcon from '@/components/icon/VIcon.vue';

  import { customSanitizeHtml, stripHtml } from './helpers';
  import { useEditorCommands } from './useEditorCommands';
  import { useEditorDialogs } from './useEditorDialogs';
  import { useEditorToolbar } from './useEditorToolbar';

  // ─── i18n ─────────────────────────────────────────────────────────────────────

  const { t } = useI18n();

  // ─── Props / Emits ────────────────────────────────────────────────────────────

  const props = withDefaults(defineProps<VtEditorProps>(), {
    disabled: false,
    toolbar: () => [
      'history',
      'format',
      'heading',
      'fontName',
      'foreColor',
      'align',
      'list',
      'indent',
      'link',
      'image',
      'blockquote',
      'clear',
      'html',
    ],
  });

  const emit = defineEmits<VtEditorEmits>();

  // ─── Refs ─────────────────────────────────────────────────────────────────────

  const editorRef = ref<HTMLDivElement | null>(null);
  const toolbarRef = ref<HTMLDivElement | null>(null);
  const htmlSourceRef = ref<HTMLTextAreaElement | null>(null);

  const isFocused = ref(false);
  const isHtmlMode = ref(false);
  const htmlSourceValue = ref('');

  const validationErrors = ref<string[]>([]);
  const isValid = ref(true);

  const showScrollLeft = ref(false);
  const showScrollRight = ref(false);

  const currentForeColor = ref('#000000');
  const currentBackColor = ref('#ffffff');

  // ─── Sync model ───────────────────────────────────────────────────────────────

  function syncModel(overrideHtml?: string): void {
    const rawHtml = overrideHtml ?? editorRef.value?.innerHTML ?? '';
    const cleanHtml = customSanitizeHtml(rawHtml);
    emit('update:modelValue', cleanHtml);
    emit('input', cleanHtml);
  }

  // ─── Commands composable ──────────────────────────────────────────────────────

  const { exec, isActive, applyBlock, applyFont, applyForeColor, applyBackColor, handleIndent } = useEditorCommands(
    editorRef,
    syncModel
  );

  // ─── HTML source mode ─────────────────────────────────────────────────────────

  function toggleHtmlMode(): void {
    if (!editorRef.value) return;
    if (!isHtmlMode.value) {
      // Entering HTML mode — snapshot current innerHTML
      htmlSourceValue.value = editorRef.value.innerHTML;
      isHtmlMode.value = true;
      nextTick(() => htmlSourceRef.value?.focus());
    } else {
      // Leaving HTML mode — write textarea content back into editor
      const sanitized = customSanitizeHtml(htmlSourceValue.value);
      isHtmlMode.value = false;
      nextTick(() => {
        if (editorRef.value) {
          editorRef.value.innerHTML = sanitized;
          syncModel(sanitized);
          editorRef.value.focus();
        }
      });
    }
  }

  // While in HTML mode, keep the model in sync but don't touch the editor DOM
  function onHtmlSourceInput(): void {
    const sanitized = customSanitizeHtml(htmlSourceValue.value);
    emit('update:modelValue', sanitized);
    emit('input', sanitized);
  }

  // ─── Dialogs composable ───────────────────────────────────────────────────────

  const { linkState, openLinkDialog, confirmLink, cancelLink, imageState, openImageDialog, confirmImage, cancelImage } =
    useEditorDialogs(html => exec('insertHTML', html), syncModel);

  // ─── Toolbar composable ───────────────────────────────────────────────────────

  const { toolbarItems, selectionTick, onSelectionChange, getItemActive, HEADING_GROUPS, FONT_GROUPS } =
    useEditorToolbar(() => props.toolbar, {
      exec,
      isActive,
      applyBlock,
      applyFont,
      handleIndent,
      openLinkDialog,
      openImageDialog,
      toggleHtmlMode,
      isHtmlMode: () => isHtmlMode.value,
    });

  // ─── Color pickers ────────────────────────────────────────────────────────────

  function onForeColorInput(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    currentForeColor.value = color;
    applyForeColor(color);
  }

  function onBackColorInput(event: Event): void {
    const color = (event.target as HTMLInputElement).value;
    currentBackColor.value = color;
    applyBackColor(color);
  }

  // ─── Toolbar scroll ───────────────────────────────────────────────────────────

  function updateScrollButtons(): void {
    const el = toolbarRef.value;
    if (!el) return;
    showScrollLeft.value = el.scrollLeft > 2;
    showScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
  }

  function scrollToolbar(dir: 'left' | 'right'): void {
    const el = toolbarRef.value;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -160 : 160, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 250);
  }

  // ─── Validation ───────────────────────────────────────────────────────────────

  function validateValue(html: string): void {
    const errors: string[] = [];
    if (props.required && !stripHtml(html).trim()) {
      errors.push(t(LOCALE_KEYS.VALIDATION_REQUIRED));
    }
    validationErrors.value = errors;
    isValid.value = errors.length === 0;
    emit('validation', { isValid: isValid.value, errors });
  }

  // ─── Computed ─────────────────────────────────────────────────────────────────

  const displayErrorMessage = computed(() => props.errorMessage || validationErrors.value[0] || '');

  const hasError = computed(() => Boolean(displayErrorMessage.value));

  const rootClasses = computed(() => [
    'vt-editor',
    {
      'vt-editor--focused': isFocused.value,
      'vt-editor--error': hasError.value,
      'vt-editor--disabled': props.disabled,
    },
  ]);

  // ─── Editor events ────────────────────────────────────────────────────────────

  function onEditorInput(): void {
    syncModel();
    validateValue(props.modelValue ?? '');
  }

  function onEditorFocus(event: FocusEvent): void {
    isFocused.value = true;
    emit('focus', event);
  }

  function onEditorBlur(event: FocusEvent): void {
    isFocused.value = false;
    emit('blur', event);
    validateValue(props.modelValue ?? '');
  }

  function onEditorKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault();
      exec('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  }

  // ─── Model watcher ────────────────────────────────────────────────────────────

  watch(
    () => props.modelValue,
    newVal => {
      // Don't touch the editor while the user is typing or while in HTML mode
      if (!editorRef.value || isFocused.value || isHtmlMode.value) return;
      if (editorRef.value.innerHTML !== newVal) {
        editorRef.value.innerHTML = newVal ?? '';
      }
    }
  );

  // ─── Lifecycle ────────────────────────────────────────────────────────────────

  onMounted(() => {
    if (editorRef.value && props.modelValue) {
      editorRef.value.innerHTML = customSanitizeHtml(props.modelValue);
    }
    document.addEventListener('selectionchange', onSelectionChange);

    nextTick(() => {
      updateScrollButtons();
      const resizeObserver = new ResizeObserver(updateScrollButtons);
      if (toolbarRef.value) resizeObserver.observe(toolbarRef.value);
    });
    window.addEventListener('resize', updateScrollButtons);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('selectionchange', onSelectionChange);
    window.removeEventListener('resize', updateScrollButtons);
  });

  // ─── Public API ───────────────────────────────────────────────────────────────

  function focus(): void {
    editorRef.value?.focus();
  }

  function blur(): void {
    editorRef.value?.blur();
  }

  function clear(): void {
    if (editorRef.value) editorRef.value.innerHTML = '';
    syncModel('');
    validationErrors.value = [];
    isValid.value = true;
    emit('validation', { isValid: true, errors: [] });
  }

  function getHTML(): string {
    return editorRef.value?.innerHTML ?? '';
  }

  function getText(): string {
    return stripHtml(editorRef.value?.innerHTML ?? '');
  }

  function setHTML(html: string): void {
    const cleaned = customSanitizeHtml(html);
    if (editorRef.value) editorRef.value.innerHTML = cleaned;
    syncModel(cleaned);
  }

  function insertHTML(html: string): void {
    editorRef.value?.focus();
    exec('insertHTML', customSanitizeHtml(html));
  }

  function validate(): boolean {
    validateValue(props.modelValue ?? '');
    return isValid.value;
  }

  function clearValidation(): void {
    validationErrors.value = [];
    isValid.value = true;
    emit('validation', { isValid: true, errors: [] });
  }

  function getValidationState(): VtEditorValidationResult {
    return { isValid: isValid.value, errors: [...validationErrors.value] };
  }

  function getEditorElement(): HTMLElement | null {
    return editorRef.value;
  }

  defineExpose<VtEditorMethods>({
    focus,
    blur,
    clear,
    getHTML,
    getText,
    setHTML,
    insertHTML,
    validate,
    clearValidation,
    getValidationState,
    getEditorElement,
  });
</script>

<template>
  <div :class="rootClasses">
    <!-- ─── Toolbar ───────────────────────────────────────────────────────── -->
    <div v-if="!disabled && toolbarItems.length" class="vt-editor__toolbar-wrapper">
      <button
        v-if="showScrollLeft"
        class="vt-editor__toolbar-scroll-btn vt-editor__toolbar-scroll-btn--left"
        type="button"
        @click="scrollToolbar('left')"
        @mousedown.prevent
      >
        <VIcon name="arrowLeft" />
      </button>

      <div ref="toolbarRef" class="vt-editor__toolbar" @scroll="updateScrollButtons">
        <template v-for="(item, idx) in toolbarItems" :key="idx">
          <!-- Separator -->
          <span v-if="item?.type === 'separator'" class="vt-editor__toolbar-sep" />

          <!-- Heading dropdown -->
          <VDropdown
            v-else-if="item?.type === 'select' && item.id === 'heading'"
            :max-height="220"
            class="vt-editor__toolbar-btn"
            placement="bottom-start"
            trigger="hover"
            @mousedown.prevent
          >
            <VIcon v-tooltip="t(LOCALE_KEYS.EDITOR_HEADING)" name="tagType" />
            <template #dropdown>
              <VDropdownItem v-for="h in HEADING_GROUPS" :key="h.value" @click="applyBlock(h.value)" @mousedown.prevent>
                {{ h.label }}
              </VDropdownItem>
            </template>
          </VDropdown>

          <!-- Font dropdown -->
          <VDropdown
            v-else-if="item?.type === 'select' && item.id === 'fontName'"
            :max-height="220"
            class="vt-editor__toolbar-btn"
            placement="bottom-start"
            trigger="hover"
            @mousedown.prevent
          >
            <VIcon v-tooltip="t(LOCALE_KEYS.EDITOR_FONT)" name="fontName" />
            <template #dropdown>
              <VDropdownItem v-for="f in FONT_GROUPS" :key="f.value" @click="applyFont(f.value)" @mousedown.prevent>
                <span :style="{ fontFamily: f.value }">{{ f.label }}</span>
              </VDropdownItem>
            </template>
          </VDropdown>

          <!-- Color pickers (foreground + background) -->
          <template v-else-if="item?.type === 'select' && item.id === 'foreColor'">
            <input
              v-tooltip="t(LOCALE_KEYS.EDITOR_FORE_COLOR)"
              :value="currentForeColor"
              class="vt-editor__color-picker"
              type="color"
              @input="onForeColorInput"
              @mousedown.stop
            />
            <input
              v-tooltip="t(LOCALE_KEYS.EDITOR_BACK_COLOR)"
              :value="currentBackColor"
              class="vt-editor__color-picker vt-editor__color-picker--bg"
              type="color"
              @input="onBackColorInput"
              @mousedown.stop
            />
          </template>

          <!-- Regular button -->
          <button
            v-else-if="item?.type === 'button'"
            v-tooltip="item?.tooltip"
            :class="{ 'vt-editor__toolbar-btn--active': getItemActive(item!) }"
            class="vt-editor__toolbar-btn"
            type="button"
            @click="item?.action?.()"
            @mousedown.prevent
          >
            <VIcon v-if="item?.iconName" :name="item.iconName" />
          </button>
        </template>
      </div>

      <button
        v-if="showScrollRight"
        class="vt-editor__toolbar-scroll-btn vt-editor__toolbar-scroll-btn--right"
        type="button"
        @click="scrollToolbar('right')"
        @mousedown.prevent
      >
        <VIcon name="arrowRight" />
      </button>
    </div>

    <!-- ─── Editor body ───────────────────────────────────────────────────── -->
    <div class="vt-editor__body">
      <div
        v-show="!isHtmlMode"
        ref="editorRef"
        :contenteditable="!disabled"
        :data-placeholder="placeholder"
        class="vt-editor__content"
        @blur="onEditorBlur"
        @focus="onEditorFocus"
        @input="onEditorInput"
        @keydown="onEditorKeydown"
      />

      <textarea
        v-if="isHtmlMode"
        ref="htmlSourceRef"
        v-model="htmlSourceValue"
        class="vt-editor__html-source"
        @input="onHtmlSourceInput"
      />
    </div>

    <!-- ─── Validation error ──────────────────────────────────────────────── -->
    <div v-if="displayErrorMessage" class="vt-editor__error">
      {{ displayErrorMessage }}
    </div>

    <!-- ─── Link dialog ───────────────────────────────────────────────────── -->
    <VModal
      v-model="linkState.visible"
      :close-on-backdrop-click="false"
      :title="t(LOCALE_KEYS.EDITOR_LINK_TITLE)"
      size="small"
      @close="cancelLink"
    >
      <div class="vt-editor__dialog-fields">
        <label class="vt-editor__dialog-label">{{ t(LOCALE_KEYS.EDITOR_LINK_URL) }}</label>
        <input
          v-model="linkState.url"
          class="vt-editor__dialog-input"
          placeholder="https://example.com"
          type="url"
          @keydown.enter="confirmLink"
          @keydown.esc="cancelLink"
        />
        <label class="vt-editor__dialog-label">{{ t(LOCALE_KEYS.EDITOR_LINK_TEXT) }}</label>
        <input
          v-model="linkState.text"
          class="vt-editor__dialog-input"
          placeholder="Link text"
          type="text"
          @keydown.enter="confirmLink"
          @keydown.esc="cancelLink"
        />
        <label class="vt-editor__dialog-checkbox">
          <input v-model="linkState.openInNewTab" type="checkbox" />
          {{ t(LOCALE_KEYS.EDITOR_LINK_NEW_TAB) }}
        </label>
      </div>
      <div class="vt-modal__footer">
        <VButton @click="cancelLink">{{ t(LOCALE_KEYS.BUTTON_CANCEL) }}</VButton>
        <VButton type="primary" @click="confirmLink">{{ t(LOCALE_KEYS.EDITOR_INSERT) }}</VButton>
      </div>
    </VModal>

    <!-- ─── Image dialog ──────────────────────────────────────────────────── -->
    <VModal
      v-model="imageState.visible"
      :close-on-backdrop-click="false"
      :title="t(LOCALE_KEYS.EDITOR_IMAGE_TITLE)"
      size="small"
      @close="cancelImage"
    >
      <div class="vt-editor__dialog-fields">
        <label class="vt-editor__dialog-label">{{ t(LOCALE_KEYS.EDITOR_IMAGE_URL) }}</label>
        <input
          v-model="imageState.url"
          class="vt-editor__dialog-input"
          placeholder="https://example.com/image.png"
          type="url"
          @keydown.enter="confirmImage"
          @keydown.esc="cancelImage"
        />
        <label class="vt-editor__dialog-label">{{ t(LOCALE_KEYS.EDITOR_IMAGE_ALT) }}</label>
        <input
          v-model="imageState.alt"
          class="vt-editor__dialog-input"
          placeholder="Image description"
          type="text"
          @keydown.enter="confirmImage"
          @keydown.esc="cancelImage"
        />
      </div>
      <div class="vt-modal__footer">
        <VButton @click="cancelImage">{{ t(LOCALE_KEYS.BUTTON_CANCEL) }}</VButton>
        <VButton type="primary" @click="confirmImage">{{ t(LOCALE_KEYS.EDITOR_INSERT) }}</VButton>
      </div>
    </VModal>
  </div>
</template>
