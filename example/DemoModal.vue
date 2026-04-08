<script lang="ts" setup>
  import { reactive } from 'vue';
  import VModal from '@/components/modal/VModal.vue';
  import VButton from '@/components/button/VButton.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import DocCodeBlock from './helper/DocCodeBlock.vue';

  const modals = reactive({
    basic: false,
    small: false,
    medium: false,
    large: false,
    noClose: false,
    noBackdrop: false,
  });

  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        { name: 'modelValue', type: 'boolean', default: '-', description: 'Стан вікна (v-model)', required: true },
        { name: 'title', type: 'string', default: '-', description: 'Заголовок вікна' },
        { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Розмір вікна' },
        { name: 'showCloseButton', type: 'boolean', default: 'true', description: 'Показувати кнопку ✕' },
        { name: 'closeOnBackdropClick', type: 'boolean', default: 'true', description: 'Закривати кліком по backdrop' },
        { name: 'zIndex', type: 'number', default: '1000', description: 'Z-index вікна' },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'update:modelValue', type: 'boolean', description: 'Зміна стану (v-model)' },
        { name: 'close', type: '-', description: 'Вікно закрито' },
      ],
    },
    {
      title: 'Slots',
      rows: [
        { name: 'default', description: 'Основний контент вікна' },
        { name: 'footer', description: 'Футер — кнопки дій (замінює стандартний)' },
      ],
    },
  ];

  const modalManagerSections: TableSection[] = [
    {
      title: 'modalManager методи',
      rows: [
        { name: 'open(config)', type: 'VModalConfig → string', description: 'Відкриває вікно програмно, повертає ID' },
        { name: 'close()', type: '-', description: 'Закриває останнє відкрите вікно' },
        { name: 'closeById(id)', type: 'string', description: 'Закриває вікно за ID' },
        { name: 'closeAll()', type: '-', description: 'Закриває всі вікна' },
      ],
    },
    {
      title: 'VModalConfig',
      rows: [
        { name: 'title', type: 'string', description: 'Заголовок вікна' },
        { name: 'content', type: 'string', description: 'HTML-контент (якщо немає component)' },
        { name: 'component', type: 'Component', description: 'Vue-компонент як вміст вікна' },
        { name: 'props', type: 'object', description: 'Props для component' },
        { name: 'size', type: 'string', description: 'Розмір вікна' },
        { name: 'closeOnBackdropClick', type: 'boolean', description: 'Закривати кліком по backdrop' },
      ],
    },
  ];
</script>

<template>
  <div class="modal-showcase">
    <!-- ─── Розміри ─── -->
    <DocSection title="Розміри">
      <DocPreview>
        <VButton size="small" @click="modals.small = true">Small</VButton>
        <VButton @click="modals.medium = true">Medium</VButton>
        <VButton type="success" @click="modals.large = true">Large</VButton>
      </DocPreview>

      <VModal v-model="modals.small" size="small" title="Маленьке вікно">
        <p>Маленьке модальне вікно для простих повідомлень.</p>
      </VModal>

      <VModal v-model="modals.medium" size="medium" title="Середнє вікно">
        <p>Середнє модальне вікно — стандартний розмір.</p>
      </VModal>

      <VModal v-model="modals.large" size="large" title="Велике вікно">
        <p>Велике модальне вікно для складного контенту — форми, таблиці, деталі.</p>
      </VModal>
    </DocSection>

    <!-- ─── Поведінка закриття ─── -->
    <DocSection title="Поведінка закриття">
      <DocPreview>
        <VButton type="warning" @click="modals.noClose = true">Без кнопки ✕</VButton>
        <VButton type="danger" @click="modals.noBackdrop = true">Без закриття по backdrop</VButton>
      </DocPreview>

      <VModal v-model="modals.noClose" :show-close-button="false" title="Без кнопки ✕">
        <p>Кнопка закриття прихована. Клікніть поза вікном щоб закрити.</p>
      </VModal>

      <VModal v-model="modals.noBackdrop" :close-on-backdrop-click="false" title="Без закриття по backdrop">
        <p>Клік поза вікном не закриває його — тільки кнопка нижче.</p>
        <template #footer>
          <VButton type="danger" @click="modals.noBackdrop = false">Закрити</VButton>
        </template>
      </VModal>
    </DocSection>

    <!-- ─── Слот footer ─── -->
    <DocSection description="Для кнопок підтвердження/скасування" title="Слот #footer">
      <DocPreview
        :code="`<VModal v-model=&quot;isOpen&quot; title=&quot;Підтвердження дії&quot;>
  <p>Ви впевнені що хочете видалити запис?</p>

  <template #footer>
    <VButton @click=&quot;isOpen = false&quot;>Скасувати</VButton>
    <VButton type=&quot;danger&quot; @click=&quot;confirm&quot;>Видалити</VButton>
  </template>
</VModal>`"
      >
        <VButton type="danger" @click="modals.noBackdrop = true">Відкрити приклад</VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── Програмне API ─── -->
    <DocSection
      description="Відкриття вікон без v-model — зручно в composables і сервісах"
      title="Програмне API (modalManager)"
    >
      <DocCodeBlock
        :code="`import { useModalManager } from 'voiptime-components'
import MyFormComponent from './MyFormComponent.vue'

const modalManager = useModalManager()

// Відкрити вікно з компонентом
const id = modalManager.open({
  component: MyFormComponent,
  title: 'Редагування запису',
  size: 'large',
  closeOnBackdropClick: false,
  props: {
    recordId: 42,
    'onSave': (data) => {
      console.log('saved:', data)
      modalManager.closeById(id)
    },
  },
})

// Закрити
modalManager.close()      // останнє
modalManager.closeById(id) // конкретне
modalManager.closeAll()   // всі`"
        language="ts"
      />
    </DocSection>

    <!-- ─── Підключення ─── -->
    <DocSection title="Підключення плагіну">
      <DocCodeBlock
        :code="`// main.ts
import { createApp } from 'vue'
import VoiptimeComponents from 'voiptime-components'
import App from './App.vue'

const app = createApp(App)
app.use(VoiptimeComponents, { modal: true })
app.mount('#app')`"
        language="ts"
      />
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── modalManager API ─── -->
    <DocSection title="modalManager API">
      <DocPropsTable :sections="modalManagerSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🔀" title="v-model vs modalManager">
        <code>v-model</code> — для вікон що є частиною шаблону компонента. <code>modalManager.open()</code> — для
        динамічного відкриття з будь-якого місця (сервіс, composable, обробник події).
      </DocFeature>
      <DocFeature icon="🧩" title="Компонент у модалці">
        Передай <code>component</code> і <code>props</code> в <code>modalManager.open()</code> — будь-який Vue-компонент
        рендериться всередині вікна без зайвої обгортки.
      </DocFeature>
      <DocFeature icon="🦶" title="Слот #footer">
        Без <code>#footer</code> — стандартна кнопка закриття. З <code>#footer</code> — повний контроль над кнопками
        дій.
      </DocFeature>
      <DocFeature icon="🔒" title="closeOnBackdropClick: false">
        Використовуй для форм і незбережених даних — запобігає випадковому закриттю. Обов'язково додай явну кнопку
        закриття в <code>#footer</code>.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .modal-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
