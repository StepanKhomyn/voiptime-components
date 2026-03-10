<template>
  <div
    class="v-slider"
    :class="{
      'v-slider--vertical': vertical,
      'v-slider--disabled': disabled,
      'v-slider--with-input': showInput && !range,
    }"
  >
    <label v-if="label" class="v-slider__label" :aria-label="label">{{ label }}</label>

    <div class="v-slider__wrapper">
      <div
        ref="sliderRef"
        class="v-slider__runway"
        :style="runwayStyle"
        @click="onRunwayClick"
      >
        <!-- Filled bar -->
        <div class="v-slider__bar" :style="barStyle" />

        <!-- Stop dots -->
        <template v-if="showStops">
          <div
            v-for="stop in stopList"
            :key="stop"
            class="v-slider__stop"
            :style="getStopStyle(stop)"
          />
        </template>

        <!-- Custom marks -->
        <template v-if="marks">
          <div
            v-for="(mark, key) in marks"
            :key="key"
            class="v-slider__mark"
            :style="getMarkStyle(Number(key))"
          >
            <div
              class="v-slider__mark-dot"
              :style="typeof mark === 'object' && mark.style ? mark.style : {}"
            />
            <div class="v-slider__mark-label">
              {{ typeof mark === 'object' ? mark.label : mark }}
            </div>
          </div>
        </template>

        <!-- First thumb -->
        <div
          ref="thumb1Ref"
          class="v-slider__thumb-wrapper"
          :style="thumb1Style"
          tabindex="0"
          role="slider"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="range ? (currentValue as [number,number])[0] : (currentValue as number)"
          :aria-disabled="disabled"
          @mousedown.stop="onThumbMousedown($event, 'first')"
          @touchstart.stop.passive="onThumbTouchstart($event, 'first')"
          @keydown="onThumbKeydown($event, 'first')"
          @focus="tooltip1Visible = showTooltip"
          @blur="tooltip1Visible = false"
        >
          <div v-if="showTooltip && tooltip1Visible" class="v-slider__tooltip">
            {{ formatTooltipValue(range ? (currentValue as [number,number])[0] : (currentValue as number)) }}
          </div>
          <div class="v-slider__thumb" />
        </div>

        <!-- Second thumb (range mode only) -->
        <div
          v-if="range"
          ref="thumb2Ref"
          class="v-slider__thumb-wrapper"
          :style="thumb2Style"
          tabindex="0"
          role="slider"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="(currentValue as [number,number])[1]"
          :aria-disabled="disabled"
          @mousedown.stop="onThumbMousedown($event, 'second')"
          @touchstart.stop.passive="onThumbTouchstart($event, 'second')"
          @keydown="onThumbKeydown($event, 'second')"
          @focus="tooltip2Visible = showTooltip"
          @blur="tooltip2Visible = false"
        >
          <div v-if="showTooltip && tooltip2Visible" class="v-slider__tooltip">
            {{ formatTooltipValue((currentValue as [number,number])[1]) }}
          </div>
          <div class="v-slider__thumb" />
        </div>
      </div>

      <!-- Input box -->
      <div v-if="showInput && !range" class="v-slider__input-wrapper">
        <VInput
          :class="`v-slider__input--${inputSize}`"
          v-model="inputValue"
          type="number"
          :disabled="disabled"
          @change="onInputBlur"
        />
        <template v-if="showInputControls">
          <button class="v-slider__input-btn" :disabled="disabled" @click="decrement">−</button>
          <button class="v-slider__input-btn" :disabled="disabled" @click="increment">+</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import type { SliderValue } from './types';
  import type { VSliderEmits, VSliderProps } from './types';
  import VInput from '@/components/input/VInput.vue';

  const props = withDefaults(
    defineProps<VSliderProps>(),
    {
      modelValue: 0,
      min: 0,
      max: 100,
      disabled: false,
      step: 1,
      showInput: false,
      showInputControls: true,
      inputSize: 'small',
      showStops: false,
      showTooltip: true,
      range: false,
      vertical: false,
      height: '200px',
      debounce: 300,
    },
  );

  const emit = defineEmits<VSliderEmits>();

  const sliderRef = ref<HTMLElement | null>(null);
  const thumb1Ref = ref<HTMLElement | null>(null);
  const thumb2Ref = ref<HTMLElement | null>(null);
  const tooltip1Visible = ref(false);
  const tooltip2Visible = ref(false);
  const isDragging = ref(false);

  // ── Value normalization ───────────────────────────────────
  const normalizeValue = (val: SliderValue): SliderValue => {
    if (props.range) {
      return Array.isArray(val) ? ([...val] as [number, number]) : [props.min, props.max];
    }
    return typeof val === 'number' ? val : props.min;
  };

  const currentValue = ref<SliderValue>(normalizeValue(props.modelValue));

  watch(() => props.modelValue, val => {
    currentValue.value = normalizeValue(val);
  });

  /**
   * Typed bridge for VInput v-model: always string | number.
   * Reads/writes only the scalar part of currentValue (range=false when visible).
   */
  const inputValue = computed<string | number>({
    get: () => currentValue.value as number,
    set: (val: string | number) => {
      const n = typeof val === 'string' ? parseFloat(val) : val;
      if (!isNaN(n)) setValue(clamp(n));
    },
  });

  // ── Math helpers ──────────────────────────────────────────
  const clamp = (val: number) => Math.min(props.max, Math.max(props.min, val));

  const snapToStep = (val: number) => {
    const steps = Math.round((val - props.min) / props.step);
    return clamp(props.min + steps * props.step);
  };

  /**
   * Returns 0–100% position along the axis.
   * Horizontal: 0% = left (min) → 100% = right (max)
   * Vertical:   0% = bottom (min) → 100% = top (max)
   */
  const percent = (val: number) => ((val - props.min) / (props.max - props.min)) * 100;

  // ── Styles ────────────────────────────────────────────────
  const runwayStyle = computed(() =>
    props.vertical ? { height: props.height } : {},
  );

  const barStyle = computed(() => {
    if (props.range && Array.isArray(currentValue.value)) {
      const [v1, v2] = currentValue.value as [number, number];
      const lo = percent(Math.min(v1, v2));
      const size = percent(Math.max(v1, v2)) - lo;
      if (props.vertical) return { bottom: `${lo}%`, height: `${size}%` };
      return { left: `${lo}%`, width: `${size}%` };
    }
    const val = currentValue.value as number;
    if (props.vertical) return { bottom: '0%', height: `${percent(val)}%` };
    return { width: `${percent(val)}%` };
  });

  /**
   * Thumb position:
   * - Horizontal: `left` = percent%
   * - Vertical:   `bottom` = percent%  (0% = bottom/min, 100% = top/max)
   */
  const thumbStyle = (val: number) =>
    props.vertical
      ? { bottom: `${percent(val)}%`, left: '50%' }
      : { left: `${percent(val)}%` };

  const thumb1Style = computed(() => {
    const val = props.range && Array.isArray(currentValue.value)
      ? (currentValue.value as [number, number])[0]
      : (currentValue.value as number);
    return thumbStyle(val);
  });

  const thumb2Style = computed(() => {
    if (!props.range || !Array.isArray(currentValue.value)) return {};
    return thumbStyle((currentValue.value as [number, number])[1]);
  });

  const stopList = computed(() => {
    if (!props.showStops) return [];
    const stops: number[] = [];
    const total = (props.max - props.min) / props.step;
    for (let i = 1; i < total; i++) stops.push(props.min + i * props.step);
    return stops;
  });

  const getStopStyle = (val: number) =>
    props.vertical
      ? { bottom: `${percent(val)}%`, left: '50%', top: 'auto' }
      : { left: `${percent(val)}%` };

  const getMarkStyle = (val: number) =>
    props.vertical
      ? { bottom: `${percent(val)}%`, top: 'auto' }
      : { left: `${percent(val)}%` };

  const formatTooltipValue = (val: number) =>
    props.formatTooltip ? props.formatTooltip(val) : String(val);

  // ── Pointer → value ───────────────────────────────────────
  const getPositionFromEvent = (e: MouseEvent | TouchEvent): number => {
    if (!sliderRef.value) return props.min;
    const rect = sliderRef.value.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (props.vertical) {
      // Moving up → clientY decreases → ratio increases → value increases ✓
      const ratio = (rect.bottom - clientY) / rect.height;
      return snapToStep(props.min + ratio * (props.max - props.min));
    }

    const ratio = (clientX - rect.left) / rect.width;
    return snapToStep(props.min + ratio * (props.max - props.min));
  };

  // ── setValue ──────────────────────────────────────────────
  const setValue = (val: SliderValue, emitChange = false) => {
    currentValue.value = val;
    emit('update:modelValue', val);
    emit('input', val);
    if (emitChange) emit('change', val);
  };

  // ── Runway click ──────────────────────────────────────────
  const onRunwayClick = (e: MouseEvent) => {
    if (props.disabled) return;
    const newVal = getPositionFromEvent(e);

    if (props.range && Array.isArray(currentValue.value)) {
      const [v1, v2] = currentValue.value as [number, number];
      if (Math.abs(newVal - v1) <= Math.abs(newVal - v2)) {
        setValue([newVal, v2], true);
      } else {
        setValue([v1, newVal], true);
      }
    } else {
      setValue(newVal, true);
    }
  };

  // ── Drag ─────────────────────────────────────────────────
  const startDrag = (thumb: 'first' | 'second') => {
    isDragging.value = true;
    tooltip1Visible.value = thumb === 'first' && props.showTooltip;
    tooltip2Visible.value = thumb === 'second' && props.showTooltip;

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.value) return;
      const newVal = getPositionFromEvent(e);
      if (props.range && Array.isArray(currentValue.value)) {
        const [v1, v2] = currentValue.value as [number, number];
        setValue(thumb === 'first' ? [newVal, v2] : [v1, newVal]);
      } else {
        setValue(newVal);
      }
    };

    const onUp = () => {
      isDragging.value = false;
      tooltip1Visible.value = false;
      tooltip2Visible.value = false;
      emit('change', currentValue.value);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
  };

  const onThumbMousedown = (e: MouseEvent, thumb: 'first' | 'second') => {
    if (props.disabled) return;
    e.preventDefault();
    startDrag(thumb);
  };

  const onThumbTouchstart = (e: TouchEvent, thumb: 'first' | 'second') => {
    if (props.disabled) return;
    startDrag(thumb);
  };

  const onThumbKeydown = (e: KeyboardEvent, thumb: 'first' | 'second') => {
    if (props.disabled) return;
    let delta = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = props.step;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -props.step;
    if (!delta) return;
    e.preventDefault();

    if (props.range && Array.isArray(currentValue.value)) {
      const [v1, v2] = currentValue.value as [number, number];
      setValue(thumb === 'first' ? [clamp(v1 + delta), v2] : [v1, clamp(v2 + delta)], true);
    } else {
      setValue(clamp((currentValue.value as number) + delta), true);
    }
  };

  // ── Input box ─────────────────────────────────────────────
  // onInputBlur is called by VInput's @change (fires on commit, not every keystroke)
  const onInputBlur = () => {
    const n = typeof inputValue.value === 'string'
      ? parseFloat(inputValue.value)
      : inputValue.value;
    if (!isNaN(n)) setValue(clamp(n), true);
  };

  const increment = () => {
    if (props.disabled || props.range) return;
    setValue(clamp((currentValue.value as number) + props.step), true);
  };

  const decrement = () => {
    if (props.disabled || props.range) return;
    setValue(clamp((currentValue.value as number) - props.step), true);
  };
</script>