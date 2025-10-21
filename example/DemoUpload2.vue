<template>
  <div class="upload-example">
    <h2>Upload Excel/CSV Files</h2>

    <VUpload
      v-model="files"
      :max-files="1"
      :max-rows="10000"
      :max-size="15 * 1024 * 1024"
      :parse-files="true"
      :return-data="true"
      accept=".csv,.xls,.xlsx"
      placeholder="Drop Excel or CSV file here or click to upload"
      type="drag"
      @error="handleError"
      @parse="handleParse"
      @rows-exceed="handleRowsExceed"
    />

    <!-- Результати парсингу -->
    <div v-if="parseResults.length > 0" class="results">
      <h3>Parse Results:</h3>

      <div v-for="(result, index) in parseResults" :key="index" class="result-item">
        <h4>{{ result.fileName }}</h4>

        <div v-for="(sheet, sIndex) in result.sheets" :key="sIndex" class="sheet-item">
          <h5>Sheet: {{ sheet.name }}</h5>
          <p><strong>Rows:</strong> {{ sheet.rows }}</p>
          <p><strong>Columns:</strong> {{ sheet.columns.join(', ') }}</p>

          <div v-if="sheet.data">
            <h6>Data Preview (first 5 rows):</h6>
            <pre>{{ JSON.stringify(sheet.data.slice(0, 5), null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Попередження про перевищення ліміту -->
    <div v-if="warnings.length > 0" class="warnings">
      <h3>Warnings:</h3>
      <div v-for="(warning, index) in warnings" :key="index" class="warning-item">
        {{ warning }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ParseResult, UploadError, UploadFile } from '@/components/upload/types';
  import VUpload from '@/components/upload/VUpload.vue';

  const files = ref<UploadFile[]>([]);
  const parseResults = ref<Array<{ fileName: string; data: ParseResult }>>([]);
  const warnings = ref<string[]>([]);

  const handleParse = ({ file, result }: { file: UploadFile; result: ParseResult }) => {
    console.log('📘 File parsed:', file.name);

    for (const sheet of result.sheets) {
      console.log(`Sheet: ${sheet.name}`);
      console.log(`Rows: ${sheet.rows}`);
      console.log(`Columns:`, sheet.columns);
      if (sheet.data) console.table(sheet.data);
    }

    parseResults.value.push({
      fileName: file.name,
      sheets: result.sheets,
    });
  };

  const handleRowsExceed = ({ file, rows, maxRows }: { file: UploadFile; rows: number; maxRows: number }) => {
    const warning = `File "${file.name}" has ${rows} rows, but the limit is ${maxRows}`;
    console.warn(warning);
    warnings.value.push(warning);
  };

  const handleError = (error: UploadError) => {
    console.error('Upload error:', error);
  };
</script>

<style scoped>
  .upload-example {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  h2 {
    margin-bottom: 20px;
  }

  .results {
    margin-top: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }

  .result-item {
    margin-bottom: 20px;
    padding: 15px;
    background-color: white;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
  }

  .result-item h4 {
    margin-top: 0;
    color: #333;
  }

  .result-info {
    margin: 10px 0;
  }

  .result-info p {
    margin: 5px 0;
  }

  .data-preview {
    margin-top: 15px;
  }

  .data-preview h5 {
    margin-bottom: 10px;
  }

  .data-preview pre {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
  }

  .warnings {
    margin-top: 20px;
    padding: 15px;
    background-color: #fff3cd;
    border-radius: 8px;
    border: 1px solid #ffc107;
  }

  .warning-item {
    padding: 8px;
    margin: 5px 0;
    background-color: white;
    border-radius: 4px;
  }
</style>
