import { createApp } from 'vue';
import App from './App.vue';
import { loaderDirective, tooltipDirective } from '../src/entry';

const app = createApp(App);
app.directive('tooltip', tooltipDirective);
app.directive('loader', loaderDirective);
app.mount('#app');
