<script lang="ts" setup>
  import { ref } from 'vue';
  import VCollapse from '@/components/collapse/VCollapse.vue';
  import VCollapseItem from '@/components/collapse/VCollapseItem.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  const active = ref(['1']);
  const accordion = ref(['a']);
  const custom = ref(['c1']);

  const propsSections: TableSection[] = [
    {
      title: 'Props (VCollapse)',
      rows: [
        { name: 'modelValue', type: 'string[]', default: '[]', description: 'Масив name активних елементів (v-model)' },
        {
          name: 'accordion',
          type: 'boolean',
          default: 'false',
          description: 'Режим акордеону — тільки один елемент відкритий',
        },
      ],
    },
    {
      title: 'Props (VCollapseItem)',
      rows: [
        {
          name: 'name',
          type: 'string',
          default: '-',
          description: 'Унікальний ідентифікатор елемента',
          required: true,
        },
        { name: 'title', type: 'string', default: '-', description: 'Текст заголовку' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований елемент' },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'update:modelValue', type: 'string[]', description: 'Зміна активних елементів (VCollapse, v-model)' },
        { name: 'change', type: 'string[]', description: 'Зміна стану розкриття (VCollapse)' },
        { name: 'toggle', type: 'string', description: 'Переключення конкретного елемента (VCollapseItem)' },
      ],
    },
    {
      title: 'Slots (VCollapseItem)',
      rows: [
        { name: 'default', description: 'Контент елемента' },
        { name: 'title', description: 'Кастомний заголовок — отримує { title, isActive }' },
      ],
    },
  ];
</script>

<template>
  <div class="collapse-showcase">
    <!-- ─── Базове ─── -->
    <DocSection
      title="Базове використання"
      description="v-model — масив name активних елементів. Можна розкрити кілька одночасно"
    >
      <DocPreview :script="`const active = ref(['1'])`">
        <VCollapse v-model="active" style="width: 100%">
          <VCollapseItem name="1" title="Consistency">
            Узгодженість з реальним життям: відповідає процесам і логіці, прийнятим у мові та звичках користувачів.
          </VCollapseItem>
          <VCollapseItem name="2" title="Feedback">
            Зворотній зв'язок: дозволяє користувачам чітко сприймати свої дії через оновлення стилів та інтерактивні
            ефекти.
          </VCollapseItem>
          <VCollapseItem name="3" title="Efficiency">
            Спрощення процесу: зберігай операції простими та інтуїтивно зрозумілими.
          </VCollapseItem>
        </VCollapse>
      </DocPreview>
    </DocSection>

    <!-- ─── Акордеон ─── -->
    <DocSection title="Режим акордеону" description=':accordion="true" — відкриття одного закриває попередній'>
      <DocPreview :script="`const accordion = ref(['a'])`">
        <VCollapse v-model="accordion" :accordion="true" style="width: 100%">
          <VCollapseItem name="a" title="Секція 1">
            Тільки один елемент може бути відкритий одночасно в режимі акордеону.
          </VCollapseItem>
          <VCollapseItem name="b" title="Секція 2">
            При відкритті цього елементу попередній автоматично закриється.
          </VCollapseItem>
          <VCollapseItem name="c" title="Секція 3"> Це дозволяє зберегти компактність інтерфейсу. </VCollapseItem>
        </VCollapse>
      </DocPreview>
    </DocSection>

    <!-- ─── Disabled ─── -->
    <DocSection title="Заблокований елемент">
      <DocPreview>
        <VCollapse v-model="active" style="width: 100%">
          <VCollapseItem name="enabled" title="Активний елемент">
            Цей елемент можна відкрити та закрити.
          </VCollapseItem>
          <VCollapseItem name="disabled" title="Заблокований елемент" :disabled="true">
            Цей контент недоступний.
          </VCollapseItem>
        </VCollapse>
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомний заголовок ─── -->
    <DocSection
      title="Кастомний заголовок через слот #title"
      description="Слот отримує { isActive, title } — стилізуй залежно від стану"
    >
      <DocPreview>
        <VCollapse v-model="custom" style="width: 100%">
          <VCollapseItem name="c1">
            <template #title="{ isActive }">
              <div style="display: flex; align-items: center; gap: 8px">
                <span :style="{ color: isActive ? '#3498db' : '#303133' }">🚀 Custom title</span>
                <span style="font-size: 12px; color: #909399">{{ isActive ? 'Відкрито' : 'Закрито' }}</span>
              </div>
            </template>
            Кастомний контент з динамічним заголовком.
          </VCollapseItem>

          <VCollapseItem name="c2">
            <template #title="{ isActive }">
              <div style="display: flex; align-items: center; gap: 12px">
                <div
                  :style="{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#27ae60' : '#dcdfe6',
                    transition: 'background-color .2s',
                  }"
                />
                <strong>Індикатор статусу</strong>
              </div>
            </template>
            Заголовок з кольоровим індикатором стану.
          </VCollapseItem>
        </VCollapse>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature title="v-model — масив name" icon="📋">
        <code>v-model</code> зберігає <em>масив</em> рядків — навіть якщо відкрито тільки один елемент. Для акордеону
        масив завжди містить 0 або 1 елемент.
      </DocFeature>
      <DocFeature title="Слот #title з isActive" icon="🎨">
        <code>{ isActive }</code> дозволяє змінювати стиль заголовку — колір, іконку, текст-підказку — залежно від того
        чи елемент розкритий.
      </DocFeature>
      <DocFeature title="accordion + v-model" icon="🎸">
        В режимі акордеону <code>v-model</code> все одно залишається масивом — але компонент сам обмежує його до одного
        активного елемента.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style scoped lang="scss">
  .collapse-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
