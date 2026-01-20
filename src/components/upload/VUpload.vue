<script lang="ts" setup>
  import { computed, onUnmounted, ref } from 'vue';
  import type { UploadError, UploadFile, VUploadEmits, VUploadProps } from './types';
  import { FileParser, FileValidator } from './types';
  import VButton from '@/components/button/VButton.vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import { useI18n } from '@/locales/useI18n';
  import { LOCALE_KEYS } from '@/locales/types';

  const props = withDefaults(defineProps<VUploadProps>(), {
    modelValue: () => [],
    accept: undefined,
    maxSize: undefined,
    maxFiles: undefined,
    maxRows: undefined,
    multiple: true,
    type: 'button',
    disabled: false,
    // Видаляємо дефолтні значення для текстових props
    placeholder: undefined,
    tip: undefined,
    returnData: false,
    parseFiles: false,
  });

  const emit = defineEmits<VUploadEmits>();
  const { t } = useI18n();

  const isDragging = ref(false);
  const isProcessing = ref(false);
  const processingProgress = ref(0);
  const processingFileName = ref('');
  const processingStage = ref(''); // 'validating', 'parsing', 'completing'
  const fileInputRef = ref<HTMLInputElement | null>(null);

  const uploadedFiles = computed({
    get: () => props.modelValue || [],
    set: value => {
      emit('update:modelValue', value);
      emit('change', value);
    },
  });

  // Computed для локалізованих текстів
  const placeholderText = computed(() => props.placeholder ?? t(LOCALE_KEYS.UPLOAD_PLACEHOLDER));

  const tipText = computed(() => {
    if (props.tip) return props.tip;

    const parts: string[] = [];

    if (props.accept) {
      const extensions = props.accept
        .split(',')
        .map(t => t.trim())
        .join('/');
      parts.push(extensions);
    }

    if (props.maxSize) {
      parts.push(
        t(LOCALE_KEYS.UPLOAD_TIP_MAX_SIZE, {
          size: FileValidator.formatFileSize(props.maxSize),
        })
      );
    }

    if (props.maxRows) {
      parts.push(
        t(LOCALE_KEYS.UPLOAD_TIP_MAX_ROWS, {
          rows: props.maxRows.toString(),
        })
      );
    }

    return parts.join(', ');
  });

  const processingText = computed(() => {
    const stageKeys = {
      validating: LOCALE_KEYS.UPLOAD_PROCESSING_VALIDATING,
      parsing: LOCALE_KEYS.UPLOAD_PROCESSING_PARSING,
      completing: LOCALE_KEYS.UPLOAD_PROCESSING_COMPLETING,
    };

    const key = stageKeys[processingStage.value as keyof typeof stageKeys];
    return key ? t(key) : t(LOCALE_KEYS.UPLOAD_PROCESSING_DEFAULT);
  });

  const canAddMoreFiles = computed(() => {
    if (!props.maxFiles) return true;
    return uploadedFiles.value.length < props.maxFiles;
  });

  const isDisabled = computed(() => props.disabled || isProcessing.value);

  const showUploadArea = computed(() => {
    if (props.maxFiles === 1 && uploadedFiles.value.length >= 1) {
      return false;
    }
    return true;
  });

  const handleDragOver = (e: DragEvent) => {
    if (isDisabled.value) return;
    e.preventDefault();
    isDragging.value = true;
  };

  const handleDragLeave = (e: DragEvent) => {
    if (isDisabled.value) return;
    e.preventDefault();
    isDragging.value = false;
  };

  const handleDrop = (e: DragEvent) => {
    if (isDisabled.value) return;
    e.preventDefault();
    isDragging.value = false;

    const files = Array.from(e.dataTransfer?.files || []);
    handleFiles(files);
  };

  const handleFileInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    handleFiles(files);
    target.value = '';
  };

  const updateProgress = async (targetProgress: number, duration: number = 200) => {
    const startProgress = processingProgress.value;
    const diff = targetProgress - startProgress;
    const startTime = Date.now();

    return new Promise<void>(resolve => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        processingProgress.value = Math.round(startProgress + diff * progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  };

  const handleFiles = async (files: File[]) => {
    if (!canAddMoreFiles.value) {
      emit('exceed', files);
      return;
    }

    isProcessing.value = true;
    processingProgress.value = 0;
    processingStage.value = 'validating';

    const remainingSlots = props.maxFiles ? props.maxFiles - uploadedFiles.value.length : files.length;
    const filesToProcess = files.slice(0, remainingSlots);
    const validFiles: UploadFile[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      processingFileName.value = file.name;

      processingStage.value = 'validating';
      const baseProgress = (i / filesToProcess.length) * 100;
      await updateProgress(baseProgress + 10);

      const error = validateFile(file);

      if (error) {
        emit('error', error);
        continue;
      }

      await updateProgress(baseProgress + 20);

      const uploadFile: UploadFile = {
        id: FileValidator.generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'success',
      };

      validFiles.push(uploadFile);

      if (props.parseFiles && FileParser.isDataFile(file)) {
        processingStage.value = 'parsing';
        await updateProgress(baseProgress + 40);

        try {
          await new Promise(resolve => setTimeout(resolve, 50));

          const progressInterval = setInterval(() => {
            if (processingProgress.value < baseProgress + 75) {
              processingProgress.value += 2;
            }
          }, 100);

          const parseResult = await FileParser.parseFile(file, props.maxRows, props.returnData);

          clearInterval(progressInterval);
          await updateProgress(baseProgress + 70);

          if (props.maxRows && parseResult.rows > props.maxRows) {
            emit('rowsExceed', { file: uploadFile, rows: parseResult.rows, maxRows: props.maxRows });
          }

          emit('parse', { file: uploadFile, result: parseResult });
        } catch (error) {
          emit('error', {
            type: 'parse',
            message: t(LOCALE_KEYS.UPLOAD_ERROR_PARSE, {
              error: error instanceof Error ? error.message : 'Unknown error',
            }),
            file,
          });
        }

        await updateProgress(baseProgress + 90);
      } else {
        await updateProgress(baseProgress + 90);
      }

      processingStage.value = 'completing';
      await updateProgress(((i + 1) / filesToProcess.length) * 100);
    }

    if (validFiles.length > 0) {
      uploadedFiles.value = [...uploadedFiles.value, ...validFiles];
    }

    if (files.length > remainingSlots) {
      emit('exceed', files.slice(remainingSlots));
    }

    await updateProgress(100, 100);
    await new Promise(resolve => setTimeout(resolve, 300));

    isProcessing.value = false;
    processingProgress.value = 0;
    processingFileName.value = '';
    processingStage.value = '';
  };

  const validateFile = (file: File): UploadError | null => {
    if (props.maxSize && !FileValidator.validateSize(file, props.maxSize)) {
      return {
        type: 'size',
        message: t(LOCALE_KEYS.UPLOAD_ERROR_SIZE, {
          size: FileValidator.formatFileSize(props.maxSize),
        }),
        file,
      };
    }

    if (props.accept && !FileValidator.validateType(file, props.accept)) {
      return {
        type: 'type',
        message: t(LOCALE_KEYS.UPLOAD_ERROR_TYPE, {
          types: props.accept,
        }),
        file,
      };
    }

    return null;
  };

  const removeFile = (file: UploadFile) => {
    if (isProcessing.value) return;
    uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== file.id);
    emit('remove', file);
  };

  const openFileDialog = () => {
    if (isDisabled.value || !canAddMoreFiles.value) return;
    fileInputRef.value?.click();
  };

  onUnmounted(() => {
    FileParser.terminateWorkers();
  });
</script>

<template>
  <div class="vt-upload">
    <div v-if="isProcessing" class="vt-upload__processing">
      <div class="vt-upload__processing-header">
        <div class="vt-upload__processing-icon">
          <svg class="spinner" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" opacity="0.25" r="10" stroke="currentColor" stroke-width="2" />
            <path
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="vt-upload__processing-info">
          <div class="vt-upload__processing-title">{{ processingText }}</div>
          <div class="vt-upload__processing-filename">{{ processingFileName }}</div>
        </div>
        <div class="vt-upload__processing-percentage">{{ processingProgress }}%</div>
      </div>
      <div class="vt-upload__progress-bar">
        <div :style="{ width: `${processingProgress}%` }" class="vt-upload__progress-bar-fill"></div>
      </div>
    </div>

    <template v-if="showUploadArea">
      <!-- Drag & Drop Area -->
      <div
        v-if="type === 'drag'"
        :class="{
          'vt-upload__drag-area--active': isDragging,
          'vt-upload__drag-area--disabled': isDisabled || !canAddMoreFiles,
          'vt-upload__drag-area--processing': isProcessing,
        }"
        class="vt-upload__drag-area"
        @click="openFileDialog"
        @dragleave="handleDragLeave"
        @dragover="handleDragOver"
        @drop="handleDrop"
      >
        <div class="vt-upload__icon">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 18C4.23858 18 2 15.7614 2 13C2 10.4003 3.98398 8.26407 6.52042 8.02426C7.46568 5.08481 10.4632 3 14 3C18.4183 3 22 6.58172 22 11C22 11.3375 21.9808 11.6703 21.9434 12H21.8C19.1072 12 17 14.2386 17 17C17 17.3438 17.0388 17.6782 17.1125 18H7Z"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
            <path
              d="M12 12V21M12 12L15 15M12 12L9 15"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>

        <div class="vt-upload__text">
          <span class="vt-upload__placeholder">
            {{ placeholderText }}
          </span>
        </div>

        <div v-if="tipText" class="vt-upload__tip">
          {{ tipText }}
        </div>
      </div>

      <!-- Button Upload -->
      <VButton
        v-else
        :disabled="isDisabled || !canAddMoreFiles"
        icon="uploadCloud"
        type="primary"
        @click="openFileDialog"
      >
        {{ t(LOCALE_KEYS.UPLOAD_BUTTON_TEXT) }}
      </VButton>
    </template>

    <!-- File List -->
    <div v-if="uploadedFiles.length > 0" class="vt-upload__list">
      <div v-for="file in uploadedFiles" :key="file.id" class="vt-upload__list-item">
        <div class="vt-upload__list-item-icon">
          <VIcon name="fileDoc" />
        </div>

        <div class="vt-upload__list-item-info">
          <div class="vt-upload__list-item-name">{{ file.name }}</div>
          <div class="vt-upload__list-item-size">{{ FileValidator.formatFileSize(file.size) }}</div>
        </div>

        <button :disabled="isDisabled" class="vt-upload__list-item-remove" type="button" @click="removeFile(file)">
          <VIcon name="delete" />
        </button>
      </div>
    </div>

    <input
      ref="fileInputRef"
      :accept="accept"
      :disabled="isDisabled"
      :multiple="multiple"
      class="vt-upload__input"
      type="file"
      @change="handleFileInputChange"
    />
  </div>
</template>
