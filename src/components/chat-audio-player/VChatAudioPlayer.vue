<script lang="ts" setup>
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
  import type { VChatAudioPlayerProps } from './types';

  const props = defineProps<VChatAudioPlayerProps>();

  const audioElement = ref<HTMLAudioElement | null>(null);
  const waveformCanvas = ref<HTMLCanvasElement | null>(null);
  const waveformData = ref<[number, number][]>([]);

  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const animationFrameId = ref<number>(0);

  // AudioContext потрібен лише для decodeAudioData (побудова waveform),
  // не для відтворення — сам звук грає через <audio>/Audio() елемент.
  let audioContext: AudioContext | null = null;
  const getAudioContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
  };

  const onTimeUpdate = () => {
    if (audioElement.value) currentTime.value = audioElement.value.currentTime;
  };

  const onEnded = () => {
    isPlaying.value = false;
    cancelAnimationFrame(animationFrameId.value);
  };

  const formattedTime = computed(() => {
    const mins = Math.floor(currentTime.value / 60);
    const secs = Math.floor(currentTime.value % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  });

  const formattedDuration = computed(() => {
    const mins = Math.floor(duration.value / 60);
    const secs = Math.floor(duration.value % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  });

  const togglePlayPause = () => {
    if (!audioElement.value) return;

    if (isPlaying.value) {
      audioElement.value.pause();
      cancelAnimationFrame(animationFrameId.value);
    } else {
      audioElement.value.play();
      drawWaveform();
    }
    isPlaying.value = !isPlaying.value;
  };

  const cleanupAudioElement = () => {
    if (audioElement.value) {
      audioElement.value.pause();
      audioElement.value.removeEventListener('timeupdate', onTimeUpdate);
      audioElement.value.removeEventListener('ended', onEnded);
      audioElement.value = null;
    }
    cancelAnimationFrame(animationFrameId.value);
  };

  const loadAudio = async (audioSrc: string) => {
    if (!audioSrc) return;

    cleanupAudioElement();

    const el = new Audio(audioSrc);
    audioElement.value = el;

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('ended', onEnded);

    await new Promise<void>(resolve => {
      el.addEventListener('loadedmetadata', () => resolve(), { once: true });
    });
    duration.value = el.duration;

    try {
      const response = await fetch(audioSrc);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await getAudioContext().decodeAudioData(arrayBuffer);
      generateWaveform(audioBuffer);
      drawWaveform();
    } catch (e) {
      console.error('VChatAudioPlayer: failed to decode audio for waveform', e);
    }
  };

  const generateWaveform = (audioBuffer: AudioBuffer) => {
    const channelData = audioBuffer.getChannelData(0);
    const length = channelData.length;
    const numBars = 150;
    const step = Math.floor(length / numBars);

    waveformData.value = [];

    for (let i = 0; i < numBars; i++) {
      const segment = channelData.slice(i * step, (i + 1) * step);
      const min = segment.reduce((acc, val) => Math.min(acc, val), Infinity);
      const max = segment.reduce((acc, val) => Math.max(acc, val), -Infinity);
      waveformData.value.push([min, max]);
    }
  };

  const drawWaveform = () => {
    if (!waveformCanvas.value) return;

    const canvas = waveformCanvas.value;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const barWidth = canvas.width / waveformData.value.length;
    const halfCanvasHeight = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    waveformData.value.forEach(([min, max], i) => {
      const xPos = i * barWidth;
      const barHeightMin = Math.max(0.1, (0.5 + min) * 4.95 * canvas.height);
      const barHeightMax = Math.max(0.1, (0.5 + max) * 4.95 * canvas.height);
      const barHeight = Math.abs(barHeightMax - barHeightMin);
      const yPos = halfCanvasHeight - barHeight / 2;

      const isPlayed =
        audioElement.value && audioElement.value.currentTime / audioElement.value.duration > i / waveformData.value.length;

      ctx.fillStyle = isPlayed ? '#FFBD3E' : '#fff';
      ctx.fillRect(xPos, yPos, barWidth, barHeight);

      if (Math.abs(min) < 0.01 && Math.abs(max) < 0.01) {
        ctx.fillStyle = isPlayed ? '#FFBD3E' : '#fff';
        ctx.fillRect(xPos, halfCanvasHeight, barWidth, 2);
      }
    });

    if (isPlaying.value) {
      animationFrameId.value = requestAnimationFrame(drawWaveform);
    }
  };

  const seekAudio = (event: MouseEvent) => {
    if (!audioElement.value || !waveformCanvas.value) return;
    const rect = waveformCanvas.value.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickPosition = clickX / rect.width;
    audioElement.value.currentTime = clickPosition * audioElement.value.duration;
  };

  const downloadFile = () => {
    if (!props.audioSrc) return;
    const link = document.createElement('a');
    link.href = props.audioSrc;
    link.download = props.fileName || 'audio-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  watch(
    () => props.audioSrc,
    async newUrl => {
      if (newUrl) {
        await nextTick();
        await loadAudio(newUrl);
      } else {
        cleanupAudioElement();
        isPlaying.value = false;
        currentTime.value = 0;
        duration.value = 0;
        waveformData.value = [];
      }
    }
  );

  onMounted(async () => {
    const canvas = waveformCanvas.value;
    if (canvas) {
      canvas.width = 400;
      canvas.height = 40;
    }

    if (props.audioSrc) {
      await nextTick();
      await loadAudio(props.audioSrc);
    }
  });

  onUnmounted(() => {
    cleanupAudioElement();
    audioContext?.close();
    audioContext = null;
  });
</script>

<template>
  <div class="vt-chat-audio-player flex gap-10 p-5">
    <div class="vt-chat-audio-player__play-wrapper flex flex-column flex-align-start flex-align-center">
      <button
        class="vt-chat-audio-player__btn flex flex-content-center flex-align-center cursor-pointer"
        @click="togglePlayPause"
      >
        <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6zm8-14v14h4V5z" />
        </svg>
      </button>
    </div>

    <div class="vt-chat-audio-player__waveform-container w-100">
      <div class="vt-chat-audio-player__waveform" @click="seekAudio">
        <canvas ref="waveformCanvas"></canvas>
      </div>
      <div class="vt-chat-audio-player__info flex flex-align-start mt-5">
        <div
          class="vt-chat-audio-player__download"
          :class="{ 'body-disabled': !audioSrc }"
          @click="downloadFile()"
        >
          <VIcon name="circleDownload" />
        </div>
        <div class="vt-chat-audio-player__timer">{{ formattedTime }} / {{ formattedDuration }}</div>
      </div>
    </div>
  </div>
</template>