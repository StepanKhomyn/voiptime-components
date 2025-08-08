<script setup lang="ts">
  import { VButton } from '../src/entry';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1rem">
    <h1>🔘 Компонент <code>&lt;VButton&gt;</code></h1>
    <div style="display: flex; gap: 10px">
      <VButton icon="arrowDown"> Натисни мене</VButton>
      <VButton icon="arrowDown" type="primary" loading> Натисни мене</VButton>
      <VButton icon="arrowDown" type="success"> Натисни мене</VButton>
      <VButton icon="arrowDown" type="warning"> Натисни мене</VButton>
      <VButton icon="arrowDown" type="danger" disabled> Натисни мене</VButton>
      <VButton icon="arrowDown" type="info"> Натисни мене</VButton>
    </div>
    <div style="display: flex; gap: 10px">
      <VButton icon="arrowDown" shape="circle" tooltip> Натисни мене</VButton>
      <VButton icon="arrowDown" shape="circle" type="primary" tooltip> Натисни мене</VButton>
      <VButton icon="arrowDown" shape="circle" type="success" tooltip> Натисни мене</VButton>
      <VButton icon="arrowDown" shape="circle" type="warning" tooltip> Натисни мене</VButton>
      <VButton icon="arrowDown" shape="circle" type="danger" tooltip> Натисни мене</VButton>
      <VButton icon="arrowDown" shape="circle" type="info" tooltip> Натисни мене</VButton>
    </div>
    <div style="display: flex; gap: 10px">
      <VButton icon="arrowDown" shape="square"> Натисни мене</VButton>
      <VButton icon="arrowDown" shape="square" type="primary"> Натисни мене</VButton>
      <VButton icon="arrowDown" shape="square" type="success"> Натисни мене</VButton>
      <VButton icon="arrowDown" shape="square" type="warning"> Натисни мене</VButton>
      <VButton icon="arrowDown" shape="square" type="danger"> Натисни мене</VButton>
      <VButton icon="arrowDown" shape="square" type="info"> Натисни мене</VButton>
    </div>
  </div>
</template>
