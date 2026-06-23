<script lang="ts" setup>
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import type {
    VtEditorCommand,
    VtEditorEmits,
    VtEditorImageState,
    VtEditorLinkState,
    VtEditorMethods,
    VtEditorProps,
    VtEditorToolbarGroup,
    VtEditorValidationResult,
  } from './types';
  import { useI18n } from '@/locales/useI18n';
  import { LOCALE_KEYS } from '@/locales/types';

  // Компоненти
  import VButton from '@/components/button/VButton.vue';
  import VModal from '@/components/modal/VModal.vue';
  import VDropdown from '@/components/dropdown/VDropdown.vue';
  import VDropdownItem from '@/components/dropdown/VDropdownItem.vue';
  import VIcon from '@/components/icon/VIcon.vue';

  // Константи та Хелпери
  import { FONT_GROUPS, HEADING_GROUPS, TOOLBAR_ICONS } from './constants';
  import { customSanitizeHtml, stripHtml } from './helpers';

  interface ToolbarItem {
    type: 'button' | 'select' | 'separator';
    id?: string;
    tooltip?: string;
    iconName?: any;
    action?: () => void;
    activeCheck?: () => boolean;
  }

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
  const isFocused = ref(false);
  const isHtmlMode = ref(false);
  const htmlSourceRef = ref<HTMLTextAreaElement | null>(null);
  const htmlSourceValue = ref('');

  const validationErrors = ref<string[]>([]);
  const isValid = ref(true);

  const showScrollLeft = ref(false);
  const showScrollRight = ref(false);

  const currentColor = ref('#000000');

  const linkState = ref<VtEditorLinkState>({
    visible: false,
    url: '',
    text: '',
    openInNewTab: false,
  });

  const imageState = ref<VtEditorImageState>({
    visible: false,
    url: '',
    alt: '',
  });

  let savedRange: Range | null = null;

  // ─── Validation ───────────────────────────────────────────────────────────────

  function validateValue(html: string): void {
    const errors: string[] = [];
    const text = stripHtml(html).trim();

    if (props.required && !text) {
      errors.push(t(LOCALE_KEYS.VALIDATION_REQUIRED));
    }

    validationErrors.value = errors;
    isValid.value = errors.length === 0;
    emit('validation', { isValid: isValid.value, errors });
  }

  // ─── Computed state ───────────────────────────────────────────────────────────

  const displayErrorMessage = computed(() => {
    if (props.errorMessage) return props.errorMessage;
    if (validationErrors.value.length) return validationErrors.value[0];
    return '';
  });

  const hasError = computed(() => Boolean(displayErrorMessage.value));

  const rootClasses = computed(() => [
    'vt-editor',
    {
      'vt-editor--focused': isFocused.value,
      'vt-editor--error': hasError.value,
      'vt-editor--disabled': props.disabled,
    },
  ]);

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

  // ─── Color picker ─────────────────────────────────────────────────────────────

  function onColorInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    currentColor.value = input.value;
    editorRef.value?.focus();
    document.execCommand('foreColor', false, input.value);
    syncModel();
  }

  // ─── Editor commands ──────────────────────────────────────────────────────────

  function exec(command: VtEditorCommand, value?: string): void {
    if (!editorRef.value) return;
    editorRef.value.focus();
    document.execCommand(command, false, value ?? '');
    syncModel();
  }

  function isActive(command: string): boolean {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }

  function applyHeading(tag: string): void {
    if (!editorRef.value) return;
    editorRef.value.focus();
    document.execCommand('formatBlock', false, tag);
    syncModel();
  }

  function handleIndent(type: 'indent' | 'outdent') {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    let element = selection.anchorNode as HTMLElement;
    if (element.nodeType === Node.TEXT_NODE) {
      element = element.parentElement!;
    }

    const closestBlock = element.closest('.vt-editor__content > *') as HTMLElement;
    if (closestBlock) {
      const currentMargin = parseInt(closestBlock.style.marginLeft || '0', 10);
      const step = 20;
      const newMargin = type === 'indent' ? currentMargin + step : Math.max(0, currentMargin - step);
      closestBlock.style.marginLeft = newMargin ? `${newMargin}px` : '';
      syncModel();
    }
  }

  // ─── Toolbar builder ──────────────────────────────────────────────────────────

  function buildToolbarItems(groups: VtEditorToolbarGroup[]): (ToolbarItem | null)[] {
    const items: (ToolbarItem | null)[] = [];

    groups.forEach((group, idx) => {
      if (idx > 0) items.push({ type: 'separator' });

      switch (group) {
        case 'history':
          items.push(
            {
              type: 'button',
              id: 'undo',
              tooltip: t(LOCALE_KEYS.EDITOR_UNDO),
              iconName: TOOLBAR_ICONS.undo,
              action: () => exec('undo'),
            },
            {
              type: 'button',
              id: 'redo',
              tooltip: t(LOCALE_KEYS.EDITOR_REDO),
              iconName: TOOLBAR_ICONS.redo,
              action: () => exec('redo'),
            }
          );
          break;

        case 'format':
          items.push(
            {
              type: 'button',
              id: 'bold',
              tooltip: t(LOCALE_KEYS.EDITOR_BOLD),
              iconName: TOOLBAR_ICONS.bold,
              action: () => exec('bold'),
              activeCheck: () => isActive('bold'),
            },
            {
              type: 'button',
              id: 'italic',
              tooltip: t(LOCALE_KEYS.EDITOR_ITALIC),
              iconName: TOOLBAR_ICONS.italic,
              action: () => exec('italic'),
              activeCheck: () => isActive('italic'),
            },
            {
              type: 'button',
              id: 'underline',
              tooltip: t(LOCALE_KEYS.EDITOR_UNDERLINE),
              iconName: TOOLBAR_ICONS.underline,
              action: () => exec('underline'),
              activeCheck: () => isActive('underline'),
            },
            {
              type: 'button',
              id: 'strikethrough',
              tooltip: t(LOCALE_KEYS.EDITOR_STRIKETHROUGH),
              iconName: TOOLBAR_ICONS.strikethrough,
              action: () => exec('strikethrough'),
              activeCheck: () => isActive('strikeThrough'),
            }
          );
          break;

        case 'script':
          items.push(
            {
              type: 'button',
              id: 'subscript',
              tooltip: t(LOCALE_KEYS.EDITOR_SUBSCRIPT),
              iconName: TOOLBAR_ICONS.subscript,
              action: () => exec('subscript'),
              activeCheck: () => isActive('subscript'),
            },
            {
              type: 'button',
              id: 'superscript',
              tooltip: t(LOCALE_KEYS.EDITOR_SUPERSCRIPT),
              iconName: TOOLBAR_ICONS.superscript,
              action: () => exec('superscript'),
              activeCheck: () => isActive('superscript'),
            }
          );
          break;

        case 'heading':
          items.push({ type: 'select', id: 'heading' });
          break;

        case 'fontName':
          items.push({ type: 'select', id: 'fontName' });
          break;

        case 'foreColor':
          items.push({ type: 'select', id: 'foreColor' });
          break;

        case 'align':
          items.push(
            {
              type: 'button',
              id: 'alignLeft',
              tooltip: t(LOCALE_KEYS.EDITOR_ALIGN_LEFT),
              iconName: TOOLBAR_ICONS.alignLeft,
              action: () => exec('justifyLeft'),
              activeCheck: () => isActive('justifyLeft'),
            },
            {
              type: 'button',
              id: 'alignCenter',
              tooltip: t(LOCALE_KEYS.EDITOR_ALIGN_CENTER),
              iconName: TOOLBAR_ICONS.alignCenter,
              action: () => exec('justifyCenter'),
              activeCheck: () => isActive('justifyCenter'),
            },
            {
              type: 'button',
              id: 'alignRight',
              tooltip: t(LOCALE_KEYS.EDITOR_ALIGN_RIGHT),
              iconName: TOOLBAR_ICONS.alignRight,
              action: () => exec('justifyRight'),
              activeCheck: () => isActive('justifyRight'),
            },
            {
              type: 'button',
              id: 'alignJustify',
              tooltip: t(LOCALE_KEYS.EDITOR_ALIGN_JUSTIFY),
              iconName: TOOLBAR_ICONS.alignJustify,
              action: () => exec('justifyFull'),
              activeCheck: () => isActive('justifyFull'),
            }
          );
          break;

        case 'list':
          items.push(
            {
              type: 'button',
              id: 'orderedList',
              tooltip: t(LOCALE_KEYS.EDITOR_ORDERED_LIST),
              iconName: TOOLBAR_ICONS.orderedList,
              action: () => exec('insertOrderedList'),
              activeCheck: () => isActive('insertOrderedList'),
            },
            {
              type: 'button',
              id: 'unorderedList',
              tooltip: t(LOCALE_KEYS.EDITOR_UNORDERED_LIST),
              iconName: TOOLBAR_ICONS.unorderedList,
              action: () => exec('insertUnorderedList'),
              activeCheck: () => isActive('insertUnorderedList'),
            }
          );
          break;

        case 'indent':
          items.push(
            {
              type: 'button',
              id: 'indent',
              tooltip: t(LOCALE_KEYS.EDITOR_INDENT),
              iconName: TOOLBAR_ICONS.indent,
              action: () => handleIndent('indent'),
            },
            {
              type: 'button',
              id: 'outdent',
              tooltip: t(LOCALE_KEYS.EDITOR_OUTDENT),
              iconName: TOOLBAR_ICONS.outdent,
              action: () => handleIndent('outdent'),
            }
          );
          break;

        case 'link':
          items.push({
            type: 'button',
            id: 'link',
            tooltip: t(LOCALE_KEYS.EDITOR_INSERT_LINK),
            iconName: TOOLBAR_ICONS.link,
            action: openLinkDialog,
          });
          break;

        case 'image':
          items.push({
            type: 'button',
            id: 'image',
            tooltip: t(LOCALE_KEYS.EDITOR_INSERT_IMAGE),
            iconName: TOOLBAR_ICONS.image,
            action: openImageDialog,
          });
          break;

        case 'blockquote':
          items.push({
            type: 'button',
            id: 'blockquote',
            tooltip: t(LOCALE_KEYS.EDITOR_BLOCKQUOTE),
            iconName: TOOLBAR_ICONS.blockquote,
            action: () => applyHeading('blockquote'),
          });
          break;

        case 'clear':
          items.push({
            type: 'button',
            id: 'clear',
            tooltip: t(LOCALE_KEYS.EDITOR_CLEAR_FORMAT),
            iconName: TOOLBAR_ICONS.clearFormat,
            action: () => exec('removeFormat'),
          });
          break;

        case 'html':
          items.push({
            type: 'button',
            id: 'html',
            tooltip: t(LOCALE_KEYS.EDITOR_HTML_SOURCE),
            iconName: TOOLBAR_ICONS.html,
            action: toggleHtmlMode,
            activeCheck: () => isHtmlMode.value,
          });
          break;
      }
    });

    return items;
  }

  const toolbarItems = computed(() => buildToolbarItems(props.toolbar));
  const selectionTick = ref(0);

  function onSelectionChange(): void {
    if (isFocused.value) selectionTick.value++;
  }

  function getItemActive(item: ToolbarItem): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    selectionTick.value;
    return item.activeCheck?.() ?? false;
  }

  // ─── HTML source mode ─────────────────────────────────────────────────────────

  function toggleHtmlMode(): void {
    if (!editorRef.value) return;
    if (!isHtmlMode.value) {
      htmlSourceValue.value = editorRef.value.innerHTML;
      isHtmlMode.value = true;
      nextTick(() => htmlSourceRef.value?.focus());
    } else {
      isHtmlMode.value = false;
      nextTick(() => {
        if (editorRef.value) {
          editorRef.value.innerHTML = customSanitizeHtml(htmlSourceValue.value);
          syncModel();
          editorRef.value.focus();
        }
      });
    }
  }

  function onHtmlSourceInput(): void {
    syncModel(htmlSourceValue.value);
  }

  // ─── Link dialog ──────────────────────────────────────────────────────────────

  function saveSelection(): void {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection(): void {
    if (!savedRange) return;
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }

  function openLinkDialog(): void {
    saveSelection();
    const sel = window.getSelection();
    const text = sel?.toString() ?? '';
    const anchor = sel?.anchorNode?.parentElement?.closest('a');
    linkState.value = {
      visible: true,
      url: anchor?.getAttribute('href') ?? '',
      text,
      openInNewTab: anchor?.getAttribute('target') === '_blank',
    };
  }

  function confirmLink(): void {
    restoreSelection();
    const { url, text, openInNewTab } = linkState.value;
    if (!url) {
      cancelLink();
      return;
    }

    const a = document.createElement('a');
    a.href = url;
    a.textContent = text || url;
    if (openInNewTab) a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && savedRange) {
      savedRange.deleteContents();
      savedRange.insertNode(a);
    } else {
      exec('insertHTML', a.outerHTML);
    }
    cancelLink();
    syncModel();
  }

  function cancelLink(): void {
    linkState.value = { visible: false, url: '', text: '', openInNewTab: false };
    savedRange = null;
  }

  // ─── Image dialog ─────────────────────────────────────────────────────────────

  function openImageDialog(): void {
    saveSelection();
    imageState.value = { visible: true, url: '', alt: '' };
  }

  function confirmImage(): void {
    restoreSelection();
    const { url, alt } = imageState.value;
    if (!url) {
      cancelImage();
      return;
    }
    exec('insertHTML', `<img src="${url}" alt="${alt}" style="max-width:100%;" />`);
    cancelImage();
  }

  function cancelImage(): void {
    imageState.value = { visible: false, url: '', alt: '' };
    savedRange = null;
  }

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

  // ─── Model sync ───────────────────────────────────────────────────────────────

  function syncModel(overrideHtml?: string): void {
    const rawHtml = overrideHtml ?? editorRef.value?.innerHTML ?? '';
    const cleanHtml = customSanitizeHtml(rawHtml);
    emit('update:modelValue', cleanHtml);
    emit('input', cleanHtml);
  }

  watch(
    () => props.modelValue,
    newVal => {
      if (!editorRef.value || isFocused.value) return;
      if (editorRef.value.innerHTML !== newVal) {
        editorRef.value.innerHTML = newVal ?? '';
      }
      if (isHtmlMode.value) htmlSourceValue.value = newVal ?? '';
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

  // ─── Exposed public API ───────────────────────────────────────────────────────

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
          <span v-if="item?.type === 'separator'" class="vt-editor__toolbar-sep" />

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
              <VDropdownItem v-for="h in HEADING_GROUPS" :key="h.value" @click="exec('fontName', h.value)">
                {{ h.label }}
              </VDropdownItem>
            </template>
          </VDropdown>

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
              <VDropdownItem v-for="f in FONT_GROUPS" :key="f.value" @click="exec('fontName', f.value)">
                <span :style="{ fontFamily: f.value }">{{ f.label }}</span>
              </VDropdownItem>
            </template>
          </VDropdown>

          <template v-else-if="item?.type === 'select' && item.id === 'foreColor'">
            <input
              :value="currentColor"
              class="vt-editor__color-picker"
              type="color"
              @input="onColorInput"
              @mousedown.stop
            />
          </template>

          <button
            v-else-if="item?.type === 'button'"
            v-tooltip="item?.tooltip"
            :class="{ 'vt-editor__toolbar-btn--active': getItemActive(item!) }"
            class="vt-editor__toolbar-btn"
            type="button"
            @click="item?.action?.()"
            @mousedown.prevent
          >
            <VIcon :name="item?.iconName" />
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

    <div v-if="displayErrorMessage" class="vt-editor__error">
      {{ displayErrorMessage }}
    </div>

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
        <label class="vt-editor__dialog-checkbox"
          ><input v-model="linkState.openInNewTab" type="checkbox" /> {{ t(LOCALE_KEYS.EDITOR_LINK_NEW_TAB) }}</label
        >
      </div>
      <div class="vt-modal__footer">
        <VButton @click="cancelLink">{{ t(LOCALE_KEYS.BUTTON_CANCEL) }}</VButton>
        <VButton type="primary" @click="confirmLink">{{ t(LOCALE_KEYS.EDITOR_INSERT) }}</VButton>
      </div>
    </VModal>

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
