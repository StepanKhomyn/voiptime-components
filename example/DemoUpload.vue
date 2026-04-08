<script lang="ts" setup>
  import { ref } from 'vue';
  import VUpload from '@/components/upload/VUpload.vue';
  import DocSection from './helper/DocSection.vue';
  import DocPreview from './helper/DocPreview.vue';
  import DocPropsTable, { TableSection } from './helper/DocPropsTable.vue';
  import DocFeature from './helper/DocFeature.vue';
  import type { ParseResult, UploadError, UploadFile } from '@/components/upload/types';

  const filesButton = ref<UploadFile[]>([]);
  const filesDrag = ref<UploadFile[]>([]);
  const filesImages = ref<UploadFile[]>([]);
  const filesExcel = ref<UploadFile[]>([]);
  const parseResults = ref<Array<{ fileName: string; sheets: ParseResult['sheets'] }>>([]);
  const warnings = ref<string[]>([]);

  const handleParse = ({ file, result }: { file: UploadFile; result: ParseResult }) => {
    parseResults.value.push({ fileName: file.name, sheets: result.sheets });
  };

  const handleRowsExceed = ({ file, rows, maxRows }: { file: UploadFile; rows: number; maxRows: number }) => {
    warnings.value.push(`Файл "${file.name}" містить ${rows} рядків, ліміт — ${maxRows}`);
  };

  const handleError = (error: UploadError) => {
    console.error('Upload error:', error);
  };

  const propsSections: TableSection[] = [
    {
      title: 'Props',
      rows: [
        { name: 'modelValue', type: 'UploadFile[]', default: '[]', description: 'Масив завантажених файлів (v-model)' },
        { name: 'type', type: "'button' | 'drag'", default: "'button'", description: 'Тип зони завантаження' },
        {
          name: 'accept',
          type: 'string',
          default: 'undefined',
          description: 'Дозволені типи файлів (як HTML accept): .jpg,.png або image/*',
        },
        { name: 'maxSize', type: 'number', default: 'undefined', description: 'Максимальний розмір файлу в байтах' },
        { name: 'maxFiles', type: 'number', default: 'undefined', description: 'Максимальна кількість файлів' },
        {
          name: 'maxRows',
          type: 'number',
          default: 'undefined',
          description: 'Максимальна кількість рядків (для CSV/Excel)',
        },
        { name: 'multiple', type: 'boolean', default: 'true', description: 'Дозволити вибір кількох файлів' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Заблокований стан' },
        { name: 'parseFiles', type: 'boolean', default: 'false', description: 'Парсити CSV/XLS/XLSX через Web Worker' },
        {
          name: 'returnData',
          type: 'boolean',
          default: 'false',
          description: 'Повертати дані рядків при парсингу (разом з parseFiles)',
        },
        { name: 'placeholder', type: 'string', default: 'auto', description: 'Текст у drag-зоні (за замовч. з i18n)' },
        {
          name: 'tip',
          type: 'string',
          default: 'auto',
          description: 'Підказка під зоною (за замовч. генерується з accept/maxSize/maxRows)',
        },
      ],
    },
    {
      title: 'Events',
      rows: [
        { name: 'update:modelValue', type: 'UploadFile[]', description: 'Зміна списку файлів (v-model)' },
        { name: 'change', type: 'UploadFile[]', description: 'Будь-яка зміна списку файлів' },
        { name: 'remove', type: 'UploadFile', description: 'Файл видалено користувачем' },
        { name: 'exceed', type: 'File[]', description: 'Перевищено maxFiles — передає надлишкові файли' },
        { name: 'error', type: 'UploadError', description: 'Помилка валідації (розмір, тип, парсинг)' },
        { name: 'parse', type: '{ file: UploadFile, result: ParseResult }', description: 'Успішний парсинг CSV/Excel' },
        {
          name: 'rowsExceed',
          type: '{ file: UploadFile, rows: number, maxRows: number }',
          description: 'Кількість рядків перевищила maxRows',
        },
      ],
    },
  ];

  const typesSections: TableSection[] = [
    {
      title: 'UploadFile',
      rows: [
        { name: 'id', type: 'string', description: 'Унікальний ID файлу' },
        { name: 'file', type: 'File', description: "Нативний File об'єкт" },
        { name: 'name', type: 'string', description: "Ім'я файлу" },
        { name: 'size', type: 'number', description: 'Розмір в байтах' },
        { name: 'type', type: 'string', description: 'MIME тип' },
        { name: 'status', type: "'pending' | 'uploading' | 'success' | 'error'", description: 'Статус обробки' },
      ],
    },
    {
      title: 'ParseResult',
      rows: [
        {
          name: 'sheets',
          type: 'SheetParseResult[]',
          description: 'Масив аркушів (для Excel — кілька, для CSV — один)',
        },
        { name: 'rows', type: 'number', description: 'Загальна кількість рядків' },
        { name: 'columns', type: 'string[]', description: 'Назви колонок' },
        { name: 'data', type: 'any[]', description: 'Дані рядків (якщо returnData: true)' },
      ],
    },
    {
      title: 'UploadError',
      rows: [
        { name: 'type', type: "'size' | 'type' | 'count' | 'parse'", description: 'Тип помилки' },
        { name: 'message', type: 'string', description: 'Текст помилки' },
        { name: 'file', type: 'File', description: 'Файл що спричинив помилку' },
      ],
    },
  ];
</script>

<template>
  <div class="upload-showcase">
    <!-- ─── Button тип ─── -->
    <DocSection title="Тип button">
      <DocPreview>
        <VUpload
          v-model="filesButton"
          type="button"
          :max-size="5 * 1024 * 1024"
          accept=".pdf,.doc,.docx"
          @error="handleError"
        />
      </DocPreview>
    </DocSection>

    <!-- ─── Drag & Drop ─── -->
    <DocSection title="Тип drag — перетягування файлів">
      <DocPreview>
        <div style="width: 100%">
          <VUpload
            v-model="filesDrag"
            type="drag"
            :max-files="5"
            :max-size="10 * 1024 * 1024"
            accept=".pdf,.doc,.docx"
            @error="handleError"
          />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Зображення ─── -->
    <DocSection
      title="Обмеження типу і розміру"
      description="accept і maxSize автоматично генерують підказку під зоною"
    >
      <DocPreview>
        <div style="width: 100%">
          <VUpload
            v-model="filesImages"
            type="drag"
            accept=".jpg,.jpeg,.png,.webp"
            :max-size="2 * 1024 * 1024"
            :max-files="3"
            @error="handleError"
          />
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Один файл ─── -->
    <DocSection title="Один файл (maxFiles=1)" description="Зона завантаження зникає після вибору файлу">
      <DocPreview>
        <VUpload v-model="filesButton" type="button" :max-files="1" accept=".pdf" @error="handleError" />
      </DocPreview>
    </DocSection>

    <!-- ─── Парсинг CSV/Excel ─── -->
    <DocSection
      title="Парсинг CSV / Excel (parseFiles)"
      description="Файл обробляється у Web Worker — інтерфейс не блокується. Прогрес бар відображається автоматично"
    >
      <DocPreview
        :script="`
const filesExcel   = ref([])
const parseResults = ref([])
const warnings     = ref([])

const handleParse = ({ file, result }) => {
  parseResults.value.push({ fileName: file.name, sheets: result.sheets })
}

const handleRowsExceed = ({ file, rows, maxRows }) => {
  warnings.value.push(\`Файл \'\${file.name}\' містить \${rows} рядків, ліміт — \${maxRows}\`)
      }
      `"
      >
        <div style="width: 100%">
          <VUpload
            v-model="filesExcel"
            type="drag"
            accept=".csv,.xls,.xlsx"
            :max-files="1"
            :max-size="15 * 1024 * 1024"
            :max-rows="10000"
            :parse-files="true"
            :return-data="true"
            placeholder="Перетягніть Excel або CSV файл сюди"
            @parse="handleParse"
            @rows-exceed="handleRowsExceed"
            @error="handleError"
          />

          <div v-if="warnings.length" class="warning-list">
            <div v-for="(w, i) in warnings" :key="i" class="warning-item">⚠️ {{ w }}</div>
          </div>

          <div v-if="parseResults.length" class="parse-results">
            <div v-for="(res, i) in parseResults" :key="i" class="parse-result">
              <strong>{{ res.fileName }}</strong>
              <div v-for="(sheet, j) in res.sheets" :key="j" class="sheet-info">
                Аркуш: {{ sheet.name }} · {{ sheet.rows }} рядків · {{ sheet.columns.length }} колонок
              </div>
            </div>
          </div>
        </div>
      </DocPreview>
    </DocSection>

    <!-- ─── Disabled ─── -->
    <DocSection title="Заблокований стан">
      <DocPreview>
        <VUpload v-model="filesButton" type="button" disabled />
        <VUpload v-model="filesDrag" type="drag" disabled style="width: 100%; margin-top: 0.5rem" />
      </DocPreview>
    </DocSection>

    <!-- ─── API ─── -->
    <DocSection title="API">
      <DocPropsTable :sections="propsSections" />
    </DocSection>

    <!-- ─── Типи ─── -->
    <DocSection title="TypeScript типи">
      <DocPropsTable :sections="typesSections" />
    </DocSection>

    <!-- ─── Особливості ─── -->
    <DocSection title="Особливості">
      <DocFeature title="Автогенерація підказки" icon="💡">
        Якщо <code>tip</code> не передано — компонент сам генерує підказку з <code>accept</code>, <code>maxSize</code> і
        <code>maxRows</code>. Передай <code>tip</code> явно щоб замінити на кастомний текст.
      </DocFeature>
      <DocFeature title="Web Worker для парсингу" icon="⚙️">
        <code>:parse-files="true"</code> запускає парсинг CSV/XLS/XLSX у окремому Web Worker — UI не блокується навіть
        для великих файлів. Прогрес бар з відсотками відображається автоматично.
      </DocFeature>
      <DocFeature title="maxFiles=1 приховує зону" icon="🎯">
        Коли <code>maxFiles="1"</code> і файл вже вибрано — зона завантаження зникає. Щоб замінити файл, потрібно
        видалити поточний.
      </DocFeature>
      <DocFeature title="returnData + rowsExceed" icon="📊">
        <code>:return-data="true"</code> повертає масив рядків у <code>@parse</code>.
        <code>@rows-exceed</code> спрацьовує якщо файл перевищує <code>maxRows</code> — але файл все одно додається до
        списку.
      </DocFeature>
    </DocSection>
  </div>
</template>

<style scoped lang="scss">
  .upload-showcase {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .warning-list {
    margin-top: 0.75rem;
  }

  .warning-item {
    padding: 0.5rem 0.75rem;
    background: #fef3c7;
    border: 1px solid #fde68a;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #92400e;
    margin-bottom: 0.4rem;
  }

  .parse-results {
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .parse-result {
    padding: 0.75rem 1rem;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #0c4a6e;
  }

  .sheet-info {
    margin-top: 0.25rem;
    color: #0369a1;
    font-size: 0.8rem;
  }
</style>
