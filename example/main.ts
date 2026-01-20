import { createApp } from 'vue';
import App from './App.vue';
import VUIPlugin, { LANGUAGES, loaderDirective, tooltipDirective } from '../src/entry';

const app = createApp(App);
app.use(VUIPlugin, {
  locale: LANGUAGES.en,
});
app.directive('tooltip', tooltipDirective);
app.directive('loader', loaderDirective);
app.mount('#app');
