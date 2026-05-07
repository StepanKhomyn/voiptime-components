<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import WaveSurfer from 'wavesurfer.js';
  import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';

  // Components
  import VIcon from '@/components/icon/VIcon.vue';
  import VDropdown from '@/components/dropdown/VDropdown.vue';
  import VDropdownItem from '@/components/dropdown/VDropdownItem.vue';

  // Types
  import type { PlaybackSpeed, VAudioEmits, VAudioProps, WaveSurferInstance } from './types';
  import { CHANNEL_COLORS } from './types';

  const props = withDefaults(defineProps<VAudioProps>(), {
    recordUrl: '',
    userA: '',
    userB: '',
    disabled: false,
  });

  const emit = defineEmits<VAudioEmits>();

  // State
  const isMultiChannelMode = computed(() => !!(props.userA || props.userB));
  const isError = ref(false);
  const isPlayerDisabled = computed(() => props.disabled || isError.value);
  const isPlay = ref(false);
  const activeSpeed = ref<PlaybackSpeed>(1);

  const uuid = ref(`ws-${Math.random().toString(36).slice(2, 9)}`);
  const wavesurfer = ref<WaveSurferInstance | null>(null);
  const timelineContainer = ref<HTMLElement | null>(null);
  const audioContext = ref<AudioContext | null>(null);

  const drawWaveform = (peaks: Float32Array[], ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    const decoded = wavesurfer.value?.decodedData;

    if (!peaks.length && !decoded) {
      ctx.fillStyle = CHANNEL_COLORS.WAVE_DEFAULT;
      ctx.fillRect(0, height / 2, width, 2);
      return;
    }

    const channels =
      isMultiChannelMode.value && decoded && decoded.numberOfChannels >= 2
        ? [decoded.getChannelData(0), decoded.getChannelData(1)]
        : [peaks[0] || new Float32Array(width).fill(0)];

    ctx.clearRect(0, 0, width, height);

    channels.forEach((data, idx) => {
      const chH = height / channels.length;
      const centerY = idx * chH + chH / 2;
      const step = Math.ceil(data.length / width);

      ctx.fillStyle = CHANNEL_COLORS.WAVE_DEFAULT;

      for (let i = 0; i < width; i += 2) {
        const val = Math.abs(data[i * step] || 0);
        const barH = Math.max(val * chH * 0.8, 2);
        ctx.fillRect(i, centerY - barH / 2, 1.5, barH);
      }

      if (isMultiChannelMode.value) {
        ctx.fillStyle = '#999999';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        const userName = (idx === 0 ? props.userA : props.userB) ?? '';
        ctx.fillText(userName, width - 10, idx * chH + 15);
      }
    });
  };

  const initWaveSurfer = () => {
    if (!props.recordUrl) return;
    isError.value = false;

    const ws = WaveSurfer.create({
      container: `#waveform-${uuid.value}`,
      waveColor: CHANNEL_COLORS.WAVE_DEFAULT,
      progressColor: CHANNEL_COLORS.PROGRESS,
      barWidth: 2,
      height: isMultiChannelMode.value ? 100 : 50,
      plugins: [
        TimelinePlugin.create({
          container: timelineContainer.value!,
          style: { fontSize: '10px', color: '#999' },
        }),
      ],
      renderFunction: (peaks, ctx) => drawWaveform(peaks as any, ctx),
    });

    wavesurfer.value = ws as unknown as WaveSurferInstance;

    wavesurfer.value.on('play', () => {
      isPlay.value = true;
      emit('play');
    });
    wavesurfer.value.on('pause', () => {
      isPlay.value = false;
      emit('pause');
    });
    wavesurfer.value.on('timeupdate', t => emit('timeUpdate', t));
    wavesurfer.value.on('finish', () => {
      isPlay.value = false;
      emit('ended');
    });
    wavesurfer.value.on('error', () => {
      isError.value = true;
      emit('error');
    });

    wavesurfer.value.load(props.recordUrl);
  };

  const togglePlay = async () => {
    if (!wavesurfer.value || isPlayerDisabled.value) return;
    isPlay.value ? wavesurfer.value.pause() : wavesurfer.value.play();
  };

  const handleSpeedChange = (speed: any) => {
    activeSpeed.value = speed as PlaybackSpeed;
    wavesurfer.value?.setPlaybackRate(activeSpeed.value);
  };

  const downloadURI = (uri: string, name: string): void => {
    const isBase64 = uri.startsWith('data:');

    if (isBase64) {
      const link = document.createElement('a');
      link.href = uri;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      fetch(uri)
        .then(response => response.blob())
        .then(blob => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(console.error);
    }
  };

  const downloadRecord = () => {
    if (props.disabled || !props.recordUrl) return;
    const qi = props.recordUrl.indexOf('?');
    const fileName = props.recordUrl.substring(props.recordUrl.lastIndexOf('/') + 1, qi === -1 ? undefined : qi);
    downloadURI(props.recordUrl, fileName);
  };

  onMounted(() => nextTick(initWaveSurfer));
  onBeforeUnmount(() => wavesurfer.value?.destroy());

  watch(
    () => props.recordUrl,
    () => {
      wavesurfer.value?.destroy();
      nextTick(initWaveSurfer);
    }
  );

  defineExpose({
    play: () => wavesurfer.value?.play(),
    pause: () => wavesurfer.value?.pause(),
    getCurrentTime: () => wavesurfer.value?.getCurrentTime() || 0,
  });
</script>

<template>
  <div class="vt-audio" :class="{ 'is-disabled': isPlayerDisabled }">
    <div v-if="!recordUrl" class="vt-audio__empty">
      <slot name="empty">Запис не знайдено</slot>
    </div>

    <div v-else class="vt-audio__container">
      <div class="vt-audio__wave-area">
        <div :id="`waveform-${uuid}`" class="vt-audio__waveform"></div>
        <div ref="timelineContainer" class="vt-audio__timeline"></div>
      </div>

      <div class="vt-audio__controls">
        <button class="vt-audio__btn" :disabled="isPlayerDisabled" @click="downloadRecord">
          <VIcon name="import" />
        </button>

        <VDropdown trigger="click" placement="top" :disabled="isPlayerDisabled" @command="handleSpeedChange">
          <button class="vt-audio__speed-val" :disabled="isPlayerDisabled"> {{ activeSpeed }}x</button>
          <template #dropdown>
            <VDropdownItem v-for="s in [1, 1.5, 2]" :key="s" :command="s" :class="{ 'is-active': activeSpeed === s }">
              {{ s }}x
            </VDropdownItem>
          </template>
        </VDropdown>

        <button class="vt-audio__btn vt-audio__btn--main" :disabled="isPlayerDisabled" @click="togglePlay">
          <slot v-if="isPlay" name="icon-pause">
            <VIcon name="pause" />
          </slot>
          <slot v-else name="icon-play">
            <VIcon name="start" />
          </slot>
        </button>
      </div>
    </div>
  </div>
</template>
