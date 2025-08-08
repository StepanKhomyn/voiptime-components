import { createApp } from 'vue';
import App from './App.vue';
import { tooltipDirective } from '../src/entry';

const app = createApp(App);
app.directive('tooltip', tooltipDirective);
app.mount('#app');
