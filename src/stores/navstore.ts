import { Pages } from '@/constants';
import { defineStore } from 'pinia';
import type { Option, Page } from '@/types';

export const useNavStore = defineStore('navigation', {
  state: () => ({
    current: Pages.Home,
    previous: null as Option<Page>,
    history: [Pages.Home] as Page[],
    historyIndex: 0
  }),
  actions: {
    go(to: Page): void {
      if (to === this.current) return;

      this.previous = this.current;
      this.historyIndex++;
      this.history[this.historyIndex] = to;
      this.current = to;
      this.history = this.history.slice(0, this.historyIndex + 1);
    },
    forward(): void {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.current = this.history[this.historyIndex];
        this.previous = this.history[this.historyIndex - 1];
      }
    },
    back(): void {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.current = this.history[this.historyIndex];
        this.previous = this.history[this.historyIndex - 1];
      }
    }
  },
  getters: {
    getCurrentPage(): Page {
      return this.current;
    },
    getPreviousPage(): Option<Page> {
      return this.previous;
    }
  }
});
