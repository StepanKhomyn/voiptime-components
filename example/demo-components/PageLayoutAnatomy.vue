<script setup>
  import { ref } from 'vue';

  defineOptions({ name: 'PageLayoutAnatomy' });

  // ── Синхронізований hover: наведення на зону діаграми або на рядок легенди
  // підсвічує обидва одночасно (той самий ключ) ─────────────────────────────
  const hoverKey = ref('');
  const isActive = (key) => hoverKey.value === key;
  const setHover = (key) => (hoverKey.value = key);
  const clearHover = () => (hoverKey.value = '');

  // ── Копіювання класу в буфер, як у вкладці "Кольори" ─────────────────────
  const copiedClass = ref('');
  function copyClass(cls) {
    navigator.clipboard.writeText(cls);
    copiedClass.value = cls;
    setTimeout(() => (copiedClass.value = ''), 1200);
  }
  const isCopied = (cls) => copiedClass.value === cls;

  // ── Живі перемикачі модифікаторів — реально змінюють верстку мокапу ─────
  const cardMode = ref('default'); // default | shrink | grow
  const headerEnd = ref(false);
  const formColumn = ref(false);
  const bodyPadded = ref(false);
  const rowNested = ref(false);
  const fieldsetInvalid = ref(false);

  const showMarkupA = ref(false);
  const showMarkupB = ref(false);

  // Обчислювані повні назви класів для тегів-мокапів (щоб клік копіював
  // саме те, що зараз намальовано, з урахуванням активних модифікаторів)
  const cardClass = () => `.vt-page__card${cardMode.value !== 'default' ? ' .vt-page__card--' + cardMode.value : ''}`;
  const headerClass = () => `.vt-page__card-header${headerEnd.value ? ' .vt-page__card-header--end' : ''}`;
  const formClass = () => `.vt-page__card-form${formColumn.value ? ' .vt-page__card-form--column' : ''}`;
  const formBodyClass = () => `.vt-page__card-form-body${bodyPadded.value ? ' .vt-page__card-form-body--padded' : ''}`;
  const rowClass = () => `.vt-page__card-form-body-row${rowNested.value ? ' .vt-page__card-form-body-row--nested' : ''}`;

  // ── Легенда: усі класи з page.scss, згруповані по секціях ───────────────
  const legendSections = [
    {
      title: 'Каркас застосунку (.vt-layout)',
      items: [
        { key: 'layout-header', selector: '.vt-layout__header', desc: 'Верхня панель, 60px, фіксована висота, фон --color-primary-hover.' },
        { key: 'layout-header', selector: '.vt-layout__header-inner', desc: 'Внутрішній wrapper: логотип зліва, actions справа (space-between).' },
        { key: 'layout-body', selector: '.vt-layout__body', desc: 'Flex-рядок під хедером, height: calc(100vh - 60px), overflow: hidden.' },
        { key: 'layout-main', selector: '.vt-layout__main', desc: 'Контентна зона, flex-grow, padding, містить .vt-breadcrumb + .vt-page.' },
      ],
    },
    {
      title: 'Сторінка (.vt-page)',
      items: [
        { key: 'page', selector: '.vt-page', desc: 'Кореневий флекс-контейнер сторінки, flex-direction: column, height: 100%.' },
        { key: 'card', selector: '.vt-page__card', desc: 'Головна картка. САМА ПО СОБІ вже є flex-контейнером для звичайного вертикального контенту — окремий -form не потрібен.' },
        { key: 'card', selector: '.vt-page__card--shrink', desc: 'Модифікатор: картка по висоті контенту, не розтягується (height: auto).' },
        { key: 'card', selector: '.vt-page__card--grow', desc: 'Модифікатор: картка займає залишок висоти (flex: 1 1 0, min-height: 0).' },
        { key: 'footer', selector: '.vt-page__footer', desc: 'Футер сторінки: кнопки, притиснуті вправо (justify-content: flex-end).' },
      ],
    },
    {
      title: 'Хедер картки та фільтр',
      items: [
        { key: 'card-header', selector: '.vt-page__card-header', desc: 'Рядок хедера картки: фільтр зліва, кнопка(и) справа (space-between).' },
        { key: 'card-header', selector: '.vt-page__card-header--end', desc: 'Модифікатор: без фільтра — весь контент притиснутий вправо.' },
        { key: 'card-filter', selector: '.vt-page__card-filter', desc: 'Обгортка динамічного фільтра.' },
        { key: 'card-filter', selector: '.vt-page__card-filter__inline', desc: 'Самі поля фільтра — можуть стискатись (flex-shrink: 1, min-width: 0).' },
        { key: 'card-filter', selector: '.vt-page__card-filter__actions', desc: 'Кнопки дій фільтра — не стискаються (flex-shrink: 0).' },
        { key: 'card-filter', selector: '.vt-page__card-filter__dropdown', desc: 'Прихована частина фільтра, що ховається у dropdown при нестачі місця.' },
        { key: 'card-filter', selector: '.vt-page__card-filter__measure-root', desc: 'Технічний елемент поза екраном — вимірює ширину полів для авто-згортання в dropdown.' },
      ],
    },
    {
      title: 'Горизонтальний спліт (.vt-page__card-form)',
      items: [
        { key: 'card-form', selector: '.vt-page__card-form', desc: 'ТІЛЬКИ для горизонтальних колонок бік-о-бік всередині ОДНІЄЇ картки (напр. форма + бічна панель).' },
        { key: 'card-form', selector: '.vt-page__card-form--column', desc: 'Модифікатор: колонка замість рядка — колонки складаються одна під одною.' },
        { key: 'card-form-header', selector: '.vt-page__card-form-header', desc: 'Хедер під-секції: 46px, border-bottom, текст --color-primary-main.' },
        { key: 'card-form-body', selector: '.vt-page__card-form-body', desc: 'Скрол-зона під-секції, flex-direction: column, overflow-y: auto.' },
        { key: 'card-form-body', selector: '.vt-page__card-form-body--padded', desc: 'Модифікатор: горизонтальний padding зліва/справа.' },
        { key: 'card-form-body-item', selector: '.vt-page__card-form-body-item', desc: 'Рядок "label (250px) + контрол". Клас .vt-label-required додає "*".' },
        { key: 'card-form-body-row', selector: '.vt-page__card-form-body-row', desc: 'Рядок без label — для inline-форм (напр. caller-id).' },
        { key: 'card-form-body-row', selector: '.vt-page__card-form-body-row--nested', desc: 'Модифікатор: зміщений вкладений рядок (+16px відступу зліва).' },
      ],
    },
    {
      title: 'Утиліти та примітиви',
      items: [
        { key: 'card-stack', selector: '.vt-card-stack', desc: 'Вертикальний стек карток (напр. декілька карток у бічній панелі), flex-direction: column, gap.' },
        { key: 'fieldset', selector: '.vt-fieldset', desc: 'Секція з "плаваючим" заголовком (fieldset-паттерн), border + border-radius.' },
        { key: 'fieldset-title', selector: '.vt-fieldset__title', desc: 'Заголовок, що "лежить" на межі border (position: absolute), фон #fff перекриває лінію.' },
        { key: 'fieldset', selector: '.vt-fieldset--invalid', desc: 'Модифікатор: червона рамка + червоний заголовок при помилці валідації.' },
      ],
    },
  ];
