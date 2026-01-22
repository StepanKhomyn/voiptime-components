import { createApp } from 'vue';
import App from './App.vue';
import VUIPlugin, { LANGUAGES } from '../src/entry';

const app = createApp(App);
app.use(VUIPlugin, {
  locale: LANGUAGES.uk,
});
app.mount('#app');
