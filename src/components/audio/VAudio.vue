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
  import VEmpty from '@/components/empty/VEmpty.vue';
  import { useI18n } from '@/locales/useI18n';
  import { LOCALE_KEYS } from '@/locales/types';

  const { t } = useI18n();

  const props = withDefaults(defineProps<VAudioProps>(), {
    recordUrl: '',
    userA: '',
    userB: '',
    disabled: false,
    type: 'default',
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
  const leftGain = ref<GainNode | null>(null);
  const rightGain = ref<GainNode | null>(null);

  const isChannelRoutedMode = computed(() => props.type === 'channel-routed');

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

    const TOP_MARGIN = 20;

    channels.forEach((data, idx) => {
      const chH = height / channels.length;
      const available = chH - (isMultiChannelMode.value ? TOP_MARGIN : 0);
      const centerY = idx * chH + (isMultiChannelMode.value ? TOP_MARGIN : 0) + available / 2;
      const scale = data.length / width;

      let maxAmp = 0;
      for (let i = 0; i < data.length; i += 100) {
        const v = Math.abs(data[i] ?? 0);
        if (v > maxAmp) maxAmp = v;
      }
      if (maxAmp === 0) maxAmp = 1;

      ctx.fillStyle = CHANNEL_COLORS.WAVE_DEFAULT;

      for (let i = 0; i < width; i += 2) {
        const startIdx = Math.floor(i * scale);
        const endIdx = Math.min(Math.floor((i + 2) * scale), data.length - 1);
        let maxVal = 0;
        for (let j = startIdx; j <= endIdx; j++) {
          const v = Math.abs(data[j] ?? 0);
          if (v > maxVal) maxVal = v;
        }
        const normalized = maxVal / maxAmp;
        const barH = Math.max(normalized * available * 0.85, 2);
        ctx.fillRect(i, centerY - barH / 2, 1.5, barH);
      }

      if (isMultiChannelMode.value) {
        ctx.fillStyle = '#999999';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'right';
        const userName = (idx === 0 ? props.userA : props.userB) ?? '';
        ctx.fillText(userName, width - 10, idx * chH + TOP_MARGIN - 5);
      }
    });
  };

  const setupChannelRouting = () => {
    const mediaElement = wavesurfer.value?.getMediaElement();
    if (!mediaElement) return;

    audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.value.createMediaElementSource(mediaElement);
    const splitter = audioContext.value.createChannelSplitter(2);
    const merger = audioContext.value.createChannelMerger(2);

    leftGain.value = audioContext.value.createGain();
    rightGain.value = audioContext.value.createGain();

    leftGain.value.gain.value = stateLeft.value;
    rightGain.value.gain.value = stateRight.value;

    source.connect(splitter);
    splitter.connect(leftGain.value, 0);
    splitter.connect(rightGain.value, 1);
    leftGain.value.connect(merger, 0, 0);
    rightGain.value.connect(merger, 0, 1);
    merger.connect(audioContext.value.destination);
  };

  const teardownChannelRouting = () => {
    audioContext.value?.close();
    audioContext.value = null;
    leftGain.value = null;
    rightGain.value = null;
  };

  const initWaveSurfer = () => {
    if (!props.recordUrl) return;
    isError.value = false;

    const ws = WaveSurfer.create({
      container: `#waveform-${uuid.value}`,
      waveColor: CHANNEL_COLORS.WAVE_DEFAULT,
      progressColor: CHANNEL_COLORS.PROGRESS,
      barWidth: 2,
      height: isChannelRoutedMode.value ? 36 : isMultiChannelMode.value ? 100 : 50,
      plugins: isChannelRoutedMode.value
        ? []
        : [
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

    if (isMultiChannelMode.value || isChannelRoutedMode.value) {
      wavesurfer.value.on('ready', () => {
        setupChannelRouting();
        attachMuteClickHandler();
      });
    }

    wavesurfer.value.load(props.recordUrl);
  };

  const stateLeft = ref<0 | 1>(1);
  const stateRight = ref<0 | 1>(1);

  const toggleChannelMute = (idx: 0 | 1) => {
    const gain = idx === 0 ? leftGain.value : rightGain.value;
    const state = idx === 0 ? stateLeft : stateRight;
    state.value = state.value ? 0 : 1;
    if (gain) gain.gain.value = state.value;
  };

  const MUTE_ICON = { x: 5, y: 0, size: 18 };

  const attachMuteClickHandler = () => {
    const canvas = document.querySelector(`#waveform-${uuid.value} canvas`) as HTMLCanvasElement | null;
    if (!canvas || !isMultiChannelMode.value) return;

    canvas.addEventListener('click', (event: MouseEvent) => {
      if (isPlayerDisabled.value) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
      const chH = rect.height / 2;

      [0, 1].forEach((idx) => {
        const areaY = idx * chH + MUTE_ICON.y;
        if (
          clickX >= MUTE_ICON.x && clickX <= MUTE_ICON.x + MUTE_ICON.size &&
          clickY >= areaY && clickY <= areaY + MUTE_ICON.size
        ) {
          event.stopPropagation();
          event.preventDefault();
          toggleChannelMute(idx as 0 | 1);
        }
      });
    });
  };

  const togglePlay = async () => {
    if (!wavesurfer.value || isPlayerDisabled.value) return;

    if (isChannelRoutedMode.value) {
      const mediaElement = wavesurfer.value.getMediaElement();
      if (!mediaElement || !audioContext.value) return;

      if (audioContext.value.state === 'suspended') {
        await audioContext.value.resume();
      }

      mediaElement.paused ? await mediaElement.play() : mediaElement.pause();
      return;
    }

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
  onBeforeUnmount(() => {
    wavesurfer.value?.destroy();
    teardownChannelRouting();
  });
  watch(
    () => props.recordUrl,
    () => {
      wavesurfer.value?.destroy();
      teardownChannelRouting();
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
  <div class="vt-audio" :class="{ 'is-disabled': isPlayerDisabled, 'is-channel-routed': isChannelRoutedMode }">
    <div v-if="!recordUrl" class="vt-audio__empty">
      <slot name="empty">
        <VEmpty v-if="!isChannelRoutedMode" icon="noSound" :text="t(LOCALE_KEYS.AUDIO_EMPTY)" />
        <span v-else>{{ t(LOCALE_KEYS.AUDIO_EMPTY) }}</span>
      </slot>
    </div>

    <div v-else class="vt-audio__container" :class="{ 'is-single-channel': !isMultiChannelMode, 'is-channel-routed': isChannelRoutedMode }">
      <div class="vt-audio__wave-area">
        <div :id="`waveform-${uuid}`" class="vt-audio__waveform"></div>
        <div v-if="!isChannelRoutedMode" ref="timelineContainer" class="vt-audio__timeline"></div>
      </div>

      <div class="vt-audio__controls">
        <template v-if="!isChannelRoutedMode">
          <button class="vt-audio__btn" :disabled="isPlayerDisabled" @click="downloadRecord">
            <VIcon name="import" width="20" height="20" />
          </button>

          <VDropdown trigger="click" placement="top" :disabled="isPlayerDisabled" @command="handleSpeedChange">
            <button class="vt-audio__speed-val" :disabled="isPlayerDisabled"> {{ activeSpeed }}x</button>
            <template #dropdown>
              <VDropdownItem v-for="s in [1, 1.5, 2]" :key="s" :command="s" :class="{ 'is-active': activeSpeed === s }">
                {{ s }}x
              </VDropdownItem>
            </template>
          </VDropdown>
        </template>

        <button class="vt-audio__btn vt-audio__btn--main" :disabled="isPlayerDisabled" @click="togglePlay">
          <slot v-if="isPlay" name="icon-pause">
            <VIcon name="pause" width="24" height="24" />
          </slot>
          <slot v-else name="icon-play">
            <VIcon name="start" width="24" height="24" />
          </slot>
        </button>
      </div>
    </div>
  </div>
</template>
