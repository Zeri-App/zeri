import './assets/App.css';

import { createApp, type App as VueApp } from 'vue';
import { createPinia, type Pinia } from 'pinia';
import App from './App.vue';

const pinia: Pinia = createPinia();
const app: VueApp<Element> = createApp(App);

app.use(pinia);
app.mount('#app');
