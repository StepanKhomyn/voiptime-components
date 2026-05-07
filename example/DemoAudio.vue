<script lang="ts" setup>
  import VAudio from '@/components/audio/VAudio.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import type { TableSection } from './helper/DocPropsTable.vue';
  import DocPropsTable from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import { ref } from 'vue';

  // ── Sample audio URLs (public domain / free for testing) ──────────────────
  const MONO_URL = 'https://cdn.pixabay.com/audio/2025/04/16/audio_b64de0d495.mp3';

  // ── Demo state ────────────────────────────────────────────────────────────
  const currentTime = ref(0);
  const isPlaying = ref(false);
  const hasError = ref(false);

  function onTimeUpdate(t: number) {
    currentTime.value = t;
  }

  function onPlay() {
    isPlaying.value = true;
  }

  function onPause() {
    isPlaying.value = false;
  }

  function onEnded() {
    isPlaying.value = false;
  }

  function onError() {
    hasError.value = true;
  }

  // ── API docs ──────────────────────────────────────────────────────────────
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'recordUrl',
          type: 'string | null',
          default: 'null',
          description: 'URL аудіо-файлу для відтворення. Якщо null — показується empty state',
        },
        {
          name: 'duration',
          type: 'number',
          default: '5',
          description: 'Тривалість запису в секундах — використовується для розрахунку таймлайну',
        },
        {
          name: 'userA',
          type: 'string | null',
          default: 'null',
          description: 'Назва першого каналу (лівий). Відображається на хвилі помаранчевим кольором',
        },
        {
          name: 'userB',
          type: 'string | null',
          default: 'null',
          description: 'Назва другого каналу (правий). Відображається на хвилі темним кольором',
        },
        {
          name: 'isSaveButton',
          type: 'boolean',
          default: 'false',
          description: 'Зарезервований проп для кнопки збереження (наразі не впливає на рендер)',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Повністю блокує всі контроли плеєра',
        },
      ],
    },
    {
      title: 'Events',
      rows: [
        {
          name: 'timeUpdate',
          type: '[currentTime: number]',
          description: 'Спрацьовує кожного разу при оновленні поточного часу відтворення',
        },
        { name: 'play', type: '[]', description: 'Відтворення розпочато' },
        { name: 'pause', type: '[]', description: 'Відтворення зупинено' },
        { name: 'ended', type: '[]', description: 'Відтворення завершено' },
        { name: 'error', type: '[]', description: 'Помилка завантаження або відтворення файлу' },
      ],
    },
    {
      title: 'Expose (ref methods)',
      rows: [
        { name: 'play()', type: 'Promise<void>', description: 'Програматично запустити відтворення' },
        { name: 'pause()', type: 'void', description: 'Програматично зупинити відтворення' },
        { name: 'seek(time)', type: 'void', description: 'Перемотати до вказаного часу в секундах' },
        { name: 'getCurrentTime()', type: 'number', description: 'Отримати поточний час відтворення' },
        { name: 'getDuration()', type: 'number', description: 'Отримати загальну тривалість' },
      ],
    },
    {
      title: 'Slots',
      rows: [
        { name: 'empty', type: '—', description: 'Замінює дефолтний empty state коли recordUrl = null' },
        { name: 'icon-play', type: '—', description: 'Іконка кнопки відтворення' },
        { name: 'icon-pause', type: '—', description: 'Іконка кнопки паузи' },
      ],
    },
  ];
</script>

<template>
  <div class="audio-showcase">
    <!-- ─── Стерео з двома каналами ─── -->
    <DocSection
      title="Стерео — два канали"
      description="Кожен канал має окрему кнопку mute. Натисніть іконку звуку щоб приглушити канал"
    >
      <DocPreview>
        <VAudio
          :record-url="MONO_URL"
          user-a="Оператор"
          user-b="Клієнт"
          @time-update="onTimeUpdate"
          @play="onPlay"
          @pause="onPause"
          @ended="onEnded"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── З відстеженням часу ─── -->
    <DocSection
      title="Відстеження поточного часу"
      description="Подія @time-update спрацьовує при кожному оновленні прогресу"
    >
      <DocPreview>
        <div style="display: flex; flex-direction: column; gap: 12px; width: 100%">
          <VAudio
            :record-url="MONO_URL"
            :duration="0"
            @time-update="onTimeUpdate"
            @play="onPlay"
            @pause="onPause"
            @ended="onEnded"
          />
          <div class="audio-showcase__status">
            <span
              >⏱ Поточний час: <strong>{{ currentTime.toFixed(1) }}s</strong></span
            >
            <span
              >▶ Статус: <strong>{{ isPlaying ? 'Відтворюється' : 'Пауза' }}</strong></span
            >
          </div>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Disabled ─── -->
    <DocSection title="Заблокований стан">
      <DocPreview>
        <VAudio :record-url="MONO_URL" disabled />
      </DocPreview>
    </DocSection>

    <!-- ─── Empty state ─── -->
    <DocSection title="Empty state — recordUrl = null">
      <DocPreview>
        <VAudio :record-url="null" />
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомний empty slot ─── -->
    <DocSection title="Кастомний empty slot">
      <DocPreview>
        <VAudio :record-url="null">
          <template #empty>
            <div style="padding: 16px; color: #f2994a; font-size: 14px"> 🎙 Аудіо ще не завантажено</div>
          </template>
        </VAudio>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🎛️" title="Per-channel mute">
        Для стерео файлів кожен канал має окрему кнопку mute. Натисніть іконку звуку на хвилі щоб приглушити окремий
        канал через Web Audio API GainNode.
      </DocFeature>
      <DocFeature icon="⚡" title="Адаптивний таймлайн">
        Інтервали таймлайну автоматично розраховуються від тривалості та ширини контейнера — мітки ніколи не зливаються.
      </DocFeature>
      <DocFeature icon="🔊" title="Контроль швидкості">
        Підтримує відтворення на швидкості <code>1x</code>, <code>1.5x</code>, <code>2x</code> через нативний
        <code>playbackRate</code>.
      </DocFeature>
      <DocFeature icon="📡" title="Програматичне керування">
        Через <code>ref</code> доступні методи <code>play()</code>, <code>pause()</code>, <code>seek(time)</code>,
        <code>getCurrentTime()</code>, <code>getDuration()</code>.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .audio-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;

    &__status {
      display: flex;
      gap: 24px;
      font-size: 13px;
      color: var(--color-gray-2);
      padding: 8px 12px;
      background: var(--color-gray-6);
      border-radius: var(--radius-main);
    }
  }
</style>
