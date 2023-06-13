import { writable, type Writable } from 'svelte/store';

export const windowMaximized: Writable<boolean> = writable<boolean>(false);

export const windowFocused: Writable<boolean> = writable<boolean>(true);
