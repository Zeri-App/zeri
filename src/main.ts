import './assets/App.css';
import 'overlayscrollbars/overlayscrollbars.css';

import { createApp, type App as VueApp } from 'vue';
import { createPinia, type Pinia } from 'pinia';
import App from './App.vue';
import { initDevtools } from './utils/devtools';

const main = async (): Promise<void> => {
  const pinia: Pinia = createPinia();
  const app: VueApp<Element> = createApp(App);

  if (import.meta.env.DEV) {
    initDevtools();
  }

  app.use(pinia);
  app.mount('#app');
};

main();
