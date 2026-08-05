<script lang="ts" setup>
  import { ref } from 'vue';
  import VAvatarUpload from '@/components/avatar-upload/VAvatarUpload.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import type { TableSection } from './helper/DocPropsTable.vue';
  import DocPropsTable from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  const SAMPLE_IMG = 'https://i.pravatar.cc/300?img=12';

  // ── Demo state ────────────────────────────────────────────────────────────
  const uploadedAvatar = ref<string | null>(null);
  const uploadedSquareAvatar = ref<string | null>(SAMPLE_IMG);

  function onUpload(base64: string | null) {
    uploadedAvatar.value = base64;
  }

  function onUploadSquare(base64: string | null) {
    uploadedSquareAvatar.value = base64;
  }

  async function onBeforeUpload(file: File): Promise<boolean> {
    const isTooBig = file.size > 5 * 1024 * 1024;
    if (isTooBig) alert('Файл завеликий, максимум 5MB');
    return !isTooBig;
  }

  // ── API docs ──────────────────────────────────────────────────────────────
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'avatar',
          type: 'string',
          default: "''",
          description: 'Поточне джерело зображення (base64 або url) — показується як прев\'ю до завантаження нового',
        },
        {
          name: 'field',
          type: 'string',
          default: "'avatar'",
          description: 'Ім\'я поля прихованого input[type=file], що використовується для changeFile',
        },
        {
          name: 'format',
          type: "'png' | 'jpeg' | 'webp'",
          default: "'png'",
          description: 'Формат зображення після кропу',
        },
        {
          name: 'accept',
          type: 'string',
          default: "'image/svg+xml,image/png,image/jpeg,image/webp'",
          description: 'Дозволені MIME-типи для вибору файлу',
        },
        { name: 'width', type: 'number', default: '300', description: 'Ширина зони кропу, px' },
        { name: 'height', type: 'number', default: '300', description: 'Висота зони кропу, px' },
        { name: 'selectSize', type: 'number', default: '300', description: 'Початковий розмір рамки виділення, px' },
        { name: 'rotate', type: 'boolean', default: 'true', description: 'Чи дозволено обертання зображення' },
        {
          name: 'disableSelect',
          type: 'boolean',
          default: 'false',
          description: 'Заблокувати переміщення/ресайз рамки виділення',
        },
        {
          name: 'fixed',
          type: 'boolean',
          default: 'true',
          description: 'Показувати попап як fixed overlay з фейдом на весь екран',
        },
        { name: 'showPreview', type: 'boolean', default: 'true', description: 'Показувати блок прев\'ю (коло + квадрат)' },
        { name: 'previewSize', type: 'number', default: '100', description: 'Розмір блоку прев\'ю, px' },
        {
          name: 'onBeforeUpload',
          type: '(file: File) => boolean | Promise<boolean>',
          default: '—',
          description: 'Колбек перед відкриттям кропера. Поверніть false, щоб скасувати вибір файлу',
        },
      ],
    },
    {
      title: 'Events',
      rows: [
        {
          name: 'uploadFile',
          type: '[base64: string | null]',
          description: 'Спрацьовує після підтвердження кропу (base64 обрізаного фото) або видалення фото (null)',
        },
      ],
    },
    {
      title: 'Slots',
      rows: [
        { name: 'title', type: '—', description: 'Заголовок попапу кропера' },
        { name: 'closeIcon', type: '—', description: 'Кастомна іконка закриття попапу' },
        { name: 'cancel', type: '—', description: 'Кастомна кнопка відміни' },
        { name: 'confirm', type: '—', description: 'Кастомна кнопка підтвердження' },
      ],
    },
  ];
</script>

<template>
  <div class="avatar-upload-showcase">
    <!-- ─── Базове використання ─── -->
    <DocSection
      title="Базове завантаження"
      description="Клік по кнопці відкриває вибір файлу, після чого — попап кропера з рамкою виділення"
    >
      <DocPreview>
        <VAvatarUpload :avatar="uploadedAvatar ?? ''" @upload-file="onUpload" />
      </DocPreview>
    </DocSection>

    <!-- ─── З попереднім фото ─── -->
    <DocSection title="З попередньо завантаженим фото" description="Якщо avatar задано — прев'ю показується одразу, з кнопкою видалення">
      <DocPreview>
        <VAvatarUpload :avatar="uploadedSquareAvatar ?? ''" @upload-file="onUploadSquare" />
      </DocPreview>
    </DocSection>

    <!-- ─── Без прев'ю в попапі ─── -->
    <DocSection title="Без блоку прев'ю" description="showPreview=false прибирає праву колонку з круглим/квадратним прев'ю в попапі кропера">
      <DocPreview>
        <VAvatarUpload :show-preview="false" @upload-file="() => {}" />
      </DocPreview>
    </DocSection>

    <!-- ─── Заблокована рамка виділення ─── -->
    <DocSection title="Фіксована зона кропу" description="disableSelect=true забирає можливість двигати/масштабувати рамку — кропиться завжди по центру заданого розміру">
      <DocPreview>
        <VAvatarUpload disable-select :select-size="200" @upload-file="() => {}" />
      </DocPreview>
    </DocSection>

    <!-- ─── Валідація перед завантаженням ─── -->
    <DocSection title="Валідація файлу (onBeforeUpload)" description="Колбек викликається перед відкриттям кропера — поверніть false щоб відхилити файл">
      <DocPreview>
        <VAvatarUpload :on-before-upload="onBeforeUpload" @upload-file="() => {}" />
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомні кнопки попапу ─── -->
    <DocSection title="Кастомні слоти попапу" description="Слоти title / cancel / confirm дозволяють підмінити стандартний вигляд попапу">
      <DocPreview>
        <VAvatarUpload @upload-file="() => {}">
          <template #title>
            <div style="font-weight: 700; font-size: 16px">Завантаження логотипу</div>
          </template>
          <template #cancel>
            <div style="padding: 8px 24px; border-radius: 8px; border: 1px solid #e0e0e0; cursor: pointer">Скасувати</div>
          </template>
          <template #confirm>
            <div style="padding: 8px 24px; border-radius: 8px; background: #27ae60; color: white; cursor: pointer">
              Зберегти
            </div>
          </template>
        </VAvatarUpload>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="✂️" title="Кроп у попапі">
        Після вибору файлу відкривається попап з круглою рамкою виділення — можна двигати, масштабувати колесом миші, обрізати.
      </DocFeature>
      <DocFeature icon="🖼️" title="Live-прев'ю">
        Блок прев'ю одразу показує, як фото виглядатиме у круглому та квадратному форматах.
      </DocFeature>
      <DocFeature icon="🛡️" title="Валідація типу файлу">
        Дозволені лише SVG, PNG, JPEG, WEBP — усе інше відхиляється з попередженням ще до відкриття кропера.
      </DocFeature>
      <DocFeature icon="🔌" title="onBeforeUpload hook">
        Можна підключити власну валідацію (розмір файлу, дозволи тощо) перед тим, як відкриється кропер.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .avatar-upload-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>