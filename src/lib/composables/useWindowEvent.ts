export const useWindowEvent = <E extends keyof WindowEventMap>(
  event: E,
  callback: (event: WindowEventMap[E]) => void
): (() => void) => {
  const listener = (evt: WindowEventMap[E]) => callback(evt);

  window.addEventListener(event, listener);

  return () => {
    window.removeEventListener(event, listener);
  };
};
