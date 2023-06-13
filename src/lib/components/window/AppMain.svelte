<script lang="ts">
  import { TauriEvent } from '@tauri-apps/api/event';
  import { appWindow } from '@tauri-apps/api/window';
  import { onDestroy, onMount } from 'svelte';
  import { OverlayScrollbarsComponent as ScrollView } from 'overlayscrollbars-svelte';

  import { useTauriEvent } from '@app/composables/useTauriEvent';
  import { windowFocused, windowMaximized } from '@app/stores/windowStore';
  import { useWindowEvent } from '@app/composables/useWindowEvent';
  import AppSideBar from '@app/components/window/AppSideBar.svelte';
  import AppBar from './AppBar.svelte';

  let cleanUpWindowResized: () => void;
  let cleanUpWindowBlur: () => void;
  let cleanUpWindowFocus: () => void;
  let cleanUpKeyDown: () => void;

  const onWindowResized = async () => {
    windowMaximized.set(await appWindow.isMaximized());
  };

  onMount(() => {
    cleanUpWindowResized = useTauriEvent(TauriEvent.WINDOW_RESIZED, onWindowResized);
    cleanUpWindowBlur = useTauriEvent(TauriEvent.WINDOW_BLUR, () => windowFocused.set(false));
    cleanUpWindowFocus = useTauriEvent(TauriEvent.WINDOW_FOCUS, () => windowFocused.set(true));

    cleanUpKeyDown = useWindowEvent('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Tab') event.preventDefault();
    });
  });

  onDestroy(() => {
    cleanUpWindowResized?.();
    cleanUpWindowBlur?.();
    cleanUpWindowFocus?.();

    cleanUpKeyDown?.();
  });
</script>

<main
  class="relative flex h-screen w-screen select-none overflow-hidden overscroll-none bg-slate-900/75 {!$windowMaximized &&
    'rounded-md'}"
>
  <AppBar />
  <div class="w-72 h-full">
    <AppSideBar />
  </div>
  <div class="flex h-full w-[calc(100%_-_18rem)] pt-[3rem]">
    <ScrollView
      element="div"
      options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-light' } }}
    >
      <slot />
    </ScrollView>
  </div>
</main>
