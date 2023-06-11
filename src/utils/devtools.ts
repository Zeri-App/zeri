/**
 * Connect to vue-devtools
 * On DEV env
 */
export const initDevtools = async (): Promise<void> =>
  (await import('@vue/devtools')).connect('http://localhost', 8098);
