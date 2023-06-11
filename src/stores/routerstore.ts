import { Pages } from '@/constants';
import { defineStore } from 'pinia';
import type { Page, Option } from '@/types';
import { readonly, ref } from 'vue';

export const useRouterStore = defineStore('router', () => {
  const current = ref(Pages.Home);
  const previous = ref<Option<Page>>(null);
  const history = ref(<Page[]>[Pages.Home]);
  const index = ref(0);

  const go = (to: Page) => {
    if (to === current.value) return;

    previous.value = current.value;
    index.value++;
    history.value[index.value] = to;
    current.value = to;
    history.value = history.value.slice(0, index.value + 1);
  };

  const forward = () => {
    if (index.value < history.value.length - 1) {
      index.value++;
      current.value = history.value[index.value];
      previous.value = history.value[index.value - 1];
    }
  };

  const back = () => {
    if (index.value > 0) {
      index.value--;
      current.value = history.value[index.value];
      previous.value = history.value[index.value - 1];
    }
  };

  return {
    current: readonly(current),
    previous,
    history: readonly(history),
    index: readonly(index),
    go,
    forward,
    back
  };
});
