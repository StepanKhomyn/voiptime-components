<script setup lang="ts">
  import { ref } from 'vue';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';

  // Реактивні змінні для прикладів
  const selectedValue = ref('');
  const multipleValues = ref<string[]>([]);
  const filterableValue = ref('');
  const remoteValue = ref('');
  const remoteLoading = ref(false);
  const remoteResults = ref<Array<{ label: string; value: string }>>([]);

  // Методи
  const handleSelectChange = (value: any) => {
    console.log('Select changed:', value);
  };

  const handleRemoteFilter = async (query: string) => {
    if (!query) {
      remoteResults.value = [];
      return;
    }

    remoteLoading.value = true;

    // Імітація запиту до сервера
    setTimeout(() => {
      remoteResults.value = [
        { label: `Результат 1 для "${query}"`, value: `result1_${query}` },
        { label: `Результат 2 для "${query}"`, value: `result2_${query}` },
        { label: `Результат 3 для "${query}"`, value: `result3_${query}` },
      ];
      remoteLoading.value = false;
    }, 1000);
  };
</script>

<template>
  <div class="select-examples">
    <div class="example-section" style="display: flex; flex-direction: row; align-items: center">
      <VSelect
        v-model="selectedValue"
        filterable
        placeholder="Оберіть період"
        @change="handleSelectChange"
        clearable
        @filter="query => console.log('Filter query:', query)"
      >
        <VOption label="Більше тижня" value="week" />
        <VOption label="Більше 1 місяця" value="month" />
        <VOption label="Більше 1 місяця" value="month2" />
        <VOption label="Більше 1 місяця" value="month3" />
        <VOption label="Більше 1 місяця" value="month4" />
        <VOption label="Більше 3 місяців" value="3months" />
        <VOption label="Більше 6 місяців" value="6months" />
      </VSelect>
    </div>

    <div class="example-section">
      <h3>Select з валідацією</h3>
      <VSelect
        v-model="selectedValue"
        label="Обов'язкове поле"
        placeholder="Оберіть опцію"
        required
        required-message="Це поле обов'язкове для заповнення"
        helper-text="Виберіть один з доступних варіантів"
      >
        <VOption label="Більше тижня" value="week" />
        <VOption label="Більше 1 місяця" value="month" />
        <VOption label="Більше 3 місяців" value="3months" />
        <VOption label="Більше 6 місяців" value="6months" />
      </VSelect>
    </div>

    <div class="example-section">
      <h3>Select з різними статусами</h3>

      <VSelect v-model="selectedValue" label="Success Select" status="success" helper-text="Успішно вибрано">
        <VOption label="Опція 1" value="option1" />
        <VOption label="Опція 2" value="option2" />
        <VOption label="Опція 3" value="option3" />
      </VSelect>

      <VSelect v-model="selectedValue" label="Error Select" status="error" error-message="Помилка валідації">
        <VOption label="Опція 1" value="option1" />
        <VOption label="Опція 2" value="option2" />
        <VOption label="Опція 3" value="option3" />
      </VSelect>

      <VSelect v-model="selectedValue" label="Warning Select" status="warning" helper-text="Попередження">
        <VOption label="Опція 1" value="option1" />
        <VOption label="Опція 2" value="option2" />
        <VOption label="Опція 3" value="option3" />
      </VSelect>

      <VSelect v-model="selectedValue" label="Disabled Select" disabled>
        <VOption label="Опція 1" value="option1" />
        <VOption label="Опція 2" value="option2" />
        <VOption label="Опція 3" value="option3" />
      </VSelect>
    </div>

    <div class="example-section">
      <h3>Select з іконками та очищенням</h3>
      <VSelect
        v-model="selectedValue"
        label="Оберіть місто"
        placeholder="Оберіть місто"
        clearable
        @change="handleSelectChange"
      >
        <VOption label="Київ" value="kyiv" icon="mapPin" />
        <VOption label="Львів" value="lviv" icon="mapPin" />
        <VOption label="Одеса" value="odesa" icon="mapPin" />
        <VOption label="Харків" value="kharkiv" icon="mapPin" />
        <VOption label="Харків" value="kharkiv2" icon="mapPin" />
        <VOption label="Харків" value="kharkiv3" icon="mapPin" />
        <VOption label="Харків" value="kharkiv4" icon="mapPin" />
        <VOption label="Харків" value="kharkiv5" icon="mapPin" />
        <VOption label="Дніпро" value="dnipro" icon="mapPin" disabled />
      </VSelect>
    </div>

    <div class="example-section">
      <h3>Множинний вибір</h3>
      <VSelect
        v-model="multipleValues"
        label="Оберіть міста"
        placeholder="Оберіть міста"
        multiple
        clearable
        collapsed-tags
        @change="handleSelectChange"
      >
        <VOption label="Київ" value="kyiv" icon="mapPin" />
        <VOption label="Львів" value="lviv" icon="mapPin" />
        <VOption label="Одеса" value="odesa" icon="mapPin" />
        <VOption label="Харків" value="kharkiv" icon="mapPin" />
        <VOption label="Дніпро" value="dnipro" icon="mapPin" />
        <VOption label="Запоріжжя" value="zaporizhzhia" icon="mapPin" />
      </VSelect>
      <p>Вибрані значення: {{ multipleValues }}</p>
    </div>

    <div class="example-section">
      <h3>Select з фільтрацією</h3>
      <VSelect
        v-model="filterableValue"
        label="Оберіть мову програмування"
        placeholder="Введіть для пошуку"
        filterable
        clearable
        @change="handleSelectChange"
        @filter="query => console.log('Filter query:', query)"
      >
        <VOption label="JavaScript" value="js" />
        <VOption label="TypeScript" value="ts" />
        <VOption label="Python" value="python" />
        <VOption label="Java" value="java" />
        <VOption label="C#" value="csharp" />
        <VOption label="PHP" value="php" />
        <VOption label="Go" value="go" />
        <VOption label="Rust" value="rust" />
        <VOption label="Swift" value="swift" />
        <VOption label="Kotlin" value="kotlin" />
      </VSelect>
    </div>
  </div>
</template>

<style scoped>
  .select-examples {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  .example-section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .example-section h3 {
    margin: 0 0 15px 0;
    color: #374151;
    font-size: 18px;
  }

  .example-section p {
    margin-top: 10px;
    padding: 10px;
    background-color: #f3f4f6;
    border-radius: 4px;
    font-family: monospace;
  }
</style>
