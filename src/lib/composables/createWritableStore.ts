import { writable, get } from 'svelte/store';

export const createWritableStore = <T>(key: string, initialValue: T) => {
  const store = writable<T>(initialValue);
  const { subscribe, set } = store;
  store.subscribe = (run: (value: T) => void, invalidate?: (value?: T) => void) => {
    const unsubscribe = subscribe(run, invalidate);
    const currentValue = get(store);
    localStorage.setItem(key, JSON.stringify(currentValue));
    return unsubscribe;
  };
  store.set = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
    set(value);
  };
  return store;
};
