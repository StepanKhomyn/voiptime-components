<template>
  <div class="v-single-mark-range" :class="{ 'v-single-mark-range--disabled': disabled }">
    <label v-if="label" class="v-single-mark-range__label">{{ label }}</label>

    <div v-if="range.length" class="v-single-mark-range__inner">
      <!-- Labels row -->
      <div class="v-single-mark-range__labels">
        <span
          v-for="num in range"
          :key="num"
          class="v-single-mark-range__tick-label"
          :class="{ 'v-single-mark-range__tick-label--active': num === modelValue }"
          role="button"
          :tabindex="disabled ? -1 : 0"
          @click="!disabled && select(num)"
          @keydown.enter.space.prevent="!disabled && select(num)"
        >
           {{ formatLabelValue(num) }}
        </span>
      </div>

      <!-- Track segments -->
      <div class="v-single-mark-range__track">
        <div
          v-for="(num, index) in range"
          :key="num"
          class="v-single-mark-range__segment"
          :class="{
            'v-single-mark-range__segment--active': index === activeIndex,
            'v-single-mark-range__segment--filled': index < activeIndex,
          }"
          role="button"
          :tabindex="disabled ? -1 : 0"
          :aria-label="`Select ${formatLabelValue(num)}`"
          @click="!disabled && select(num)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import type { VSingleMarkRangeEmits, VSingleMarkRangeProps } from './types';

  const props = withDefaults(
    defineProps<VSingleMarkRangeProps>(),
    {
      modelValue: 0,
      disabled: false,
    },
  );

  const emit = defineEmits<VSingleMarkRangeEmits>();

  function select(value: number) {
    emit('update:modelValue', value);
    emit('change', value);
  }

  const activeIndex = computed(() =>
    props.modelValue != null ? props.range.indexOf(props.modelValue) : -1,
  );

  const formatLabelValue = (val: number) => {
    return props.formatLabel ? props.formatLabel(val) : String(val);
  }
</script>