<script setup lang="ts">
  import { computed, nextTick, ref } from 'vue';
  import useDetectOutsideClick from '@/components/color-picker/useDetectOutsideClick';
  import type { VColorPickerProps, VColorPickerEmits } from './types';

  const props = withDefaults(defineProps<VColorPickerProps>(), {
    color: '#FFFFFF',
    isShowLabel: false,
    presets: () => ['#00475A', '#F2994A', '#27AE60', '#EB5757', '#2F80ED', '#9B51E0', '#000000', '#FFFFFF'],
    disabled: false,
  });

  const emit = defineEmits<VColorPickerEmits>();

  const componentRef = ref<HTMLElement | null>(null);
  const triggerRef = ref<HTMLElement | null>(null);
  const panelRef = ref<HTMLElement | null>(null);
  const isOpen = ref(false);
  const hexInputValue = ref(props.color);

  const panelStyle = ref<{ top: string; left: string }>({ top: '0px', left: '0px' });

  const isValidHex = (value: string) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);

  const normalizedColor = computed(() => (isValidHex(props.color) ? props.color : '#FFFFFF'));

  const PANEL_WIDTH = 200;
  const PANEL_GAP = 8;

  const updatePanelPosition = () => {
    if (!triggerRef.value) return;
    const rect = triggerRef.value.getBoundingClientRect();

    let left = rect.left;
    // не даємо панелі вилізти за правий край вʼюпорта
    if (left + PANEL_WIDTH > window.innerWidth) {
      left = window.innerWidth - PANEL_WIDTH - PANEL_GAP;
    }

    const estimatedPanelHeight = 180;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < estimatedPanelHeight && rect.top > estimatedPanelHeight;

    panelStyle.value = {
      left: `${Math.max(PANEL_GAP, left)}px`,
      top: openUpward ? `${rect.top - estimatedPanelHeight - PANEL_GAP}px` : `${rect.bottom + PANEL_GAP}px`,
    };
  };

  const togglePanel = async () => {
    if (props.disabled) return;
    hexInputValue.value = props.color;
    isOpen.value = !isOpen.value;

    if (isOpen.value) {
      await nextTick();
      updatePanelPosition();
      window.addEventListener('scroll', updatePanelPosition, true);
      window.addEventListener('resize', updatePanelPosition);
    } else {
      window.removeEventListener('scroll', updatePanelPosition, true);
      window.removeEventListener('resize', updatePanelPosition);
    }
  };

  const closePanel = () => {
    if (!isOpen.value) return;
    isOpen.value = false;
    window.removeEventListener('scroll', updatePanelPosition, true);
    window.removeEventListener('resize', updatePanelPosition);
  };

  const applyColor = (value: string) => {
    if (!isValidHex(value)) return;
    emit('updateColor', value);
  };

  const onNativePickerInput = (event: Event) => {
    const input = event.target as HTMLInputElement | null;
    if (input?.value) {
      hexInputValue.value = input.value;
      applyColor(input.value);
    }
  };

  const onHexInput = () => {
    let value = hexInputValue.value.trim();
    if (value && !value.startsWith('#')) value = `#${value}`;
    hexInputValue.value = value;

    if (isValidHex(value)) {
      applyColor(value);
    }
  };

  const selectPreset = (preset: string) => {
    hexInputValue.value = preset;
    applyColor(preset);
  };

  // компонент тепер складається з двох "зон" (тригер + телепортована панель) —
  // хук закриття по кліку поза межами має враховувати обидві
  useDetectOutsideClick(componentRef, () => {
    const target = panelRef.value;
    return target;
  });
</script>

<template>
  <div ref="componentRef" class="vt-color-picker" :class="{ 'is-disabled': disabled }">
    <button ref="triggerRef" type="button" class="vt-color-picker__trigger" :disabled="disabled" @click="togglePanel">
      <span class="vt-color-picker__swatch" :style="{ backgroundColor: normalizedColor }"></span>
      <span v-if="isShowLabel" class="vt-color-picker__label">{{ normalizedColor }}</span>
    </button>

    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="isOpen"
          ref="panelRef"
          class="vt-color-picker__panel"
          :style="{ top: panelStyle.top, left: panelStyle.left }"
        >
          <input type="color" class="vt-color-picker__native-input" :value="normalizedColor" @input="onNativePickerInput" />

          <input
            v-model="hexInputValue"
            type="text"
            class="vt-color-picker__hex-input"
            placeholder="#FFFFFF"
            maxlength="7"
            @input="onHexInput"
            @keydown.enter="closePanel"
          />

          <div class="vt-color-picker__presets">
            <button
              v-for="preset in presets"
              :key="preset"
              type="button"
              class="vt-color-picker__preset"
              :class="{ 'is-active': preset.toLowerCase() === normalizedColor.toLowerCase() }"
              :style="{ backgroundColor: preset }"
              :aria-label="preset"
              @click="selectPreset(preset)"
            ></button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>