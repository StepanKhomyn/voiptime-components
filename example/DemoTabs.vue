<script lang="ts" setup>
  import { ref } from 'vue';
  import VTabs from '@/components/tabs/VTabs.vue';
  import VTabItem from '@/components/tabs/VTabItem.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  const activeTab = ref('1');
  const activeCustom = ref('custom');

  const propsSections: TableSection[] = [
    {
      title: 'Props (VTabs)',
      rows: [
        { name: 'modelValue', type: 'string', default: '-', description: 'Активний таб (v-model)', required: true },
      ],
    },
    {
      title: 'Props (VTabItem)',
      rows: [
        { name: 'name', type: 'string', default: '-', description: 'Унікальний ідентифікатор вкладки', required: true },
        { name: 'label', type: 'string', default: "''", description: 'Заголовок вкладки' },
        { name: 'icon', type: 'IconName', default: '-', description: 'Іконка перед заголовком' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокована вкладка' },
        { name: 'closable', type: 'boolean', default: 'false', description: 'Показувати кнопку закриття ✕' },
      ],
    },
    {
      title: 'Events (VTabs)',
      rows: [
        { name: 'update:modelValue', type: 'string', description: 'Зміна активної вкладки (v-model)' },
        { name: 'tab-change', type: 'string', description: 'Вкладка змінилась' },
        { name: 'tab-remove', type: 'string', description: 'Вкладку закрито (closable)' },
        { name: 'tab-add', type: '-', description: 'Натиснута кнопка додавання вкладок' },
      ],
    },
    {
      title: 'Slots (VTabItem)',
      rows: [
        { name: 'default', description: 'Контент вкладки' },
        { name: 'title', description: 'Кастомний заголовок — отримує { isActive, title }' },
      ],
    },
  ];
</script>

<template>
  <div class="tabs-showcase">
    <!-- ─── Базове використання ─── -->
    <DocSection title="Базове використання">
      <DocPreview :script="`const activeTab = ref('1')`">
        <VTabs v-model="activeTab" @tab-change="n => console.log('tab-change:', n)">
          <VTabItem name="1" label="Таб 1" icon="paperClip"> Контент першого табу</VTabItem>
          <VTabItem name="2" label="Таб 2" closable> Контент другого табу</VTabItem>
          <VTabItem name="3" label="Таб 3 (disabled)" disabled> Контент третього табу</VTabItem>
        </VTabs>
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомний заголовок ─── -->
    <DocSection
      title="Кастомний заголовок через слот #title"
      description="Слот #title отримує { isActive } — можна змінювати стиль залежно від стану"
    >
      <DocPreview>
        <VTabs v-model="activeCustom">
          <VTabItem name="custom">
            <template #title="{ isActive }">
              <span :style="{ color: isActive ? '#e74c3c' : 'inherit', fontWeight: isActive ? 600 : 400 }">
                ⭐ Кастомний заголовок
              </span>
            </template>
            Контент кастомного табу з HTML-заголовком
          </VTabItem>
          <VTabItem name="normal" label="Звичайний таб"> Звичайний контент</VTabItem>
        </VTabs>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature title="name як ключ" icon="🔑">
        <code>name</code> у <code>VTabItem</code> — це те що зберігається в <code>v-model</code>. Має бути унікальним
        серед всіх вкладок в одному <code>VTabs</code>.
      </DocFeature>
      <DocFeature title="closable + @tab-remove" icon="✕">
        <code>closable</code> показує кнопку закриття. При кліку емітується <code>@tab-remove</code> з
        <code>name</code> вкладки — видалення з масиву робиш сам у батьківському компоненті.
      </DocFeature>
      <DocFeature title="Слот #title з isActive" icon="🎨">
        <code>{ isActive }</code> дозволяє змінювати стиль заголовку залежно від того чи вкладка активна — для іконок зі
        станом, кольорових індикаторів тощо.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style scoped lang="scss">
  .tabs-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
