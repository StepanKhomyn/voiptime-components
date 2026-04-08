<script lang="ts" setup>
  import { VMessage } from '@/components/message/message-plugin';
  import VButton from '@/components/button/VButton.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import DocCodeBlock from './helper/DocCodeBlock.vue';

  const propsSections: TableSection[] = [
    {
      title: 'VMessage(options)',
      rows: [
        { name: 'message', type: 'string', default: '-', description: 'Текст повідомлення', required: true },
        {
          name: 'type',
          type: "'success' | 'danger' | 'warning' | 'primary'",
          default: "'primary'",
          description: 'Тип — визначає колір і іконку',
        },
        { name: 'title', type: 'string', default: '-', description: 'Заголовок повідомлення' },
        { name: 'showClose', type: 'boolean', default: 'false', description: 'Показувати кнопку закриття ✕' },
        {
          name: 'duration',
          type: 'number',
          default: '3000',
          description: 'Час відображення (мс). 0 — без автозакриття',
        },
        {
          name: 'dangerouslyUseHTMLString',
          type: 'boolean',
          default: 'false',
          description: 'Дозволити HTML у тексті (обережно!)',
        },
      ],
    },
    {
      title: 'Статичні методи VMessage',
      rows: [
        {
          name: 'VMessage(options)',
          type: 'VMessageOptions → number',
          description: 'Основний метод — повертає ID повідомлення',
        },
        { name: 'VMessage.success(msg)', type: 'string → number', description: 'Швидкий success' },
        { name: 'VMessage.danger(msg)', type: 'string → number', description: 'Швидкий danger' },
        { name: 'VMessage.warning(msg)', type: 'string → number', description: 'Швидкий warning' },
        { name: 'VMessage.primary(msg)', type: 'string → number', description: 'Швидкий primary' },
        { name: 'VMessage.close(id)', type: 'number → void', description: 'Закрити конкретне повідомлення' },
        { name: 'VMessage.closeAll()', type: 'void', description: 'Закрити всі активні повідомлення' },
      ],
    },
  ];
</script>

<template>
  <div class="message-showcase">
    <!-- ─── Типи ─── -->
    <DocSection title="Типи повідомлень">
      <DocPreview>
        <VButton type="success" @click="VMessage({ type: 'success', message: 'Операція виконана успішно!' })">
          Success
        </VButton>
        <VButton type="danger" @click="VMessage({ type: 'danger', message: 'Виникла помилка!' })"> Danger </VButton>
        <VButton type="warning" @click="VMessage({ type: 'warning', message: 'Попередження!' })"> Warning </VButton>
        <VButton type="primary" @click="VMessage({ message: 'Інформаційне повідомлення' })">
          Primary (default)
        </VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── Опції ─── -->
    <DocSection title="Опції відображення">
      <DocPreview>
        <VButton type="success" @click="VMessage({ type: 'success', message: 'З кнопкою закриття', showClose: true })">
          З кнопкою закриття
        </VButton>
        <VButton
          type="warning"
          @click="
            VMessage({ type: 'warning', message: 'Без автозакриття — закрий вручну', showClose: true, duration: 0 })
          "
        >
          Без автозакриття
        </VButton>
        <VButton
          type="primary"
          @click="VMessage({ type: 'primary', message: 'Зникне через 10 секунд', duration: 10000 })"
        >
          Довге (10 сек)
        </VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── HTML ─── -->
    <DocSection title="HTML контент" description="dangerouslyUseHTMLString — використовуй тільки з довіреним контентом">
      <DocPreview>
        <VButton @click="VMessage({ message: 'Завантаження: <b>75%</b>', dangerouslyUseHTMLString: true })">
          З bold тегом
        </VButton>
        <VButton
          @click="
            VMessage({
              type: 'success',
              message: 'Файл <em>document.pdf</em> збережено',
              dangerouslyUseHTMLString: true,
              showClose: true,
            })
          "
        >
          З em тегом
        </VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── closeAll ─── -->
    <DocSection title="Керування кількома повідомленнями">
      <DocPreview>
        <VButton
          type="primary"
          @click="
            () => {
              VMessage({ type: 'primary', message: 'Повідомлення 1', duration: 8000 });
              VMessage({ type: 'warning', message: 'Повідомлення 2', duration: 8000 });
              VMessage({ type: 'success', message: 'Повідомлення 3', duration: 8000 });
            }
          "
        >
          Показати кілька
        </VButton>
        <VButton @click="VMessage.closeAll()"> Закрити всі </VButton>
      </DocPreview>
    </DocSection>

    <!-- ─── Швидкі методи ─── -->
    <DocSection title="Швидкі методи">
      <DocCodeBlock
        language="ts"
        :code="`// Замість VMessage({ type: 'success', message: '...' })
VMessage.success('Операція завершена')
VMessage.danger('Сталася помилка')
VMessage.warning('Увага!')
VMessage.primary('Інформація')

// Додаткові опції — другим параметром
VMessage.success('Збережено', { showClose: true, duration: 5000 })`"
      />
    </DocSection>

    <!-- ─── Підключення ─── -->
    <DocSection title="Способи підключення">
      <DocCodeBlock
        language="ts"
        :code="`// 1. Прямий імпорт (рекомендовано)
import { VMessage } from '@/components/message/message-plugin'
VMessage({ type: 'success', message: 'Успіх!' })

// 2. Options API
export default {
  methods: {
    showMessage() {
      this.\$message({ type: 'success', message: 'Через this.\$message!' })
    }
  }
}

// 3. Composition API через inject
import { inject } from 'vue'
const \$message = inject('\$message')
\$message({ type: 'primary', message: 'Через inject' })`"
      />
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature title="duration: 0 = без автозакриття" icon="📌">
        Повідомлення залишається на екрані поки користувач не натисне ✕. Завжди додавай
        <code>showClose: true</code> разом з <code>duration: 0</code>.
      </DocFeature>
      <DocFeature title="ID для точного закриття" icon="🎯">
        <code>const id = VMessage({ ... })</code> — зберігай ID і закривай точне повідомлення через
        <code>VMessage.close(id)</code>.
      </DocFeature>
      <DocFeature title="dangerouslyUseHTMLString" icon="⚠️">
        Ніколи не передавай user-generated контент в HTML-режимі — ризик XSS. Тільки для шаблонних рядків в коді.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style scoped lang="scss">
  .message-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>
