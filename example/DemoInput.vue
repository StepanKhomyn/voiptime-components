<script setup lang="ts">
  import { ref } from 'vue';
  import VInput from '@/components/input/VInput.vue';

  // Реактивні змінні для прикладів
  const textValue = ref('');
  const emailValue = ref('');
  const urlValue = ref('');
  const passwordValue = ref('');
  const textareaValue = ref('');
  const searchValue = ref('');
  const numberValue = ref(0);
</script>

<template>
  <div class="examples-container">
    <h2>VInput Examples</h2>

    <!-- Базовий інпут -->
    <div class="example-section">
      <h3>Базовий текстовий інпут</h3>
      <VInput
        v-model="textValue"
        label="Ім'я користувача"
        placeholder="Введіть ваше ім'я"
        helper-text="Це поле є обов'язковим"
        required
        clearable
      />
    </div>

    <!-- Інпут з іконкою -->
    <div class="example-section">
      <h3>Інпут з іконкою</h3>
      <VInput v-model="textValue" label="Морозець" placeholder="Введіть мороз" suffix-icon="freeze" />
    </div>

    <!-- Email -->
    <div class="example-section">
      <h3>Email</h3>
      <VInput v-model="emailValue" type="email" label="Email адреса" placeholder="example@email.com" />
    </div>

    <!-- URL -->
    <div class="example-section">
      <h3>URL</h3>
      <VInput v-model="urlValue" type="url" label="URL" placeholder="Лінка на сайт" />
    </div>

    <!-- Пароль з показом/сховом -->
    <div class="example-section">
      <h3>Пароль з можливістю показу</h3>
      <VInput
        v-model="passwordValue"
        type="password"
        label="Пароль"
        placeholder="Введіть пароль"
        show-password
        :minlength="8"
        :maxlength="32"
      />
    </div>

    <!-- Textarea з автозміною висоти -->
    <div class="example-section">
      <h3>Textarea з автоматичною зміною висоти</h3>
      <VInput
        v-model="textareaValue"
        type="textarea"
        label="Опис"
        placeholder="Введіть детальний опис..."
        :autosize="{ minRows: 3 }"
      />
    </div>

    <!-- Number інпут -->
    <div class="example-section">
      <h3>Числовий інпут</h3>
      <VInput v-model="numberValue" type="number" label="Кількість" :min="0" :max="100" :step="1" suffix-icon="hash" />
    </div>

    <!-- Різні стани -->
    <div class="example-section">
      <h3>Різні стани</h3>
      <div class="states-grid">
        <VInput v-model="textValue" label="Success стан" status="success" placeholder="Успішно" />

        <VInput
          v-model="textValue"
          label="Error стан"
          status="error"
          placeholder="Помилка"
          error-message="Це поле містить помилку"
        />

        <VInput v-model="textValue" label="Warning стан" status="warning" placeholder="Попередження" />

        <VInput v-model="textValue" label="Вимкнений" placeholder="Вимкнено" disabled />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .examples-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .example-section {
    margin-bottom: 40px;

    h3 {
      margin-bottom: 16px;
      color: #374151;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .states-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .sizes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
</style>
