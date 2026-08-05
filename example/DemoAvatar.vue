<script lang="ts" setup>
  import VAvatar from '@/components/avatar/VAvatar.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import type { TableSection } from './helper/DocPropsTable.vue';
  import DocPropsTable from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  // ── Sample avatars ───────────────────────────────────────────────────────
  const SAMPLE_IMG = 'https://i.pravatar.cc/150?img=12';

  // ── API docs ──────────────────────────────────────────────────────────────
  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        {
          name: 'firstName',
          type: 'string',
          default: "''",
          description: 'Ім\'я користувача — перша літера йде в ініціали, якщо imageUrl не задано',
        },
        {
          name: 'lastName',
          type: 'string',
          default: "''",
          description: 'Прізвище користувача — перша літера йде в ініціали, якщо imageUrl не задано',
        },
        {
          name: 'imageUrl',
          type: 'string',
          default: "''",
          description: 'URL зображення аватарки. Якщо порожній — показуються ініціали або слот #svg',
        },
        {
          name: 'size',
          type: 'number',
          default: '40',
          description: 'Діаметр кружечка аватарки в px',
        },
      ],
    },
    {
      title: 'Slots',
      rows: [
        { name: 'svg', type: '—', description: 'Кастомне SVG-зображення замість фото/ініціалів (пріоритет нижче за imageUrl)' },
        { name: 'icon', type: '—', description: 'Іконка соцмережі/статусу у правому нижньому куті аватарки' },
        { name: 'count', type: '—', description: 'Бейдж-лічильник у правому верхньому куті (напр. кількість непрочитаних)' },
      ],
    },
  ];
</script>

<template>
  <div class="avatar-showcase">
    <!-- ─── Ініціали ─── -->
    <DocSection title="Ініціали" description="Якщо imageUrl не задано — показуються перші літери імені та прізвища">
      <DocPreview>
        <div class="avatar-showcase__row">
          <VAvatar first-name="Олег" last-name="Ковальчук" />
          <VAvatar first-name="Марія" last-name="Петренко" />
          <VAvatar first-name="Іван" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Фото ─── -->
    <DocSection title="Зображення" description="Коли imageUrl задано — показується фото замість ініціалів">
      <DocPreview>
        <VAvatar :image-url="SAMPLE_IMG" first-name="Олег" last-name="Ковальчук" />
      </DocPreview>
    </DocSection>

    <!-- ─── Розміри ─── -->
    <DocSection title="Розміри" description="Проп size керує діаметром кружечка">
      <DocPreview>
        <div class="avatar-showcase__row avatar-showcase__row--align-end">
          <VAvatar :size="24" first-name="О" last-name="К" />
          <VAvatar :size="40" first-name="О" last-name="К" />
          <VAvatar :size="64" first-name="О" last-name="К" />
          <VAvatar :size="96" :image-url="SAMPLE_IMG" />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Слот icon ─── -->
    <DocSection title="Слот #icon" description="Індикатор статусу/соцмережі в куті аватарки">
      <DocPreview>
        <div class="avatar-showcase__row">
          <VAvatar :image-url="SAMPLE_IMG">
            <template #icon>
              <VIcon name="telegram" :width="14" :height="14" />
            </template>
          </VAvatar>
          <VAvatar first-name="Марія" last-name="Петренко">
            <template #icon>
              <span class="avatar-showcase__status-dot avatar-showcase__status-dot--online" />
            </template>
          </VAvatar>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Слот count ─── -->
    <DocSection title="Слот #count" description="Бейдж-лічильник, наприклад кількість непрочитаних повідомлень">
      <DocPreview>
        <VAvatar :image-url="SAMPLE_IMG">
          <template #count>
            <span class="avatar-showcase__badge">3</span>
          </template>
        </VAvatar>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🔤" title="Автоматичні ініціали">
        Якщо зображення відсутнє, компонент сам згенерує ініціали з firstName + lastName.
      </DocFeature>
      <DocFeature icon="📐" title="Гнучкий розмір">
        Один проп size масштабує і кружечок, і шрифт ініціалів пропорційно.
      </DocFeature>
      <DocFeature icon="🧩" title="Слоти для розширення">
        Слоти #svg, #icon, #count дозволяють додати кастомну графіку, статус-індикатор чи лічильник без форку компонента.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .avatar-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;

    &__row {
      display: flex;
      gap: 16px;
      align-items: center;

      &--align-end {
        align-items: flex-end;
      }
    }

    &__status-dot {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid var(--color-white);

      &--online {
        background: #27ae60;
      }
    }

    &__badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 8px;
      background: #eb5757;
      color: var(--color-white);
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>