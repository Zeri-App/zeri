import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNavStore } from '@/stores/navstore';

describe('Navigation Store', () => {
  let store: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useNavStore();
  });

  it('should initialize with the correct state', () => {
    expect(store.getCurrentPage).toBe('Home');
    expect(store.getPreviousPage).toBe(null);
  });

  it('should navigate to a new page', () => {
    store.go('About');
    expect(store.getCurrentPage).toBe('About');
    expect(store.getPreviousPage).toBe('Home');
  });

  it('should navigate forward and backward in the history', () => {
    store.go('About');
    store.go('Contact');
    store.go('FAQ');

    expect(store.getCurrentPage).toBe('FAQ');
    expect(store.getPreviousPage).toBe('Contact');

    store.back();
    expect(store.getCurrentPage).toBe('Contact');
    expect(store.getPreviousPage).toBe('About');

    store.forward();
    expect(store.getCurrentPage).toBe('FAQ');
    expect(store.getPreviousPage).toBe('Contact');
  });

  it('should not navigate if the target page is the current page', () => {
    store.go('About');
    store.go('About'); // Should not trigger navigation

    expect(store.getCurrentPage).toBe('About');
    expect(store.getPreviousPage).toBe('Home');
  });
});