</script>

<template>
  <div class="lm">
    <!-- Header -->
    <div class="lm__intro">
      <div class="lm__intro-badge">page.scss</div>
      <h1 class="lm__title">Анатомія лейауту</h1>
      <p class="lm__subtitle">
        Наведи курсор на будь-яку зону мокапу — підсвітиться відповідний клас у легенді (і навпаки). Клік по тегу класу —
        копіює його в буфер. Перемикачі під мокапами вмикають реальні модифікатори.
      </p>
      <div class="lm__key-insight">
        <span>🔑</span>
        <div>
          <strong>Головне правило:</strong> <code class="lm__inline-code">.vt-page__card</code> сам по собі вже flex-контейнер
          для звичайного вертикального контенту — коли колонка одна, він стоїть напряму в <code class="lm__inline-code">.vt-page</code>.
          <code class="lm__inline-code">.vt-page__card-form</code> — це зовнішній flex-двигун (flex-grow, overflow: hidden,
          gap), який ОБГОРТАЄ одну або кілька <code class="lm__inline-code">.vt-page__card</code> ЗЗОВНІ. Одна картка всередині —
          просто щоб отримати scroll-поведінку; кілька карток — і вони автоматично стають колонками поряд.
        </div>
      </div>
    </div>

    <!-- ── PATTERN A: одноколонковий контент ─────────────────────────────── -->
    <section class="lm__section">
      <h2 class="lm__section-title">Патерн A — звичайний вертикальний контент</h2>
      <p class="lm__section-desc">Найчастіший випадок: список, картка деталей, будь-яка сторінка без бічної колонки.</p>

      <div class="lm__stage">
        <!-- vt-layout__header -->
        <div
          :class="['lm__zone', 'lm__zone--header-box', isActive('layout-header') && 'is-active']"
          @mouseenter="setHover('layout-header')"
          @mouseleave="clearHover"
        >
          <span class="lm__zone-tag" @click.stop="copyClass('.vt-layout__header')">
            .vt-layout__header <b v-if="isCopied('.vt-layout__header')">✓</b>
          </span>
          <div class="lm__row lm__row--between">
            <div class="lm__mock-logo" />
            <div class="lm__row lm__row--gap-sm">
              <span class="lm__mock-icon" /><span class="lm__mock-icon" />
            </div>
          </div>
        </div>

        <!-- vt-layout__body -->
        <div
          :class="['lm__zone', 'lm__zone--plain-pad', isActive('layout-body') && 'is-active']"
          @mouseenter="setHover('layout-body')"
          @mouseleave="clearHover"
        >
          <span class="lm__zone-tag lm__zone-tag--plain" @click.stop="copyClass('.vt-layout__body')">.vt-layout__body</span>

          <!-- vt-layout__main -->
          <div
            :class="['lm__zone', 'lm__zone--plain-pad', isActive('layout-main') && 'is-active']"
            @mouseenter.stop="setHover('layout-main')"
            @mouseleave.stop="clearHover"
          >
            <span class="lm__zone-tag lm__zone-tag--plain" @click.stop="copyClass('.vt-layout__main')">.vt-layout__main</span>
            <div class="lm__mock-breadcrumb">Головна / Список викликів</div>

            <!-- vt-page -->
            <div
              :class="['lm__zone', 'lm__zone--plain', isActive('page') && 'is-active']"
              @mouseenter.stop="setHover('page')"
              @mouseleave.stop="clearHover"
            >
              <span class="lm__zone-tag lm__zone-tag--plain" @click.stop="copyClass('.vt-page')">.vt-page</span>

              <!-- vt-page__card -->
              <div
                :class="['lm__zone', 'lm__zone--card-box', isActive('card') && 'is-active', cardMode !== 'default' && 'is-' + cardMode]"
                @mouseenter.stop="setHover('card')"
                @mouseleave.stop="clearHover"
              >
                <span class="lm__zone-tag" @click.stop="copyClass(cardClass())">
                  {{ cardMode === 'default' ? '.vt-page__card' : `.vt-page__card--${cardMode}` }}
                  <b v-if="isCopied(cardClass())">✓</b>
                </span>

                <!-- vt-page__card-header -->
                <div
                  :class="['lm__zone', 'lm__zone--header-row-box', isActive('card-header') && 'is-active']"
                  @mouseenter.stop="setHover('card-header')"
                  @mouseleave.stop="clearHover"
                >
                  <span class="lm__zone-tag lm__zone-tag--tiny" @click.stop="copyClass(headerClass())">
                    .vt-page__card-header{{ headerEnd ? ' --end' : '' }} <b v-if="isCopied(headerClass())">✓</b>
                  </span>
                  <div :class="['lm__row', headerEnd ? 'lm__row--end' : 'lm__row--between']">
                    <!-- vt-page__card-filter -->
                    <div
                      v-if="!headerEnd"
                      :class="['lm__zone', 'lm__zone--filter-box', isActive('card-filter') && 'is-active']"
                      @mouseenter.stop="setHover('card-filter')"
                      @mouseleave.stop="clearHover"
                    >
                      <span class="lm__zone-tag lm__zone-tag--tiny" @click.stop="copyClass('.vt-page__card-filter')">
                        .vt-page__card-filter <b v-if="isCopied('.vt-page__card-filter')">✓</b>
                      </span>
                      <div class="lm__row lm__row--gap-sm">
                        <div class="lm__mock-field" />
                        <div class="lm__mock-field lm__mock-field--sm" />
                      </div>
                    </div>
                    <div class="lm__mock-btn">+ Додати</div>
                  </div>
                </div>

                <div class="lm__mock-body">
                  <div class="lm__mock-row" /><div class="lm__mock-row" /><div class="lm__mock-row lm__mock-row--faded" />
                </div>
              </div>

              <!-- vt-page__footer -->
              <div
                :class="['lm__zone', 'lm__zone--footer-box', isActive('footer') && 'is-active']"
                @mouseenter.stop="setHover('footer')"
                @mouseleave.stop="clearHover"
              >
                <span class="lm__zone-tag lm__zone-tag--tiny" @click.stop="copyClass('.vt-page__footer')">
                  .vt-page__footer <b v-if="isCopied('.vt-page__footer')">✓</b>
                </span>
                <div class="lm__row lm__row--end">
                  <div class="lm__mock-btn lm__mock-btn--ghost">Скасувати</div>
                  <div class="lm__mock-btn">Зберегти</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lm__toggles">
        <span class="lm__toggles-label">card:</span>
        <button :class="['lm__chip', cardMode === 'default' && 'is-on']" @click="cardMode = 'default'">default</button>
        <button :class="['lm__chip', cardMode === 'shrink' && 'is-on']" @click="cardMode = 'shrink'">--shrink</button>
        <button :class="['lm__chip', cardMode === 'grow' && 'is-on']" @click="cardMode = 'grow'">--grow</button>
        <span class="lm__toggles-sep" />
        <button :class="['lm__chip', headerEnd && 'is-on']" @click="headerEnd = !headerEnd">card-header--end</button>
        <button class="lm__chip lm__chip--code" @click="showMarkupA = !showMarkupA">
          {{ showMarkupA ? 'сховати розмітку' : '</> показати розмітку' }}
        </button>
      </div>

      <pre v-if="showMarkupA" class="lm__markup">&lt;div class="vt-page"&gt;
  &lt;div class="vt-page__card{{ cardMode !== 'default' ? ' vt-page__card--' + cardMode : '' }}"&gt;
    &lt;div class="vt-page__card-header{{ headerEnd ? ' vt-page__card-header--end' : '' }}"&gt;<template v-if="!headerEnd">
      &lt;div class="vt-page__card-filter"&gt;...&lt;/div&gt;</template>
      &lt;VButton&gt;Додати&lt;/VButton&gt;
    &lt;/div&gt;
    &lt;!-- контент напряму в card, без card-form --&gt;
    &lt;div class="vt-page__card-form-body"&gt;...&lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="vt-page__footer"&gt;...&lt;/div&gt;
