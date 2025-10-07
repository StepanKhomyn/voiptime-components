<script lang="ts" setup>
  import { ref } from 'vue';
  import { UploadFile } from '@/components/upload/types';
  import VUpload from '@/components/upload/VUpload.vue';

  const files = ref<UploadFile[]>([]);
</script>

<template>
  <div class="container">
    <VUpload v-model="files" :max-files="5" :max-size="800 * 1024" accept=".jpg,.png" type="drag" />

    <VUpload v-model="files" :max-size="1024 * 1024" accept=".pdf,.doc" type="button" />
  </div>
</template>
