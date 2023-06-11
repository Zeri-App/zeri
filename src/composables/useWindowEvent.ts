import { onMounted, onBeforeUnmount } from 'vue';

export const useWindowEvent = <E extends keyof WindowEventMap>(
  event: E,
  callback: (event: WindowEventMap[E]) => void
): void => {
  const listener = (evt: WindowEventMap[E]) => callback(evt);

  onMounted(() => {
    window.addEventListener(event, listener);
  });

  onBeforeUnmount(() => {
    window.removeEventListener(event, listener);
  });
};
