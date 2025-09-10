<template>
  <div class="example-container">
    <!-- Базовий приклад з infinite scroll -->
    {{ mapping }}
    <br />
    {{ fields }}
    <VSelect
      v-model="mapping.first"
      clearable
      placeholder="Оберіть користувача..."
      required
      @blur="event => console.log('blur', event)"
      @clear="result => console.log('clear', result)"
      @focus="event => console.log('focus', event)"
      @scrolled="() => console.log('FFFFFFF')"
      @validation="result => console.log('validation', result)"
      @remove-tag="value => console.log('remove-tag', value)"
      @visible-change="result => console.log('visible-change', result)"
    >
      <VOption v-for="item in fields" :key="item" :label="item" :value="item" />
      <VOption label="asd" value="dsa">
        <VIcon name="email" />
        sadad
      </VOption>
    </VSelect>

    <VSelect v-model="mapping.second" placeholder="Оберіть користувача...">
      <VOption v-for="item in fields" :key="item" :label="item" :value="item" />
    </VSelect>
  </div>
</template>

<script lang="ts" setup>
  import VOption from '@/components/select/VOption.vue';
  import VSelect from '@/components/select/VSelect.vue';
  import { computed, ref } from 'vue';
  import VIcon from '@/components/icon/VIcon.vue';

  const mapping = ref({
    first: '',
    second: '',
  });

  const fields = computed(() =>
    Array.from(Object.keys(TelemarketClientImportFields)).filter(f => !Object.values(mapping?.value).includes(f))
  );

  const enum TelemarketClientImportFields {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    H = 'H',
    I = 'I',
    J = 'J',
    K = 'K',
    L = 'L',
    M = 'M',
    N = 'N',
    O = 'O',
    P = 'P',
    Q = 'Q',
    R = 'R',
    S = 'S',
    T = 'T',
    U = 'U',
    V = 'V',
    W = 'W',
    X = 'X',
    Y = 'Y',
    Z = 'Z',

    AA = 'AA',
    AB = 'AB',
    AC = 'AC',
    AD = 'AD',
    AE = 'AE',
    AF = 'AF',
    AG = 'AG',
    AH = 'AH',
    AI = 'AI',
    AJ = 'AJ',
    AK = 'AK',
    AL = 'AL',
    AM = 'AM',
    AN = 'AN',
    AO = 'AO',
    AP = 'AP',
    AQ = 'AQ',
    AR = 'AR',
    AS = 'AS',
    AT = 'AT',
    AU = 'AU',
    AV = 'AV',
    AW = 'AW',
    AX = 'AX',
    AY = 'AY',
    AZ = 'AZ',

    BA = 'BA',
    BB = 'BB',
    BC = 'BC',
    BD = 'BD',
    BE = 'BE',
    BF = 'BF',
    BG = 'BG',
    BH = 'BH',
    BI = 'BI',
    BJ = 'BJ',
    BK = 'BK',
    BL = 'BL',
    BM = 'BM',
    BN = 'BN',
    BO = 'BO',
    BP = 'BP',
    BQ = 'BQ',
    BR = 'BR',
    BS = 'BS',
    BT = 'BT',
    BU = 'BU',
    BV = 'BV',
    BW = 'BW',
    BX = 'BX',
    BY = 'BY',
    BZ = 'BZ',
  }
</script>

<style scoped>
  .example-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }

  .info {
    margin-top: 16px;
    padding: 12px;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-size: 14px;
  }

  .info p {
    margin: 4px 0;
  }
</style>
