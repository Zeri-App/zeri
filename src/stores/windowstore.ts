import { defineStore } from 'pinia';
import { readonly, ref } from 'vue';

export const useWindowStore = defineStore('window', () => {
  const maximized = ref<boolean>(false);
  const focused = ref<boolean>(false);

  const isMaximized = () => {
    return maximized;
  };

  const isFocused = () => {
    return focused;
  };

  const setMaximized = (value: boolean) => {
    maximized.value = value;
  };

  const setFocused = (value: boolean) => {
    focused.value = value;
  };

  return {
    isMaximized,
    setMaximized,
    isFocused,
    setFocused
  };
});
