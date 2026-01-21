import { createApp } from 'vue';
import App from './App.vue';
import VUIPlugin, { LANGUAGES } from '../src/entry';

const app = createApp(App);
app.use(VUIPlugin, {
  locale: LANGUAGES.en,
});
app.mount('#app');
