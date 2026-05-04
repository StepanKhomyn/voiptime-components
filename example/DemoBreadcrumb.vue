<script lang="ts" setup>
  import VBreadcrumb from '@/components/breadcrumb/VBreadcrumb.vue';
  import VBreadcrumbItem from '@/components/breadcrumb/VBreadcrumbItem.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';

  // --- Документація ---
  const propsSections: TableSection[] = [
    {
      title: 'VBreadcrumb Props',
      rows: [
        {
          name: 'separator',
          type: 'string',
          default: "'/'",
          description: 'Роздільник між елементами — передається через provide у всі дочірні VBreadcrumbItem',
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: "'breadcrumb'",
          description: 'aria-label для <nav> елемента — важливо для accessibility',
        },
      ],
    },
    {
      title: 'VBreadcrumbItem Props',
      rows: [
        {
          name: 'to',
          type: 'string | RouteLocationRaw',
          default: 'undefined',
          description: 'Якщо передано — рендериться як RouterLink (або <a>). Якщо не передано — як <span>',
        },
        {
          name: 'active',
          type: 'boolean',
          default: 'false',
          description: 'Позначає поточну сторінку. Рендериться як <span>, додає aria-current="page", прибирає hover',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Вимикає клік та навігацію, змінює колір на сірий',
        },
      ],
    },
    {
      title: 'VBreadcrumbItem Events',
      rows: [
        {
          name: 'click',
          type: 'MouseEvent',
          description: 'Клік по елементу — не спрацьовує якщо active або disabled',
        },
      ],
    },
  ];
</script>

<template>
  <div class="breadcrumb-showcase">
    <!-- ─── Базовий ─── -->
    <DocSection title="Базовий">
      <DocPreview>
        <VBreadcrumb>
          <VBreadcrumbItem to="/">Головна</VBreadcrumbItem>
          <VBreadcrumbItem to="/users">Користувачі</VBreadcrumbItem>
          <VBreadcrumbItem active>Іван Франко</VBreadcrumbItem>
        </VBreadcrumb>
      </DocPreview>
    </DocSection>

    <!-- ─── Кастомний separator ─── -->
    <DocSection description="Передайте будь-який символ у проп separator" title="Кастомний роздільник">
      <DocPreview>
        <VBreadcrumb separator="›">
          <VBreadcrumbItem to="/">Головна</VBreadcrumbItem>
          <VBreadcrumbItem to="/settings">Налаштування</VBreadcrumbItem>
          <VBreadcrumbItem active>Профіль</VBreadcrumbItem>
        </VBreadcrumb>

        <VBreadcrumb separator="|">
          <VBreadcrumbItem to="/">Головна</VBreadcrumbItem>
          <VBreadcrumbItem to="/reports">Звіти</VBreadcrumbItem>
          <VBreadcrumbItem active>Серпень 2024</VBreadcrumbItem>
        </VBreadcrumb>

        <VBreadcrumb separator="→">
          <VBreadcrumbItem to="/">Головна</VBreadcrumbItem>
          <VBreadcrumbItem to="/orders">Замовлення</VBreadcrumbItem>
          <VBreadcrumbItem active>#ORD-4821</VBreadcrumbItem>
        </VBreadcrumb>
      </DocPreview>
    </DocSection>

    <!-- ─── Disabled елемент ─── -->
    <DocSection description="Елемент з disabled не реагує на кліки та виглядає неактивним" title="Disabled елемент">
      <DocPreview>
        <VBreadcrumb>
          <VBreadcrumbItem to="/">Головна</VBreadcrumbItem>
          <VBreadcrumbItem disabled>Недоступний розділ</VBreadcrumbItem>
          <VBreadcrumbItem active>Поточна сторінка</VBreadcrumbItem>
        </VBreadcrumb>
      </DocPreview>
    </DocSection>

    <!-- ─── Довгий ланцюжок ─── -->
    <DocSection description="Компонент підтримує будь-яку кількість рівнів вкладеності" title="Глибока вкладеність">
      <DocPreview>
        <VBreadcrumb separator="/">
          <VBreadcrumbItem to="/">Головна</VBreadcrumbItem>
          <VBreadcrumbItem to="/catalog">Каталог</VBreadcrumbItem>
          <VBreadcrumbItem to="/catalog/electronics">Електроніка</VBreadcrumbItem>
          <VBreadcrumbItem to="/catalog/electronics/phones">Телефони</VBreadcrumbItem>
          <VBreadcrumbItem active>iPhone 15 Pro</VBreadcrumbItem>
        </VBreadcrumb>
      </DocPreview>
    </DocSection>

    <!-- ─── Один елемент ─── -->
    <DocSection
      description="Коли користувач знаходиться на головній — separator не відображається"
      title="Один елемент"
    >
      <DocPreview>
        <VBreadcrumb>
          <VBreadcrumbItem active>Головна</VBreadcrumbItem>
        </VBreadcrumb>
      </DocPreview>
    </DocSection>

    <!-- ─── З іконками через слот ─── -->
    <DocSection description="Слот VBreadcrumbItem приймає будь-який контент" title="З іконками">
      <DocPreview>
        <VBreadcrumb separator="›">
          <VBreadcrumbItem to="/"> 🏠 Головна</VBreadcrumbItem>
          <VBreadcrumbItem to="/users"> 👥 Користувачі</VBreadcrumbItem>
          <VBreadcrumbItem active> 👤 Профіль</VBreadcrumbItem>
        </VBreadcrumb>
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature icon="🎯" title="Compound component патерн">
        <code>VBreadcrumb</code> + <code>VBreadcrumbItem</code> — споживач повністю контролює кількість та вміст
        елементів без передачі масиву об'єктів.
      </DocFeature>
      <DocFeature icon="🔗" title="Розумний рендеринг тегів">
        <code>VBreadcrumbItem</code> автоматично рендериться як <code>RouterLink</code> (якщо є <code>to</code>), або як
        <code>span</code> (якщо <code>active</code>, <code>disabled</code>, або немає <code>to</code>). Vue Router не є
        обов'язковою залежністю.
      </DocFeature>
      <DocFeature icon="♿" title="Accessibility out-of-the-box">
        Компонент використовує семантичний <code>&lt;nav aria-label&gt;</code>, список <code>&lt;ol&gt;</code> та
        атрибут <code>aria-current="page"</code> на активному елементі — відповідає WCAG 2.1.
      </DocFeature>
      <DocFeature icon="↕️" title="Separator через provide/inject">
        Separator передається батьківським <code>VBreadcrumb</code> через <code>provide</code> — не потрібно передавати
        проп у кожен <code>VBreadcrumbItem</code> окремо.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style lang="scss" scoped>
  .breadcrumb-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;

    // Відступ між прикладами separator
    .vt-breadcrumb + .vt-breadcrumb {
      margin-top: 12px;
    }
  }
</style>
