<script lang="ts" setup>
  import { ref } from 'vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import DocCodeBlock from './helper/DocCodeBlock.vue';
  import VButton from '@/components/button/VButton.vue';
  import VInput from '@/components/input/VInput.vue';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';
  import VTable from '@/components/table/VTable.vue';
  import VTableColumn from '@/components/table/VTableColumn.vue';

  const dynamicTooltip = ref('Початковий текст');
  const showConditional = ref(true);

  const tooltipTexts = [
    'Початковий текст',
    'Оновлений tooltip',
    'Нова підказка',
    'Ще одна варіація',
    'Фінальний текст',
  ];
  let tooltipIndex = 0;
  const updateTooltip = () => {
    tooltipIndex = (tooltipIndex + 1) % tooltipTexts.length;
    dynamicTooltip.value = tooltipTexts[tooltipIndex];
  };

  const apiSections: TableSection[] = [
    {
      title: 'Директива v-tooltip',
      rows: [
        {
          name: 'v-tooltip',
          type: 'string',
          description: 'Текст підказки. Порожній рядок — tooltip не показується',
          required: true,
        },
        {
          name: 'data-placement',
          type: "'top' | 'bottom' | 'left' | 'right'",
          description: 'Позиція відносно елемента. За замовчуванням top',
        },
      ],
    },
  ];
</script>

<template>
  <div class="tooltip-showcase">
    <!-- ─── Позиціонування ─── -->
    <DocSection title="Позиціонування">
      <DocPreview>
        <VButton v-tooltip="'Підказка зверху'" data-placement="top">top</VButton>
        <VButton v-tooltip="'Підказка знизу'" data-placement="bottom">bottom</VButton>
        <VButton v-tooltip="'Підказка зліва'" data-placement="left">left</VButton>
        <VButton v-tooltip="'Підказка справа'" data-placement="right">right</VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── В елементах форми ─── -->
    <DocSection title="Елементи форми">
      <DocPreview>
        <div class="form-demo">
          <div class="form-row">
            <label v-tooltip="'Введіть повне ім\'я користувача'">Ім'я</label>
            <VInput v-tooltip="'Від 2 до 50 символів'" placeholder="Введіть ім'я" type="text" />
          </div>
          <div class="form-row">
            <label v-tooltip="'Мінімум 8 символів'">Пароль</label>
            <VInput v-tooltip="'Літери, цифри та спецсимволи'" placeholder="Введіть пароль" type="password" />
          </div>
          <div class="form-row">
            <label v-tooltip="'Виберіть країну зі списку'">Країна</label>
            <VSelect v-tooltip="'Список оновлюється щомісяця'">
              <VOption label="Україна" value="Україна">Україна</VOption>
              <VOption label="Польща" value="Польща">Польща</VOption>
              <VOption label="VOption" value="Німеччина">Німеччина</VOption>
            </VSelect>
          </div>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Overflow в таблицях ─── -->
    <DocSection
      description="В елементах таблиці tooltip показується тільки якщо текст не вміщується — scrollWidth > clientWidth"
      title="Автоматичне визначення overflow"
    >
      <DocPreview>
        <VTable
          :data="[
            {
              short: 'Короткий текст',
              medium: 'Середній за довжиною текст',
              long: 'Дуже довгий текст який не вміщується в комірку',
            },
          ]"
        >
          <VTableColumn label="Короткий текст" prop="short" />
          <VTableColumn label="Середній за довжиною текст" prop="medium" />
          <VTableColumn label="Дуже довгий текст який не вміщується в комірку" prop="long" />
        </VTable>
      </DocPreview>
    </DocSection>

    <!-- ─── Реєстрація ─── -->
    <DocSection title="Реєстрація директиви">
      <DocCodeBlock
        :code="`// main.ts — глобально
import { createApp } from 'vue'
import { tooltipDirective } from '@/directives/tooltip'

const app = createApp(App)
app.directive('tooltip', tooltipDirective)
app.mount('#app')

// або локально в компоненті
import { tooltipDirective } from '@/directives/tooltip'

const directives = { tooltip: tooltipDirective }`"
        language="ts"
      />
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="apiSections" />
    </DocSection>

    <!-- ─── TypeScript ─── -->
    <DocSection title="TypeScript типи">
      <DocCodeBlock
        :code="`type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

type TooltipHTMLElement = HTMLElement & {
  __tooltipEl?:         HTMLDivElement
  __mouseenterHandler?: () => void
  __mouseleaveHandler?: () => void
  __scrollHandler?:     () => void
}

// global.d.ts
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    vTooltip: string
  }
}`"
        language="ts"
      />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="📐" title="Автоматичне позиціонування">
        При виході за межі viewport tooltip автоматично змінює сторону. Мінімум 8px від країв екрана, позиція
        оновлюється при скролі та resize.
      </DocFeature>
      <DocFeature icon="📊" title="Поведінка в таблицях">
        В елементах <code>.vt-table</code> або <code>table</code> tooltip показується тільки при переповненні (<code
          >scrollWidth > clientWidth</code
        >). Для звичайних елементів — завжди.
      </DocFeature>
      <DocFeature icon="🚫" title="Порожній рядок = без tooltip">
        <code>v-tooltip="showTooltip ? 'Текст' : ''"</code> — зручний спосіб умовного показу без додаткових умов у
        шаблоні.
      </DocFeature>
      <DocFeature icon="📝" title="Обробка довгого тексту">
        Текст до 50 символів — одна лінія. Довший — автоматичний перенос з <code>max-width: 300px</code>.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .tooltip-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .form-demo {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 360px;
  }

  .form-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #374151;
      cursor: help;
    }
  }
</style>
