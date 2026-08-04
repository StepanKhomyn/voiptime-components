<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import VTimerDuration from '@/components/timer/VTimerDuration.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  // ── Demo timestamps ──────────────────────────────────────────────────────
  const startedNow = ref(Date.now());
  const startedMinutesAgo = ref(Date.now() - 5 * 60 * 1000);
  const startedHoursAgo = ref(Date.now() - 3 * 60 * 60 * 1000 - 42 * 60 * 1000);
  const startedDaysAgo = ref(Date.now() - 2 * 86400 * 1000 - 5 * 3600 * 1000);
  const noTimestamp = ref<number | null>(null);

  // ── Динамічний рестарт таймера ───────────────────────────────────────────
  const dynamicTimestamp = ref(Date.now());
  let restartInterval: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    restartInterval = setInterval(() => {
      dynamicTimestamp.value = Date.now();
    }, 8000);
  });

  onUnmounted(() => {
    if (restartInterval) clearInterval(restartInterval);
  });

  const resetTimer = () => {
    dynamicTimestamp.value = Date.now();
  };

  // ── API docs ──────────────────────────────────────────────────────────────
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'timestamp',
          type: 'number | null',
          default: 'undefined',
          description: 'Unix-timestamp (мс) початку відліку. Якщо не задано — компонент показує "-"',
        },
      ],
    },
  ];
</script>

<template>
  <div class="timer-duration-showcase">
    <!-- ─── Базове використання ─── -->
    <DocSection title="Базове використання" description="Таймер оновлюється кожну секунду від переданого timestamp">
      <DocPreview title="Щойно розпочато">
        <VTimerDuration :timestamp="startedNow" />
      </DocPreview>

      <DocPreview title="5 хвилин тому">
        <VTimerDuration :timestamp="startedMinutesAgo" />
      </DocPreview>

      <DocPreview title="Кілька годин тому">
        <VTimerDuration :timestamp="startedHoursAgo" />
      </DocPreview>
    </DocSection>

    <!-- ─── Багатоденна тривалість ─── -->
    <DocSection title="Формат з днями" description="Якщо минуло більше доби, попереду додається '<N>d.'">
      <DocPreview title="2 дні 5 годин тому">
        <VTimerDuration :timestamp="startedDaysAgo" />
      </DocPreview>
    </DocSection>

    <!-- ─── Порожній стан ─── -->
    <DocSection title="Без timestamp">
      <DocPreview title="timestamp = null">
        <VTimerDuration :timestamp="noTimestamp" />
      </DocPreview>
    </DocSection>

    <!-- ─── Динамічна зміна timestamp ─── -->
    <DocSection
      title="Реактивний рестарт"
      description="При зміні пропа timestamp компонент сам перезапускає відлік — без потреби у :key для форс-ремаунту"
    >
      <DocPreview title="Автоскидання кожні 8с (або кнопкою)">
        <div style="display: flex; align-items: center; gap: 16px">
          <VTimerDuration :timestamp="dynamicTimestamp" />
          <button class="timer-duration-showcase__reset-btn" @click="resetTimer">Скинути</button>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── У таблиці (реальний кейс використання) ─── -->
    <DocSection title="У колонці таблиці" description="Типовий кейс — тривалість статусу оператора в моніторингу">
      <DocPreview>
        <table class="timer-duration-showcase__table">
          <thead>
          <tr>
            <th>Оператор</th>
            <th>Статус</th>
            <th>Тривалість</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Іван П.</td>
            <td>В розмові</td>
            <td><VTimerDuration :timestamp="startedMinutesAgo" /></td>
          </tr>
          <tr>
            <td>Олена К.</td>
            <td>Перерва</td>
            <td><VTimerDuration :timestamp="startedHoursAgo" /></td>
          </tr>
          </tbody>
        </table>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="⏱️" title="Оновлення раз на секунду">
        Внутрішній <code>setInterval</code> перераховує тривалість кожні 1000мс від різниці
        <code>Date.now() - timestamp</code>.
      </DocFeature>
      <DocFeature icon="🔄" title="Реактивний watch на timestamp">
        При зміні пропа <code>timestamp</code> таймер автоматично зупиняється і стартує заново — не потрібен
        <code>:key</code> для форс-ремаунту компонента.
      </DocFeature>
      <DocFeature icon="📅" title="Формат з днями">
        Якщо тривалість перевищує 24 години, до <code>HH:mm:ss</code> додається префікс <code>Nd.</code> (наприклад
        <code>2d. 05:42:10</code>).
      </DocFeature>
      <DocFeature icon="🧹" title="Автоматичний cleanup">
        Інтервал коректно зупиняється в <code>onUnmounted</code>, тож витоків таймера при демонтажі компонента
        (наприклад, рядка таблиці) не відбувається.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .timer-duration-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;

    &__reset-btn {
      padding: 6px 14px;
      border: 1px solid var(--color-gray-5);
      border-radius: var(--radius-main);
      background: var(--color-white);
      cursor: pointer;
      font-size: 13px;

      &:hover {
        background: var(--color-gray-5);
      }
    }

    &__table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;

      th,
      td {
        text-align: left;
        padding: 8px 12px;
        border-bottom: 1px solid var(--color-gray-5);
      }

      th {
        color: var(--color-gray-2);
        font-weight: 600;
      }
    }
  }
</style>