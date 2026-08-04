<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import type { VVideoPlayerProps, VVideoPlayerEmits } from './types';

  const props = defineProps<VVideoPlayerProps>();
  const emit = defineEmits<VVideoPlayerEmits>();

  const videoRef = ref<HTMLVideoElement | null>(null);
  const isWrapperButton = ref(true);
  const isPendingPlay = ref(false);

  const playVideoElement = () => {
    videoRef.value?.play();
  };

  const handlePlayVideo = () => {
    isWrapperButton.value = false;

    if (props.videoBlob) {
      // videoRef ще не змонтований у той самий тік (v-if щойно відкрив video),
      // тому чекаємо наступний рендер-цикл
      isPendingPlay.value = true;
      return;
    }

    // videoBlob ще не завантажено — просимо батьківський компонент підвантажити,
    // і чекаємо на watch нижче, щоб автоматично стартувати play, коли він прийде
    isPendingPlay.value = true;
    emit('asyncUploadVideo');
  };

  watch(
    () => props.videoBlob,
    newValue => {
      if (newValue && isPendingPlay.value) {
        isPendingPlay.value = false;
        // videoRef з'явиться в DOM після зміни videoBlob (v-if стає true) —
        // watch на ref теж потрібен, бо він може ще не бути змонтований
      }
    }
  );

  watch(videoRef, newEl => {
    if (newEl && isPendingPlay.value) {
      isPendingPlay.value = false;
      playVideoElement();
    }
  });
</script>

<template>
  <div class="vt-video-player position-relative">
    <video
      v-if="videoBlob && !isWrapperButton"
      ref="videoRef"
      :src="videoBlob as string"
      controls
      width="100%"
      class="vt-video-player__video"
    >
      Your browser does not support the video tag.
    </video>

    <div
      v-if="isWrapperButton"
      class="vt-video-player__play-btn position-absolute flex flex-content-center flex-aling-center"
      @click="handlePlayVideo"
    >
      <span></span>
    </div>
  </div>
</template>