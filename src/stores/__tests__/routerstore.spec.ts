import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia, type Store, type _UnwrapAll } from 'pinia';
import { useRouterStore } from '@/stores/routerstore';
import { Pages } from '@/constants';
import type { Ref } from 'vue';
import type { Option } from '@/types';

describe('router', () => {
  let store: Store<
    'router',
    _UnwrapAll<
      Pick<
        {
          current: Readonly<Ref<Pages>>;
          previous: Ref<Option<Pages>>;
          history: Readonly<Ref<readonly Pages[]>>;
          index: Readonly<Ref<number>>;
          go: (to: Pages) => void;
          forward: () => void;
          back: () => void;
        },
        'index' | 'current' | 'previous' | 'history'
      >
    >,
    Pick<
      {
        current: Readonly<Ref<Pages>>;
        previous: Ref<Option<Pages>>;
        history: Readonly<Ref<readonly Pages[]>>;
        index: Readonly<Ref<number>>;
        go: (to: Pages) => void;
        forward: () => void;
        back: () => void;
      },
      never
    >,
    Pick<
      {
        current: Readonly<Ref<Pages>>;
        previous: Ref<Option<Pages>>;
        history: Readonly<Ref<readonly Pages[]>>;
        index: Readonly<Ref<number>>;
        go: (to: Pages) => void;
        forward: () => void;
        back: () => void;
      },
      'go' | 'forward' | 'back'
    >
  >;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useRouterStore();
  });

  it('should initialize with the correct state', () => {
    expect(store.current).toBe('Home');
    expect(store.previous).toBe(null);
  });

  it('should navigate to a new page', () => {
    store.go(Pages.Library);
    expect(store.current).toBe('Library');
    expect(store.previous).toBe('Home');
  });

  it('should navigate forward and backward in the history', () => {
    store.go(Pages.Library);

    expect(store.previous).toBe('Home');

    store.go(Pages.Albums);
    store.go(Pages.Artists);

    expect(store.current).toBe('Artists');
    expect(store.previous).toBe('Albums');

    store.back();

    expect(store.current).toBe('Albums');
    expect(store.previous).toBe('Library');

    store.forward();

    expect(store.current).toBe('Artists');
    expect(store.previous).toBe('Albums');

    store.back();
    store.back();
    store.back();

    expect(store.current).toBe('Home');

    store.forward();
    store.forward();
    store.forward();

    expect(store.current).toBe('Artists');
    expect(store.index).toBe(3);
  });

  it('should not navigate if the target page is the current page', () => {
    store.go(Pages.Home);
    store.go(Pages.Home); // Should not trigger navigation

    expect(store.current).toBe('Home');
    expect(store.previous).toBe(null);
    expect(store.index).toBe(0);
  });
});