&lt;/div&gt;</pre>
    </section>

    <!-- ── PATTERN B: горизонтальний спліт ───────────────────────────────── -->
    <section class="lm__section">
      <h2 class="lm__section-title">Патерн B — дві колонки в одній картці</h2>
      <p class="lm__section-desc">
        Коли всередині <code class="lm__inline-code">.vt-page__card</code> потрібно розмістити форму і бічну панель поруч —
        для цього і є <code class="lm__inline-code">.vt-page__card-form</code>.
      </p>

      <div class="lm__stage">
        <div
          :class="['lm__zone', 'lm__zone--card-box', isActive('card') && 'is-active']"
          @mouseenter="setHover('card')"
          @mouseleave="clearHover"
        >
          <span class="lm__zone-tag" @click.stop="copyClass('.vt-page__card')">
            .vt-page__card <b v-if="isCopied('.vt-page__card')">✓</b>
          </span>

          <!-- vt-page__card-form -->
          <div
            :class="['lm__zone', 'lm__zone--form-box', isActive('card-form') && 'is-active']"
            @mouseenter.stop="setHover('card-form')"
            @mouseleave.stop="clearHover"
          >
            <span class="lm__zone-tag lm__zone-tag--tiny" @click.stop="copyClass(formClass())">
              .vt-page__card-form{{ formColumn ? ' --column' : '' }} <b v-if="isCopied(formClass())">✓</b>
            </span>

            <div :class="['lm__row', 'lm__row--form', formColumn && 'is-column']">
              <div class="lm__col lm__col--grow-2">
                <!-- vt-page__card-form-header -->
                <div
                  :class="['lm__zone', 'lm__zone--form-header-box', isActive('card-form-header') && 'is-active']"
                  @mouseenter.stop="setHover('card-form-header')"
                  @mouseleave.stop="clearHover"
                >
                  <span class="lm__zone-tag lm__zone-tag--tiny" @click.stop="copyClass('.vt-page__card-form-header')">
                    .vt-page__card-form-header <b v-if="isCopied('.vt-page__card-form-header')">✓</b>
                  </span>
                  <div class="lm__mock-text">Основна інформація</div>
                </div>

                <!-- vt-page__card-form-body -->
                <div
                  :class="['lm__zone', 'lm__zone--form-body-box', isActive('card-form-body') && 'is-active', bodyPadded && 'is-padded']"
                  @mouseenter.stop="setHover('card-form-body')"
                  @mouseleave.stop="clearHover"
                >
                  <span class="lm__zone-tag lm__zone-tag--tiny" @click.stop="copyClass(formBodyClass())">
                    .vt-page__card-form-body{{ bodyPadded ? ' --padded' : '' }} <b v-if="isCopied(formBodyClass())">✓</b>
                  </span>

                  <!-- vt-page__card-form-body-item -->
                  <div
                    :class="['lm__zone', 'lm__zone--item-box', isActive('card-form-body-item') && 'is-active']"
                    @mouseenter.stop="setHover('card-form-body-item')"
                    @mouseleave.stop="clearHover"
                  >
                    <span class="lm__zone-tag lm__zone-tag--tiny" @click.stop="copyClass('.vt-page__card-form-body-item')">
                      -item <b v-if="isCopied('.vt-page__card-form-body-item')">✓</b>
                    </span>
                    <div class="lm__row lm__row--gap-sm">
                      <div class="lm__mock-label" />
                      <div class="lm__mock-field" />
                    </div>
                  </div>

                  <!-- vt-page__card-form-body-row -->
                  <div
                    :class="['lm__zone', 'lm__zone--row-box', isActive('card-form-body-row') && 'is-active', rowNested && 'is-nested']"
                    @mouseenter.stop="setHover('card-form-body-row')"
                    @mouseleave.stop="clearHover"
                  >
                    <span class="lm__zone-tag lm__zone-tag--tiny" @click.stop="copyClass(rowClass())">
                      -row{{ rowNested ? ' --nested' : '' }} <b v-if="isCopied(rowClass())">✓</b>
                    </span>
                    <div class="lm__row lm__row--gap-sm">
                      <div class="lm__mock-field lm__mock-field--sm" /><div class="lm__mock-field lm__mock-field--sm" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- vt-card-stack -->
              <div
                :class="['lm__zone', 'lm__zone--stack-box', isActive('card-stack') && 'is-active']"
                @mouseenter.stop="setHover('card-stack')"
                @mouseleave.stop="clearHover"
              >
                <span class="lm__zone-tag lm__zone-tag--tiny" @click.stop="copyClass('.vt-card-stack')">
                  .vt-card-stack <b v-if="isCopied('.vt-card-stack')">✓</b>
                </span>
                <div class="lm__mock-mini-card" /><div class="lm__mock-mini-card" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lm__toggles">
        <button :class="['lm__chip', formColumn && 'is-on']" @click="formColumn = !formColumn">--column</button>
        <button :class="['lm__chip', bodyPadded && 'is-on']" @click="bodyPadded = !bodyPadded">body --padded</button>
        <button :class="['lm__chip', rowNested && 'is-on']" @click="rowNested = !rowNested">row --nested</button>
        <button class="lm__chip lm__chip--code" @click="showMarkupB = !showMarkupB">
          {{ showMarkupB ? 'сховати розмітку' : '</> показати розмітку' }}
        </button>
      </div>

      <pre v-if="showMarkupB" class="lm__markup">&lt;div class="vt-page__card"&gt;
  &lt;div class="vt-page__card-form{{ formColumn ? ' vt-page__card-form--column' : '' }}"&gt;
    &lt;div&gt;
      &lt;div class="vt-page__card-form-header"&gt;Основна інформація&lt;/div&gt;
      &lt;div class="vt-page__card-form-body{{ bodyPadded ? ' vt-page__card-form-body--padded' : '' }}"&gt;
        &lt;div class="vt-page__card-form-body-item"&gt;...&lt;/div&gt;
        &lt;div class="vt-page__card-form-body-row{{ rowNested ? ' vt-page__card-form-body-row--nested' : '' }}"&gt;...&lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="vt-card-stack"&gt;
      &lt;VCard /&gt;&lt;VCard /&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</pre>

      <div class="lm__note">
        <span>📝</span>
        <div>В плані ще <code class="lm__inline-code">.vt-card-row</code> — утиліта для горизонтального ряду з кількох карток (поки не в коді, обговорюється).</div>
      </div>
    </section>

    <!-- ── FIELDSET ───────────────────────────────────────────────────────── -->
    <section class="lm__section">
      <h2 class="lm__section-title">Fieldset-паттерн</h2>
      <p class="lm__section-desc">
        Тут заголовок навмисно <code class="lm__inline-code">position: absolute</code> — це не анотація документації, а сама
        суть класу: він лежить прямо на межі border.
      </p>
      <div class="lm__stage lm__stage--sm">
        <div
          :class="['lm__fieldset', isActive('fieldset') && 'is-active', fieldsetInvalid && 'is-invalid']"
          @mouseenter="setHover('fieldset')"
          @mouseleave="clearHover"
        >
          <span
            :class="['lm__fieldset-title', isActive('fieldset-title') && 'is-active']"
            @mouseenter.stop="setHover('fieldset-title')"
            @mouseleave.stop="clearHover"
            @click.stop="copyClass('.vt-fieldset__title')"
          >
            .vt-fieldset__title <b v-if="isCopied('.vt-fieldset__title')">✓</b>
          </span>
          <div class="lm__mock-row" /><div class="lm__mock-row" />
        </div>
      </div>
      <div class="lm__toggles">
        <button :class="['lm__chip', fieldsetInvalid && 'is-on']" @click="fieldsetInvalid = !fieldsetInvalid">--invalid</button>
      </div>
    </section>

    <!-- ── LEGEND ─────────────────────────────────────────────────────────── -->
    <section class="lm__section">
      <h2 class="lm__section-title">Повна легенда класів</h2>
      <div v-for="sec in legendSections" :key="sec.title" class="lm__legend-group">
        <h3 class="lm__legend-group-title">{{ sec.title }}</h3>
        <div class="lm__legend-list">
          <div
            v-for="(item, i) in sec.items"
            :key="item.selector + i"
            :class="['lm__legend-row', isActive(item.key) && 'is-active']"
            @mouseenter="setHover(item.key)"
            @mouseleave="clearHover"
            @click="copyClass(item.selector)"
          >
            <code class="lm__legend-selector">{{ item.selector }}</code>
            <span class="lm__legend-desc">{{ item.desc }}</span>
            <span class="lm__legend-copy">{{ isCopied(item.selector) ? '✓' : 'copy' }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .lm {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  /* Intro */
  .lm__intro-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    background: var(--color-primary-light, #e6eef1);
    color: var(--color-primary-main, #00475a);
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .lm__title { font-size: 2rem; font-weight: 700; color: #111; margin: 0 0 10px; }
  .lm__subtitle { font-size: 15px; color: #555; line-height: 1.7; margin: 0 0 16px; max-width: 640px; }
  .lm__inline-code {
    background: #f3f4f6;
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 12.5px;
    font-family: 'JetBrains Mono', monospace;
    color: var(--color-primary-main, #00475a);
  }
  .lm__key-insight {
    display: flex;
    gap: 12px;
    padding: 14px 18px;
    background: var(--color-primary-bg, #f2f6f6);
    border: 1px solid var(--color-primary-border, #ccdade);
    border-radius: 10px;
    font-size: 13.5px;
    color: #333;
    line-height: 1.6;
    margin-bottom: 8px;
  }
  .lm__key-insight > span { font-size: 18px; flex-shrink: 0; }

  /* Sections */
  .lm__section { margin: 40px 0; }
  .lm__section-title { font-size: 1.1rem; font-weight: 600; color: #222; margin: 0 0 4px; }
  .lm__section-desc { font-size: 13px; color: #777; margin: 0 0 16px; }

  /* Stage (mockup canvas) */
  .lm__stage {
    border: 1px dashed #d8dce0;
    border-radius: 12px;
    padding: 14px;
    background: repeating-linear-gradient(45deg, #fafbfc, #fafbfc 10px, #f4f5f6 10px, #f4f5f6 20px);
  }
  .lm__stage--sm { padding: 24px; }

  /* ── Base "zone" system: label always sits in normal flow ABOVE the
     content, never absolutely positioned — this is what removes overlap
     when zones are nested many levels deep. ─────────────────────────── */
  .lm__zone {
    display: flex;
    flex-direction: column;
    border: 1.5px dashed transparent;
    border-radius: 8px;
    transition: border-color 0.12s, background 0.12s, box-shadow 0.12s;
  }
  .lm__zone.is-active {
    border-color: var(--color-primary-main, #00475a);
    background: rgba(0, 71, 90, 0.05);
    box-shadow: 0 0 0 2px rgba(0, 71, 90, 0.12);
  }

  .lm__zone-tag {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    background: #fff;
    color: var(--color-primary-main, #00475a);
    padding: 1px 6px;
    border-radius: 4px;
    border: 1px solid var(--color-primary-border, #ccdade);
    cursor: pointer;
    white-space: nowrap;
    margin-bottom: 6px;
  }
  /* Структурні обгортки без власного видимого боксу (layout__body, __main, vt-page) */
  .lm__zone-tag--plain {
    background: transparent;
    border-color: transparent;
    color: #9aa5a8;
    padding: 0;
    margin-bottom: 4px;
    cursor: default;
  }
  .lm__zone-tag--tiny { font-size: 9px; padding: 0 5px; }
  .lm__zone-tag b { color: var(--color-success-main, #21725e); margin-left: 1px; }

  /* Reusable row/col content wrappers.
     align-items: flex-end — навмисно, не center: зони тепер мають
     "тег + контент" всередині, тож різна висота дочірніх зон (напр.
     фільтр із тегом vs проста кнопка) center-алайнилась би по середині
     ВСІЄЇ висоти зони, а не по контенту — кнопка виглядала б "відірваною"
     від полів. flex-end рівняє по нижньому краю, як у звичайній формі. */
  .lm__row { display: flex; align-items: flex-end; gap: 8px; }
  .lm__row--between { justify-content: space-between; }
  .lm__row--end { justify-content: flex-end; }
  .lm__row--gap-sm { gap: 6px; }
  .lm__row--form { gap: 10px; align-items: stretch; }
  .lm__row--form.is-column { flex-direction: column; }
  .lm__col { display: flex; flex-direction: column; }
  .lm__col--grow-2 { flex: 2; gap: 6px; }

  /* Boxed zone variants (visible card/panel backgrounds) */
  .lm__zone--header-box {
    padding: 10px 14px;
    border-radius: 8px;
    background: var(--color-primary-hover, #00546a);
    margin-bottom: 8px;
  }
  .lm__zone--header-box .lm__zone-tag { background: rgba(255, 255, 255, 0.9); }

  .lm__zone--plain-pad { padding: 8px; }
  .lm__zone--plain { padding: 2px; }

  .lm__zone--card-box {
    background: #fff;
    border-radius: 10px;
    padding: 10px 12px 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    margin-bottom: 8px;
    gap: 8px;
  }
  .lm__zone--card-box.is-shrink { outline: 2px solid var(--color-yellow-main, #ffbd3e); outline-offset: 2px; }
  .lm__zone--card-box.is-grow { outline: 2px solid var(--color-success-main, #21725e); outline-offset: 2px; }

  .lm__zone--header-row-box { padding-bottom: 8px; border-bottom: 1px dashed #eee; margin-bottom: 4px; }
  .lm__zone--filter-box { padding: 4px 6px; border-radius: 6px; }
  .lm__zone--footer-box { padding-top: 8px; border-top: 1px dashed #eee; }

  .lm__mock-logo { width: 20px; height: 20px; border-radius: 5px; background: rgba(255, 255, 255, 0.85); }
  .lm__mock-icon { width: 16px; height: 16px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); }
  .lm__mock-breadcrumb { font-size: 10px; color: #9aa5a8; margin: -2px 0 6px; }
  .lm__mock-field { width: 70px; height: 20px; background: #eef1f2; border: 1px solid #dfe4e5; border-radius: 5px; }
  .lm__mock-field--sm { width: 44px; }
  .lm__mock-label { width: 60px; height: 10px; background: #e2e5e6; border-radius: 3px; flex-shrink: 0; }
  .lm__mock-btn {
    font-size: 11px; padding: 5px 10px; border-radius: 6px; background: var(--color-primary-main, #00475a);
    color: #fff; white-space: nowrap; flex-shrink: 0;
  }
  .lm__mock-btn--ghost { background: #fff; color: var(--color-primary-main, #00475a); border: 1px solid var(--color-primary-border, #ccdade); }
  .lm__mock-text { font-size: 11px; color: var(--color-primary-main, #00475a); }

  .lm__mock-body { display: flex; flex-direction: column; gap: 5px; }
  .lm__mock-row { height: 14px; background: #eef1f2; border-radius: 4px; }
  .lm__mock-row--faded { opacity: 0.5; width: 70%; }

  /* Pattern B specific boxes */
  .lm__zone--form-box { gap: 8px; }
  .lm__zone--form-header-box {
    padding: 6px 8px;
    border-bottom: 1px solid var(--color-gray-5, #e0e0e0);
    margin-bottom: 6px;
  }
  .lm__zone--form-body-box { gap: 8px; }
  .lm__zone--form-body-box.is-padded { padding-left: 10px; padding-right: 10px; background: rgba(0, 71, 90, 0.03); border-radius: 6px; }
  .lm__zone--item-box { padding: 3px 6px; border-radius: 6px; }
  .lm__zone--row-box { padding: 3px 6px; border-radius: 6px; }
  .lm__zone--row-box.is-nested { margin-left: 18px; }
  .lm__zone--stack-box {
    flex: 1;
    padding: 8px 6px;
    background: #fafbfc;
    border-radius: 8px;
    gap: 6px;
  }
  .lm__mock-mini-card { height: 30px; background: #fff; border: 1px solid #eee; border-radius: 6px; }

  /* Fieldset — the one place a real absolute-positioned title is correct */
  .lm__fieldset {
    position: relative;
    border: 1.5px solid var(--color-gray-5, #e0e0e0);
    border-radius: 10px;
    padding: 18px 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: border-color 0.12s;
  }
  .lm__fieldset.is-active { border-color: var(--color-primary-main, #00475a); }
  .lm__fieldset.is-invalid { border-color: var(--color-danger-main, #a82525); }
  .lm__fieldset-title {
    position: absolute;
    top: -10px;
    left: 20px;
    background: #fafbfc;
    color: var(--color-primary-main, #00475a);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    padding: 1px 6px;
    cursor: pointer;
  }
  .lm__fieldset-title.is-active { text-decoration: underline; }
  .lm__fieldset.is-invalid .lm__fieldset-title { color: var(--color-danger-main, #a82525); }

  /* Toggles */
  .lm__toggles { display: flex; align-items: center; gap: 6px; margin-top: 12px; flex-wrap: wrap; }
  .lm__toggles-label { font-size: 11px; color: #999; margin-right: 2px; }
  .lm__toggles-sep { width: 1px; height: 16px; background: #e0e0e0; margin: 0 4px; }
  .lm__chip {
    font-size: 11.5px; font-family: 'JetBrains Mono', monospace; padding: 5px 10px;
    border: 1px solid #e0e0e0; background: #fff; border-radius: 20px; cursor: pointer; color: #666;
    transition: all 0.12s;
  }
  .lm__chip:hover { border-color: var(--color-primary-border, #ccdade); }
  .lm__chip.is-on { background: var(--color-primary-main, #00475a); color: #fff; border-color: var(--color-primary-main, #00475a); }
  .lm__chip--code { margin-left: auto; color: var(--color-primary-main, #00475a); }

  .lm__markup {
    margin-top: 10px; padding: 14px 16px; background: #1a1f2e; color: #c9d1d9;
    border-radius: 8px; font-size: 12px; font-family: 'JetBrains Mono', monospace; line-height: 1.7; overflow-x: auto;
  }

  .lm__note {
    display: flex; gap: 10px; margin-top: 12px; padding: 10px 14px;
    background: var(--color-yellow-bg, #fff9ec); border: 1px solid var(--color-yellow-border, #ffecc6);
    border-radius: 8px; font-size: 12.5px; color: #555;
  }

  /* Legend */
  .lm__legend-group { margin-bottom: 20px; }
  .lm__legend-group-title { font-size: 12.5px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 8px; }
  .lm__legend-list { display: flex; flex-direction: column; gap: 2px; }
  .lm__legend-row {
    display: flex; align-items: center; gap: 12px; padding: 7px 12px;
    background: #fff; border: 1px solid #f0f0f0; border-radius: 6px; cursor: pointer; font-size: 13px;
    transition: background 0.1s, border-color 0.1s;
  }
  .lm__legend-row:hover { background: #f9fafb; }
  .lm__legend-row.is-active { border-color: var(--color-primary-main, #00475a); background: var(--color-primary-bg, #f2f6f6); }
  .lm__legend-selector {
    font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--color-primary-main, #00475a);
    flex-shrink: 0; width: 250px;
  }
  .lm__legend-desc { color: #777; font-size: 12px; flex: 1; }
  .lm__legend-copy { font-size: 11px; color: #bbb; min-width: 40px; text-align: right; }
</style>