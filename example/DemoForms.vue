<template>
  <div class="demo-container">
    <div class="block demo-container-item">
      <VSelect v-model="selectModel" clearable>
        <VOption label="test" value="test"></VOption>
      </VSelect>

      <VInput v-model="inputModel" />

      <VDatePicker
        v-model="dateRange"
        end-placeholder="End date"
        range-separator=" to "
        start-placeholder="Start date"
        type="date"
      />

      <VButton type="primary">Heello!</VButton>
    </div>

    <div class="block demo-container-item-row">
      <div class="demo-container-item-row-item">
        <VSelect v-model="selectModel" clearable>
          <VOption label="test" value="test"></VOption>
        </VSelect>
      </div>

      <div class="demo-container-item-row-item">
        <VInput v-model="inputModel" clearable />
      </div>

      <div class="demo-container-item-row-item">
        <VDatePicker v-model="dateRange" type="daterange" />
      </div>
      <div class="demo-container-item-row-item">
        <VButton type="primary">Heello!</VButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import VSelect from '@/components/select/VSelect.vue';
  import VOption from '@/components/select/VOption.vue';
  import VInput from '@/components/input/VInput.vue';
  import VButton from '@/components/button/VButton.vue';
  import VDatePicker from '@/components/datepicker/VDatePicker.vue';

  const selectModel = ref('');
  const inputModel = ref('');
  const dateRange = ref<Date[] | null>(null);
</script>
<style lang="scss" scoped>
  .block {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &-item {
      display: flex;
      flex-direction: column;
      gap: 10px;

      &-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        width: 100%;

        &-item {
          width: 24%;
        }
      }
    }
  }
</style>
