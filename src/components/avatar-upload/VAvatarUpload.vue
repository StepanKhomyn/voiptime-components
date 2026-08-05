<template>
  <div class="vt-avatar-upload">
    <div class="vt-avatar-upload__thumb-container">
      <div v-if="fileBase64">
        <img class="vt-avatar-upload__ready-img" :src="fileBase64" alt="upload-photo" />
      </div>

      <div v-if="fileBase64" class="vt-avatar-upload__delete-btn" @click="removeImage">
        <VIcon name="delete" />
      </div>
    </div>

    <VButton type="primary" @click="fileInput?.click()">
      {{ 'Завантажити фото' }}
    </VButton>
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      style="display: none"
      @change="handleFileChange"
    />

    <Teleport to="body">
      <div
        v-if="isPopupOpen"
        :class="{ 'vt-avatar-upload-root': true, 'vt-avatar-upload-root-fixed': fixed }"
      >
        <div v-if="fixed" class="vt-avatar-upload-fade" />
        <div :class="{ 'vt-avatar-upload-popup': true, 'vt-avatar-upload-popup-fixed': fixed }">
          <div class="vt-avatar-upload-header">
            <div v-if="!slots.title" class="vt-avatar-upload-title"></div>
            <slot name="title" />
            <div class="vt-avatar-upload-close" @click="closePopup">
              <slot name="closeIcon" />
              <VIcon name="close" />
            </div>
          </div>

          <div class="vt-avatar-upload-main">
            <div>
              <div
                ref="editBox"
                class="vt-avatar-upload-edit"
                :style="editBoxSizeStyle"
                @wheel="handleWheelEvent"
              >
                <div class="edit-fade" />
                <div ref="select" class="edit-select" :style="selectBoxStyle">
                  <span class="edit-select-img-box">
                    <img
                      :src="avatar"
                      alt=""
                      :style="selectImgStyle"
                      class="edit-select-img"
                      @dragstart.prevent=""
                      @select.prevent=""
                    />
                  </span>
                  <span class="edit-select-border border-3-white" />
                  <span v-show="!disableSelect" ref="resize" class="select-zoom-point" />
                </div>
                <img
                  ref="bgAvatar"
                  :src="avatar"
                  alt=""
                  :style="bgImgStyle"
                  class="vt-avatar-upload-edit-bg"
                  @dragstart.prevent=""
                  @select.prevent=""
                />
              </div>
              <div class="vt-avatar-upload-operation">
                <span style="cursor: pointer" @click="file?.click()">Змінити аватар</span>
              </div>
            </div>

            <div v-if="showPreview" class="vt-avatar-upload-preview">
              <div class="preview-radius border-3-white" :style="previewBoxSizeStyle">
                <img :src="avatar" alt="" :style="previewImgStyle" @dragstart.prevent="" @select.prevent="" />
              </div>
              <div class="preview-square border-3-white" :style="previewBoxSizeStyle">
                <img :src="avatar" alt="" :style="previewImgStyle" @dragstart.prevent="" @select.prevent="" />
              </div>
            </div>
          </div>

          <div class="vt-avatar-upload-actions">
            <div @click="closePopup">
              <div v-if="!slots.cancel" class="vt-avatar-button-cancel">Відміна</div>
              <slot name="cancel" />
            </div>
            <div @click="upload">
              <div v-if="!slots.confirm" class="vt-avatar-button-confirm">Підтвердження</div>
              <slot name="confirm" />
            </div>
          </div>

          <input
            v-show="false"
            ref="file"
            type="file"
            :name="field"
            :accept="accept"
            @input="changeFile"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import type { ComputedRef, Ref, StyleValue } from 'vue';
  import { computed, nextTick, reactive, ref, useSlots, watch } from 'vue';

  import VIcon from '@/components/icon/VIcon.vue';
  import { createCutImg, getBase64, getRange } from '@/components/avatar-upload/uploadAvatar';
  import { useBackImgOperate, useSelectOperate } from '@/components/avatar-upload/useOperate';

  import type { MRef, RefElement, Size, SizeStyle, VAvatarUploadEmits, VAvatarUploadProps } from './types';
  import VButton from '@/components/button/VButton.vue';

  const props = withDefaults(defineProps<VAvatarUploadProps>(), {
    avatar: '',
    field: 'avatar',
    width: 300,
    height: 300,
    selectSize: 300,
    accept: 'image/svg+xml,image/png,image/jpeg,image/webp',
    fixed: true,
    rotate: true,
    disableSelect: false,
    format: 'png',
    showPreview: true,
    previewSize: 100,
  });

  const emit = defineEmits<VAvatarUploadEmits>();
  const slots = useSlots();

  const avatar: Ref<string> = ref(props.avatar);
  const fileBase64 = ref<string | null>(null);
  const isPopupOpen = ref(false);
  const isFileUploaded = ref(false);

  const fileInput = ref<HTMLInputElement | null>(null);
  const file: MRef<HTMLInputElement> = ref(null);
  const editBox: RefElement = ref(null);
  const select: RefElement = ref(null);
  const resize: RefElement = ref(null);
  const bgAvatar: MRef<HTMLImageElement> = ref(null);

  const editBoxWidth = props.width;
  const editBoxHeight = props.height;

  const editBoxSizeStyle: SizeStyle = {
    width: `${editBoxWidth}px`,
    height: `${editBoxHeight}px`,
  };

  const imgSize: Size = reactive({ width: editBoxWidth, height: editBoxHeight });

  const { bgImgZoom, baImgX, baImgY, bgImgStyle, imgRotate } = useBackImgOperate(editBox, imgSize);

  const initSelectSize =
    props.selectSize < Math.min(editBoxWidth, editBoxHeight)
      ? props.selectSize
      : Math.min(editBoxWidth, editBoxHeight);

  const { selectBoxSize, selectBoxStyle, selectX, selectY } = useSelectOperate({
    initSize: initSelectSize,
    select,
    resize,
    bgBoxSize: { width: editBoxWidth, height: editBoxHeight },
    limitSize: { width: editBoxWidth, height: editBoxHeight },
    disable: props.disableSelect,
  });

  watch(
    () => props.avatar,
    val => {
      if (val) {
        avatar.value = val;
        fileBase64.value = val;
        isFileUploaded.value = true;
        initImgSize();
      } else {
        fileBase64.value = null;
        isFileUploaded.value = false;
      }
    },
    { immediate: true },
  );

  watch(
    bgAvatar,
    () => {
      if (bgAvatar.value?.width) initImgSize();
    },
    { immediate: true },
  );

  function removeImage() {
    avatar.value = '';
    fileBase64.value = null;
    isFileUploaded.value = false;
    emit('uploadFile', null);
  }

  function handleWheelEvent(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -1 : 1;
    bgImgZoom.value = Math.max(0.1, Math.min(3, bgImgZoom.value + delta * 0.1));
  }

  function openPopup() {
    if (isFileUploaded.value) isPopupOpen.value = true;
  }

  function closePopup() {
    isPopupOpen.value = false;
  }

  async function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;

    const selectedFile = input.files[0];
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Підтримуються лише SVG, PNG, JPG, WEBP');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      avatar.value = event.target?.result as string;
      isFileUploaded.value = true;
      initImgSize();
      openPopup();
    };
    reader.readAsDataURL(selectedFile);
  }

  function initImgSize() {
    nextTick(() => {
      const el = bgAvatar.value;
      if (!el) return;
      el.onload = () => {
        const width = el.naturalWidth;
        const height = el.naturalHeight;
        bgImgZoom.value =
          width / height > editBoxWidth / editBoxHeight ? editBoxHeight / height : editBoxWidth / width;
        imgSize.width = width;
        imgSize.height = height;
        baImgX.value = 0;
        baImgY.value = 0;
      };
    });
  }

  const selectImgStyle: ComputedRef<StyleValue> = computed(() => ({
    width: `${imgSize.width * bgImgZoom.value}px`,
    height: `${imgSize.height * bgImgZoom.value}px`,
    left: `${baImgX.value - selectX.value}px`,
    top: `${baImgY.value - selectY.value}px`,
    transform: `rotate(${imgRotate.value}deg)`,
  }));

  const previewBoxSizeStyle: ComputedRef<StyleValue> = computed(() => ({
    width: `${props.previewSize}px`,
    height: `${props.previewSize}px`,
  }));

  const previewImgStyle: ComputedRef<StyleValue> = computed(() => {
    const zoom = props.previewSize / selectBoxSize.value;
    return {
      width: `${imgSize.width * zoom * bgImgZoom.value}px`,
      height: `${imgSize.height * zoom * bgImgZoom.value}px`,
      left: `${(baImgX.value - selectX.value) * zoom}px`,
      top: `${(baImgY.value - selectY.value) * zoom}px`,
      transform: `rotate(${imgRotate.value}deg)`,
    };
  });

  function changeFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const url = event.target?.result;
      if (url) {
        avatar.value = url as string;
        initImgSize();
      }
      input.value = '';
    };
    reader.readAsDataURL(input.files[0]);
  }

  const cutImg = createCutImg();

  function getImgData() {
    const range = getRange(
      { left: selectX.value, top: selectY.value, width: selectBoxSize.value, height: selectBoxSize.value },
      { left: baImgX.value, top: baImgY.value, width: imgSize.width, height: imgSize.height, zoom: bgImgZoom.value },
    );
    return cutImg(avatar.value, range, props.format);
  }

  async function upload() {
    const blob = await getImgData();
    const base64Image = await getBase64(blob);
    fileBase64.value = base64Image;
    emit('uploadFile', fileBase64.value);
    closePopup();
  }
</script>