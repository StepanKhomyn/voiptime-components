<script setup lang="ts">
  import { ref } from 'vue';
  import VSidebar from '../src/components/sidebar/VSidebar.vue';

  const collapsed = ref(true);

  const menuItems = [
    { name: 'marketing', i18n: 'Marketing', icon: 'chatCheck', route: '/marketing' },
    { name: 'content', i18n: 'Content', icon: 'calendar', route: '/content' },
    { name: 'sales', i18n: 'Sales', icon: 'channelsChange', route: '/sales' },
    { name: 'commerce', i18n: 'Commerce', icon: 'chatAttention', route: '/commerce' },
    {
      name: 'service',
      i18n: 'Service',
      icon: 'chatDelete',
      route: '/service',
      children: [
        { name: 'reports', i18n: 'Reports', route: '/reporting/reports' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
        { name: 'dashboards', i18n: 'TEst', route: '/reporting/dashboards' },
      ],
    },
    {
      name: 'automation',
      i18n: 'Automation',
      icon: 'chatIn',
      route: '/automation',
      children: [
        { name: 'reports', i18n: 'Reports', route: '/reporting/reports' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
      ],
    },
    {
      name: 'reporting',
      i18n: 'Reporting & Analytics',
      icon: 'clientDigitalChannel',
      children: [
        { name: 'reports', i18n: 'Reports', route: '/reporting/reports' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
      ],
    },
    {
      name: 'settings',
      i18n: 'Settings',
      icon: 'clientActivity',
      route: '/settings',
      children: [
        { name: 'reports', i18n: 'Reports', route: '/reporting/reports' },
        { name: 'dashboards', i18n: 'Dashboards', route: '/reporting/dashboards' },
      ],
    },
  ];
</script>

<template>
  <div class="demo-container">
    <VSidebar :items="menuItems" v-model:collapsed="collapsed" />
    <div class="demo-main">
      <h2>Main Content Area</h2>
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
