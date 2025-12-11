<script setup lang="ts">
  import { ref } from 'vue';
  import VSidebar from '../src/components/sidebar/VSidebar.vue';

  const collapsed = ref(true);

  const menuItems = [
    {
      name: 'service',
      i18n: 'Service',
      icon: 'chatDelete',
      route: '/service',
      children: [
        { name: 'reports', i18n: 'Reports', route: '/reporting/reports' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingx/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingz/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingl/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingk/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingj/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingh/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingg/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingf/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingd/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportinga/dashboards' },
        { name: 'dashboards', i18n: 'TEst', route: '/reportings/dashboards' },
      ],
    },
    {
      name: 'automation',
      i18n: 'Automation',
      icon: 'chatIn',
      route: '/automation',
      children: [
        { name: 'reports', i18n: 'Reports', route: '/reportingat/reports' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingar/dashboards' },
      ],
    },
    {
      name: 'reporting',
      i18n: 'Reporting & Analytics',
      icon: 'clientDigitalChannel',
      children: [
        { name: 'reports', i18n: 'Reports', route: '/reportingaq/reports' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingaw/dashboards' },
      ],
    },
    {
      name: 'settings',
      i18n: 'Settings',
      icon: 'clientActivity',
      route: '/settings',
      children: [
        { name: 'reports', i18n: 'Reports', route: '/reportingaqt/reports' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reportingaqu/dashboards' },
      ],
    },
  ];
</script>

<template>
  <div class="demo-container">
    <VSidebar :items="menuItems" v-model:collapsed="collapsed" />
    <div class="demo-main">
      <h2>Main Content Area Test</h2>
      <p>Here is the main view. Use the sidebar to navigate.</p>
      <button @click="collapsed = !collapsed">
        {{ collapsed ? 'Expand Sidebar' : 'Collapse Sidebar' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
  .demo-container {
    display: flex;
    height: 100vh;
  }

  .demo-main {
    flex: 1;
    padding: 24px;
  }
</style>
