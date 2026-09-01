<script lang="ts" setup>
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import WaveSurfer from 'wavesurfer.js';
  import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';

  // Types
  import type { PlaybackSpeed, VAudioEmits, VAudioProps, WaveSurferInstance } from './types';
  import { CHANNEL_COLORS } from './types';
  import VEmpty from '@/components/empty/VEmpty.vue';
  import { useI18n } from '@/locales/useI18n';
  import { LOCALE_KEYS } from '@/locales/types';
  import VDropdown from '@/components/dropdown/VDropdown.vue';
  import VIcon from '@/components/icon/VIcon.vue';
  import VDropdownItem from '@/components/dropdown/VDropdownItem.vue';

  interface ClickableArea {
    x: number;
    y: number;
    width: number;
    height: number;
    channelIdx: 0 | 1;
  }

  type CreateImageFn = (color: string, callback: (img: HTMLImageElement) => void) => void;

  const svgToImage = (svgString: string, callback: (img: HTMLImageElement) => void): void => {
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
    img.onload = () => callback(img);
  };

  const createVolumeImage: CreateImageFn = (color, callback) =>
    svgToImage(
      `<svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.9167 7.4982C13.3072 7.88555 13.6172 8.34639 13.8287 8.85413C14.0403 9.36188
               14.1492 9.90649 14.1492 10.4565C14.1492 11.0066 14.0403 11.5512 13.8287 12.0589
               C13.6172 12.5667 13.3072 13.0275 12.9167 13.4149M15.3333 15.8315C16.0388 15.134
               16.5989 14.3035 16.9812 13.388C17.3634 12.4725 17.5602 11.4903 17.5602 10.4982
               C17.5602 9.50612 17.3634 8.5239 16.9812 7.60841C16.5989 6.69293 16.0388 5.86238
               15.3333 5.16487M10 5.58154V15.4982C9.98569 15.6458 9.93223 15.787 9.84513 15.9071
               C9.75804 16.0272 9.64047 16.1218 9.50457 16.1813C9.36867 16.2407 9.21936 16.2628
               9.07206 16.2453C8.92476 16.2278 8.78481 16.1712 8.66667 16.0815L5 12.9982H3.33333
               C3.11232 12.9982 2.90036 12.9104 2.74408 12.7541C2.5878 12.5978 2.5 12.3859 2.5
               12.1649V8.83154C2.5 8.33154 2.83333 7.9982 3.33333 7.9982H5L8.66667 4.9982
               C8.77919 4.90986 8.91256 4.85197 9.05394 4.8301C9.19532 4.80824 9.33994 4.82314
               9.4739 4.87337C9.60785 4.9236 9.72661 5.00747 9.81875 5.11691C9.9109 5.22634
               9.97332 5.35765 10 5.4982V5.58154Z"
        stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
      callback
    );

  const createNoVolumeImage: CreateImageFn = (color, callback) =>
    svgToImage(
      `<svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path  d="M10 5.58154V15.4982C9.98569 15.6458 9.93223 15.787 9.84513 15.9071C9.75804 16.0272
               9.64047 16.1218 9.50457 16.1813C9.36867 16.2407 9.21936 16.2628 9.07206 16.2453
               C8.92476 16.2278 8.78481 16.1712 8.66667 16.0815L5 12.9982H3.33333C3.11232 12.9982
               2.90036 12.9104 2.74408 12.7541C2.5878 12.5978 2.5 12.3859 2.5 12.1649V8.83154
               C2.5 8.33154 2.83333 7.9982 3.33333 7.9982H5L8.66667 4.9982C8.77919 4.90986
               8.91256 4.85197 9.05394 4.8301C9.19532 4.80824 9.33994 4.82314 9.4739 4.87337
               C9.60785 4.9236 9.72661 5.00747 9.81875 5.11691C9.9109 5.22634 9.97332 5.35765
               10 5.4982V5.58154Z" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.916 7.4974C13.3066 7.88474 13.6165 8.34558 13.8281 8.85333C14.0396 9.36107
               14.1485 9.90568 14.1485 10.4557C14.1485 11.0058 14.0396 11.5504 13.8281 12.0581
               C13.6165 12.5659 13.3066 13.0267 12.916 13.4141M15.3327 15.8307C16.0382 15.1332
               16.5982 14.3027 16.9805 13.3872C17.3628 12.4717 17.5596 11.4895 17.5596 10.4974
               C17.5596 9.50531 17.3628 8.52309 16.9805 7.60761C16.5982 6.69212 16.0382 5.86158
               15.3327 5.16406" stroke="#F2F2F2" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
      callback
    );

  const canvasClickHandlers = new WeakMap<HTMLCanvasElement, (e: MouseEvent) => void>();

  const { t } = useI18n();

  const props = withDefaults(defineProps<VAudioProps>(), {
    recordUrl: '',
    userA: '',
    userB: '',
    disabled: false,
    type: 'default',
    download: true,
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
    const canvas = ctx.canvas;
    const { width, height } = canvas;
    const decoded = wavesurfer.value?.decodedData;

    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width > 0 ? width / rect.width : 1;
    const scaleY = rect.height > 0 ? height / rect.height : 1;

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

    const TOP_MARGIN = 20 * scaleY;
    const ICON_SIZE_CSS = 20;
    const ICON_SIZE = ICON_SIZE_CSS * scaleX;
    const localAreas: ClickableArea[] = [];

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
        ctx.font = `${12 * scaleX}px Inter, sans-serif`;
        ctx.textAlign = 'right';
        const userName = (idx === 0 ? props.userA : props.userB) ?? '';
        ctx.fillText(userName, width - 10 * scaleX, idx * chH + TOP_MARGIN - 5 * scaleY);

        // ── Іконка mute/unmute ──
        const channelIdx = idx as 0 | 1;
        const iconX = 5 * scaleX;
        const iconY = idx * chH + 1 * scaleY;
        const isMuted = (channelIdx === 0 ? stateLeft.value : stateRight.value) === 0;

        (isMuted ? createNoVolumeImage : createVolumeImage)(
          channelIdx === 0 ? CHANNEL_COLORS.CHANNEL_A : CHANNEL_COLORS.CHANNEL_B,
          img => ctx.drawImage(img, iconX, iconY, ICON_SIZE, ICON_SIZE)
        );

        localAreas.push({ x: iconX, y: iconY, width: ICON_SIZE, height: ICON_SIZE, channelIdx });
      }
    });

    if (isMultiChannelMode.value) {
      const oldHandler = canvasClickHandlers.get(canvas);
      if (oldHandler) canvas.removeEventListener('click', oldHandler);

      const clickHandler = (event: MouseEvent): void => {
        if (isPlayerDisabled.value) return;

        const rect = canvas.getBoundingClientRect();
        const sx = rect.width > 0 ? canvas.width / rect.width : 1;
        const sy = rect.height > 0 ? canvas.height / rect.height : 1;
        const clickX = (event.clientX - rect.left) * sx;
        const clickY = (event.clientY - rect.top) * sy;

        for (const area of localAreas) {
          if (clickX >= area.x && clickX <= area.x + area.width && clickY >= area.y && clickY <= area.y + area.height) {
            event.stopPropagation();
            event.preventDefault();
            toggleChannelMute(area.channelIdx);

            const isMutedNow = (area.channelIdx === 0 ? stateLeft.value : stateRight.value) === 0;
            ctx.save();
            ctx.clearRect(area.x, area.y, area.width, area.height);
            (isMutedNow ? createNoVolumeImage : createVolumeImage)(
              area.channelIdx === 0 ? CHANNEL_COLORS.CHANNEL_A : CHANNEL_COLORS.CHANNEL_B,
              img => ctx.drawImage(img, area.x, area.y, area.width, area.height)
            );
            ctx.restore();
            break;
          }
        }
      };

      canvas.addEventListener('click', clickHandler);
      canvasClickHandlers.set(canvas, clickHandler);
    }
  };

  const waveformHeight = computed<number>(() => {
    if (props.height) {
      const parsed = parseInt(props.height, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return isChannelRoutedMode.value ? 36 : isMultiChannelMode.value ? 100 : 50;
  });

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

    if (isMultiChannelMode.value) {
      leftGain.value.connect(merger, 0, 0);
      rightGain.value.connect(merger, 0, 1);
    } else {
      leftGain.value.connect(merger, 0, 0);
      leftGain.value.connect(merger, 0, 1);
      rightGain.value.connect(merger, 0, 0);
      rightGain.value.connect(merger, 0, 1);
    }

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
      height: waveformHeight.value,
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
  <div :class="{ 'is-disabled': isPlayerDisabled, 'is-channel-routed': isChannelRoutedMode }" class="vt-audio">
    <div v-if="!recordUrl" class="vt-audio__empty">
      <slot name="empty">
        <VEmpty v-if="!isChannelRoutedMode" :text="t(LOCALE_KEYS.AUDIO_EMPTY)" icon="noSound" />
        <span v-else>{{ t(LOCALE_KEYS.AUDIO_EMPTY) }}</span>
      </slot>
    </div>

    <div
      v-else
      :class="{ 'is-single-channel': !isMultiChannelMode, 'is-channel-routed': isChannelRoutedMode }"
      class="vt-audio__container"
    >
      <button :disabled="isPlayerDisabled" class="vt-audio__btn vt-audio__btn--main" @click="togglePlay">
        <slot v-if="isPlay" name="icon-pause">
          <VIcon height="24" name="pause" width="24" />
        </slot>
        <slot v-else name="icon-play">
          <VIcon height="24" name="start" width="24" />
        </slot>
      </button>
      <div class="vt-audio__wave-area">
        <div :id="`waveform-${uuid}`" class="vt-audio__waveform"></div>
        <div v-if="!isChannelRoutedMode" ref="timelineContainer" class="vt-audio__timeline"></div>
      </div>

      <div class="vt-audio__controls">
        <button v-if="props.download" :disabled="isPlayerDisabled" class="vt-audio__btn" @click="downloadRecord">
          <VIcon height="20" name="import" width="20" />
        </button>

        <VDropdown :disabled="isPlayerDisabled" placement="top" trigger="click" @command="handleSpeedChange">
          <button :disabled="isPlayerDisabled" class="vt-audio__speed-val"> {{ activeSpeed }}x</button>
          <template #dropdown>
            <VDropdownItem
              v-for="s in [0.5, 1, 1.5, 2]"
              :key="s"
              :class="{ 'is-active': activeSpeed === s }"
              :command="s"
            >
              {{ s }}x
            </VDropdownItem>
          </template>
        </VDropdown>
      </div>
    </div>
  </div>
</template>
